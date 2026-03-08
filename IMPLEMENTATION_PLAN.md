# IMPLEMENTATION_PLAN.md — Implementation Plan
## Script — Digital Companion for Adults with ASD Level 1

**Version:** 1.8  
**Last updated:** 2026-03-08  
**Changes v1.8:** Sprint 2.C (Onboarding Flow Redesign) added — 5 tickets (T-F1 to T-F5) implementing w4rw1ck flow decisions: S01 two CTAs, AQ-10 → ONE test, RAADS-R to Settings, S07 mandatory, S08 optional. Ref: PRD.md v1.5, APP_FLOW.md v1.4.  
**Changes v1.7:** Week 2 — sprints 2.A (Visual Foundation) and 2.B (Identity Screens) added. Emotional color system, Atkinson Hyperlegible, shadows, button gradient, emotion cards, home redesign, Y-i-P calendar. Ref: STATUS.md T-U1 to T-V9, FRONTEND_GUIDELINES.md v1.4.  
**Changes v1.6:** Step 5.1 replaced from smart contract to EAS attestations.  
**Changes v1.5:** §1.7 Step 2A — Level 1 grounding updated to MULTIMODAL (visual + guided audio/voice + haptic); adds tone-grounding-voice.mp3 to required assets. Decision confirmed in planning session 2026-02-27.  
**Changes v1.4:** §1.7 audio filename corrected calm-tone.mp3→tone-ambient.mp3 (consistent with BACKEND_STRUCTURE §5). §1.8 Step 5 tagline corrected (full text). §1.8 Step 12 profile-seed clarified as runtime/Zustand (not persisted in Supabase).  
**Changes v1.3:** FASE 1.1 — added expo-symbols to install; corrected @supabase/supabase-js from npx expo install → npm install@2.97.0 (pinned version, consistent with TECH_STACK.md).  
**Changes v1.2:** Screen IDs updated (S06-S14 → S10-S18). expo-av→expo-audio. react-native-worklets, @privy-io/expo and expo-device added to install. Steps 13-14 added in Fase 1.8 (profile.tsx, contacts.tsx). Week 2 Step 2.1 corrected. Tests directory in Fase 1.1.
**Total duration:** 5 weeks  
**Intermediate delivery:** Week 1 (Monday)

> **Instruction for AI agents:** Execute steps in the exact order indicated. Each step references canonical documents. Do not make stack, design, or architecture decisions outside of what is specified in PRD.md, TECH_STACK.md, FRONTEND_GUIDELINES.md, and BACKEND_STRUCTURE.md.

---

## WEEK 1 — MVP: Check-in + Scripts + Rescue
**Goal:** Functional app with the 3 core features. Deliverable on Monday.

---

### FASE 1.1 — Project Setup
**References:** TECH_STACK.md § Project Initialization

```bash
# Step 1: Create Expo project
npx create-expo-app@latest script-app --template tabs
cd script-app

# Step 2: Clean template — remove unnecessary files
# Delete: app/(tabs)/explore.tsx, components/ParallaxScrollView.tsx,
#         components/ThemedText.tsx, components/ThemedView.tsx

# Step 3: Install dependencies (exactly in this order)
# ⚠️ react-native-worklets MUST come before react-native-reanimated
npx expo install expo-router
npx expo install react-native-svg
npx expo install react-native-worklets react-native-reanimated
npx expo install expo-audio expo-haptics expo-notifications expo-device
npx expo install expo-location expo-sms
npx expo install expo-secure-store @react-native-async-storage/async-storage
npx expo install expo-font @expo-google-fonts/inter
npx expo install expo-symbols
npm install @supabase/supabase-js@2.97.0
npm install @privy-io/expo@0.63.6
npm install openai@6.25.0
npm install zustand@5.0.11 @tanstack/react-query@5.90.21
npm install date-fns@4.1.0 zod@4.3.6
npm install react-hook-form@7.55.0 @hookform/resolvers@5.2.2
npm install nativewind@4.2.2 tailwindcss@3.4.0
npm install --save-dev @types/react @types/react-native

# Step 4: Configure NativeWind
# Create tailwind.config.js with correct content paths for Expo Router
# Add NativeWind plugin to babel.config.js

# Step 5: Configure folder structure
mkdir -p app/\(onboarding\) app/\(app\)/checkin app/\(app\)/scripts app/\(app\)/rescue
mkdir -p app/\(app\)/settings app/therapist
mkdir -p components/ui components/body-map components/scripts components/rescue
mkdir -p lib hooks stores types constants supabase/functions/interpret-checkin
mkdir -p supabase/functions/send-crisis-notification supabase/functions/sync-privy-user
```

