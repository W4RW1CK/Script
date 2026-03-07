/**
 * interpret-checkin — Supabase Edge Function
 *
 * Recibe las zonas corporales y la descripción libre del usuario,
 * y devuelve 3-5 opciones de emoción generadas por GPT-4o-mini.
 *
 * Endpoint: POST /functions/v1/interpret-checkin
 *
 * Body (JSON):
 *   zones: string[]   — ZoneIds seleccionados (ej: ["head", "chest"])
 *   notes: string     — descripción libre del usuario (puede ser "")
 *
 * Respuesta (JSON):
 *   options: EmotionOption[]  — array de 3-5 opciones ordenadas por confianza
 *   crisis_flag: boolean      — true si algún label/descripción contiene señales de alerta
 *   source: "ai" | "mock"     — T-U2: indica al cliente si la respuesta es real o fallback
 *
 * Seguridad:
 *   - OPENAI_API_KEY solo existe en el entorno de Supabase Edge Functions
 *   - NUNCA se expone al cliente (cumple TECH_STACK.md §seguridad)
 *
 * Safety filter (T-C2):
 *   - Post-procesa el output de GPT antes de enviarlo al cliente
 *   - Si algún label/descripción contiene términos de alerta (desesperanza,
 *     vacío, no querer estar, etc.) → crisis_flag = true
 *   - La app puede escalar a flujo de rescate cuando crisis_flag = true
 *   - Fundamento: Cassidy et al. (2018) — 66% adultos ASD reportan ideación suicida
 *
 * Lenguaje de respuesta (OBLIGATORIO — BACKEND_STRUCTURE.md §5):
 *   ✅ "¿Podría ser...?", "Algunas personas describen..."
 *   ❌ "Tú sientes", "Esto es", "Claramente"
 *
 * Deno runtime — imports desde CDN de Deno (no npm)
 */

import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";

// ── CORS headers ────────────────────────────────────────────────────────────
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── System Prompt ───────────────────────────────────────────────────────────
const SYSTEM_PROMPT = `Eres un asistente especializado en apoyar a personas con TEA Nivel 1
a identificar y nombrar sus experiencias emocionales y sensoriales.

Tu rol es proponer posibilidades, NO diagnosticar ni afirmar.

REGLAS DE LENGUAJE (obligatorio en cada opción):
- USA: "¿Podría ser...?", "Algunas personas describen esto como...", "Quizás...", "A veces..."
- NUNCA uses: "Tú sientes", "Esto es", "Claramente", "Definitivamente", "Debes sentir"
- Tono: cálido, curioso, sin juicio, exploratorio
- Idioma: siempre español

FORMATO DE RESPUESTA (JSON estricto, sin texto extra):
{
  "options": [
    {
      "label": "Nombre breve de la emoción/estado (ej: Ansiedad, Cansancio)",
      "description": "Frase exploratoria de 1-2 oraciones en lenguaje tentativo",
      "confidence": "alta" | "media" | "baja"
    }
  ]
}

Devuelve entre 3 y 5 opciones, ordenadas de mayor a menor confianza.
La última opción SIEMPRE debe ser "Algo que aún no tiene nombre" o similar,
para validar que las experiencias no siempre encajan en categorías.`;

// ── Tipos ───────────────────────────────────────────────────────────────────
type EmotionOption = {
  label: string;
  description: string;
  confidence: "alta" | "media" | "baja";
};

type ResponseBody = {
  options: EmotionOption[];
  crisis_flag: boolean;
  source: "ai" | "mock";
};

// ── Safety filter (T-C2) ────────────────────────────────────────────────────
/**
 * Términos de alerta en español que indican posible ideación suicida o
 * crisis severa. Se revisan en labels Y descripciones del output de GPT.
 *
 * Fundamento clínico:
 * - Cassidy et al. (2018): 66% adultos ASD reportan ideación suicida lifetime
 * - Hirvikoski et al. (2016): mortalidad suicidio 9x mayor en ASD vs población general
 * - La detección temprana en el lenguaje es la intervención más efectiva
 *
 * Nota: los términos son intencionalmente amplios (mejor un falso positivo
 * que omitir una señal real). La app decide qué hacer con crisis_flag.
 */
