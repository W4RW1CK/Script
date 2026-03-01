import { Text } from "react-native";
import type { ReactNode } from "react";

type TypographyVariant =
  | "headingXL"
  | "headingL"
  | "headingM"
  | "body"
  | "bodyLarge"
  | "caption"
  | "crisis";

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  className?: string;
  accessibilityRole?: "header" | "text";
}

const variantClasses: Record<TypographyVariant, string> = {
  headingXL: "text-[32px] leading-[40px] font-bold",
  headingL: "text-2xl leading-8 font-semibold",
  headingM: "text-xl leading-7 font-semibold",
  body: "text-base leading-6",
  bodyLarge: "text-lg leading-7",
  caption: "text-sm leading-5",
  crisis: "text-[28px] leading-9 font-bold",
};

/**
 * Componente de texto tipado para Script.
 * Aplica la escala tipográfica de Inter automáticamente.
 */
export function Typography({
  children,
  variant = "body",
  className = "",
  accessibilityRole,
}: TypographyProps) {
  const isHeading = variant.startsWith("heading") || variant === "crisis";

  return (
    <Text
      accessibilityRole={accessibilityRole ?? (isHeading ? "header" : "text")}
      className={`text-script-text dark:text-white ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Text>
  );
}
