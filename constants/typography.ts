/**
 * Tokens de tipografía para Script.
 * Fuente: Inter (via @expo-google-fonts/inter).
 * Tamaño mínimo: 14px. Sin itálica en contenido principal.
 */

export const Typography = {
  headingXL: {
    fontFamily: "Inter_700Bold",
    fontSize: 32,
    lineHeight: 40,
  },
  headingL: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 24,
    lineHeight: 32,
  },
  headingM: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 20,
    lineHeight: 28,
  },
  body: {
    fontFamily: "Inter_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },
  bodyLarge: {
    fontFamily: "Inter_400Regular",
    fontSize: 18,
    lineHeight: 28,
  },
  caption: {
    fontFamily: "Inter_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },
  crisisText: {
    fontFamily: "Inter_700Bold",
    fontSize: 28,
    lineHeight: 36,
  },
  button: {
    fontFamily: "Inter_600SemiBold",
    fontSize: 16,
  },
} as const;
