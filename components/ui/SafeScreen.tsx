import { SafeAreaView, ScrollView } from "react-native";
import type { ReactNode } from "react";

interface SafeScreenProps {
  children: ReactNode;
  /** Si true, el contenido es scrollable. Default: true */
  scrollable?: boolean;
  /** Clases extra para el contenedor */
  className?: string;
  /** Modo crisis: fondo especial, sin padding extra */
  crisis?: boolean;
}

/**
 * Wrapper de pantalla estándar para Script.
 * Incluye SafeArea + fondo del tema + padding horizontal.
 * En modo crisis: fondo color-crisis-bg, sin scroll indicator.
 */
export function SafeScreen({
  children,
  scrollable = true,
  className = "",
  crisis = false,
}: SafeScreenProps) {
  const bgClass = crisis
    ? "bg-script-crisis dark:bg-script-dark-crisis"
    : "bg-script-bg dark:bg-script-dark-bg";

  if (!scrollable) {
    return (
      <SafeAreaView className={`flex-1 ${bgClass} ${className}`}>
        {children}
      </SafeAreaView>
    );
  }

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