**Verification:** `npx expo start` runs without errors. Expo Go connects.

---

### FASE 1.2 — Variables and Supabase Configuration

**References:** TECH_STACK.md § Environment Variables, BACKEND_STRUCTURE.md § 2

```
Step 1: Create .env.local with Supabase variables (see TECH_STACK.md)
Step 2: Create lib/supabase.ts with the configured client
Step 3: In Supabase Dashboard → SQL Editor, run the SQL from BACKEND_STRUCTURE.md §2
        in this order:
        a) Table users
        b) Table profiles
        c) Table scripts
        d) Table checkins
        e) Table emotional_dictionary
        f) Table trusted_contacts
        g) Table crisis_events
        h) Table therapist_patients
        i) Table script_executions
Step 4: In Supabase → Authentication → Enable "Email" provider (magic link)
Step 5: Run RLS policies from BACKEND_STRUCTURE.md §3
Step 6: Run predefined scripts seed from BACKEND_STRUCTURE.md §6
```

**Verification:** `supabase.from('scripts').select('*')` returns 5 scripts.

---

### FASE 1.3 — Theme System and Base Components

**References:** FRONTEND_GUIDELINES.md § 1, 2, 3, 4

```
Step 1: Create constants/colors.ts with all color tokens (light + dark)
Step 2: Create constants/typography.ts with the typographic scale
Step 3: Create constants/spacing.ts with the spacing scale
Step 4: Create hook hooks/useTheme.ts that reads system preference
Step 5: Create base UI components:
        a) components/ui/Button.tsx (primary, secondary, ghost, danger)
        b) components/ui/Card.tsx
        c) components/ui/TextInput.tsx
        d) components/ui/Chip.tsx
        e) components/ui/Typography.tsx (Heading, Body, Caption)
Step 6: Create components/ui/SafeScreen.tsx (wrapper with SafeAreaView + theme)
```

**Verification:** Render each component on a test screen. Verify in light and dark mode.

---

### FASE 1.4 — Bottom Navigation and Main Layout

**References:** APP_FLOW.md § Persistent Navigation, FRONTEND_GUIDELINES.md § 4

```
Step 1: Configure app/(app)/_layout.tsx with Tab Navigator (Expo Router)
Step 2: Implement 5 tabs: Home, Check-in, Scripts, History, Settings
        - Use icons from FRONTEND_GUIDELINES.md §8
        - Active/inactive colors according to FRONTEND_GUIDELINES.md §4
Step 3: Add floating Rescue button (FAB) visible on all tabs
        - Position: bottom-right, above the bottom nav
        - Color: color-crisis-soft (soft, non-alarmist)
        - Navigates to: /rescue/assess
Step 4: Create app/(app)/home.tsx — basic Home screen with:
        - Greeting with user's name
        - Large button "How are you feeling today?" → /checkin/body
        - Quick access to Scripts
        - Quick access to the last check-in
```

**Verification:** Navigation between tabs works. FAB is visible and navigates correctly.

---

### FASE 1.5 — Body Check-in (Core Feature #1)

**References:** APP_FLOW.md § FLOW 2, FRONTEND_GUIDELINES.md §5, BACKEND_STRUCTURE.md §2 (checkins)

