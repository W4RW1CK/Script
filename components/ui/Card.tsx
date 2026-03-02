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
  /** Clases NativeWind adicionales (márgenes, padding, etc.) */
  className?: string;
  /**
   * Variante visual:
   *   "default"  — bg-secondary + shadow-sm (por defecto)
   *   "elevated" — bg-elevated + shadow-md (seleccionada / destacada)
   */
  variant?: CardVariant;
  /**
   * Si se proporciona, la card se vuelve tocable (Pressable).
   * Sin este prop, la card es un View estático (no interactivo).
   */
  onPress?: () => void;
  /** accessibilityRole para screen readers (e.g. "button") */
  accessibilityRole?: AccessibilityRole;
  /** Estado de accesibilidad (e.g. { selected: true }) */
  accessibilityState?: { selected?: boolean; disabled?: boolean };
  /** Label de accesibilidad */
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
  variant = "default",
  onPress,
  accessibilityRole,
  accessibilityState,
  accessibilityLabel,
}: CardProps) {
  // Clases compartidas entre View y Pressable
  const baseClasses = `rounded-3xl p-5 ${getVariantClasses(variant)} ${className}`;

  // ── Modo táctil (con onPress) ──────────────────────────────────────────
  if (onPress) {
    return (
      <Pressable
        onPress={onPress}
        className={baseClasses}
        // Opacidad sutil al presionar — no intrusivo, mantiene tono calmado
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
        accessibilityRole={accessibilityRole}
        accessibilityState={accessibilityState}
        accessibilityLabel={accessibilityLabel}
      >
        {children}
      </Pressable>
    );
  }

  // ── Modo estático (sin onPress) ────────────────────────────────────────
  return (
    <View
      className={baseClasses}
      accessibilityRole={accessibilityRole}
      accessibilityState={accessibilityState}
      accessibilityLabel={accessibilityLabel}
    >
      {children}
    </View>
  );
}
