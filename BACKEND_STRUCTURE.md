# BACKEND_STRUCTURE.md — Backend and Database Architecture
## Script — Digital Companion for Adults with ASD Level 1

**Version:** 1.4  
**Last updated:** 2026-03-08  
**Changes v1.4:** §4 `sync-privy-user` updated to Admin API approach (B-51 v2): `auth.admin.createUser` + `auth.admin.generateLink`. Output changed from `supabase_token` to `otp_token_hash`. No `SUPABASE_JWT_SECRET` required. Client flow updated: `verifyOtp({ token_hash, type: 'email' })` instead of `setSession()`.  
**Changes v1.3:** §4 interpret-checkin trigger corrected S11→S12 (the edge function is called from reflect.tsx). §4 send-crisis-notification corrected "level 2-3" → "level 3 only" (consistent with PRD/APP_FLOW/IMPLEMENTATION_PLAN). §5 Storage: note about audio bundled in assets for offline; filenames standardized.  
**Changes v1.2:** RAADS-R domain counts corrected (64→80 items). RLS with WITH CHECK on all tables. RLS added for emotional_dictionary, script_executions, therapist_patients. sync-privy-user documented in §4. Screen reference S07→S11.

---

## 1. General Architecture

```
Client (Expo App)
     │
     ├── Supabase JS Client ──────→ Supabase Cloud
     │                               ├── PostgreSQL (data)
     │                               ├── Auth (sessions)
     │                               ├── Storage (audio)
     │                               └── Edge Functions (AI, notifications)
     │
     ├── Privy SDK ───────────────→ Privy Cloud
     │                               ├── Embedded auth
     │                               └── Custodial wallet (Week 5 — EAS attestations)
     │
     └── expo-secure-store ───────→ Local (offline)
                                     ├── Cached scripts
                                     ├── Pending sync check-ins
                                     └── Session tokens
```

---

## 2. Database Schema (PostgreSQL — Supabase)

### Table: `users`
```sql
CREATE TABLE users (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  privy_user_id VARCHAR(255) UNIQUE NOT NULL,
  email         VARCHAR(255),
  display_name  VARCHAR(100),
  avatar_url    TEXT,
  role          VARCHAR(20) DEFAULT 'user' CHECK (role IN ('user', 'therapist', 'trusted_contact')),
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `profiles`
Sensory and personal profile of the main user.
```sql
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Screening tests (see PRD §3.1 and Appendices A-E)
  aq10_score          INTEGER CHECK (aq10_score BETWEEN 0 AND 10),
  aq10_completed_at   TIMESTAMPTZ,
  -- Full AQ (50 questions, score 0-50, clinical threshold ≥32)
  aq_full_score       INTEGER CHECK (aq_full_score BETWEEN 0 AND 50),
  aq_full_domain_scores JSONB,  -- {"social": 0-10, "attention_switching": 0-10, "attention_detail": 0-10, "communication": 0-10, "imagination": 0-10}
  aq_full_completed_at TIMESTAMPTZ,
  -- CAT-Q (25 questions, score 25-175, 3 subscales)
  catq_total_score    INTEGER CHECK (catq_total_score BETWEEN 25 AND 175),
  catq_subscores      JSONB,   -- {"assimilation": 9-63, "compensation": 12-84, "masking": 4-28}
  catq_completed_at   TIMESTAMPTZ,
  -- RAADS-R (80 questions, score 0-240, 4 domains)
  -- Domains: social_relatedness 39 items, language 7, circumscribed_interests 14, sensory_motor 20 → total 80 ✓
  raads_total_score   INTEGER CHECK (raads_total_score BETWEEN 0 AND 240),
  raads_domain_scores JSONB,   -- {"social_relatedness": 0-117, "language": 0-21, "circumscribed_interests": 0-42, "sensory_motor": 0-60}
  raads_completed_at  TIMESTAMPTZ,
  -- Personal questionnaire
  interests           TEXT[],                -- ["música", "programación", "anime"]
  sensitivities       JSONB DEFAULT '{}',    -- {"luz": true, "sonido": true, "texturas": false, "multitudes": true}
  existing_tools      TEXT[],               -- ["journaling", "terapia"]
  -- UI preferences
  theme               VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  color_palette       VARCHAR(20) DEFAULT 'blue',  -- 'blue', 'green', 'peach', 'lavender', 'yellow'
  reduce_motion       BOOLEAN DEFAULT FALSE,
  -- Meta
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);
```

### Table: `checkins`
Record of each body check-in.
```sql
CREATE TABLE checkins (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  -- User input
  body_zones        TEXT[] NOT NULL,         -- ["chest", "stomach", "hands"]
  free_text         TEXT,                    -- Written free text
  -- Result
  emotion_confirmed VARCHAR(100),            -- Emotion the user confirmed
  emotion_options   JSONB,                   -- Array of options presented by the AI
  ai_interpretation TEXT,                   -- Raw AI response
  flagged_for_review BOOLEAN DEFAULT FALSE,  -- 🚩 button
  -- Context
  checkin_at        TIMESTAMPTZ DEFAULT NOW(),
  hour_of_day       INTEGER GENERATED ALWAYS AS (EXTRACT(HOUR FROM checkin_at)) STORED,
  day_of_week       INTEGER GENERATED ALWAYS AS (EXTRACT(DOW FROM checkin_at)) STORED,
  -- Offline state
  synced            BOOLEAN DEFAULT TRUE,
  created_offline_at TIMESTAMPTZ,
  -- Suggested script
  suggested_script_id UUID REFERENCES scripts(id)
);