```
Step 1: Create component components/body-map/BodyMap.tsx
        - SVG with human silhouette (front)
        - 6 touch zones as defined in FRONTEND_GUIDELINES.md §5
        - State per zone: default / pressed / selected
        - Multi-selection support
        - Emits event: onZonesChange(zones: string[])

Step 2: Create app/(app)/checkin/body.tsx (S10)
        - Render BodyMap
        - Header: "What does your body feel?"
        - Instruction: "Touch the zones where you feel something"
        - Chips with selected zones
        - Button "Describe what I feel" (disabled if 0 zones)
        - Saves selected zones in local state

Step 3: Create app/(app)/checkin/notes.tsx (S11)
        - Displays selected zones as chips (read-only)
        - Multiline TextInput: "What do you perceive there?"
        - Placeholder: "Any word works. Pressure, heat, nothing, butterflies..."
        - Button "Done" → navigates to /checkin/reflect
        - Saves text in state

Step 4: Create app/(app)/checkin/reflect.tsx (S12)
        - Animated loader: "Connecting the dots..."
        - Call Supabase Edge Function interpret-checkin
          (If edge function is not ready: use mock with 5 hardcoded options)
        - Show 3-5 options as selectable cards
        - Button "None of these" → TextInput to write your own
        - Button "Continue" → /checkin/result

Step 5: Create app/(app)/checkin/result.tsx (S13)
        - Show confirmed emotion with visual icon
        - Text: "Thank you for exploring this."
        - If there is a suggested script: show card with button "View script"
        - Button "Save" → inserts into checkins table → S09 Home
        - Button "🚩 This doesn't feel right" → marks flagged_for_review = true

Step 6: Create Supabase Edge Function: interpret-checkin
        - Runtime: Deno
        - Import OpenAI
        - System prompt with ASD context (see instructions in this same step)
        - Return JSON with array of options
        
        BASE SYSTEM PROMPT:
        "You are an assistant specialized in supporting people with Level 1 ASD
        to identify their emotions. Your role is to suggest, not to diagnose.
        Use exploratory language: 'Could it be...?', 'Some people describe this as...'
        Never use: 'You feel', 'This is', 'Clearly'.
        Always respond in Spanish.
        Return a JSON with: { options: [{label, description, confidence}] }
        Maximum 5 options. Minimum 3."
```

**Verification:** User can complete a check-in from start to finish. Data saved in Supabase.

---

### FASE 1.6 — Social Scripts (Core Feature #2)

**References:** APP_FLOW.md § FLOW 3, BACKEND_STRUCTURE.md §6

```
Step 1: Create app/(app)/scripts/index.tsx (S14)
        - Fetch scripts (predefined + user's custom ones)
        - Group by category
        - Card per script: title + category icon + estimated duration
        - No search in MVP (simple list)

Step 2: Create app/(app)/scripts/[id].tsx (S15 — Preparation Mode)
        - Script title and description
        - Render each block:
          - type "apertura" / "accion" / "salida": show options as selectable chips
          - type "contexto": descriptive text (non-interactive)
        - Button "Execution Mode" → /scripts/[id]/execute
        - Button "← Back" → /scripts

Step 3: Create app/(app)/scripts/[id]/execute.tsx (S16 — Execution Mode)
        - State: current block (index)
        - One block visible at a time (clean screen)
        - For blocks with options: large touch cards
        - Selected option is highlighted
        - Button "→ Next" / "← Back"
        - Progress indicator: "Step 2 of 4"
        - Last block: button "✓ Completed"
        - Closing screen: scale 1-3 + save in script_executions → S09 Home
```

**Verification:** User can navigate and execute all 5 predefined scripts.

---

### FASE 1.7 — Rescue Button (Core Feature #3)

**References:** APP_FLOW.md § FLOW 4, FRONTEND_GUIDELINES.md §11, BACKEND_STRUCTURE.md §2 (crisis_events)

