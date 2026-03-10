/**
 * constants/typography.ts — Typography tokens for Script.
 *
 * T-U3 (2026-03-10): Migrated from Inter to Atkinson Hyperlegible.
 * Font: @expo-google-fonts/atkinson-hyperlegible
 *
 * Available weights (Atkinson Hyperlegible only has 4):
 *   AtkinsonHyperlegible_400Regular — body, caption, labels
 *   AtkinsonHyperlegible_700Bold    — ALL headings (no SemiBold exists)
 *
 * Decision (w4rw1ck 2026-03-10): Bold (700) everywhere for headings.
 * No Inter fallback. Atkinson was designed with empirical accessibility
 * research — distinct character shapes reduce confusion in users with
 * atypical visual processing (relevant for ASD + possible dyslexia co-occurrence).
 *
 * Minimum font size: 14px (WCAG guideline).
 * No italics in primary content (cognitive load reduction).
 * Crisis text (S17/S18): 28px minimum — enforced in rescue/protocol.tsx StyleSheet.
 */

export const Typography = {
  /** Large screen title — app name, major section headers */
  headingXL: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 32,
    lineHeight: 40,
  },

  /** Primary content heading — screen titles, card headers */
  headingL: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 24,
    lineHeight: 32,
  },

  /** Secondary heading — section titles, card sub-headers */
  headingM: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 20,
    lineHeight: 28,
  },

  /** Tertiary heading — label groups, small card titles */
  headingS: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 16,
    lineHeight: 24,
  },

  /** Standard body text — descriptions, explanations */
  body: {
    fontFamily: "AtkinsonHyperlegible_400Regular",
    fontSize: 16,
    lineHeight: 24,
  },

  /** Large body text — prominent descriptions, onboarding copy */
  bodyLarge: {
    fontFamily: "AtkinsonHyperlegible_400Regular",
    fontSize: 18,
    lineHeight: 28,
  },

  /** Caption / label text — secondary info, timestamps, hints */
  caption: {
    fontFamily: "AtkinsonHyperlegible_400Regular",
    fontSize: 14,
    lineHeight: 20,
  },

  /**
   * Crisis text — used in rescue/protocol.tsx (S17/S18).
   * 28px minimum per FRONTEND_GUIDELINES §11 (crisis screen accessibility).
   * rescue/protocol.tsx uses StyleSheet directly — this token is a reference.
   */
  crisisText: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 28,
    lineHeight: 36,
  },

  /**
   * Button label — interactive element text.
   * Bold for legibility; same size as body for comfortable tap targets.
   */
  button: {
    fontFamily: "AtkinsonHyperlegible_700Bold",
    fontSize: 16,
  },
} as const;
