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
 */
import React, { useState } from "react";
import { View } from "react-native";
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
   * Guarda el check-in en Supabase.
   *
   * CRÍTICO: incluir user_id explícitamente en el INSERT.
   * RLS valida que user_id coincida con el usuario autenticado,
   * pero NO inyecta el campo automáticamente.
   */
  const saveCheckin = async (flagged: boolean = false) => {
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
        console.warn("[CheckinResult] INSERT error:", error.message);
      }
    } catch (e) {
      console.warn("[CheckinResult] Exception:", e);
    } finally {
      setIsSaving(false);
      router.replace("/(app)/home");
    }
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-5 pt-6 pb-8 gap-6">
        <View className="gap-2">
          <Typography variant="headingL">Tiene sentido.</Typography>
          <Typography
            variant="body"
            className="text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Gracias por explorar esto. Lo que sientes es válido.
          </Typography>
        </View>

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

        <View className="gap-3">
          <Button
            title={isSaving ? "Guardando..." : "Guardar ✓"}
            onPress={() => saveCheckin(false)}
            variant="primary"
            disabled={isSaving}
          />
          <Button
            title="🚩 Esto no se siente bien"
            onPress={() => saveCheckin(true)}
            variant="ghost"
            disabled={isSaving}
          />
        </View>
      </View>
    </SafeScreen>
  );
}