```
Step 1: Create app/(app)/rescue/assess.tsx (S17)
        - APPLY ALL rules from FRONTEND_GUIDELINES.md §11
        - Text: "How intense does this feel?"
        - 3 large buttons (minimum 64px height):
          1️⃣ "Uncomfortable"   2️⃣ "Difficult"   3️⃣ "I can't"
        - Save level in state
        - → /rescue/protocol (pass level as parameter)
        - Button "← Exit" (top left, always visible)

Step 2: Create app/(app)/rescue/protocol.tsx (S18)
        - APPLY ALL rules from FRONTEND_GUIDELINES.md §11
        
        A) If level === 1: Render GroundingSequence (MULTIMODAL — planning decision 2026-02-27)
           - Component that shows steps 5-4-3-2-1
           - One step at a time, large font
           - Auto-advances in 10s or tap to advance
           - Integrate expo-haptics: subtle vibration when changing step
           - Integrate expo-audio: guided voice + ambient tone in background
             Files: tone-grounding-voice.mp3 (voice), tone-ambient.mp3 (background)
             const voice = useAudioPlayer(require('../../assets/audio/tone-grounding-voice.mp3'))
             const ambient = useAudioPlayer(require('../../assets/audio/tone-ambient.mp3'))
           - If audio disabled: visual + haptic only
           - If haptic not available: visual + audio only
        
        B) If level === 2 or 3: Render BreathingGuide
           - Component with animated SVG circle (see FRONTEND_GUIDELINES.md §6)
           - Integrate expo-haptics: subtle vibration to the rhythm
           - Integrate expo-audio (NOT expo-av): load and play audio (if user enabled it)
             Example: const player = useAudioPlayer(require('../../assets/audio/tone-ambient.mp3'))
             // Bundled files: tone-inhale.mp3, tone-exhale.mp3, tone-ambient.mp3 (see BACKEND_STRUCTURE.md §5)
           - 3 minimum cycles (inhale 4s + pause 2s + exhale 6s = 12s per cycle)
           - After cycles: show final options
        
        C) If level === 3 (additional):
           - Background: request location permission if not granted
           - Call Supabase Edge Function send-crisis-notification
           - Show soft confirmation: "Notifying your contacts..."
        
        D) Final options (all levels):
           - "I feel better" → S09 Home
           - "I need more help" → show direct call button to contact #1
           - "Log" → mini form (1 field: how did it turn out?) → crisis_events → S09 Home

Step 3: Create Supabase Edge Function: send-crisis-notification
        - Fetch user's trusted_contacts
        - For each active contact: call Expo Push API
        - Save record in crisis_events
        - Return { notified: number }
        
        Push notification format:
        Title: "⚡ [Name] needs support"
        Body: "They are having a difficult moment. [Address if available]"
        Data: { type: 'crisis', user_id, latitude?, longitude? }
```

**Verification:** Full protocol works (level 1, 2, and 3). Notification arrives on a test device.

---

### FASE 1.8 — Basic Auth + Complete Onboarding

**References:** TECH_STACK.md § Authentication, BACKEND_STRUCTURE.md §8, PRD.md §3.1 + Appendices A-E, APP_FLOW.md § FLOW 1

```
Step 1: Install @privy-io/expo and configure PrivyProvider in app/_layout.tsx
Step 2: Create app/auth.tsx with:
        - Button "Continue with email" (magic link)
        - Button "Continue with Google"
        - Text: "No account, just an email. Your data is yours."
Step 3: Create Supabase Edge Function sync-privy-user:
        - Receives privy_user_id + email
        - Creates or updates record in users
        - Returns Supabase user token
Step 4: Configure post-auth redirect:
        - If onboarding_complete = false → /onboarding
        - If onboarding_complete = true → /home
Step 5: Create app/(onboarding)/index.tsx (S01 Welcome):
        - Screen with logo/name "Script"
        - Tagline: "A manual for those who feel they are the only actor in the play who doesn't know the script"
        - Button "Start my journey" → /onboarding/aq10
        - Button "I need help now" → /rescue/assess

Step 6: Create app/(onboarding)/aq10.tsx (S02):
        - 10 questions from PRD Appendix A, ONE per screen
        - Scale: 4 options (Strongly agree / Slightly agree /
          Slightly disagree / Strongly disagree)
        - Progress bar: "Question X of 10"
        - No "back" button between questions (to avoid over-thinking)
        - When done: calculate score and navigate to /onboarding/aq10-result

Step 7: Create app/(onboarding)/aq10-result.tsx (S03):
        - Show score + message from PRD Appendix A (without using words "positive/negative")
        - If score ≥6: show card recommending Full AQ
        - If score <6: show card recommending CAT-Q
        - Always show RAADS-R option as third test
        - Button per test: "Take now" / "Later"
        - Button: "Skip additional tests → Continue" → /onboarding/profile

Step 8: Create reusable TestScreen component with:
        - Props: questions[], scale, title, onComplete(scores)
        - Question-by-question navigation
        - Button "Pause and continue later" (saves progress in SecureStore)
        - Visible progress: "Question X of Y"

Step 9: Create app/(onboarding)/aq-full.tsx (S04 — AQ 50 questions):
        - Use TestScreen component
        - 50 questions from PRD Appendix C
        - Same scale format as AQ-10
        - On completion: save aq_full_score + aq_full_domain_scores in profiles
        - Button "Skip" always visible → /onboarding/catq

Step 10: Create app/(onboarding)/catq.tsx (S05 — 25 questions):
        - Use TestScreen component
        - 25 questions from PRD Appendix D
        - Scale 1-7 (7 options)
        - On completion: calculate catq_total_score + catq_subscores, save in profiles
        - Button "Skip" always visible → /onboarding/raads

Step 11: Create app/(onboarding)/raads.tsx (S06 — 80 questions):
        - Use TestScreen component with pause support
        - 80 questions from PRD Appendix E
        - Scale 0-3 (4 options)
        - On completion: calculate raads scores by domain, save in profiles
        - Button "Skip" always visible → /onboarding/profile

Step 12: Create function lib/profile-seed.ts:
        - INPUT: scores from all completed tests
        - OUTPUT: seed profile with:
          - scripts_priority: string[] (which scripts to show first)
          - sensory_defaults: { light, sound, touch, crowds }
          - emphasis: 'social' | 'sensory' | 'masking' | 'general'
        - ⚠️ RUNTIME: these values are NOT persisted in the `profiles` table in Supabase
          (those columns don't exist). They are saved in the Zustand store on login
          and re-calculated from the saved scores. Optional: cache in SecureStore.
        - This function feeds the user's first personalized experience

Step 13: Create app/(onboarding)/profile.tsx (S07 — Personal Questionnaire):
        - Form with react-hook-form + zod
        - Fields: name (text), age (number), interests (multiselect chips),
          sensitivities (checkboxes: light / sound / textures / crowds),
          tools already used (multiselect: journaling / therapy / meditation / none)
        - Save in profiles table (interests, sensitivities, existing_tools)
        - Button "Continue" → /onboarding/contacts

Step 14: Create app/(onboarding)/contacts.tsx (S08 — Contact Setup):
        - Form: name + phone + relationship (selector)
        - Button "Add contact" → saves in trusted_contacts
        - List of already added contacts (deletable chips)
        - Button "Skip for now" → S24 Auth
        - Button "Done (X contacts)" → S24 Auth
        - On reaching auth: mark onboarding_complete = true in profiles
```

