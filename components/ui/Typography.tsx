/**
 * components/ui/Typography.tsx — Typed text component for Script.
 *
 * T-U3 (2026-03-10): Migrated from system font (NativeWind weight classes) to
 * explicit Atkinson Hyperlegible font family from constants/typography.ts.
 *
 * The previous implementation used NativeWind `font-bold`/`font-semibold` classes
 * which set fontWeight but not fontFamily — the app was rendering system font.
 * This version explicitly sets fontFamily + fontSize + lineHeight via StyleSheet,
 * matching the constants/typography.ts tokens exactly.
 *
 * Font: Atkinson Hyperlegible — designed for accessibility with distinct character
 * shapes that reduce confusion (relevant for ASD + possible dyslexia co-occurrence).
 * Only 2 weights used: 400Regular (body/caption) + 700Bold (ALL headings).
 *
 * Variants:
 *   headingXL  32px Bold  — screen titles, app name
 *   headingL   24px Bold  — section headers
 *   headingM   20px Bold  — card headers, subtitles
 *   headingS   16px Bold  — label groups, small card titles
 *   heading    24px Bold  — alias for headingL (backward compat)
 *   body       16px Reg   — primary content text
 *   bodyLarge  18px Reg   — prominent descriptions
 *   caption    14px Reg   — timestamps, hints, secondary info
 *   crisis     28px Bold  — crisis protocol instructions (S17/S18) — minimum 28px
 *
 * Props:
 *   style — inline StyleSheet/ViewStyle override (for dynamic values like emotion colors)
 */
import { Text, StyleSheet } from "react-native";
import type { ReactNode } from "react";
import type { TextStyle } from "react-native";

type TypographyVariant =
  | "headingXL"
  | "headingL"
  | "headingM"
  | "headingS"
  | "heading"     // alias for headingL — backward compat
  | "body"
  | "bodyLarge"
  | "caption"
  | "crisis";

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  /** Additional NativeWind classes (color, margin, alignment, etc.) */
  className?: string;
  /** Inline style override — use for dynamic values (e.g. emotion text colors) */
  style?: TextStyle;
  accessibilityRole?: "header" | "text";
}

/**
 * Font styles per variant — explicit fontFamily + size + lineHeight.
 * These values mirror constants/typography.ts exactly.
 * Crisis variant mirrors FRONTEND_GUIDELINES §11 (28px minimum in crisis screens).
 */
const variantStyles = StyleSheet.create({
  headingXL: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 32,
    lineHeight: 40,
  },
  headingL: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 24,
    lineHeight: 32,
  },
  headingM: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 20,
    lineHeight: 28,
  },
  headingS: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },
  heading: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 24,
    lineHeight: 32,
  },
  body: {
    fontFamily: "AtkinsonHyperlegible_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: "AtkinsonHyperlegible_400Regular",
    fontSize: 18,
    lineHeight: 28,
  },
  caption: {
    fontFamily: "AtkinsonHyperlegible_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  crisis: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 28,
    lineHeight: 36,
  },
});

export function Typography({
  children,
  variant = "body",
  className = "",
  style,
  accessibilityRole,
}: TypographyProps) {
  // Headings and crisis use accessibilityRole "header" for VoiceOver/TalkBack
  const isHeading = variant.startsWith("heading") || variant === "heading" || variant === "crisis";

  return (
    <Text
      accessibilityRole={accessibilityRole ?? (isHeading ? "header" : "text")}
      // NativeWind className handles color, margin, alignment, etc.
      // variantStyles handles fontFamily + size + lineHeight explicitly.
      // style prop allows dynamic overrides (emotion colors, etc.).
      className={`text-script-text dark:text-white ${className}`}
      style={[variantStyles[variant], style]}
    >
      {children}
    </Text>
  );
}
