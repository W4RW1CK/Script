/**
 * home.tsx — S09: Home Screen
 *
 * T-V5 (2026-03-11): Live data wired to Supabase.
 *
 * Layout:
 *   1. Warm greeting + time of day   → "Buenas noches"
 *   2. Last emotion card             → EmotionColors[key] (dark-aware) + label + relative time
 *      Empty state: warm illustration + "Tu primer momento aparecerá aquí"
 *   3. 7-day dot strip               → emotion dots for days with check-ins,
 *                                      faint rings for days without
 *   4. Check-in CTA                  → "¿Cómo estás ahora?"
 *   5. 2 quick-access tiles          → Scripts + Historial
 *
 * Data:
 *   - Fetches last 7 check-ins on each focus (useFocusEffect — same as history tab)
 *   - lastCheckin: most recent row → emotion card
 *   - weekDots:   one entry per calendar day (YYYY-MM-DD) → dot strip
 *   - Username: D-06 (deferred) — generic greeting for now
 */
import React, { useState, useCallback } from "react";
import { View, Pressable, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { useFocusEffect } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";
import {
  EmotionColors,
  EmotionKey,
  getEmotionColors,
  toEmotionKey,
} from "@/constants/colors";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface LastCheckin {
  emotionKey:  EmotionKey;
  label:       string;
  /** ISO timestamp from DB */
  checkin_at:  string;
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

/**
 * Formats a checkin_at ISO timestamp into a warm relative-time string.
 * "Hace un momento" for <1h, "Hace N horas" for <24h, "Ayer" or "Hace N días" for older.
 */
function formatRelativeTime(isoString: string): string {
  const minutesAgo = Math.floor((Date.now() - new Date(isoString).getTime()) / 60_000);
  if (minutesAgo < 60) return "Hace un momento";
  const hours = Math.floor(minutesAgo / 60);
  if (hours < 24) return hours === 1 ? "Hace 1 hora" : `Hace ${hours} horas`;
  const days = Math.floor(hours / 24);
  return days === 1 ? "Ayer" : `Hace ${days} días`;
}

/** Short Spanish day labels, Monday-first (L M X J V S D) */
const DAY_LABELS = ["L", "M", "X", "J", "V", "S", "D"];

/**
 * Generates the last 7 days as DayDot entries.
 * checkinsMap: Map<"YYYY-MM-DD", EmotionKey> from Supabase fetch.
 * Days without a check-in get emotionKey = null (renders as empty ring).
 */
function buildWeekDots(checkinsMap: Map<string, EmotionKey>): DayDot[] {
  const dots: DayDot[] = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    const iso      = d.toISOString().split("T")[0]; // "2026-03-11"
    const dayIndex = (d.getDay() + 6) % 7;           // getDay() 0=Sun → Mon-first
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
 * Uses getEmotionColors() for dark mode support.
 * Tapping navigates to History for full context.
 */
function LastEmotionCard({
  checkin,
  onPress,
}: {
  checkin: LastCheckin | null;
  onPress: () => void;
}) {
  const colorScheme = useColorScheme();

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

  // T-V5: dark-aware emotion palette
  const colors = getEmotionColors(checkin.emotionKey, colorScheme);
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Último check-in: ${checkin.label}, ${formatRelativeTime(checkin.checkin_at)}`}
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
        <Typography variant="caption" style={{ color: colors.text, opacity: 0.7 }}>
          Hoy identificaste:
        </Typography>
        <Typography variant="headingS" style={{ color: colors.text }}>
          {checkin.label}
        </Typography>
        <Typography variant="caption" style={{ color: colors.text, opacity: 0.7 }}>
          {formatRelativeTime(checkin.checkin_at)}
        </Typography>
      </View>
    </Pressable>
  );
}

/**
 * WeekStrip — 7 dots representing the last 7 calendar days.
 * Filled dot = at least one check-in that day (most recent emotion's color).
 * Faint ring = no check-in that day.
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
                ? EmotionColors[dot.emotionKey].dot  // dot color is same in light/dark
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
  const router         = useRouter();
  const isDark         = useColorScheme() === "dark";
  const iconColor      = isDark ? "#5A7E92" : "#A8C5DA";
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  // D-06: username from Supabase/Privy (deferred)
  const userName = "";

  const [lastCheckin, setLastCheckin] = useState<LastCheckin | null>(null);
  const [weekDots,    setWeekDots]    = useState<DayDot[]>(() => buildWeekDots(new Map()));

  /**
   * Fetches the 7 most recent check-ins from Supabase.
   * Used for both the last-emotion card and the 7-day dot strip.
   * RLS ensures only the current user's data is returned.
   */
  const fetchCheckins = useCallback(async () => {
    if (!supabaseUserId) return;

    try {
      const { data, error } = await supabase
        .from("checkins")
        .select("emotion_confirmed, checkin_at")
        .eq("user_id", supabaseUserId)
        .order("checkin_at", { ascending: false })
        .limit(7);

      if (error) {
        console.warn("[Home] Supabase fetch error:", error.message);
        return;
      }

      if (!data || data.length === 0) {
        // No check-ins yet — keep empty states
        setLastCheckin(null);
        setWeekDots(buildWeekDots(new Map()));
        return;
      }

      // Most recent → lastCheckin card
      const most = data[0];
      const key  = toEmotionKey(most.emotion_confirmed);
      setLastCheckin({
        emotionKey: key,
        label:      most.emotion_confirmed ?? "Sin nombre",
        checkin_at: most.checkin_at,
      });

      // Build one dot per CALENDAR DAY (take the most recent check-in per day)
      const dayMap = new Map<string, EmotionKey>();
      for (const row of data) {
        const day = (row.checkin_at as string).split("T")[0]; // "YYYY-MM-DD"
        if (!dayMap.has(day)) {
          // First (most recent) for that day wins
          dayMap.set(day, toEmotionKey(row.emotion_confirmed));
        }
      }
      setWeekDots(buildWeekDots(dayMap));

    } catch (e) {
      console.warn("[Home] Unexpected error:", e);
    }
  }, [supabaseUserId]);

  // Refetch every time the Home tab gains focus (catches new check-ins)
  useFocusEffect(
    useCallback(() => {
      fetchCheckins();
    }, [fetchCheckins])
  );

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

        {/* ── 5. Quick-access tiles ─────────────────────────────────── */}
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

          {/* Historial */}
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
