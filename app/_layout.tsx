/**
 * Root layout de la aplicación Script.
 *
 * Responsabilidades:
 *  - Importa polyfills PRIMERO (Buffer + crypto para Privy/jose)
 *  - Carga fuentes Inter (Regular/SemiBold/Bold) y FontAwesome
 *  - Mantiene el SplashScreen visible hasta que las fuentes estén listas
 *  - Envuelve la app en PrivyProvider para autenticación
 *  - AuthGate: redirige a /auth si no hay sesión, o a /onboarding si falta
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
import { PrivyProvider } from "@privy-io/expo";
import { useFonts } from "expo-font";
import { Stack, useRouter, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme, View } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { RescueFAB } from "@/components/rescue/RescueFAB";
import { useAuthStore } from "@/stores/auth";

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
  const user = useAuthStore((s) => s.user);
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);

  useEffect(() => {
    // Determinar en qué grupo de rutas estamos
    const inAuthGroup = segments[0] === "auth";
    const inOnboardingGroup = segments[0] === "(onboarding)";
    const inAppGroup = segments[0] === "(app)";

    if (!user) {
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
  }, [user, onboardingComplete, segments]);

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

  return (
    <PrivyProvider appId={process.env.EXPO_PUBLIC_PRIVY_APP_ID!}>
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
