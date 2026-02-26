# TECH_STACK.md — Stack Tecnológico
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.0  
**Última actualización:** 2026-02-25

> ⚠️ **Regla de oro:** No instales ningún paquete que no esté en este documento sin actualizar este archivo primero. La consistencia de versiones previene el 80% de los bugs de setup.

---

## Plataforma Base

| Herramienta | Versión | Propósito |
|---|---|---|
| **Expo SDK** | 52.x | Framework principal — web + Android desde un codebase |
| **React Native** | 0.76.x | (incluido en Expo 52) |
| **React** | 18.3.x | (incluido en Expo 52) |
| **TypeScript** | 5.3.x | Tipado estricto — obligatorio en todo el proyecto |
| **Node.js** | 20.x (LTS) | Runtime de desarrollo |

---

## Routing y Navegación

| Herramienta | Versión | Propósito |
|---|---|---|
| **Expo Router** | 4.x | Routing basado en archivos (como Next.js App Router) |

**Estructura de rutas:**
```
app/
├── (onboarding)/
│   ├── index.tsx          → S01 Welcome
│   ├── aq10.tsx           → S02 AQ-10 Test
│   ├── profile.tsx        → S03 Cuestionario Personal
│   └── contacts.tsx       → S04 Setup Contactos
├── (app)/
│   ├── _layout.tsx        → Layout con bottom navigation
│   ├── home.tsx           → S05 Home
│   ├── checkin/
│   │   ├── body.tsx       → S06 Mapa Corporal
│   │   ├── notes.tsx      → S07 Texto Libre
│   │   ├── reflect.tsx    → S08 Interpretación IA
│   │   └── result.tsx     → S09 Resultado
│   ├── scripts/
│   │   ├── index.tsx      → S10 Biblioteca
│   │   ├── [id].tsx       → S11 Script Detalle
│   │   └── [id]/execute.tsx → S12 Script Ejecución
│   ├── rescue/
│   │   ├── assess.tsx     → S13 Evaluación
│   │   └── protocol.tsx   → S14 Protocolo
│   ├── history.tsx        → S15 Historial
│   ├── dictionary.tsx     → S16 Diccionario Emocional
│   └── settings/
│       ├── index.tsx      → S17 Configuración
│       └── contacts.tsx   → S18 Gestión Contactos
├── therapist/
│   └── index.tsx          → S19 Vista Terapeuta
└── auth.tsx               → S20 Login/Auth
```

---

## Estilos y UI

| Herramienta | Versión | Propósito |
|---|---|---|
| **NativeWind** | 4.x | Tailwind CSS para React Native |
| **React Native SVG** | 15.x | Silueta corporal interactiva + círculo de respiración |
| **React Native Reanimated** | 3.x | Animaciones fluidas (círculo de respiración, transiciones) |
| **Expo Symbols** | latest | Iconos nativos SF Symbols (iOS) / Material (Android) |

> **Nota:** No usar StyleSheet de React Native puro. Todo styling va con NativeWind (clases Tailwind). Excepciones: SVG y animaciones complejas.

---

## Backend — Supabase

| Herramienta | Versión | Propósito |
|---|---|---|
| **@supabase/supabase-js** | 2.x | Cliente JS para todo: DB, auth, storage, realtime |
| **Supabase** (servicio) | — | Base de datos PostgreSQL + Auth + Storage + Edge Functions |

**Configuración:**
```typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

export const supabase = createClient(
  process.env.EXPO_PUBLIC_SUPABASE_URL!,
  process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!
)
```

---

## Autenticación y Wallet

| Herramienta | Versión | Propósito |
|---|---|---|
| **@privy-io/expo** | latest | Auth multi-método: email, Google, Apple, wallet embedded |
| **Privy** (servicio) | — | Gestión de sesiones + wallets custodiales |

**Métodos de login habilitados:**
1. Email (magic link)
2. Google OAuth
3. Wallet embedded (para on-chain en semana 4+)

---

## Inteligencia Artificial

| Herramienta | Versión | Propósito |
|---|---|---|
| **openai** | 4.x | SDK oficial OpenAI |
| **GPT-4o** | latest | Interpretación emocional + sugerencias de scripts |

**Uso de IA:**
- Interpretación del check-in corporal (zonas + texto → opciones de emoción)
- Detección de patrones en historial (semana 4+)
- Refinamiento de scripts personalizados (semana 4+)

**Prompting approach:**
- System prompt con contexto de TEA Nivel 1, perfil del usuario, y reglas de lenguaje de exploración
- Temperatura: 0.4 (consistente, no creativo)
- Respuestas siempre estructuradas (JSON): array de 3-5 opciones con label + descripción corta

