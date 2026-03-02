# TECH_STACK.md — Stack Tecnológico
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.2  
**Última actualización:** 2026-02-26  
**Cambios v1.3:** Eliminado `expo-symbols` (SF Symbols solo funciona en iOS/web — B-07); estándar de íconos actualizado a `@expo/vector-icons` (Ionicons), que ya viene incluido con Expo.  
**Cambios v1.2:** Agregado `expo-symbols` a Estilos y UI y al comando de instalación (requerido por FRONTEND_GUIDELINES §8).  
**Cambios v1.1:** Versiones verificadas contra npm registry. Expo 52→55, React 18→19, Reanimated 3→4, openai 4→6, zod 3→4, expo-av→expo-audio, todas las versiones de paquetes expo actualizadas.

> ⚠️ **Regla de oro:** No instales ningún paquete que no esté en este documento sin actualizar este archivo primero. La consistencia de versiones previene el 80% de los bugs de setup.

---

## Plataforma Base

| Herramienta | Versión | Propósito |
|---|---|---|
| **Expo SDK** | **55.0.2** | Framework principal — web + Android desde un codebase |
| **React Native** | **0.79.x** | (incluido en Expo 55) |
| **React** | **19.2.x** | (incluido en Expo 55) — **React 19, no 18** |
| **TypeScript** | **5.3.x** | Tipado estricto — obligatorio en todo el proyecto |
| **Node.js** | **20.x (LTS)** | Runtime de desarrollo |

> ⚠️ **Nota React 19:** React 19 trae cambios en `use`, `useActionState`, y manejo de refs. Los AI agents deben generar código React 19-compatible. No usar patrones deprecated de React 17/18.

---

## Routing y Navegación

| Herramienta | Versión | Propósito |
|---|---|---|
| **expo-router** | **55.0.2** | Routing basado en archivos (Expo 55 usa su propia versión sincronizada) |

**Estructura de rutas:**
```
app/
├── (onboarding)/
│   ├── index.tsx          → S01 Welcome
│   ├── aq10.tsx           → S02 AQ-10 Test (10 preguntas)
│   ├── aq10-result.tsx    → S03 AQ-10 Resultado + decisión de continuar
│   ├── aq-full.tsx        → S04 AQ Completo (50 preguntas, opcional)
│   ├── catq.tsx           → S05 CAT-Q (25 preguntas, opcional)
│   ├── raads.tsx          → S06 RAADS-R (80 preguntas, opcional)
│   ├── profile.tsx        → S07 Cuestionario Personal
│   └── contacts.tsx       → S08 Setup Contactos de Confianza
├── (app)/
│   ├── _layout.tsx        → Layout con bottom navigation (5 tabs)
│   ├── home.tsx           → S09 Home
│   ├── checkin/
│   │   ├── body.tsx       → S10 Mapa Corporal
│   │   ├── notes.tsx      → S11 Texto Libre
│   │   ├── reflect.tsx    → S12 Interpretación IA
│   │   └── result.tsx     → S13 Resultado Check-in
│   ├── scripts/
│   │   ├── index.tsx      → S14 Biblioteca de Scripts
│   │   ├── [id].tsx       → S15 Script Detalle
│   │   └── [id]/execute.tsx → S16 Script Ejecución
│   ├── rescue/
│   │   ├── assess.tsx     → S17 Evaluación de Crisis
│   │   └── protocol.tsx   → S18 Protocolo de Rescate
│   ├── history.tsx        → S19 Historial
│   ├── dictionary.tsx     → S20 Diccionario Emocional
│   └── settings/
│       ├── index.tsx      → S21 Configuración
│       └── contacts.tsx   → S22 Gestión Contactos
├── therapist/
│   └── index.tsx          → S23 Vista Terapeuta
└── auth.tsx               → S24 Login / Auth
```

---

## Estilos y UI

