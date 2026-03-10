# FRONTEND_GUIDELINES.md — Design System
## Script — Digital Companion for Adults with ASD Level 1

**Version:** 1.5  
**Last updated:** 2026-03-10  
**Changes v1.4:** §1.4 Emotional color system added (7 emotions with bg/dot/text). Tokens `script-accent` and `script-warning` added. §2 Typography migrated to Atkinson Hyperlegible (replaces Inter — empirical accessibility research). §4 Cards: double-layer shadows. §4 Buttons: approved mono-blue gradient. §7 Animations: `useReduceMotion()` pattern canonized. §12 Visual Identity (new section): 2026-03-06 redesign decisions (Aibus + Ana).

**Changes v1.5 (2026-03-10):** §1.4 emotion set finalized — 8 canonical emotions locked by w4rw1ck: `calm`, `anxious`, `overwhelmed`, `sad`, `joyful`, `irritable`, `tired`, `unnamed`. Keys `overwhelm`→`overwhelmed`, `joy`→`joyful`, added `irritable` (replaces previous `frustrated` proposal — clinically more accurate for ASD Level 1). §2 font weight finalized — Atkinson Bold (700) everywhere for headings; no Inter fallback, no SemiBold. Dictionary content strategy: definition + how expressed in Week 2; "how to deal" deferred (AI-generated with disclaimer when it ships).  
**Changes v1.3:** §8 Iconography updated — `expo-symbols` → `Ionicons` from `@expo/vector-icons` (B-07: SF Symbols does not work on Android).  
**Changes v1.2:** Added §0 — Design Inspiration and Per-Screen Decisions (incl. deferral of Companion/Plant to Week 3).  
**Changes v1.1:** Added NativeWind mapping table (§1.3); corrected screen template with dark mode; added `expo-symbols` to §8.

> **Guiding principle:** No UI element may be a sensory trigger. Every design decision must reduce cognitive and sensory load, not increase it.

---

## 0. Design Inspiration and Per-Screen Decisions

This table defines the UX language for each main screen. It is the canonical reference before designing any new layout.

| # | Screen | Inspiration | Design decision |
|---|---|---|---|
| 1 | **Home** | Finch | Warm space, personalized greeting + continuity data ("your last emotion was…"). Never empty. |
| 2 | **Check-in** | Daylio | Maximum 3 taps. Interactive tactile body map. Emotion tiles with color as primary signal. |
| 3 | **Scripts** | Daylio + Finch | Visual grid of tiles (not a list). Warm copy at script execution time. |
| 4 | **History** | Daylio | Monthly grid where each day is colored according to the recorded emotion. No dense text. |
| 5 | **Crisis / Rescue** | — (custom design) | Ultra minimal: one instruction at a time, 28px minimum, custom palette (`color-crisis-*`). Zero decoration. |
| 6 | **Companion / Plant** | — | **Deferred to Week 3.** MVP uses only continuity data (last emotion, check-in streak). No mascot/plant visual element in v1. |

### Decision notes

- **Companion / Plant — yes, but starting Week 3.** The idea of a visual companion (inspired by Finch/Tamagotchi) is approved as a Week 3 feature. In MVP (Week 1–2) the Home screen shows only textual/numerical continuity data; no avatar or plant.
- **History as color grid** (Daylio): each calendar cell = color of the dominant emotional state for that day. Screen S19. Implement in Phase 1.5+.
- **Check-in: emotion tiles** have a background color corresponding to the state (green for calm, blue for sadness, orange for anxiety, etc.) and are composed with the body map. Implement in Phase 1.5.
- **Crisis: 100% custom design** — no external reference applies. See §11 of this document for the rules that override everything else.

---

## 1. Color Palette

### Light Mode (Pastel)

