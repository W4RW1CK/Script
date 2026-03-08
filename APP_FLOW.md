# APP_FLOW.md — Navigation Flows
## Script — Digital Companion for Adults with ASD Level 1

**Version:** 1.3  
**Last updated:** 2026-02-27  
**Changes v1.2:** Screen IDs renumbered to eliminate duplicates. Cross-references corrected. New screens S03-S06 (screening tests).

---

## Screen Inventory

### Onboarding

| ID | Name | Route | Description |
|---|---|---|---|
| S01 | Splash / Welcome | `/` | First screen, two options |
| S02 | AQ-10 Test | `/onboarding/aq10` | 10 indicative questions |
| S03 | AQ-10 Result + Next Steps | `/onboarding/aq10-result` | Score + recommended tests |
| S04 | Full AQ (50 questions) | `/onboarding/aq-full` | Only if AQ-10 ≥6, skippable |
| S05 | CAT-Q (25 questions) | `/onboarding/catq` | Measures masking, skippable |
| S06 | RAADS-R (80 questions) | `/onboarding/raads` | Subcritical presentation, skippable |
| S07 | Personal Questionnaire | `/onboarding/profile` | Interests, sensory preferences |
| S08 | Contacts Setup | `/onboarding/contacts` | Add trusted people (skippable) |
| S24 | Login / Auth | `/auth` | Privy: email/social/wallet |

### Main App

| ID | Name | Route | Description |
|---|---|---|---|
| S09 | Home | `/home` | Main dashboard |
| S10 | Check-in — Body Map | `/checkin/body` | Interactive silhouette |
| S11 | Check-in — Free Text | `/checkin/notes` | Sensations input |
| S12 | Check-in — AI Interpretation | `/checkin/reflect` | Emotion options |
| S13 | Check-in — Result | `/checkin/result` | Emotion + recommendation |
| S14 | Scripts — Library | `/scripts` | List of available scripts |
| S15 | Script — Detail / Preparation | `/scripts/[id]` | Full script view |
| S16 | Script — Execution | `/scripts/[id]/execute` | Real-time mode, step by step |
| S17 | Rescue — Assessment | `/rescue/assess` | Intensity scale 1–3 |
| S18 | Rescue — Protocol | `/rescue/protocol` | Multimodal calming |
| S19 | History | `/history` | Previous check-ins |
| S20 | Emotional Dictionary | `/dictionary` | Personal vocabulary |
| S21 | Settings | `/settings` | Profile, themes, notifications |
| S22 | Contacts Management | `/settings/contacts` | Add/edit/delete |
| S23 | Therapist View | `/therapist` | Patient dashboard (therapist role) |

**Total: 24 screens**

---

## Main Flows

---

### FLOW 1: First Launch — Onboarding

**Trigger:** User opens the app for the first time (no session)

```
S01 Welcome
├── [Button: "Start my journey"] → S02 AQ-10
│   ├── User answers 10 questions (Likert scale, see PRD Appendix A)
│   ├── Result calculated (≤5: low score / ≥6: high score)
│   └── → S03 AQ-10 Result + Next Steps
│       ├── Shows score + NON-diagnostic message
│       ├── Score ≥6:
│       │   ├── Recommendation: "Next step: Full AQ (50 questions)"
│       │   └── [Button: "Take full AQ now"] → S04 Full AQ
│       │       └── Completed or [Skip] → S05 CAT-Q (optional)
│       │           └── Completed or [Skip] → S06 RAADS-R (optional)
│       │               └── Completed or [Skip] → S07 Personal Questionnaire
│       ├── Score <6:
│       │   ├── Recommendation: "Next step: CAT-Q (measures masking)"
│       │   └── [Button: "Take CAT-Q now"] → S05 CAT-Q
│       │       └── Completed or [Skip] → S06 RAADS-R (optional)
│       │           └── Completed or [Skip] → S07 Personal Questionnaire
│       └── [Button: "Skip additional tests"] → S07 Personal Questionnaire
│
│   S07 Personal Questionnaire
│   ├── Questions: name, age, interests (multiselect),
│   │   sensitivities (light / sound / textures / crowds),
│   │   tools you already use (none / journaling / therapy / meditation)
│   └── [Button: "Continue"] → S08 Contacts Setup
│       ├── [Button: "Add trusted contact"] → Form: name + phone + relationship
│       ├── [Button: "Skip for now"] → S24 Auth
│       └── [Button: "Done"] → S24 Auth
│           └── Auth completed → S09 Home
│
└── [Button: "I need help now"] → S17 Rescue (onboarding bypass)
    └── After completing protocol → S01 Welcome (option to complete onboarding)
```

