# STATUS.md — Project Status
## Script — Digital Companion for Adults with ASD Level 1

> **How to read this file:**
> ✅ Complete | 🔄 In progress | ⏳ Pending | ❌ Blocked

**Last updated:** 2026-03-11 (Ana: T-V5 ✅ · T-U7 ✅ · 2.4 ✅ · 2.8 ✅ · 2.10 ✅ · 2.12 ✅ · B-DM ✅ · B-DS ✅ · fonts ✅ | Aibus: B-64/B-65/B-66/B-69/B-71/B-72 ✅ · SETUP.md ✅ · **ACTION: redeploy sync-privy-user + interpret-checkin --no-verify-jwt · run migration add_checkin_session_id.sql**)
**Current week:** 2  
**Next delivery:** S21 Settings (theme/motion/font) + D-01 Home data wire-up (Ana) · New computer setup

---

## 👥 Team

| Role | Who | Responsibilities |
|---|---|---|
| Product Owner / Executor | w4rw1ck | Runs commands, tests on device, validates product, learns |
| Tech Lead / PMO | Aibus Dumbleclaw | Generates code Phases 1.1-1.3, 1.8 · Tracks progress |
| Architecture / Core Features | Ana Banana 🍌 | Generates code Phases 1.4-1.7 · Reviews PRs · Stores canonical docs |

**Workflow:**
```
Agent generates and pushes code → w4rw1ck reviews on GitHub / tests in Expo Go
Something fails → both attack the bug → w4rw1ck confirms fix
```

---

## 🚧 Blockers — Resolve BEFORE coding

| # | Pending | Who | Blocks | Status |
|---|---|---|---|---|
| 1 | Create new project in Supabase | w4rw1ck | Phase 1.2 | ✅ |
| 2 | Create new App ID in Privy | w4rw1ck | Phase 1.8 | ✅ `host.exp.exponent` + `exp` URL scheme configured — email auth working |
| 3 | Sensory-safe UI references (3-5 options) | Ana + Aibus | Phase 1.3 | ✅ |
| 4 | Validate/adjust ASD color palette | Ana + Aibus | Phase 1.3 | ✅ |
| 5 | Spanish translations: AQ Full (50q) + CAT-Q (25q) + RAADS-R (80q) | Ana + Aibus | Phase 1.8 | ✅ Questions hardcoded in Spanish in screen files (Phase 1.8 complete) |
| 6 | Audio: guided voice + ambient tone (for grounding and breathing) | Ana + Aibus | Phase 1.7 | ⏳ |
| 7 | Review/complete content for 5 social scripts | Ana + Aibus | Phase 1.6 | ✅ |
| 8 | ~~Add `SUPABASE_JWT_SECRET` to Edge Functions env vars~~ — **OBSOLETE.** B-51 v2 switched to Supabase Admin API (`auth.admin.createUser` + `auth.admin.generateLink`). No JWT Secret needed. Only `SUPABASE_URL` + `SUPABASE_SERVICE_ROLE_KEY` required (auto-injected). | — | — | ✅ N/A |

---

## 📊 Overall Progress

| Week | Description | Status | Completed |
|---|---|---|---|
| Pre-implementation | Documentation + audit of 6 canonical docs | ✅ | PR #3 ready to merge |
| Week 1 | MVP: Setup + Check-in + Scripts + Rescue + Auth | ✅ | **COMPLETE 2026-03-09** · Email auth end-to-end ✅ · Onboarding persists across restarts ✅ · Home on reopen ✅ · RLS working ✅ · Edge Functions deployed ✅ · Google OAuth URL schemes configured ✅ |
| Week 2 | History + Dictionary + Customization + Visual Identity | 🔄 | **Started 2026-03-09** · Sprint 2.C (Onboarding Redesign) → 2.A (Visual Foundation) → 2.B (Screens) |
| Week 3 | Trust Network + Notifications | ⏳ | — |
| Week 4 | AI + Therapist View | ⏳ | — |
| Week 5 | EAS Attestations + Polish + APK | ⏳ | — |

---

## 📁 Documentation (Pre-implementation)

| Doc | Version | Status | Key changes |
|---|---|---|---|
| `PRD.md` | **v1.5** | ✅ | Onboarding redesigned: S01 two CTAs, ONE test per score, RAADS-R to Settings, S07 mandatory, S08 optional |
| `APP_FLOW.md` | **v1.4** | ✅ | Flow 1 redesigned: S01 two CTAs, ONE test recommendation, RAADS-R Settings-only, S07 mandatory, S08 optional |
| `TECH_STACK.md` | **v1.4** | ✅ | Inter → Atkinson Hyperlegible (T-U3); expo-symbols removed (B-07) |
| `FRONTEND_GUIDELINES.md` | **v1.5** | ✅ | §1.4 8 canonical emotions locked (keys + colors + GPT mapping); §2 Atkinson Bold everywhere; §12 Visual Identity |
| `BACKEND_STRUCTURE.md` | **v1.4** | ✅ | sync-privy-user rewritten (Admin API, otp_token_hash); RAADS-R counts; RLS policies |
| `IMPLEMENTATION_PLAN.md` | **v1.8** | ✅ | Sprint 2.C onboarding flow redesign (T-F1–T-F5) added; Week 2 sprints 2.A/2.B; T-U1 to T-V9 |
| `REFERENCES.md` | v1.0 | ✅ | AQ-10 PMID corrected (22366774→22397989); clinical sources + tests (AQ, CAT-Q, RAADS-R) |

---

## 🗓️ Week 1 — MVP

### Phase 1.1 — Project Setup ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.1.1 | Create Expo 55 project with template | ✅ | |
| 1.1.2 | Clean unnecessary template | ✅ | Bug fix: deleted component imports repaired (Ana) |
| 1.1.3 | Install all dependencies (incl. expo-symbols) | ✅ | |
| 1.1.4 | Configure NativeWind (tailwind.config.js + babel.config.js) | ✅ | |
| 1.1.5 | Configure folder structure | ✅ | |
| **Verification** | `npx expo start` without errors, Expo Go connects | ✅ | Confirmed on physical Android device 2026-02-28 |

### Phase 1.2 — Variable and Supabase Configuration ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.2.1 | Create .env.local with variables | ✅ | |
| 1.2.2 | Create lib/supabase.ts | ✅ | |
| 1.2.3 | Run SQL in Supabase (9 tables) | ✅ | Bug: ERROR 42P17 on GENERATED columns — see bug table |
| 1.2.4 | Enable email auth in Supabase | ✅ | Already enabled by default in new project |
| 1.2.5 | Run RLS policies | ✅ | |
| 1.2.6 | Seed 5 predefined scripts | ✅ | |
| **Verification** | 9 tables visible in Table Editor + 5 scripts in `scripts` table | ✅ | Confirmed in Supabase Dashboard 2026-03-01 |

### Phase 1.3 — Theme System and Base Components ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.3.1 | constants/colors.ts (light + dark tokens) | ✅ | |
| 1.3.2 | constants/typography.ts | ✅ | |
| 1.3.3 | constants/spacing.ts | ✅ | |
| 1.3.4 | hooks/useTheme.ts | ✅ | |
| 1.3.5a | components/ui/Button.tsx | ✅ | |
| 1.3.5b | components/ui/Card.tsx | ✅ | |
| 1.3.5c | components/ui/TextInput.tsx | ✅ | Bugs B-02 and B-03 fixed in audit (Ana) |
| 1.3.5d | components/ui/Chip.tsx | ✅ | |
| 1.3.5e | components/ui/Typography.tsx | ✅ | |
| 1.3.6 | components/ui/SafeScreen.tsx | ✅ | |
| **+Extra** | components/ui/index.ts (barrel export) | ✅ | Added in audit |
| **Verification** | Components rendered in light and dark mode | ✅ | Confirmed — app running on Android device 2026-03-09 |

### Phase 1.4 — Bottom Navigation and Layout ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.4.1 | app/(app)/_layout.tsx with Tab Navigator | ✅ | Ionicons, token colors, height 64px |
| 1.4.2 | 5 tabs with icons (Ionicons) | ✅ | Placeholders with SafeScreen/Typography; (tabs) removed |
| 1.4.3 | Floating Rescue Button (FAB) → /rescue/assess | ✅ | RescueFAB circular 56px, crisis-soft color, bottom:84px |
| 1.4.4 | app/(app)/home.tsx (S09) basic | ✅ | Check-in CTA, quick access, empty state last check-in |
| **Verification** | Navigation between tabs + FAB navigates to /rescue/assess | ✅ | Confirmed on physical Android device 2026-03-02 (post metro.config.js fix) |

### Phase 1.5 — Body Check-in (Core Feature #1) ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.5.1 | components/body-map/BodyMap.tsx (SVG 6 zones) | ✅ | Commit `2b4059a` |
| 1.5.2 | app/(app)/checkin/body.tsx **(S10)** | ✅ | Commit `b19603a` — index.tsx redirects here |
| 1.5.3 | app/(app)/checkin/notes.tsx **(S11)** | ✅ | Commit `1d377a1` |
| 1.5.4 | app/(app)/checkin/reflect.tsx **(S12)** | ✅ | Commit `2c5b198` — mock AI (TODO: replace with real edge fn in 1.5.6) |
| 1.5.5 | app/(app)/checkin/result.tsx **(S13)** | ✅ | Commit `7160977` — INSERT fails silently without auth (expected) |
| 1.5.6 | Supabase Edge Function: interpret-checkin | ✅ | Commit `8657889` — GPT-4o-mini, OPENAI_API_KEY only in Supabase env |
| **Verification** | Full check-in S10→S11→S12→S13, data saved in Supabase | ✅ | Verified on physical Android device (Expo Go) by w4rw1ck — 2026-03-02. Without auth: INSERT fails silently (expected). |

### Phase 1.6 — Social Scripts (Core Feature #2) ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.6.1 | app/(app)/scripts/index.tsx **(S14)** | ✅ | Commit `583cf7d` — Supabase fetch, category chips, tactile cards |
| 1.6.2 | app/(app)/scripts/[id].tsx **(S15)** — Detail | ✅ | Commit `46d88bf` — block preview, execute CTA |
| 1.6.3 | app/(app)/scripts/execute.tsx **(S16)** — Execution | ✅ | Commit `064a6fc` — step by step, progress bar, options, celebration |
| **Verification** | 5 scripts navigable and executable | ⏳ | Pending device test (w4rw1ck) |

### Phase 1.7 — Rescue Button (Core Feature #3) ✅ COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.7.1 | app/(app)/rescue/assess.tsx **(S17)** | ✅ | Commit `3687e29` — §11 complete, 3 levels, critical StyleSheet |
| 1.7.2 | app/(app)/rescue/protocol.tsx **(S18)** — levels 1/2/3 | ✅ | Commit `ecea6f2` — grounding+haptic, Reanimated circle, SAPTEL |
| **Verification** | Full protocol (1, 2, 3) | ✅ | Verified on physical Android device by w4rw1ck — 2026-03-05. Bugs B-11 to B-14 found and fixed. Audio pending (assets/audio/) |