**Verification:** Full flow: S01 → S02 → S03 → S07 → S08 → S24 → S09. Email login works. Profile with basic data in Supabase. profile-seed function returns data consistent with scores.

---

## WEEK 2 — History, Dictionary, Personalization and Visual Identity

> **Note v1.7 (2026-03-06):** Sprints 2.A (Visual Foundation) and 2.B (Identity Screens) added as a result of the UI/UX audit + visual identity analysis. Ref: STATUS.md tickets T-U1 to T-V9, FRONTEND_GUIDELINES.md §1.4/§2/§4/§7/§12.

```
2.A SPRINT — Visual Foundation (do BEFORE 2.1–2.5)

2.A.1 Critical pre-user tickets
    T-U1: useReduceMotion() in protocol.tsx, body.tsx, and any Reanimated animation
         Pattern: const shouldReduce = useReduceMotion(); if (shouldReduce) skip animation
         Ref: FRONTEND_GUIDELINES.md §7 (Ana)
    T-U2: Visible error feedback in reflect.tsx when interpret-checkin fails
         User must know that the interpretation is approximate or failed
         Ref: STATUS.md T-U2 (Aibus)

2.A.2 Emotional color system (T-V1) — BLOCKING for T-V3, T-V4, T-V5
    - Create constants/colors.ts with EmotionColors (7 emotions × {bg, dot, text})
    - Export EmotionKey type
    - Ref: FRONTEND_GUIDELINES.md §1.4 (Ana)

2.A.3 New NativeWind tokens in tailwind.config.js (T-U4, T-V2)
    - Add script-accent: #10B981, script-warning: #F59E0B (T-U4)
    - Add shadow-card, shadow-card-elevated, shadow-card-pressed, shadow-card-dark (T-V2)
    - Update Card.tsx to use shadow-card by default
    - Ref: FRONTEND_GUIDELINES.md §1.2.1 + §4 (Aibus)

2.A.4 Atkinson Hyperlegible (T-U3)
    - npx expo install @expo-google-fonts/atkinson-hyperlegible
    - _layout.tsx: replace Inter fonts with Atkinson Regular + Bold
    - constants/typography.ts: update fontFamily (no SemiBold — headings use Bold)
    - Ref: FRONTEND_GUIDELINES.md §2 (Aibus)

2.A.5 GPT label normalization in Edge Function (T-V7) — BLOCKING for T-V3
    - interpret-checkin/index.ts: post-process output → map to 8 canonical labels
    - Ref: FRONTEND_GUIDELINES.md §1.4 (mapping) (Aibus)

2.A.6 Mono-blue gradient in Button.tsx (T-V6)
    - Primary variant: gradient 135° #A8C5DA → #8BAEC4
    - Ref: FRONTEND_GUIDELINES.md §4 (Aibus)

2.A.7 Contrast audit (T-U6)
    - text-script-text-secondary (#6B6B6B on #F8F6F2) — verify WCAG AA
    - If fails → adjust to #606060
    - Ref: FRONTEND_GUIDELINES.md §10 (Ana)


2.B SPRINT — Visual Identity Screens (after 2.A)

2.B.1 reflect.tsx — emotion cards with color (T-V3)
    - Selected card: EmotionColors[key].bg as background, dot as 1.5px border + 8px circle
    - Press animation: scale 0.97→1.0 (100ms)
    - Requires T-V1 + T-V7
    - Ref: FRONTEND_GUIDELINES.md §12.2 (Ana)

2.B.2 result.tsx — emotion color background (T-V4)
    - Screen S13: full-screen background EmotionColors[key].bg
    - Fade transition 300ms from previous card color
    - Requires T-V1
    - Ref: FRONTEND_GUIDELINES.md §12.2 (Ana)

2.B.3 home.tsx — Finch redesign (T-V5)
    - Layout: greeting + time of day, "last emotion" card with EmotionColors, 7-day mini history, check-in CTA, quick script tiles
    - Empty state when no previous data (first open)
    - Requires T-V1
    - Ref: FRONTEND_GUIDELINES.md §0 + §12.2 (Ana)

2.B.4 Confirmation before Level 3 notification (T-U5)
    - protocol.tsx: Alert.alert("Confirm?") before sending to trust network
    - Ref: UX Guideline #35 (Ana)


2.1 Optional screening tests accessible from Settings
    - Complete steps the user skipped during onboarding (S04, S05, S06)
    - app/(app)/settings/index.tsx: add "Complete my profile" section
    - Show pending tests with progress indicator
    - Tests available from Settings without repeating onboarding
    - Note: AQ-10, questionnaire and contacts already implemented in Week 1 Fase 1.8

2.2 Check-in history
    - app/(app)/history.tsx: list of check-ins with date, emotion, zones
    - Year in Pixels style calendar (T-V8): 36x36px dots with EmotionColors[key].dot per day
    - Tap on day → bottom sheet with detail
    - Requires T-V1 (emotional system)

2.3 Emotional dictionary
    - app/(app)/dictionary.tsx: confirmed words with frequency
    - Visual: chip grid with size proportional to frequency
    - Tap on word → view check-ins where it appeared

2.4 Personalization
    - app/(app)/settings/index.tsx: theme and palette selection
    - Zustand store for preferences (persisted in SecureStore)
    - Hook useTheme() updated to read from store

2.5 "Unlocked insights"
    - After 3 check-ins: first insight ("Your most active zone this week is...")
    - After 7: temporal pattern insight ("Your most difficult moments are on...")
    - Non-intrusive banner on Home when there is a new insight
```

