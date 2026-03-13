/**
 * dictionary.tsx — S20: Emotion Dictionary
 *
 * 2.3 (2026-03-13): Emotion dictionary screen.
 * Shows all 8 canonical emotions with:
 *   - Clinical definition (ASD-adapted, non-pathologizing)
 *   - How it manifests in the body
 *   - Validation phrase
 *   - How many times the user has identified it (from check-in history)
 *
 * All emotions are always visible — not gated by history.
 * The "X veces" counter is soft (shows 0 if no history or auth not ready).
 *
 * ASD design constraints:
 *   - Explicit, non-metaphorical language
 *   - Validation phrases: calm, factual, not saccharine
 *   - No scoring, no "good/bad" framing
 *   - All 8 canonical keys preserved exactly (especially "unnamed" = alexithymia)
 */
import React, { useEffect, useState } from "react";
import { View, ScrollView, useColorScheme } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";
import { EmotionKey, getEmotionColors, VALID_EMOTION_KEYS } from "@/constants/colors";

// ─────────────────────────────────────────────────────────────────────────────
// Emotion definitions
// ─────────────────────────────────────────────────────────────────────────────

interface EmotionEntry {
  key:        EmotionKey;
  label:      string;
  definition: string;
  body:       string;
  validation: string;
}

const EMOTION_ENTRIES: EmotionEntry[] = [
  {
    key:        "calm",
    label:      "Tranquilo/a",
    definition: "Tu sistema nervioso está regulado. El cuerpo se siente estable y en equilibrio.",
    body:       "Respiración pausada, músculos relajados, temperatura neutral en manos y pecho.",
    validation: "Este momento es tuyo. Puedes simplemente estar aquí.",
  },
  {
    key:        "anxious",
    label:      "Ansioso/a",
    definition: "Tu cuerpo detecta algo que percibe como amenaza, real o imaginada. Es una respuesta automática, no una falla.",
    body:       "Pecho apretado, corazón acelerado, manos inquietas o frías, pensamientos que se aceleran.",
    validation: "La ansiedad es información, no una falla tuya. Tu sistema está haciendo su trabajo.",
  },
  {
    key:        "overwhelmed",
    label:      "Desbordado/a",
    definition: "El sistema nervioso recibió más estímulos o demandas de los que puede procesar en este momento.",
    body:       "Tensión en cabeza o cuello, necesidad de espacio, sensación de peso, dificultad para decidir.",
    validation: "Necesitar un descanso es una necesidad, no una debilidad.",
  },
  {
    key:        "sad",
    label:      "Triste",
    definition: "Una respuesta natural a una pérdida, una decepción o un cambio que importa.",
    body:       "Ojos pesados, garganta apretada, menos energía disponible, poco apetito.",
    validation: "La tristeza tiene su lugar. No tienes que apresurarte a salir de ella.",
  },
  {
    key:        "joyful",
    label:      "Alegre",
    definition: "Tu cuerpo celebra algo que percibe como bueno, seguro o satisfactorio.",
    body:       "Sensación de ligereza, energía disponible, sonrisa que aparece sola.",
    validation: "Mereces sentirte bien. Este momento también es real.",
  },
  {
    key:        "irritable",
    label:      "Irritable",
    definition: "Tu umbral de tolerancia está bajo. Lo que normalmente pasarías puede sentirse grande o insoportable.",
    body:       "Mandíbula apretada, tensión en hombros, poca paciencia, voz más corta.",
    validation: "No eres tu irritabilidad. Tu sistema está pidiendo algo.",
  },
  {
    key:        "tired",
    label:      "Cansado/a",
    definition: "Tu cuerpo o mente han gastado más recursos de los que tienen disponibles en este momento.",
    body:       "Ojos pesados, lentitud al moverse, dificultad para concentrarse, deseo de silencio.",
    validation: "El descanso es productivo. Descansar es cuidarte, no rendirte.",
  },
  {
    key:        "unnamed",
    label:      "Sin nombre",
    definition: "Algo está presente pero las palabras no llegan todavía. Eso es válido y tiene nombre propio: alexitimia.",
    body:       "Puede sentirse como una mezcla, como nada en particular, o como mucho a la vez. El cuerpo sabe aunque la mente no encuentre el término.",
    validation: "No necesitas nombrarlo para que sea real. Lo que sientes importa.",
  },
];

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function DictionaryScreen() {
  const colorScheme    = useColorScheme() ?? "light";
  const isDark         = colorScheme === "dark";
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  // Count map: emotionKey → number of times identified in check-ins
  const [countMap, setCountMap] = useState<Record<string, number>>({});

  useEffect(() => {
    if (!supabaseUserId) return;

    supabase
      .from("checkins")
      .select("emotion_confirmed")
      .eq("user_id", supabaseUserId)
      .limit(500)
      .then(({ data }) => {
        if (!data) return;
        const counts: Record<string, number> = {};
        for (const row of data) {
          const key = row.emotion_confirmed ?? "unnamed";
          counts[key] = (counts[key] ?? 0) + 1;
        }
        setCountMap(counts);
      });
  }, [supabaseUserId]);

  return (
    <SafeScreen>
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 20, paddingTop: 8, paddingBottom: 32, gap: 12 }}
      >
        {/* Header */}
        <View style={{ gap: 4, marginBottom: 8 }}>
          <Typography variant="headingL">Diccionario emocional</Typography>
          <Typography
            variant="body"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Cada emoción tiene un nombre, una señal corporal y un lugar válido.
          </Typography>
        </View>

        {/* Emotion cards */}
        {EMOTION_ENTRIES.map((entry) => (
          <EmotionCard
            key={entry.key}
            entry={entry}
            count={countMap[entry.key] ?? 0}
            colorScheme={colorScheme}
            isDark={isDark}
          />
        ))}
      </ScrollView>
    </SafeScreen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// EmotionCard sub-component
