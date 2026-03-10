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
 * Test completion detected via profiles.{aq_full,catq,raads}_completed_at timestamps.
 * Null timestamp = test not yet taken (⏳). Non-null = completed (✅).
 *
 * Other settings sections (sensory profile, contacts, appearance) are
 * planned for Sprint 2.1 — displayed as coming soon placeholders for now.
 */
import React, { useEffect, useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

/** Test completion status fetched from profiles table */
interface TestStatus {
  aqFull:  boolean; // aq_full_completed_at IS NOT NULL
  catq:    boolean; // catq_completed_at IS NOT NULL
  raads:   boolean; // raads_completed_at IS NOT NULL
  loading: boolean;
}

export default function SettingsScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  const [testStatus, setTestStatus] = useState<TestStatus>({
    aqFull: false,
    catq:   false,
    raads:  false,
    loading: true,
  });

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
      .single()
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

          {/* ── Coming soon sections (Sprint 2.1) ── */}
          <View className="gap-3">
            <Typography variant="headingS">Próximamente</Typography>

            <ComingSoonCard emoji="👤" label="Mi perfil sensorial" />
            <ComingSoonCard emoji="🤝" label="Contactos de confianza" />
            <ComingSoonCard emoji="🎨" label="Apariencia y accesibilidad" />
          </View>

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
