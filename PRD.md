# PRD.md — Product Requirements Document
## Script — Digital Companion for Adults with ASD Level 1

**Version:** 1.5  
**Last updated:** 2026-03-08  
**Changes v1.5:** §3.1 Onboarding redesigned — S01 now has two explicit CTAs ("Begin my journey" / "I need help right now"). AQ-10 → ONE additional test based on score (AQ Full if ≥6, CAT-Q if <6); cascade of 3 tests removed. RAADS-R removed from onboarding; accessible only from Settings → "Complete my profile". Personal questionnaire (S07) is now MANDATORY (no skip). Contacts (S08) remain OPTIONAL with warm recommendation. Decision by w4rw1ck 2026-03-08.  
**Changes v1.4:** §3.4 Level 1 (grounding 5-4-3-2-1) updated to multimodal (visual + audio/voice + haptic) — decision confirmed in planning session 2026-02-27.  
**Changes v1.3:** §3.1 Deep Phase — clarified that Settings access is Week 1 (Phase 1.8). §4 Week 2 — screening tests removed (they are Week 1). §4 Week 5 — "fully offline" scoped to avoid confusion with offline-first base of Week 1.  
**Changes v1.2:** RAADS-R domain counts corrected (Appendix E). §3.4 notifications scoped to level 3. §4 Week 2 redundant auth removed. §6 Principle 6 aligned with APP_FLOW.md (1 tap, not 2).  
**Changes v1.1:** AQ-10 questions added in Appendix A, body map SVG guidance added in Appendix B.
**Owner:** W4RW1CK  
**Status:** MVP in development

---

## 1. Product Summary

Script is a mobile application (Android-first, web-compatible) that acts as a digital companion for adults with Autism Spectrum Disorder (ASD) Level 1. It is not a therapist or a diagnostic system. It is a tool for self-knowledge, emotional regulation, and crisis support.

**Core problem:** Adults with ASD Level 1 frequently cannot identify or name what they feel (alexithymia), experience sensory overload without tools to manage it, and navigate social situations without guides adapted to their way of processing the world.

**Solution:** Script offers three pillars:
1. **Know yourself** — body check-ins + personal emotional dictionary
2. **Prepare** — social scripts adapted for challenging situations
3. **Survive the crisis** — multimodal rescue protocol + support network

---

## 2. Users

### Primary User: Adult with ASD Level 1
- **Target age:** 18–25 (design extensible to all ages)
- **Diagnosis:** Preferably formally diagnosed. The app encourages those without a diagnosis to seek one.
- **Gender:** Neutral design. Statistical priority on men, without neglecting women (underdiagnosed).
- **Geography:** Spanish-speaking Latin America. Spanish as the primary language.
- **Context:** Works, studies, or socializes. On the outside "functions." On the inside carries a mask.

### Secondary User: Trusted Person
- Family member, close friend, or partner of the primary user
- Receives crisis alerts and has instructions on how to provide support
- Does not need the app to receive notifications (native push / SMS fallback)
- May have limited access to the app with specific permissions

### Tertiary User: Therapist
- Mental health professional with access authorized by the user
- Views check-in reports, detected patterns, and patient scripts
- Can create and modify scripts for their patient
- Receives automatic reports according to user configuration

---

## 3. Features — MVP (Week 1, delivery Monday)

### 3.1 Onboarding

Onboarding has two phases: **quick** (mandatory, ~3 min) and **deep** (optional, ~15-30 min).

#### Quick Phase — Mandatory
- **Welcome screen (S01):** Two explicit CTAs:
  - **"Begin my journey"** → AQ-10 onboarding flow
  - **"I need help right now"** → S17 Rescue (direct bypass, no auth required)