---

## WEEK 3 — Trust Network and Notifications

```
3.1 Complete trusted contacts management
    - app/(app)/settings/contacts.tsx: full CRUD
    - Configure permissions per contact (what they can see)
    - Notification test

3.2 Complete notifications system
    - Register device in Expo Push
    - Configure local check-in reminder notifications
    - Configure user's preferred time

3.3 Telegram Bot for trusted contacts
    - Create bot with @BotFather
    - Updated edge function to send via Telegram
    - Registration flow: user gives link to contact → contact starts chat with bot

3.4 Bilateral crisis response
    - When contact receives push notification, they can respond with predefined options
    - Response appears on user's screen as a soft banner
    - Response history in crisis_events

3.5 Offline SMS fallback
    - Integrate expo-sms
    - Prepare pre-formatted message with user data
    - Activate only when there is no connection
```

**Technical + UX tickets for Week 3** (see STATUS.md for full detail):

| Ticket | Description | Owner |
|---|---|---|
| T-3.1 | Rate limiting in `interpret-checkin` — limit per `user_id` (10 calls/hour) | Aibus |
| T-3.2 | AI output logging — `ai_logs` table for clinical audit | Aibus |
| T-U7 | Active/pressed state on emotion cards — immediate UX feedback | Ana |
| T-U8 | Focus rings audit on `Card` and `Pressable` — accessibility | Aibus |
| T-V8 | Calendar S19 Year in Pixels — emotional dots 36×36px | Aibus |

