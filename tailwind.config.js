/**
 * Configuración de NativeWind para Script.
 *
 * Tokens `script-*` — sistema de colores sensory-safe para TEA Nivel 1.
 * Regla: NUNCA hardcodear hex en componentes. Siempre usar estas clases.
 *
 * Uso en componentes:
 *   bg-script-bg            → fondo principal light
 *   dark:bg-script-dark-bg  → fondo principal dark
 *   text-script-text        → texto principal light
 *   dark:text-white         → texto en dark mode
 *   bg-script-blue          → acento azul suave (botones, selección)
 *   bg-script-crisis        → fondo de pantalla de crisis (S17/S18)
 *
 * Fuente de verdad de hex: constants/colors.ts
 * Tabla completa de tokens: FRONTEND_GUIDELINES.md §1.3
 */

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,jsx,ts,tsx}",
    "./components/**/*.{js,jsx,ts,tsx}",
  ],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        // ── Light mode ────────────────────────────────────────────────
        // Fondos
        "script-bg":           "#F8F6F2", // Fondo principal (cálido, no blanco puro)
        "script-bg-secondary": "#EFEFEA", // Fondos de cards
        "script-bg-elevated":  "#FFFFFF", // Modales, dropdowns

        // Texto
        "script-text":           "#2D2D2D", // Texto principal
        "script-text-secondary": "#6B6B6B", // Texto secundario / captions

        // Acentos (paleta sensory-safe)
        "script-blue":     "#A8C5DA", // Azul suave — acción principal
        "script-green":    "#B8DABC", // Verde suave — confirmación
        "script-peach":    "#F2C9B0", // Naranja suave — advertencia leve
        "script-lavender": "#C4B8DA", // Lavanda — estados de reflexión
        "script-yellow":   "#F5E4A0", // Amarillo suave — highlights

        // Crisis (S17/S18)
        "script-crisis":      "#F5EFEF", // Fondo de pantalla de crisis
        "script-crisis-soft": "#E8C4C4", // Botones danger light

        // Bordes
        "script-border": "#E0DDD8", // Borde neutro

        // ── Dark mode ─────────────────────────────────────────────────
        // Fondos
        "script-dark-bg":        "#1C1C22", // Fondo principal dark
        "script-dark-secondary": "#26262E", // Cards dark
        "script-dark-elevated":  "#2F2F38", // Modales dark

        // Texto
        "script-dark-text":           "#E8E8E8", // Texto principal dark
        "script-dark-text-secondary": "#9A9AA5", // Texto secundario dark

        // Acentos dark (versiones más apagadas)
        "script-dark-blue": "#5A7E92", // Azul dark

        // Crisis dark
        "script-dark-crisis": "#221E1E", // Fondo crisis dark

        // Bordes dark
        "script-dark-border": "#3A3A44", // Borde neutro dark
      },
    },
  },
  plugins: [],
};