- **AQ-10 test (S02):** 10 questions, indicative result, not a diagnosis
  - Score ≥6 (internal): pre-configured seed profile + recommends **Full AQ only** (one test)
  - Score <6 (internal): base seed profile + recommends **CAT-Q only** (one test, detects masking)
  - Both: test is optional and skippable; skipped tests available later in Settings
  - **Score is NOT displayed to the user.** Only a warm non-diagnostic message + one test recommendation. Rationale: numerical scores trigger grade-thinking and validation anxiety — both counterproductive for ASD Level 1 users who have spent their lives being evaluated. The score is stored silently in Supabase for therapist view and future analytics. (Decision: w4rw1ck 2026-03-08)
- **Personal questionnaire (S07):** MANDATORY — name, 2 key sensitivities, 1–2 main interests, tools already in use (4–5 questions max, no skip). Core data for app personalization; framed as "Tell us about you" not a form.
- **Trusted contacts setup (S08):** OPTIONAL (clearly recommended, not required). User can skip with warm message "You can always add contacts later from Settings". No penalty for skipping.

#### Deep Phase — Accessible from Settings only
Additional tests to **refine the seed profile**. These are intentionally excluded from onboarding to reduce friction. Available at any time from Settings → "Complete my profile" (S21):
- **Full AQ (50 questions)** — if not done during onboarding
- **CAT-Q (25 questions)** — if not done during onboarding
- **RAADS-R (80 questions)** — Settings only; too long for onboarding

> **Rationale (w4rw1ck, 2026-03-08):** Presenting multiple long tests during onboarding causes drop-off and decision fatigue — especially counterproductive for ASD Level 1 users. One guided test based on AQ-10 score is the optimal balance between personalization and accessibility.

**Test 2: Full AQ (Autism Quotient — 50 questions)**
- Only recommended if AQ-10 score ≥6
- Same format as AQ-10 (Strongly agree → Strongly disagree)
- 5 domains: Social skills, Attention switching, Attention to detail, Communication, Imagination
- Score ≥32/50 → seed profile with greater sensitivity to ASD patterns
- Source: Baron-Cohen et al. (2001). See Appendix C for the 50 questions.

**Test 3: CAT-Q (Camouflaging Autistic Traits Questionnaire — 25 questions)**
- Especially recommended if AQ-10 score <6 (detects autistics who "go unnoticed")
- Measures 3 dimensions: Assimilation, Compensation, Masking
- Scale 1–7 (Strongly disagree → Strongly agree)
- High Masking score → app emphasizes authentic expression tools and reduces social pressure
- Source: Hull et al. (2019). See Appendix D for the 25 questions.

**Test 4: RAADS–R (Ritvo Autism Asperger Diagnostic Scale-Revised — 80 questions)**
- Designed specifically for adults who "escape diagnosis" due to subcritical presentation
- 4 domains: Social relatedness, Language, Circumscribed interests, Sensory motor
- Scale 0–3 per item
- Domain scores feed the user's sensory profile in the app
- Source: Ritvo et al. (2011). See Appendix E for structure and questions.

**Impact of tests on the seed profile:**

| Test | What changes in the app |
|---|---|
| High AQ-10 | Socialization scripts appear first; more emphasis on "head/jaw" zone in check-in |
| High CAT-Q Masking | App reinforces authenticity messages; subtle reminder of "you don't have to perform here" |
| High CAT-Q Compensation | More scripts for "social navigation strategies" |
| High RAADS-R Sensory Motor | Sensory profile pre-populated with auditory/tactile sensitivities |
| High RAADS-R Social Relatedness | Social interaction scripts marked as priority |

**Success criterion:** User completes the quick phase in less than 5 minutes. Deep phase is voluntary and does not block app use.

---

### 3.2 Body Check-in
**Description:** The heart of the product. The user identifies physical sensations as a gateway to emotional awareness.

**Flow:**
1. User opens check-in
2. Sees interactive SVG body silhouette with 6 zones:
   - Head / Eyes / Jaw
   - Throat / Neck
   - Chest / Heart
   - Stomach / Abdomen
   - Hands / Arms
   - Legs / Feet
