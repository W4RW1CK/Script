/**
 * reflect.tsx — S12: Interpretación IA (Check-in)
 *
 * Tercera pantalla del flujo de check-in. Muestra un loader breve
 * y luego presenta 3-5 opciones de emoción generadas por IA.
 * El usuario elige la que más resuena, o escribe la suya.
 *
 * Flujo: S11 (notes) → S12 → S13 (result)
 *
 * Recibe: `zones` + `notes` como query params.
 * Envía: `zones` + `notes` + `emotion` (elegida) a S13.
 *
 * IA:
 *   - Fase 1.5.4 (este paso): usa getMockOptions() — respuestas estáticas
 *   - Fase 1.5.6: reemplazar con llamada real a Supabase Edge Function
 *     `interpret-checkin` vía supabase.functions.invoke()
 *
 * Lenguaje de las opciones (OBLIGATORIO — ver BACKEND_STRUCTURE.md §5):
 *   ✅ "¿Podría ser...?", "Algunas personas describen esto como..."
 *   ❌ "Tú sientes", "Esto es", "Claramente"
 *
 * Crisis: si la edge function detecta nivel 3, envía notificación
 * al terapeuta (implementado en Fase 1.5.6 + 1.7).
 */
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Card, Button, TextInput } from "@/components/ui";
import { ZoneId } from "@/components/body-map/BodyMap";

// ── Tipos ──────────────────────────────────────────────────────────────────
/** Opción de emoción — espeja el schema de respuesta de interpret-checkin */
type EmotionOption = {
  label: string;        // Nombre de la emoción (e.g. "Ansiedad")
  description: string;  // Frase en lenguaje tentativo
  confidence: "alta" | "media" | "baja";
};

// ── Mock de IA (reemplazar en Fase 1.5.6) ─────────────────────────────────
/**
 * getMockOptions — genera opciones de ejemplo sin llamar a OpenAI.
 *
 * TODO (Fase 1.5.6): Reemplazar por:
 *   const { data } = await supabase.functions.invoke("interpret-checkin", {
 *     body: { zones, notes },
 *   });
 *   return data.options;
 */
function getMockOptions(zones: ZoneId[], notes: string): EmotionOption[] {
  // Respuesta estática que simula lo que devolvería GPT-4o-mini
  // ordenada de mayor a menor confianza
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

// ── Componente ─────────────────────────────────────────────────────────────
export default function CheckinReflectScreen() {
  const router = useRouter();

  // Params recibidos desde S11
  const { zones: zonesParam, notes: notesParam } = useLocalSearchParams<{
    zones: string;
    notes: string;
  }>();

  // Estado de la pantalla
  const [isLoading, setIsLoading] = useState(true);
  const [options, setOptions] = useState<EmotionOption[]>([]);
  const [selected, setSelected] = useState<string | null>(null);
  const [showCustomInput, setShowCustomInput] = useState(false);
  const [customEmotion, setCustomEmotion] = useState("");

  /** La emoción confirmada: la seleccionada o la escrita por el usuario */
  const confirmedEmotion = showCustomInput
    ? customEmotion.trim()
    : selected;

  // Simular llamada a edge function al montar (Fase 1.5.6: reemplazar)
  useEffect(() => {
    const zones = (zonesParam?.split(",").filter(Boolean) ?? []) as ZoneId[];
    const notes = notesParam ?? "";

    // TODO (Fase 1.5.6): Reemplazar este bloque por llamada real:
    // const { data, error } = await supabase.functions.invoke("interpret-checkin", { body: { zones, notes } });
    const timer = setTimeout(() => {
      setOptions(getMockOptions(zones, notes));
      setIsLoading(false);
    }, 1400); // Simula latencia de red (~1.4s)

    return () => clearTimeout(timer);
  }, [zonesParam, notesParam]);

  /** Navegar a S13 con la emoción confirmada */
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
          <ActivityIndicator
            size="large"
            // Color del spinner según tema
            color="#A8C5DA"
          />
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

          {/* ── Encabezado ───────────────────────────────────────────── */}
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

          {/* ── Opciones de emoción (tarjetas seleccionables) ────────── */}
          <View className="gap-3">
            {options.map((option) => (
              <Card
                key={option.label}
                variant={selected === option.label ? "elevated" : "default"}
                onPress={() => {
                  setSelected(option.label);  // Seleccionar esta opción
                  setShowCustomInput(false);   // Cerrar input personalizado
                }}
                accessibilityRole="button"
                accessibilityState={{ selected: selected === option.label }}
                accessibilityLabel={`${option.label}: ${option.description}`}
              >
                {/* Nombre de la emoción */}
                <Typography variant="headingS">{option.label}</Typography>
                {/* Descripción tentativa */}
                <Typography
                  variant="caption"
                  className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
                >
                  {option.description}
                </Typography>
              </Card>
            ))}
          </View>

          {/* ── "Ninguna de estas" → TextInput personalizado ─────────── */}
          {!showCustomInput ? (
            <Button
              title="Ninguna de estas"
              variant="ghost"
              onPress={() => {
                setShowCustomInput(true);
                setSelected(null); // Deseleccionar opción anterior
              }}
            />
          ) : (
            <View className="gap-3">
              <Typography variant="body">
                ¿Cómo lo llamarías tú?
              </Typography>
              <TextInput
                value={customEmotion}
                onChangeText={setCustomEmotion}
                placeholder="Escribe con tus propias palabras..."
                accessibilityLabel="Describe la emoción con tus propias palabras"
                accessibilityHint="Cualquier palabra o frase que describes cómo te sientes"
              />
              {/* Volver a las opciones */}
              <Button
                title="← Ver opciones"
                variant="ghost"
                onPress={() => setShowCustomInput(false)}
              />
            </View>
          )}

          <View className="flex-1" />

          {/* ── CTA — deshabilitado hasta elegir algo ────────────────── */}
          <Button
            title="Continuar →"
            onPress={handleContinue}
            variant="primary"
            disabled={!confirmedEmotion}
            accessibilityHint="Confirmar la emoción seleccionada y guardar el check-in"
          />

        </View>
      </ScrollView>
    </SafeScreen>
  );
}