---

## WEEK 4 — Artificial Intelligence and Therapist View

```
4.1 Improve interpret-checkin with full context
    - Include last 5 check-ins in the prompt
    - Include user's sensory profile
    - Include time and day of the week
    - Adjust temperature and tokens

4.2 Pattern detection
    - Edge function analyze-patterns:
      INPUT: 30-day history
      OUTPUT: { top_zones, top_emotions, trigger_times, trigger_contexts }
    - Visualization on history screen

4.3 AI-personalized scripts
    - Form to create script: situation → AI suggests blocks
    - User edits and confirms
    - Save in scripts with owner_user_id

4.4 Therapist view
    - Role 'therapist' in users
    - app/therapist/index.tsx: patient list
    - Patient view: check-ins, patterns, scripts
    - Create/edit scripts for patient
    - Button "Generate report" → download JSON/PDF

4.5 🚩 Flag button and clinical supervision
    - Therapist sees flagged interpretations
    - Can add a clarifying note
    - User receives feedback from therapist
```

**Technical + UX tickets for Week 4** (see STATUS.md for full detail):

| Ticket | Description | Owner |
|---|---|---|
| T-4.1 | Script fading mechanism — script generalization (Gray, Krantz & McClannahan) | Ana |
| T-4.2 | Validate body zones with Mahler protocol (8 interoceptive signals) | Ana |
| T-4.3 | Clinical supervision of test→profile mapping (adult ASD psychologist) | w4rw1ck |
| T-V9 | Body map with contextual emotional colors — requires T-V1 + historical data | Ana |

---

## WEEK 5 — On-Chain, Polish and APK

```
5.1 EAS consent attestations (Ethereum Attestation Service)
    - Clinical consent patient→therapist as immutable attestation
    - Passes the on-chain filter: it is a permanent commitment with legal/clinical significance
    - Does not require own smart contract: use EAS (attestation schema for health permissions)
    - Integrate with therapist view (S23): show verified consent status
    - Access permissions (CRUD) continue to be managed by Supabase RLS (off-chain)
    - Token-gating of premium features: architecture to define post-Week 5 (plan pending)

5.2 Complete offline synchronization
    - Implement offline-sync.ts (see BACKEND_STRUCTURE.md §7)
    - Queue of pending operations
    - Visual sync status indicator

5.3 Accessibility and sensory polish
    - Review accessibilityLabel on all interactive components
    - Verify contrast in both modes (WCAG AA)
    - Complete reduce-animations mode
    - Crisis mode: verify it meets ALL rules from FRONTEND_GUIDELINES.md §11

5.4 Build APK
    - Configure app.json: name, icon, splash screen
    - Configure eas.json (see TECH_STACK.md § Build and Deploy)
    - Run: eas build --platform android --profile preview
    - Install APK on physical device and do a full test

5.5 Testing with real user
    - Install APK on diagnosed friend's device
    - 30-minute test session with the 3 main flows
    - Document friction points
    - Iterate on critical items
```

---

## SPRINT 2.C — Onboarding Flow Redesign
**Decision by:** w4rw1ck · **Date:** 2026-03-08  
**References:** PRD.md v1.5 §3.1, APP_FLOW.md v1.4 Flow 1  
**Rationale:** Reduce onboarding friction; one guided test eliminates decision fatigue for ASD Level 1 users

| Ticket | Screen | Change | Owner | Priority |
|---|---|---|---|---|
| T-F1 | S01 `index.tsx` | Add second CTA: "I need help right now" → navigate to `/(app)/rescue/assess` without auth | Ana | 🔴 High |
| T-F2 | S03 `aq10-result.tsx` | Show ONE recommended test (AQ if ≥6, CAT-Q if <6). Remove cascade to S06. Add "Skip for now" → S07. | Ana | 🔴 High |
| T-F3 | S07 `profile.tsx` | Remove skip button. Trim form to 4–5 questions (name, 2 sensitivities, 1–2 interests, tools). Update copy to "Tell us about you" framing. | Ana | 🔴 High |
| T-F4 | S08 `contacts.tsx` | Update skip copy to "Skip for now — I'll add contacts later". Add warm explanation of why contacts matter. Keep skip functional. | Ana | 🟡 Medium |
| T-F5 | S06 `raads.tsx` + Settings | Remove RAADS-R from onboarding navigation. Add entry point in `settings/index.tsx` → "Complete my profile" section. | Aibus | 🟡 Medium |

