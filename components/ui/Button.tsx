/**
 * Button — base button component for Script.
 *
 * Variants:
 *  - primary:   mono-blue gradient background (#A8C5DA → #8BAEC4 at 135°) — main action
 *  - secondary: blue border, transparent background — secondary action
 *  - danger:    soft crisis background — destructive or alert actions
 *  - ghost:     no background or border — tertiary actions
 *
 * T-V6: primary variant uses LinearGradient for visual depth.
 * Requires: npx expo install expo-linear-gradient
 *
 * Accessibility:
 *  - Minimum 44px tap target (WCAG 2.1 AA)
 *  - accessibilityRole="button" always present
 *  - Opacity reduces on press as visual feedback
 *  - 50% opacity when disabled
 *  - B-39: accessibilityLabel prop overrides title for screen readers
 */
import { Pressable, StyleSheet, Text, View, useColorScheme } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useState } from "react";

type ButtonVariant = "primary" | "secondary" | "danger" | "ghost";

interface ButtonProps {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  disabled?: boolean;
  /**
   * Label for screen readers. Falls back to `title` if not provided.
   * Use when the button title is short and needs extra context.
   * B-39: was always ignored before — now properly forwarded.
   */
  accessibilityLabel?: string;
  /** Additional text screen readers announce after the label */
  accessibilityHint?: string;
  /** Extra NativeWind classes (margins, external padding, etc.) */
  className?: string;
}

/** T-V6: gradient stops for primary variant — mono-blue, 135° */
const PRIMARY_GRADIENT: [string, string] = ["#A8C5DA", "#8BAEC4"];

/**
 * T-U3: NativeWind `font-bold` only sets fontWeight — it does NOT set fontFamily.
 * Custom fonts require explicit StyleSheet with fontFamily string.
 * AtkinsonHyperlegible_700Bold is the only bold weight available in this family.
 */
const labelStyles = StyleSheet.create({
  base: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 16,
    lineHeight: 22,
  },
});

/** NativeWind classes for non-primary variants */
const variantStyles: Partial<Record<ButtonVariant, { container: string; text: string }>> = {
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
    // dark: variant required — without it ghost text becomes unreadable on dark bg
    text: "text-script-text-secondary dark:text-script-dark-text-secondary",
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
  const isPrimary = variant === "primary";
  const styles = variantStyles[variant];

  // T-U8: focus ring for switch access / keyboard navigation
  const [focused, setFocused] = useState(false);
  const isDark = useColorScheme() === "dark";
  // Calm ripple — script-blue low opacity (non-jarring, sensory-safe for ASD)
  const rippleColor = isDark ? "rgba(90, 126, 146, 0.25)" : "rgba(168, 197, 218, 0.35)";
  const focusBorderColor = isDark ? "#5A7E92" : "#A8C5DA";

  // Shared inner text — same for all variants.
  // T-U3: fontFamily via StyleSheet (NativeWind font-bold sets weight only, not family).
  // Primary: white color in style (no className needed).
  // Non-primary: color via NativeWind className only — no color in style to avoid overriding dark: tokens.
  const label = (
    <Text
      style={isPrimary ? [labelStyles.base, { color: "#FFFFFF" }] : labelStyles.base}
      className={isPrimary ? "" : (styles?.text ?? "")}
    >
      {title}
    </Text>
  );

  // Shared Pressable props
  const pressableProps = {
    onPress,
    disabled,
    accessibilityRole: "button" as const,
    accessibilityLabel: accessibilityLabel ?? title,
    accessibilityHint,
    // T-U8: android_ripple gives tactile visual feedback on Android
    android_ripple: disabled ? undefined : { color: rippleColor, borderless: false },
    onFocus: () => setFocused(true),
    onBlur: () => setFocused(false),
    style: ({ pressed }: { pressed: boolean }) => ({
      opacity: pressed && !disabled ? 0.85 : disabled ? 0.5 : 1,
      // T-U8: 2px focus ring visible during switch access / keyboard navigation
      ...(focused && !disabled && { borderWidth: 2, borderColor: focusBorderColor }),
    }),
  };

  if (isPrimary) {
    // T-V6: primary uses LinearGradient — mono-blue depth without new hues
    return (
      <Pressable {...pressableProps} className={`w-full rounded-2xl overflow-hidden ${className}`}>
        <LinearGradient
          colors={PRIMARY_GRADIENT}
          start={{ x: 0, y: 1 }}
          end={{ x: 1, y: 0 }}
          style={{
            width: "100%",
            alignItems: "center",
            justifyContent: "center",
            paddingVertical: 16,
            paddingHorizontal: 24,
            borderRadius: 16,
          }}
        >
          {label}
        </LinearGradient>
      </Pressable>
    );
  }

  return (
    <Pressable
      {...pressableProps}
      className={`w-full items-center justify-center rounded-2xl py-4 px-6 ${styles?.container ?? ""} ${className}`}
    >
      {label}
    </Pressable>
  );
}
