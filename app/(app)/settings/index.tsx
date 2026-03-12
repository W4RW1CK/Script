/**
 * (app)/settings/index.tsx — S21: Settings
 *
 * App settings screen. Week 2 Sprint 2.B implementation.
 *
 * T-F5 (2026-03-10): Added "Complete my profile" section with assessment test
 * completion status (AQ Full, CAT-Q, RAADS-R). Tests are accessible from here
 * for users who skipped them during onboarding. The AuthGate has been updated
 * to allow navigation to assessment screens post-onboarding (see app/_layout.tsx).
 *
 * 2.4 (2026-03-11): Appearance section — theme toggle (System/Light/Dark).
 * Preference is persisted in AsyncStorage (key: "script:theme") and applied
 * via Appearance.setColorScheme() on mount and on change.
 *
 * Test completion detected via profiles.{aq_full,catq,raads}_completed_at timestamps.
 * Null timestamp = test not yet taken (⏳). Non-null = completed (✅).
 */
// ⚠️ Polyfill FIRST — @privy-io/expo accesses bare `crypto` global at module eval time.
// Without this, Hermes throws ReferenceError on first lazy load of this screen.
import "@/polyfills";
import React, { useEffect, useState, useCallback } from "react";
import { View, ScrollView, Pressable, Appearance, useColorScheme, Alert } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

/** Theme preference stored in AsyncStorage */
type ThemeOption = "system" | "light" | "dark";
const THEME_STORAGE_KEY = "script:theme";

/** Test completion status fetched from profiles table */
interface TestStatus {
  aqFull:  boolean; // aq_full_completed_at IS NOT NULL
  catq:    boolean; // catq_completed_at IS NOT NULL
  raads:   boolean; // raads_completed_at IS NOT NULL
  loading: boolean;
}

export default function SettingsScreen() {
  const router         = useRouter();
  const isDark         = (useColorScheme() ?? 'light') === 'dark';
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);
  const clearUser = useAuthStore((s) => s.clearUser);

  /**
   * Sign out: clear Supabase session + Zustand store, navigate to /auth.
   * Privy session is cleared automatically when AuthGate re-evaluates on /auth.
   * Note: usePrivy() is NOT imported here — importing @privy-io/expo at module
   * level in this screen conflicts with the global.crypto shim order and throws
   * ReferenceError. Supabase signOut + clearUser is sufficient to reset all state.
   */
  const handleSignOut = useCallback(async () => {
    Alert.alert(
      "Cerrar sesión",
      "¿Seguro que quieres salir?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Cerrar sesión",
          style: "destructive",
          onPress: async () => {
            try {
              await supabase.auth.signOut();
            } catch (e) {
              console.warn("[Settings] Supabase signOut error:", e);
            } finally {
              // Always clear local state and navigate — even if remote fails
              clearUser();
              router.replace("/auth");
            }
          },
        },
      ]
    );
  }, [clearUser, router]);

  const [testStatus, setTestStatus] = useState<TestStatus>({
    aqFull: false,
    catq:   false,
    raads:  false,
    loading: true,
  });

  // 2.4: Theme preference — loaded from AsyncStorage, applied on mount
  const [themePreference, setThemePreference] = useState<ThemeOption>("system");

  /**
   * Load saved theme preference and apply it on mount.
   */
  useEffect(() => {
    AsyncStorage.getItem(THEME_STORAGE_KEY).then((saved) => {
      const valid = ["system", "light", "dark"];
      if (saved && valid.includes(saved)) {
        setThemePreference(saved as ThemeOption);
        // On Android, passing null to setColorScheme crashes (native NPE).
        // When system theme is selected, skip the call entirely — the OS color
        // scheme is used by default when no override is set.
        if (saved !== "system") {
          Appearance.setColorScheme(saved as "light" | "dark");
        }
      }
    });
  }, []);

  /**
   * Apply a theme preference: persists to AsyncStorage + updates Appearance.
   */
  const applyTheme = useCallback(async (theme: ThemeOption) => {
    setThemePreference(theme);
    await AsyncStorage.setItem(THEME_STORAGE_KEY, theme);
    // On Android, passing null to setColorScheme causes a native crash (NPE).
    // System theme = no override set; light/dark = explicit override.
    if (theme !== "system") {
      Appearance.setColorScheme(theme);
    }
  }, []);

  /**
   * Fetch test completion timestamps from profiles.
   * Runs once on mount. Non-blocking — statuses show "loading" until resolved.
   */
  useEffect(() => {
    if (!supabaseUserId) {
      setTestStatus((prev) => ({ ...prev, loading: false }));
      return;
    }

    supabase
      .from("profiles")
      .select("aq_full_completed_at, catq_completed_at, raads_completed_at")
      .eq("user_id", supabaseUserId)
      .maybeSingle() // .single() throws when 0 rows; .maybeSingle() returns null safely
      .then(({ data, error }) => {
        if (error) {
          console.warn("[Settings] Error fetching test status:", error.message);
          setTestStatus((prev) => ({ ...prev, loading: false }));
          return;
        }
        setTestStatus({
          aqFull:  !!data?.aq_full_completed_at,
          catq:    !!data?.catq_completed_at,
          raads:   !!data?.raads_completed_at,
          loading: false,
        });
      });
  }, [supabaseUserId]);

  return (
    <SafeScreen>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-6 pb-12 gap-8">

          {/* ── Header ── */}
          <View className="gap-1">
            <Typography variant="headingL">Ajustes</Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Personaliza tu experiencia en Script.
            </Typography>
          </View>

          {/* ── T-F5: Complete my profile — test completion status ── */}
          <View className="gap-3">
            <Typography variant="headingS">Completa tu perfil</Typography>
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Estos tests opcionales ayudan a Script a entenderte mejor.
              Puedes hacerlos ahora o en cualquier momento.
            </Typography>

            {/* AQ Full */}
            <TestCard
              title="AQ Completo"
              description="50 preguntas · 5 dominios de perfil autista"
              completed={testStatus.aqFull}
              loading={testStatus.loading}
              onPress={() => router.push("/(onboarding)/aq-full")}
            />

            {/* CAT-Q */}
            <TestCard
              title="CAT-Q"
              description="25 preguntas · Detecta enmascaramiento social"
              completed={testStatus.catq}
              loading={testStatus.loading}
              onPress={() => router.push("/(onboarding)/catq")}
            />

            {/* RAADS-R */}
            <TestCard
              title="RAADS-R"
              description="80 preguntas · Evaluación completa · Puedes pausarlo"
              completed={testStatus.raads}
              loading={testStatus.loading}
              onPress={() => router.push("/(onboarding)/raads")}
            />
          </View>

          {/* ── 2.4: Apariencia ── */}
          <View className="gap-3">
            <Typography variant="headingS">Apariencia</Typography>
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Elige cómo se ve Script. Adaptar la pantalla puede reducir la
              fatiga visual.
            </Typography>

            <View className="gap-2">
              {(
                [
                  { value: "system", label: "Sistema",          emoji: "📱",  desc: "Sigue el modo de tu teléfono" },
                  { value: "light",  label: "Claro",            emoji: "☀️",  desc: "Fondo blanco cálido" },
                  { value: "dark",   label: "Oscuro",           emoji: "🌙",  desc: "Fondo oscuro — menos fatiga nocturna" },
                ] as { value: ThemeOption; label: string; emoji: string; desc: string }[]
              ).map(({ value, label, emoji, desc }) => {
                const isActive = themePreference === value;
                return (
                  <Pressable
                    key={value}
                    onPress={() => applyTheme(value)}
                    accessibilityRole="radio"
                    accessibilityState={{ selected: isActive }}
                    accessibilityLabel={`Tema ${label}: ${desc}`}
                    style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
                  >
                    <Card
                      style={{
                        flexDirection: "row",
                        alignItems: "center",
                        gap: 12,
                        borderWidth: isActive ? 2 : 1,
                        borderColor: isActive
                          ? (isDark ? "#5A7E92" : "#A8C5DA")  // script-blue
                          : (isDark ? "#3A3A44" : "#E0DDD8"), // script-border
                      }}
                    >
                      <Typography variant="headingM">{emoji}</Typography>
                      <View style={{ flex: 1, gap: 2 }}>
                        <Typography variant="headingS">{label}</Typography>
                        <Typography
                          variant="caption"
                          className="text-script-text-secondary dark:text-script-dark-text-secondary"
                        >
                          {desc}
                        </Typography>
                      </View>
                      {isActive && (
                        <Ionicons
                          name="checkmark-circle"
                          size={22}
                          color={isDark ? "#5A7E92" : "#A8C5DA"}
                        />
                      )}
                    </Card>
                  </Pressable>
                );
              })}
            </View>
          </View>

          {/* ── Coming soon sections ── */}
          <View className="gap-3">
            <Typography variant="headingS">Próximamente</Typography>
            <ComingSoonCard emoji="👤" label="Mi perfil sensorial" />
            <ComingSoonCard emoji="🤝" label="Contactos de confianza" />
          </View>

          {/* ── Sign Out ── */}
          <Pressable
            onPress={handleSignOut}
            accessibilityRole="button"
            accessibilityLabel="Cerrar sesión"
            className="items-center py-3"
          >
            <Typography
              variant="body"
              className="text-red-500 dark:text-red-400"
            >
              Cerrar sesión
            </Typography>
          </Pressable>

        </View>
      </ScrollView>
    </SafeScreen>
  );
}

