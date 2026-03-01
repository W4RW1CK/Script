/**
 * Tokens de espaciado para Script.
 * Base: múltiplos de 4px.
 * En componentes, preferir clases NativeWind (p-4, m-6, gap-3).
 * Este archivo es para lógica que necesite valores numéricos.
 */

export const Spacing = {
  xs: 4,    // space-1
  sm: 8,    // space-2
  md: 12,   // space-3
  base: 16, // space-4
  lg: 20,   // space-5
  xl: 24,   // space-6
  "2xl": 32, // space-8
  "3xl": 40, // space-10
  "4xl": 48, // space-12
} as const;

/** Padding horizontal estándar de pantalla */
export const SCREEN_PADDING_X = Spacing.lg; // 20px = px-5

/** Gap entre elementos de lista */
export const LIST_GAP = Spacing.md; // 12px = gap-3

/** Gap entre secciones */
export const SECTION_GAP = Spacing.xl; // 24px = gap-6
