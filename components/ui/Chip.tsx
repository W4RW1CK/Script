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
import { Pressable, StyleSheet, Text } from "react-native";

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
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      // Comunica estado seleccionado a VoiceOver / TalkBack
      accessibilityState={{ selected }}
      className={`rounded-full py-1 px-3 ${
        // Seleccionado: azul translúcido | No seleccionado: fondo neutro
        selected
          ? "bg-script-blue/20 dark:bg-script-dark-blue/20"
          : "bg-script-bg-secondary dark:bg-script-dark-secondary"
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
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
