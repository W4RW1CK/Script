import { Pressable, Text } from "react-native";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  accessibilityHint?: string;
}

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

/**
 * Botón base de Script.
 * Tap target mínimo 44px (WCAG). Feedback: opacidad al presionar.
 */
export function Button({
  title,
  onPress,
  variant = "primary",
  disabled = false,
  accessibilityHint,
}: ButtonProps) {
  const styles = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      disabled={disabled}
      accessibilityRole="button"
      accessibilityLabel={title}
      accessibilityHint={accessibilityHint}
      className={`w-full items-center justify-center rounded-2xl py-4 px-6 ${styles.container} ${
        disabled ? "opacity-50" : ""
      }`}
      style={({ pressed }) => ({ opacity: pressed && !disabled ? 0.85 : 1 })}
    >
      <Text className={`font-semibold text-base ${styles.text}`}>{title}</Text>
    </Pressable>
  );
}
