/**
 * S17 — Evaluación de Crisis
 *
 * Primera pantalla del protocolo de rescate.
 * Evalúa el nivel de crisis (1–3) para determinar qué protocolo activar.
 * Implementación completa en Fase 1.7.
 *
 * Flujo completo (Fase 1.7):
 *   rescue/assess (S17) → rescue/protocol (S18)
 *
 * Niveles de crisis:
 *   1 — Grounding 5-4-3-2-1 (multimodal: visual + voz + háptico)
 *   2 — Respiración guiada (círculo SVG + audio + háptico)
 *   3 — Respiración + activación de contactos de confianza + notificación
 */
import { SafeScreen, Typography, Button } from "@/components/ui";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function RescueAssessScreen() {
  const router = useRouter();

  return (
    // Fondo especial de crisis — más suave que el bg normal
    <SafeScreen crisis>
      <View className="flex-1 items-center justify-center gap-8 px-5">
        {/* Texto grande — mínimo 28px en pantallas de crisis (FRONTEND_GUIDELINES §2.2) */}
        <Typography variant="crisis" className="text-center">
          Aquí estoy contigo
        </Typography>

        <Typography variant="bodyLarge" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary">
          El protocolo completo de calma estará disponible en Fase 1.7.
        </Typography>

        {/* Placeholder de niveles de crisis */}
        <View className="w-full gap-3">
          <Typography variant="caption" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary">
            🫁 Protocolo de respiración — Fase 1.7
          </Typography>
        </View>

        <Button
          title="Volver"
          onPress={() => router.back()}
          variant="secondary"
          accessibilityHint="Regresa a la pantalla anterior"
        />
      </View>
    </SafeScreen>
  );
}