| Herramienta | Versión | Propósito |
|---|---|---|
| **nativewind** | **4.2.2** | Tailwind CSS para React Native |
| **tailwindcss** | **3.4.x** | Requerido por NativeWind 4 (≥3.3.0) |
| **react-native-svg** | **15.15.3** | Silueta corporal interactiva + círculo de respiración |
| **react-native-reanimated** | **4.2.2** | Animaciones fluidas |
| **react-native-worklets** | **0.7.4** | ⚠️ NUEVO — Peer dependency requerida por Reanimated 4 |
| **@expo-google-fonts/inter** | **latest** | Fuente Inter |
| **expo-font** | **13.x** | Carga de fuentes custom |
| **@expo/vector-icons** (Ionicons) | incluido con Expo | Íconos multiplataforma iOS/Android/web — estándar del proyecto. ⚠️ NUNCA usar `expo-symbols` (solo iOS/web) |

> ⚠️ **Cambio importante — Reanimated 4:** La versión 4.x usa una nueva arquitectura de worklets. El API de `useAnimatedStyle`, `withTiming`, etc. se mantiene, pero ahora requiere `react-native-worklets` instalado. Sin esta dependencia la app crashea en runtime.

> ⚠️ **Nota NativeWind:** Requiere configuración específica en `babel.config.js` y `tailwind.config.js`. Ver sección de configuración abajo.

**`tailwind.config.js` — OBLIGATORIO:**
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

| Herramienta | Versión | Propósito |
|---|---|---|
| **@supabase/supabase-js** | **2.97.0** | Cliente JS para todo: DB, auth, storage, realtime |
| **Supabase** (servicio) | — | PostgreSQL + Auth + Storage + Edge Functions |

**Configuración:**
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

## Autenticación y Wallet

| Herramienta | Versión | Propósito |
|---|---|---|
| **@privy-io/expo** | **0.63.6** | Auth multi-método: email, Google, Apple, wallet embedded |
| **Privy** (servicio) | — | Gestión de sesiones + wallets custodiales |

**Métodos de login habilitados:**
1. Email (magic link)
2. Google OAuth
3. Wallet embedded (para on-chain en semana 4+)

---

## Inteligencia Artificial

| Herramienta | Versión | Propósito |
|---|---|---|
| **openai** | **6.25.0** | SDK oficial OpenAI |
| **GPT-4o** | latest | Interpretación emocional + sugerencias de scripts |

> ⚠️ **Cambio importante — openai v6:** El SDK de OpenAI cambió su API entre v4 y v6. Usar siempre la sintaxis de v6:

```typescript
// ✅ Correcto — openai v6
import OpenAI from 'openai'
const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY })
const response = await client.chat.completions.create({
  model: 'gpt-4o',
  messages: [...],
  response_format: { type: 'json_object' },
})

// ❌ Incorrecto — sintaxis vieja v4
import { Configuration, OpenAIApi } from 'openai' // No existe en v6
```

**Solo en Supabase Edge Functions (server-side). NUNCA en el cliente.**

---

## Audio y Sensores

| Herramienta | Versión | Propósito |
|---|---|---|
| **expo-audio** | **55.0.8** | ✅ Reemplazo moderno de expo-av para audio |
| **expo-haptics** | **55.0.8** | Retroalimentación háptica en protocolo de respiración |
| **expo-location** | **55.1.2** | Ubicación en alertas de crisis (con permiso explícito) |
| **expo-sms** | **55.0.8** | SMS nativo fallback para alertas offline |

> ⚠️ **expo-av está deprecated:** No usar expo-av en proyectos nuevos con Expo 55. Usar `expo-audio` para reproducción de audio.

**Uso de expo-audio para tonos de calma:**
```typescript
import { useAudioPlayer } from 'expo-audio'

const player = useAudioPlayer(require('../assets/audio/calm-tone.mp3'))
player.play()
player.pause()
```

---

## Notificaciones Push

| Herramienta | Versión | Propósito |
|---|---|---|
| **expo-notifications** | **55.0.10** | Push notifications locales y remotas |
| **expo-device** | **7.x** | Detectar si es dispositivo real (required para push) |
| **Firebase Cloud Messaging (FCM)** | — | Backend para entrega de notificaciones Android |

---

## Estado y Datos

| Herramienta | Versión | Propósito |
|---|---|---|
| **zustand** | **5.0.11** | Estado global cliente (sesión, preferencias, estado de crisis) |
| **@tanstack/react-query** | **5.90.x** | Estado del servidor (fetch, cache, sincronización) |
| **expo-secure-store** | **55.0.8** | Almacenamiento local encriptado (datos offline, tokens) |
| **@react-native-async-storage/async-storage** | **2.x** | Storage no sensitivo offline (scripts cacheados) |

