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

/**
 * Estado del fetch de opciones de emoción.
 * T-U2: distinguir "ai" vs "mock" vs "error" para mostrar feedback correcto.
 */
type FetchSource = "ai" | "mock" | "error";

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
 * Resultado del fetch de opciones de emoción.
 * T-U2: devuelve la fuente para que el componente muestre feedback correcto.
 * T-C2: incluye crisis_flag para escalar a flujo de rescate si aplica.
 */
type FetchResult = {
  options: EmotionOption[];
  source: FetchSource;
  crisis_flag: boolean;
};

/**
 * Llama a la Edge Function interpret-checkin con fallback a mock.
 * T-U2: siempre indica la fuente real (ai/mock/error) — no falla silenciosamente.
 * T-C2: propaga crisis_flag si la Edge Function lo detectó.
 */
async function fetchEmotionOptions(
  zones: ZoneId[],
  notes: string
): Promise<FetchResult> {
  try {
    const { data, error } = await supabase.functions.invoke(
      "interpret-checkin",
      { body: { zones, notes } }
    );

    if (error) {
      console.warn("[Reflect] Edge Function error, usando mock:", error.message);
      return { options: getMockOptions(zones, notes), source: "mock", crisis_flag: false };
    }

    // T-C2: si crisis_flag = true y no hay opciones, redirigir a rescate
    if (data?.crisis_flag === true && (!data.options || data.options.length === 0)) {
      return { options: [], source: "ai", crisis_flag: true };
    }

    // Validar formato de respuesta
    if (data?.options && Array.isArray(data.options) && data.options.length > 0) {
      return {
        options: data.options,
        source: data.source === "ai" ? "ai" : "mock",
        crisis_flag: data.crisis_flag === true,
      };
    }

    console.warn("[Reflect] Formato inesperado, usando mock");
    return { options: getMockOptions(zones, notes), source: "mock", crisis_flag: false };

  } catch (e) {
    console.warn("[Reflect] Error de red:", e);
    // T-U2: "error" indica fallo real de red — no falla silenciosamente
    return { options: getMockOptions(zones, notes), source: "error", crisis_flag: false };
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
  // T-U2: fuente de la respuesta para feedback visible al usuario
  const [fetchSource, setFetchSource] = useState<FetchSource>("ai");

  const confirmedEmotion = showCustomInput ? customEmotion.trim() : selected;

  // Llamar a Edge Function (con fallback a mock) al montar
  useEffect(() => {
    const zones = (zonesParam?.split(",").filter(Boolean) ?? []) as ZoneId[];
    const notes = notesParam ?? "";

    fetchEmotionOptions(zones, notes).then((result) => {
      // T-C2: si hay crisis_flag, redirigir al flujo de rescate inmediatamente
      if (result.crisis_flag) {
        router.replace("/(app)/rescue/assess");
        return;
      }
      setOptions(result.options);
      setFetchSource(result.source);
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

          {/* T-U2: feedback visible cuando la respuesta es aproximada o falló */}
          {fetchSource === "mock" && (
            <View className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-700 rounded-xl px-4 py-3">
              <Typography
                variant="caption"
                className="text-yellow-800 dark:text-yellow-200"
              >
                💡 Estas opciones son aproximadas — la interpretación personalizada no está disponible en este momento.
              </Typography>
            </View>
          )}
          {fetchSource === "error" && (
            <View className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-700 rounded-xl px-4 py-3">
              <Typography
                variant="caption"
                className="text-red-800 dark:text-red-200"
              >
                ⚠️ No se pudo conectar al servicio de interpretación. Las opciones que ves son generales, no personalizadas para tu check-in de hoy.
              </Typography>
            </View>
          )}

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
