/**
 * body.tsx — S10: Mapa Corporal (Check-in)
 *
 * Primera pantalla del flujo de check-in. El usuario toca las zonas
 * de la silueta donde siente algo — puede seleccionar varias.
 *
 * Flujo: S10 → S11 (notes) → S12 (reflect) → S13 (result)
 *
 * Estado: selectedZones gestionado localmente. Se pasa a S11 via
 * query params (Fase 1.8 migrará a Zustand con el uid del usuario).
 *
 * UX (FRONTEND_GUIDELINES §0):
 *   - Inspiración Daylio: 3 taps máximo, body map táctil
 *   - Chips que muestran las zonas seleccionadas (tapping un chip lo quita)
 *   - Botón deshabilitado hasta seleccionar ≥1 zona
 */
import React, { useState, useCallback } from "react";
import { ScrollView, View } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Chip } from "@/components/ui";
import { BodyMap, ZoneId, ZONE_META, ZONE_ORDER } from "@/components/body-map/BodyMap";

export default function CheckinBodyScreen() {
  const router = useRouter();

  // Zonas seleccionadas por el usuario — array vacío = ninguna
  const [selectedZones, setSelectedZones] = useState<ZoneId[]>([]);

  /**
   * Navegar a S11 pasando las zonas seleccionadas como query param.
   * Formato: "head,chest,legs" (coma-separado, sin espacios)
   */
  const handleContinue = useCallback(() => {
    router.push({
      pathname: "/(app)/checkin/notes",
      params: { zones: selectedZones.join(",") },
    });
  }, [selectedZones, router]);

  return (
    <SafeScreen>
      {/* ScrollView para pantallas pequeñas donde el BodyMap no cabe completo */}
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8 gap-6">

          {/* ── Encabezado ────────────────────────────────────────────── */}
          <View className="gap-2">
            <Typography variant="headingL">
              ¿Qué siente tu cuerpo?
            </Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Toca las zonas donde sientes algo. Puedes seleccionar varias.
            </Typography>
          </View>

          {/* ── BodyMap centrado ──────────────────────────────────────── */}
          <View className="items-center">
            <BodyMap
              selectedZones={selectedZones}
              onZonesChange={setSelectedZones}
              width={220}
            />
          </View>

          {/* ── Chips de zonas seleccionadas (tapping = quitar zona) ── */}
          {selectedZones.length > 0 && (
            <View className="gap-2">
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary"
              >
                Zonas seleccionadas — toca para quitar:
              </Typography>
              <View className="flex-row flex-wrap gap-2">
                {/* Renderizar en ZONE_ORDER para mantener orden cuerpo */}
                {ZONE_ORDER
                  .filter((z) => selectedZones.includes(z))
                  .map((zone) => (
                    <Chip
                      key={zone}
                      label={ZONE_META[zone].label}
                      selected
                      onPress={() =>
                        setSelectedZones((prev) => prev.filter((z) => z !== zone))
                      }
                    />
                  ))}
              </View>
            </View>
          )}

          {/* Spacer flexible — empuja el botón hacia abajo */}
          <View className="flex-1" />

          {/* ── CTA principal (deshabilitado si 0 zonas) ─────────────── */}
          <Button
            title="Describir lo que siento →"
            onPress={handleContinue}
            variant="primary"
            disabled={selectedZones.length === 0}
            accessibilityHint={
              selectedZones.length === 0
                ? "Selecciona al menos una zona del cuerpo primero"
                : "Continúa para describir lo que percibes en esas zonas"
            }
          />

        </View>
      </ScrollView>
    </SafeScreen>
  );
}
