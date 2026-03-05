/**
 * (onboarding)/catq.tsx — S05: CAT-Q (Camouflaging Autistic Traits Questionnaire)
 *
 * 25 preguntas sobre enmascaramiento, compensación y asimilación.
 * Escala Likert 1-7.
 *
 * Subescalas:
 * - Compensación (12 ítems): estrategias activas para ocultar dificultades
 * - Enmascaramiento (4 ítems): suprimir características autistas
 * - Asimilación (9 ítems): copiar comportamientos para encajar
 *
 * Al completar: guarda catq_total_score + catq_subscores en profiles.
 *
 * Fuente: Hull et al. (2019). DOI: 10.1007/s10803-018-3792-6
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

// Escala Likert 1-7
const CATQ_OPTIONS: TestOption[] = [
  { label: "Totalmente en desacuerdo", value: 1 },
  { label: "Bastante en desacuerdo", value: 2 },
  { label: "Ligeramente en desacuerdo", value: 3 },
  { label: "Ni de acuerdo ni en desacuerdo", value: 4 },
  { label: "Ligeramente de acuerdo", value: 5 },
  { label: "Bastante de acuerdo", value: 6 },
  { label: "Totalmente de acuerdo", value: 7 },
];

// 25 preguntas del CAT-Q con subescala asignada
// Fuente: Hull et al. (2019) supplementary material
const QUESTIONS: TestQuestion[] = [
  // Compensación (12 ítems)
  { text: "Cuando estoy interactuando con alguien, deliberadamente copio sus gestos o expresiones faciales.", domain: "compensation" },
  { text: "Monitoreo mi lenguaje corporal o expresiones faciales para que parezca interesado/a en la persona con quien hablo.", domain: "compensation" },
  { text: "Uso conductas que he aprendido mirando a otros para parecer más natural en situaciones sociales.", domain: "compensation" },
  { text: "En situaciones sociales, me siento como un/a actor/actriz.", domain: "compensation" },
  { text: "Siempre pienso en la impresión que causo en otras personas.", domain: "compensation" },
  { text: "Necesito el apoyo de otras personas para socializar.", domain: "compensation" },
  { text: "Practico mis expresiones faciales y gestos para que parezcan más naturales.", domain: "compensation" },
  { text: "No necesito fingir para encajar con otras personas.", domain: "compensation" },
  { text: "Investigo las reglas del comportamiento social (p. ej., en libros, televisión o internet).", domain: "compensation" },
  { text: "Siempre tengo que obligarme a interactuar con la gente.", domain: "compensation" },
  { text: "He desarrollado una persona o personaje que uso en situaciones sociales.", domain: "compensation" },
  { text: "Cuando estoy en situaciones sociales, trato de encontrar formas de evitar interactuar con otros.", domain: "compensation" },
  // Enmascaramiento (4 ítems)
  { text: "Ajusto mi lenguaje corporal o expresiones faciales para que parezca relajado/a.", domain: "masking" },
  { text: "Me pongo una cara para las situaciones sociales.", domain: "masking" },
  { text: "Escondo mi verdadera personalidad cuando interactúo con otros.", domain: "masking" },
  { text: "Raramente me siento como yo mismo/a cuando interactúo con otros.", domain: "masking" },
  // Asimilación (9 ítems)
  { text: "Cuando estoy con otros, uso comportamientos que he aprendido de la televisión, películas o libros.", domain: "assimilation" },
  { text: "Aprendo cómo se comportan otros y copio sus acciones.", domain: "assimilation" },
  { text: "He aprendido a imitar las reacciones de otros en situaciones sociales.", domain: "assimilation" },
  { text: "Me esfuerzo por mantener una apariencia de ser socialmente competente.", domain: "assimilation" },
  { text: "En situaciones sociales, trato de seguir normas no escritas del comportamiento.", domain: "assimilation" },
  { text: "Me enseñé a mí mismo/a las habilidades sociales que tengo por observación.", domain: "assimilation" },
  { text: "Puedo darme cuenta cuando alguien está interesado o aburrido de lo que digo, y ajusto.", domain: "assimilation" },
  { text: "He aprendido a leer el lenguaje corporal de otros para poder actuar de forma más parecida a ellos.", domain: "assimilation" },
  { text: "Trato de averiguar qué esperan los demás de mí para poder actuar de manera adecuada.", domain: "assimilation" },
];

export default function CATQScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  const handleComplete = async (answerIndices: number[]) => {
    // Calcular scores por subescala
    const subscores: Record<string, number> = {
      compensation: 0,
      masking: 0,
      assimilation: 0,
    };
    let totalScore = 0;

    for (let i = 0; i < QUESTIONS.length; i++) {
      const optionIdx = answerIndices[i];
      const value = CATQ_OPTIONS[optionIdx].value;
      totalScore += value;
      const domain = QUESTIONS[i].domain;
      if (domain) subscores[domain] += value;
    }

    // Guardar en profiles
    if (supabaseUserId) {
      try {
        await supabase
          .from("profiles")
          .update({
            catq_total_score: totalScore,
            catq_subscores: subscores,
          })
          .eq("user_id", supabaseUserId);
      } catch (e) {
        console.warn("[CAT-Q] Error guardando scores:", e);
      }
    }

    router.push("/(onboarding)/raads");
  };

  return (
    <TestScreen
      title="CAT-Q — Enmascaramiento"
      questions={QUESTIONS}
      options={CATQ_OPTIONS}
      storageKey="catq-progress"
      onComplete={handleComplete}
      onSkip={() => router.push("/(onboarding)/raads")}
    />
  );
}
