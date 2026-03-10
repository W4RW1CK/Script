/**
 * constants/colors.ts — Color tokens for Script.
 *
 * Two exported systems:
 *
 * 1. `Colors` — theme tokens (light/dark) for UI chrome: backgrounds, text,
 *    borders, semantic accent/warning. Use NativeWind classes (bg-script-*,
 *    text-script-*) in components; use this file when hex is needed in hooks
 *    or StyleSheet-based logic.
 *
 * 2. `EmotionColors` — 8 canonical emotional states, each with 3 values:
 *    `bg`  → card / screen background (soft, desaturated)
 *    `dot` → accent circles, history dots (mid saturation)
 *    `text`→ readable text rendered on top of `bg`
 *
 *    Locked 2026-03-10 by w4rw1ck. Do NOT add new keys without a PO decision.
 *    Clinical rationale: see FRONTEND_GUIDELINES.md §1.4.
 *
 *    Key set: calm · anxious · overwhelmed · sad · joyful · irritable · tired · unnamed
 *    `irritable` (not `frustrated`) — sensory-triggered, not intent-based (ASD Level 1)
 *    `unnamed`   — alexithymia catch-all; 50–85% of autistic adults (Kinnaird 2019)
 */

// ─────────────────────────────────────────────────────────────────────────────
// Theme Colors
// ─────────────────────────────────────────────────────────────────────────────

export const Colors = {
  light: {
    bg: {
      primary:   "#F8F6F2",
      secondary: "#EFEFEA",
      elevated:  "#FFFFFF",
    },
    text: {
      primary:   "#2D2D2D",
      secondary: "#6B6B6B",
      disabled:  "#ABABAB",
    },
    accent: {
      blue:     "#A8C5DA",
      green:    "#B8DABC",
      peach:    "#F2C9B0",
      lavender: "#C4B8DA",
      yellow:   "#F5E4A0",
    },
    crisis: {
      bg:   "#F5EFEF",
      soft: "#E8C4C4",
    },
    border:  "#E0DDD8",
    // Semantic tokens (v1.4) — must match tailwind.config.js script-accent / script-warning
    accent:  "#10B981", // Emerald — positive confirmation, completion states
    warning: "#F59E0B", // Amber   — soft alert, non-crisis attention
  },
  dark: {
    bg: {
      primary:   "#1C1C22",
      secondary: "#26262E",
      elevated:  "#2F2F38",
    },
    text: {
      primary:   "#E8E8E8",
      secondary: "#9A9AA5",
      disabled:  "#55555E",
    },
    accent: {
      blue:     "#5A7E92",
      green:    "#5A7A5E",
      peach:    "#8A6454",
      lavender: "#6A5E8A",
      yellow:   "#8A7A40",
    },
    crisis: {
      bg:   "#221E1E",
      soft: "#6A3E3E",
    },
    border:  "#3A3A44",
    // Semantic tokens (v1.4)
    accent:  "#059669", // Emerald dark
    warning: "#D97706", // Amber dark
  },
} as const;

export type ThemeMode = "light" | "dark" | "system";

// ─────────────────────────────────────────────────────────────────────────────
// Emotion Color System — T-V1 (locked 2026-03-10)
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EmotionColors — the visual identity of Script.
 *
 * Principle: Color IS the emotion. Users learn to recognize their state by
 * color, reducing the cognitive load of text-based search (especially relevant
 * in ASD with co-occurring alexithymia).
 *
 * Each entry:
 *   bg   — card/screen background. Soft, low-saturation. Used in reflect.tsx (S12)
 *          and result.tsx (S13) as full-screen emotional atmosphere.
 *   dot  — accent color for history dots (S19 calendar), border rings, and
 *          the 8px accent circle on selected emotion cards.
 *   text — readable body text on top of `bg`. Always passes WCAG AA (4.5:1+).
 *
 * Used by: reflect.tsx, result.tsx, home.tsx, history.tsx, body.tsx (Week 3).
 * Normalized by: interpret-checkin Edge Function (T-V7) → always returns a valid EmotionKey.
 */
