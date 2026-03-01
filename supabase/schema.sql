-- =============================================================
-- SCRIPT — Schema de Base de Datos
-- Ejecutar en Supabase Dashboard → SQL Editor → New Query
-- =============================================================

-- 1. Tabla: users
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

-- 2. Tabla: profiles
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  aq10_score          INTEGER CHECK (aq10_score BETWEEN 0 AND 10),
  aq10_completed_at   TIMESTAMPTZ,
  aq_full_score       INTEGER CHECK (aq_full_score BETWEEN 0 AND 50),
  aq_full_domain_scores JSONB,
  aq_full_completed_at TIMESTAMPTZ,
  catq_total_score    INTEGER CHECK (catq_total_score BETWEEN 25 AND 175),
  catq_subscores      JSONB,
  catq_completed_at   TIMESTAMPTZ,
  raads_total_score   INTEGER CHECK (raads_total_score BETWEEN 0 AND 240),
  raads_domain_scores JSONB,
  raads_completed_at  TIMESTAMPTZ,
  interests           TEXT[],
  sensitivities       JSONB DEFAULT '{}',
  existing_tools      TEXT[],
  theme               VARCHAR(10) DEFAULT 'system' CHECK (theme IN ('light', 'dark', 'system')),
  color_palette       VARCHAR(20) DEFAULT 'blue',
  reduce_motion       BOOLEAN DEFAULT FALSE,
  onboarding_complete BOOLEAN DEFAULT FALSE,
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  updated_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id)
);

-- 3. Tabla: scripts (antes de checkins por la referencia FK)
CREATE TABLE scripts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  created_by    UUID REFERENCES users(id),
  owner_user_id UUID REFERENCES users(id),
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(50) CHECK (category IN (
    'conversacion', 'lugar_publico', 'trabajo_estudio', 'crisis', 'personalizado'
  )),
  blocks        JSONB NOT NULL,
  is_predefined BOOLEAN DEFAULT FALSE,
  estimated_duration_seconds INTEGER,
  is_active     BOOLEAN DEFAULT TRUE,
  times_used    INTEGER DEFAULT 0,
  last_used_at  TIMESTAMPTZ,
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scripts_owner ON scripts(owner_user_id);
CREATE INDEX idx_scripts_category ON scripts(category);

-- 4. Tabla: checkins
CREATE TABLE checkins (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  body_zones        TEXT[] NOT NULL,
  free_text         TEXT,
  emotion_confirmed VARCHAR(100),
  emotion_options   JSONB,
  ai_interpretation TEXT,
  flagged_for_review BOOLEAN DEFAULT FALSE,
  checkin_at        TIMESTAMPTZ DEFAULT NOW(),
  synced            BOOLEAN DEFAULT TRUE,
  created_offline_at TIMESTAMPTZ,
  suggested_script_id UUID REFERENCES scripts(id)
);

CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_checkin_at ON checkins(checkin_at DESC);

-- 5. Tabla: emotional_dictionary
CREATE TABLE emotional_dictionary (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  word        VARCHAR(100) NOT NULL,
  description TEXT,
  color       VARCHAR(7),
  frequency   INTEGER DEFAULT 1,
  source      VARCHAR(20) DEFAULT 'confirmed' CHECK (source IN ('confirmed', 'custom')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word)
);

-- 6. Tabla: script_executions
CREATE TABLE script_executions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  script_id   UUID REFERENCES scripts(id),
  mode        VARCHAR(15) CHECK (mode IN ('preparation', 'execution')),
  completed   BOOLEAN DEFAULT FALSE,
  outcome     INTEGER CHECK (outcome BETWEEN 1 AND 3),
  notes       TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);

-- 7. Tabla: trusted_contacts
CREATE TABLE trusted_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  name            VARCHAR(100) NOT NULL,
  phone           VARCHAR(20),
  relationship    VARCHAR(50),
  notification_channel VARCHAR(20) DEFAULT 'push' CHECK (
    notification_channel IN ('push', 'sms', 'telegram', 'both')
  ),
  telegram_chat_id BIGINT,
  can_see_location    BOOLEAN DEFAULT TRUE,
  can_see_context     BOOLEAN DEFAULT TRUE,
  can_see_checkins    BOOLEAN DEFAULT FALSE,
  is_active       BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);

-- 8. Tabla: crisis_events
CREATE TABLE crisis_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  intensity_level     INTEGER NOT NULL CHECK (intensity_level BETWEEN 1 AND 3),
  latitude            DECIMAL(10,8),
  longitude           DECIMAL(11,8),
  location_address    TEXT,
  protocol_completed  BOOLEAN DEFAULT FALSE,
  contacts_notified   INTEGER DEFAULT 0,
  notification_method VARCHAR(10),
  prior_checkin_id    UUID REFERENCES checkins(id),
  outcome             VARCHAR(20) CHECK (outcome IN ('better', 'needs_more', 'called_someone', 'ongoing')),
  duration_seconds    INTEGER,
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);

-- 9. Tabla: therapist_patients
CREATE TABLE therapist_patients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id        UUID REFERENCES users(id),
  patient_id          UUID REFERENCES users(id),
  can_see_checkins    BOOLEAN DEFAULT TRUE,
  can_see_crisis      BOOLEAN DEFAULT FALSE,
  can_see_scripts     BOOLEAN DEFAULT TRUE,
  can_edit_scripts    BOOLEAN DEFAULT TRUE,
  can_see_patterns    BOOLEAN DEFAULT TRUE,
  share_data_until    TIMESTAMPTZ,
  status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(therapist_id, patient_id)
);
