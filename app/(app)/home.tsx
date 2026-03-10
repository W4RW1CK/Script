/**
 * home.tsx — S09: Home Screen
 *
 * T-V5 (2026-03-10): Full redesign inspired by Finch.
 *
 * Layout:
 *   1. Warm greeting + time of day  → "Buenos días, [name]"
 *   2. Last emotion card            → EmotionColors[key] + label + relative time
 *      Empty state: warm illustration + "Tu primer momento aparecerá aquí"
 *   3. 7-day dot strip              → emotion dots for days with check-ins,
 *                                     faint rings for days without
 *   4. Check-in CTA                 → "¿Cómo estás ahora?"
 *   5. 2 quick-access tiles         → Scripts + History
 *
 * Data notes:
 *   - Last check-in from Supabase: D-01 (deferred) — shows empty state for now
 *   - Username from Supabase: D-06 (deferred) — shows generic greeting for now
 *   - 7-day strip: built from static empty state until D-01 fetches real data
 *   The structure is wired and ready — add the Supabase query in Sprint 2.1.
 */
import React, { useMemo } from "react";
import { View, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography } from "@/components/ui";
import { EmotionColors, EmotionKey } from "@/constants/colors";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LastCheckin {
  emotionKey: EmotionKey;
  label:      string;
  /** Minutes ago */
  minutesAgo: number;
}

interface DayDot {
  /** ISO date string YYYY-MM-DD */
  date:       string;
  /** Short day label: L M X J V S D */
  dayLabel:   string;
  emotionKey: EmotionKey | null; // null = no check-in that day
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Returns a warm, time-of-day greeting in Spanish.
 * Buenos días: 5:00–11:59 | Buenas tardes: 12:00–17:59 | Buenas noches: 18:00–4:59
 */
function getGreeting(): string {
  const hour = new Date().getHours();
  if (hour >= 5  && hour < 12) return "Buenos días";
  if (hour >= 12 && hour < 18) return "Buenas tardes";
  return "Buenas noches";
}

/** Formats a minutesAgo value into a human-readable relative time string */
function formatRelativeTime(minutesAgo: number): string {
  if (minutesAgo < 60) return "Hace un momento";
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24)  return hours === 1 ? "Hace 1 hora" : `Hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

/** Short Spanish day labels, Monday-first */
const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

/**
 * Generates the last 7 days as DayDot entries (today last, 6 days ago first).
 * In the empty state (no Supabase data), all emotionKey values are null.
 * D-01: replace the null values with real data from Supabase when fetching check-ins.
 */
function buildWeekDots(checkinsMap: Map<string, EmotionKey> = new Map()): DayDot[] {
  const dots: DayDot[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso  = d.toISOString().split("T")[0]; // "2026-03-10"
    // getDay(): 0=Sun, 1=Mon...6=Sat → map to Mon-first index
    const dayIndex = (d.getDay() + 6) % 7;
    dots.push({
      date:       iso,
      dayLabel:   DAY_LABELS[dayIndex],
      emotionKey: checkinsMap.get(iso) ?? null,
    });
  }
  return dots;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * LastEmotionCard — shows the user's most recent check-in with emotion color.
 * Tapping it navigates to History to see full context.
 */
function LastEmotionCard({
  checkin,
  onPress,
}: {
  checkin: LastCheckin | null;
  onPress: () => void;
}) {
  if (!checkin) {
    // Empty state — no check-ins yet
    return (
      <View
        className="rounded-3xl p-5 bg-script-bg-secondary dark:bg-script-dark-secondary items-center gap-3"
        accessibilityRole="text"
      >
        <Typography variant="headingXL">🌱</Typography>
        <Typography variant="headingS" className="text-center">
          Tu primer momento
        </Typography>
        <Typography
          variant="caption"
          className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
        >
          Cuando hagas tu primer check-in, aparecerá aquí con su color.
        </Typography>
      </View>
    );
  }

  const colors = EmotionColors[checkin.emotionKey];
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Último check-in: ${checkin.label}, ${formatRelativeTime(checkin.minutesAgo)}`}
      style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
    >
      <View
        style={{ backgroundColor: colors.bg, borderWidth: 1.5, borderColor: colors.dot }}
        className="rounded-3xl p-5 gap-2"
      >
        {/* Emotion dot indicator */}
        <View
          style={{ width: 10, height: 10, borderRadius: 5, backgroundColor: colors.dot }}
        />
        <Typography variant="headingS" style={{ color: colors.text }}>
          {checkin.label}
        </Typography>
        <Typography variant="caption" style={{ color: colors.text, opacity: 0.7 }}>
          {formatRelativeTime(checkin.minutesAgo)}
        </Typography>
      </View>
    </Pressable>
  );
}

