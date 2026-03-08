/**
 * Root layout de la aplicación Script.
 *
 * Responsabilidades:
 *  - Importa polyfills PRIMERO (Buffer + crypto para Privy/jose)
 *  - Carga fuentes Inter (Regular/SemiBold/Bold) y FontAwesome
 *  - Mantiene el SplashScreen visible hasta que las fuentes estén listas
 *  - Envuelve la app en PrivyProvider para autenticación
 *  - AuthGate: redirige a /auth si no hay sesión, o a /onboarding si falta
 *  - Al arranque sincroniza sesión Privy→Zustand si el store se reseteó
 *  - Aplica ThemeProvider (light/dark) según el sistema operativo
 *  - Define la estructura de navegación raíz con Expo Router Stack
 */

// ⚠️ POLYFILLS PRIMERO — antes de cualquier import que use crypto/Buffer
import "../polyfills";
import "../global.css";

import FontAwesome from "@expo/vector-icons/FontAwesome";
import {
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold,
} from "@expo-google-fonts/inter";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { PrivyProvider, usePrivy } from "@privy-io/expo";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import React, { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RescueFAB } from "@/components/rescue/RescueFAB";
import { useAuthStore } from "@/stores/auth";
import { supabase, setSupabaseToken } from "@/lib/supabase"; // B-51

// Re-exporta el ErrorBoundary de Expo Router para capturar errores en pantallas
export { ErrorBoundary } from "expo-router";

// La pantalla inicial es auth — usuarios no autenticados empiezan aquí
export const unstable_settings = {
  initialRouteName: "auth",
};

// Mantiene el splash screen hasta que las fuentes terminen de cargar
SplashScreen.preventAutoHideAsync();

/**
 * AuthGate — componente que maneja la navegación basada en estado de auth.
 *
 * Lógica:
 * - Sin usuario → redirige a /auth
 * - Con usuario pero sin onboarding → redirige a /(onboarding)
 * - Con usuario y onboarding completo → permite acceso a /(app)
 *
 * Se ejecuta como efecto después del render para no interferir
 * con la navegación de Expo Router.
 */
