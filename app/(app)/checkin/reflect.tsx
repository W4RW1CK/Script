/**
 * reflect.tsx — S12: Interpretación IA (Check-in)
 *
 * Tercera pantalla del flujo de check-in. Muestra un loader breve
 * y luego presenta 3-5 opciones de emoción generadas por IA.
 *
 * Flujo: S11 (notes) → S12 → S13 (result)
 *
 * Ahora conecta a la Edge Function `interpret-checkin` de Supabase.
 * Si la Edge Function falla o no está desplegada, usa mock como fallback.
 *
 * Lenguaje de las opciones (OBLIGATORIO — ver BACKEND_STRUCTURE.md §5):
 *   ✅ "¿Podría ser...?", "Algunas personas describen esto como..."
 *   ❌ "Tú sientes", "Esto es", "Claramente"
 */
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Card, Button, TextInput } from "@/components/ui";
import { ZoneId } from "@/components/body-map/BodyMap";
import { supabase } from "@/lib/supabase";

// ── Tipos ──────────────────────────────────────────────────────────────────
type EmotionOption = {
  label: string;
  description: string;
  confidence: "alta" | "media" | "baja";
};

// ── Mock fallback ──────────────────────────────────────────────────────────
/**
 * Mock de opciones — se usa cuando la Edge Function no está disponible.
 * Simula lo que devolvería GPT-4o-mini con el system prompt de TEA.
 */
function getMockOptions(_zones: ZoneId[], _notes: string): EmotionOption[] {
  return [
    {
      label: "Ansiedad",
      description:
        "¿Podría ser una sensación de alerta o tensión anticipatoria? Algunas personas la notan en el pecho o el estómago.",
      confidence: "alta",
    },
    {
      label: "Cansancio",
      description:
        "Algunas personas describen esto como agotamiento físico o mental acumulado — el cuerpo pide un descanso.",
      confidence: "media",
    },
    {
      label: "Incomodidad",
      description:
        "¿Podría ser que el ambiente o la situación no se siente del todo cómoda? A veces el cuerpo lo registra antes que la mente.",
      confidence: "media",
    },
    {
      label: "Sobrecarga sensorial",
      description:
        "Cuando hay demasiados estímulos, el cuerpo a veces responde así. ¿Podría haber mucho ruido, luz o movimiento cerca?",
      confidence: "baja",
    },
    {
      label: "Algo que aún no tiene nombre",
      description:
        "Quizás lo que sientes no encaja exactamente en ninguna categoría, y eso es completamente válido.",
      confidence: "baja",
    },
  ];
}

/**
 * Llama a la Edge Function interpret-checkin con fallback a mock.
 * Intenta la llamada real; si falla por cualquier motivo, usa mock.
 */
async function fetchEmotionOptions(
  zones: ZoneId[],
  notes: string
): Promise<EmotionOption[]> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "interpret-checkin",
      { body: { zones, notes } }
    );

    if (error) {
      console.warn("[Reflect] Edge Function error, using mock:", error.message);
      return getMockOptions(zones, notes);
    }

    // Validar que la respuesta tiene el formato esperado
    if (data?.options && Array.isArray(data.options) && data.options.length > 0) {
      return data.options;
    }

    console.warn("[Reflect] Invalid response format, using mock");
    return getMockOptions(zones, notes);
  } catch (e) {
    console.warn("[Reflect] Network error, using mock:", e);
    return getMockOptions(zones, notes);
  }
}

// ── Componente ─────────────────────────────────────────────────────────────
export default function CheckinReflectScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const spinnerColor = isDark ? "#5A7E92" : "#A8C5DA";

  const { zones: zonesParam, notes: notesParam } = useLocalSearchParams<{
    zones: string;
    notes: string;
  }>();

  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<EmotionOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmotion, setCustomEmotion] = useState("");

  const confirmedEmotion = showCustomInput ? customEmotion.trim() : selected;

  // Llamar a Edge Function (con fallback a mock) al montar
  useEffect(() => {
    const zones = (zonesParam?.split(",").filter(Boolean) ?? []) as ZoneId[];
    const notes = notesParam ?? "";

    fetchEmotionOptions(zones, notes).then((opts) => {
      setOptions(opts);
      setIsLoading(false);
    });
  }, [zonesParam, notesParam]);

  const handleContinue = () => {
    if (!confirmedEmotion) return;
    router.push({
      pathname: "/(app)/checkin/result",
      params: {
        zones: zonesParam ?? "",
        notes: notesParam ?? "",
        emotion: confirmedEmotion,
      },
    });
  };

  // ── Estado de carga ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center gap-6 px-5">
          <ActivityIndicator size="large" color={spinnerColor} />
          <Typography
            variant="body"
            className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Conectando los puntos...
          </Typography>
        </View>
      </SafeScreen>
    );
  }

  // ── Pantalla principal ───────────────────────────────────────────────────
  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8 gap-5">
          <View className="gap-2">
            <Typography variant="headingL">
              ¿Podría ser algo de esto?
            </Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              No son diagnósticos — son posibilidades. Elige la que más resuene.
            </Typography>
          </View>

          <View className="gap-3">
            {options.map((option) => (
              <Card
                key={option.label}
                variant={selected === option.label ? "elevated" : "default"}
                onPress={() => {
                  setSelected(option.label);
                  setShowCustomInput(false);
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: selected === option.label }}
                accessibilityLabel={`${option.label}: ${option.description}`}
              >
                <Typography variant="headingS">{option.label}</Typography>
                <Typography
                  variant="caption"
                  className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
                >
                  {option.description}
                </Typography>
              </Card>
            ))}
          </View>

          {!showCustomInput ? (
            <Button
              title="Ninguna de estas"
              variant="ghost"
              onPress={() => {
                setShowCustomInput(true);
                setSelected(null);
              }}
            />
          ) : (
            <View className="gap-3">
              <Typography variant="body">¿Cómo lo llamarías tú?</Typography>
              <TextInput
                value={customEmotion}
                onChangeText={setCustomEmotion}
                placeholder="Escribe con tus propias palabras..."
                accessibilityLabel="Describe la emoción con tus propias palabras"
              />
              <Button
                title="← Ver opciones"
                variant="ghost"
                onPress={() => setShowCustomInput(false)}
              />
            </View>
          )}

          <View className="flex-1" />

          <Button
            title="Continuar →"
            onPress={handleContinue}
            variant="primary"
            disabled={!confirmedEmotion}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
