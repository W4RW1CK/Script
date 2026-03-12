# TECH_STACK.md — Technology Stack
## Script — Digital Companion for Adults with ASD Level 1

**Version:** 1.5  
**Last updated:** 2026-03-11  
**Changes v1.5:** Route `history.tsx` → `history/index.tsx` (folder structure). `@expo-google-fonts/atkinson-hyperlegible` version pinned to `^0.4.1`. `@react-native-async-storage/async-storage` version updated to `2.2.0`. `history/index.tsx` and `settings/index.tsx` now reflect implemented screens. `dictionary.tsx` marked as Week 2 pending.  
**Changes v1.4:** `@expo-google-fonts/inter` → `@expo-google-fonts/atkinson-hyperlegible` (T-U3 — accessible font for ASD). Ref: FRONTEND_GUIDELINES.md §2.  
**Changes v1.3:** Removed `expo-symbols` (SF Symbols only works on iOS/web — B-07); icon standard updated to `@expo/vector-icons` (Ionicons), already bundled with Expo.  
**Changes v1.2:** Added `expo-symbols` to Styles and UI and to the install command (required by FRONTEND_GUIDELINES §8).  
**Changes v1.1:** Versions verified against npm registry. Expo 52→55, React 18→19, Reanimated 3→4, openai 4→6, zod 3→4, expo-av→expo-audio, all expo package versions updated.

> ⚠️ **Golden rule:** Do not install any package not listed in this document without updating this file first. Version consistency prevents 80% of setup bugs.

---

## Base Platform

| Tool | Version | Purpose |
|---|---|---|
| **Expo SDK** | **55.0.2** | Main framework — web + Android from a single codebase |
| **React Native** | **0.79.x** | (included in Expo 55) |
| **React** | **19.2.x** | (included in Expo 55) — **React 19, not 18** |
| **TypeScript** | **5.3.x** | Strict typing — mandatory throughout the project |
| **Node.js** | **20.x (LTS)** | Development runtime |

> ⚠️ **React 19 Note:** React 19 introduces changes to `use`, `useActionState`, and ref handling. AI agents must generate React 19-compatible code. Do not use deprecated React 17/18 patterns.

---

## Routing and Navigation

| Tool | Version | Purpose |
|---|---|---|
| **expo-router** | **55.0.2** | File-based routing (Expo 55 uses its own synchronized version) |

**Route structure:**
```
app/
├── (onboarding)/
│   ├── index.tsx          → S01 Welcome
│   ├── aq10.tsx           → S02 AQ-10 Test (10 questions)
│   ├── aq10-result.tsx    → S03 AQ-10 Result + decision to continue
│   ├── aq-full.tsx        → S04 Full AQ (50 questions, optional)
│   ├── catq.tsx           → S05 CAT-Q (25 questions, optional)
│   ├── raads.tsx          → S06 RAADS-R (80 questions, optional)
│   ├── profile.tsx        → S07 Personal Questionnaire
│   └── contacts.tsx       → S08 Trusted Contacts Setup
├── (app)/
│   ├── _layout.tsx        → Layout with bottom navigation (5 tabs)
│   ├── home.tsx           → S09 Home
│   ├── checkin/
│   │   ├── body.tsx       → S10 Body Map
│   │   ├── notes.tsx      → S11 Free Text
│   │   ├── reflect.tsx    → S12 AI Interpretation
│   │   └── result.tsx     → S13 Check-in Result
│   ├── scripts/
│   │   ├── index.tsx      → S14 Script Library
│   │   ├── [id].tsx       → S15 Script Detail
│   │   └── [id]/execute.tsx → S16 Script Execution
│   ├── rescue/
│   │   ├── assess.tsx     → S17 Crisis Assessment
│   │   └── protocol.tsx   → S18 Rescue Protocol
│   ├── history/
│   │   └── index.tsx      → S19 History (implemented Week 2)
│   ├── dictionary.tsx     → S20 Emotional Dictionary (⏳ Sprint 2.3)
│   └── settings/
│       ├── index.tsx      → S21 Settings
│       └── contacts.tsx   → S22 Contact Management
├── therapist/
│   └── index.tsx          → S23 Therapist View
└── auth.tsx               → S24 Login / Auth
```

---

## Styles and UI

| Tool | Version | Purpose |
|---|---|---|
| **nativewind** | **4.2.2** | Tailwind CSS for React Native |
| **tailwindcss** | **3.4.x** | Required by NativeWind 4 (≥3.3.0) |
| **react-native-svg** | **15.15.3** | Interactive body silhouette + breathing circle |
| **react-native-reanimated** | **4.2.2** | Smooth animations |
| **react-native-worklets** | **0.7.4** | ⚠️ NEW — Peer dependency required by Reanimated 4 |
| **@expo-google-fonts/atkinson-hyperlegible** | **^0.4.1** | Atkinson Hyperlegible font (T-U3 — replaces Inter — accessibility-first design) |
| **expo-font** | **13.x** | Custom font loading |
| **@expo/vector-icons** (Ionicons) | bundled with Expo | Cross-platform icons iOS/Android/web — project standard. ⚠️ NEVER use `expo-symbols` (iOS/web only) |