3. Taps one or more zones → zone(s) light up
4. Free text field: "What do you perceive there?"
5. AI presents 3–5 emotion options: "Could it be something like this?"
6. User confirms, discards, or writes their own word
7. App suggests script or regulation technique based on identified emotion
8. Result saved in history + personal emotional dictionary

**Target duration:** ~5 minutes  
**Frequency:** Daily (incentivized, not mandatory)  
**Offline:** Check-in works offline. Syncs upon reconnection.

**Success criterion:** User identifies or approaches an emotion in 80% of check-ins.

---

### 3.3 Social Scripts
**Description:** Step-by-step guides for navigating challenging social situations.

**Structure of each script:**
```
[Opening] → [Context Recognition] → [Request/Action] → [Optional Exit]
```
Each block has 2–3 language options. The user chooses in the moment, does not memorize.

**5 predefined scripts for MVP:**
1. Interrupting or joining a conversation
2. Asking for something in a public place (restaurant, store, transport)
3. Sensory overload situation in public (asking to leave / for space)
4. First meeting or job interview
5. Conflict or misunderstanding with someone

**Two modes:**
- **Preparation Mode:** Read the script before the event. Review the blocks, mentally rehearse.
- **Execution Mode:** Use the script in real time. Minimal screen, one block visible at a time, advance with tap.

**Custom scripts (week 2+):** User creates their own scripts. AI helps refine them.

**Success criterion:** User can execute a script during a real situation without stopping.

---

### 3.4 Rescue Button (Crisis)
**Description:** One-tap access from any screen. Calming protocol + activation of support network.

**Flow when pressed:**
1. Immediate transition screen: neutral background, reduced contrast, minimal animation
2. Quick assessment (1 question, scale 1–3): "How intense does this feel?"
   - 1 = Uncomfortable / 2 = Difficult / 3 = I can't
3. According to level, initiates protocol:
   - **Level 1:** 5-4-3-2-1 grounding technique with **multimodal guidance (visual + audio + haptic)** — same philosophy as levels 2 and 3; no channel is indispensable
   - **Level 2:** Guided breathing (visual + audio + haptic) — no notification
   - **Level 3:** Guided breathing + automatic notification to trusted network
4. **Multimodal calming sequence:**
   - Visual: circle that expands/contracts to the breathing rhythm
   - Audio: soft tone to the rhythm (enable/disable)
   - Haptic: subtle vibration to the rhythm (if device allows)
5. **Notification to trusted network (level 3 only):**
   - If online: native push notification with location + brief context
   - If offline: pre-formatted native SMS as fallback
   - Messages to all contacts in parallel
6. Options at the end: "I feel better" / "I need more help" / "Call someone"

**In real crisis (level 3):** Minimum instructions of 2–3 words. No long text.

**Success criterion:** User can activate the protocol with one hand, in darkness, under stress.

---

## 4. Features — Post-MVP (Weeks 2–5)

### Week 2
- Check-in history with basic pattern visualization (S19)
- Personal emotional dictionary (vocabulary that grows with use) (S20)
- Customization: light/dark mode, color palette, animations on/off (S21)

> ℹ️ **Note:** The Full AQ (S04), CAT-Q (S05), and RAADS-R (S06) tests are implemented from **Week 1** (Phase 1.8) and are accessible from onboarding and from Settings → "Complete my profile".

### Week 3
- Complete trusted network (add contacts, configure what they see, bilateral communication)
- Configurable notifications (time, frequency, tone)
- "Unlocked Insights" system (after 3, 7, 15 check-ins)
- Telegram Bot for trusted contacts without the app

### Week 4
- AI integration (OpenAI GPT-4o) for pattern detection and recommendations
- Therapist view (automatic reports, access to scripts, annotations)
- Custom scripts with AI assistance
- "🚩 This doesn't feel right" button for clinical supervision