| Token | Hex | Usage |
|---|---|---|
| `color-bg-primary` | `#F8F6F2` | Main background (warm white, not pure white) |
| `color-bg-secondary` | `#EFEFEA` | Card and input backgrounds |
| `color-bg-elevated` | `#FFFFFF` | Modals, bottom sheets |
| `color-text-primary` | `#2D2D2D` | Primary text |
| `color-text-secondary` | `#6B6B6B` | Secondary text, hints |
| `color-text-disabled` | `#ABABAB` | Disabled elements |
| `color-accent-blue` | `#A8C5DA` | Primary actions, selection |
| `color-accent-green` | `#B8DABC` | Confirmation, success, "I feel good" |
| `color-accent-peach` | `#F2C9B0` | Soft alerts, scripts |
| `color-accent-lavender` | `#C4B8DA` | History, emotional dictionary |
| `color-accent-yellow` | `#F5E4A0` | Notes, reminders |
| `color-crisis-bg` | `#F5EFEF` | Rescue screen background |
| `color-crisis-soft` | `#E8C4C4` | Crisis elements (soft, never alarm red) |
| `color-border` | `#E0DDD8` | Card borders, dividers |

### Dark Mode (Desaturated)

| Token | Hex | Usage |
|---|---|---|
| `color-bg-primary` | `#1C1C22` | Main background |
| `color-bg-secondary` | `#26262E` | Card and input backgrounds |
| `color-bg-elevated` | `#2F2F38` | Modals, bottom sheets |
| `color-text-primary` | `#E8E8E8` | Primary text |
| `color-text-secondary` | `#9A9AA5` | Secondary text |
| `color-text-disabled` | `#55555E` | Disabled elements |
| `color-accent-blue` | `#5A7E92` | Primary actions |
| `color-accent-green` | `#5A7A5E` | Confirmation, success |
| `color-accent-peach` | `#8A6454` | Scripts |
| `color-accent-lavender` | `#6A5E8A` | History |
| `color-accent-yellow` | `#8A7A40` | Notes |
| `color-crisis-bg` | `#221E1E` | Rescue screen background |
| `color-crisis-soft` | `#6A3E3E` | Crisis elements |
| `color-border` | `#3A3A44` | Borders |

### 1.2.1 Additional Tokens — Accent and Warning

Tokens that complement the palette but are not part of the emotional system:

| Token | Hex Light | Hex Dark | NativeWind | Usage |
|---|---|---|---|---|
| `color-accent` | `#10B981` | `#059669` | `bg-script-accent` / `text-script-accent` | Confirmation, success, "completed" |
| `color-warning` | `#F59E0B` | `#D97706` | `bg-script-warning` / `text-script-warning` | Soft alert, caution (not crisis) |

> Difference from `color-crisis-*`: crisis colors are for the rescue protocol.  
> `color-warning` is for normal UI feedback (e.g., "incomplete field", reminder).

---

### 1.3 Token → NativeWind Class Reference

The semantic tokens above map to `tailwind.config.js` classes as follows. **Always use the NativeWind class, never the raw hex value.**

| Semantic Token | NativeWind (background) | NativeWind (text) | NativeWind (border) |
|---|---|---|---|
| `color-bg-primary` | `bg-script-bg` | — | — |
| `color-bg-secondary` | `bg-script-bg-secondary` | — | — |
| `color-bg-elevated` | `bg-script-bg-elevated` | — | — |
| `color-text-primary` | — | `text-script-text` | — |
| `color-text-secondary` | — | `text-script-text-secondary` | — |
| `color-accent-blue` | `bg-script-blue` | `text-script-blue` | `border-script-blue` |
| `color-accent-green` | `bg-script-green` | `text-script-green` | — |
| `color-accent-peach` | `bg-script-peach` | `text-script-peach` | — |
| `color-accent-lavender` | `bg-script-lavender` | `text-script-lavender` | — |
| `color-crisis-bg` | `bg-script-crisis` | — | — |
| `color-crisis-soft` | `bg-script-crisis-soft` | — | — |
| `color-border` | — | — | `border-script-border` |
| `color-bg-primary` (dark) | `dark:bg-script-dark-bg` | — | — |
| `color-bg-secondary` (dark) | `dark:bg-script-dark-secondary` | — | — |
| `color-accent-blue` (dark) | `dark:bg-script-dark-blue` | `dark:text-script-dark-blue` | — |
| `color-crisis-bg` (dark) | `dark:bg-script-dark-crisis` | — | — |

> ✅ Correct usage example: `className="bg-script-bg dark:bg-script-dark-bg text-script-text"`  
> ❌ Never: `className="bg-[#F8F6F2]"` (hardcoded, breaks dark mode)

---

---

