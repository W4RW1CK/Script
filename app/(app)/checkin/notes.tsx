/**
 * notes.tsx — S11: Texto Libre (Check-in)
 *
 * Segunda pantalla del flujo de check-in. El usuario puede describir
 * con sus propias palabras lo que percibe en las zonas seleccionadas.
 *
 * Flujo: S10 (body) → S11 → S12 (reflect) → S13 (result)
 *
 * Recibe: `zones` como query param coma-separado desde S10.
 * Envía: `zones` + `notes` como query params a S12.
 *
 * UX:
 *   - Los chips de zonas se muestran (read-only) como recordatorio
 *   - TextInput grande con placeholder descriptivo y amigable
 *   - "Continuar sin describir" permite saltarse este paso
 *   - KeyboardAvoidingView para que el input no quede bajo el teclado
 */
import React, { useState } from "react";
import {
  View,
  ScrollView,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Chip, TextInput } from "@/components/ui";
import { ZoneId, ZONE_META, ZONE_ORDER } from "@/components/body-map/BodyMap";

export default function CheckinNotesScreen() {
  const router = useRouter();

  // Zonas recibidas desde S10 como string coma-separado
  const { zones: zonesParam } = useLocalSearchParams<{ zones: string }>();

  // Reconstruir array de ZoneId desde el param
  const selectedZones = (
    zonesParam?.split(",").filter(Boolean) ?? []
  ) as ZoneId[];

  // Estado local del texto libre del usuario
  const [notes, setNotes] = useState("");

  /** Navegar a S12 pasando zonas + notas */
  const handleContinue = () => {
    router.push({
      pathname: "/(app)/checkin/reflect",
      params: {
        zones: zonesParam ?? "",
        notes: notes.trim(),
      },
    });
  };

  return (
    <SafeScreen>
      {/*
        KeyboardAvoidingView: levanta el contenido cuando aparece el teclado
        iOS usa "padding", Android usa "height"
      */}
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={{ flex: 1 }}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="flex-1 px-5 pt-6 pb-8 gap-6">

            {/* ── Encabezado ─────────────────────────────────────────── */}
            <View className="gap-2">
              <Typography variant="headingL">
                ¿Qué percibes ahí?
              </Typography>
              <Typography
                variant="body"
                className="text-script-text-secondary dark:text-script-dark-text-secondary"
              >
                Cualquier palabra sirve. No hay respuesta incorrecta.
              </Typography>
            </View>

            {/* ── Chips de zonas (read-only — solo recordatorio) ──────── */}
            {selectedZones.length > 0 && (
              <View className="flex-row flex-wrap gap-2">
                {ZONE_ORDER
                  .filter((z) => selectedZones.includes(z))
                  .map((zone) => (
                    // Chip sin onPress = lectura solamente
                    <Chip key={zone} label={ZONE_META[zone].label} selected />
                  ))}
              </View>
            )}

            {/* ── TextInput libre multiline ────────────────────────────── */}
            <TextInput
              value={notes}
              onChangeText={setNotes}
              placeholder="Presión, calor, nada, mariposas, tensión, hormigueo..."
              multiline
              numberOfLines={6}
              accessibilityLabel="Describe lo que sientes en esas zonas"
              accessibilityHint="Escribe cualquier palabra o sensación que notes. No hay respuesta incorrecta."
            />

            <View className="flex-1" />

            {/* ── CTAs ─────────────────────────────────────────────────── */}
            <View className="gap-3">
              {/* Botón principal — activo siempre (description es opcional) */}
              <Button
                title="Listo →"
                onPress={handleContinue}
                variant="primary"
              />

              {/* Opción de saltar la descripción */}
              <Button
                title="Continuar sin describir"
                onPress={handleContinue}
                variant="ghost"
                accessibilityHint="Omite la descripción y continúa al análisis de emoción"
              />
            </View>

          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeScreen>
  );
}
