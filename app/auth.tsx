/**
 * auth.tsx — S24: Pantalla de Login
 *
 * Ofrece dos métodos de autenticación via Privy:
 * 1. Email magic link — sin contraseña, el usuario recibe un link por email
 * 2. Google OAuth — login con cuenta de Google
 *
 * Tras login exitoso:
 * - Se extrae el user del RESULTADO de la función (no del hook usePrivy)
 *   para evitar stale closures en callbacks async
 * - Se llama a sync-privy-user Edge Function para crear/actualizar en Supabase
 * - Se guarda en el Zustand auth store
 * - AuthGate en _layout.tsx redirige automáticamente según onboarding_complete
 *
 * Diseño: minimalista, tono cálido, sin presión.
 * Texto: "Sin cuenta, solo un email. Tus datos son tuyos."
 */
import React, { useState } from "react";
import { View, Alert, useColorScheme } from "react-native";
import { useLoginWithEmail, useLoginWithOAuth } from "@privy-io/expo";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Button, TextInput } from "@/components/ui";
import { useAuthStore } from "@/stores/auth";
import { supabase } from "@/lib/supabase";

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const setUser = useAuthStore((s) => s.setUser);
  const setSupabaseUserId = useAuthStore((s) => s.setSupabaseUserId);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  // Estado local
  const [email, setEmail] = useState("");
  const [awaitingCode, setAwaitingCode] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Privy hooks para login
  const { sendCode, loginWithCode } = useLoginWithEmail({
    onLoginSuccess: (user) => {
      // Este callback se llama tras verificar el código
      handlePostLogin(user);
    },
    onError: (err) => {
      setIsLoading(false);
      Alert.alert("Error", err.message || "No se pudo iniciar sesión");
    },
  });

  const { login: loginWithOAuth } = useLoginWithOAuth({
    onSuccess: (user) => {
      handlePostLogin(user);
    },
    onError: (err) => {
      setIsLoading(false);
      Alert.alert("Error", err.message || "No se pudo iniciar sesión con Google");
    },
  });

  /**
   * Post-login: sincronizar con Supabase y guardar en store
   *
   * IMPORTANTE: usamos el `user` del resultado/callback, NO de usePrivy().user
   * porque el hook puede tener un valor stale en callbacks async.
   */
  const handlePostLogin = async (user: any) => {
    try {
      // Extraer datos del usuario de Privy
      const privyId = user.id;
      const userEmail =
        user.email?.address ||
        user.linked_accounts?.find((a: any) => a.type === "email")?.address ||
        null;

      // Guardar en auth store inmediatamente
      setUser({ privyId, email: userEmail, supabaseUserId: null });

      // Sincronizar con Supabase via Edge Function
      const { data, error } = await supabase.functions.invoke(
        "sync-privy-user",
        {
          body: { privy_user_id: privyId, email: userEmail },
        }
      );

      if (!error && data?.user_id) {
        setSupabaseUserId(data.user_id);
        // Verificar si ya completó onboarding
        if (data.onboarding_complete) {
          setOnboardingComplete(true);
        }
      }
    } catch (e) {
      console.warn("[Auth] Error en post-login sync:", e);
    } finally {
      setIsLoading(false);
    }
  };

  /** Enviar magic link al email */
  const handleSendCode = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      await sendCode({ email: email.trim() });
      setAwaitingCode(true);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  /** Verificar código del magic link */
  const handleVerifyCode = async (code: string) => {
    setIsLoading(true);
    try {
      await loginWithCode({ code });
      // onLoginSuccess se encarga del resto
    } catch {
      setIsLoading(false);
    }
  };

  /** Login con Google OAuth */
  const handleGoogleLogin = async () => {
    setIsLoading(true);
    try {
      await loginWithOAuth({ provider: "google" });
      // onSuccess se encarga del resto
    } catch {
      setIsLoading(false);
    }
  };

  return (
    <SafeScreen>
      <View className="flex-1 px-6 pt-16 pb-8">
        {/* Logo / Nombre */}
        <View className="items-center gap-4 mb-12">
          <Ionicons
            name="document-text-outline"
            size={64}
            color={isDark ? "#5A7E92" : "#A8C5DA"}
          />
          <Typography variant="headingL">Script</Typography>
          <Typography
            variant="body"
            className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Sin cuenta, solo un email.{"\n"}Tus datos son tuyos.
          </Typography>
        </View>

        {/* Formulario de email / código */}
        {!awaitingCode ? (
          <View className="gap-4">
            <TextInput
              value={email}
              onChangeText={setEmail}
              placeholder="tu@email.com"
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
              accessibilityLabel="Dirección de email"
            />
            <Button
              title={isLoading ? "Enviando..." : "Continuar con email"}
              onPress={handleSendCode}
              variant="primary"
              disabled={isLoading || !email.trim()}
            />
          </View>
        ) : (
          <View className="gap-4">
            <Typography variant="body" className="text-center">
              Revisa tu email. Te enviamos un código de verificación.
            </Typography>
            <TextInput
              placeholder="Código de verificación"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              onSubmitEditing={(e) =>
                handleVerifyCode(e.nativeEvent.text)
              }
              accessibilityLabel="Código de verificación"
            />
            <Button
              title="← Cambiar email"
              variant="ghost"
              onPress={() => setAwaitingCode(false)}
            />
          </View>
        )}

        {/* Separador */}
        <View className="flex-row items-center my-8">
          <View className="flex-1 h-px bg-script-border dark:bg-script-dark-border" />
          <Typography
            variant="caption"
            className="mx-4 text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            o
          </Typography>
          <View className="flex-1 h-px bg-script-border dark:bg-script-dark-border" />
        </View>

        {/* Google OAuth */}
        <Button
          title={isLoading ? "Conectando..." : "Continuar con Google"}
          onPress={handleGoogleLogin}
          variant="secondary"
          disabled={isLoading}
        />

        <View className="flex-1" />

        {/* Footer legal */}
        <Typography
          variant="caption"
          className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
        >
          Al continuar aceptas nuestros Términos de Servicio y Política de
          Privacidad. Tus datos se encriptan y nunca se comparten.
        </Typography>
      </View>
    </SafeScreen>
  );
}
