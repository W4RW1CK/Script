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
 * - Si sync retorna access_token, se activa la sesión Supabase (B-51 — RLS)
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
import { useRouter, Redirect } from "expo-router";
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
import { supabase, setSupabaseToken } from "@/lib/supabase"; // B-51: setSupabaseToken activa RLS

export default function AuthScreen() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";
  const setUser = useAuthStore((s) => s.setUser);
  const setSupabaseUserId = useAuthStore((s) => s.setSupabaseUserId);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  // Privy — fuente de verdad para auth
  // `authenticated` es un boolean directo — más confiable que checar `user !== null`
  // porque `user` puede ser null brevemente mientras la sesión se restaura de SecureStore
  const { user: privyUser, ready: privyReady, authenticated } = usePrivy();
  const router = useRouter();
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);

  /**
   * Sync de sesión en background — B-37 / B-29.
   *
   * Cuando hay sesión activa (authenticated=true) y privyUser ya cargó,
   * sincronizamos con Supabase para obtener supabaseUserId y onboarding_complete.
   * La navegación ya la maneja el <Redirect> declarativo abajo — este efecto
   * solo actualiza el store, no navega.
   */
  useEffect(() => {
    if (!privyReady || !authenticated || !privyUser) return;
    if (useAuthStore.getState().user?.supabaseUserId) return; // ya sincronizado

    const privyId = privyUser.id;
    const userEmail =
      (privyUser as any).email?.address ||
      (privyUser as any).linked_accounts?.find((a: any) => a.type === "email")?.address ||
      null;
    setUser({ privyId, email: userEmail, supabaseUserId: null });

    supabase.functions
      .invoke("sync-privy-user", {
        body: { privy_user_id: privyId, email: userEmail },
      })
      .then(({ data, error }) => {
        if (!error && data?.user_id) {
          setSupabaseUserId(data.user_id);
          if (data.onboarding_complete) {
            setOnboardingComplete(true);
            // El <Redirect> se re-evaluará automáticamente con el nuevo onboardingComplete
          }
        }
      })
      .catch((e) => {
        console.warn("[Auth] Background sync failed (non-blocking):", e);
      });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [privyReady, authenticated, privyUser]);

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
      // Timeout de 5s — si la Edge Function no responde, seguir con navigate
      const syncTimeout = new Promise<{ data: null; error: Error }>(
        (resolve) =>
          setTimeout(
            () => resolve({ data: null, error: new Error("sync timeout") }),
            5000
          )
      );
      const { data, error } = await Promise.race([
        supabase.functions.invoke("sync-privy-user", {
          body: { privy_user_id: privyId, email: userEmail },
        }),
        syncTimeout,
      ]);

      let completedOnboarding = false;
      if (!error && data?.user_id) {
        setSupabaseUserId(data.user_id);
        if (data.onboarding_complete) {
          setOnboardingComplete(true);
          completedOnboarding = true;
        }
        // B-51 v2: activar sesión Supabase via verifyOtp con el token hash.
        // sync-privy-user retorna otp_token_hash generado por Admin API generateLink.
        // verifyOtp produce una sesión real → auth.uid() funciona → RLS resuelto.
        // fire-and-forget: si falla, la app sigue funcionando (solo scripts públicos sin auth)
        if (data.otp_token_hash) {
          setSupabaseToken(data.otp_token_hash).catch((e) =>
            console.warn("[Auth] setSupabaseToken failed:", e)
          );
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

  // El guard de sesión existente está arriba (B-37).
  // handlePostLogin se llama SOLO desde los callbacks de Privy (OTP/OAuth).

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
   * Early return — sesión ya activa o Privy cargando.
   *
   * Si Privy todavía está cargando (!ready) o ya hay sesión (authenticated),
   * NO mostramos el formulario de login. Razones:
   * 1. Evita el error "Already logged in" al intentar sendCode/loginWithOAuth
   * 2. El useEffect de sesión redirige al destino correcto
   * 3. Mientras Privy carga, mostramos spinner neutral — sin flash de login form
   */
  // Privy aún cargando — mostrar spinner neutro, sin tomar decisiones
  if (!privyReady) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center gap-4">
          <Ionicons name="document-text-outline" size={48} color={isDark ? "#5A7E92" : "#A8C5DA"} />
          <ActivityIndicator size="large" color={isDark ? "#5A7E92" : "#A8C5DA"} />
          <Typography variant="body" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary">
            Iniciando...
          </Typography>
        </View>
      </SafeScreen>
    );
  }

  // Privy listo + sesión activa → Redirect síncrono (más confiable que router.replace en useEffect)
  // Redirect de Expo Router es declarativo — no compite con AuthGate, no hay race condition
  if (authenticated) {
    return <Redirect href={onboardingComplete ? "/(app)/home" : "/(onboarding)"} />;
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