function AuthGate({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const segments = useSegments();

  // Privy es la fuente de verdad para auth — persiste en SecureStore entre arranques.
  // useAuthStore().user es solo una copia en memoria (se resetea al reiniciar la app).
  //
  // IMPORTANTE: usar `authenticated` (boolean) en vez de `user` (objeto).
  // `user` puede ser null brevemente mientras Privy restaura la sesión de SecureStore,
  // aunque `authenticated` ya sea true. Usar `user` causaba un loop:
  //   auth.tsx redirige a /(onboarding) → AuthGate ve user=null → manda de vuelta a /auth
    // @privy-io/expo v0.63 API: `ready` → `isReady`, no `authenticated` field.
  // `authenticated` = !!user (user is null when not logged in)
  const { user: privyUser, isReady: privyReady } = usePrivy();
  const authenticated = !!privyUser;

  // Estado local de Zustand (en memoria — no persiste entre reinicios)
  const storeUser = useAuthStore((s) => s.user);
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);
  const setUser = useAuthStore((s) => s.setUser);
  const setSupabaseUserId = useAuthStore((s) => s.setSupabaseUserId);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  /**
   * Efecto de sincronización al arranque.
   *
   * Si Privy tiene sesión (authenticated) pero Zustand no tiene datos (storeUser null),
   * llamamos a sync-privy-user para restaurar user_id y onboarding_complete desde Supabase.
   * Usamos `authenticated` en lugar de `privyUser` para no depender del objeto user
   * que puede tardar más en popularse.
   */
  useEffect(() => {
    if (!privyReady) return;           // Esperar a que Privy termine de cargar
    if (!authenticated) return;        // Sin sesión, nada que sincronizar
    if (storeUser) return;             // Zustand ya tiene el usuario, no re-sincronizar
    if (!privyUser) return;            // Necesitamos el objeto user para extraer email/id

    // Privy tiene sesión pero Zustand está vacío → restaurar
    const privyId = privyUser.id;
    const userEmail =
      (privyUser as any).email?.address ||
      (privyUser as any).linked_accounts?.find(
        (a: any) => a.type === "email"
      )?.address ||
      null;

    // Setear usuario básico en Zustand de inmediato
    setUser({ privyId, email: userEmail, supabaseUserId: null });

    // Luego obtener datos completos de Supabase (incluyendo onboarding_complete)
    supabase.functions
      .invoke("sync-privy-user", {
        body: { privy_user_id: privyId, email: userEmail },
      })
      .then(({ data, error }) => {
        if (!error && data?.user_id) {
          setSupabaseUserId(data.user_id);
          if (data.onboarding_complete) {
            setOnboardingComplete(true);
          }
          // B-51 v2: restaurar sesión Supabase al reiniciar la app.
          // sync-privy-user retorna otp_token_hash → verifyOtp genera sesión real.
          // auth.uid() funciona → RLS policies se resuelven correctamente.
          if (data.otp_token_hash) {
            setSupabaseToken(data.otp_token_hash).catch((e) =>
              console.warn("[AuthGate] setSupabaseToken failed:", e)
            );
          }
        }
      })
      .catch((e) => {
        console.warn("[AuthGate] Error sincronizando sesión al arranque:", e);
      });
  }, [privyReady, authenticated, privyUser, storeUser]);

  /**
   * Flag que indica que ya esperamos el ciclo completo de Privy.
   *
   * `privyReady=true` no garantiza que `authenticated` sea definitivo —
   * Privy puede tardar un ciclo adicional en restaurar la sesión de SecureStore.
   * Esperamos un tick (setTimeout 0) para que React procese el estado final
   * antes de tomar decisiones de navegación. Esto rompe el loop:
   *   auth.tsx redirige → AuthGate ve authenticated=false (lag) → manda a /auth
   */
  const [navReady, setNavReady] = React.useState(false);
  useEffect(() => {
    if (!privyReady) return;
    // Esperar un tick para que Privy termine de restaurar la sesión de SecureStore
    const t = setTimeout(() => setNavReady(true), 100);
    return () => clearTimeout(t);
  }, [privyReady]);

  /**
   * Efecto de navegación.
   *
   * Decide a dónde ir basado en el estado combinado de Privy + Zustand.
   * Fuente de verdad para "¿hay sesión?": `authenticated` (Privy, responde inmediato).
   * Fuente de verdad para "¿completó onboarding?": onboardingComplete (Zustand/Supabase).
   */
  useEffect(() => {
    // Esperar a que Privy haya cargado Y al tick extra de restauración de sesión
    if (!navReady) return;

    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inAppGroup = segments[0] === "(app)";

    // ⚠️ EXCEPCIÓN CRÍTICA: rescue es siempre accesible — incluso sin auth.
    const inRescueGroup = inAppGroup && segments[1] === "rescue";
    if (inRescueGroup) return;

    // `authenticated` responde inmediato desde SecureStore — no tiene el lag de `user`
    const hasSession = authenticated || !!storeUser;

    if (!hasSession) {
      // Sin sesión → ir a auth (solo si no estamos ya ahí)
      if (!inAuthGroup) {
        router.replace("/auth");
      }
    } else if (!onboardingComplete) {
      // Con sesión pero sin onboarding → ir a onboarding
      if (!inOnboardingGroup) {
        router.replace("/(onboarding)");
      }
    } else {
      // Sesión completa → ir a app (solo si estamos en auth u onboarding)
      if (inAuthGroup || inOnboardingGroup) {
        router.replace("/(app)/home");
      }
    }
  }, [navReady, authenticated, storeUser, onboardingComplete, segments]);

  return <>{children}</>;
}

export default function RootLayout() {
  // Carga Inter (tipografía principal de Script) + íconos FontAwesome
  const [loaded, error] = useFonts({
    Inter_400Regular,
    Inter_600SemiBold,
    Inter_700Bold,
    ...FontAwesome.font,
  });

  // Si hubo error cargando fuentes, lo lanzamos para que ErrorBoundary lo capture
  useEffect(() => {
    if (error) throw error;
  }, [error]);

  // Cuando las fuentes cargan, ocultamos el splash screen
  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

/**
 * Navegación raíz — PrivyProvider + ThemeProvider + AuthGate
 *
 * PrivyProvider: autenticación con Privy (magic link + Google OAuth)
 * ThemeProvider: colores del sistema (light/dark) para React Navigation
 * AuthGate: redirige según estado de autenticación
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  // DIAGNOSTIC: log env vars presence (not values) and Privy module
  console.log("[Layout] appId set:", !!process.env.EXPO_PUBLIC_PRIVY_APP_ID);
  console.log("[Layout] clientId set:", !!process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID);
  console.log("[Layout] PrivyProvider type:", typeof PrivyProvider);

  return (
    <PrivyProvider
      appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}
      clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID!}
    >
      <SafeAreaProvider>
        <ThemeProvider
          value={colorScheme === "dark" ? DarkTheme : DefaultTheme}
        >
          <AuthGate>
            <View style={{ flex: 1, position: "relative" }}>
              <Stack>
                {/* Pantalla de login */}
                <Stack.Screen name="auth" options={{ headerShown: false }} />
                {/* Flujo de onboarding (tests + perfil) */}
                <Stack.Screen
                  name="(onboarding)"
                  options={{ headerShown: false }}
                />
                {/* App principal con Tab Navigator */}
                <Stack.Screen name="(app)" options={{ headerShown: false }} />
              </Stack>

              {/* RescueFAB visible en todas las pantallas */}
              <RescueFAB />
            </View>
          </AuthGate>
        </ThemeProvider>
      </SafeAreaProvider>
    </PrivyProvider>
  );
}