> ⚠️ **Important change — Reanimated 4:** Version 4.x uses a new worklets architecture. The `useAnimatedStyle`, `withTiming`, etc. API remains the same, but now requires `react-native-worklets` to be installed. Without this dependency the app crashes at runtime.

> ⚠️ **NativeWind Note:** Requires specific configuration in `babel.config.js` and `tailwind.config.js`. See configuration section below.

**`tailwind.config.js` — REQUIRED:**
```javascript
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
        // Light mode
        'script-bg': '#F8F6F2',
        'script-bg-secondary': '#EFEFEA',
        'script-bg-elevated': '#FFFFFF',
        'script-text': '#2D2D2D',
        'script-text-secondary': '#6B6B6B',
        'script-blue': '#A8C5DA',
        'script-green': '#B8DABC',
        'script-peach': '#F2C9B0',
        'script-lavender': '#C4B8DA',
        'script-crisis': '#F5EFEF',
        'script-crisis-soft': '#E8C4C4',
        'script-border': '#E0DDD8',
        // Dark mode
        'script-dark-bg': '#1C1C22',
        'script-dark-secondary': '#26262E',
        'script-dark-blue': '#5A7E92',
        'script-dark-crisis': '#221E1E',
      },
    },
  },
  plugins: [],
}
```

**`babel.config.js`:**
```javascript
module.exports = function (api) {
  api.cache(true);
  return {
    presets: [
      ["babel-preset-expo", { jsxImportSource: "nativewind" }],
      "nativewind/babel",
    ],
  };
};
```

---

## Backend — Supabase

| Tool | Version | Purpose |
|---|---|---|
| **@supabase/supabase-js** | **2.97.0** | JS client for everything: DB, auth, storage, realtime |
| **Supabase** (service) | — | PostgreSQL + Auth + Storage + Edge Functions |

**Configuration:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'
import * as SecureStore from 'expo-secure-store'

const ExpoSecureStoreAdapter = {
  getItem: (key: string) => SecureStore.getItemAsync(key),
  setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
  removeItem: (key: string) => SecureStore.deleteItemAsync(key),
}

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!,
  {
    auth: {
      storage: ExpoSecureStoreAdapter,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: false,
    },
  }
)
```

---

## Authentication and Wallet

| Tool | Version | Purpose |
|---|---|---|
| **@privy-io/expo** | **0.63.6** | Multi-method auth: email, Google, Apple, embedded wallet |
| **Privy** (service) | — | Session management + custodial wallets |

**Enabled login methods:**
1. Email (magic link)
2. Google OAuth
3. Embedded wallet (for EAS attestations in Week 5)

---

## Artificial Intelligence

| Tool | Version | Purpose |
|---|---|---|
| **openai** | **6.25.0** | Official OpenAI SDK |
| **GPT-4o** | latest | Emotional interpretation + script suggestions |

> ⚠️ **Important change — openai v6:** The OpenAI SDK changed its API between v4 and v6. Always use v6 syntax:

```typescript
// ✅ Correct — openai v6
import OpenAI from 'openai'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  response_format: { type: 'json_object' },
})

// ❌ Incorrect — old v4 syntax
import { Configuration, OpenAIApi } from 'openai' // Does not exist in v6
```

**Only in Supabase Edge Functions (server-side). NEVER on the client.**

---

## Audio and Sensors

| Tool | Version | Purpose |
|---|---|---|
| **expo-audio** | **55.0.8** | ✅ Modern replacement for expo-av for audio |
| **expo-haptics** | **55.0.8** | Haptic feedback in the breathing protocol |
| **expo-location** | **55.1.2** | Location in crisis alerts (with explicit permission) |
| **expo-sms** | **55.0.8** | Native SMS fallback for offline alerts |

> ⚠️ **expo-av is deprecated:** Do not use expo-av in new projects with Expo 55. Use `expo-audio` for audio playback.

**Using expo-audio for calm tones:**
```typescript
import { useAudioPlayer } from 'expo-audio'

const player = useAudioPlayer(require('../assets/audio/calm-tone.mp3'))
player.play()
player.pause()
```

---

## Push Notifications

| Tool | Version | Purpose |
|---|---|---|
| **expo-notifications** | **55.0.10** | Local and remote push notifications |
| **expo-device** | **7.x** | Detect if it's a real device (required for push) |
| **Firebase Cloud Messaging (FCM)** | — | Backend for Android notification delivery |

---

## State and Data

| Tool | Version | Purpose |
|---|---|---|
| **zustand** | **5.0.11** | Client global state (session, preferences, crisis state) |
| **@tanstack/react-query** | **5.90.x** | Server state (fetch, cache, synchronization) |
| **expo-secure-store** | **55.0.8** | Encrypted local storage (offline data, tokens) |
| **@react-native-async-storage/async-storage** | **2.x** | Non-sensitive offline storage (cached scripts) |

---

## Forms and Validation

| Tool | Version | Purpose |
|---|---|---|
| **react-hook-form** | **7.55.x** | Form handling (AQ-10, questionnaire, scripts) |
| **@hookform/resolvers** | **5.2.2** | Integration with schema validators |
| **zod** | **4.3.6** | Schema validation |

> ⚠️ **Zod 4 — API changes:** Zod 4 has significant changes vs Zod 3. Always use Zod 4 syntax:

```typescript
// ✅ Correct — Zod 4
import { z } from 'zod'
const schema = z.object({
  name: z.string().min(1),
  score: z.number().int().min(0).max(10),
})
// Type inference works the same: z.infer<typeof schema>