**Rules for optional tests (S04, S05, S06):**
- Each test has a "Skip for now" button always visible
- If skipped, it becomes available in S21 Settings → "Complete my profile"
- Results from each test are saved immediately upon completion (not lost if app is closed)
- Progress bar is visible but without pressure: "Question 12 of 25"
- Long tests (S06 RAADS-R, 80 questions) can be paused and resumed

**Errors:**
- AQ-10 with not all questions answered: show pending questions indicator, do not block
- Auth fails: show specific error, option to retry or continue without account (local mode)

---

### FLOW 2: Body Check-in

**Trigger:** User taps "Check-in" from S09 Home, or from reminder notification

```
S09 Home → [Button: "How are you today?"] → S10 Body Map
│
S10 Body Map
├── SVG silhouette with 6 touch zones (see PRD Appendix B):
│   1. Head / Eyes / Jaw
│   2. Throat / Neck
│   3. Chest / Heart
│   4. Stomach / Abdomen
│   5. Hands / Arms
│   6. Legs / Feet
├── User taps 1+ zones → zones light up with soft color
├── Visual indicator of selected zones
└── [Button: "Describe what I feel"] → S11 Free Text
    │
    S11 Free Text
    ├── Free text field: "What do you perceive in those zones? Any word works."
    ├── Selected zones visible as chips at the top
    ├── Keyboard opens automatically
    └── [Button: "Done"] (or submit) → S12 AI Interpretation
        │
        S12 AI Interpretation
        ├── Loader: "Connecting the dots..."
        ├── AI receives: selected zones + free text + time of day + recent history
        ├── Shows 3–5 options in card format:
        │   "Could it be something like... [option]?"
        │   Example: "Social anxiety", "Sensory overload", "Exhaustion", "Frustration", "Emptiness"
        ├── [Tap on option] → option selected / confirmed
        ├── [Button: "No, none of these"] → text field: write your own word
        └── [Button: "Continue"] → S13 Result
            │
            S13 Result
            ├── Identified emotion shown with name + visual icon
            ├── Suggestion: relevant script OR regulation technique
            ├── [Button: "View suggested script"] → S15 Script Detail
            ├── [Button: "Save and exit"] → Saved in history → S09 Home
            └── [Button: "🚩 This doesn't feel right"] → marks interpretation for review → S09 Home
```

**Offline:** S10 and S11 work without connection. S12 uses simplified local interpretation (rules, not AI). Marked as "pending full analysis." On reconnect, processed with AI and result updated.

**Errors:**
- AI no response in >5s: show generic options based on selected zones
- No zones selected when advancing: tooltip "Tap at least one zone"

---

### FLOW 3: Social Scripts

**Trigger:** User taps "Scripts" from S09 Home, or from post check-in suggestion (S13)

```
S09 Home → [Button: "Scripts"] → S14 Scripts Library
│
S14 Library
├── List of scripts organized by category:
│   - Social conversations
│   - Public places
│   - Work / Study
│   - Crisis / Overload
│   - Custom (empty at start)
├── Each card shows: name + icon + estimated duration + mode (preparation/execution)
└── [Tap on script] → S15 Script Detail
    │
    S15 Script Detail — Preparation Mode
    ├── Title + scenario description
    ├── List of blocks:
    │   [Opening]: 2–3 phrase options
    │   [Context]: description of the situation
    │   [Request/Action]: 2–3 phrase options
    │   [Exit]: 2–3 phrase options (optional)
    ├── User can read, familiarize, mark favorites
    ├── [Button: "Execution Mode"] → S16 Script Execution
    └── [Button: "← Back"] → S14 Library
        │
        S16 Script Execution — Real Time
        ├── One block visible at a time (clean, minimal screen)
        ├── Current block in large text with 2–3 phrase options
        ├── User taps the phrase they will use → it is highlighted
        ├── [Button: "→ Next"] → next block
        ├── [Button: "← Back"] → previous block
        ├── Progress indicator (1/4, 2/4, etc.)
        └── Last block: [Button: "✓ Done"] → closing screen
            ├── "How did it go?" — scale 1-3 (Well / OK / Difficult)
            └── Saved in history → S09 Home
```

**Errors:**
- Script without connection: works completely offline (cached content)

---

### FLOW 4: Rescue Button

**Trigger:** User taps rescue button (always visible, floating FAB above bottom nav)

