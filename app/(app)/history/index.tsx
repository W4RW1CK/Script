/**
 * history/index.tsx — S19: Check-in History
 *
 * Lists all past check-ins ordered newest first.
 * Includes an emotion filter chip row (emotion only — date range deferred Week 3).
 *
 * Features:
 *   - Fetches checkins from Supabase on mount (SELECT ordered by checkin_at DESC)
 *   - Emotion filter: horizontal chip row, "Todas" + 8 emotion keys with colors
 *   - Each row: emotion dot (EmotionColors[key].dot) + label + formatted date + flag
 *   - Empty state (no check-ins ever): warm copy + CTA to start check-in
 *   - Empty state (filter with no results): "No hay resultados con este filtro"
 *   - Pull-to-refresh support
 *
 * Decision (2026-03-10): emotion filter only for Friday — date range deferred Week 3.
 *
 * Flow: Home → S19 (via History tab)
 * Future: tap a row → S19 detail (Sprint 2.x)
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  FlatList,
  Pressable,
  ScrollView,
  RefreshControl,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";
import {
  EmotionColors,
  EmotionKey,
  VALID_EMOTION_KEYS,
  toEmotionKey,
} from "@/constants/colors";

// ─────────────────────────────────────────────────────────────────────────────
// Types
// ─────────────────────────────────────────────────────────────────────────────

interface Checkin {
  id:               string;
  emotion_confirmed: string | null;
  flagged_for_review: boolean;
  checkin_at:       string; // ISO timestamp
  free_text:        string | null;
  body_zones:       string[];
}

// ─────────────────────────────────────────────────────────────────────────────
// Helpers
// ─────────────────────────────────────────────────────────────────────────────

/**
 * Formats a checkin_at ISO timestamp into a human-readable Spanish string.
 *   Today:     "Hoy, 14:30"
 *   Yesterday: "Ayer, 09:15"
 *   This week: "Lunes, 18:00"
 *   Older:     "3 mar, 11:45"
 */
function formatCheckinDate(isoString: string): string {
  const date  = new Date(isoString);
  const now   = new Date();
  const time  = date.toLocaleTimeString("es-MX", { hour: "2-digit", minute: "2-digit" });

  const todayStr     = now.toDateString();
  const yesterdayStr = new Date(now.getTime() - 86_400_000).toDateString();

  if (date.toDateString() === todayStr)     return `Hoy, ${time}`;
  if (date.toDateString() === yesterdayStr) return `Ayer, ${time}`;

  // Within last 7 days → day name
  const daysDiff = Math.floor((now.getTime() - date.getTime()) / 86_400_000);
  if (daysDiff < 7) {
    const dayName = date.toLocaleDateString("es-MX", { weekday: "long" });
    return `${dayName.charAt(0).toUpperCase() + dayName.slice(1)}, ${time}`;
  }

  // Older → short date
  const day   = date.getDate();
  const month = date.toLocaleDateString("es-MX", { month: "short" });
  return `${day} ${month}, ${time}`;
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EmotionFilterChips — horizontal scroll row of emotion filter chips.
 * "Todas" = show all. Selecting an emotion key filters the list.
 * Each chip background adopts EmotionColors[key].bg when selected.
 */
function EmotionFilterChips({
  selected,
  onSelect,
}: {
  selected: EmotionKey | null;
  onSelect: (key: EmotionKey | null) => void;
}) {
  const isDark = useColorScheme() === "dark";
  const defaultBg     = isDark ? "#26262E" : "#EFEFEA"; // script-dark-secondary / script-bg-secondary
  const defaultBorder = isDark ? "#3A3A44" : "#E0DDD8"; // script-dark-border / script-border
  const defaultText   = isDark ? "#E8E8E8" : "#2D2D2D";

  /** Label shown on chip — capitalize first letter of emotion key */
  const CHIP_LABELS: Record<EmotionKey, string> = {
    calm:       "Calma",
    anxious:    "Ansiedad",
    overwhelmed:"Sobrecarga",
    sad:        "Tristeza",
    joyful:     "Alegría",
    irritable:  "Irritable",
    tired:      "Cansancio",
    unnamed:    "Sin nombre",
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ gap: 8, paddingHorizontal: 4 }}
      accessibilityRole="menu"
      accessibilityLabel="Filtrar por emoción"
    >
      {/* "Todas" chip */}
      <Pressable
        onPress={() => onSelect(null)}
        accessibilityRole="menuitem"
        accessibilityState={{ selected: selected === null }}
        accessibilityLabel="Mostrar todas las emociones"
        style={({ pressed }) => ({
          paddingHorizontal: 16,
          paddingVertical: 8,
          borderRadius: 20,
          backgroundColor: selected === null ? defaultText : defaultBg,
          borderWidth: 1.5,
          borderColor: selected === null ? defaultText : defaultBorder,
          opacity: pressed ? 0.8 : 1,
        })}
      >
        <Typography
          variant="caption"
          style={{ color: selected === null ? (isDark ? "#1C1C22" : "#FFFFFF") : defaultText }}
        >
          Todas
        </Typography>
      </Pressable>

      {/* One chip per emotion key */}
      {VALID_EMOTION_KEYS.map((key) => {
        const colors     = EmotionColors[key];
        const isSelected = selected === key;
        return (
          <Pressable
            key={key}
            onPress={() => onSelect(isSelected ? null : key)}
            accessibilityRole="menuitem"
            accessibilityState={{ selected: isSelected }}
            accessibilityLabel={`Filtrar por ${CHIP_LABELS[key]}`}
            style={({ pressed }) => ({
              paddingHorizontal: 16,
              paddingVertical: 8,
              borderRadius: 20,
              backgroundColor: isSelected ? colors.bg : defaultBg,
              borderWidth: 1.5,
              borderColor: isSelected ? colors.dot : defaultBorder,
              flexDirection: "row",
              alignItems: "center",
              gap: 6,
              opacity: pressed ? 0.8 : 1,
            })}
          >
            {/* Color dot */}
            <View
              style={{
                width: 8,
                height: 8,
                borderRadius: 4,
                backgroundColor: colors.dot,
              }}
            />
            <Typography
              variant="caption"
              style={{ color: isSelected ? colors.text : defaultText }}
            >
              {CHIP_LABELS[key]}
            </Typography>
          </Pressable>
        );
      })}
    </ScrollView>
  );
}