### Phase 1.8 — Basic Auth + Complete Onboarding ✅ CODE COMPLETE
| Step | Description | Status | Notes |
|---|---|---|---|
| 1.8.1 | PrivyProvider in app/_layout.tsx | ✅ | AuthGate integrated |
| 1.8.2 | app/auth.tsx **(S24)** (email + Google) | ✅ | B-15/B-16 fixed |
| 1.8.3 | Edge Function: sync-privy-user | ✅ | CORS included (B-17) |
| 1.8.4 | Post-auth redirect logic | ✅ | AuthGate in _layout.tsx |
| 1.8.5 | app/(onboarding)/index.tsx **(S01 Welcome)** | ✅ | Tagline + "I need help now" → S17 |
| 1.8.6 | app/(onboarding)/aq10.tsx **(S02)** — 10 questions, 1 per screen | ✅ | scoreOnAgree per question |
| 1.8.7 | app/(onboarding)/aq10-result.tsx **(S03)** — Score + decision | ✅ | No "positive/negative" wording |
| 1.8.8 | Reusable TestScreen component | ✅ | Selection by index, pause with SecureStore |
| 1.8.9 | app/(onboarding)/aq-full.tsx **(S04)** — AQ 50 questions | ✅ | scoreOnAgree per question (M-03 learning) |
| 1.8.10 | app/(onboarding)/catq.tsx **(S05)** — 25 questions, scale 1-7 | ✅ | |
| 1.8.11 | app/(onboarding)/raads.tsx **(S06)** — 80 questions, with pause | ✅ | |
| 1.8.12 | lib/profile-seed.ts — synthesizes scores into seed profile | ✅ | Runtime-only, not persisted in Supabase |
| 1.8.13 | app/(onboarding)/profile.tsx **(S07)** — Personal questionnaire | ✅ | Guard for null supabaseUserId (B-19) |
| 1.8.14 | app/(onboarding)/contacts.tsx **(S08)** — Contact setup | ✅ | Uses "relationship" (correct schema) |
| **Verification** | Full flow S01→S02→S03→S07→S08→S24→S09. Email login works. onboarding_complete saves + persists. | ✅ | **Confirmed on device 2026-03-09** · email auth ✅ · onboarding persists ✅ · home on reopen ✅ · RLS working ✅ · Google OAuth: `exp` scheme added to Privy ✅ |

---

## 🔴 Critical Tickets — Before Real Users

> Identified in clinical audit by Aibus Dumbleclaw (2026-03-06, base commit `fdcadd2`).
> These items are NOT optional. They must be resolved before sharing the app with any real user.

| Ticket | Description | Severity | Owner | Status |
|---|---|---|---|---|
| T-C1 | **Suicidal ideation safety screening in S17** — `assess.tsx` must include a screening question ("Are you having thoughts of hurting yourself?") with a differentiated flow. If the answer is yes: show Línea de la Vida directly (México: 800 911-2000, 24h free), bypassing the 3 standard levels. Rationale: Cassidy et al. (2018) — 66% of adults with ASD report suicidal ideation; Hirvikoski et al. (2016) — suicide mortality 9x higher in ASD | 🔴 Critical | Ana | ✅ `88c7b5e` |
| T-C2 | **Safety filter on GPT-4o-mini output** — Edge Function `interpret-checkin/index.ts` must post-process emotion options before sending them to the client. If any label falls into alert categories (hopelessness, emptiness, not wanting to be here, etc.), the response must include `crisis_flag: true` and the app must escalate to rescue flow instead of continuing the normal check-in | 🔴 Critical | Aibus | ✅ `aaaa6a7` |
| T-C3 | **Informed consent screen in onboarding** — New screen before S02 (or as overlay in S01) that explains in plain language: what data is processed, what for, that Script is not a medical device, and that it does not replace professional care. Requirement: LFPDPPP México (Federal Law on Protection of Personal Data). Consent must be explicit (button "I understand and accept") before starting any test | 🔴 Critical | Ana | ✅ `6e300b6` |
| T-U1 | **`useReduceMotion()` in all animation components** — OS `prefers-reduced-motion` is not implemented. Affects `protocol.tsx` (breathing circle), `body.tsx` (body map selection), and any Reanimated animation. For ASD with sensory sensitivity this is not optional. Pattern: `const shouldReduce = useReduceMotion(); if (shouldReduce) → skip animation`. Ref: FRONTEND_GUIDELINES.md §7 | 🔴 Critical | Ana | ✅ `b350f0a` |
| T-U2 | **Visible error feedback when Edge Function fails in `reflect.tsx`** — The silent fallback to mock when GPT-4o-mini doesn't respond does not notify the user. In a clinical context, the user must know if the interpretation is approximate or failed. Add visible text (not just console.warn) when `interpret-checkin` returns error/timeout | 🔴 Critical | Aibus | ✅ `ef16c22` |

---

## 🗓️ Week 2 — History, Dictionary and Customization

| Step | Description | Owner | Status | Notes |
|---|---|---|---|---|
| 2.1 | Settings → "Complete my profile" (S04, S05, S06 from Settings) | Aibus | ✅ | T-F5 — RAADS-R + AQ-Full + CAT-Q accessible from Settings with completion status (✅/⏳) per test. `settings/index.tsx` rebuilt with test status cards |
| 2.2 | app/(app)/history/index.tsx **(S19)** | Ana | ✅ | Full history list + emotion filter chips + pull-to-refresh + empty state — fetches from Supabase |
| 2.3 | app/(app)/dictionary.tsx **(S20)** | Ana | ⏳ | Stretch goal — AI-generated definitions + "for self-reflection, not clinical advice" disclaimer |
| 2.4 | app/(app)/settings/index.tsx **(S21)** — theme + palette | Ana | ✅ | Appearance section: System/Light/Dark theme selector. Persists in AsyncStorage (key: `script:theme`), applied via `Appearance.setColorScheme()` on mount. commit `ffd0ebc` |
| 2.5 | "Unlocked insights" (3, 7, 15 check-ins) | — | ⏳ | Week 3 — deferred |
| 2.6 | **Script progress persistence** (S16) | — | ⏳ | MVP: Zustand in memory (persists while app is not closed). Full persistence (`script_sessions` table) deferred to Week 3 |
| 2.7 | **Persist test scores in Supabase immediately** | Aibus | ✅ | Already implemented — all 4 test screens upsert to `profiles` immediately on completion. `profile-seed.ts` is additive, not the save path |
| 2.8 | **INSERT `crisis_events` in `protocol.tsx`** | Ana | ✅ | Inserts on exit: `protocol_completed=true` on completion, `false` on early exit. Tracks `started_at`, `duration_seconds`, `intensity_level`. Non-blocking. commit `9344fe2` |
| 2.9 | **Reduce GPT temperature 0.7 → 0.4 in `interpret-checkin`** | Aibus | ✅ | B-55 — code `0a0de01` · deployed `2026-03-09` |
| 2.10 | **INSERT `script_executions` in `execute.tsx`** | Ana | ✅ | Inserts when last block is completed in `handleNext`. Fields: `user_id`, `script_id`, `mode='execution'`, `completed=true`. Guest mode silently skipped. commit `9344fe2` |
| 2.11 | **Fix AQ-10 PMID in `REFERENCES.md`** | Ana | ✅ | PMID `22366774` → `22397989` (Allison et al., 2012, Arch Dis Child). Commit `1116147` |
| 2.12 | **UI feedback when profile save fails in `profile.tsx`** | Ana + Aibus | ✅ | Alert.alert for null userId + DB errors. "Reintentar"/"Continuar" options. Warm copy per ASD UX guidelines. commits `ffd0ebc` + `39ade85` |

### 🐛 Week 2 Bug Fixes (2026-03-11)