-- Indexes
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_checkin_at ON checkins(checkin_at DESC);
```

### Table: `emotional_dictionary`
User's personal emotional vocabulary.
```sql
CREATE TABLE emotional_dictionary (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  word        VARCHAR(100) NOT NULL,         -- The word the user uses
  description TEXT,                          -- Personal description
  color       VARCHAR(7),                    -- Personal hex color (#A8C5DA)
  frequency   INTEGER DEFAULT 1,             -- How many times it has been used
  source      VARCHAR(20) DEFAULT 'confirmed' CHECK (source IN ('confirmed', 'custom')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word)
);
```

### Table: `scripts`
Social scripts (predefined and custom).
```sql
CREATE TABLE scripts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Authorship
  created_by    UUID REFERENCES users(id),   -- NULL = system predefined
  owner_user_id UUID REFERENCES users(id),   -- Who it belongs to (can differ from creator if therapist made it)
  -- Content
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(50) CHECK (category IN (
    'conversacion', 'lugar_publico', 'trabajo_estudio', 'crisis', 'personalizado'
  )),
  -- Script blocks (JSONB for flexibility)
  blocks        JSONB NOT NULL,
  -- Example blocks:
  -- [
  --   {"type": "apertura", "options": ["Disculpa, ¿puedo interrumpir?", "Perdón, ¿tienes un momento?"]},
  --   {"type": "contexto", "text": "Estás en una reunión o conversación grupal"},
  --   {"type": "accion", "options": ["Necesito hacer una pregunta", "Quiero agregar algo"]},
  --   {"type": "salida", "options": ["Gracias", "Ya terminé"], "optional": true}
  -- ]
  -- Metadata
  is_predefined BOOLEAN DEFAULT FALSE,
  estimated_duration_seconds INTEGER,
  is_active     BOOLEAN DEFAULT TRUE,
  -- Statistics
  times_used    INTEGER DEFAULT 0,
  last_used_at  TIMESTAMPTZ,
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scripts_owner ON scripts(owner_user_id);
CREATE INDEX idx_scripts_category ON scripts(category);
```

### Table: `script_executions`
Record of script usage.
```sql
CREATE TABLE script_executions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  script_id   UUID REFERENCES scripts(id),
  mode        VARCHAR(15) CHECK (mode IN ('preparation', 'execution')),
  completed   BOOLEAN DEFAULT FALSE,
  outcome     INTEGER CHECK (outcome BETWEEN 1 AND 3),  -- 1=Good, 2=Fair, 3=Difficult
  notes       TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `trusted_contacts`
Trusted contacts configured by the user.
```sql
CREATE TABLE trusted_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Contact data
  name            VARCHAR(100) NOT NULL,
  phone           VARCHAR(20),               -- For SMS fallback
  relationship    VARCHAR(50),              -- "mamá", "amigo", "pareja", "terapeuta"
  -- Configuration
  notification_channel VARCHAR(20) DEFAULT 'push' CHECK (
    notification_channel IN ('push', 'sms', 'telegram', 'both')
  ),
  telegram_chat_id BIGINT,                  -- For Telegram bot (week 3+)
  -- Visibility permissions
  can_see_location    BOOLEAN DEFAULT TRUE,
  can_see_context     BOOLEAN DEFAULT TRUE,
  can_see_checkins    BOOLEAN DEFAULT FALSE,
  -- Status
  is_active       BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Table: `crisis_events`
Record of crisis events (rescue button).
```sql
CREATE TABLE crisis_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Initial assessment
  intensity_level     INTEGER NOT NULL CHECK (intensity_level BETWEEN 1 AND 3),
  -- Location (if permission was granted)
  latitude            DECIMAL(10,8),
  longitude           DECIMAL(11,8),
  location_address    TEXT,                  -- Reverse geocoded
  -- Protocol
  protocol_completed  BOOLEAN DEFAULT FALSE,
  contacts_notified   INTEGER DEFAULT 0,     -- How many contacts were notified
  notification_method VARCHAR(10),           -- 'push', 'sms', 'none'
  -- Context from prior check-in (if exists)
  prior_checkin_id    UUID REFERENCES checkins(id),
  -- Resolution
  outcome             VARCHAR(20) CHECK (outcome IN ('better', 'needs_more', 'called_someone', 'ongoing')),
  duration_seconds    INTEGER,               -- How long the protocol lasted
  -- Timestamps
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);
```

### Table: `therapist_patients`
Therapist ↔ patient relationship.
```sql
CREATE TABLE therapist_patients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id        UUID REFERENCES users(id),
  patient_id          UUID REFERENCES users(id),
  -- Permissions (patient controls)
  can_see_checkins    BOOLEAN DEFAULT TRUE,
  can_see_crisis      BOOLEAN DEFAULT FALSE,
  can_see_scripts     BOOLEAN DEFAULT TRUE,
  can_edit_scripts    BOOLEAN DEFAULT TRUE,
  can_see_patterns    BOOLEAN DEFAULT TRUE,
  share_data_until    TIMESTAMPTZ,           -- NULL = indefinite
  -- Status
  status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(therapist_id, patient_id)
);
```

---

## 3. Row Level Security (RLS)

```sql
-- MASTER RULE: each user can only see and modify their own data
-- ⚠️ CRITICAL: WITH CHECK is mandatory for INSERT to work in Supabase.
--    Without WITH CHECK, INSERTs fail silently even if the USING clause passes.

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON users
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_data" ON profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- checkins
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checkins_own_data" ON checkins
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
-- Exception: therapist can view check-ins if they have active permission
CREATE POLICY "checkins_therapist_view" ON checkins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM therapist_patients
      WHERE therapist_id = auth.uid()
      AND patient_id = checkins.user_id
      AND can_see_checkins = TRUE
      AND status = 'active'
      AND (share_data_until IS NULL OR share_data_until > NOW())
    )
  );