/**
 * CheckinRow — single check-in item in the history list.
 * Tappable — future: navigates to check-in detail screen.
 */
function CheckinRow({
  item,
  onPress,
}: {
  item:    Checkin;
  onPress: () => void;
}) {
  const isDark     = useColorScheme() === "dark";
  const emotionKey = toEmotionKey(item.emotion_confirmed);
  const colors     = EmotionColors[emotionKey];
  const dateStr    = formatCheckinDate(item.checkin_at);

  // Display label: use the stored Spanish label if available, else the key
  const displayLabel = item.emotion_confirmed ?? "Sin nombre";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={`Check-in: ${displayLabel}, ${dateStr}`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.8 : 1,
        flexDirection: "row",
        alignItems: "center",
        gap: 14,
        paddingVertical: 14,
        paddingHorizontal: 16,
        borderRadius: 20,
        backgroundColor: isDark ? "#26262E" : "#FFFFFF",
        borderWidth: 1,
        borderColor: isDark ? "#3A3A44" : "#E0DDD8",
        marginBottom: 8,
      })}
    >
      {/* Emotion dot */}
      <View
        style={{
          width: 14,
          height: 14,
          borderRadius: 7,
          backgroundColor: colors.dot,
          flexShrink: 0,
        }}
      />

      {/* Label + date */}
      <View style={{ flex: 1, gap: 2 }}>
        <Typography variant="headingS">{displayLabel}</Typography>
        <Typography
          variant="caption"
          className="text-script-text-secondary dark:text-script-dark-text-secondary"
        >
          {dateStr}
        </Typography>
      </View>

      {/* Flag indicator */}
      {item.flagged_for_review && (
        <Ionicons
          name="flag"
          size={16}
          color={isDark ? "#D47070" : "#C05050"}
          accessibilityLabel="Marcado para revisión"
        />
      )}

      {/* Chevron — future navigation */}
      <Ionicons
        name="chevron-forward"
        size={16}
        color={isDark ? "#55555E" : "#ABABAB"}
      />
    </Pressable>
  );
}

/**
 * EmptyState — shown when there are no check-ins at all.
 * Warm copy + CTA to start first check-in.
 */