### 1.4 Emotional Color System

> ⚠️ **DESIGN DECISION (2026-03-06):** Script adopts an emotional color system inspired by Daylio. Each emotional state has 3 values: `bg` (card/screen background), `dot` (accent/dots in history), `text` (readable text on top of `bg`). This system is the **visual identity of the product** — not decoration.

**Principle:** Color IS the emotion. The user learns to recognize their state by color, reducing the cognitive load of textual search (especially relevant in ASD).

```typescript
// constants/colors.ts — CANONICAL SET — locked 2026-03-10 by w4rw1ck
// 8 emotions: calm, anxious, overwhelmed, sad, joyful, irritable, tired, unnamed
// Note: "irritable" (not "frustrated") — sensory-triggered, not intent-based (ASD Level 1 clinical accuracy)
// Note: "unnamed" = alexithymia catch-all (50–85% of autistic adults — Kinnaird et al. 2019)
export const EmotionColors = {
  calm: {
    bg: '#D4EAD1',     // soft green — peace, regulation, baseline
    dot: '#6BAF6B',    // mid green — confirmation
    text: '#2D4A2D',   // dark green — readable on bg
  },
  anxious: {
    bg: '#FFE8C4',     // warm amber — alert without alarm
    dot: '#E8943A',    // mid amber
    text: '#5A3010',
  },
  overwhelmed: {
    bg: '#E8D5F0',     // soft purple — sensory/cognitive overload
    dot: '#9B6ABF',    // mid lavender
    text: '#3A1A50',
  },
  sad: {
    bg: '#C4D8F0',     // muted blue — grief, disappointment, longing
    dot: '#5A7EC8',    // mid blue
    text: '#1C2E50',
  },
  joyful: {
    bg: '#FFF3C4',     // warm yellow — light, energized
    dot: '#F0C040',    // mid yellow
    text: '#4A3800',
  },
  irritable: {
    bg: '#F5D0D0',     // soft red — sensory-triggered agitation (NOT anger — anger implies intent)
    dot: '#D47070',    // mid rose
    text: '#4A1A1A',
  },
  tired: {
    bg: '#D8D8E8',     // cool gray — includes social fatigue and masking exhaustion
    dot: '#8A8AAA',    // mid cool gray
    text: '#2A2A40',
  },
  unnamed: {
    bg: '#E8E8E8',     // neutral gray — "I feel something but have no word for it" (alexithymia)
    dot: '#9A9AAA',    // neutral mid
    text: '#2A2A30',
  },
} as const;

export type EmotionKey = keyof typeof EmotionColors;
```

**GPT label → EmotionKey mapping** (canonical — normalize in Edge Function):

| GPT Output Label | EmotionKey | Notes |
|---|---|---|
| `Calma` | `calm` | |
| `Ansioso` / `Ansiedad` / `Nervioso` | `anxious` | |
| `Sobrecargado` / `Abrumado` / `Sobrecarga sensorial` | `overwhelmed` | |
| `Triste` / `Tristeza` | `sad` | |
| `Alegre` / `Alegría` / `Feliz` | `joyful` | |
| `Irritable` / `Frustrado` / `Agitado` | `irritable` | GPT may say "frustrado" — always map to `irritable` |
| `Cansado` / `Agotado` | `tired` | |
| `Sin nombre` / `No lo sé` / `Algo que aún no tiene nombre` | `unnamed` | |

> ⚠️ The `interpret-checkin` Edge Function MUST normalize its output to one of these 8 exact EmotionKeys before returning to the client. The frontend never infers — it receives the key directly and maps to `EmotionColors[key]`. Unmapped labels must fall back to `unnamed`.

**Where emotional colors appear:**

| Context | What it shows |
|---|---|
| `reflect.tsx` — selected card | `EmotionColors[key].bg` as background, `dot` as border and accent circle |
| `result.tsx` — result screen | Full-screen background with `EmotionColors[key].bg` |
| `home.tsx` — "last emotion" card | Card background with the color of the last recorded emotion |
| `history.tsx` — S19 calendar | 36x36px dots with `EmotionColors[key].dot` per day |
| Visual companion (Week 3) | Companion state reflects the emotion from the last check-in |

---

### Crisis Mode (activated when entering the rescue protocol)

