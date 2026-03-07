/**
 * Botón base de Script.
 *
 * Variantes:
 *  - primary:   fondo azul (acción principal)
 *  - secondary: borde azul, fondo transparente (acción secundaria)
 *  - danger:    fondo suave de crisis (acciones destructivas o de alerta)
 *  - ghost:     sin fondo ni borde (acciones terciarias o de navegación)
 *
 * Accesibilidad:
 *  - Tap target mínimo 44px (WCAG 2.1 AA)
 *  - accessibilityRole="button" siempre presente
 *  - Opacidad reduce al presionar como feedback visual
 *  - Opacidad 50% cuando disabled
 */
import { Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /**
   * Label para lectores de pantalla. Si no se pasa, se usa `title`.
   * Útil cuando el título es corto y se necesita contexto adicional
   * (ej: "Entiendo y acepto" → "Entiendo y acepto los términos. Comenzar mi evaluación.")
   * B-39: la prop existía pero no era parte de la interfaz — los lectores leían `title` siempre.
   */
  accessibilityLabel?: string;
  /** Texto adicional que los lectores de pantalla leen después del label */
  accessibilityHint?: string;
  /** Clases NativeWind adicionales (márgenes, padding externo, etc.) */
  className?: string;
}

/** Clases NativeWind por variante — contenedor y texto separados */
const variantStyles: Record<ButtonVariant, { container: string; text: string }> =
  {
    primary: {
      container: "bg-script-blue dark:bg-script-dark-blue",
      text: "text-white",
    },
    secondary: {
      container: "bg-transparent border-[1.5px] border-script-blue dark:border-script-dark-blue",
      text: "text-script-blue dark:text-script-dark-blue",
    },
    danger: {
      container: "bg-script-crisis-soft dark:bg-script-dark-crisis",
      text: "text-script-text dark:text-white",
    },
    ghost: {
      container: "bg-transparent",
      text: "text-script-text-secondary",
    },
  };

export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  accessibilityLabel,
  accessibilityHint,
  className = "",
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? title} // B-39: usar label custom si se pasa
      accessibilityHint={accessibilityHint}
      className={`w-full items-center justify-center rounded-2xl py-4 px-6 ${styles.container} ${
        disabled ? "opacity-50" : ""
      } ${className}`}
      // Feedback visual al presionar: reducir opacidad levemente
      style={({ pressed }) => ({ opacity: pressed && !disabled ? 0.85 : 1 })}
    >
      <Text className={`font-semibold text-base ${styles.text}`}>{title}</Text>
    </Pressable>
  );
}