### Week 5
- EAS consent attestations: clinical patient→therapist consent on-chain (immutable, independently verifiable)
- Premium feature token-gating: decide post-Week 5 architecture (w4rw1ck has a plan)
- Advanced intelligent sync (conflict resolution, pending queue, background sync) — core functions are already offline-first from Week 1
- Automatic sensory reduction in crisis (contrast, animations)
- APK build for Android
- Full sensory polish and accessibility

---

## 5. Out of Scope (Explicit)

- ❌ Clinical diagnosis of any kind
- ❌ Replacement for professional therapy
- ❌ Continuous location tracking (only in crisis, with consent)
- ❌ Sale or monetization of user data
- ❌ Punitive gamification (no "you lost your streak")
- ❌ Support for ASD Level 2 or 3 in v1
- ❌ iOS App Store in v1 (Android APK first)
- ❌ AI-generated content without user validation
- ❌ Push notifications without explicit consent

---

## 6. Design Principles (Non-Negotiable)

1. **Sensory-first:** No UI element can be a sensory trigger
2. **Full user control:** The user decides what is saved, what is shared, and with whom
3. **No judgment:** The app never evaluates, corrects, or grades the user's emotions
4. **Exploratory language:** The AI proposes, the user confirms. Never "you feel X"
5. **Offline-ready:** Core functions work without internet
6. **Emergency access:** The rescue button (→ S17) is reachable in **at most 1 tap** from any screen in the app (FAB always visible)

---

## 7. Success Metrics

| Metric | MVP Goal | v1 Goal |
|---|---|---|
| Onboarding completed | >80% of users who open the app | >90% |
| Check-ins per week (active users) | ≥3 | ≥5 |
| Rescue button use (with completed protocol) | 100% complete the protocol | 100% |
| Scripts used in execution mode | At least 1 per user in first week | ≥3 |
| 7-day retention | >40% | >60% |

---

## 8. Dependencies and Risks

| Risk | Probability | Mitigation |
|---|---|---|
| AI makes incorrect emotional interpretation | Medium | User confirmation system + report button |
| Trusted person without app or Telegram | High | Native SMS always available as fallback |
| User burnout from daily check-ins | Medium | No obligation, insights as motivation, no streaks |
| Sensitive data exposed | Low | Encryption at rest, RLS in Supabase, on-chain in v2 |
| App becomes a trigger in crisis | Low | Automatic sensory reduction mode in crisis |

---

## Appendix A — AQ-10 Questions (Autism Quotient-10)

> These are the 10 official questions of the AQ-10 (adult version). They must appear **exactly as shown** on screen S02. Do not invent or modify the questions.

**Instructions for the user (show before starting):**
> "These questions are not a diagnosis. They are a way to get to know yourself better. Answer according to how you usually feel, not in specific stressful situations. There are no right or wrong answers."

**Response scale (the same for all questions):**
- Strongly agree → **1 point**
- Slightly agree → **1 point**
- Slightly disagree → **0 points**
- Strongly disagree → **0 points**

**The 10 questions:**

| # | Question | Scores 1 when... |
|---|---|---|
| 1 | I often notice small sounds that others do not. | Agree |
| 2 | I usually concentrate more on the whole picture rather than small details. | Disagree |
| 3 | In social groups, I can easily keep track of several different conversations at once. | Disagree |
| 4 | If something interrupts me, I can return to what I was doing very quickly. | Disagree |
| 5 | I find it easy to tell if someone listening to me is getting bored. | Disagree |
| 6 | When I'm reading a story, I find it difficult to work out the characters' intentions. | Agree |
| 7 | I enjoy social occasions and group gatherings with several people. | Disagree |
| 8 | When I'm on the phone, I'm not always sure when it's my turn to speak. | Agree |
| 9 | I like collecting information about categories of things (types of cars, birds, trains, plants, etc.) | Agree |
| 10 | I find it difficult to know how to end a conversation. | Agree |