In crisis mode, the UI automatically adopts:
- Background: `color-crisis-bg` of the active mode
- Contrast reduction: all accent colors desaturated by 30%
- Forced dark mode if the system is in light mode (reduces stimulation)

---

## 2. Typography

> **DECISION (2026-03-06):** Script migrates from Inter to **Atkinson Hyperlegible**. Atkinson was designed with empirical accessibility research for maximum legibility — each character has distinct shapes that reduce confusion. For ASD users where dyslexia and atypical visual processing may coexist, this has real clinical impact. Inter was generic and valid; Atkinson is the right choice for this product.
>
> ⚠️ Atkinson Hyperlegible only has **Regular (400)** and **Bold (700)** — there is no SemiBold. Elements that used SemiBold migrate to Bold. The result is more character, not less.

| Role | Family | Weight | Size | Line Height |
|---|---|---|---|---|
| Heading XL | Atkinson Hyperlegible | 700 (Bold) | 32px | 40px |
| Heading L | Atkinson Hyperlegible | 700 (Bold) | 24px | 32px |
| Heading M | Atkinson Hyperlegible | 700 (Bold) | 20px | 28px |
| Heading S | Atkinson Hyperlegible | 700 (Bold) | 18px | 26px |
| Body Large | Atkinson Hyperlegible | 400 (Regular) | 18px | 28px |
| Body | Atkinson Hyperlegible | 400 (Regular) | 16px | 24px |
| Caption | Atkinson Hyperlegible | 400 (Regular) | 14px | 20px |
| Crisis Text | Atkinson Hyperlegible | 700 (Bold) | 28px | 36px |
| Button | Atkinson Hyperlegible | 700 (Bold) | 16px | — |

**Installation:**
```bash
npx expo install @expo-google-fonts/atkinson-hyperlegible
```

**Import in `_layout.tsx`:**
```typescript
import {
  useFonts,
  AtkinsonHyperlegible_400Regular,
  AtkinsonHyperlegible_700Bold,
} from '@expo-google-fonts/atkinson-hyperlegible';
// Replace @expo-google-fonts/inter imports
```

**Rules:**
- Minimum text size: 14px (never smaller)
- No italics in main content (makes reading harder for dyslexia)
- Letter tracking: normal (not tight, not wide)
- On the crisis screen: only Body Large (18px) and Crisis Text (28px)
- **Do not use Inter directly** — it is the system font as a fallback if Atkinson fails to load

---

## 3. Spacing Scale

Use multiples of 4px. NativeWind map:

| Token | px | NativeWind |
|---|---|---|
| `space-1` | 4px | `p-1`, `m-1` |
| `space-2` | 8px | `p-2`, `m-2` |
| `space-3` | 12px | `p-3`, `m-3` |
| `space-4` | 16px | `p-4`, `m-4` |
| `space-5` | 20px | `p-5`, `m-5` |
| `space-6` | 24px | `p-6`, `m-6` |
| `space-8` | 32px | `p-8`, `m-8` |
| `space-10` | 40px | `p-10`, `m-10` |
| `space-12` | 48px | `p-12`, `m-12` |

**Standard screen padding:** `px-5` (20px horizontal)  
**Gap between list elements:** `gap-3` (12px)  
**Gap between sections:** `gap-6` (24px)

---

## 4. Core Components

### Buttons

```
Primary Button
├── Background: linear gradient 135° from color-accent-blue (#A8C5DA) → #8BAEC4
│   (mono-blue — depth without introducing new hues)
│   Flat fallback: color-accent-blue (if gradient is not supported)
├── Text: white, Atkinson Bold 16px
├── Padding: py-4 px-6 (16px vertical, 24px horizontal)
├── Border radius: rounded-2xl (16px)
├── Minimum size: full width (w-full) on mobile
└── Pressed state: opacity 0.85, no scale

Secondary Button  
├── Background: transparent
├── Border: 1.5px color-accent-blue
├── Text: color-accent-blue, Inter SemiBold 16px
└── Everything else same as primary

Danger Button
├── Background: color-crisis-soft
├── Text: color-text-primary
└── Only use for destructive actions (delete, disconnect)

Ghost Button
├── No background, no border
├── Text: color-text-secondary
└── For secondary actions (skip, cancel)
```

