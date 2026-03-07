/**
 * (onboarding)/aq-full.tsx — S04: AQ Completo (50 preguntas)
 *
 * Test Autism Quotient completo con 50 preguntas en 5 dominios.
 * Usa el componente TestScreen reutilizable.
 *
 * Scoring direccional (Baron-Cohen 2001):
 * - Cada pregunta tiene `scoreOnAgree`: indica si puntúa cuando
 *   el usuario responde "de acuerdo" (true) o "en desacuerdo" (false)
 * - Las opciones "Totalmente de acuerdo" y "Ligeramente de acuerdo"
 *   ambas cuentan como "de acuerdo" (value=1 en ambas)
 * - Score total: 0–50, umbral orientativo ≥32
 *
 * Al completar: guarda aq_full_score + aq_full_domain_scores en profiles.
 *
 * Fuente: Baron-Cohen et al. (2001). The Autism-Spectrum Quotient (AQ).
 */
import React from "react";
import { useRouter } from "expo-router";
import {
  TestScreen,
  TestQuestion,
  TestOption,
} from "@/components/onboarding/TestScreen";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

// Escala AQ: 4 opciones, las dos "de acuerdo" tienen value=1
// IMPORTANTE: comparar selección por ÍNDICE (idx 0,1 = agree, idx 2,3 = disagree)
const AQ_OPTIONS: TestOption[] = [
  { label: "Totalmente de acuerdo", value: 1 },
  { label: "Ligeramente de acuerdo", value: 1 },
  { label: "Ligeramente en desacuerdo", value: 0 },
  { label: "Totalmente en desacuerdo", value: 0 },
];

/**
 * Las 50 preguntas del AQ con dominio y dirección de scoring.
 *
 * Dominios (10 preguntas cada uno):
 * - social: Habilidades sociales
 * - attention_switching: Cambio de atención
 * - attention_detail: Atención al detalle
 * - communication: Comunicación
 * - imagination: Imaginación
 *
 * scoreOnAgree:
 * - true = puntúa 1 cuando responde "de acuerdo" (idx 0 o 1)
 * - false = puntúa 1 cuando responde "en desacuerdo" (idx 2 o 3)
 */
