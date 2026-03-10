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
  /** If true, content is scrollable. Default: true */
  scrollable?: boolean;
  /** Additional NativeWind classes for the root container */
  className?: string;
  /** Crisis mode: script-crisis/script-dark-crisis background, no scroll indicator */
  crisis?: boolean;
  /**
   * Inline style override — use for dynamic values NativeWind can't handle
   * (e.g. emotional color backgrounds from EmotionColors[key].bg in T-V4).
   * Applied to the SafeAreaView root.
   */
  style?: import("react-native").ViewStyle;
}

export function SafeScreen({
  children,
  scrollable = true,
  className = "",
  crisis = false,
  style,
}: SafeScreenProps) {
  // Fondo de pantalla según modo crisis o tema normal
  const bgClass = crisis
    ? "bg-script-crisis dark:bg-script-dark-crisis"
    : "bg-script-bg dark:bg-script-dark-bg";

  // Non-scrollable — content manages its own layout
  if (!scrollable) {
    return (
      <SafeAreaView className={`flex-1 ${bgClass} ${className}`} style={style}>
        {children}
      </SafeAreaView>
    );
  }

  // Scrollable (default) — standard horizontal padding px-5
  return (
    <SafeAreaView className={`flex-1 ${bgClass}`} style={style}>
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