### T-F1 — S01: Add "I need help right now" CTA

```tsx
// app/(onboarding)/index.tsx
// Add second button alongside "Begin my journey"
<Button
  title="I need help right now"
  variant="ghost"
  onPress={() => router.push("/(app)/rescue/assess")}
  accessibilityLabel="I need immediate support"
  accessibilityHint="Opens the rescue protocol without requiring login"
/>
```
> Crisis access must NEVER be blocked by auth walls (PRD §6, Principle 6)

### T-F2 — S03: Hide score, ONE test recommendation

```tsx
// app/(onboarding)/aq10-result.tsx
// 
// DECISION (w4rw1ck 2026-03-08): Do NOT display the numerical AQ-10 score.
// Showing "7/10" triggers grade-thinking and validation anxiety — both
// counterproductive for ASD Level 1 users who have spent their lives being evaluated.
// The score is stored silently in Supabase (for therapist view / Settings).
//
// Screen shows:
// 1. Warm, non-diagnostic message (no score)
//    e.g. "The way you answered tells us something useful. Many people who experience
//          the world the way you described find these tools genuinely helpful."
// 2. ONE recommended test based on internal score:
//    - Score ≥6 → Full AQ only ("We suggest the Full AQ for a more accurate profile")
//    - Score <6 → CAT-Q only ("We suggest the CAT-Q — it detects patterns often missed")
// 3. CTA: "Take [test] now" + "Skip for now → S07"
// 4. Remove: all navigation to S06 RAADS-R from this screen
```

### T-F3 — S07: Mandatory profile, trimmed form

```tsx
// app/(onboarding)/profile.tsx
// Remove skip button entirely
// Trim to: displayName, sensitivities (max 2), interests (max 2), existingTools
// Update heading: "Tell us about you" / "So we can make this yours"
// Keep: Continue button, validation that displayName is not empty
```

### T-F4 — S08: Optional contacts with warm copy

```tsx
// app/(onboarding)/contacts.tsx  
// Update skip button text: "Skip for now — I'll add contacts later"
// Add info text: "A trusted contact can receive a notification if you're in crisis.
//                You can always add people later from Settings."
```

### T-F5 — RAADS-R to Settings

```
1. Remove RAADS-R from onboarding navigation graph in aq10-result.tsx
2. Add "Complete my profile" section to settings/index.tsx
   - Shows: test completion status (✅ / ⏳)
   - Entry points: Full AQ, CAT-Q, RAADS-R
3. Update APP_FLOW.md (done ✅) and screen S06 route to /settings/raads
```

---

## Delivery Checklist by Week

### Week 1 (Monday) ✅
- [ ] App runs in Expo Go on physical device
- [ ] Onboarding works: S01 → S02 → S03 → S07 → S08 → S24 → S09
- [ ] Complete check-in from start to finish: S10 → S11 → S12 → S13
- [ ] 5 scripts navigable in preparation mode (S15) and execution mode (S16)
- [ ] Rescue button works (level 1, 2, and 3): S17 → S18
- [ ] Data saved in Supabase (profiles + checkins + crisis_events)
- [ ] Basic auth with email (Privy + sync-privy-user)

### Week 2 ✅
- [ ] Optional tests accessible from Settings (S04, S05, S06)
- [ ] Check-in history visible (S19)
- [ ] Emotional dictionary is built (S20)
- [ ] Light/dark theme functional (S21)

### Week 3 ✅
- [ ] Trusted contacts fully configurable
- [ ] Push notification arrives on crisis
- [ ] Telegram bot functional (optional)
- [ ] Offline SMS fallback functional

### Week 4 ✅
- [ ] AI improves interpretations with history
- [ ] Patterns visible after 7+ check-ins
- [ ] Basic therapist view functional
- [ ] Custom scripts with AI assistance

### Week 5 ✅
- [ ] Installable APK generated and tested
- [ ] EAS consent attestations functional (testnet)
- [ ] Full test with real user
- [ ] App does not generate any sensory triggers (validated by user with ASD)
