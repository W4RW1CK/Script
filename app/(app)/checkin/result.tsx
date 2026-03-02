/**
 * result.tsx — S13: Resultado del Check-in
 *
 * Última pantalla del flujo de check-in. Muestra la emoción confirmada,
 * permite guardarla en Supabase y ofrece marcarla como "delicada".
 *
 * Flujo: S12 (reflect) → S13 → S09 (home) [replace, no push]
 *
 * Recibe: `zones` + `notes` + `emotion` como query params desde S12.
 *
 * Persistencia:
 *   - INSERT en tabla `checkins` de Supabase
 *   - Sin auth (Fase 1.5): el INSERT falla silenciosamente por RLS —
 *     se ignora el error y se navega igual al Home
 *   - Con auth (Fase 1.8): el INSERT funcionará correctamente
 *   - `flagged_for_review: true` marca para revisión del terapeuta (S23)
 *
 * UX:
 *   - Tono de cierre cálido, no clínico
 *   - La nota del usuario se muestra como cita si existe
 *   - "🚩 Esto no se siente bien" → flagged_for_review en Supabase
 */
import React, { useState } from "react";
import { View } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";

export default function CheckinResultScreen() {
  const router = useRouter();

  // Datos del check-in recibidos desde S12
  const { zones: zonesParam, notes, emotion } = useLocalSearchParams<{
    zones: string;
    notes: string;
    emotion: string;
  }>();

  // Reconstruir array de zonas desde el param
  const zones = zonesParam?.split(",").filter(Boolean) ?? [];

  // Estado local de guardado
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Guarda el check-in en Supabase.
   *
   * En Fase 1.5 (sin auth), el RLS bloqueará el INSERT.
   * Se captura el error, se loguea como warning, y se navega al Home igualmente.
   * En Fase 1.8 (con Privy auth), el INSERT funcionará correctamente.
   *
   * @param flagged - true si el usuario marcó "Esto no se siente bien"
   */
  const saveCheckin = async (flagged: boolean = false) => {
    setIsSaving(true);

    try {
      const { error } = await supabase.from("checkins").insert({
        body_zones: zones,                           // string[] de ZoneId
        raw_text:   notes ?? "",                     // descripción libre del usuario
        confirmed_emotion: emotion ?? "",            // emoción elegida en S12
        flagged_for_review: flagged,                 // marca para terapeuta
        // user_id se agrega automáticamente por RLS con auth.uid() en Fase 1.8
      });

      if (error) {
        // Warning esperado en MVP sin auth — RLS bloquea el INSERT
        // En Fase 1.8 este warning ya no debería aparecer
        console.warn(
          "[CheckinResult] INSERT bloqueado por RLS (esperado sin auth):",
          error.message
        );
      }
    } catch (e) {
      console.warn("[CheckinResult] Exception al guardar check-in:", e);
    } finally {
      setIsSaving(false);
      // Siempre navegar al Home — replace para no volver al check-in con back
      router.replace("/(app)/home");
    }
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pt-6 pb-8 gap-6">

        {/* ── Encabezado de cierre ─────────────────────────────────── */}
        <View className="gap-2">
          <Typography variant="headingL">
            Tiene sentido.
          </Typography>
          <Typography
            variant="body"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Gracias por explorar esto. Lo que sientes es válido.
          </Typography>
        </View>

        {/* ── Card con la emoción confirmada + nota opcional ──────────── */}
        <Card variant="elevated">
          {/* Label "Hoy identificaste" */}
          <Typography
            variant="caption"
            className="text-script-text-secondary dark:text-script-dark-text-secondary mb-1"
          >
            Hoy identificaste:
          </Typography>

          {/* Emoción principal — tamaño grande */}
          <Typography variant="headingM">
            {emotion ?? "—"}
          </Typography>

          {/* Nota del usuario como cita (solo si la escribió) */}
          {notes ? (
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary mt-2"
            >
              "{notes}"
            </Typography>
          ) : null}
        </Card>

        {/* Spacer flexible */}
        <View className="flex-1" />

        {/* ── CTAs ─────────────────────────────────────────────────────── */}
        <View className="gap-3">
          {/* Guardar y volver al Home */}
          <Button
            title={isSaving ? "Guardando..." : "Guardar ✓"}
            onPress={() => saveCheckin(false)}
            variant="primary"
            disabled={isSaving}
            accessibilityHint="Guarda el check-in y vuelve al inicio"
          />

          {/* Marcar como delicado → flagged_for_review en Supabase */}
          <Button
            title="🚩 Esto no se siente bien"
            onPress={() => saveCheckin(true)}
            variant="ghost"
            disabled={isSaving}
            accessibilityHint={
              "Marca este check-in para revisión de tu terapeuta " +
              "y guarda. Solo lo verá alguien de confianza."
            }
          />
        </View>

      </View>
    </SafeScreen>
  );
}
