/**
 * S10 (entrada) — Check-in Corporal
 *
 * Esta pantalla es el punto de entrada del flujo de check-in.
 * En Fase 1.5 se implementará el BodyMap completo (SVG + zonas táctiles).
 *
 * Flujo completo (Fase 1.5):
 *   checkin/index → checkin/body (S10) → checkin/notes (S11)
 *                → checkin/reflect (S12) → checkin/result (S13)
 */
import { SafeScreen } from "@/components/ui";
import { Typography } from "@/components/ui";
import { Button } from "@/components/ui";
import { View } from "react-native";
import { useRouter } from "expo-router";

export default function CheckinIndexScreen() {
  const router = useRouter();

  return (
    <SafeScreen>
      <View className="flex-1 items-center justify-center gap-6 px-5">
        {/* Título de sección */}
        <Typography variant="headingL" className="text-center">
          ¿Cómo está tu cuerpo hoy?
        </Typography>

        {/* Descripción breve */}
        <Typography variant="body" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary">
          El mapa corporal y la interpretación con IA estarán disponibles en la siguiente actualización.
        </Typography>

        {/* Placeholder — se reemplaza en Fase 1.5 */}
        <View className="w-full rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-8 items-center">
          <Typography variant="caption" className="text-script-text-secondary">
            🗺️ BodyMap — Fase 1.5
          </Typography>
        </View>

        <Button
          title="Iniciar check-in"
          onPress={() => router.push("/(app)/checkin/body")}
          variant="primary"
          disabled
          accessibilityHint="Disponible en Fase 1.5"
        />
      </View>
    </SafeScreen>
  );
}
