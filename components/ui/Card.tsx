/**
 * Card — Tarjeta base de Script
 *
 * Contenedor de contenido agrupado (opciones de emoción, scripts, etc.)
 * Soporta dos variantes visuales y modo táctil con `onPress`.
 *
 * Variantes:
 *   "default"  — fondo secundario, sombra sutil (uso general)
 *   "elevated" — fondo elevado, sombra media (seleccionada / destacada)
 *
 * Si se pasa `onPress`, la tarjeta se envuelve en Pressable con
 * feedback de opacidad sutil (no intrusivo, respeta tono calmado del app).
 *
 * Retrocompatibilidad: `variant` y `onPress` son opcionales —
 * el uso existente `<Card>children</Card>` sigue funcionando sin cambios.
 *
 * @example
 *   // Tarjeta estática (uso general)
 *   <Card>
 *     <Typography>Contenido</Typography>
 *   </Card>
 *
 * @example
 *   // Tarjeta táctil con variante de selección
 *   <Card
 *     variant={selected ? "elevated" : "default"}
 *     onPress={() => handleSelect(id)}
 *     accessibilityRole="button"
 *     accessibilityState={{ selected }}
 *   >
 *     <Typography>{label}</Typography>
 *   </Card>
 */
import { View, Pressable } from "react-native";
import type { ReactNode } from "react";
import type { AccessibilityRole } from "react-native";

// ── Tipos ──────────────────────────────────────────────────────────────────
/** Variantes visuales disponibles */
export type CardVariant = "default" | "elevated";

interface CardProps {
  children: ReactNode;
  /** Additional NativeWind classes (margins, padding, etc.) */
  className?: string;
  /**
   * Inline style override — use for dynamic values that NativeWind can't handle
   * (e.g. emotion background colors from EmotionColors[key].bg).
   * Applied in addition to, not instead of, variant classes.
   */
  style?: import("react-native").ViewStyle;
  /**
   * Visual variant:
   *   "default"  — secondary bg + subtle shadow (general use)
   *   "elevated" — elevated bg + medium shadow (selected / featured)
   */
  variant?: CardVariant;
  /**
   * If provided, the card becomes tappable (Pressable).
   * Without this prop, the card is a static View (non-interactive).
   */
  onPress?: () => void;
  /** accessibilityRole for screen readers (e.g. "button") */
  accessibilityRole?: AccessibilityRole;
  /** Accessibility state (e.g. { selected: true }) */
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  /** Accessibility label */
  accessibilityLabel?: string;
}

// ── Clases de variante ─────────────────────────────────────────────────────
/**
 * getVariantClasses — devuelve las clases NativeWind según la variante.
 *
 * "default":  bg-script-bg-secondary + shadow-sm (fondo cálido, discreta)
 * "elevated": bg-script-bg-elevated  + shadow-md (blanco/elevado, destacada)
 */
function getVariantClasses(variant: CardVariant): string {
  if (variant === "elevated") {
    // Fondo elevado (blanco en light, dark-elevated en dark) + sombra media
    return "bg-script-bg-elevated dark:bg-script-dark-elevated shadow-md border border-script-blue dark:border-script-dark-blue";
  }
  // Default: fondo secundario + sombra sutil
  return "bg-script-bg-secondary dark:bg-script-dark-secondary shadow-sm";
}

// ── Componente ─────────────────────────────────────────────────────────────
export function Card({
  children,
  className = "",
  style,
  variant = "default",
  onPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
}: CardProps) {
  // Shared classes between View and Pressable
  const baseClasses = `rounded-3xl p-5 ${getVariantClasses(variant)} ${className}`;

  // ── Tappable mode (with onPress) ──────────────────────────────────────
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={baseClasses}
        // Subtle opacity on press — non-intrusive, keeps calm tone
        style={({ pressed }) => [{ opacity: pressed ? 0.85 : 1 }, style]}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  // ── Static mode (no onPress) ───────────────────────────────────────────
  return (
    <View
      className={baseClasses}
      style={style}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}