---

## Formularios y Validación

| Herramienta | Versión | Propósito |
|---|---|---|
| **react-hook-form** | **7.55.x** | Manejo de formularios (AQ-10, cuestionario, scripts) |
| **@hookform/resolvers** | **5.2.2** | Integración con schema validators |
| **zod** | **4.3.6** | Validación de schemas |

> ⚠️ **Zod 4 — cambios de API:** Zod 4 tiene cambios importantes vs Zod 3. Usar siempre la sintaxis de Zod 4:

```typescript
// ✅ Correcto — Zod 4
import { z } from 'zod'
const schema = z.object({
  name: z.string().min(1),
  score: z.number().int().min(0).max(10),
})
// La inferencia de tipos funciona igual: z.infer<typeof schema>

// ❌ Zod 3 tenía z.string().nonempty() — en Zod 4 usar .min(1)
```

---

## Utilidades

| Herramienta | Versión | Propósito |
|---|---|---|
| **date-fns** | **4.1.0** | Manejo de fechas en historial y patrones |

---

## Build y Deploy

| Herramienta | Versión | Propósito |
|---|---|---|
| **EAS Build** | latest | Build de APK y IPA en la nube |
| **EAS Update** | latest | OTA updates sin pasar por la tienda |
| **Expo Go** | latest | Testing en dispositivo físico durante desarrollo |

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

**Comando de build APK:**
```bash
eas build --platform android --profile preview
```

---

## Variables de Entorno

Archivo: `.env.local` (nunca commitear — agregar a `.gitignore`)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Privy
EXPO_PUBLIC_PRIVY_APP_ID=[privy-app-id]

# OpenAI — SOLO en Supabase Edge Functions, NUNCA como EXPO_PUBLIC_
OPENAI_API_KEY=[openai-key]

# Telegram (semana 3+)
TELEGRAM_BOT_TOKEN=[bot-token]
```

> ⚠️ `OPENAI_API_KEY` NUNCA va como `EXPO_PUBLIC_`. Exponer esta key en el cliente compromete la seguridad y genera costos no controlados. Solo vive en Supabase Edge Functions.

---

## Comando de Instalación Completo (Semana 1)

```bash
# 1. Crear proyecto
npx create-expo-app@latest script-app --template tabs
cd script-app

# 2. Paquetes de Expo (usa npx expo install para compatibilidad garantizada)
npx expo install expo-router
npx expo install react-native-svg
npx expo install react-native-reanimated react-native-worklets
npx expo install expo-audio expo-haptics expo-location expo-sms
npx expo install expo-notifications expo-device
npx expo install expo-secure-store @react-native-async-storage/async-storage
npx expo install expo-font @expo-google-fonts/inter
# @expo/vector-icons ya viene incluido con Expo — no requiere instalación adicional
# expo-symbols fue eliminado (B-07): SF Symbols solo funciona en iOS/web

# 3. Paquetes npm (versiones fijas)
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

> ✅ Usar `npx expo install` (no `npm install`) para paquetes de Expo garantiza compatibilidad con el SDK instalado.

---

## Reglas de Código (Para AI Agents)

1. **TypeScript estricto siempre.** Sin `any`. Tipar todo.
2. **NativeWind para estilos.** No StyleSheet salvo animaciones/SVG.
3. **Supabase para toda la persistencia remota.** No fetch directo a APIs propias.
4. **OpenAI v6 API.** No usar sintaxis de versiones anteriores.
5. **Zod 4 API.** No usar `.nonempty()` ni otras APIs deprecadas de Zod 3.
6. **expo-audio, no expo-av.** expo-av está deprecated en Expo 55.
7. **react-native-worklets instalado** antes de react-native-reanimated.
8. **OpenAI solo en server-side** (Supabase Edge Functions). Nunca en el cliente.
9. **Zustand para estado global.** No prop drilling de más de 2 niveles.
10. **React Query para datos del servidor.** No useState para datos remotos.
11. **Expo Router para navegación.** No React Navigation directamente.
12. **Offline-first:** Toda escritura va a SecureStore primero, luego sincroniza.
13. **Sin console.log en producción.** Usar un logger wrapper.
14. **React 19 patterns.** No usar APIs deprecated de React 18.
