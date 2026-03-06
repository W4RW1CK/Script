/**
 * Componente de texto tipado para Script.
 *
 * Aplica la escala tipográfica de Inter automáticamente según variant.
 * Tamaño mínimo: 14px (caption). Tamaño de crisis: 28px (FRONTEND_GUIDELINES §2.2).
 *
 * Variantes disponibles:
 *  - headingXL:  32px bold  — títulos de pantalla principal
 *  - headingL:   24px semi  — títulos de sección
 *  - headingM:   20px semi  — subtítulos y cards
 *  - bodyLarge:  18px reg   — texto destacado, instrucciones importantes
 *  - body:       16px reg   — texto de contenido general
 *  - caption:    14px reg   — metadatos, timestamps, etiquetas
 *  - crisis:     28px bold  — instrucciones durante protocolo de crisis (S17/S18)
 *
 * Accesibilidad:
 *  - accessibilityRole se infiere automáticamente (heading vs text)
 *  - Puedes sobreescribirlo con la prop accessibilityRole
 */
import { Text } from "react-native";
import type { ReactNode } from "react";

type TypographyVariant =
  | "headingXL"
  | "headingL"
  | "headingM"
  | "headingS"   // 18px semibold — subtítulos en cards y secciones
  | "heading"    // alias de headingL — compatibilidad con código generado
  | "body"
  | "bodyLarge"
  | "caption"
  | "crisis";

interface TypographyProps {
  children: ReactNode;
  variant?: TypographyVariant;
  /** Clases NativeWind adicionales (color, margin, etc.) */
  className?: string;
  accessibilityRole?: "header" | "text";
}

/** Mapa de variante → clases NativeWind de tamaño/peso */
const variantClasses: Record<TypographyVariant, string> = {
  headingXL: "text-[32px] leading-[40px] font-bold",
  headingL:  "text-2xl leading-8 font-semibold",
  headingM:  "text-xl leading-7 font-semibold",
  headingS:  "text-lg leading-6 font-semibold",     // 18px — subtítulos en cards
  heading:   "text-2xl leading-8 font-semibold",    // alias de headingL
  body:      "text-base leading-6",
  bodyLarge: "text-lg leading-7",
  caption:   "text-sm leading-5",
  // crisis: mínimo 28px para legibilidad bajo estrés (FRONTEND_GUIDELINES §2.2)
  crisis:    "text-[28px] leading-9 font-bold",
};

export function Typography({
  children,
  variant = "body",
  className = "",
  accessibilityRole,
}: TypographyProps) {
  // Headings y crisis son "header" para VoiceOver/TalkBack; resto es "text"
  const isHeading = variant.startsWith("heading") || variant === "crisis";

  return (
    <Text
      accessibilityRole={accessibilityRole ?? (isHeading ? "header" : "text")}
      // Color de texto por defecto — sobreescribible con className
      className={`text-script-text dark:text-white ${variantClasses[variant]} ${className}`}
    >
      {children}
    </Text>
  );
}
