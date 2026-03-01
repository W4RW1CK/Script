/**
 * SafeScreen — Wrapper de pantalla estándar para Script.
 *
 * Responsabilidades:
 *  - Aplica SafeArea (respeta notch, barra de estado, gestos del sistema)
 *  - Aplica el fondo del tema (light/dark) automáticamente
 *  - Padding horizontal estándar (px-5) en modo scrollable
 *  - Modo crisis: fondo suave especial para S17/S18
 *
 * Nota técnica:
 *  Usa SafeAreaView de 'react-native-safe-area-context' (NO el de 'react-native'
 *  que está deprecado en Expo 55). Requiere <SafeAreaProvider> en app/_layout.tsx.
 *
 * @example
 *   // Pantalla normal scrollable
 *   <SafeScreen><Typography>Hola</Typography></SafeScreen>
 *
 *   // Pantalla sin scroll (layout fijo)
 *   <SafeScreen scrollable={false}><BodyMap /></SafeScreen>
 *
 *   // Pantalla de crisis
 *   <SafeScreen crisis><Typography variant="crisis">Aquí estoy</Typography></SafeScreen>
 */
import { SafeAreaView } from "react-native-safe-area-context";
import { ScrollView } from "react-native";
import type { ReactNode } from "react";

interface SafeScreenProps {
  children: ReactNode;
  /** Si true, el contenido es scrollable. Default: true */
  scrollable?: boolean;
  /** Clases NativeWind adicionales para el contenedor raíz */
  className?: string;
  /** Modo crisis: fondo script-crisis/script-dark-crisis, sin scroll indicator */
  crisis?: boolean;
}

export function SafeScreen({
  children,
  scrollable = true,
  className = "",
  crisis = false,
}: SafeScreenProps) {
  // Fondo de pantalla según modo crisis o tema normal
  const bgClass = crisis
    ? "bg-script-crisis dark:bg-script-dark-crisis"
    : "bg-script-bg dark:bg-script-dark-bg";

  // Pantalla sin scroll — el contenido gestiona su propio layout
  if (!scrollable) {
    return (
      <SafeAreaView className={`flex-1 ${bgClass} ${className}`}>
        {children}
      </SafeAreaView>
    );
  }

  // Pantalla scrollable (default) — padding horizontal px-5
  return (
    <SafeAreaView className={`flex-1 ${bgClass}`}>
      <ScrollView
        className={`flex-1 px-5 ${className}`}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {children}
      </ScrollView>
    </SafeAreaView>
  );
}
