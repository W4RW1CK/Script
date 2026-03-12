/**
 * components/onboarding/TestScreen.tsx — Componente reutilizable para tests psicométricos
 *
 * Usado por: AQ-Full (50q), CAT-Q (25q), RAADS-R (80q)
 *
 * Features:
 * - Navegación pregunta por pregunta con barra de progreso
 * - Selección por ÍNDICE del array (no por value numérico)
 *   ¿Por qué? El AQ-Full tiene dos opciones con value=1 ("Totalmente de acuerdo"
 *   y "Ligeramente de acuerdo" ambas puntúan 1). Comparar por value causa bugs
 *   donde seleccionar una opción selecciona ambas. Comparar por índice es único.
 * - Botón "Pausar y continuar después" con persistencia en SecureStore
 * - Botón "Omitir" siempre visible
 * - Sin botón "atrás" (evitar over-thinking)
 */
import React, { useState, useEffect, useCallback } from "react";
import { View, ScrollView, Alert } from "react-native";
import * as SecureStore from "expo-secure-store";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";

/** Una opción de respuesta */
export interface TestOption {
  label: string;
  /** Valor numérico de esta opción (para scoring) */
  value: number;
}

/** Una pregunta del test */
export interface TestQuestion {
  /** Texto de la pregunta */
  text: string;
  /**
   * scoreOnAgree — solo para tests tipo AQ donde el scoring es direccional.
   * true = puntúa cuando el usuario responde "de acuerdo"
   * false = puntúa cuando responde "en desacuerdo"
   * undefined = usar el value directo de la opción (CAT-Q, RAADS-R)
   */
  scoreOnAgree?: boolean;
  /** Dominio al que pertenece esta pregunta (para scores por dominio) */
  domain?: string;
}

interface TestScreenProps {
  /** Título del test (se muestra arriba) */
  title: string;
  /** Array de preguntas */
  questions: TestQuestion[];
  /** Opciones de respuesta (mismas para todas las preguntas) */
  options: TestOption[];
  /** Clave para persistir progreso en SecureStore */
  storageKey: string;
  /** Callback cuando el test se completa — recibe las respuestas (índices de opciones) */
  onComplete: (answers: number[]) => void;
  /** Callback cuando el usuario elige "Omitir" */
  onSkip: () => void;
}

export function TestScreen({
  title,
  questions,
  options,
  storageKey,
  onComplete,
  onSkip,
}: TestScreenProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  // Almacena el ÍNDICE de la opción seleccionada (no el value)
  const [answers, setAnswers] = useState<(number | null)[]>(
    new Array(questions.length).fill(null)
  );
  const [loaded, setLoaded] = useState(false);

  // Restaurar progreso guardado al montar
  useEffect(() => {
    const restore = async () => {
      try {
        const saved = await SecureStore.getItemAsync(storageKey);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (parsed.answers && parsed.currentIndex !== undefined) {
            // Preguntar si quiere continuar
            Alert.alert(
              "Progreso guardado",
              `Completaste ${parsed.currentIndex} de ${questions.length} preguntas. ¿Continuar donde lo dejaste?`,
              [
                {
                  text: "Empezar de nuevo",
                  style: "destructive",
                  onPress: () => {
                    SecureStore.deleteItemAsync(storageKey);
                    setLoaded(true);
                  },
                },
                {
                  text: "Continuar",
                  onPress: () => {
                    setAnswers(parsed.answers);
                    setCurrentIndex(parsed.currentIndex);
                    setLoaded(true);
                  },
                },
              ]
            );
            return;
          }
        }
      } catch (e) {
        console.warn("[TestScreen] Error restaurando progreso:", e);
      }
      setLoaded(true);
    };
    restore();
  }, [storageKey, questions.length]);

  /** Guardar progreso en SecureStore */
  const saveProgress = useCallback(
    async (newAnswers: (number | null)[], newIndex: number) => {
      try {
        await SecureStore.setItemAsync(
          storageKey,
          JSON.stringify({ answers: newAnswers, currentIndex: newIndex })
        );
      } catch (e) {
        console.warn("[TestScreen] Error guardando progreso:", e);
      }
    },
    [storageKey]
  );

  /** Seleccionar una opción */
  const handleSelect = (optionIndex: number) => {
    const newAnswers = [...answers];
    newAnswers[currentIndex] = optionIndex;
    setAnswers(newAnswers);
  };

  /** Avanzar a siguiente pregunta o completar */
  const handleNext = async () => {
    if (answers[currentIndex] === null) return;

    if (currentIndex < questions.length - 1) {
      const nextIndex = currentIndex + 1;
      setCurrentIndex(nextIndex);
      await saveProgress(answers, nextIndex);
    } else {
      // Test completo — limpiar progreso guardado
      await SecureStore.deleteItemAsync(storageKey);
      // Enviar respuestas (como índices de opciones)
      onComplete(answers as number[]);
    }
  };

  /** Pausar y guardar progreso */
  const handlePause = async () => {
    await saveProgress(answers, currentIndex);
    Alert.alert(
      "Progreso guardado",
      "Puedes continuar este test más tarde desde donde lo dejaste."
    );
    onSkip();
  };

  if (!loaded) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <Typography variant="body">Cargando...</Typography>
        </View>
      </SafeScreen>
    );
  }

  const question = questions[currentIndex];
  const selectedOptionIndex = answers[currentIndex];

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8">
          {/* Título del test */}
          <Typography variant="headingS" className="mb-1">
            {title}
          </Typography>

          {/* Progreso */}
          <Typography
            variant="caption"
            className="text-script-text-secondary dark:text-script-dark-text-secondary mb-2"
          >
            Pregunta {currentIndex + 1} de {questions.length}
          </Typography>

          {/* Barra de progreso */}
          <View className="h-2 bg-script-bg-secondary dark:bg-script-dark-secondary rounded-full mb-6">
            <View
              className="h-2 bg-script-blue dark:bg-script-dark-blue rounded-full"
              style={{
                width: `${((currentIndex + 1) / questions.length) * 100}%`,
              }}
            />
          </View>

          {/* Pregunta */}
          <Typography variant="headingM" className="mb-6">
            {question.text}
          </Typography>

          {/* Opciones — comparar por ÍNDICE, no por value */}
          <View className="gap-3">
            {options.map((option, idx) => (
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

          {/* Acciones */}
          <View className="gap-3 mt-6">
            <Button
              title={
                currentIndex < questions.length - 1
                  ? "Siguiente →"
                  : "Completar test"
              }
              onPress={handleNext}
              variant="primary"
              disabled={selectedOptionIndex === null}
            />
            <Button
              title="Pausar y continuar después"
              variant="ghost"
              onPress={handlePause}
            />
            {/* H-NEW-02: save partial progress before skipping — prevents losing answered questions */}
            <Button
              title="Omitir test"
              variant="ghost"
              onPress={async () => {
                if (currentIndex > 0) await saveProgress(answers, currentIndex);
                onSkip();
              }}
            />
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