**Minimum tap target size:** 44x44px (WCAG / Apple HIG)

### Cards

```
Card
├── Background: color-bg-secondary
├── Border radius: rounded-3xl (24px)
├── Padding: p-5 (20px all sides)
├── Shadow: shadow-card (double layer — see tokens in tailwind.config.js)
└── No border (background provides sufficient differentiation)

Card Elevated (variant="elevated")
├── Shadow: shadow-card-elevated
└── Everything else same

Card Pressed (state when pressing)
├── Shadow: shadow-card-pressed (inset — sunken effect)
└── Scale: 0.97 (100ms easeOut)
```

**Shadow tokens in `tailwind.config.js`:**
```javascript
boxShadow: {
  // Light mode — double-layer shadows for tactile depth
  'card':          '0 2px 8px rgba(0,0,0,0.06), 0 1px 3px rgba(0,0,0,0.04)',
  'card-elevated': '0 4px 16px rgba(0,0,0,0.10), 0 2px 6px rgba(0,0,0,0.06)',
  'card-pressed':  'inset 0 1px 4px rgba(0,0,0,0.08)',
  // Dark mode — subtler shadows (darkness already does the work)
  'card-dark':     '0 2px 8px rgba(0,0,0,0.20), 0 1px 3px rgba(0,0,0,0.14)',
}
```

> **Why double layer:** Single-layer shadows look flat at high resolutions. The outer layer provides "elevation" and the inner one provides a "border". The result is perceived as a physically present surface — more predictable and intuitive for users with different visual-tactile processing.

### Text Inputs

```
TextInput
├── Background: color-bg-primary
├── Border: 1.5px color-border
├── Focused border: 1.5px color-accent-blue
├── Border radius: rounded-2xl (16px)
├── Padding: p-4 (16px)
├── Text: Inter Regular 16px, color-text-primary
├── Placeholder: color-text-disabled
└── Min height: 44px (single line) / 120px (multiline)
```

### Chips / Tags

```
Chip (selected body zone, script category)
├── Background: color-accent-blue at 20% opacity
├── Text: color-accent-blue, Inter SemiBold 14px
├── Padding: py-1 px-3
├── Border radius: rounded-full
└── Optional icon on the left
```

### Bottom Navigation

```
Bottom Nav
├── Background: color-bg-elevated
├── 5 tabs: Home, Check-in, Scripts, History, Settings
├── Active tab: icon + label with color-accent-blue
├── Inactive tab: icon + label with color-text-disabled
├── Height: 64px + safe area inset
└── No top border (separation via subtle shadow)
```

---

## 5. Component: Body Silhouette (Body Map)

```
SVG Body Map
├── Dimensions: 200px wide × 400px tall (scalable)
├── Background: transparent
├── Base silhouette: color-border with soft fill
└── 6 touch zones:
    ├── Head/Eyes/Jaw: upper ellipse
    ├── Throat/Neck: upper central rectangle
    ├── Chest/Heart: thoracic zone
    ├── Stomach/Abdomen: mid zone
    ├── Hands/Arms: lateral zones
    └── Legs/Feet: lower zone

Zone states:
├── Default: fill color-bg-secondary, stroke color-border
├── Hover/Press: fill color-accent-blue 30% opacity
├── Selected: fill color-accent-blue 60% opacity, stroke color-accent-blue
└── Selection animation: scale 1.0 → 1.05 → 1.0 (100ms, only if animations active)
```

---

## 6. Component: Breathing Circle

```
Breathing Circle (animated SVG)
├── Base radius: 80px
├── Maximum radius (inhale): 120px
├── Minimum radius (exhale): 60px
├── Color: color-accent-blue with radial gradient to color-accent-lavender
├── Opacity: 0.7 base, 0.9 at maximum
├── Animation: react-native-reanimated withTiming
│   ├── Inhale (4s): radius 80→120, opacity 0.7→0.9
│   ├── Hold (2s): no change
│   └── Exhale (6s): radius 120→60, opacity 0.9→0.6
├── Inner label: "Inhala" / "Pausa" / "Exhala" (Inter Bold 16px, white)
└── Screen background: color-crisis-bg, no other elements
```

