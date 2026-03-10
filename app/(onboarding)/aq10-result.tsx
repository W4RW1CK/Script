/**
 * (onboarding)/aq10-result.tsx — S03: AQ-10 Result
 *
 * Shows a warm non-diagnostic message based on AQ-10 score.
 * The numerical score is NEVER displayed — prevents grade-thinking and
 * validation anxiety (PRD §3.1, T-F2 decision 2026-03-10).
 *
 * Only ONE recommended test is shown:
 *   score >= 6 → AQ Full (50 questions) — deeper profile across 5 domains
 *   score <  6 → CAT-Q (25 questions) — detects social masking patterns
 *
 * RAADS-R is no longer offered here — it lives in Settings → "Complete my profile" (T-F5).
 *
 * "Skip for now" → S07 Profile (always — profile is mandatory per C1 decision 2026-03-10).
 * Score is stored silently in Supabase by aq10.tsx before navigating here.
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";

export default function AQ10ResultScreen() {
  const router = useRouter();
  const { score: scoreParam } = useLocalSearchParams<{ score: string }>();

  // Parse score passed from aq10.tsx — never displayed to the user
  const score = parseInt(scoreParam ?? "0", 10);

  // score >= 6 → AQ Full (5-domain deep dive); score < 6 → CAT-Q (masking detector)
  const recommendFullAQ = score >= 6;

  /**
   * Warm message — never uses "positive"/"negative", never implies diagnosis.
   * Tone: affirming, open-ended, inviting without pressure.
   * PRD §6 Principle 1: Script is NOT a diagnostic tool.
   */
  const warmMessage = recommendFullAQ
    ? "Muchas personas con TEA se identifican con estas respuestas. Esto no es un diagnóstico — solo un especialista puede darlo. Script está pensado para personas como tú."
    : "Tu perfil no muestra señales claras de TEA en esta escala. Si te identificas con estas experiencias de otras formas, un especialista puede orientarte. Script puede ser útil para cualquier persona que quiera conocerse mejor.";

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-8 pb-8 gap-8">

          {/* Warm message — score intentionally hidden */}
          <View className="gap-3">
            <Typography variant="headingL">Gracias por responder</Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              {warmMessage}
            </Typography>
          </View>

          {/* ONE recommended test — never both, never RAADS-R */}
          <View className="gap-3">
            <Typography variant="headingS">
              {recommendFullAQ
                ? "Hay un test que puede ayudarte a entenderte mejor"
                : "Hay algo que podría darte más contexto"}
            </Typography>

            {recommendFullAQ ? (
              /**
               * AQ Full — recommended when score >= 6.
               * 50 questions across 5 domains: social skill, attention switching,
               * attention to detail, communication, imagination.
               */
              <Card variant="elevated">
                <Typography variant="headingS">
                  AQ Completo (50 preguntas)
                </Typography>
                <Typography
                  variant="caption"
                  className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
                >
                  Profundiza en 5 áreas de tu perfil: comunicación, atención,
                  imaginación y más. Puedes pausarlo y retomarlo.
                </Typography>
                <Button
                  title="Explorar ahora"
                  variant="secondary"
                  onPress={() => router.push("/(onboarding)/aq-full")}
                  className="mt-3"
                />
              </Card>
            ) : (
              /**
               * CAT-Q — recommended when score < 6.
               * 25 questions that detect camouflaging / masking patterns —
               * common in ASD Level 1, especially in women and late-diagnosed adults.
               */
              <Card variant="elevated">
                <Typography variant="headingS">
                  CAT-Q (25 preguntas)
                </Typography>
                <Typography
                  variant="caption"
                  className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
                >
                  Ayuda a detectar enmascaramiento — la tendencia de adaptar
                  tu comportamiento en entornos sociales para pasar desapercibido.
                </Typography>
                <Button
                  title="Explorar ahora"
                  variant="secondary"
                  onPress={() => router.push("/(onboarding)/catq")}
                  className="mt-3"
                />
              </Card>
            )}
          </View>

          <View className="flex-1" />

          {/* Skip → always goes to S07 Profile (mandatory — C1 decision 2026-03-10) */}
          <Button
            title="Saltar por ahora"
            variant="ghost"
            onPress={() => router.push("/(onboarding)/profile")}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