```
[Rescue Button — any screen] → S17 Rescue Assessment
│
S17 Assessment (neutral screen, reduced contrast)
├── Minimal text: "How intense does this feel?"
├── Three large touch options:
│   1️⃣ Uncomfortable   2️⃣ Difficult   3️⃣ I can't
└── [Tap on option] → S18 Protocol (according to level)
    │
    S18 Calming Protocol
    │
    ├── LEVEL 1 — Grounding 5-4-3-2-1
    │   ├── Multimodal sequence (visual + guided voice + haptic):
    │   │   5 things you can SEE / 4 you can TOUCH /
    │   │   3 you can HEAR / 2 you can SMELL / 1 you can TASTE
    │   ├── One instruction at a time, large font, neutral background
    │   ├── Audio: tone-grounding-voice.mp3 (voice) + tone-ambient.mp3 (background)
    │   ├── Haptic: subtle vibration when changing steps (if available)
    │   └── [Button: "Next"] advances / auto-advances in 10s
    │
    ├── LEVEL 2 — Guided Breathing
    │   ├── SVG circle: expands (inhale 4s) → pause (2s) → contracts (exhale 6s)
    │   ├── Audio: soft tone synchronized (activatable)
    │   ├── Haptic: subtle vibration synchronized (if available)
    │   ├── No long text — only "Inhale" / "Pause" / "Exhale"
    │   ├── 3 minimum cycles, user can extend
    │   └── → Transition to Grounding 5-4-3-2-1
    │
    └── LEVEL 3 — Breathing + Network Activation
        ├── Starts guided breathing (same as Level 2)
        ├── Simultaneously (background):
        │   ├── If online → native push notification to all contacts:
        │   │   "[Name] needs support. Location attached."
        │   │   Contacts see: name + location + brief context + 3 response options
        │   └── If offline → native SMS fallback:
        │       "[Name] is having a difficult moment. Please contact them."
        ├── Contact responses appear on screen as soft notification
        └── After completing breathing → final options:
            ├── [Button: "I feel better"] → S09 Home
            ├── [Button: "I need more help"] → direct contact options
            └── [Button: "Record how it went"] → mini post-crisis check-in → S09 Home
```

**Critical UI rules in S17 and S18:**
- Background: neutral color (`color-crisis-bg`, see FRONTEND_GUIDELINES.md)
- Animations: MINIMAL or none (except the breathing circle)
- Text: maximum 5 words per instruction at level 3
- Exit button always visible: "← Exit protocol"
- No bottom navigation visible

---

### FLOW 5: Settings and Profile

**Trigger:** User taps ⚙️ in bottom navigation

```
S09 Home → [Tab: Settings] → S21 Settings
├── Section: Profile
│   ├── Name, photo, age
│   └── Edit personal questionnaire
├── Section: Complete my profile
│   ├── Pending tests with visual status: ⏳ Full AQ / ✅ CAT-Q / ⏳ RAADS-R
│   └── [Tap on pending test] → corresponding test screen (S04 / S05 / S06)
├── Section: Appearance
│   ├── Mode: Light / Dark / System
│   ├── Color palette (5 pastel options)
│   └── Animations: Enabled / Reduced / Disabled
├── Section: Trusted People → S22 Contacts Management
│   ├── List of configured contacts
│   ├── [Button: "+ Add contact"]
│   ├── Per contact: name + relationship + channel (push/SMS) + what they can see
│   └── Option: delete / temporarily disable
├── Section: Notifications
│   ├── Daily reminder: on/off + preferred time
│   └── Contact notifications: on/off
└── Section: Data and Privacy
    ├── What is shared with therapist (granular selection)
    ├── Export my data
    └── Delete account
```

---

### FLOW 6: Therapist View (Week 4+)

**Trigger:** User with `therapist` role enters the app

```
S24 Auth (therapist role) → S23 Therapist Dashboard
├── List of linked patients
└── [Tap on patient] → Patient View
    ├── Summary: last 7 days of check-ins
    ├── Detected patterns (AI)
    ├── Patient's active scripts
    │   ├── [Button: "Suggest script"] → create/edit script for this patient
    │   └── [Button: "Approve patient's script"]
    ├── Interpretations flagged with 🚩
    └── [Button: "Generate report"] → PDF/summary sent to predefined medium
```

---

## Persistent Navigation (Bottom Navigation)

Available on **all screens except** onboarding (S01–S08), rescue protocol (S17, S18), and auth (S24).

| Tab | Icon | Destination |
|---|---|---|
| Home | 🏠 | S09 Home |
| Check-in | ✋ | S10 Body Map |
| Scripts | 📋 | S14 Library |
| History | 📊 | S19 History |
| Settings | ⚙️ | S21 Settings |

**Rescue Button (FAB):** Always visible on all main app screens (S09–S22). Position: bottom-right, above the bottom nav. Color: `color-crisis-soft` (soft, never alarm red). Navigates to S17.

---

## Global Navigation Rules

1. The rescue button (→ S17) is accessible in **at most 1 tap** from any screen in the app
2. No screen requires horizontal scrolling
3. Every destructive action (delete, disconnect therapist) requires 2-step confirmation
4. The "← Back" button always available except on S09 Home and S01 Welcome
5. In crisis protocol (S17, S18): only "continue protocol" or "exit protocol" exist
6. Onboarding: AQ-10 mandatory; Full AQ, CAT-Q, RAADS-R optional
7. Skipped optional tests remain accessible in S21 → "Complete my profile"