-- emotional_dictionary: user only
ALTER TABLE emotional_dictionary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dictionary_own_data" ON emotional_dictionary
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- scripts: predefined are public (read-only), custom are private
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scripts_predefined_read" ON scripts
  FOR SELECT USING (is_predefined = TRUE);
CREATE POLICY "scripts_own_data" ON scripts
  FOR ALL USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);
-- Exception: therapist can view their patient's scripts if they have permission
CREATE POLICY "scripts_therapist_view" ON scripts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM therapist_patients
      WHERE therapist_id = auth.uid()
      AND patient_id = scripts.owner_user_id
      AND can_see_scripts = TRUE
      AND status = 'active'
      AND (share_data_until IS NULL OR share_data_until > NOW())
    )
  );

-- script_executions: user only
ALTER TABLE script_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "executions_own_data" ON script_executions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- trusted_contacts: user only
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_own_data" ON trusted_contacts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- crisis_events: user only
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crisis_own_data" ON crisis_events
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- therapist_patients: therapist and patient can view the relationship; only the patient controls permissions
ALTER TABLE therapist_patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tp_therapist_view" ON therapist_patients
  FOR SELECT USING (auth.uid() = therapist_id OR auth.uid() = patient_id);
CREATE POLICY "tp_patient_manage" ON therapist_patients
  FOR ALL USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);
