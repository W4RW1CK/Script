/**
 * (onboarding)/aq10-result.tsx — S03: Resultado del AQ-10
 *
 * Muestra el score del AQ-10 con un mensaje apropiado (nunca "positivo/negativo").
 * Recomienda tests adicionales según el score:
 * - Score ≥6: recomienda AQ Completo (50q)
 * - Score <6: recomienda CAT-Q (detecta enmascaramiento)
 * - Siempre muestra RAADS-R como opción adicional
 *
 * El usuario puede hacer los tests ahora o saltar directamente al perfil.
 */
import React from "react";
import { View, ScrollView } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";

export default function AQ10ResultScreen() {
  const router = useRouter();
  const { score: scoreParam } = useLocalSearchParams<{ score: string }>();
  const score = parseInt(scoreParam ?? "0", 10);

  // Mensaje según score (PRD Apéndice A) — nunca "positivo"/"negativo"
  const message =
    score >= 6
      ? "Muchas personas con TEA se identifican con estas respuestas. Este resultado no es un diagnóstico — solo un especialista puede darlo. Script está diseñado pensando en personas como tú."
      : "Tu perfil no muestra señales claras de TEA. Si te identificas con estas experiencias de otras formas, considera hablar con un especialista. Script puede ser útil para cualquiera.";

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8 gap-6">
          {/* Score */}
          <View className="items-center gap-2">
            <Typography variant="headingL">{score} / 10</Typography>
            <Typography
              variant="body"
              className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              {message}
            </Typography>
          </View>

          {/* Tests recomendados */}
          <View className="gap-3">
            <Typography variant="headingS">
              Tests adicionales (opcionales)
            </Typography>

            {/* AQ Completo — recomendado si score ≥6 */}
            <Card variant={score >= 6 ? "elevated" : "default"}>
              <Typography variant="headingS">
                AQ Completo (50 preguntas)
              </Typography>
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
              >
                {score >= 6
                  ? "Recomendado para ti — profundiza en 5 áreas"
                  : "Exploración detallada en 5 áreas"}
              </Typography>
              <Button
                title="Hacer ahora"
                variant="secondary"
                onPress={() => router.push("/(onboarding)/aq-full")}
                className="mt-3"
              />
            </Card>

            {/* CAT-Q — recomendado si score <6 */}
            <Card variant={score < 6 ? "elevated" : "default"}>
              <Typography variant="headingS">
                CAT-Q (25 preguntas)
              </Typography>
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
              >
                {score < 6
                  ? "Recomendado — detecta enmascaramiento social"
                  : "Detecta si camuflas rasgos autistas"}
              </Typography>
              <Button
                title="Hacer ahora"
                variant="secondary"
                onPress={() => router.push("/(onboarding)/catq")}
                className="mt-3"
              />
            </Card>

            {/* RAADS-R — siempre disponible */}
            <Card>
              <Typography variant="headingS">
                RAADS-R (80 preguntas)
              </Typography>
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
              >
                Evaluación completa — se puede pausar y retomar
              </Typography>
              <Button
                title="Hacer ahora"
                variant="secondary"
                onPress={() => router.push("/(onboarding)/raads")}
                className="mt-3"
              />
            </Card>
          </View>

          <View className="flex-1" />

          {/* Saltar tests */}
          <Button
            title="Saltar tests adicionales → Continuar"
            variant="ghost"
            onPress={() => router.push("/(onboarding)/profile")}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