---

## 7. Animations

**Philosophy:** Animations communicate state, they don't decorate. They must be predictable.

| Animation | Duration | Curve | When |
|---|---|---|---|
| Page transition | 200ms | easeInOut | Between screens |
| Card press | 100ms | easeOut | Tap feedback |
| Modal enter | 300ms | easeOut | Bottom sheet appears |
| Zone selection | 100ms | easeOut | Body zone touched |
| Breathing circle | 4000/6000ms | easeInOut | Protocol only |
| Chip add/remove | 150ms | easeOut | Adding/removing chip |

**Reduced motion mode — MANDATORY (T-U1):**

> ⚠️ `useReduceMotion()` from `react-native-reanimated` must be checked in ALL components that animate. It respects both the OS preference (`prefers-reduced-motion`) and the internal user setting in Settings. For ASD users with sensory sensitivity, this control is not optional.

```typescript
// Mandatory pattern in every component with animations:
import { useReduceMotion } from 'react-native-reanimated';

function BreathingCircle() {
  const shouldReduce = useReduceMotion();

  // If shouldReduce → show final static state, no withRepeat/withSequence
  const animatedStyle = useAnimatedStyle(() => ({
    width: shouldReduce
      ? CIRCLE_BASE                                    // static
      : circleSize.value,                             // animated
  }));
}
```