// ─────────────────────────────────────────────────────────────────────────────

interface EmotionCardProps {
  entry:       EmotionEntry;
  count:       number;
  colorScheme: "light" | "dark" | "unspecified" | null;
  isDark:      boolean;
}

function EmotionCard({ entry, count, colorScheme, isDark }: EmotionCardProps) {
  const colors = getEmotionColors(entry.key, colorScheme);
  const borderColor = isDark ? "#3A3A44" : "#E0DDD8";

  return (
    <Card
      style={{
        borderLeftWidth: 4,
        borderLeftColor: colors.dot,
        borderTopWidth:  1,
        borderRightWidth: 1,
        borderBottomWidth: 1,
        borderTopColor: borderColor,
        borderRightColor: borderColor,
        borderBottomColor: borderColor,
        gap: 10,
      }}
    >
      {/* Header row: label + count badge */}
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          {/* Emotion color dot */}
          <View
            style={{
              width: 12,
              height: 12,
              borderRadius: 6,
              backgroundColor: colors.dot,
            }}
          />
          <Typography variant="headingS">{entry.label}</Typography>
        </View>

        {/* Times identified badge */}
        {count > 0 && (
          <View
            style={{
              backgroundColor: isDark ? "#2F2F38" : "#EFEFEA",
              borderRadius: 12,
              paddingHorizontal: 10,
              paddingVertical: 3,
            }}
          >
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              {count} {count === 1 ? "vez" : "veces"}
            </Typography>
          </View>
        )}
      </View>

      {/* Definition */}
      <Typography variant="body">{entry.definition}</Typography>

      {/* Body signal */}
      <View style={{ flexDirection: "row", gap: 8, alignItems: "flex-start" }}>
        <Ionicons
          name="body-outline"
          size={16}
          color={isDark ? "#6B6B7B" : "#6B6B6B"}
          style={{ marginTop: 2 }}
        />
        <Typography
          variant="caption"
          className="text-script-text-secondary dark:text-script-dark-text-secondary"
          style={{ flex: 1 }}
        >
          {entry.body}
        </Typography>
      </View>

      {/* Validation phrase */}
      <View
        style={{
          backgroundColor: isDark ? "#2F2F38" : "#F8F6F2",
          borderRadius: 12,
          paddingHorizontal: 12,
          paddingVertical: 8,
        }}
      >
        <Typography
          variant="caption"
          className="text-script-text-secondary dark:text-script-dark-text-secondary"
          style={{ fontStyle: "italic" }}
        >
          "{entry.validation}"
        </Typography>
      </View>
    </Card>
  );
}
