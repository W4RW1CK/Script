/**
 * Tokens de color para Script.
 * Usar las clases NativeWind (bg-script-*, text-script-*) en componentes.
 * Este archivo es para hooks y lógica que necesiten hex directo.
 */

export const Colors = {
  light: {
    bg: {
      primary: "#F8F6F2",
      secondary: "#EFEFEA",
      elevated: "#FFFFFF",
    },
    text: {
      primary: "#2D2D2D",
      secondary: "#6B6B6B",
      disabled: "#ABABAB",
    },
    accent: {
      blue: "#A8C5DA",
      green: "#B8DABC",
      peach: "#F2C9B0",
      lavender: "#C4B8DA",
      yellow: "#F5E4A0",
    },
    crisis: {
      bg: "#F5EFEF",
      soft: "#E8C4C4",
    },
    border: "#E0DDD8",
  },
  dark: {
    bg: {
      primary: "#1C1C22",
      secondary: "#26262E",
      elevated: "#2F2F38",
    },
    text: {
      primary: "#E8E8E8",
      secondary: "#9A9AA5",
      disabled: "#55555E",
    },
    accent: {
      blue: "#5A7E92",
      green: "#5A7A5E",
      peach: "#8A6454",
      lavender: "#6A5E8A",
      yellow: "#8A7A40",
    },
    crisis: {
      bg: "#221E1E",
      soft: "#6A3E3E",
    },
    border: "#3A3A44",
  },
} as const;

export type ThemeMode = "light" | "dark" | "system";
