/**
 * result.tsx — S13: Resultado del Check-in
 *
 * Última pantalla del flujo de check-in. Muestra la emoción confirmada,
 * permite guardarla en Supabase y ofrece marcarla como "delicada".
 *
 * Flujo: S12 (reflect) → S13 → S09 (home) [replace, no push]
 *
 * IMPORTANTE: El INSERT incluye user_id explícitamente porque RLS
 * no inyecta campos automáticamente — solo los valida. Sin user_id
 * el INSERT falla con "new row violates row-level security policy".
 *
 * El user_id se obtiene del auth store (Zustand), no de Supabase auth,
 * porque usamos Privy para autenticación.
 *
 * B-40: Antes este archivo navegaba a home silenciosamente aunque el
 * INSERT fallara (por user_id null o error RLS). Ahora muestra un Alert
 * explicativo con opción de reintentar o continuar sin guardar.
 */
import React, { useState } from "react";
import { View, Alert } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

export default function CheckinResultScreen() {
  const router = useRouter();

  // Obtener user_id del auth store (NO de Supabase auth)
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  const { zones: zonesParam, notes, emotion } = useLocalSearchParams<{
    zones: string;
    notes: string;
    emotion: string;
  }>();

  const zones = zonesParam?.split(",").filter(Boolean) ?? [];
  const [isSaving, setIsSaving] = useState(false);

  /**
   * Navegar al home después de guardar (o decidir no guardar).
   * Siempre usa replace para que el usuario no pueda volver al resultado.
   */
  const goHome = () => router.replace("/(app)/home");

  /**
   * Guarda el check-in en Supabase.
   *
   * B-40: si supabaseUserId es null o el INSERT falla, se muestra un Alert
   * visible al usuario con opciones claras — no se navega silenciosamente
   * sin confirmar que el dato fue guardado.
   *
   * @param flagged - true si el usuario marcó el check-in como "delicado"
   */
  const saveCheckin = async (flagged: boolean = false) => {
    // B-40: verificar userId antes de intentar INSERT
    if (!supabaseUserId) {
      Alert.alert(
        "No se pudo guardar",
        "Tu sesión no está sincronizada todavía. Puedes reintentar desde Inicio → Perfil → Ajustes, o continuar sin guardar este check-in.",
        [
          {
            text: "Continuar sin guardar",
            style: "destructive",
            onPress: goHome,
          },
        ],
        { cancelable: false }
      );
      return;
    }

    setIsSaving(true);

    try {
      const { error } = await supabase.from("checkins").insert({
        user_id: supabaseUserId,       // ⚠️ EXPLÍCITO — RLS no lo inyecta
        body_zones: zones,
        free_text: notes ?? "",
        emotion_confirmed: emotion ?? "",
        flagged_for_review: flagged,
      });

      if (error) {
        // B-40: error visible — no continuar silenciosamente si el INSERT falló
        console.warn("[CheckinResult] INSERT error:", error.message);
        Alert.alert(
          "No se pudo guardar",
          "Hubo un problema al guardar tu check-in. ¿Quieres reintentar?",
          [
            {
              text: "Reintentar",
              onPress: () => {
                setIsSaving(false);
                saveCheckin(flagged);
              },
            },
            {
              text: "Continuar sin guardar",
              style: "cancel",
              onPress: () => {
                setIsSaving(false);
                goHome();
              },
            },
          ],
          { cancelable: false }
        );
        return; // No navegar todavía — esperamos la decisión del usuario
      }

      // Guardado exitoso → ir al inicio
      goHome();

    } catch (e) {
      console.warn("[CheckinResult] Exception:", e);
      // B-40: exception también muestra feedback visible
      Alert.alert(
        "Sin conexión",
        "No se pudo conectar al servidor. Tu check-in no fue guardado.",
        [
          { text: "Continuar sin guardar", onPress: goHome },
        ],
        { cancelable: false }
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pt-6 pb-8 gap-6">

        {/* ── Mensaje de cierre ─────────────────────────────────────── */}
        <View className="gap-2">
          <Typography variant="headingL">Tiene sentido.</Typography>
          <Typography
            variant="body"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Gracias por explorar esto. Lo que sientes es válido.
          </Typography>
        </View>

        {/* ── Card con emoción identificada ────────────────────────── */}
        <Card variant="elevated">
          <Typography
            variant="caption"
            className="text-script-text-secondary dark:text-script-dark-text-secondary mb-1"
          >
            Hoy identificaste:
          </Typography>
          <Typography variant="headingM">{emotion ?? "—"}</Typography>
          {notes ? (
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary mt-2"
            >
              "{notes}"
            </Typography>
          ) : null}
        </Card>

        <View className="flex-1" />

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <View className="gap-3">
          {/* Guardar — acción principal */}
          <Button
            title={isSaving ? "Guardando..." : "Guardar ✓"}
            onPress={() => saveCheckin(false)}
            variant="primary"
            disabled={isSaving}
            accessibilityLabel={isSaving ? "Guardando tu check-in" : "Guardar check-in y volver al inicio"}
          />

          {/* Marcar como delicado — acción secundaria */}
          <Button
            title="🚩 Esto no se siente bien"
            onPress={() => saveCheckin(true)}
            variant="ghost"
            disabled={isSaving}
            accessibilityLabel="Guardar y marcar este check-in para revisión"
            accessibilityHint="Lo guardamos marcado para que puedas revisarlo más tarde"
          />
        </View>

      </View>
    </SafeScreen>
  );
}