const CRISIS_TERMS = [
  // Ideación directa
  "no quiero estar",
  "no quiero vivir",
  "no querer estar",
  "no querer vivir",
  "quiero desaparecer",
  "querer desaparecer",
  "hacerme daño",
  "hacerse daño",
  "hacerme lastimar",
  "ideación",
  "suicid",
  // Estados de alerta clínica
  "desesperanza",
  "desesperado",
  "sin esperanza",
  "vacío existencial",
  "nada importa",
  "todo es inútil",
  "no hay salida",
  "sin salida",
  "carga para",
  "mejor sin mí",
  "mejor sin mi",
  // Disociación severa
  "no soy real",
  "no existo",
  "desvanecerme",
];

/**
 * Revisa si alguna opción de emoción contiene términos de alerta.
 * Normaliza a minúsculas y sin acentos para mejorar detección.
 */
function containsCrisisSignal(options: EmotionOption[]): boolean {
  const normalize = (s: string) =>
    s.toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");

  const normalizedTerms = CRISIS_TERMS.map(normalize);

  return options.some((opt) => {
    const text = normalize(`${opt.label} ${opt.description}`);
    return normalizedTerms.some((term) => text.includes(term));
  });
}

// ── Handler principal ───────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Responder a CORS preflight
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { zones, notes } = await req.json() as {
      zones: string[];
      notes: string;
    };

    if (!Array.isArray(zones)) {
      return new Response(
        JSON.stringify({ error: "zones debe ser un array" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // También aplicar safety filter al texto libre del usuario (notes)
    // antes de enviarlo a GPT — si el usuario ya describe una crisis,
    // no tiene sentido pedirle que nombre emociones
    const notesNormalized = (notes ?? "").toLowerCase()
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "");
    const notesCrisis = CRISIS_TERMS.map(t =>
      t.normalize("NFD").replace(/[\u0300-\u036f]/g, "")
    ).some(term => notesNormalized.includes(term));

    if (notesCrisis) {
      // El usuario ya expresó señales de crisis en su descripción libre
      // Devolver crisis_flag sin llamar a GPT (innecesario y puede ser dañino)
      return new Response(
        JSON.stringify({
          options: [],
          crisis_flag: true,
          source: "ai",
          crisis_source: "notes", // debug: dónde se detectó
        } satisfies ResponseBody & { crisis_source: string }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 200 }
      );
    }

    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY")!,
    });

    const userMessage = [
      `Zonas corporales: ${zones.length > 0 ? zones.join(", ") : "(ninguna)"}`,
      `Descripción libre: "${notes?.trim() || "(sin descripción)"}"`,
    ].join("\n");

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userMessage   },
      ],
      temperature: 0.4, // TECH_STACK.md §T-2.9: lower temp = more consistent emotion labels
      max_tokens: 600,
      response_format: { type: "json_object" },
    });

    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as { options: EmotionOption[] };

    if (!Array.isArray(parsed.options)) {
      throw new Error("Formato de respuesta inesperado de OpenAI");
    }

    // T-C2: aplicar safety filter al OUTPUT de GPT
    const crisis_flag = containsCrisisSignal(parsed.options);

    const response: ResponseBody = {
      options: parsed.options,
      crisis_flag,
      source: "ai",
    };

    return new Response(JSON.stringify(response), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    console.error("[interpret-checkin] Error:", error);

    // T-U2: incluir source:"error" para que el cliente muestre feedback visible
    return new Response(
      JSON.stringify({
        error: "Error interno al interpretar el check-in",
        source: "error",
        crisis_flag: false,
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