function EmptyState({ onStartCheckin }: { onStartCheckin: () => void }) {
  return (
    <View className="flex-1 items-center justify-center px-8 gap-6 pt-16">
      <Typography variant="headingXL">🌱</Typography>
      <View className="gap-2 items-center">
        <Typography variant="headingM" className="text-center">
          Aún no hay momentos guardados
        </Typography>
        <Typography
          variant="body"
          className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
        >
          Cada check-in que hagas aparecerá aquí con su color. Tu historial es solo tuyo.
        </Typography>
      </View>
      <Button
        title="Hacer mi primer check-in"
        variant="primary"
        onPress={onStartCheckin}
      />
    </View>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Main Screen
// ─────────────────────────────────────────────────────────────────────────────

export default function HistoryScreen() {
  const router         = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  const [checkins,    setCheckins]    = useState<Checkin[]>([]);
  const [isLoading,   setIsLoading]   = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState<EmotionKey | null>(null);

  /**
   * Fetches the 50 most recent check-ins from Supabase, ordered newest first.
   * RLS ensures only the current user's data is returned.
   * Limit 50 — pagination can be added in Sprint 2.x if needed.
   */
  const fetchCheckins = useCallback(async () => {
    if (!supabaseUserId) {
      setIsLoading(false);
      return;
    }

    try {
      const { data, error } = await supabase
        .from("checkins")
        .select("id, emotion_confirmed, flagged_for_review, checkin_at, free_text, body_zones")
        .eq("user_id", supabaseUserId)
        .order("checkin_at", { ascending: false })
        .limit(50);

      if (error) {
        console.warn("[History] Supabase fetch error:", error.message);
        return;
      }

      setCheckins((data ?? []) as Checkin[]);
    } catch (e) {
      console.warn("[History] Unexpected error:", e);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  }, [supabaseUserId]);

  useEffect(() => {
    fetchCheckins();
  }, [fetchCheckins]);

  /** Pull-to-refresh handler */
  const handleRefresh = useCallback(() => {
    setIsRefreshing(true);
    fetchCheckins();
  }, [fetchCheckins]);

  /**
   * Client-side filter: apply selected emotion key filter.
   * Maps each checkin's emotion_confirmed → EmotionKey and compares.
   * This is instant (no extra DB query needed).
   */
  const filteredCheckins = activeFilter
    ? checkins.filter((c) => toEmotionKey(c.emotion_confirmed) === activeFilter)
    : checkins;

  const hasAnyCheckins  = checkins.length > 0;
  const hasFilterResult = filteredCheckins.length > 0;

  return (
    <SafeScreen scrollable={false}>
      <View className="flex-1 pt-6 pb-4 gap-4">

        {/* ── Header ───────────────────────────────────────────────── */}
        <View className="px-5 gap-1">
          <Typography variant="headingL">Historial</Typography>
          <Typography
            variant="body"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            {hasAnyCheckins
              ? `${checkins.length} momento${checkins.length !== 1 ? "s" : ""} registrado${checkins.length !== 1 ? "s" : ""}`
              : "Tus check-ins aparecerán aquí"}
          </Typography>
        </View>

        {/* ── Emotion filter chips ─────────────────────────────────── */}
        {hasAnyCheckins && (
          <View className="px-5">
            <EmotionFilterChips
              selected={activeFilter}
              onSelect={setActiveFilter}
            />
          </View>
        )}

        {/* ── Content ──────────────────────────────────────────────── */}
        {isLoading ? (
          // Loading state
          <View className="flex-1 items-center justify-center">
            <ActivityIndicator size="large" color="#A8C5DA" />
          </View>

        ) : !hasAnyCheckins ? (
          // No check-ins at all → warm empty state
          <EmptyState onStartCheckin={() => router.push("/(app)/checkin")} />

        ) : !hasFilterResult ? (
          // Filter applied but no results
          <View className="flex-1 items-center justify-center px-8 gap-4">
            <Typography variant="headingXL">🔍</Typography>
            <Typography variant="headingS" className="text-center">
              No hay check-ins con ese filtro
            </Typography>
            <Button
              title="Ver todos"
              variant="ghost"
              onPress={() => setActiveFilter(null)}
            />
          </View>

        ) : (
          // Check-in list
          <FlatList
            data={filteredCheckins}
            keyExtractor={(item) => item.id}
            contentContainerStyle={{ paddingHorizontal: 20, paddingBottom: 24 }}
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                refreshing={isRefreshing}
                onRefresh={handleRefresh}
                tintColor="#A8C5DA"
              />
            }
            renderItem={({ item }) => (
              <CheckinRow
                item={item}
                onPress={() => {
                  // TODO Sprint 2.x: navigate to check-in detail screen
                  // router.push({ pathname: "/(app)/history/[id]", params: { id: item.id } });
                }}
              />
            )}
            // Spacer at the top if chips are shown (already handled by gap above)
            ListHeaderComponent={<View style={{ height: 4 }} />}
          />
        )}

      </View>
    </SafeScreen>
  );
}