```

---

## 4. Edge Functions (Supabase)

### `sync-privy-user`
**Trigger:** POST from the client immediately after Privy completes login (fire-and-forget — never awaited in navigation path)  
**Auth required:** `SUPABASE_SERVICE_ROLE_KEY` (auto-injected by Supabase runtime — no additional secrets needed)  
**Input:**
```typescript
{
  privy_user_id: string,
  email?: string,
  wallet_address?: string
}
```
**Process:**
1. Looks up existing user in `users` by `privy_user_id`
2. If not found: creates user via `supabase.auth.admin.createUser()` + inserts into `users` + creates empty `profiles` row
3. If found: updates `updated_at` in `users`
4. Reads `onboarding_complete` from `profiles`
5. Calls `supabase.auth.admin.generateLink({ type: 'magiclink', email })` to get a one-time token
6. Returns token hash for client-side session establishment

**Output:**
```typescript
{
  user_id: string,               // Supabase auth UUID
  onboarding_complete: boolean,  // from profiles table
  created: boolean,              // true = new user → redirect to onboarding
  otp_token_hash: string         // used by client to establish Supabase session
}
```
**Client-side flow (after receiving response):**
```typescript
// lib/supabase.ts — setSupabaseToken()
await supabase.auth.verifyOtp({ token_hash: otp_token_hash, type: 'email' })
// This establishes a real Supabase session → auth.uid() returns correct UUID → RLS resolves
```
> **Note:** `autoRefreshToken` is set to `false` in the Supabase client — Privy manages the session lifecycle. Supabase session is re-established on each app startup via AuthGate sync.

---

### `interpret-checkin`
**Trigger:** POST from the client when loading S12 (checkin/reflect.tsx — the user completed S11 and navigated to the interpretation screen)  
**Input:**
```typescript
{
  body_zones: string[],
  free_text: string,
  user_id: string,
  recent_checkins?: CheckinSummary[]  // last 3-5
}
```
**Process:** Calls OpenAI GPT-4o with an ASD system prompt + user profile  
**Output:**
```typescript
{
  options: Array<{
    label: string,          // "Social anxiety"
    description: string,    // "Tension around expectations of social interaction"
    confidence: number      // 0-1
  }>,
  suggested_script_id?: string
}
```

### `send-crisis-notification`
**Trigger:** POST from the client when activating the **level 3 protocol only** (levels 1 and 2 do not notify — see PRD §3.4)  
**Input:**
```typescript
{
  user_id: string,
  intensity_level: number,
  latitude?: number,
  longitude?: number,
  context_text?: string
}
```
**Process:** Finds trusted_contacts, sends push via Expo Push API + Telegram bot if configured  
**Output:** `{ notified: number, method: string }`

### `generate-report` (Week 4+)
**Trigger:** POST from therapist  
**Input:** `{ patient_id, date_from, date_to, sections: string[] }`  
**Output:** Structured JSON with patterns, summarized check-ins, scripts used

---

## 5. Storage (Supabase Storage)

### Bucket: `calming-audio`
- Access: **public** (audio files are not sensitive)
- Contents: `.mp3` files of breathing guidance tones
- Naming: `tone-inhale.mp3`, `tone-exhale.mp3`, `tone-ambient.mp3`, `tone-grounding-voice.mp3`

> ⚠️ **MVP — Audio offline-first:** The breathing and grounding protocol (S18) must work without internet. For Week 1, audio files must be **bundled in the app** under `assets/audio/` with the same names:
> - `tone-inhale.mp3` — inhalation tone (Level 2/3 breathing)
> - `tone-exhale.mp3` — exhalation tone (Level 2/3 breathing)
> - `tone-ambient.mp3` — background ambient tone (all levels)
> - `tone-grounding-voice.mp3` — guided voice for Grounding 5-4-3-2-1 (Level 1)
>
> This Supabase Storage bucket is for extended content in Week 3+. Always use local `require()` in the implementation:
> ```typescript
> const voice = useAudioPlayer(require('../../assets/audio/tone-grounding-voice.mp3'))
> const ambient = useAudioPlayer(require('../../assets/audio/tone-ambient.mp3'))
> ```

### Bucket: `user-avatars`
- Access: **private** (only the user can see their avatar)
- Naming: `{user_id}/avatar.jpg`

---

## 6. Predefined Data (Seed)

### Initial predefined scripts (5 for MVP)

```sql
INSERT INTO scripts (title, description, category, is_predefined, blocks, estimated_duration_seconds) VALUES
(
  'Interrumpir una conversación',
  'Para cuando quieres unirte o hacer una pregunta en una conversación grupal',
  'conversacion',
  TRUE,
  '[
    {"type":"apertura","options":["Disculpa, ¿puedo interrumpir un momento?","Perdón, ¿tengo un segundo?"]},
    {"type":"contexto","text":"Estás en una conversación y necesitas intervenir"},
    {"type":"accion","options":["Quería preguntar sobre...","Necesito agregar algo sobre...","¿Podría aclarar...?"]},
    {"type":"salida","optional":true,"options":["Gracias, eso es todo","Ya terminé, disculpen"]}
  ]',
  45
),
(
  'Pedir algo en un lugar público',
  'Restaurante, tienda, transporte — cuando necesitas pedir ayuda o información',
  'lugar_publico',
  TRUE,
  '[
    {"type":"apertura","options":["Hola, buenos días/tardes","Disculpa, ¿me puedes ayudar?"]},
    {"type":"accion","options":["Quisiera [lo que necesitas]","¿Tienen [lo que buscas]?","¿Me podrías decir dónde está...?"]},
    {"type":"salida","optional":true,"options":["Muchas gracias","Gracias, eso es todo lo que necesitaba"]}
  ]',
  30
),
(
  'Sobrecarga sensorial en público',
  'Cuando el ambiente es demasiado y necesitas espacio o salir',
  'crisis',
  TRUE,
  '[
    {"type":"apertura","options":["Necesito un momento","Disculpa, me siento un poco abrumado/a"]},
    {"type":"accion","options":["¿Podría salir un momento?","Voy a tomar un poco de aire","Necesito un lugar más tranquilo"]},
    {"type":"salida","optional":true,"options":["Vuelvo en unos minutos","Gracias por entender"]}
  ]',
  30
),
(
  'Primera reunión o entrevista',
  'Para presentarte y navegar el inicio de una reunión o entrevista de trabajo',
  'trabajo_estudio',
  TRUE,
  '[
    {"type":"apertura","options":["Hola, mucho gusto. Soy [nombre]","Buenos días/tardes, soy [nombre]"]},
    {"type":"contexto","text":"Estás en tu primera reunión o entrevista"},
    {"type":"accion","options":["Estoy aquí para [rol/propósito]","Me contaron sobre esta oportunidad y me interesa mucho","¿Por dónde les gustaría que empezara?"]},
    {"type":"salida","optional":true,"options":["Quedo atento/a a sus preguntas","¿Qué más les gustaría saber?"]}
  ]',
  60
),
(
  'Resolver un malentendido',
  'Cuando hay tensión o confusión con alguien y necesitas aclararlo',
  'conversacion',
  TRUE,
  '[
    {"type":"apertura","options":["Creo que hubo un malentendido","Quisiera aclarar algo si está bien"]},
    {"type":"accion","options":["Lo que quise decir fue...","Entendí que... ¿es correcto?","No era mi intención..."]},
    {"type":"salida","optional":true,"options":["¿Estamos bien?","Gracias por escucharme"]}
  ]',
  60
);
```

---

## 7. Offline Strategy

**What always works without a connection:**
- Reading scripts (cached in AsyncStorage on first fetch)
- Performing a check-in (saved in SecureStore with `synced: false`)
- Executing the crisis protocol (local sequence)

**Upon reconnection:**
1. App detects items with `synced: false` in SecureStore
2. Uploads them to Supabase in chronological order
3. Calls the `interpret-checkin` edge function for pending check-ins
4. Updates UI with results

```typescript
// Sync logic in lib/offline-sync.ts
export const syncPendingCheckins = async () => {
  const pending = await SecureStore.getItemAsync('pending_checkins')
  if (!pending) return
  
  const checkins = JSON.parse(pending)
  for (const checkin of checkins) {
    const { data } = await supabase
      .from('checkins')
      .insert({ ...checkin, synced: true })
    // Clear from SecureStore after successful sync
  }
}
```

---

## 8. Authentication — Full Flow

```
User → Privy SDK (email/social login)
  │
  ├── Privy returns: { privy_user_id, email, wallet_address? }
  │
  └── App calls Supabase Edge Function: `sync-privy-user`
      ├── Finds user by privy_user_id
      ├── If not found: creates user + empty profile
      ├── Returns Supabase session token
      └── App stores token in SecureStore
```

---

## 9. Required Environment Variables in Supabase

Configure in Supabase Dashboard → Settings → Edge Functions → Secrets:

```
OPENAI_API_KEY=sk-...
EXPO_PUSH_TOKEN_SECRET=...  (to verify tokens)
TELEGRAM_BOT_TOKEN=...      (week 3+)
```
