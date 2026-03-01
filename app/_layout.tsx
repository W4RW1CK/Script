/**
 * Root layout de la aplicación Script.
 * Responsabilidades:
 *  - Carga fuentes Inter (Regular/SemiBold/Bold) y FontAwesome
 *  - Mantiene el SplashScreen visible hasta que las fuentes estén listas
 *  - Aplica ThemeProvider (light/dark) según el sistema operativo
 *  - Define la estructura de navegación raíz con Expo Router Stack
 */
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
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import "react-native-reanimated";
import { useColorScheme } from "react-native";
import { SafeAreaProvider } from "react-native-safe-area-context";

// Re-exporta el ErrorBoundary de Expo Router para capturar errores en pantallas
export { ErrorBoundary } from "expo-router";

// La pantalla inicial es (app) — zona autenticada con Tab Navigator
// En Fase 1.8 se agregará lógica de auth: usuarios no autenticados → (onboarding)
export const unstable_settings = {
  initialRouteName: "(app)",
};

// Mantiene el splash screen hasta que las fuentes terminen de cargar
SplashScreen.preventAutoHideAsync();

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

  // No renderizar nada hasta que las fuentes estén listas
  if (!loaded) {
    return null;
  }

  return <RootLayoutNav />;
}

/**
 * Navegación raíz — envuelve toda la app en ThemeProvider
 * para que los colores del sistema (light/dark) se propaguen a React Navigation.
 */
function RootLayoutNav() {
  const colorScheme = useColorScheme();

  return (
    // SafeAreaProvider requerido por react-native-safe-area-context
    // Todos los SafeAreaView (en SafeScreen) dependen de este contexto
    <SafeAreaProvider>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack>
          {/* (app) contiene el Tab Navigator principal (Home, Check-in, Scripts, etc.) */}
          <Stack.Screen name="(app)" options={{ headerShown: false }} />
          {/* (onboarding) se activa en Fase 1.8 — Privy auth */}
          {/* <Stack.Screen name="(onboarding)" options={{ headerShown: false }} /> */}
        </Stack>
      </ThemeProvider>
    </SafeAreaProvider>
  );
}
