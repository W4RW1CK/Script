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
import React, { useState, useEffect, useCallback } from "react";
import { View, Alert, ActivityIndicator, useColorScheme } from "react-native";
// import * as Linking from "expo-linking"; // Reservado para magic link flow (Semana 3+)
import * as WebBrowser from "expo-web-browser";
import { useRouter } from "expo-router";
import { usePrivy, useLoginWithEmail, useLoginWithOAuth } from "@privy-io/expo";

/**
 * maybeCompleteAuthSession — OBLIGATORIO para OAuth en Expo.
 * Cuando Google redirige de vuelta a la app después del login,
 * esta llamada completa la sesión del browser y permite que
 * useLoginWithOAuth resuelva el callback. Sin esto, el browser
 * abre pero nunca regresa a la app. Debe llamarse a nivel módulo.
 */
WebBrowser.maybeCompleteAuthSession();
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

  // Privy — fuente de verdad para auth
  const { user: privyUser, ready: privyReady } = usePrivy();
  const router = useRouter();
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);

  /**
   * Guard de sesión existente — B-29.
   *
   * Cuando Expo Go reinicia, AuthGate puede llegar a /auth antes de que
   * privyUser cargue (race condition). Este efecto detecta si Privy ya tiene
   * sesión activa y redirige directamente, sin que el usuario tenga que
   * volver a loguearse.
   */
  useEffect(() => {
    if (!privyReady) return;
    if (!privyUser) return;
    // Ya hay sesión — dejar que AuthGate decida, pero si seguimos aquí redirigir
    if (onboardingComplete) {
      router.replace("/(app)/home");
    } else {
      router.replace("/(onboarding)");
    }
  }, [privyReady, privyUser, onboardingComplete]);

  // Estado local
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");         // A-02: estado local para el campo de código
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
  const handlePostLogin = useCallback(async (user: any) => {
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

      let completedOnboarding = false;
      if (!error && data?.user_id) {
        setSupabaseUserId(data.user_id);
        if (data.onboarding_complete) {
          setOnboardingComplete(true);
          completedOnboarding = true;
        }
      }

      // Navegar explícitamente desde aquí — no depender solo de AuthGate.
      // Si onboarding completo → home. Si no → primer paso del onboarding.
      if (completedOnboarding) {
        router.replace("/(app)/home");
      } else {
        router.replace("/(onboarding)");
      }
    } catch (e) {
      console.warn("[Auth] Error en post-login sync:", e);
      // Aun si falla el sync, enviar al onboarding — datos se pueden completar desde Settings
      router.replace("/(onboarding)");
    } finally {
      setIsLoading(false);
    }
  }, [router, setUser, setSupabaseUserId, setOnboardingComplete]);

  /**
   * Guard de sesión existente.
   *
   * Si Privy ya tiene una sesión válida cuando se monta esta pantalla
   * (p.ej. el usuario reinició la app), hacemos el sync automáticamente.
   * AuthGate debería haber redirigido, pero este es el safety net.
   */
  useEffect(() => {
    if (privyReady && privyUser) {
      handlePostLogin(privyUser);
    }
  }, [privyReady, privyUser, handlePostLogin]);

  /** Enviar código OTP al email */
  const handleSendCode = async () => {
    if (!email.trim()) return;
    setIsLoading(true);
    try {
      // NO pasamos redirectUrl aquí: estamos usando flujo OTP (código de 6 dígitos),
      // no magic link clickeable. redirectUrl solo es necesario si Privy debe redirigir
      // al usuario de vuelta a la app desde un link en el email.
      // Pasar redirectUrl con scheme exp:// causa "Redirect URL scheme is not allowed"
      // porque Privy no valida esquemas nativos en este contexto. (B-31 fix v2)
      await sendCode({ email: email.trim() });
      setAwaitingCode(true);
      setIsLoading(false);
    } catch {
      setIsLoading(false);
    }
  };

  /** Verificar código del magic link */
  const handleVerifyCode = async () => {
    if (!code.trim()) return;
    setIsLoading(true);
    try {
      await loginWithCode({ code: code.trim() });
      // onLoginSuccess se encarga del resto via callback
    } catch (e) {
      // A-01: mostrar error al usuario — el try/catch no debe tragarse el error silenciosamente
      const msg = e instanceof Error ? e.message : "Código incorrecto. Intenta de nuevo.";
      Alert.alert("Error", msg);
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

  /**
   * Early return — sesión ya activa.
   *
   * Si Privy todavía está cargando (ready=false) o ya tiene una sesión válida,
   * NO mostramos el formulario de login. Razones:
   * 1. Evita el error "Already logged in" al intentar sendCode/loginWithOAuth
   * 2. El useEffect de sesión existente se encarga de llamar handlePostLogin → navegar
   * 3. Mientras Privy carga (!ready), no sabemos si hay sesión — pantalla neutral
   */
  if (!privyReady || privyUser) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center gap-4">
          <Ionicons
            name="document-text-outline"
            size={48}
            color={isDark ? "#5A7E92" : "#A8C5DA"}
          />
          <ActivityIndicator
            size="large"
            color={isDark ? "#5A7E92" : "#A8C5DA"}
          />
          <Typography
            variant="body"
            className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            {privyUser ? "Cargando tu sesión..." : "Iniciando..."}
          </Typography>
        </View>
      </SafeScreen>
    );
  }

  return (
    <SafeScreen>
      <View className="flex-1 px-6 pt-16 pb-8">
        {/* Logo / Nombre */}
        <View className="items-center gap-4 mb-12">
          <Ionicons
            name="document-text-outline"
            size={64}
            color={isDark ? "#5A7E92" : "#A8C5DA"} // script-dark-blue / script-blue
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
            {/* A-02: campo controlado con value+onChangeText para que el texto sea visible en Android */}
            <TextInput
              value={code}
              onChangeText={setCode}
              placeholder="Código de verificación"
              keyboardType="number-pad"
              autoComplete="one-time-code"
              accessibilityLabel="Código de verificación"
            />
            <Button
              title={isLoading ? "Verificando..." : "Verificar código"}
              onPress={handleVerifyCode}
              variant="primary"
              disabled={isLoading || !code.trim()}
            />
            <Button
              title="← Cambiar email"
              variant="ghost"
              onPress={() => { setAwaitingCode(false); setCode(""); }}
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