export const EmotionColors = {
  /**
   * calm — Regulated, peaceful, at rest.
   * Trigger: quiet environment, routine achieved, no sensory overload.
   */
  calm: {
    bg:   "#D4EAD1", // soft green
    dot:  "#6BAF6B", // mid green
    text: "#2D4A2D", // dark green — contrast on bg: ~7:1 ✅
  },

  /**
   * anxious — Worried, nervous, anticipating something uncertain.
   * Often triggered by unpredictable social situations or sensory exposure.
   */
  anxious: {
    bg:   "#FFE8C4", // warm amber
    dot:  "#E8943A", // mid amber
    text: "#5A3010", // dark brown — contrast on bg: ~6.5:1 ✅
  },

  /**
   * overwhelmed — Too much all at once: sensory, social, or cognitive overload.
   * ASD-specific: distinct from anxiety — it's about overload volume, not anticipation.
   */
  overwhelmed: {
    bg:   "#E8D5F0", // soft purple / lavender
    dot:  "#9B6ABF", // mid lavender
    text: "#3A1A50", // dark purple — contrast on bg: ~7.2:1 ✅
  },

  /**
   * sad — Grief, longing, disappointment.
   * Muted blue — distinguished from overwhelmed (purple) and anxious (amber).
   */
  sad: {
    bg:   "#C4D8F0", // muted blue
    dot:  "#5A7EC8", // mid blue
    text: "#1C2E50", // dark navy — contrast on bg: ~7.8:1 ✅
  },

  /**
   * joyful — Light, happy, energized.
   * Warm yellow — optionally used as a celebration color on result screens.
   */
  joyful: {
    bg:   "#FFF3C4", // warm yellow
    dot:  "#F0C040", // mid yellow
    text: "#4A3800", // dark amber — contrast on bg: ~8.1:1 ✅
  },

  /**
   * irritable — Sensory-triggered agitation, low tolerance, friction.
   * NOT anger (which implies intent). "Irritable" is clinically more accurate for
   * ASD Level 1 where this state is usually a sensory response, not directed hostility.
   * Soft rose — distinct from crisis red; not alarming.
   */
  irritable: {
    bg:   "#F5D0D0", // soft rose
    dot:  "#D47070", // mid rose
    text: "#4A1A1A", // dark red-brown — contrast on bg: ~7.4:1 ✅
  },

  /**
   * tired — Depleted. Includes social fatigue and masking exhaustion —
   * states that are common in ASD Level 1 and often underreported.
   * Cool gray — neutral, not alarming.
   */
  tired: {
    bg:   "#D8D8E8", // cool gray-blue
    dot:  "#8A8AAA", // mid cool gray
    text: "#2A2A40", // dark slate — contrast on bg: ~7.6:1 ✅
  },

  /**
   * unnamed — "I feel something but I don't have a word for it."
   * Alexithymia catch-all — present in 50–85% of autistic adults (Kinnaird et al. 2019).
   * This is a VALID emotional state, not a fallback/error. It deserves its own color.
   * Neutral warm gray — softer than tired, intentionally ambiguous.
   */
  unnamed: {
    bg:   "#E8E8E8", // neutral gray
    dot:  "#9A9AAA", // neutral mid
    text: "#2A2A30", // dark near-black — contrast on bg: ~8.4:1 ✅
  },
} as const;

/**
 * EmotionKey — union of all valid emotion keys.
 * Use this type for any variable that holds an emotion identifier.
 *
 * @example
 *   const emotion: EmotionKey = "calm";
 *   const colors = EmotionColors[emotion]; // { bg, dot, text }
 */
export type EmotionKey = keyof typeof EmotionColors;

/**
 * VALID_EMOTION_KEYS — runtime array for validation and normalization.
 * Used by Edge Function (T-V7) and any code that receives emotion strings
 * from external sources (GPT, URL params, Supabase) and needs to validate them.
 *
 * @example
 *   const isValid = VALID_EMOTION_KEYS.includes(raw as EmotionKey);
 *   const safe: EmotionKey = isValid ? (raw as EmotionKey) : "unnamed";
 */
export const VALID_EMOTION_KEYS: EmotionKey[] = [
  "calm",
  "anxious",
  "overwhelmed",
  "sad",
  "joyful",
  "irritable",
  "tired",
  "unnamed",
];

/**
 * toEmotionKey — safely cast any string to EmotionKey.
 * Falls back to "unnamed" if the input is not a valid key.
 * Use this whenever consuming emotion data from GPT, Supabase, or URL params.
 *
 * @param raw - any string (GPT output, DB value, URL param)
 * @returns a guaranteed valid EmotionKey
 *
 * @example
 *   const key = toEmotionKey(gptoOutput);         // "calm" | ... | "unnamed"
 *   const { bg, dot } = EmotionColors[key];
 */
export function toEmotionKey(raw: string | null | undefined): EmotionKey {
  if (!raw) return "unnamed";
  const lower = raw.toLowerCase().trim() as EmotionKey;
  return VALID_EMOTION_KEYS.includes(lower) ? lower : "unnamed";
}