/**
 * WeekStrip — 7 dots representing the last 7 days.
 * Filled dot = check-in that day (emotion color).
 * Faint ring = no check-in (empty state indicator).
 */
function WeekStrip({ dots }: { dots: DayDot[] }) {
  const isDark = useColorScheme() === "dark";
  const emptyRingColor = isDark ? "#3A3A44" : "#E0DDD8"; // script-dark-border / script-border

  return (
    <View className="flex-row justify-between px-1">
      {dots.map((dot) => (
        <View key={dot.date} className="items-center gap-1">
          {/* Day dot — filled (emotion) or ring (empty) */}
          <View
            style={{
              width: 28,
              height: 28,
              borderRadius: 14,
              backgroundColor: dot.emotionKey
                ? EmotionColors[dot.emotionKey].dot
                : "transparent",
              borderWidth: 1.5,
              borderColor: dot.emotionKey
                ? EmotionColors[dot.emotionKey].dot
                : emptyRingColor,
            }}
            accessibilityLabel={
              dot.emotionKey
                ? `${dot.date}: check-in registrado`
                : `${dot.date}: sin check-in`
            }
          />
          {/* Day label */}
          <Typography
            variant="caption"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
            style={{ fontSize: 11 }}
          >
            {dot.dayLabel}
          </Typography>
        </View>
      ))}
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const iconColor = isDark ? "#5A7E92" : "#A8C5DA";

  // D-06: username from Supabase/Privy (deferred to Sprint 2.1)
  const userName = "";

  // D-01: last check-in from Supabase (deferred to Sprint 2.1)
  // Replace null with real data: { emotionKey, label, minutesAgo }
  const lastCheckin: LastCheckin | null = null;

  // D-01: real check-ins map from Supabase — replace empty Map with actual data
  // Format: Map<"YYYY-MM-DD", EmotionKey>
  const weekDots = useMemo(() => buildWeekDots(), []);

  const greeting = getGreeting();

  return (
    <SafeScreen scrollable={false}>
      <View className="flex-1 px-5 pt-6 pb-4 gap-5">

        {/* ── 1. Greeting ───────────────────────────────────────────── */}
        <View className="gap-1">
          <Typography variant="headingL">
            {userName ? `${greeting}, ${userName}` : greeting}
          </Typography>
          <Typography
            variant="body"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            ¿Cómo estás en este momento?
          </Typography>
        </View>

        {/* ── 2. Last emotion card ──────────────────────────────────── */}
        <LastEmotionCard
          checkin={lastCheckin}
          onPress={() => router.push("/(app)/history")}
        />

        {/* ── 3. 7-day dot strip ────────────────────────────────────── */}
        <WeekStrip dots={weekDots} />

        {/* ── 4. Check-in CTA ───────────────────────────────────────── */}
        <Pressable
          onPress={() => router.push("/(app)/checkin")}
          accessibilityRole="button"
          accessibilityLabel="¿Cómo estás ahora? Iniciar check-in corporal"
          className="w-full rounded-3xl bg-script-blue dark:bg-script-dark-blue p-6 items-center gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        >
          <Ionicons name="body" size={36} color="white" />
          <Typography variant="headingM" className="text-white text-center">
            ¿Cómo estás ahora?
          </Typography>
        </Pressable>

        {/* ── 5. Quick-access tiles ────────────────────────────────── */}
        <View className="flex-row gap-3">
          {/* Scripts */}
          <Pressable
            onPress={() => router.push("/(app)/scripts")}
            accessibilityRole="button"
            accessibilityLabel="Ir a Scripts sociales"
            className="flex-1 rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-4 items-center gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Ionicons name="chatbubbles" size={26} color={iconColor} />
            <Typography variant="caption" className="text-center">
              Scripts
            </Typography>
          </Pressable>

          {/* History */}
          <Pressable
            onPress={() => router.push("/(app)/history")}
            accessibilityRole="button"
            accessibilityLabel="Ir al historial de check-ins"
            className="flex-1 rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-4 items-center gap-2"
            style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
          >
            <Ionicons name="bar-chart" size={26} color={iconColor} />
            <Typography variant="caption" className="text-center">
              Historial
            </Typography>
          </Pressable>
        </View>

      </View>
    </SafeScreen>
  );
}
