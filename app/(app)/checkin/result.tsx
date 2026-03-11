/**
 * result.tsx — S13: Check-in Result
 *
 * Final screen of the check-in flow. Shows the confirmed emotion,
 * allows saving it to Supabase, and offers flagging it as sensitive.
 *
 * Flow: S12 (reflect) → S13 → S09 (home) [replace, no push]
 *
 * T-V4 (2026-03-10): Full-screen emotional color background.
 * The screen adopts EmotionColors[key].bg as its background color —
 * this is the most emotionally significant moment in the check-in flow.
 * The emotion card inside also reflects the color for visual harmony.
 *
 * IMPORTANT: INSERT includes user_id explicitly — RLS validates but
 * does not inject it. Without user_id the INSERT fails with RLS error.
 * user_id comes from Zustand auth store (not Supabase auth) because
 * Privy manages authentication.
 *
 * B-40: If supabaseUserId is null or INSERT fails, a visible Alert is
 * shown with retry option — never navigates silently on failure.
 */
import React, { useState, useEffect, useRef } from "react";
import { View, Alert, Animated, useColorScheme } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";
import { getEmotionColors, toEmotionKey } from "@/constants/colors";

export default function CheckinResultScreen() {
  const router = useRouter();

  // user_id from auth store (NOT Supabase auth — Privy manages sessions)
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  const { zones: zonesParam, notes, emotion } = useLocalSearchParams<{
    zones: string;
    notes: string;
    emotion: string;
  }>();

  const zones = zonesParam?.split(",").filter(Boolean) ?? [];
  const [isSaving, setIsSaving] = useState(false);

  // B-DS: useRef guard prevents race-condition double-save.
  // useState(disabled) updates on next render cycle — if the user taps "Guardar"
  // twice within ~16ms (one frame), both taps fire before the button re-renders
  // as disabled. useRef updates synchronously so the second tap is blocked immediately.
  const isSavingRef = useRef(false);

  // T-V4: resolve emotion key → emotional color palette
  // B-DM: use getEmotionColors() to support dark mode — EmotionColors are light-only
  const colorScheme = useColorScheme();
  const emotionKey  = toEmotionKey(emotion);
  const colors      = getEmotionColors(emotionKey, colorScheme);

  // T-V4: 300ms fade-in animation for emotional background (feels gentle, not jarring)
  const bgOpacity = useRef(new Animated.Value(0)).current;
  useEffect(() => {
    Animated.timing(bgOpacity, {
      toValue: 1,
      duration: 300,
      useNativeDriver: false, // backgroundColor cannot use native driver
    }).start();
  }, [bgOpacity]);

  // Interpolate opacity → backgroundColor for the fade effect
  const animatedBg = bgOpacity.interpolate({
    inputRange:  [0, 1],
    outputRange: ["transparent", colors.bg],
  });

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
    // B-DS: synchronous guard — blocks any second call that arrives before
    // the first render cycle disables the button via isSaving state.
    if (isSavingRef.current) return;
    isSavingRef.current = true;

    // B-40: verificar userId antes de intentar INSERT
    if (!supabaseUserId) {
      isSavingRef.current = false; // reset ref — no INSERT attempted
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
      // Reset both ref and state — ref allows retry after error, state re-enables button UI
      isSavingRef.current = false;
      setIsSaving(false);
    }
  };

  return (
    // T-V4: SafeScreen bg is transparent; animated Animated.View provides the fade
    <SafeScreen scrollable={false}>
      {/* T-V4: Full-screen emotional color — 300ms fade from transparent */}
      <Animated.View
        style={{
          flex: 1,
          backgroundColor: animatedBg,
          paddingHorizontal: 20,
          paddingTop: 24,
          paddingBottom: 32,
          gap: 24,
        }}
      >
        {/* ── Closing message ──────────────────────────────────────── */}
        <View style={{ gap: 8 }}>
          <Typography variant="headingL" style={{ color: colors.text }}>
            Tiene sentido.
          </Typography>
          <Typography variant="body" style={{ color: colors.text, opacity: 0.75 }}>
            Gracias por explorar esto. Lo que sientes es válido.
          </Typography>
        </View>

        {/* ── Emotion summary card — colored to match bg ───────────── */}
        <View
          style={{
            borderRadius: 24,
            padding: 20,
            backgroundColor: colors.dot + "22", // dot color at 13% opacity — subtle tint
            borderWidth: 1.5,
            borderColor: colors.dot,
          }}
        >
          {/* 8px accent circle — mirrors EmotionCard visual language (T-V3) */}
          <View
            style={{
              width: 8,
              height: 8,
              borderRadius: 4,
              backgroundColor: colors.dot,
              marginBottom: 8,
            }}
          />
          <Typography variant="caption" style={{ color: colors.text, opacity: 0.7 }}>
            Hoy identificaste:
          </Typography>
          <Typography variant="headingM" style={{ color: colors.text, marginTop: 4 }}>
            {emotion ?? "—"}
          </Typography>
          {notes ? (
            <Typography
              variant="caption"
              style={{ color: colors.text, opacity: 0.7, marginTop: 8 }}
            >
              "{notes}"
            </Typography>
          ) : null}
        </View>

        <View style={{ flex: 1 }} />

        {/* ── CTAs ─────────────────────────────────────────────────── */}
        <View style={{ gap: 12 }}>
          <Button
            title={isSaving ? "Guardando..." : "Guardar ✓"}
            onPress={() => saveCheckin(false)}
            variant="primary"
            disabled={isSaving}
            accessibilityLabel={isSaving ? "Guardando tu check-in" : "Guardar check-in y volver al inicio"}
          />
          <Button
            title="🚩 Esto no se siente bien"
            onPress={() => saveCheckin(true)}
            variant="ghost"
            disabled={isSaving}
            accessibilityLabel="Guardar y marcar este check-in para revisión"
            accessibilityHint="Lo guardamos marcado para que puedas revisarlo más tarde"
          />
        </View>
      </Animated.View>
    </SafeScreen>
  );
}