| ID | Description | Status | Commits |
|---|---|---|---|
| B-DM | EmotionColors dark mode — light-only pastels jarring on dark app. Added `EmotionColorsDark` (8 keys) + `getEmotionColors(key, scheme)` helper. result.tsx + reflect.tsx now use dark-aware palettes | ✅ | `9e2e45e` (Ana) · `baf841d` (Aibus) |
| B-DM2 | history/index.tsx — initial fix wrongly changed `checkin_at` → `created_at`. Schema has `checkin_at` (custom column). Reverted. | ✅ | `ea5a33a` (Ana) |
| B-Focus | History + Home tabs used `useEffect` — fires only on mount. With tab screens staying mounted, new check-ins never appeared. Fixed with `useFocusEffect` on both. | ✅ | `754886f`, `e36844e` (Ana) |
| B-UnmountBlur | Check-in tab kept stale form state (body zones, notes) between sessions. `unmountOnBlur: true` on checkin tab — full stack unmounts when user leaves tab. | ✅ | `0bc9b46` (Ana) · `290c561` (Aibus) |
| B-Font | Button.tsx + Chip.tsx used NativeWind `font-bold`/`font-semibold` — only sets `fontWeight`, not `fontFamily`. Replaced with `StyleSheet` using `fontFamily: 'AtkinsonHyperlegible_700Bold'`. | ✅ | `754886f`, `4985024` (Ana) · `02408a0` (Aibus) |
| B-DS / B-72 | result.tsx double-save race condition — `useState(isSaving)` updates async; rapid double-tap fires two INSERTs before button re-renders as disabled. Added `useRef` synchronous guard (`isSavingRef`). DB-level `session_id UUID UNIQUE` added as final defense. | ✅ | `96e12c9` (Ana) · `bc32f0a`, `c393fe9` (Aibus) · ⏳ migration pending |
| B-66 | sync-privy-user used real email for generateLink — if that email existed under different UUID in auth.users, auth.uid() was wrong → RLS blocked history + inserts silently. Fix: always `${userId}@privy.script.app` as authEmail. | ✅ | `02408a0` (Aibus) · ⏳ redeploy needed |
| B-Ghost | Ghost Button dark mode text — `text-script-text-secondary` (#6B6B6B) illegible on dark bg. Added `dark:text-script-dark-text-secondary`. | ✅ | `b32d965` (Ana) · `7156296` (Aibus) |

---


### 🟡 Onboarding Flow Redesign (Sprint 2.C) — Decision 2026-03-08

> **Decision by w4rw1ck 2026-03-08.** Full rationale in PRD.md v1.5 §3.1, APP_FLOW.md v1.4 Flow 1, IMPLEMENTATION_PLAN.md Sprint 2.C.

| Ticket | Description | Owner | Status |
|---|---|---|---|
| T-F1 | **S01 Welcome — Add "I need help right now" CTA** → navigates to `/(app)/rescue/assess` without auth. Crisis access must never be blocked by auth walls (PRD §6). | **Ana** | ✅ Already implemented in Week 1 code · AuthGate rescue exception confirmed working |
| T-F2 | **S03 AQ-10 Result — Hide score, ONE test recommendation** — Do NOT display numerical score (grade-thinking / validation anxiety risk). Show only warm non-diagnostic message + one recommended test. Score ≥6 → Full AQ; Score <6 → CAT-Q. Remove cascade to S06. Add "Skip for now" → S07. Score stored silently in Supabase. (Decision: w4rw1ck 2026-03-08) | **Ana** | ✅ `feat(onboarding): T-F2` — aq10-result.tsx rewritten; cascade broken in aq-full.tsx and catq.tsx |
| T-F3 | **S07 Profile — Mandatory, trimmed** — Remove skip button. Trim to 4–5 questions (name, 2 sensitivities, 1–2 interests, tools). Update copy to "Tell us about you" framing. | **Ana** | ✅ `feat(onboarding): T-F3` — age field removed; name validated (required); subtitle updated; interests trimmed to 8 |
| T-F4 | **S08 Contacts — Optional with warm copy** — Update skip text to "Skip for now — I'll add contacts later". Add explanation: "A trusted contact can receive a notification if you're in crisis." | **Ana** | ✅ `feat(onboarding): T-F4` — subtitle split into two paragraphs; skip button → "Saltar por ahora — lo agregaré después" |
| T-F5 | **RAADS-R → Settings only** — Remove from onboarding navigation. Add "Complete my profile" entry point in `settings/index.tsx` with test completion status (✅/⏳) for Full AQ, CAT-Q, RAADS-R. | **Ana** | ✅ `feat(settings): T-F5` — Settings rebuilt with test status cards; AuthGate exception added for aq-full/catq/raads; raads.tsx routes to settings if onboardingComplete=true |



## 🎨 UI/UX Tickets + Visual Identity — Week 2

> Sources: `nextlevelbuilder/ui-ux-pro-max-skill` audit + visual identity analysis (Aibus, 2026-03-06). Reviewed and approved by Ana.
> **Cross-ref:** FRONTEND_GUIDELINES.md §7/§1.4/§4/§12, IMPLEMENTATION_PLAN.md sprints 2.A/2.B.
> ℹ️ T-U1/T-U2 are in the **Critical** section above. T-U7/T-U8/T-V9 are in the **Week 3 and 4** sections below.

### 🟡 Week 2 — UX (Sprint 2.B)

| Ticket | Description | Owner | Status |
|---|---|---|---|
| T-U3 | **Atkinson Hyperlegible replaces Inter** — Font designed with empirical accessibility research. Each character is distinguishable. For ASD with possible dyslexia or atypical visual processing. Install `@expo-google-fonts/atkinson-hyperlegible`, update `_layout.tsx` and `constants/typography.ts`. Regular and Bold only (no SemiBold — headings migrate to Bold). Ref: FRONTEND_GUIDELINES.md §2 | **Ana** (took over — Aibus was blocked on npm install) | ✅ package.json + _layout.tsx + typography.ts + Typography.tsx all updated · Inter kept in bundle for backward compat · **w4rw1ck: pull dev + run `npm install`** |
| T-U4 | **Tokens `script-accent` (#10B981) and `script-warning` (#F59E0B) in `tailwind.config.js`** — Missing confirmation/success and soft alert colors. `script-accent` for completed states and positive states. `script-warning` for non-crisis alerts. Ref: FRONTEND_GUIDELINES.md §1.2.1 | **Ana** | ✅ B-52 `0a0de01` |
| T-U5 | **Confirmation before Level 3 notification in `protocol.tsx`** — If there is auto-sending to trust network without user confirmation, it may generate false positives. Add `Alert.alert("Confirm notification?", ...)` before sending. Ref: UX Guideline #35 Confirmation Dialogs | **Ana** | ✅ Alert.alert confirmation dialog added to Level 3 "Notify contact" button · actual send TODO Sprint 2.1 |
| T-U6 | **Contrast audit `text-script-text-secondary` (WCAG AA)** — `#6B6B6B` on `#F8F6F2` ≈ 4.2:1 (slightly below WCAG AA 4.5:1). Verify all critical combinations. If it fails, darken slightly to `#606060`. Ref: FRONTEND_GUIDELINES.md §10 | **Ana** | ✅ Audit passed — actual ratio is **4.94:1** (not 4.2:1, estimate was off). Dark mode 6.09:1. No change needed |

### 🟡 Week 2 — Visual Identity (Sprint 2.A + 2.B)

| Ticket | Description | Owner | Status |
|---|---|---|---|
| T-V1 | **Emotional color system in `constants/colors.ts`** — 8 canonical emotions with `{ bg, dot, text }`. Keys: `calm`, `anxious`, `overwhelmed`, `sad`, `joyful`, `irritable`, `tired`, `unnamed`. Create `constants/colors.ts` with `EmotionColors` and `EmotionKey`. GPT label → EmotionKey mapping. Ref: FRONTEND_GUIDELINES.md §1.4. Locked 2026-03-10. | **Ana** | ✅ `feat(colors): T-V1` — EmotionColors + EmotionKey + VALID_EMOTION_KEYS + toEmotionKey() helper |
| T-V2 | **Double-layer shadows in `tailwind.config.js`** — Add `shadow-card`, `shadow-card-elevated`, `shadow-card-pressed`, `shadow-card-dark`. Update `Card.tsx` to use `shadow-card` by default. Ref: FRONTEND_GUIDELINES.md §4 | **Aibus** | ✅ `900e57e` — shadow tokens + emotion color tokens added to tailwind.config.js |
| T-V3 | **Emotion cards in `reflect.tsx`** — Selected card adopts `EmotionColors[key].bg` as background, `dot` as 1.5px border and 8px accent circle. Press animation scale 0.97→1.0 (100ms). Requires T-V1. Ref: FRONTEND_GUIDELINES.md §12.2 | **Ana** | ✅ EmotionCard component + Spanish→EmotionKey mapping + Animated scale + Card style prop added |
| T-V4 | **`result.tsx` with emotional color background** — The check-in result screen (S13) adopts `EmotionColors[key].bg` as full-screen background. 300ms fade transition from the previous card color. This is the most emotionally significant screen. Requires T-V1. Ref: FRONTEND_GUIDELINES.md §12.2 | **Ana** | ✅ 300ms Animated.View fade + emotion card with dot tint + text in emotion colors + SafeScreen style prop added |
| T-V5 | **Home S09 redesign — inspired by Finch** — Layout: greeting + time of day, "last emotion" card with emotional color, 7-day mini history (emotional dots), "Start check-in" CTA button, quick script tiles. Requires T-V1. Ref: FRONTEND_GUIDELINES.md §0 (table) + §12.2 | **Ana** | ✅ `e36844e` — LIVE DATA: useFocusEffect + Supabase fetch (7 most recent checkins). LastEmotionCard with EmotionColorsDark support. WeekStrip one dot per calendar day. Empty state preserved. |
| T-V6 | **Mono-blue gradient on primary button** — 135° gradient from `#A8C5DA → #8BAEC4`. Visual depth without introducing new hues. Update `Button.tsx` variant="primary". Ref: FRONTEND_GUIDELINES.md §4 | **Aibus** | ✅ `900e57e` — LinearGradient on primary Button · **w4rw1ck: npm install** for expo-linear-gradient ~55.0.8 (added to package.json by Ana) |
| T-V7 | **GPT label normalization in Edge Function `interpret-checkin`** — Ensure model output is always one of the 8 canonical labels (see FRONTEND_GUIDELINES.md §1.4). Post-process with mapping before returning to client. Without this normalization, the emotion color system fails silently | **Aibus** | ✅ `900e57e` — interpret-checkin now returns EmotionKey directly; Edge Function needs redeploy |

---

## 🗓️ Week 3 — Trust Network + Notifications

> See IMPLEMENTATION_PLAN.md §Week 3 for the full feature plan. This table includes: main features, clinical audit technical debt, and UX polish tickets.

| Step | Description | Status | Notes |
|---|---|---|---|
| 3.1 | Full trusted contact management (S22) | ⏳ | CRUD + permissions per contact. See IMPLEMENTATION_PLAN.md §3.1 |
| 3.2 | Full notifications system | ⏳ | Expo Push + local notifications. See IMPLEMENTATION_PLAN.md §3.2 |
| 3.3 | Telegram Bot for trusted persons | ⏳ | See IMPLEMENTATION_PLAN.md §3.3 |
| 3.4 | Bilateral response in crisis | ⏳ | Contact can respond to push notification. See IMPLEMENTATION_PLAN.md §3.4 |
| 3.5 | SMS offline fallback | ⏳ | expo-sms for when there is no connection. See IMPLEMENTATION_PLAN.md §3.5 |
| T-3.1 | **Rate limiting in `interpret-checkin`** | ⏳ | Per `user_id` limit via `rate_limits` in Supabase or Upstash Redis. 10 calls/hour MVP (Aibus) |
| T-3.2 | **AI output logging** | ⏳ | `ai_logs` table: `user_id`, `input_hash` (not raw — privacy), `output`, `timestamp`, `flagged` (Aibus) |
| T-U7 | **Active/pressed state on emotion cards** — immediate visual feedback on press (before selection). UX Guideline #30 | **Ana** | ✅ `ffd0ebc` — `({ pressed })` style function: emotion dot border preview + dot+22 (~13%) bg tint on pressIn; selected+pressed = 0.85 opacity. defaultBg computed from colorScheme (no className) |
| T-U8 | **Focus rings audit on `Card` and `Pressable`** — `focus:ring-2` visible on all interactive elements. UX Guideline #28 | **Aibus** | ⏳ |
| T-V8 | **S19 Calendar Year in Pixels** — 36x36px dots with `EmotionColors[key].dot`. Tap → bottom sheet. Requires T-V1 (already in Week 2) | **Aibus** | ⏳ |

---

## 🗓️ Week 4 — Advanced AI + Therapist View

> See IMPLEMENTATION_PLAN.md §Week 4 for the full feature plan. This table includes: AI improvements, clinical improvements, and deferred tickets from Week 3.

| Step | Description | Status | Notes |
|---|---|---|---|
| 4.1 | Improve `interpret-checkin` with full context | ⏳ | Last 5 check-ins + sensory profile in prompt. See IMPLEMENTATION_PLAN.md §4.1 |
| 4.2 | Pattern detection — Edge Function `analyze-patterns` | ⏳ | Top zones, emotions, trigger times. See IMPLEMENTATION_PLAN.md §4.2 |
| 4.3 | AI-personalized scripts (S15/S16 expanded) | ⏳ | GPT generates adapted script blocks. See IMPLEMENTATION_PLAN.md §4.3 |
| 4.4 | Full Therapist View (S23) | ⏳ | History dashboard + patterns + scripts + report. See IMPLEMENTATION_PLAN.md §4.4 |
| 4.5 | 🚩 Button and clinical supervision | ⏳ | Therapist sees flagged interpretations. See IMPLEMENTATION_PLAN.md §4.5 |
| 4.6 | EAS Consent Attestations — Week 5 prep | ⏳ | See IMPLEMENTATION_PLAN.md §5.1 |
| T-4.1 | **Script fading mechanism** | ⏳ | Script generalization: gradual fade-out. Literature: Gray, Krantz & McClannahan (Ana) |
| T-4.2 | **Validate body zones with Mahler protocol** | ⏳ | 8 interoceptive signals vs 6 current geographic zones. Low impact in MVP; clinical depth in v2 (Ana) |
| T-4.3 | **Clinical supervision of test→profile mapping** | ⏳ | Session with ASD psychologist/psychiatrist before public launch. w4rw1ck coordinates |
| T-V9 | **Body map with contextual emotional colors** — Selected zones adopt the color of the previous check-in emotion. Requires T-V1 + historical data in production | **Ana** | ⏳ |

---

## 🗓️ Week 5 — On-Chain, Polish and APK

> See IMPLEMENTATION_PLAN.md §Week 5 for the full plan. This week is focused on EAS consent attestations, offline sync, accessibility audit, and shipping the APK.

| Step | Description | Status | Notes |
|---|---|---|---|
| 5.1 | **EAS consent attestations** — patient→therapist clinical consent as immutable attestation (Ethereum Attestation Service). No custom smart contract needed. Integrate with therapist view S23. | ⏳ | On-chain decision confirmed 2026-03-06. See decision log. |
| 5.2 | **Complete offline synchronization** — `offline-sync.ts` with pending operations queue + visual sync status indicator | ⏳ | BACKEND_STRUCTURE.md §7 |
| 5.3 | **Accessibility and sensory polish** — `accessibilityLabel` audit on all interactive components, WCAG AA contrast verification (both modes), reduce-motion mode, crisis mode §11 audit | ⏳ | FRONTEND_GUIDELINES.md §10–§11 |
| 5.4 | **Build APK** — `app.json` finalize, `eas.json` configure, `eas build --platform android --profile preview`, install on physical device, full flow test | ⏳ | Requires `android.package` set ✅ (B-56) |
| 5.5 | **Real user testing** — Install APK on device of person with ASD Level 1 diagnosis. 30-min session covering 3 main flows. Document friction points. Iterate on critical items. | ⏳ | w4rw1ck coordinates |

---

## 🐛 Known Bugs

| ID | Description | Severity | Phase | Status |
|---|---|---|---|---|
| B-01 | `ERROR 42P17: generation expression is not immutable` when running schema.sql — `EXTRACT()` on `TIMESTAMPTZ` is not immutable in PostgreSQL, forbidden in `GENERATED ALWAYS AS` columns | 🔴 High | 1.2.3 | ✅ Resolved |
| B-02 | Inter fonts installed but NOT loaded in `_layout.tsx` — `useFonts` only had SpaceMono; Typography constants with `Inter_*Bold/SemiBold/Regular` failed silently | 🟡 Medium | 1.3 | ✅ Resolved |
| B-03 | `text-top` in `TextInput.tsx` is not a valid NativeWind class — `textAlignVertical:'top'` was ignored in multiline inputs | 🟡 Medium | 1.3.5c | ✅ Resolved |
| B-04 | NativeWind was not applying any styles — all `className` were ignored; UI looked like HTML without CSS | 🔴 High | 1.4 | ✅ Resolved |
| B-05 | RescueFAB invisible on physical Android (Expo Go) — visible in devtools/web but not on native device | 🔴 High | 1.4.3 | ✅ Resolved |
| B-06 | "rescue" tab appeared in navigation bar — Expo Router auto-discovers all folders in `(app)/` including `rescue/` | 🟡 Medium | 1.4.1 | ✅ Resolved |
| B-07 | `expo-symbols` uses Apple SF Symbols — only works on iOS/web, on Android Expo Go renders nothing. Real root cause of: invisible icons in tab bar + invisible FAB | 🔴 High | 1.4 | ✅ Resolved |
| B-08 | `Card` had no `variant` or `onPress` — in S12 (reflect.tsx) emotion options were not tappable nor showed "selected" state. Check-in flow blocked | 🔴 High | 1.5 | ✅ Resolved |
| B-09 | result.tsx used `raw_text` and `confirmed_emotion` in the Supabase INSERT, but the real schema has `free_text` and `emotion_confirmed` — check-ins would not have been saved correctly | 🔴 High | 1.5 | ✅ Resolved |
| B-10 | `TextInput` did not accept `numberOfLines` or `accessibilityHint` — `numberOfLines={6}` in notes.tsx was silently ignored; input height was fixed at 120px minimum | 🟡 Medium | 1.5 | ✅ Resolved |
| B-11 | Incorrect SAPTEL number (800 290-0024) — the real verified number at saptel.org.mx is (55) 5259-8121 | 🔴 High | 1.7 | ✅ Resolved |
| B-12 | Crisis screens (assess.tsx + protocol.tsx) unreadable in dark mode — light pink buttons (#E8C4C4) and dark text (#2D2D2D) invisible against dark background | 🔴 High | 1.7 | ✅ Resolved |
| B-13 | Breathing label (Inhale/Pause/Exhale) out of sync with animated circle — `setInterval` accumulated drift vs Reanimated animation on UI thread | 🟡 Medium | 1.7 | ✅ Resolved |
| B-14 | Guided breathing (Level 2) without haptic feedback — Level 1 (grounding) had haptics but Level 2 did not, despite the multimodal design decision | 🟡 Medium | 1.7 | ✅ Resolved |
| B-15 | `auth.tsx` — verification code field without `value`/`onChangeText` — invisible text on physical Android + no explicit verify button | 🔴 High | 1.8 | ✅ Resolved |
| B-16 | `auth.tsx` — `handleVerifyCode` swallowed the error silently; the `catch` lowered loading without showing the user that the code was incorrect | 🔴 High | 1.8 | ✅ Resolved |
| B-17 | `sync-privy-user` Edge Function without CORS headers — preflight OPTIONS fails, responses without `Access-Control-Allow-*` | 🟡 Medium | 1.8 | ✅ Resolved |
| B-18 | `contacts.tsx` — `useRouter` imported and `router` instantiated but never used (AuthGate handles post-onboarding redirection automatically) | 🟢 Low | 1.8 | ✅ Resolved |
| B-19 | `profile.tsx` — guard `if (supabaseUserId)` existed but without log or comment — if sync failed, the save fails silently without context | 🟡 Medium | 1.8 | ✅ Resolved |
| B-20 | `VIABILITY_TEST.md` (311 lines) tracked in git — analysis document unrelated to the project | 🟢 Low | 1.8 | ✅ Resolved |
| B-21 | `Typography.tsx` without variants `headingS` / `heading` — `aq10-result.tsx` and other Phase 1.8 screens use them and failed silently | 🔴 High | 1.8 | ✅ Resolved |
| B-22 | `AuthGate` blocked the rescue protocol without auth — user in crisis redirected to `/auth` when pressing FAB from login screen or onboarding | 🔴 High | 1.8 | ✅ Resolved |
| B-23 | Invalid NativeWind token `script-surface` / `script-dark-surface` — does not exist in `tailwind.config.js`; progress bars in tests and contacts card rendered without background | 🟡 Medium | 1.8 | ✅ Resolved |
| B-24 | `Button` did not accept `className` prop — `className="mt-3"` in `aq10-result.tsx` buttons was silently ignored; no top margin on buttons inside Cards | 🟡 Medium | 1.8 | ✅ Resolved |
| B-25 | `import { Buffer } from "buffer"` failed when bundling — Metro treated `buffer` as a Node stdlib module instead of npm package | 🔴 High | 1.8 | ✅ Resolved |
| B-26 | `ExpoSecureStore.getValueWithKeyAsync is not a function` — `expo-secure-store` doesn't exist on web; Metro bundles for web in parallel when starting with `expo start` | 🔴 High | 1.8 | ✅ Resolved |
| B-27 | `ReferenceError: Property 'crypto' doesn't exist` — Hermes throws ReferenceError (does not return undefined) when accessing non-existent `global.crypto`; `globalThis.crypto` also undefined on w4rw1ck's device | 🔴 High | 1.8 | ✅ Resolved |
| B-28 | `ReferenceError: localStorage is not defined` — Metro SSR renderer runs in Node.js where `localStorage` doesn't exist even though `Platform.OS === "web"` is true | 🟡 Medium | 1.8 | ✅ Resolved |
| B-29 | `Cannot read properties of undefined (reading 'v1')` — `@privy-io/js-sdk-core` has nested `uuid`; its `wrapper.mjs` does `import { v1 } from 'uuid'` and Metro (with "browser" condition) resolves it circularly back to the same `wrapper.mjs` → `undefined` | 🔴 High | 1.8 | ✅ Resolved |
| B-30 | `Native app ID host.exp.exponent has not been set as an allowed app identifier` — Privy requires explicit `clientId` in PrivyProvider when running in Expo Go (host.exp.exponent); without it blocks all auth attempts. ⚠️ Note: original Aibus commit uses ID "B-27" (collision — B-27 was already assigned to crypto polyfill) | 🔴 High | 1.8 | ✅ Resolved |
| B-31 | `Redirect URL scheme is not allowed` (attempt 1) — Aibus added `redirectUrl: Linking.createURL('/auth')` to `sendCode()`. The `exp://` Expo Go scheme was not in Privy's list, causing an error | 🔴 High | 1.8 | ⚠️ Partial — see B-32 |
| B-32 | `Redirect URL scheme is not allowed` (attempt 2, real root) — `sendCode()` does NOT need `redirectUrl` in OTP flow (6-digit code). `redirectUrl` is only required for clickable magic links. Passing `exp://` to Privy in OTP mode caused the error. Fix: remove `redirectUrl` from `sendCode()` | 🔴 High | 1.8 | ✅ Resolved |
| B-33 | Google OAuth doesn't resolve — Google browser opens but never returns to the app. `WebBrowser.maybeCompleteAuthSession()` was missing from `auth.tsx`. Without this module-level call, Expo cannot complete the OAuth callback when Google redirects back | 🔴 High | 1.8 | ✅ Resolved |
| B-34 | `Already logged in, if trying to link an OAuth account use useLinkWithOAuth` — `AuthGate` used `useAuthStore().user` (Zustand, in memory) as the source of truth for auth. Zustand resets on every app restart, but Privy persists the session in SecureStore. Result: already authenticated user keeps seeing `/auth` on every cold start | 🔴 High | 1.8 | ✅ Resolved |
| B-35 | `AuthScreen` did not detect existing Privy session on mount — already logged-in user (session in SecureStore) saw login screen and couldn't log in again ("already logged in"). Safety net: `useEffect` in `auth.tsx` that calls `handlePostLogin(privyUser)` if Privy already has a session when the screen opens | 🔴 High | 1.8 | ⚠️ Insufficient — see B-36 |
| B-36 | Login form kept rendering even though Privy had an active session — `useLoginWithEmail`/`useLoginWithOAuth` hooks failed with "already logged in" when user pressed buttons. Fix: (1) early return in `auth.tsx` shows loading spinner if `!privyReady \|\| privyUser` — form never renders with active session; (2) `handlePostLogin` now explicitly navigates via `router.replace` when sync finishes, without relying on `AuthGate` | 🔴 High | 1.8 | ⚠️ Partial — see B-37 |
| B-37 | "Loading your session..." spinner hanging indefinitely — two competing `useEffect`s: Aibus navigated, but mine (B-35) called `handlePostLogin` which did `await supabase.functions.invoke("sync-privy-user")`. If the Edge Function was not deployed or there was a network timeout, the `await` never resolved and navigation stayed blocked. Fix: consolidate into a single effect that (1) sets `storeUser`, (2) navigates IMMEDIATELY without await, (3) sync in background fire-and-forget. Also adds 5s timeout to `handlePostLogin` via `Promise.race` for the OTP/OAuth case | 🔴 High | 1.8 | ✅ Resolved |
| B-38 | `expo-symbols ~55.0.4` in `package.json` — B-07 prohibits its use (SF Symbols, iOS/web only, fails on Android). No .tsx imports it, but it takes up bundle space. Pending fix: `npm uninstall expo-symbols` (requires w4rw1ck's computer) | 🟡 Medium | 1.1 | ⏳ Pending |
| B-39 | `Button` hardcoded `accessibilityLabel={title}` ignoring any custom label passed as prop — TypeScript interface did not accept `accessibilityLabel`. Screen readers always read the short `title` even when an extended description was passed (detected in `consent.tsx`). Fix: `accessibilityLabel?: string` added to `ButtonProps`; component uses `accessibilityLabel ?? title`. Commit: `a4204fc` | 🟡 Medium | audit | ✅ Resolved |
| B-40 | `result.tsx` silently navigated to home even if the INSERT into `checkins` failed (due to null `supabaseUserId` or RLS error). User believed they had saved their check-in when they had not. Fix: explicit guard before INSERT; two Alerts with retry + continue without saving options for null error and network error respectively. Commit: `1583d3b` | 🔴 High | audit | ✅ Resolved |
| B-41 | `profile.tsx` used `.update()` instead of `.upsert()` — if the row in `profiles` didn't exist (sync-privy-user failed), `.update()` did 0 rows affected silently. User completed the questionnaire and lost all their data without knowing. Fix: `.upsert({ user_id, ...data }, { onConflict: "user_id" })`. Commit: `87a4eab` | 🔴 High | audit | ✅ Resolved |
| B-42 | **ROOT CAUSE auth loop** — `sync-privy-user` did `.eq("privy_id", ...)` but the schema column is `privy_user_id`. Every call failed with "column privy_id does not exist" → users were never created in Supabase → `supabaseUserId` always null → auth cycle. Fix: `privy_id` → `privy_user_id` in SELECT and INSERT. Commit: `3e27be5` | 🔴 Critical | sync | ✅ Resolved |
| B-43 | `sync-privy-user` read and wrote `onboarding_complete` in the `users` table — but the field only exists in `profiles` (schema.sql line 39). SELECT always returned null, INSERT failed silently. Fix: read `onboarding_complete` from `profiles` via separate query. Commit: `3e27be5` | 🔴 Critical | sync | ✅ Resolved |
| B-44 | `contacts.tsx` updated `users.onboarding_complete = true` — non-existent column in `users`. Onboarding was never marked as complete in Supabase → AuthGate always sent user to onboarding on restarts. Fix: update `profiles.onboarding_complete`. Commit: `ae5f45b` | 🔴 Critical | onboarding | ✅ Resolved |
| B-45 | `sync-privy-user` did `.update({ last_login: ... })` in `users` — `last_login` column does not exist in schema. Causes silent error on every existing user login. Fix: `last_login` removed, replaced by `updated_at`. Commit: `3e27be5` | 🟡 Medium | sync | ✅ Resolved |
| B-46 | `profile.tsx` sent `display_name` to `profiles` table — but `display_name` only exists in `users`. Fix: `display_name` is updated in `users` separately with `.update()`. Commit: `142104d` | 🟡 Medium | onboarding | ✅ Resolved |
| B-47 | `profile.tsx` sent `age` field to `profiles` — column does not exist in any schema table. Fix: field removed from upsert (UI form remains but data won't be saved until added to schema). Commit: `142104d` | 🟡 Medium | onboarding | ✅ Resolved |
| B-48 | `profile.tsx` sent `sensitivities: string[]` to `profiles.sensitivities JSONB` — schema designed as object `{}`, not array. Fix: `Object.fromEntries(selectedSensitivities.map(k => [k, true]))` converts to `{ light: true, sound: true }`. Commit: `142104d` | 🟡 Medium | onboarding | ✅ Resolved |
| B-49 | `aq10.tsx` calculated the score and passed it ONLY as a query param to `aq10-result.tsx`. When navigating away from the result, the score was lost forever. Fix: `upsert` to `profiles.aq10_score` + `aq10_completed_at` before navigating. Commit: `46e39e0` | 🟡 Medium | onboarding | ✅ Resolved |
| B-50 | `aq-full.tsx`, `catq.tsx`, `raads.tsx` used `.update()` to save scores in `profiles` — if the row didn't exist (sync-privy-user failed), 0 rows affected and scores silently lost. Fix: `.upsert({ user_id, score, completed_at }, { onConflict: "user_id" })` in all 3 files. Commit: `89cd56f` | 🟡 Medium | onboarding | ✅ Resolved |
| B-51 | **Privy auth + Supabase RLS incompatible — `auth.uid()` = null.** Resolved via B-51 v2: Admin API `auth.admin.createUser` + `auth.admin.generateLink`. Returns `otp_token_hash`; client calls `verifyOtp`. See decision log for full history. | 🔴 Critical | architecture | ✅ Resolved (v2) |
| B-52 | `tailwind.config.js` missing `script-accent` (#10B981) and `script-warning` (#F59E0B) tokens — FRONTEND_GUIDELINES §1.4 referenced them but classes were unknown to Tailwind | 🟡 Medium | styles | ✅ `0a0de01` |
| B-53 | `constants/colors.ts` missing `accent` and `warning` entries in light + dark Color objects — components using `Colors.accent` crashed at runtime | 🟡 Medium | styles | ✅ `0a0de01` |
| B-54 | `contacts.tsx` `removeContact()` only removed from local state — did not delete from Supabase `trusted_contacts` table. Re-opening app restored deleted contacts. | 🟡 Medium | data | ✅ `0a0de01` |
| B-55 | `interpret-checkin` Edge Function had `temperature: 0.7` — too creative for clinical emotion labeling. Fix: `0.4` for consistent, grounded outputs. Deploy pending. | 🟡 Medium | AI | ✅ Code `0a0de01` · ⏳ Redeploy needed |
| B-56 | `app.json` missing `android.package` and `ios.bundleIdentifier` — EAS Build would fail; Play Store upload would be rejected | 🔴 High | build | ✅ `0a0de01` |
| B-57 | `app.json` splash `backgroundColor: "#ffffff"` — white flash on warm-background app caused visual jarring on launch | 🟡 Medium | UX | ✅ `0a0de01` |
| B-58 | `protocol.tsx` always navigated to `/(app)/home` after rescue completion — but if rescue was triggered from S01 welcome screen (pre-onboarding), user had no home to go to; AuthGate would redirect them back to onboarding in a confusing flash. Fix: check `onboardingComplete` in auth store → redirect to `/(onboarding)` if false, `/(app)/home` if true. | 🟡 Medium | navigation | ✅ `HEAD` |
| B-59 | `contacts.tsx` "Done" and "Skip" buttons appeared to do nothing. Root cause: `useRouter` removed (M-03) — navigation relied entirely on AuthGate. AuthGate's nav effect has `if (!navReady) return` guard. In dev bypass mode, `privyReady` never becomes `true` → `navReady` stays `false` forever → buttons freeze. Fix: re-add `useRouter`; call `router.replace("/(app)/home")` explicitly after `setOnboardingComplete(true)`. | 🔴 High | navigation | ✅ `HEAD` |
| B-60 | `lib/supabase.ts` `setSupabaseToken()` called `verifyOtp` with `type: "email"` — but the token was generated by `auth.admin.generateLink({ type: 'magiclink' })`. Type must match the generator. Result: silent session failure, Supabase session never established, `auth.uid()` always null, RLS broken for all users. No visible error shown. Fix: `type: "magiclink"`. Commit: `d1fe697` | 🔴 Critical | auth | ✅ `d1fe697` |
| B-61 | `protocol.tsx` crashed on load — `useReduceMotion` from `react-native-reanimated` is exported but `undefined` at runtime in Reanimated v4.x (breaking API change from v3). Fix: removed from Reanimated imports; replaced with a local hook using `AccessibilityInfo.isReduceMotionEnabled` (React Native built-in). Same behavior — respects OS `prefers-reduced-motion` (T-U1). | 🔴 Critical | rescue | ✅ `8d42e31` |
| B-62 | **onboarding→home flash on restart** — `onboardingComplete` lived only in Zustand (in-memory, resets on restart). AuthGate briefly saw `false` before Supabase sync returned `true` → flash of onboarding screen. Fix: persist `onboardingComplete` in SecureStore (key `script_onboarding_complete`); `loadPersistedState()` called before `navReady` is set — `navReady` now waits for BOTH `privyReady` AND `storeLoaded`. Commits: `706bd15` + `3ef64bb` | 🟡 Medium | UX | ✅ `3ef64bb` |
| B-63 | **Edge Functions returning 401** — `EXPO_PUBLIC_SUPABASE_ANON_KEY` uses new Supabase Publishable key format (`sb_...`) which is NOT a JWT. By default, Supabase Edge Functions verify JWT on each request. The new key fails verification → non-2xx response. Fix: deploy all Edge Functions with `--no-verify-jwt`. Affects: `sync-privy-user`, `interpret-checkin`. | 🔴 Critical | infra | ✅ deployed 2026-03-09 |
| B-64 | **Dark mode emotion colors** — `EmotionColors` in `constants/colors.ts` had light-mode hex values only. In dark mode, `result.tsx` and `reflect.tsx` showed jarring bright backgrounds (e.g. `#E8E8E8` for `unnamed` on `#1C1C22` bg). Fix: added `EmotionColorsDark` parallel palette (same hue, dark-surface compatible) + `getEmotionColors(key, isDark)` helper. Consumers updated: `result.tsx`, `reflect.tsx`, `history/index.tsx`. `EmotionColors` alone is now DEPRECATED for screen use. Commit `140fcf4` (Aibus, 2026-03-11) | 🔴 High | colors | ✅ Resolved |
| B-65 | **Button text rendering system font instead of Atkinson** — NativeWind's `font-bold` class sets `fontWeight: 700` but does NOT set `fontFamily`. `Button.tsx` was displaying system font even after T-U3 Atkinson migration. Fix: added explicit `style={{ fontFamily: "AtkinsonHyperlegible_700Bold" }}` to the Text inside Button. All NativeWind font-weight classes have the same limitation — always use style prop for custom font families in React Native. Commit `0da0f49` (Aibus, 2026-03-11) | 🟡 Medium | fonts | ✅ Resolved |
| B-66 | **RLS UUID mismatch — history empty, inserts blocked** — `sync-privy-user` used the user's real email for `auth.admin.generateLink`. If that email already existed in `auth.users` under a different UUID (from previous test sessions), `verifyOtp` established a session where `auth.uid()` ≠ `public.users.id`. Result: RLS blocked both SELECT (history showed empty) and INSERT. Fix: always use `${userId}@privy.script.app` as `authEmail` — never the real email. Fake email is guaranteed unique per user UUID. Requires redeploy with `--no-verify-jwt`. Commit `0da0f49` (Aibus, 2026-03-11) | 🔴 Critical | auth/RLS | ✅ Code fixed · ⏳ Redeploy needed |
| B-67 | **interpret-checkin returning non-2xx** — Edge Function deployed without `--no-verify-jwt` after T-V7 changes. Publishable key `sb_...` is not a JWT → default JWT verification fails → 401. `reflect.tsx` falls back to mock silently. Requires redeploy. | 🟡 Medium | infra | ⏳ Redeploy needed |
| B-68 | **History showing "column checkins.created_at does not exist"** — Diagnosed as stale Expo Go bundle. Column is confirmed `checkin_at` in Supabase. Old bundle (from before Ana's S19 implementation) still referencing `created_at`. Fix: full Expo Go restart + QR rescan with `--clear` flag. | 🟢 Low | bundling | ✅ Diagnosed (clears on fresh restart) |
| B-69 | **Ghost button text unreadable in dark mode** — `ghost` variant in `Button.tsx` used `text-script-text-secondary` (`#6B6B6B`) without a dark override. On `#1C1C22` background: contrast ratio ~3:1, fails WCAG AA. Visible as near-black "Continuar sin describir" text. Fix: `dark:text-script-dark-text-secondary` (`#9A9AA5`) added to ghost variant. Contrast ratio dark mode: ~6:1 ✅. Commit `0791914` (Aibus, 2026-03-11) | 🔴 High | accessibility | ✅ Resolved |
| B-70 | **Duplicate check-in save (initial attempt)** — `hasSaved` useState guard didn't prevent double-save because React state is async (batched). Between press and `disabled={true}` re-render, a second press could get through. Superseded by B-71/B-72. Commit `0791914` (Aibus, 2026-03-11) | — | — | ✅ Superseded by B-71/B-72 |
| B-71 | **Check-in stack duplicate saves — navigation root cause** — After saving in `result.tsx`, `router.replace("/(app)/home")` switched to home tab but left the check-in stack intact (`body → notes → reflect`). When user tapped Check-in tab, Expo Router restored the tab to its last position (`reflect.tsx`) with old URL params → re-ran Edge Function → pushed to `result.tsx` again → second "Guardar" → duplicate INSERT. v1: push→replace in steps (didn't help). v2: StackActions.replace("body") silently failed (internal route name mismatch). v3 (FINAL): `unmountOnBlur: true` on the check-in tab in `_layout.tsx` — unmounts entire stack when leaving, fresh `body.tsx` on every return. All steps also changed from `router.push` to `router.replace`. Commit `3c0c570` (Aibus, 2026-03-11) | 🔴 High | navigation | ✅ Resolved |
| B-72 | **Duplicate check-in save — race condition root cause** — Even with navigation fixed, two concurrent presses (double-tap, pressing both buttons before `disabled={true}` re-renders) could start two async INSERT operations because `useState` guards are asynchronous. Fix A: `useRef saveLock` — synchronous lock acquired before any async work; second call sees `true` immediately, before any render cycle. Fix B (FINAL, bulletproof): `session_id UUID` column added to `checkins` table with `UNIQUE` constraint + `expo-crypto` UUID generated in `body.tsx` and passed through all screens to `result.tsx` INSERT. Any duplicate INSERT is rejected at database level regardless of JS behavior. Requires running migration `supabase/migrations/add_checkin_session_id.sql` in Supabase SQL Editor. Commits: `b29be83` (saveLock) + `d6b74aa` (session_id) (Aibus, 2026-03-11) | 🔴 Critical | data integrity | ✅ Code fixed · ⏳ Migration needed |
---

## 🔒 Technical Decisions Made

| Date | Decision | Reason |
|---|---|---|
| 2026-02-26 | Expo SDK 55 as base | Current stable version |
| 2026-02-26 | expo-audio instead of expo-av | expo-av deprecated in Expo 55 |
| 2026-02-26 | Zod 4.x | Current version, API compatible with hookform resolvers 5.x |
| 2026-02-26 | openai SDK v6 | Current version with stable API |
| 2026-02-26 | On-chain: only if it involves trustless value transfer or permanent commitment | Architectural principle — avoid unnecessary on-chain that adds friction without real benefit |
| 2026-02-26 | Native SMS as offline fallback in crisis | Works without internet or contact's app |
| 2026-02-26 | Screen IDs S01–S24 (re-numbered) | Expanded onboarding with optional tests AQ/CAT-Q/RAADS-R |
| 2026-02-26 | Settings entry for tests in Week 2 (not 1) | settings/index.tsx is built in Phase 2.4 |
| 2026-02-27 | Level 1 grounding = multimodal (visual + voice + haptic) | Same philosophy as levels 2-3; no channel is indispensable |
| 2026-02-27 | Auto-advance timer in Grounding = 10s (canonical) | APP_FLOW.md is the source of truth; IMPLEMENTATION_PLAN corrected from 12s |
| 2026-02-27 | w4rw1ck = executor and learner | Wants to learn, not just execute — everything is explained |
| 2026-02-27 | Grounding audio: guided voice + ambient tone | Confirmed by w4rw1ck in planning session |
| 2026-02-27 | npm (not bun) as package manager | EAS Build requires npm/yarn; bun is experimental in Expo |
| 2026-03-01 | Do not use GENERATED columns with TIMESTAMPTZ in PostgreSQL | EXTRACT() on TIMESTAMPTZ is not immutable; use queries instead |
| 2026-03-01 | `hour_of_day` and `day_of_week` removed from `checkins` table | Calculable with EXTRACT in queries; no need to persist them (B-01) |
| 2026-03-02 | `metro.config.js` with `withNativeWind` is required for NativeWind v4 | Without it, CSS processing doesn't happen and all classNames are ignored (B-04) |
| 2026-03-02 | No agent starts a phase without explicit instruction from w4rw1ck | Sprint order and control in PO's hands |
| 2026-03-02 | Global FABs must render in the root `_layout.tsx`, outside any navigator | `zIndex` alone is not sufficient on native Android — Tab Navigator creates its own UI layer that covers child elements (B-05 v2) |
| 2026-03-02 | **NEVER use `expo-symbols` in Script** — always `Ionicons` from `@expo/vector-icons` | SF Symbols is exclusive to Apple (iOS/macOS). On Android Expo Go it renders nothing (B-07) |
| 2026-03-02 | FAB overlay: `StyleSheet.absoluteFillObject` + `pointerEvents="box-none"` + flexbox | `position:absolute` with `bottom/right` does not work correctly on Android inside flex containers (B-07) |
| 2026-03-02 | FAB circle: use `View` wrapper, NOT `Pressable` for `borderRadius+backgroundColor` | On Android, `Pressable` does not render `borderRadius+backgroundColor` correctly — separate visual (`View`) from interaction (`Pressable`) (B-07) |
| 2026-03-02 | Hidden routes require `Tabs.Screen href:null` in Expo Router | Expo Router auto-discovers all folders — rescue/ must be explicitly hidden (B-06) |
| 2026-03-02 | `Card` with `onPress`: direct Pressable with `opacity:0.85` on press | `TouchableOpacity` is not used (deprecated). Pressable allows `style` as function with `pressed` state |
| 2026-03-02 | `Card` "elevated" variant: `script-blue` border as visual selection indicator | Only the colored border is sufficient — maintains the app's calm tone |
| 2026-03-05 | SAPTEL: (55) 5259-8121 (verified at saptel.org.mx) | The number 800-290-0024 was incorrect — in a crisis app this is critical |
| 2026-03-05 | Crisis screens: dynamic colors with `useColorScheme()`, layout in StyleSheet | Sizes are critical (§11) and must not vary, but colors must adapt to dark mode to be readable |
| 2026-03-05 | Phase tracking in breathing: `Date.now()` instead of `elapsed += interval` | `setInterval` on JS thread is not precise; accumulated drift desyncs with Reanimated animations (native UI thread) |
| 2026-03-05 | Haptics in breathing: Light on transitions + Success on completion | Consistent with multimodal design decision; only vibrates on phase changes (no spam) |
| 2026-03-06 | Controlled input fields (value+onChangeText) required in auth flows | `onSubmitEditing` without local state does not work reliably on physical Android — always use controlled inputs |
| 2026-03-06 | CORS headers on all Supabase Edge Functions | Good practice even if RN is not a browser; facilitates web testing and avoids preflight errors |
| 2026-03-06 | AQ-10 uses `.agree` boolean; TestScreen uses `.value` numeric | AQ-10 is binary (yes/no); AQ-Full/CAT-Q/RAADS-R are multi-point scales — different patterns for different purposes |
| 2026-03-06 | `AuthGate` in `_layout.tsx` handles all post-auth redirection | Don't duplicate navigation logic in individual screens — single source of truth |
| 2026-03-06 | EAS consent attestations replaces on-chain access control in Week 5 | `grantAccess()/revokeAccess()` on-chain is mutable and doesn't pass the filter; EAS issues clinical consent as a permanent, irrevocable commitment |
| 2026-03-06 | Premium feature token-gating: pending architecture, post-Week 5 | w4rw1ck has a plan — to be defined when the time comes |
| 2026-03-06 | Progress SBTs discarded | Gamifying mental health milestones with permanent public tokens is ethically problematic for ASD users — fixation, stigma, rigidity |
| 2026-03-06 | Test→seed profile mapping is a clinically-informed design decision, NOT a validated clinical protocol | The rules in `profile-seed.ts` (e.g.: high AQ-10 → more socialization scripts) are reasonable but have no peer-reviewed publication directly backing them. Documented as such in PRD to avoid erroneous medical scrutiny. Clinical supervision recommended before public launch (see T-4.3) |
| 2026-03-06 | Privy's `sendCode()` does NOT receive `redirectUrl` in OTP flow | `redirectUrl` is only needed for clickable magic links (user arrives at app from a link). In OTP flow (6-digit code) the param causes `Redirect URL scheme is not allowed` because Privy validates the scheme against its allowed origins list. Without the param, the email only contains the code and the flow works without extra configuration in Privy dashboard |
| 2026-03-06 | `WebBrowser.maybeCompleteAuthSession()` is required for OAuth in Expo | Must be called at module level in the file that uses `useLoginWithOAuth`. Without this call, the OAuth browser hangs when it receives the provider's redirect (Google). It's the standard Expo pattern for any OAuth flow with `expo-web-browser` |
| 2026-03-06 | `AuthGate` uses `usePrivy().user` as the auth source of truth, NOT `useAuthStore().user` | Zustand is in memory — it resets on every restart. Privy persists the session in SecureStore. The navigation guard must check Privy to prevent already-authenticated users from seeing the login screen on every restart. Zustand is still needed for `onboardingComplete` and profile data |
| 2026-03-06 | Script palette maintained (`script-blue: #A8C5DA`) — lavender palette rejected | For ASD, grayish-blue is clinically more stable than lavender. Lavender is suitable for meditation apps (Calm, Headspace) but not for Script's profile. Only `script-accent` tokens (#10B981 confirmation) and `script-warning` (#F59E0B alert) are added |
| 2026-03-06 | Emotional color system approved — 8 canonical emotions × 3 values | Inspired by Daylio. Each emotion has `{ bg, dot, text }`. Color IS the emotion — primary visual signal. Reduces cognitive load of text-based search (especially relevant in ASD). GPT labels must be normalized to 8 canonical EmotionKeys |
| 2026-03-10 | **8 canonical emotion keys LOCKED** | `calm`, `anxious`, `overwhelmed`, `sad`, `joyful`, `irritable`, `tired`, `unnamed`. Label is `irritable` (not `frustrated`) — sensory-triggered, not intent-based, clinically more accurate for ASD Level 1. `unnamed` = alexithymia catch-all (Kinnaird 2019). Old keys `overwhelm`→`overwhelmed`, `joy`→`joyful`. Full color spec in FRONTEND_GUIDELINES.md §1.4 |
| 2026-03-10 | **Atkinson Bold everywhere** | Atkinson Hyperlegible has no SemiBold (600). Decision: Bold (700) for all headings. No Inter fallback. Cleaner, more accessible for atypical visual processing |
| 2026-03-10 | **S07 Profile is mandatory post-test** | After the second assessment test (or "skip test") the user ALWAYS goes to S07 Profile. Profile has no skip button. Name + 2 sensory sensitivities = required. Interests + tools = optional. Resolves C1 contradiction |
| 2026-03-10 | **Auth position: end of onboarding** | Confirmed. Auth remains at end (after S08 Contacts). Current implementation correct |
| 2026-03-10 | **Guest mode: rescue + scripts only (Week 2)** | Guest = anonymous local user. Can use rescue (local, not saved) + browse scripts (read-only). Cannot check-in, access history, or use dictionary. No data migration on account creation. Vision: expand to full guest mode in future weeks |
| 2026-03-10 | **Dictionary content strategy** | Week 2 scope: definition + how it's expressed only. "How to deal with it" deferred to future sprint. When it ships: AI-generated with disclaimer *"For self-reflection, not clinical advice"* (needs clinical review before public launch) |
| 2026-03-10 | **Friday delivery scope** | Hard target: Sprint 2.C (T-F1–T-F5) + Sprint 2.A (core) + S19 History + S21 Settings. Dictionary (S20) = stretch goal |
| 2026-03-10 | **Guest mode entry point** | Auth screen ONLY — S01 has exactly 2 CTAs ("Start my journey" + "I need help now"). No third "Continue as guest" button on S01. When rescue protocol ends → redirects to S01 (not home) |
| 2026-03-10 | **Sensory profile — 6 canonical types** | sound, light, smell, touch, visual patterns, taste. Multiselect, none required (pick as many as apply). Stored as JSONB {key: boolean}. Expands from original 4 — Aibus observation, w4rw1ck confirmed |
| 2026-03-10 | **History filters — emotion only** | S19 History: emotion filter chip row for Friday. Date range deferred to Week 3 |
| 2026-03-06 | Atkinson Hyperlegible replaces Inter as project font | Designed with empirical accessibility research. Distinct character shapes reduce confusion in users with atypical visual processing. Regular (400) and Bold (700) only — no SemiBold |
| 2026-03-06 | Primary button gradient: mono-blue (#A8C5DA → #8BAEC4), NOT lavender | The blue→lavender gradient from the skill would introduce a hue not present in the palette. Mono-blue gives tactile depth without introducing new colors |
| 2026-03-06 | SVG dot pattern background rejected | `backgroundImage` is not native in React Native without `react-native-svg` as an additional layer. ROI does not justify the dependency. Card shadows + emotional colors provide sufficient depth |
| 2026-03-06 | Neumorphism rejected as base style | WCAG AAA contrast issues. Current "Soft UI" + double-layer shadows is safer and more accessible |
| 2026-03-06 | `react-native-get-random-values` as crypto polyfill in RN/Hermes | Hermes throws ReferenceError when accessing non-existent global.crypto (unlike V8 which returns undefined); this package is the standard for Privy in RN |
| 2026-03-06 | `typeof localStorage !== "undefined"` required in web code | Metro SSR renderer runs in pure Node.js; `Platform.OS === "web"` can be true but localStorage doesn't exist — always check before accessing |
| 2026-03-06 | Packages with circular ESM imports must go in `extraNodeModules` in metro.config.js | With "browser" condition, Metro can create cycles in uuid's `wrapper.mjs` — forcing CJS root resolution breaks them |
| 2026-03-06 | **B-51 Option A (superseded)** — sync-privy-user minted HS256 JWT signed with SUPABASE_JWT_SECRET. Required `SUPABASE_JWT_SECRET` env var (Legacy JWT Secret), not exposed in new Supabase dashboard UI. | Superseded by B-51 v2 below |
| 2026-03-06 | **B-51 v2 (current)** — Switched to Admin API: `auth.admin.createUser()` + `auth.admin.generateLink({ type: 'magiclink' })`. Returns `otp_token_hash` (not `access_token`). Client calls `supabase.auth.verifyOtp({ token_hash, type: 'email' })`. `SUPABASE_SERVICE_ROLE_KEY` auto-injected — no additional secrets needed. `autoRefreshToken: false` (Privy manages lifecycle). Commit: `4aa48b3` | Privy ↔ Supabase session bridge without needing Legacy JWT Secret |

---

## 📝 Sprint Notes

> Ordered most-recent first.

### Week 2

**2026-03-11 — Bug sprint (Aibus) — B-64 through B-72 + Week 2 ticket review**

Computer change mid-sprint. w4rw1ck reported 4 issues from device testing; investigation revealed more. Full session summary:

- **B-64** `EmotionColorsDark` — dark mode emotion backgrounds were jarring (light hex on dark surface). Added dark palette + `getEmotionColors(key, isDark)` helper. Updated `result.tsx`, `reflect.tsx`. Commit `140fcf4`
- **B-65** Button font — NativeWind `font-bold` = `fontWeight:700` only, not `fontFamily`. Added explicit `style={{ fontFamily: "AtkinsonHyperlegible_700Bold" }}` to `Button.tsx`. Commit `0da0f49`
- **B-66** RLS UUID mismatch — `sync-privy-user` used real email for `generateLink`; if email existed under different UUID in `auth.users`, `auth.uid()` was wrong → history empty, inserts blocked. Fix: always use `${userId}@privy.script.app`. Commit `0da0f49`
- **B-67/B-68** Edge Function + stale bundle — interpreted in terminal logs; `interpret-checkin` needs redeploy with `--no-verify-jwt`; `created_at` error = old cached bundle
- **B-69** Ghost button dark mode — `text-script-text-secondary` (`#6B6B6B`) has no dark override → near-invisible text. Added `dark:text-script-dark-text-secondary`. Commit `0791914`
- **B-71** Duplicate saves (navigation) — `router.replace` to home left check-in stack intact; returning to Check-in tab restored `reflect.tsx` with old params. Investigated 3 approaches; final fix: `unmountOnBlur: true` on check-in tab + all steps use `router.replace`. Commits `0791914` → `39c8f40` → `c3ecb3a` → `3c0c570`
- **B-72** Duplicate saves (race condition) — `useState` guards async; second press before re-render bypasses `isSaving`/`hasSaved`. Fix A: `useRef saveLock` (synchronous). Fix B (bulletproof): `session_id UUID` passed from `body.tsx` through all screens → `UNIQUE` constraint on DB rejects duplicate. Commits `b29be83` → `5731cfc` → `d6b74aa`
- **2.12** Profile save alert — null `supabaseUserId` and exceptions now show `Alert.alert` instead of silent `console.warn`. Commit `65f877e`
- **2.1 + 2.7** Confirmed already done — Settings RAADS-R entry ✅ + test score persistence ✅ (existing code)
- **SETUP.md** created — complete new computer setup guide at repo root. Commit `d6b74aa`

**Pending actions for w4rw1ck (new computer):**
1. Follow `SETUP.md` at repo root
2. Run in Supabase SQL Editor: `supabase/migrations/add_checkin_session_id.sql`
3. Deploy: `supabase functions deploy sync-privy-user --project-ref dijyzkxnnyvonpknkbpp --no-verify-jwt`
4. Deploy: `supabase functions deploy interpret-checkin --project-ref dijyzkxnnyvonpknkbpp --no-verify-jwt`
5. Log out → log in fresh (new token from redeployed sync-privy-user)

---

### Week 1

**2026-03-06 — Visual Identity + UX Audit — 14 tickets registered (Ana + Aibus)**
- Sources: `nextlevelbuilder/ui-ux-pro-max-skill` + visual identity analysis (Aibus, 2026-03-06)
- FRONTEND_GUIDELINES.md v1.4 updated with: §1.4 emotional system, §2 Atkinson, §4 shadows/gradient, §7 useReduceMotion, §12 visual identity
- 6 UI/UX tickets (T-U1 to T-U8): 2 critical (useReduceMotion, GPT error feedback)
- 8 Visual Identity tickets (T-V1 to T-V9): foundation (colors.ts, shadows, font), screens (reflect, result, home), infrastructure (label normalization)
- 7 new technical decisions documented (palette, emotions, font, gradient, neumorphism, dot pattern)
- Split: T-U1/T-U2/T-U4/T-U5/T-U6/T-V1/T-V3/T-V4/T-V5 → **Ana** | T-U3/T-V2/T-V6/T-V7/T-V8 → **Aibus**

**2026-03-06 — B-37 — Fix hung spinner + fire-and-forget sync (Ana)**
- "Loading your session..." hanging 5+ minutes — `await supabase.functions.invoke("sync-privy-user")` was blocking navigation
- Cause: B-35 called `handlePostLogin` with await from a `useEffect` → Edge Function not deployed or network timeout → never resolved
- Fix: navigate BEFORE await, sync in background. 5s timeout in `handlePostLogin` for OTP/OAuth
- Commit: `5e5e87a`

**2026-03-06 — B-36 — Definitive auth loop fix (Ana)**
- Persistent problem: auth screen showed even though Privy had session → "already logged in" on all login attempts
- Cause: login form kept rendering with `privyUser !== null`; Privy hooks failed when invoked in authenticated state
- Fix A: early return in `auth.tsx` — if `!privyReady || privyUser`, show spinner and never render the form
- Fix B: `handlePostLogin` navigates explicitly via `router.replace` when finished → doesn't depend on AuthGate firing the redirect
- Commit: `325e400`

**2026-03-06 — B-34 — AuthGate: Privy as source of truth (Ana)**
- `Already logged in` error when attempting Google OAuth — root cause: `AuthGate` used Zustand (in memory) as source of truth, not Privy (persisted in SecureStore)
- On each app restart, Zustand resets → `user` null → AuthGate shows `/auth` → already logged-in user tries to log in again → Privy says "you're already logged in"
- Fix: `AuthGate` now uses `usePrivy().user` to determine if there's a session and waits for `usePrivy().ready` before navigating
- Sync effect: if Privy has session but Zustand is empty, calls `sync-privy-user` on startup to restore full state (including `onboarding_complete`)
- Commit: `d30290d`

**2026-03-06 — B-33 — Google OAuth fix (Ana)**
- Email OTP working ✅ (B-32 verified by w4rw1ck on Android device)
- Google OAuth: browser opened but never returned to app
- Cause: `WebBrowser.maybeCompleteAuthSession()` was missing — required for OAuth in Expo
- Fix: add module-level call in `auth.tsx` + `import expo-web-browser`
- Pending device verification (w4rw1ck)
- Pending action in Privy Dashboard: enable Google as Social Login provider (Authentication tab)
- Commit: `5f4bad5`

**2026-03-06 — B-32 — Privy auth OTP fix (Ana)**
- Error `Redirect URL scheme is not allowed` when attempting email login in Expo Go Android
- Root cause: `sendCode()` received `redirectUrl` with scheme `exp://` which Privy rejects — but that param is NOT needed in OTP flow
- Fix: remove `redirectUrl` + `Linking` import from `auth.tsx`. OTP code arrives in email without redirect URL
- Separate error `Unable to activate keep awake` is harmless in Expo Go dev — comes from `expo-keep-awake` in a dependency, disappears in production build
- Pending: w4rw1ck must create a Client in Privy Dashboard → Clients tab with App Identifier `host.exp.exponent` and add the Client ID to `.env.local` (see B-30)
- Commit: `297ca72`

**2026-03-06 — Full clinical audit by Aibus Dumbleclaw — 12 tickets registered**
- Base: commit `fdcadd2` (dev branch) — Week 1 code complete
- Global score: **6.6/10** — solid for MVP with known users; not sufficient for public launch without resolving critical items
- Strengths: sensory-first approach ✅, tentative AI language ✅, clinically validated tests (AQ/CAT-Q/RAADS-R) ✅, crisis offline-first ✅, RLS on 9 tables ✅
- 3 critical tickets before real users (T-C1/T-C2/T-C3): suicidal ideation, GPT safety filter, informed consent
- 6 high/medium priority Week 2 tickets (T-2.7 to T-2.12): score persistence, crisis_events, GPT temperature, script_executions, PMID, UI feedback
- 3 Week 3-4 tickets (T-3.1, T-3.2, T-4.1, T-4.2, T-4.3): rate limiting, AI logging, script fading, Mahler zones, clinical supervision
- Split: T-C1/T-C3/2.8/2.10/2.11/4.1/4.2 → **Ana** | T-C2/2.7/2.9/2.12/3.1/3.2 → **Aibus**
- New technical decision registered: test→profile mapping = "clinically-informed design" not validated protocol
- Ref: https://gist.github.com/dumbleclaw/8d6db74cc4b64b03dde7ed4623ef4bec

**2026-03-06 — Social scripts content with clinical foundation (blocker #7 ✅)**
- `supabase/seed-scripts.sql` rewritten — 5 scripts with complete blocks, real phrases, clinical context
- Opening→context→action→exit structure based on Gray (1994) Social Stories™ + Baker (2003)
- Multiple options per phase to reduce cognitive load (Gaus, 2011)
- `optional: true` exit — no forced formal closure (Attwood, 2007)
- `REFERENCES.md` created — academic sources for scripts, onboarding tests, and future resources
- Blocker #7 resolved ✅ — active blockers now: #2 (Privy App ID), #5 (translations), #6 (audio)
- Commit: `fdcadd2`

**2026-03-06 — Metro uuid circular import fix (B-29)**
- Android bundled ✅ (crypto fix worked) — new error: uuid wrapper.mjs circular
- `@privy-io/js-sdk-core` nests its own uuid; "browser" condition caused circular import
- Fix: uuid root in metro.config.js extraNodeModules + `npm install uuid`
- w4rw1ck must run `npm install` before `npx expo start`
- Commit: `c29f4c6`

**2026-03-06 — Polyfill fixes: crypto + localStorage (B-27/B-28)**
- Bug B-27 🔴: non-existent `global.crypto` in Hermes throws ReferenceError → installed `react-native-get-random-values ~1.11.0`, imported first in polyfills.ts
- Bug B-28 🟡: `localStorage` undefined in Metro SSR (Node.js) → guards `typeof localStorage !== "undefined"` in supabase.ts
- w4rw1ck must run `npm install` to install the new package
- Commits: `d9e562c` (polyfills) → `f80d5e0` (supabase)

**2026-03-06 — Phase 1.8 audit by Ana — 3 bugs found and resolved (B-22 to B-24)**
- Bug B-22 🔴: AuthGate blocked the rescue protocol without auth — critical in crisis — fix: explicit exception in guard for `rescue/` routes
- Bug B-23 🟡: NativeWind token `script-surface` non-existent in 3 files — test progress bars and contacts card without visible background
- Bug B-24 🟡: `Button` without `className` prop — `className="mt-3"` ignored in `aq10-result.tsx`
- Commits: `05fb4e8` → `38bfacb` → `f733e23`
- Week 1 code: 8/8 phases implemented, 24 bugs documented and resolved
- Pending functional verification on device (blocked by Privy App ID — see blocker #2)

**2026-03-06 — On-chain architecture decisions (Week 5)**
- Principle established: "if it doesn't involve trustless value transfer or permanent commitment, don't put it on-chain"
- On-chain access control discarded: `grantAccess()/revokeAccess()` is mutable; Supabase RLS is sufficient for permissions
- EAS consent attestations approved for Week 5: clinical patient→therapist consent as immutable attestation
- Premium feature token-gating: approved in principle, architecture to be defined post-Week 5 (w4rw1ck has a plan)
- Progress SBTs discarded: ethically problematic in ASD mental health context (fixation, stigma, permanent public record)
- Updated docs: PRD.md, IMPLEMENTATION_PLAN.md, TECH_STACK.md, STATUS.md

**2026-03-06 — Phase 1.8 complete + audit + 7 fixes (B-15 to B-21)**
- Phase 1.8 implemented by sub-agent: Privy Auth + Complete Onboarding S01→S08 (commit `72abbc5`)
- Immediate audit by Aibus found 7 issues (2 high, 3 medium, 2 low)
- Fixed in individual commits: `57d4947` → `fe855c2` → `8372e4e` → `fa66ce1` → `6eaae73` → `e619532` → `6055a7b` → `523e50a`
- Week 1 code: 8/8 phases implemented, 0 open audit issues
- Active blocker: B-13 Privy config (w4rw1ck needs to create App ID at dashboard.privy.io)
- Pending w4rw1ck: create Privy App ID, fill in .env.local, `supabase functions deploy sync-privy-user`

**2026-03-05 — Phase 1.7 device verification + 4 fixes (B-11 to B-14)**
- w4rw1ck tested the rescue protocol on their physical Android
- Bug B-11: incorrect SAPTEL number (800-290-0024) → corrected to (55) 5259-8121 (verified at saptel.org.mx)
- Bug B-12: crisis screens unreadable in dark mode → dynamic colors with `useColorScheme()` in assess.tsx + protocol.tsx
- Bug B-13: breathing label out of sync with animated circle → `Date.now()` instead of `elapsed += 100`
- Bug B-14: guided breathing without haptic feedback → Light impact on phase transitions + Success on completion
- Audio still pending (assets/audio/)
- Commits: `e974d66` → `a2f3d41` → `67bb9d5` → `cf3db00`

**2026-03-02 — Phase 1.7 complete: Rescue Protocol (S17→S18)**
- assess.tsx (S17): strict §11 — crisis background, 72px buttons, ← Exit, 3 levels
- protocol.tsx (S18): Level 1 grounding 5-4-3-2-1 + haptic; Level 2 Reanimated circle (4s/2s/6s × 4 cycles); Level 3 SAPTEL + secondary breathing
- StyleSheet instead of NativeWind on crisis screens (critical values)
- Audio pending: assets/audio/ README created, waiting for MP3 files
- SAPTEL: (55) 5259-8121, 24h, free (Mexico)
- Pending device verification and trusted contacts (Phase 1.8+)

**2026-03-02 — Phase 1.6 complete: Script Library (S14→S15→S16)**
- index.tsx (S14): Supabase predefined scripts fetch, 4 category chips, 5 cards
- [id].tsx (S15): full detail, block type preview, execute CTA
- execute.tsx (S16): step-by-step, dynamic progress bar, selectable options, context block, optional skip, celebration screen
- execute.tsx implemented as static route (not [id]/execute) with id as query param
- Pending device verification (w4rw1ck)

**2026-03-02 — Phase 1.5 complete: Body Check-in (S10→S11→S12→S13)**
- BodyMap.tsx: SVG 6 touch zones, multi-selection, light/dark mode
- body.tsx (S10): BodyMap + chips + CTA disabled without selection
- notes.tsx (S11): free TextInput, read-only chips, KeyboardAvoidingView
- reflect.tsx (S12): loader + 5 emotion options (mock) + custom input
- result.tsx (S13): shows emotion, Supabase INSERT, flagged_for_review
- interpret-checkin: GPT-4o-mini Edge Function with tentative language system prompt
- Pending device verification (w4rw1ck)

**2026-03-02 — Phase 1.4 completed and verified on device**
- 1.4.1–1.4.4 implemented by Aibus + Ana — tabs, FAB, real Home
- Bug B-04 detected: NativeWind without styles due to missing metro.config.js — fix in `30fec72`
- Styles confirmed working on physical Android device (w4rw1ck)
- Bug B-05: FAB invisible on physical Android — fix v1 `b7e9b6e` (zIndex) → fix v2 `6562449` (root layout) → real root cause: B-07
- Bug B-07 (root cause): `expo-symbols` doesn't work on Android — replaced by `Ionicons` (@expo/vector-icons) in 5 commits by Aibus. FAB redesigned with overlay + circular View. Verified on physical Android device ✅
- Bug B-06: "rescue" tab appeared in bar (missing href:null) — fix in `7ccfd0f`
- FRONTEND_GUIDELINES v1.2: inspiration table by screen + Plant→S3 decision
- Rule established: no agent starts a phase without explicit PO instruction

**2026-02-27 — Planning session completed**
- Team formed: w4rw1ck + Ana Banana + Aibus Dumbleclaw
- Branch `dev` created ✅
- Branches `feat/fase-1-4` to `feat/fase-1-7` created ✅ (Ana)
- godin-001 accepted invitation as collaborator ✅
- 7 blockers identified before starting (see table above)
- Node.js v22 compatible with Expo 55 ✅
- Test device: physical Android + friend with diagnosed Level 1 ASD

---

## 🔄 How to Update This File

- When completing a step: change ⏳ → ✅ and add note if applicable
- When finding a bug: add to Known Bugs table
- When making a technical decision: add to Decisions table
- Commit format when updating: `status: phase X.X completed`
