/**
 * Chip / tag de Script.
 *
 * Uso: zonas corporales en el mapa (S10), categorías de scripts (S14),
 * filtros de historial (S19).
 *
 * Estados:
 *  - selected=false: fondo secundario, texto secundario
 *  - selected=true: fondo azul con 20% opacidad, texto azul
 *
 * Accesibilidad:
 *  - accessibilityState={{ selected }} comunica el estado a lectores de pantalla
 *  - Opacidad 70% al presionar como feedback visual
 */
import { Pressable, StyleSheet, Text, useColorScheme } from "react-native";
import { useState } from "react";

interface ChipProps {
  label: string;
  /** Si el chip está activo/seleccionado */
  selected?: boolean;
  onPress?: () => void;
  /** Label para lectores de pantalla (default: usa label) */
  accessibilityLabel?: string;
}

/**
 * T-U3: NativeWind font-semibold only sets fontWeight — Atkinson has no SemiBold.
 * Use Bold (700) via StyleSheet so fontFamily is actually set.
 */
const chipTextStyle = StyleSheet.create({
  label: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 14,
    lineHeight: 18,
  },
});

export function Chip({
  label,
  selected = false,
  onPress,
  accessibilityLabel,
}: ChipProps) {
  // T-U8: focus state for switch access / keyboard navigation
  const [focused, setFocused] = useState(false);
  const isDark = useColorScheme() === "dark";
  // Calm ripple color — script-blue at low opacity (non-jarring for ASD users)
  const rippleColor = isDark ? "rgba(90, 126, 146, 0.25)" : "rgba(168, 197, 218, 0.35)";
  const focusBorderColor = isDark ? "#5A7E92" : "#A8C5DA";

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      // Comunica estado seleccionado a VoiceOver / TalkBack
      accessibilityState={{ selected }}
      // T-U8: android_ripple gives visual tap feedback on Android (sensory-safe, low opacity)
      android_ripple={{ color: rippleColor, borderless: true }}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      className={`rounded-full py-1 px-3 ${
        // Seleccionado: azul translúcido | No seleccionado: fondo neutro
        selected
          ? "bg-script-blue/20 dark:bg-script-dark-blue/20"
          : "bg-script-bg-secondary dark:bg-script-dark-secondary"
      }`}
      style={({ pressed }) => ({
        opacity: pressed ? 0.7 : 1,
        // T-U8: visible focus ring for switch access / TalkBack keyboard nav
        ...(focused && {
          borderWidth: 2,
          borderColor: focusBorderColor,
        }),
      })}
    >
      {/* T-U3: fontFamily via StyleSheet; color via NativeWind className */}
      <Text
        style={chipTextStyle.label}
        className={
          selected
            ? "text-script-blue dark:text-script-dark-blue"
            : "text-script-text-secondary"
        }
      >
        {label}
      </Text>
    </Pressable>
  );
}