**Score interpretation (show to user when finished):**

| Score | On-screen message |
|---|---|
| 0 – 5 | "Your profile does not show clear signs of ASD. If you identify with these experiences in other ways, consider speaking with a specialist. Script can be useful for anyone." |
| 6 – 10 | "Many people with ASD identify with these answers. This result is not a diagnosis — only a specialist can provide one. Script is designed with people like you in mind." |

> ⚠️ **Never use the words "positive" or "negative" for the result.** Language must be neutral and supportive, never alarmist.

---

## Appendix B — Body Map SVG: Implementation Guide

The `BodyMap.tsx` component needs a human SVG silhouette with 6 touch zones. The AI agent implementing it must follow these specifications:

**SVG canvas dimensions:** `viewBox="0 0 200 400"`

**The 6 zones and their approximate areas in the SVG:**

| Zone | ID | Approximate area (x, y, width, height) |
|---|---|---|
| Head / Eyes / Jaw | `zone-head` | Circle: cx=100, cy=45, r=35 |
| Throat / Neck | `zone-throat` | Rect: x=85, y=78, w=30, h=25 |
| Chest / Heart | `zone-chest` | Ellipse: cx=100, cy=140, rx=45, ry=35 |
| Stomach / Abdomen | `zone-abdomen` | Ellipse: cx=100, cy=200, rx=38, ry=30 |
| Hands / Arms | `zone-arms` | Two lateral paths — approx x=25-65 and x=135-175, y=120-220 |
| Legs / Feet | `zone-legs` | Split rect: x=70, y=240, w=60, h=140 |

**Behavior of each zone:**
```typescript
// Props the component must accept
type BodyZone = 'head' | 'throat' | 'chest' | 'abdomen' | 'arms' | 'legs'

interface BodyMapProps {
  selectedZones: BodyZone[]
  onZoneToggle: (zone: BodyZone) => void
  disabled?: boolean
}

// Visual states (with NativeWind / SVG fill):
// Default: fill="#EFEFEA" stroke="#E0DDD8" strokeWidth={1.5}
// Selected: fill="#A8C5DA" stroke="#A8C5DA" strokeWidth={2} opacity={0.8}
// Pressed: fill="#A8C5DA" opacity={0.4} (immediate visual feedback)
```

**Zone labels (display as chips below the SVG):**
```typescript
const ZONE_LABELS: Record<BodyZone, string> = {
  head: 'Head / Eyes / Jaw',
  throat: 'Throat / Neck',
  chest: 'Chest / Heart',
  abdomen: 'Stomach / Abdomen',
  arms: 'Hands / Arms',
  legs: 'Legs / Feet',
}
```

---

## Appendix C — Full AQ (Autism Quotient — 50 questions)

> ⚠️ **Instruction for AI agents:** The 50 questions must be obtained from the official source:
> Baron-Cohen, S., Wheelwright, S., Skinner, R., Martin, J., & Clubley, E. (2001).
> The complete questionnaire is publicly available at: https://www.autismresearchcentre.com/arc_tests
> Do not generate questions from memory — use the source.

**Structure:** 50 questions, same scale as AQ-10 (4 options)

**5 domains (10 questions each):**

| Domain | What it measures | Max score |
|---|---|---|
| Social skills | Difficulty in social interaction | 10 |
| Attention switching | Rigidity / difficulty shifting focus | 10 |
| Attention to detail | Preference for local over global details | 10 |
| Communication | Pragmatic language difficulties | 10 |
| Imagination | Difficulty with fiction, others' perspectives | 10 |

**Scoring:**
- Total score: 0–50
- Indicative threshold: ≥32 (not a diagnosis, only indicative)
- Score per domain: saved in `aq_full_domain_scores` (JSONB)