---

## Notificaciones Push

| Herramienta | Versión | Propósito |
|---|---|---|
| **expo-notifications** | 0.29.x | Push notifications locales y remotas |
| **expo-device** | 6.x | Detectar si es dispositivo real (required para push) |
| **Firebase Cloud Messaging (FCM)** | — | Backend para entrega de notificaciones Android |

---

## Sensores y Hardware

| Herramienta | Versión | Propósito |
|---|---|---|
| **expo-haptics** | 14.x | Retroalimentación háptica en protocolo de respiración |
| **expo-av** | 15.x | Audio para tonos de guía en protocolo de respiración |
| **expo-location** | 18.x | Ubicación en alertas de crisis (con permiso explícito) |

---

## Estado y Datos

| Herramienta | Versión | Propósito |
|---|---|---|
| **zustand** | 5.x | Estado global cliente (sesión, preferencias, estado de crisis) |
| **@tanstack/react-query** | 5.x | Estado del servidor (fetch, cache, sincronización) |
| **expo-secure-store** | 14.x | Almacenamiento local encriptado (datos offline, tokens) |
| **@react-native-async-storage/async-storage** | 2.x | Storage no sensitivo offline (scripts cacheados) |

---

## Networking / Comunicación

| Herramienta | Versión | Propósito |
|---|---|---|
| **expo-sms** | 12.x | SMS nativo fallback para alertas offline |
| **node-telegram-bot-api** | 0.64.x | Bot de Telegram para personas de confianza (semana 3+) |

---

## Utilidades

| Herramienta | Versión | Propósito |
|---|---|---|
| **date-fns** | 3.x | Manejo de fechas en historial y patrones |
| **zod** | 3.x | Validación de schemas (forms, API responses) |
| **react-hook-form** | 7.x | Manejo de formularios (AQ-10, cuestionario, scripts) |

---

## Build y Deploy

| Herramienta | Versión | Propósito |
|---|---|---|
| **EAS Build** | latest | Build de APK y IPA en la nube |
| **EAS Update** | latest | OTA updates sin pasar por la tienda |
| **Expo Go** | latest | Testing en dispositivo físico durante desarrollo |

**Comando de build APK:**
```bash
eas build --platform android --profile preview
```

**`eas.json` configuración:**
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

---

## Variables de Entorno

Archivo: `.env.local` (nunca commitear al repo)

```bash
# Supabase
EXPO_PUBLIC_SUPABASE_URL=https://[proyecto].supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=[anon-key]

# Privy
EXPO_PUBLIC_PRIVY_APP_ID=[privy-app-id]

# OpenAI
OPENAI_API_KEY=[openai-key]  # Solo en edge functions, NUNCA en cliente

# Telegram (semana 3+)
TELEGRAM_BOT_TOKEN=[bot-token]

# Firebase (notificaciones)
EXPO_PUBLIC_FCM_SERVER_KEY=[fcm-key]
```

> ⚠️ `OPENAI_API_KEY` NUNCA va como `EXPO_PUBLIC_`. Solo se usa en Supabase Edge Functions (server-side).

---

## Inicialización del Proyecto

```bash
# Crear proyecto
npx create-expo-app@latest script-app --template tabs
cd script-app

# Instalar dependencias core
npx expo install expo-router react-native-svg react-native-reanimated
npx expo install @supabase/supabase-js @privy-io/expo
npx expo install expo-notifications expo-haptics expo-av expo-location expo-sms
npx expo install expo-secure-store @react-native-async-storage/async-storage

# Instalar dependencias JS
npm install zustand @tanstack/react-query
npm install date-fns zod react-hook-form
npm install nativewind tailwindcss

# Dev dependencies
npm install --save-dev @types/react @types/react-native
```

---

## Reglas de Código (Para AI Agents)

1. **TypeScript estricto siempre.** Sin `any`. Tipar todo.
2. **NativeWind para estilos.** No StyleSheet salvo animaciones/SVG.
3. **Supabase para toda la persistencia remota.** No fetch directo a APIs propias.
4. **OpenAI solo en server-side** (Supabase Edge Functions). Nunca llamar desde el cliente.
5. **Zustand para estado global.** No prop drilling de más de 2 niveles.
6. **React Query para datos del servidor.** No useState para datos remotos.
7. **Expo Router para navegación.** No React Navigation directamente.
8. **Zod para validar** toda data que entra al sistema (forms, API responses).
9. **Offline-first:** Toda escritura va a SecureStore/AsyncStorage primero, luego sincroniza.
10. **Sin console.log en producción.** Usar un logger wrapper.
