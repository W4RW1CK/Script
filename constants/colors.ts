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

// ─────────────────────────────────────────────────────────────────────────────
// Emotion Color System — Dark mode variants
// ─────────────────────────────────────────────────────────────────────────────

/**
 * EmotionColorsDark — dark-mode counterpart to EmotionColors.
 *
 * Same dot values (they work on dark backgrounds).
 * bg  → deeply tinted dark background (not pitch black — still warm/hued).
 * text→ light, readable on top of dark bg (WCAG AA 4.5:1+).
 *
 * Used by getEmotionColors() to select the right palette at render time.
 */
export const EmotionColorsDark = {
  calm: {
    bg:   "#1E2D1E", // deep green tint
    dot:  "#6BAF6B", // same mid green
    text: "#C8EAC4", // light green — contrast ~7.0:1 ✅
  },
  anxious: {
    bg:   "#2E2010", // deep amber tint
    dot:  "#E8943A", // same mid amber
    text: "#F0D4A4", // light amber — contrast ~6.2:1 ✅
  },
  overwhelmed: {
    bg:   "#22182E", // deep purple tint
    dot:  "#9B6ABF", // same mid lavender
    text: "#DCC4EC", // light lavender — contrast ~6.8:1 ✅
  },
  sad: {
    bg:   "#182028", // deep navy
    dot:  "#5A7EC8", // same mid blue
    text: "#B4CCE8", // light blue — contrast ~7.2:1 ✅
  },
  joyful: {
    bg:   "#2A2408", // deep amber/yellow
    dot:  "#F0C040", // same mid yellow
    text: "#F8E8A0", // light yellow — contrast ~7.6:1 ✅
  },
  irritable: {
    bg:   "#2A1616", // deep rose
    dot:  "#D47070", // same mid rose
    text: "#F0C4C4", // light rose — contrast ~6.9:1 ✅
  },
  tired: {
    bg:   "#1E1E28", // deep cool slate
    dot:  "#8A8AAA", // same mid cool gray
    text: "#C4C4D8", // light slate — contrast ~7.1:1 ✅
  },
  unnamed: {
    bg:   "#222228", // deep neutral
    dot:  "#9A9AAA", // same neutral mid
    text: "#D8D8E4", // light neutral — contrast ~7.8:1 ✅
  },
} as const;

/**
 * getEmotionColors — returns the correct EmotionColors palette for the current
 * color scheme. Always use this instead of accessing EmotionColors[key] directly
 * in components that need dark mode support.
 *
 * @param key    - any valid EmotionKey
 * @param scheme - value from useColorScheme() — "light" | "dark" | null
 * @returns { bg, dot, text } for the given key and scheme
 *
 * @example
 *   const scheme = useColorScheme();
 *   const colors = getEmotionColors(emotionKey, scheme);
 */
export function getEmotionColors(
  key: EmotionKey,
  scheme: "light" | "dark" | null | undefined
): { bg: string; dot: string; text: string } {
  return scheme === "dark" ? EmotionColorsDark[key] : EmotionColors[key];
}

/**
 * EmotionKey — union of all valid emotion keys.
 * Use this type for any variable that holds an emotion identifier.
 *
 * @example
 *   const emotion: EmotionKey = "calm";
 *   const colors = getEmotionColors(emotion, isDark); // { bg, dot, text }
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
 * SPANISH_LABEL_MAP — maps Spanish GPT-generated emotion labels → EmotionKey.
 *
 * Used by toEmotionKey() as a client-side fallback until T-V7 (Aibus) normalizes
 * the interpret-checkin Edge Function to return proper EmotionKeys directly.
 * Once T-V7 is active, the Edge Function returns keys and this map is only
 * needed for historical Supabase data (emotion_confirmed column stores Spanish labels).
 */
const SPANISH_LABEL_MAP: Record<string, EmotionKey> = {
  // calm
  "calma":                        "calm",
  "tranquilo":                    "calm",
  "tranquila":                    "calm",
  "tranquilidad":                 "calm",
  "en paz":                       "calm",
  // anxious
  "ansioso":                      "anxious",
  "ansiosa":                      "anxious",
  "ansiedad":                     "anxious",
  "nervioso":                     "anxious",
  "nerviosa":                     "anxious",
  "nerviosismo":                  "anxious",
  "incomodidad":                  "anxious",
  // overwhelmed
  "sobrecargado":                 "overwhelmed",
  "sobrecargada":                 "overwhelmed",
  "sobrecarga sensorial":         "overwhelmed",
  "sobrecarga":                   "overwhelmed",
  "abrumado":                     "overwhelmed",
  "abrumada":                     "overwhelmed",
  // sad
  "triste":                       "sad",
  "tristeza":                     "sad",
  "decepcionado":                 "sad",
  "decepcionada":                 "sad",
  "decepción":                    "sad",
  // joyful
  "alegre":                       "joyful",
  "alegría":                      "joyful",
  "feliz":                        "joyful",
  "felicidad":                    "joyful",
  "contento":                     "joyful",
  "contenta":                     "joyful",
  // irritable
  "irritable":                    "irritable",
  "frustrado":                    "irritable",
  "frustrada":                    "irritable",
  "frustración":                  "irritable",
  "agitado":                      "irritable",
  "agitada":                      "irritable",
  "agitación":                    "irritable",
  // tired
  "cansado":                      "tired",
  "cansada":                      "tired",
  "cansancio":                    "tired",
  "agotado":                      "tired",
  "agotada":                      "tired",
  "agotamiento":                  "tired",
  // unnamed
  "algo que aún no tiene nombre": "unnamed",
  "sin nombre":                   "unnamed",
  "no lo sé":                     "unnamed",
  "no sé":                        "unnamed",
};

/**
 * toEmotionKey — safely resolves any string to a valid EmotionKey.
 *
 * Resolution order:
 *   1. Exact EmotionKey match (e.g. "calm", "anxious") — for T-V7 Edge Function output
 *   2. Spanish label match via SPANISH_LABEL_MAP — for legacy Supabase data + GPT fallback
 *   3. Falls back to "unnamed" for anything unrecognized
 *
 * Use this whenever consuming emotion data from GPT output, Supabase `emotion_confirmed`
 * column, URL params, or any external source that might return either format.
 *
 * @param raw - any string (GPT output, DB value, URL param, null/undefined)
 * @returns a guaranteed valid EmotionKey
 *
 * @example
 *   toEmotionKey("calm")       // → "calm"      (exact key match)
 *   toEmotionKey("Ansiedad")   // → "anxious"   (Spanish label)
 *   toEmotionKey("Cansancio")  // → "tired"     (Spanish label)
 *   toEmotionKey(null)         // → "unnamed"   (safe fallback)
 */
export function toEmotionKey(raw: string | null | undefined): EmotionKey {
  if (!raw) return "unnamed";
  const lower = raw.toLowerCase().trim();
  // 1. Exact EmotionKey match (T-V7 normalized output)
  if (VALID_EMOTION_KEYS.includes(lower as EmotionKey)) return lower as EmotionKey;
  // 2. Spanish label map (legacy DB data + GPT fallback)
  return SPANISH_LABEL_MAP[lower] ?? "unnamed";
}