**What the app saves:**
```json
{
  "aq_full_score": 38,
  "aq_full_domain_scores": {
    "social": 8,
    "attention_switching": 7,
    "attention_detail": 9,
    "communication": 7,
    "imagination": 7
  }
}
```

---

## Appendix D — CAT-Q (Camouflaging Autistic Traits Questionnaire — 25 questions)

> ⚠️ **Instruction for AI agents:** The 25 questions must be obtained from:
> Hull, L., Mandy, W., Lai, M. C., Baron-Cohen, S., Allison, C., Smith, P., & Petrides, K. V. (2019).
> Development and validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q).
> Journal of Autism and Developmental Disorders, 49(3), 819-833.
> The complete questionnaire is available in the supplementary material of the paper.
> DOI: 10.1007/s10803-018-3792-6

**Structure:** 25 questions, Likert scale 1–7

| Value | Label |
|---|---|
| 1 | Strongly disagree |
| 2 | Mostly disagree |
| 3 | Slightly disagree |
| 4 | Neither agree nor disagree |
| 5 | Slightly agree |
| 6 | Mostly agree |
| 7 | Strongly agree |

**3 subscales:**

| Subscale | # items | Score | What it measures |
|---|---|---|---|
| Assimilation | 9 | 9–63 | Learning and copying others' behaviors to fit in |
| Compensation | 12 | 12–84 | Active strategies to hide social difficulties |
| Masking | 4 | 4–28 | Suppressing autistic traits, presenting a "normal" persona |

**Total score:** 25–175 (sum of all items)

**Impact on Script profile:**
- High Masking (≥20): app reinforces authenticity messages, reduces social pressure
- High Compensation (≥60): more social navigation strategy scripts
- High Assimilation (≥45): scripts with explicit observation and imitation

**What the app saves:**
```json
{
  "catq_total_score": 142,
  "catq_subscores": {
    "assimilation": 52,
    "compensation": 68,
    "masking": 22
  }
}
```

---

## Appendix E — RAADS–R (Ritvo Autism Asperger Diagnostic Scale-Revised — 80 questions)

> ⚠️ **Instruction for AI agents:** The 80 questions must be obtained from:
> Ritvo, R. A., Ritvo, E. R., Guthrie, D., Ritvo, M. J., Hufnagel, D. H., McMahon, W., ... & Eloff, J. (2011).
> The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R).
> Journal of Autism and Developmental Disorders, 41(8), 1076-1089.
> DOI: 10.1007/s10803-010-1133-5

**Structure:** 80 questions, scale 0–3

| Value | Label |
|---|---|
| 0 | Never true |
| 1 | True only when I was young (up to age 16), not now |
| 2 | True only now, not when I was young |
| 3 | True now and when I was young |

**4 domains:**

| Domain | # items | Max score | What it measures |
|---|---|---|---|
| Social relatedness | 39 | 117 | Social reciprocity difficulties |
| Language | 7 | 21 | Language use and comprehension |
| Circumscribed interests | 14 | 42 | Intense and repetitive interests |
| Sensory motor | 20 | 60 | Sensory processing and motor control |

**Total score:** 0–240
- Indicative ASD threshold: ≥65

**Pause support — MANDATORY:**
With 80 questions, the test must be pausable and resumable:
- Save progress in `expo-secure-store` after each answer
- On reopening: ask "Continue where you left off?"
- Show: "You completed 34 of 80 questions"

**Impact on Script profile:**

| High score in... | Impact on the app |
|---|---|
| Social relatedness | Social interaction scripts marked as priority |
| Language | Scripts include more literal/direct phrasing options |
| Circumscribed interests | Check-in includes note about special interest activities |
| Sensory motor | Sensory profile pre-populated with auditory/tactile/proprioceptive sensitivities |

**What the app saves:**
```json
{
  "raads_total_score": 134,
  "raads_domain_scores": {
    "social_relatedness": 72,
    "language": 14,
    "circumscribed_interests": 32,
    "sensory_motor": 16
  }
}
```
