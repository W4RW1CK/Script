# BACKEND_STRUCTURE.md — Arquitectura de Backend y Base de Datos
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.0  
**Última actualización:** 2026-02-25

---

## 1. Arquitectura General

```
Cliente (Expo App)
     │
     ├── Supabase JS Client ──────→ Supabase Cloud
     │                               ├── PostgreSQL (datos)
     │                               ├── Auth (sesiones)
     │                               ├── Storage (audio)
     │                               └── Edge Functions (IA, notificaciones)
     │
     ├── Privy SDK ───────────────→ Privy Cloud
     │                               ├── Auth embebido
     │                               └── Wallet custodial (semana 4+)
     │
     └── expo-secure-store ───────→ Local (offline)
                                     ├── Scripts cacheados
                                     ├── Check-ins pendientes sync
                                     └── Tokens de sesión
```

---

## 2. Esquema de Base de Datos (PostgreSQL — Supabase)

### Tabla: `users`
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

### Tabla: `profiles`
Perfil sensorial y personal del usuario principal.
```sql
CREATE TABLE profiles (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  -- AQ-10
  aq10_score          INTEGER CHECK (aq10_score BETWEEN 0 AND 10),
  aq10_completed_at   TIMESTAMPTZ,
  -- Cuestionario personal
  interests           TEXT[],                -- ["música", "programación", "anime"]
  sensitivities       JSONB DEFAULT '{}',    -- {"luz": true, "sonido": true, "texturas": false, "multitudes": true}
  existing_tools      TEXT[],               -- ["journaling", "terapia"]
  -- Preferencias UI
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

### Tabla: `checkins`
Registro de cada check-in corporal.
```sql
CREATE TABLE checkins (
  id                UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id           UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Input del usuario
  body_zones        TEXT[] NOT NULL,         -- ["chest", "stomach", "hands"]
  free_text         TEXT,                    -- Texto libre escrito
  -- Resultado
  emotion_confirmed VARCHAR(100),            -- Emoción que el usuario confirmó
  emotion_options   JSONB,                   -- Array de opciones que presentó la IA
  ai_interpretation TEXT,                   -- Respuesta raw de la IA
  flagged_for_review BOOLEAN DEFAULT FALSE,  -- 🚩 botón
  -- Contexto
  checkin_at        TIMESTAMPTZ DEFAULT NOW(),
  hour_of_day       INTEGER GENERATED ALWAYS AS (EXTRACT(HOUR FROM checkin_at)) STORED,
  day_of_week       INTEGER GENERATED ALWAYS AS (EXTRACT(DOW FROM checkin_at)) STORED,
  -- Estado offline
  synced            BOOLEAN DEFAULT TRUE,
  created_offline_at TIMESTAMPTZ,
  -- Script sugerido
  suggested_script_id UUID REFERENCES scripts(id)
);