// ❌ Zod 3 had z.string().nonempty() — in Zod 4 use .min(1)
```

---

## Utilities

| Tool | Version | Purpose |
|---|---|---|
| **date-fns** | **4.1.0** | Date handling for history and patterns |

---

## Build and Deploy

| Tool | Version | Purpose |
|---|---|---|
| **EAS Build** | latest | APK and IPA cloud builds |
| **EAS Update** | latest | OTA updates without going through the store |
| **Expo Go** | latest | Testing on a physical device during development |

**`eas.json`:**
```json
{
  "build": {
    "preview": {
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "aab"
      }
    }
  }
}
```

**APK build command:**
```bash
eas build --platform android --profile preview
```

---

## Environment Variables

File: `.env.local` (never commit — add to `.gitignore`)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://[project].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Privy
EXPO_PUBLIC_PRIVY_APP_ID=[privy-app-id]

# OpenAI — ONLY in Supabase Edge Functions, NEVER as EXPO_PUBLIC_
OPENAI_API_KEY=[openai-key]

# Telegram (week 3+)
TELEGRAM_BOT_TOKEN=[bot-token]
```

> ⚠️ `OPENAI_API_KEY` NEVER goes as `EXPO_PUBLIC_`. Exposing this key on the client compromises security and generates uncontrolled costs. It only lives in Supabase Edge Functions.

---

## Full Installation Command (Week 1)

```bash
# 1. Create project
npx create-expo-app@latest script-app --template tabs
cd script-app

# 2. Expo packages (use npx expo install for guaranteed compatibility)
npx expo install expo-router
npx expo install react-native-svg
npx expo install react-native-reanimated react-native-worklets
npx expo install expo-audio expo-haptics expo-location expo-sms
npx expo install expo-notifications expo-device
npx expo install expo-secure-store @react-native-async-storage/async-storage
npx expo install expo-font @expo-google-fonts/atkinson-hyperlegible
# @expo/vector-icons is already bundled with Expo — no additional installation required
# expo-symbols was removed (B-07): SF Symbols only works on iOS/web

# 3. npm packages (fixed versions)
npm install @supabase/supabase-js@2.97.0
npm install @privy-io/expo@0.63.6
npm install openai@6.25.0
npm install zustand@5.0.11
npm install @tanstack/react-query@5.90.21
npm install date-fns@4.1.0
npm install zod@4.3.6
npm install react-hook-form@7.55.0 @hookform/resolvers@5.2.2

# 4. NativeWind
npm install nativewind@4.2.2 tailwindcss@3.4.0
```

> ✅ Using `npx expo install` (not `npm install`) for Expo packages guarantees compatibility with the installed SDK.

---

## Code Rules (For AI Agents)

1. **Strict TypeScript always.** No `any`. Type everything.
2. **NativeWind for styles.** No StyleSheet except for animations/SVG.
3. **Supabase for all remote persistence.** No direct fetch to your own APIs.
4. **OpenAI v6 API.** Do not use syntax from older versions.
5. **Zod 4 API.** Do not use `.nonempty()` or other deprecated Zod 3 APIs.
6. **expo-audio, not expo-av.** expo-av is deprecated in Expo 55.
7. **react-native-worklets installed** before react-native-reanimated.
8. **OpenAI only server-side** (Supabase Edge Functions). Never on the client.
9. **Zustand for global state.** No prop drilling more than 2 levels deep.
10. **React Query for server data.** No useState for remote data.
11. **Expo Router for navigation.** Not React Navigation directly.
12. **Offline-first:** Every write goes to SecureStore first, then syncs.
13. **No console.log in production.** Use a logger wrapper.
14. **React 19 patterns.** Do not use deprecated React 18 APIs.

---

## 📚 Research Resources (Dev Tools)

Tools for agents to consult scientific literature during development.
**Not app dependencies** — these are resources for making better design decisions.

| Resource | URL | Use in Script |
|---|---|---|
| **paper-search-mcp** | https://github.com/openags/paper-search-mcp | MCP server for searching papers on arXiv/PubMed/bioRxiv — validate test thresholds (AQ ≥6/≥32, RAADS-R), inform script content with clinical evidence, consult literature on ASD and masking |