**Reduction levels:**
1. **`useReduceMotion() = true`** (OS preference): Skip all animations — show final state
2. **Crisis mode** (`/rescue/*`): Breathing circle does animate (it's therapeutic), everything else does not
3. **User Settings** (`reduce_motion: true` in Zustand): Equivalent to level 1

When the user activates reduction:
- ALL UI animations are disabled (transitions, cards, chips)
- The breathing circle shows the phase text ("Inhala / Pausa / Exhala") without scale animation
- Haptics remain active (different channel — not visual)

---

## 8. Iconography

> ⚠️ **MANDATORY RULE (B-07):** NEVER use `expo-symbols` in Script.  
> `expo-symbols` uses Apple's SF Symbols — only works on iOS and web.  
> On Android Expo Go it renders absolutely nothing.  
> **Always use `Ionicons` from `@expo/vector-icons`.**

**Library:** `Ionicons` from `@expo/vector-icons` — cross-platform iOS / Android / web

**Import:**
```tsx
import { Ionicons } from "@expo/vector-icons";

// Usage:
<Ionicons name="heart" size={24} color="#A8C5DA" />
```

**`@expo/vector-icons` is already included with Expo** — no additional installation required.

| Usage | Ionicons icon |
|---|---|
| Home | `home` |
| Check-in | `body` |
| Scripts | `chatbubbles` |
| History | `bar-chart` |
| Settings | `settings` |
| Rescue (FAB) | `heart` |
| Add | `add-circle` |
| Delete | `trash` |
| Edit | `pencil` |
| Share | `share-social` |
| Back | `arrow-back` |
| Close | `close` |
| Crisis flag | `flag.fill` |
| Trusted person | `person.2.fill` |
| Therapist | `stethoscope` |

**Sizes:**
- Navigation icon: 24px
- Action icon: 20px
- Inline icon: 16px

---

## 9. Layout and Responsive

**Maximum content width:** 480px (centered on tablets/web)  
**Safe areas:** Use `SafeAreaView` or padding with `useSafeAreaInsets()`  
**Orientation:** Portrait locked (no landscape support in v1)  
**Minimum supported density:** 320px wide (iPhone SE)

```typescript
// Standard screen template
<SafeAreaView className="flex-1 bg-script-bg dark:bg-script-dark-bg">
  <ScrollView 
    className="flex-1 px-5"
    showsVerticalScrollIndicator={false}
  >
    {/* content */}
  </ScrollView>
</SafeAreaView>
```

---

## 10. Accessibility

- `accessibilityLabel` on all interactive buttons and icons
- `accessibilityHint` on non-obvious actions
- Text contrast: minimum 4.5:1 (WCAG AA)
- Contrast in crisis mode: minimum 3:1 (intentionally reduced for sensory relief)
- Correct `accessibilityRole` on all elements (`button`, `text`, `image`)
- `accessible={true}` on body map zones with `accessibilityLabel` per zone

---

## 11. Crisis Screen — Special Rules

These rules **override** all others when inside `/rescue/*`:

1. ❌ No decorative top padding
2. ❌ No visible bottom navigation
3. ❌ No animations except the breathing circle
4. ❌ No more than 5 words in any instruction
5. ✅ Minimum text size 28px
6. ✅ Buttons minimum 64px tall
7. ✅ Background always `color-crisis-bg`
8. ✅ Reduced contrast (not eliminated)
9. ✅ "← Exit" button always visible at top left
10. ✅ One single focal point per screen

---

## 12. Visual Identity — Redesign Decisions (2026-03-06)

> **Context:** Visual identity analysis performed by Aibus Dumbleclaw (commit `fdcadd2`) using `nextlevelbuilder/ui-ux-pro-max-skill`. Reviewed and approved by Ana Banana. Implementation divided by specialty.
>
> **Diagnosis:** The problem with previous versions was not the palette (well chosen) but that everything lived on the same visual plane — gray background → slightly different gray card → text. No depth hierarchy, no tactile personality, no emotional color system that is the heart of the value proposition.

### 12.1 Identity Principles

| Principle | Source | How it applies |
|---|---|---|
| **Color = emotion** | Daylio | Emotional color is the primary signal, not text |
| **Warmth of one's own space** | Finch | Backgrounds that feel like a room, not a clinic |
| **Tactile depth** | Soft UI Evolution (skill) | Cards with double-layer shadows — pressable, with weight |
| **Anti-pattern mental health** | ui-ux-pro-max-skill §15 | Zero neon, zero motion overload, zero AI purple/pink |

### 12.2 Approved Decisions

| Item | Decision | Implements |
|---|---|---|
| Emotional color system | ✅ Approved — 8 canonical emotions locked 2026-03-10 (§1.4) | Ana — Week 2 |
| Atkinson Hyperlegible | ✅ Approved — replaces Inter (§2) | Aibus — Week 2 |
| Double-layer shadows | ✅ Approved — `shadow-card` tokens (§4) | Aibus — Week 2 |
| Mono-blue button gradient | ✅ Approved — blue → deeper blue (§4) | Aibus — Week 2 |
| Emotion cards in `reflect.tsx` | ✅ Approved — color bg + dot + border | Ana — Week 2 |
| `result.tsx` emotional background | ✅ Approved — full-screen emotion color | Ana — Week 2 |
| Home S09 redesign (Finch) | ✅ Approved — greeting + last emotion + 7-day dots | Ana — Week 2 |
| Calendar S19 emotional dots | ✅ Approved — 36x36px, day color | Aibus — Week 2/3 |

### 12.3 Rejected Decisions

| Item | Reason |
|---|---|
| Lavender palette (#8B5CF6) | Script is not a meditation app — grayish blue is clinically more appropriate for ASD |
| Lavender gradient on button | Introduces a hue foreign to the palette; use mono-blue instead |
| Background dot pattern (SVG) | `backgroundImage` is not native in React Native without `react-native-svg`; cost-benefit ratio does not justify the dependency |
| Neumorphism as base style | WCAG AAA contrast issues; the current "Soft UI" is safer |

### 12.4 Deferred Decisions

| Item | When | Reason |
|---|---|---|
| Body map with contextual emotional colors | Week 3 | Requires the emotional system + historical data in production first |
| Visual companion (mascot/plant) | Week 3 | Already confirmed in v1.2 |

### 12.5 Reference Palette vs. Evaluated Alternatives

| Evaluated option | Decision | Justification |
|---|---|---|
| Lavender palette (skill §Mental Health) | ❌ Rejected | For ASD, grayish blue is emotionally more stable than lavender |
| Blue-green palette (skill §Healthcare) | ✅ Compatible | `script-accent: #10B981` covers the confirmation green |
| Current palette `script-blue: #A8C5DA` | ✅ Kept | Clinically validated — blue does not alarm, not associated with error |

---

**→ Cross-references:** §1.4 (emotional colors), §2 (Atkinson), §4 (shadows + gradient), §7 (animation reduction)  
**→ See also:** STATUS.md tickets T-V1 to T-V8, IMPLEMENTATION_PLAN.md §Week 2
