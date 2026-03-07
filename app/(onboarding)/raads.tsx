/**
 * (onboarding)/raads.tsx — S06: RAADS-R (80 preguntas)
 *
 * Ritvo Autism Asperger Diagnostic Scale-Revised.
 * 80 preguntas en 4 dominios, escala 0-3.
 * Soporte de pausa obligatorio (usa TestScreen con SecureStore).
 *
 * Dominios:
 * - social_relatedness (39 ítems): reciprocidad social
 * - language (7 ítems): uso del lenguaje
 * - circumscribed_interests (14 ítems): intereses intensos
 * - sensory_motor (20 ítems): procesamiento sensorial y motor
 *
 * Score total: 0-240, umbral orientativo ≥65
 *
 * Fuente: Ritvo et al. (2011). DOI: 10.1007/s10803-010-1133-5
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

// Escala RAADS-R: 0-3
const RAADS_OPTIONS: TestOption[] = [
  { label: "Nunca es verdad", value: 0 },
  { label: "Verdad solo cuando era joven (hasta los 16), no ahora", value: 1 },
  { label: "Verdad solo ahora, no cuando era joven", value: 2 },
  { label: "Verdad ahora y cuando era joven", value: 3 },
];

// 80 preguntas del RAADS-R organizadas por dominio
// Fuente: Ritvo et al. (2011)
const QUESTIONS: TestQuestion[] = [
  // === RELACIONES SOCIALES (39 ítems) ===
  { text: "Soy un/a solitario/a empedernido/a.", domain: "social_relatedness" },
  { text: "Me resulta muy difícil jugar con otros niños.", domain: "social_relatedness" },
  { text: "Prefiero que las personas me digan exactamente qué hacer.", domain: "social_relatedness" },
  { text: "Me resulta difícil imaginar cómo se sienten otras personas.", domain: "social_relatedness" },
  { text: "A menudo no sé cómo comportarme en situaciones sociales.", domain: "social_relatedness" },
  { text: "Puedo hablar durante horas sobre mis temas favoritos, incluso cuando los demás parecen aburridos.", domain: "social_relatedness" },
  { text: "Me resulta difícil entender las reglas del comportamiento educado.", domain: "social_relatedness" },
  { text: "Tengo un estilo propio que es diferente del de la mayoría.", domain: "social_relatedness" },
  { text: "Evito las llamadas telefónicas.", domain: "social_relatedness" },
  { text: "Me dicen que hablo de forma rara o inusual.", domain: "social_relatedness" },
  { text: "Siempre me han dicho que soy diferente.", domain: "social_relatedness" },
  { text: "Me resulta difícil entender el sarcasmo.", domain: "social_relatedness" },
  { text: "Me resulta difícil hacer amigos.", domain: "social_relatedness" },
  { text: "La gente me dice que doy demasiada información.", domain: "social_relatedness" },
  { text: "Me resulta difícil saber cuándo es mi turno para hablar en una conversación.", domain: "social_relatedness" },
  { text: "Necesito que las instrucciones sean muy claras y específicas.", domain: "social_relatedness" },
  { text: "A veces digo cosas que otros consideran groseras, sin darme cuenta.", domain: "social_relatedness" },
  { text: "Me es difícil entender las expresiones faciales de otros.", domain: "social_relatedness" },
  { text: "Me resulta difícil entender lo que la gente quiere decir cuando habla de sentimientos.", domain: "social_relatedness" },
  { text: "Prefiero comunicarme por escrito que en persona.", domain: "social_relatedness" },
  { text: "Me resulta difícil trabajar en equipo.", domain: "social_relatedness" },
  { text: "A veces no entiendo por qué la gente se ofende con algo que dije.", domain: "social_relatedness" },
  { text: "Tengo dificultad para entender las bromas.", domain: "social_relatedness" },
  { text: "A menudo me confundo en situaciones sociales.", domain: "social_relatedness" },
  { text: "Me siento más cómodo/a con animales que con personas.", domain: "social_relatedness" },
  { text: "Me resulta difícil establecer contacto visual.", domain: "social_relatedness" },
  { text: "A menudo me malinterpretan.", domain: "social_relatedness" },
  { text: "Me resulta difícil entender las señales no verbales.", domain: "social_relatedness" },
  { text: "Me dicen que hablo en un tono monótono.", domain: "social_relatedness" },
  { text: "Me resulta difícil mentir, incluso para ser cortés.", domain: "social_relatedness" },
  { text: "Necesito tiempo para procesar lo que la gente me dice antes de responder.", domain: "social_relatedness" },
  { text: "Me resulta difícil participar en conversaciones grupales.", domain: "social_relatedness" },
  { text: "No entiendo por qué la gente sigue normas sociales que me parecen sin sentido.", domain: "social_relatedness" },
  { text: "Me resulta más fácil hablar de hechos que de emociones.", domain: "social_relatedness" },
  { text: "A menudo me siento fuera de lugar en reuniones sociales.", domain: "social_relatedness" },
  { text: "Me resulta difícil despedirme en una conversación.", domain: "social_relatedness" },
  { text: "Tiendo a tomar las cosas muy literalmente.", domain: "social_relatedness" },
  { text: "Me resulta difícil entender las motivaciones de las personas.", domain: "social_relatedness" },
  { text: "Me resulta difícil pedir ayuda.", domain: "social_relatedness" },

  // === LENGUAJE (7 ítems) ===
  { text: "A veces uso palabras inusuales o en un sentido inusual.", domain: "language" },
  { text: "Me han dicho que mi forma de hablar es muy formal.", domain: "language" },
  { text: "Me resulta difícil modular el volumen de mi voz según la situación.", domain: "language" },
  { text: "Tiendo a repetir ciertas frases o expresiones.", domain: "language" },
  { text: "Me resulta difícil seguir instrucciones verbales complejas.", domain: "language" },
  { text: "A veces mezclo los pronombres (confundo 'tú' y 'yo').", domain: "language" },
  { text: "Me resulta más fácil entender lo que leo que lo que escucho.", domain: "language" },

  // === INTERESES CIRCUNSCRITOS (14 ítems) ===
  { text: "Tengo intereses intensos y muy específicos que absorben mi atención.", domain: "circumscribed_interests" },
  { text: "Puedo pasar horas investigando o leyendo sobre mis temas de interés.", domain: "circumscribed_interests" },
  { text: "Me molesta mucho cuando me interrumpen mientras estoy enfocado/a en algo.", domain: "circumscribed_interests" },
  { text: "Me resulta difícil cambiar de una actividad a otra.", domain: "circumscribed_interests" },
  { text: "Tengo rutinas fijas que me ayudan a funcionar día a día.", domain: "circumscribed_interests" },
  { text: "Me estreso mucho cuando mis planes cambian inesperadamente.", domain: "circumscribed_interests" },
  { text: "Colecciono objetos o información sobre temas específicos.", domain: "circumscribed_interests" },
  { text: "Necesito que las cosas estén organizadas de cierta manera.", domain: "circumscribed_interests" },
  { text: "Repito ciertos movimientos o acciones sin darme cuenta.", domain: "circumscribed_interests" },
  { text: "Me obsesiono con ciertos pensamientos o temas.", domain: "circumscribed_interests" },
  { text: "Me gusta alinear o ordenar objetos.", domain: "circumscribed_interests" },
  { text: "Me cuesta dejar una tarea sin terminar.", domain: "circumscribed_interests" },
  { text: "Tengo rituales que debo seguir, o me siento muy incómodo/a.", domain: "circumscribed_interests" },
  { text: "Me resulta difícil ser flexible con mis planes.", domain: "circumscribed_interests" },

  // === MOTOR SENSORIAL (20 ítems) ===
  { text: "Soy muy sensible a los sonidos fuertes.", domain: "sensory_motor" },
  { text: "Ciertas texturas de ropa me resultan insoportables.", domain: "sensory_motor" },
  { text: "Las luces brillantes me molestan más que a la mayoría.", domain: "sensory_motor" },
  { text: "Me resultan molestos ciertos olores que otros no notan.", domain: "sensory_motor" },
  { text: "Me cuesta tolerar que me toquen de maneras inesperadas.", domain: "sensory_motor" },
  { text: "A veces muevo las manos o los dedos de forma repetitiva.", domain: "sensory_motor" },
  { text: "Me balanceo cuando estoy sentado/a.", domain: "sensory_motor" },
  { text: "Soy torpe o poco coordinado/a en mis movimientos.", domain: "sensory_motor" },
  { text: "Me distraigo fácilmente con ruidos de fondo.", domain: "sensory_motor" },
  { text: "Me cuesta procesar mucha información sensorial a la vez.", domain: "sensory_motor" },
  { text: "Ciertas comidas me resultan intolerables por su textura.", domain: "sensory_motor" },
  { text: "Me incomoda la ropa ajustada o con etiquetas.", domain: "sensory_motor" },
  { text: "Busco estimulación sensorial (presión profunda, texturas, etc.).", domain: "sensory_motor" },
  { text: "Me sobresalto fácilmente con ruidos inesperados.", domain: "sensory_motor" },
  { text: "A veces hago sonidos o vocalizaciones sin darme cuenta.", domain: "sensory_motor" },
  { text: "Me resulta difícil mantener el equilibrio en ciertas situaciones.", domain: "sensory_motor" },
  { text: "Tengo una tolerancia al dolor diferente a la de la mayoría.", domain: "sensory_motor" },
  { text: "Me abruman los centros comerciales u otros lugares concurridos.", domain: "sensory_motor" },
  { text: "Tengo dificultad con la motricidad fina (escribir, abotonarse, etc.).", domain: "sensory_motor" },
  { text: "A veces necesito presionar mis manos o cuerpo contra algo para calmarme.", domain: "sensory_motor" },
];

export default function RAADSScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  const handleComplete = async (answerIndices: number[]) => {
    // Calcular scores por dominio
    const domainScores: Record<string, number> = {
      social_relatedness: 0,
      language: 0,
      circumscribed_interests: 0,
      sensory_motor: 0,
    };
    let totalScore = 0;

    for (let i = 0; i < QUESTIONS.length; i++) {
      const value = RAADS_OPTIONS[answerIndices[i]].value;
      totalScore += value;
      const domain = QUESTIONS[i].domain;
      if (domain) domainScores[domain] += value;
    }

    // B-50 FIX: upsert en vez de update — si la fila no existe, crea el registro.
    if (supabaseUserId) {
      try {
        await supabase
          .from("profiles")
          .upsert(
            {
              user_id: supabaseUserId,
              raads_total_score: totalScore,
              raads_domain_scores: domainScores,
              raads_completed_at: new Date().toISOString(),
            },
            { onConflict: "user_id" }
          );
      } catch (e) {
        console.warn("[RAADS-R] Error guardando scores:", e);
      }
    }

    router.push("/(onboarding)/profile");
  };

  return (
    <TestScreen
      title="RAADS-R — Evaluación completa"
      questions={QUESTIONS}
      options={RAADS_OPTIONS}
      storageKey="raads-progress"
      onComplete={handleComplete}
      onSkip={() => router.push("/(onboarding)/profile")}
    />
  );
}