// ─────────────────────────────────────────────────────────────────────────────
// Sub-components
// ─────────────────────────────────────────────────────────────────────────────

interface TestCardProps {
  title:       string;
  description: string;
  completed:   boolean;
  loading:     boolean;
  onPress:     () => void;
}

/**
 * TestCard — displays a single assessment test with completion status badge.
 * ✅ = completed (aqFull/catq/raads_completed_at is not null)
 * ⏳ = not yet taken
 */
function TestCard({ title, description, completed, loading, onPress }: TestCardProps) {
  return (
    <Pressable onPress={onPress} accessibilityRole="button">
      <Card className="flex-row items-center gap-3">
        {/* Status icon */}
        <View className="w-10 h-10 items-center justify-center">
          {loading ? (
            <Ionicons name="ellipse-outline" size={24} color="#ABABAB" />
          ) : completed ? (
            <Ionicons name="checkmark-circle" size={24} color="#10B981" />
          ) : (
            <Ionicons name="time-outline" size={24} color="#ABABAB" />
          )}
        </View>

        {/* Info */}
        <View className="flex-1 gap-0.5">
          <Typography variant="headingS">{title}</Typography>
          <Typography
            variant="caption"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            {description}
          </Typography>
        </View>

        {/* Chevron */}
        <Ionicons
          name="chevron-forward"
          size={20}
          color="#ABABAB"
        />
      </Card>
    </Pressable>
  );
}

interface ComingSoonCardProps {
  emoji: string;
  label: string;
}

/** Placeholder card for settings sections not yet implemented */
function ComingSoonCard({ emoji, label }: ComingSoonCardProps) {
  return (
    <Card className="flex-row items-center gap-3 opacity-40">
      <Typography variant="headingL">{emoji}</Typography>
      <Typography variant="body">{label}</Typography>
    </Card>
  );
}
