/**
 * (onboarding)/aq10.tsx — S02: Test AQ-10 (Autism Quotient-10)
 *
 * 10 preguntas oficiales del AQ-10 (versión adultos), una por pantalla.
 * Escala: 4 opciones (Totalmente de acuerdo → Totalmente en desacuerdo).
 *
 * Scoring: cada pregunta tiene un `scoreOnAgree` que indica si puntúa
 * cuando el usuario está "de acuerdo" (true) o "en desacuerdo" (false).
 * Esto es clave porque algunas preguntas son inversas (ej: pregunta 2).
 *
 * Al completar: calcula score total y navega a aq10-result con el score.
 *
 * No hay botón "atrás" entre preguntas (para evitar over-thinking, per plan).
 *
 * Fuente: Allison, C., Auyeung, B., & Baron-Cohen, S. (2012). AQ-10.
 */
import React, { useState } from "react";
import { View } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";

/** Definición de cada pregunta AQ-10 con dirección de scoring */
interface AQ10Question {
  text: string;
  /** true = puntúa cuando responde "de acuerdo", false = puntúa "en desacuerdo" */
  scoreOnAgree: boolean;
}

// Las 10 preguntas oficiales del AQ-10 (PRD Apéndice A)
const QUESTIONS: AQ10Question[] = [
  { text: "A menudo noto pequeños sonidos que otros no escuchan.", scoreOnAgree: true },
  { text: "Por lo general me concentro más en el todo que en los pequeños detalles.", scoreOnAgree: false },
  { text: "En grupos sociales, puedo seguir varias conversaciones a la vez fácilmente.", scoreOnAgree: false },
  { text: "Si algo me interrumpe, puedo volver a lo que estaba haciendo muy rápidamente.", scoreOnAgree: false },
  { text: "No me cuesta saber si alguien que está escuchándome se está aburriendo.", scoreOnAgree: false },
  { text: "Cuando estoy leyendo un relato, me resulta difícil determinar las intenciones de los personajes.", scoreOnAgree: true },
  { text: "Me gustan los eventos sociales y de reunión con varias personas.", scoreOnAgree: false },
  { text: "Cuando hablo por teléfono, no siempre estoy seguro/a de cuándo es mi turno para hablar.", scoreOnAgree: true },
  { text: "Me gustan coleccionar información sobre categorías de cosas (tipos de coches, pájaros, trenes, plantas, etc.)", scoreOnAgree: true },
  { text: "Me resulta difícil saber cómo terminar una conversación.", scoreOnAgree: true },
];

// Opciones de respuesta — el value indica si es "de acuerdo" (true) o no (false)
const OPTIONS = [
  { label: "Totalmente de acuerdo", agree: true },
  { label: "Ligeramente de acuerdo", agree: true },
  { label: "Ligeramente en desacuerdo", agree: false },
  { label: "Totalmente en desacuerdo", agree: false },
];

export default function AQ10Screen() {
  const router = useRouter();
  const [currentIndex, setCurrentIndex] = useState(0);
  // Almacena el ÍNDICE de la opción seleccionada por pregunta (no el valor)
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(QUESTIONS.length).fill(null)
  );

  const question = QUESTIONS[currentIndex];
  const selectedOptionIndex = answers[currentIndex];

  /** Seleccionar una opción */
  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  /** Avanzar a la siguiente pregunta o calcular resultado */
  const handleNext = () => {
    if (selectedOptionIndex === null) return;

    if (currentIndex < QUESTIONS.length - 1) {
      setCurrentIndex(currentIndex + 1);
    } else {
      // Calcular score total
      let score = 0;
      for (let i = 0; i < QUESTIONS.length; i++) {
        const answerIdx = answers[i];
        if (answerIdx === null) continue;
        const option = OPTIONS[answerIdx];
        const q = QUESTIONS[i];
        // Puntúa 1 si la respuesta coincide con la dirección de scoring
        if (q.scoreOnAgree && option.agree) score++;
        if (!q.scoreOnAgree && !option.agree) score++;
      }

      router.push({
        pathname: "/(onboarding)/aq10-result",
        params: { score: score.toString() },
      });
    }
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pt-6 pb-8">
        {/* Progreso */}
        <Typography
          variant="caption"
          className="text-script-text-secondary dark:text-script-dark-text-secondary mb-2"
        >
          Pregunta {currentIndex + 1} de {QUESTIONS.length}
        </Typography>

        {/* Barra de progreso visual */}
        <View className="h-2 bg-script-surface dark:bg-script-dark-surface rounded-full mb-6">
          <View
            className="h-2 bg-script-blue dark:bg-script-dark-blue rounded-full"
            style={{
              width: `${((currentIndex + 1) / QUESTIONS.length) * 100}%`,
            }}
          />
        </View>

        {/* Pregunta */}
        <Typography variant="headingM" className="mb-8">
          {question.text}
        </Typography>

        {/* Opciones */}
        <View className="gap-3">
          {OPTIONS.map((option, idx) => (
            <Card
              key={idx}
              variant={selectedOptionIndex === idx ? "elevated" : "default"}
              onPress={() => handleSelect(idx)}
              accessibilityRole="radio"
              accessibilityState={{ selected: selectedOptionIndex === idx }}
            >
              <Typography variant="body">{option.label}</Typography>
            </Card>
          ))}
        </View>

        <View className="flex-1" />

        {/* Siguiente */}
        <Button
          title={
            currentIndex < QUESTIONS.length - 1
              ? "Siguiente →"
              : "Ver resultado"
          }
          onPress={handleNext}
          variant="primary"
          disabled={selectedOptionIndex === null}
        />
      </View>
    </SafeScreen>
  );
}