const QUESTIONS: TestQuestion[] = [
  // 1-10
  { text: "Prefiero hacer las cosas con otras personas que solo/a.", scoreOnAgree: false, domain: "social" },
  { text: "Prefiero hacer las cosas de la misma manera una y otra vez.", scoreOnAgree: true, domain: "attention_switching" },
  { text: "Si intento imaginar algo, me resulta muy fácil crear una imagen en mi mente.", scoreOnAgree: false, domain: "imagination" },
  { text: "Con frecuencia me quedo tan absorto/a en una cosa que pierdo de vista otras cosas.", scoreOnAgree: true, domain: "attention_switching" },
  { text: "A menudo noto pequeños sonidos que otros no escuchan.", scoreOnAgree: true, domain: "attention_detail" },
  { text: "Generalmente noto las placas de los coches u otras cadenas de información similares.", scoreOnAgree: true, domain: "attention_detail" },
  { text: "Otras personas me dicen con frecuencia que lo que he dicho es descortés, aunque yo piense que es cortés.", scoreOnAgree: true, domain: "communication" },
  { text: "Cuando estoy leyendo un relato, me resulta fácil imaginar cómo podrían ser los personajes.", scoreOnAgree: false, domain: "imagination" },
  { text: "Me fascinan las fechas.", scoreOnAgree: true, domain: "attention_detail" },
  { text: "En un grupo social, puedo seguir fácilmente las conversaciones de varias personas diferentes.", scoreOnAgree: false, domain: "communication" },
  // 11-20
  { text: "Me resultan fáciles las situaciones sociales.", scoreOnAgree: false, domain: "social" },
  { text: "Tiendo a notar detalles que otros no notan.", scoreOnAgree: true, domain: "attention_detail" },
  { text: "Preferiría ir a una biblioteca que a una fiesta.", scoreOnAgree: true, domain: "social" },
  { text: "Me resulta fácil inventar historias.", scoreOnAgree: false, domain: "imagination" },
  { text: "Me siento más atraído/a por las personas que por las cosas.", scoreOnAgree: false, domain: "social" },
  { text: "Tiendo a tener intereses muy fuertes, y me molesto si no puedo dedicarme a ellos.", scoreOnAgree: true, domain: "attention_switching" },
  { text: "Disfruto de la charla social.", scoreOnAgree: false, domain: "communication" },
  { text: "Cuando hablo, no siempre es fácil para otros meter palabra.", scoreOnAgree: true, domain: "communication" },
  { text: "Me fascinan los números.", scoreOnAgree: true, domain: "attention_detail" },
  { text: "Cuando estoy leyendo un relato, me resulta difícil determinar las intenciones de los personajes.", scoreOnAgree: true, domain: "imagination" },
  // 21-30
  { text: "No me gusta especialmente leer ficción.", scoreOnAgree: true, domain: "imagination" },
  { text: "Me resulta difícil hacer nuevos amigos.", scoreOnAgree: true, domain: "social" },
  { text: "Noto continuamente patrones en las cosas.", scoreOnAgree: true, domain: "attention_detail" },
  { text: "Preferiría ir al teatro que a un museo.", scoreOnAgree: false, domain: "imagination" },
  { text: "No me molesta si mi rutina diaria se ve alterada.", scoreOnAgree: false, domain: "attention_switching" },
  { text: "Con frecuencia me doy cuenta de que no sé cómo mantener una conversación.", scoreOnAgree: true, domain: "communication" },
  { text: "Me resulta fácil 'leer entre líneas' cuando alguien me está hablando.", scoreOnAgree: false, domain: "communication" },
  { text: "Generalmente me concentro más en el todo que en los pequeños detalles.", scoreOnAgree: false, domain: "attention_detail" },
  { text: "No soy muy bueno/a recordando números de teléfono.", scoreOnAgree: false, domain: "attention_detail" },
  { text: "Generalmente no noto pequeños cambios en una situación o en la apariencia de una persona.", scoreOnAgree: false, domain: "attention_detail" },
  // 31-40
  { text: "Sé cómo saber si alguien que me escucha se está aburriendo.", scoreOnAgree: false, domain: "communication" },
  { text: "Me resulta fácil hacer más de una cosa a la vez.", scoreOnAgree: false, domain: "attention_switching" },
  { text: "Cuando hablo por teléfono, no estoy seguro/a de cuándo es mi turno para hablar.", scoreOnAgree: true, domain: "communication" },
  { text: "Disfruto haciendo cosas de manera espontánea.", scoreOnAgree: false, domain: "attention_switching" },
  { text: "A menudo soy el/la última persona en entender un chiste.", scoreOnAgree: true, domain: "imagination" },
  { text: "Me resulta fácil deducir lo que una persona está pensando o sintiendo con solo mirar su cara.", scoreOnAgree: false, domain: "social" },
  { text: "Si hay una interrupción, puedo volver a lo que estaba haciendo muy rápidamente.", scoreOnAgree: false, domain: "attention_switching" },
  { text: "Soy bueno/a en la charla social.", scoreOnAgree: false, domain: "communication" },
  { text: "La gente me dice a menudo que sigo hablando del mismo tema una y otra vez.", scoreOnAgree: true, domain: "communication" },
  { text: "Cuando era joven, solía disfrutar jugando a juegos de simulación con otros niños.", scoreOnAgree: false, domain: "imagination" },
  // 41-50
  { text: "Me gusta coleccionar información sobre categorías de cosas (tipos de coches, pájaros, trenes, plantas, etc.).", scoreOnAgree: true, domain: "attention_detail" },
  { text: "Me resulta difícil imaginarme cómo sería ser otra persona.", scoreOnAgree: true, domain: "imagination" },
  { text: "Me gusta planificar cuidadosamente cualquier actividad en la que participo.", scoreOnAgree: true, domain: "attention_switching" },
  { text: "Disfruto de los eventos sociales.", scoreOnAgree: false, domain: "social" },
  { text: "Me resulta difícil determinar las intenciones de la gente.", scoreOnAgree: true, domain: "social" },
  { text: "Las situaciones nuevas me producen ansiedad.", scoreOnAgree: true, domain: "social" },
  { text: "Disfruto conociendo gente nueva.", scoreOnAgree: false, domain: "social" },
  { text: "Soy un/a buen/a diplomático/a.", scoreOnAgree: false, domain: "imagination" },
  { text: "No soy muy bueno/a recordando las caras de las personas.", scoreOnAgree: true, domain: "social" },
  { text: "Soy muy bueno/a en juegos que implican pensar con números o palabras.", scoreOnAgree: true, domain: "attention_switching" },
];

export default function AQFullScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  /** Calcular scores y guardar en Supabase */
  const handleComplete = async (answerIndices: number[]) => {
    // Calcular score total y por dominio
    const domainScores: Record<string, number> = {
      social: 0,
      attention_switching: 0,
      attention_detail: 0,
      communication: 0,
      imagination: 0,
    };
    let totalScore = 0;

    for (let i = 0; i < QUESTIONS.length; i++) {
      const q = QUESTIONS[i];
      const selectedIdx = answerIndices[i];
      // Índices 0,1 = "de acuerdo", índices 2,3 = "en desacuerdo"
      const isAgree = selectedIdx <= 1;
      const scored =
        (q.scoreOnAgree && isAgree) || (!q.scoreOnAgree && !isAgree);

      if (scored) {
        totalScore++;
        if (q.domain) domainScores[q.domain]++;
      }
    }

    // B-50 FIX: upsert en vez de update — si la fila no existe (sync-privy-user falló),
    // update hacía 0 rows affected silenciosamente. upsert crea la fila si es necesario.
    if (supabaseUserId) {
      try {
        await supabase
          .from("profiles")
          .upsert(
            {
              user_id: supabaseUserId,
              aq_full_score: totalScore,
              aq_full_domain_scores: domainScores,
              aq_full_completed_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
      } catch (e) {
        console.warn("[AQ-Full] Error guardando scores:", e);
      }
    }

    // Navegar al siguiente test
    router.push("/(onboarding)/catq");
  };

  return (
    <TestScreen
      title="AQ Completo"
      questions={QUESTIONS}
      options={AQ_OPTIONS}
      storageKey="aq-full-progress"
      onComplete={handleComplete}
      onSkip={() => router.push("/(onboarding)/catq")}
    />
  );
}
