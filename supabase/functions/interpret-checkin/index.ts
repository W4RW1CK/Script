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
 *
 * Seguridad:
 *   - OPENAI_API_KEY solo existe en el entorno de Supabase Edge Functions
 *   - NUNCA se expone al cliente (cumple TECH_STACK.md §seguridad)
 *   - La función requiere auth header de Supabase (anon key es suficiente)
 *
 * Crisis:
 *   - Si los zones/notes sugieren nivel de crisis 3, se activa
 *     send-crisis-notification (implementado en Fase 1.7)
 *   - Por ahora, el nivel de crisis es calculado en el cliente (S17)
 *
 * Lenguaje de respuesta (OBLIGATORIO — BACKEND_STRUCTURE.md §5):
 *   ✅ "¿Podría ser...?", "Algunas personas describen..."
 *   ❌ "Tú sientes", "Esto es", "Claramente"
 *   - Siempre en español
 *   - Tono tentativo, nunca diagnóstico
 *
 * Deno runtime — imports desde CDN de Deno (no npm)
 */

// Deno std server — requerido por Supabase Edge Functions
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

// OpenAI SDK para Deno
import OpenAI from "https://deno.land/x/openai@v4.24.1/mod.ts";

// ── CORS headers ───────────────────────────────────────────────────────────
// Necesarios para que el cliente (React Native) pueda llamar la función
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

// ── System Prompt ──────────────────────────────────────────────────────────
// Define el rol y las reglas estrictas de lenguaje del asistente
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

// ── Tipos ──────────────────────────────────────────────────────────────────
type EmotionOption = {
  label: string;
  description: string;
  confidence: "alta" | "media" | "baja";
};

type ResponseBody = {
  options: EmotionOption[];
};

// ── Handler principal ──────────────────────────────────────────────────────
serve(async (req: Request) => {
  // Responder a CORS preflight (OPTIONS)
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    // Parsear body de la request
    const { zones, notes } = await req.json() as {
      zones: string[];
      notes: string;
    };

    // Validación básica
    if (!Array.isArray(zones)) {
      return new Response(
        JSON.stringify({ error: "zones debe ser un array" }),
        { headers: { ...corsHeaders, "Content-Type": "application/json" }, status: 400 }
      );
    }

    // Inicializar cliente de OpenAI con la API key del entorno Supabase
    // IMPORTANTE: OPENAI_API_KEY NUNCA llega al cliente — solo está aquí
    const openai = new OpenAI({
      apiKey: Deno.env.get("OPENAI_API_KEY")!,
    });

    // Construir el mensaje del usuario con los datos del check-in
    const userMessage = [
      `Zonas corporales donde el usuario siente algo: ${zones.length > 0 ? zones.join(", ") : "(ninguna especificada)"}`,
      `Descripción libre del usuario: "${notes?.trim() || "(sin descripción)"}"`,
    ].join("\n");

    // Llamar a GPT-4o-mini con el system prompt estricto
    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",       // Más económico y rápido que gpt-4o
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        { role: "user",   content: userMessage   },
      ],
      temperature: 0.7,           // Algo de variedad sin ser errático
      max_tokens: 600,
      response_format: { type: "json_object" }, // Fuerza JSON válido
    });

    // Extraer y parsear la respuesta
    const content = completion.choices[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(content) as ResponseBody;

    // Validar que el formato es correcto
    if (!Array.isArray(parsed.options)) {
      throw new Error("Formato de respuesta inesperado de OpenAI");
    }

    // Devolver las opciones al cliente
    return new Response(JSON.stringify(parsed), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
      status: 200,
    });

  } catch (error) {
    // Log del error en Supabase Edge Function logs
    console.error("[interpret-checkin] Error:", error);

    return new Response(
      JSON.stringify({
        error: "Error interno al interpretar el check-in",
      }),
      {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
        status: 500,
      }
    );
  }
});