-- Índices
CREATE INDEX idx_checkins_user_id ON checkins(user_id);
CREATE INDEX idx_checkins_checkin_at ON checkins(checkin_at DESC);
```

### Tabla: `emotional_dictionary`
Vocabulario emocional personal del usuario.
```sql
CREATE TABLE emotional_dictionary (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  word        VARCHAR(100) NOT NULL,         -- La palabra que el usuario usa
  description TEXT,                          -- Descripción personal
  color       VARCHAR(7),                    -- Color hex personal (#A8C5DA)
  frequency   INTEGER DEFAULT 1,             -- Cuántas veces la ha usado
  source      VARCHAR(20) DEFAULT 'confirmed' CHECK (source IN ('confirmed', 'custom')),
  created_at  TIMESTAMPTZ DEFAULT NOW(),
  updated_at  TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, word)
);
```

### Tabla: `scripts`
Scripts sociales (predefinidos y personalizados).
```sql
CREATE TABLE scripts (
  id            UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  -- Autoría
  created_by    UUID REFERENCES users(id),   -- NULL = predefinido del sistema
  owner_user_id UUID REFERENCES users(id),   -- A quién pertenece (puede ser diferente al creador si terapeuta lo hizo)
  -- Contenido
  title         VARCHAR(200) NOT NULL,
  description   TEXT,
  category      VARCHAR(50) CHECK (category IN (
    'conversacion', 'lugar_publico', 'trabajo_estudio', 'crisis', 'personalizado'
  )),
  -- Bloques del script (JSONB para flexibilidad)
  blocks        JSONB NOT NULL,
  -- Ejemplo de blocks:
  -- [
  --   {"type": "apertura", "options": ["Disculpa, ¿puedo interrumpir?", "Perdón, ¿tienes un momento?"]},
  --   {"type": "contexto", "text": "Estás en una reunión o conversación grupal"},
  --   {"type": "accion", "options": ["Necesito hacer una pregunta", "Quiero agregar algo"]},
  --   {"type": "salida", "options": ["Gracias", "Ya terminé"], "optional": true}
  -- ]
  -- Metadatos
  is_predefined BOOLEAN DEFAULT FALSE,
  estimated_duration_seconds INTEGER,
  is_active     BOOLEAN DEFAULT TRUE,
  -- Estadísticas
  times_used    INTEGER DEFAULT 0,
  last_used_at  TIMESTAMPTZ,
  -- Timestamps
  created_at    TIMESTAMPTZ DEFAULT NOW(),
  updated_at    TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_scripts_owner ON scripts(owner_user_id);
CREATE INDEX idx_scripts_category ON scripts(category);
```

### Tabla: `script_executions`
Registro de uso de scripts.
```sql
CREATE TABLE script_executions (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id     UUID REFERENCES users(id) ON DELETE CASCADE,
  script_id   UUID REFERENCES scripts(id),
  mode        VARCHAR(15) CHECK (mode IN ('preparation', 'execution')),
  completed   BOOLEAN DEFAULT FALSE,
  outcome     INTEGER CHECK (outcome BETWEEN 1 AND 3),  -- 1=Bien, 2=Regular, 3=Difícil
  notes       TEXT,
  executed_at TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: `trusted_contacts`
Personas de confianza configuradas por el usuario.
```sql
CREATE TABLE trusted_contacts (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id         UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Datos del contacto
  name            VARCHAR(100) NOT NULL,
  phone           VARCHAR(20),               -- Para SMS fallback
  relationship    VARCHAR(50),              -- "mamá", "amigo", "pareja", "terapeuta"
  -- Configuración
  notification_channel VARCHAR(20) DEFAULT 'push' CHECK (
    notification_channel IN ('push', 'sms', 'telegram', 'both')
  ),
  telegram_chat_id BIGINT,                  -- Para bot de Telegram (semana 3+)
  -- Permisos de visibilidad
  can_see_location    BOOLEAN DEFAULT TRUE,
  can_see_context     BOOLEAN DEFAULT TRUE,
  can_see_checkins    BOOLEAN DEFAULT FALSE,
  -- Estado
  is_active       BOOLEAN DEFAULT TRUE,
  last_notified_at TIMESTAMPTZ,
  created_at      TIMESTAMPTZ DEFAULT NOW()
);
```

### Tabla: `crisis_events`
Registro de eventos de crisis (botón de rescate).
```sql
CREATE TABLE crisis_events (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id             UUID REFERENCES users(id) ON DELETE CASCADE,
  -- Evaluación inicial
  intensity_level     INTEGER NOT NULL CHECK (intensity_level BETWEEN 1 AND 3),
  -- Ubicación (si se otorgó permiso)
  latitude            DECIMAL(10,8),
  longitude           DECIMAL(11,8),
  location_address    TEXT,                  -- Reverse geocoded
  -- Protocolo
  protocol_completed  BOOLEAN DEFAULT FALSE,
  contacts_notified   INTEGER DEFAULT 0,     -- Cuántos contactos se notificaron
  notification_method VARCHAR(10),           -- 'push', 'sms', 'none'
  -- Contexto del checkin previo (si existe)
  prior_checkin_id    UUID REFERENCES checkins(id),
  -- Resolución
  outcome             VARCHAR(20) CHECK (outcome IN ('better', 'needs_more', 'called_someone', 'ongoing')),
  duration_seconds    INTEGER,               -- Cuánto duró el protocolo
  -- Timestamps
  started_at          TIMESTAMPTZ DEFAULT NOW(),
  resolved_at         TIMESTAMPTZ
);
```

### Tabla: `therapist_patients`
Relación terapeuta ↔ paciente.
```sql
CREATE TABLE therapist_patients (
  id                  UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  therapist_id        UUID REFERENCES users(id),
  patient_id          UUID REFERENCES users(id),
  -- Permisos (paciente controla)
  can_see_checkins    BOOLEAN DEFAULT TRUE,
  can_see_crisis      BOOLEAN DEFAULT FALSE,
  can_see_scripts     BOOLEAN DEFAULT TRUE,
  can_edit_scripts    BOOLEAN DEFAULT TRUE,
  can_see_patterns    BOOLEAN DEFAULT TRUE,
  share_data_until    TIMESTAMPTZ,           -- NULL = indefinido
  -- Estado
  status              VARCHAR(20) DEFAULT 'active' CHECK (status IN ('pending', 'active', 'paused', 'ended')),
  created_at          TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(therapist_id, patient_id)
);
```

---

## 3. Row Level Security (RLS)

```sql
-- REGLA MAESTRA: cada usuario solo ve sus propios datos

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON users
  FOR ALL USING (auth.uid() = id);

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_data" ON profiles
  FOR ALL USING (auth.uid() = user_id);

-- checkins
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checkins_own_data" ON checkins
  FOR ALL USING (auth.uid() = user_id);
-- Excepción: terapeuta puede ver checkins si tiene permiso
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

-- scripts: predefinidos son públicos (lectura), personalizados son privados
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scripts_predefined_read" ON scripts
  FOR SELECT USING (is_predefined = TRUE);
CREATE POLICY "scripts_own_data" ON scripts
  FOR ALL USING (auth.uid() = owner_user_id);

-- crisis_events: solo el usuario
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crisis_own_data" ON crisis_events
  FOR ALL USING (auth.uid() = user_id);

-- trusted_contacts: solo el usuario
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_own_data" ON trusted_contacts
  FOR ALL USING (auth.uid() = user_id);
```

---

## 4. Edge Functions (Supabase)

### `interpret-checkin`
**Trigger:** POST desde el cliente al completar S07 (texto libre)  
**Input:**
```typescript
{
  body_zones: string[],
  free_text: string,
  user_id: string,
  recent_checkins?: CheckinSummary[]  // últimos 3-5
}
```
**Proceso:** Llama a OpenAI GPT-4o con system prompt de TEA + perfil del usuario  
**Output:**
```typescript
{
  options: Array<{
    label: string,          // "Ansiedad social"
    description: string,    // "Tensión ante expectativas de interacción"
    confidence: number      // 0-1
  }>,
  suggested_script_id?: string
}
```

### `send-crisis-notification`
**Trigger:** POST desde el cliente al activar protocolo nivel 2-3  
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
**Proceso:** Busca trusted_contacts, envía push via Expo Push API + Telegram bot si configurado  
**Output:** `{ notified: number, method: string }`

### `generate-report` (Semana 4+)
**Trigger:** POST del terapeuta  
**Input:** `{ patient_id, date_from, date_to, sections: string[] }`  
**Output:** JSON estructurado con patrones, check-ins resumidos, scripts usados

---

## 5. Storage (Supabase Storage)

### Bucket: `calming-audio`
- Acceso: **público** (archivos de audio no son sensitivos)
- Contenido: archivos `.mp3` de tonos de guía de respiración
- Naming: `tone-inhale.mp3`, `tone-exhale.mp3`, `tone-ambient.mp3`

### Bucket: `user-avatars`
- Acceso: **privado** (solo el usuario puede ver su avatar)
- Naming: `{user_id}/avatar.jpg`

---

## 6. Datos Predefinidos (Seed)

### Scripts predefinidos iniciales (5 para MVP)

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

## 7. Estrategia Offline

**Lo que siempre funciona sin conexión:**
- Leer scripts (cacheados en AsyncStorage al primer fetch)
- Realizar check-in (guardado en SecureStore con `synced: false`)
- Ejecutar protocolo de crisis (secuencia local)

**Al reconectarse:**
1. App detecta items con `synced: false` en SecureStore
2. Los sube a Supabase en orden cronológico
3. Llama a edge function `interpret-checkin` para los check-ins pendientes
4. Actualiza UI con resultados

```typescript
// Sync logic en lib/offline-sync.ts
export const syncPendingCheckins = async () => {
  const pending = await SecureStore.getItemAsync('pending_checkins')
  if (!pending) return
  
  const checkins = JSON.parse(pending)
  for (const checkin of checkins) {
    const { data } = await supabase
      .from('checkins')
      .insert({ ...checkin, synced: true })
    // Limpiar de SecureStore después de sync exitoso
  }
}
```

---

## 8. Autenticación — Flujo Completo

```
Usuario → Privy SDK (email/social login)
  │
  ├── Privy retorna: { privy_user_id, email, wallet_address? }
  │
  └── App llama Supabase Edge Function: `sync-privy-user`
      ├── Busca user por privy_user_id
      ├── Si no existe: crea user + profile vacío
      ├── Retorna Supabase session token
      └── App almacena token en SecureStore
```

---

## 9. Variables de Entorno Requeridas en Supabase

Configurar en Supabase Dashboard → Settings → Edge Functions → Secrets:

```
OPENAI_API_KEY=sk-...
EXPO_PUSH_TOKEN_SECRET=...  (para verificar tokens)
TELEGRAM_BOT_TOKEN=...      (semana 3+)
```
