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

        // ── Semantic tokens (v1.4) ────────────────────────────────────
        // Positive action / success (green — NOT crisis-associated)
        "script-accent":  "#10B981", // Emerald — confirmación positiva, logros
        // Warning / attention (amber — NOT red, avoids alarm response in ASD)
        "script-warning": "#F59E0B", // Amber — advertencia suave

        // ── Dark semantic tokens (v1.4) ───────────────────────────────
        "script-dark-accent":  "#059669", // Emerald dark
        "script-dark-warning": "#D97706", // Amber dark

        // ── Emotional color system (T-V1) — 8 canonical emotions ─────
        // Each emotion: bg (card background), dot (calendar/strip dot), text (label color)
        // Clinical basis: interoception model for ASD Level 1
        // (Mahler 2015; Kinnaird et al. 2019 — alexithymia in 50-85% of autistic adults)
        "emotion-calm-bg":        "#D4EAD1", // Soft green
        "emotion-calm-dot":       "#7BBD76",
        "emotion-calm-text":      "#2D5E29",
        "emotion-anxious-bg":     "#FFE8C4", // Warm amber
        "emotion-anxious-dot":    "#F5A623",
        "emotion-anxious-text":   "#7A4A00",
        "emotion-overwhelmed-bg": "#E8D5F0", // Soft purple
        "emotion-overwhelmed-dot":"#9B6DC0",
        "emotion-overwhelmed-text":"#4A2570",
        "emotion-sad-bg":         "#C4D8F0", // Muted blue
        "emotion-sad-dot":        "#5A8FC0",
        "emotion-sad-text":       "#1A3D6B",
        "emotion-tired-bg":       "#D8D8E8", // Cool gray
        "emotion-tired-dot":      "#8080A0",
        "emotion-tired-text":     "#3A3A55",
        "emotion-joyful-bg":      "#FFF3C4", // Warm yellow
        "emotion-joyful-dot":     "#E8C000",
        "emotion-joyful-text":    "#6B5200",
        "emotion-irritable-bg":   "#F5D0D0", // Soft red
        "emotion-irritable-dot":  "#D06060",
        "emotion-irritable-text": "#6B1A1A",
        "emotion-unnamed-bg":     "#E8E8E8", // Neutral gray
        "emotion-unnamed-dot":    "#A0A0A0",
        "emotion-unnamed-text":   "#505050",
      },

      // ── T-V2: Double-layer card shadows ──────────────────────────────
      // NativeWind v4 maps boxShadow to React Native shadow props.
      // "Double-layer" = layered blur + spread for perceived depth.
      // Usage: className="shadow-card" on Card components.
      boxShadow: {
        // Default card — subtle resting state
        "card":         "0 1px 3px rgba(0,0,0,0.07), 0 1px 2px rgba(0,0,0,0.05)",
        // Elevated card — modals, dropdowns, floating elements
        "card-elevated":"0 4px 8px rgba(0,0,0,0.09), 0 2px 4px rgba(0,0,0,0.06)",
        // Pressed card — reduced depth on tap
        "card-pressed": "0 1px 2px rgba(0,0,0,0.04)",
        // Dark mode equivalent (lighter opacity reads better on dark backgrounds)
        "card-dark":    "0 1px 3px rgba(0,0,0,0.25), 0 1px 2px rgba(0,0,0,0.18)",
      },
    },
  },
  plugins: [],
};
