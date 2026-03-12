# TEAM.md — Script · División de tareas

> **w4rw1ck** — Product Owner: valida, prueba en dispositivo, aprueba fases  
> **Ana Banana 🍌** `<@1474788400220602538>` — Frontend/UI/UX  
> **Aibus** `<@1472026276998152272>` — Backend/Auth/Edge Functions/AI

---

## 🍌 Ana — Frontend, UI, Navegación

| Área | Qué hace |
|---|---|
| Pantallas de check-in | S10 Body Map, S11 Notas, S12 Reflect, S13 Result |
| Home S09 | Diseño, datos en vivo de Supabase |
| Historial S19 | Lista, filtros de emoción, pull-to-refresh |
| Ajustes S21 | Tests de perfil, apariencia/tema |
| Onboarding S01–S08 | Welcome, Consent, AQ-10, Profile, Contacts |
| Rescue S17–S18 | assess.tsx UI, protocol.tsx UI |
| Scripts S14–S16 | execute.tsx UI |
| Colores de emoción | `constants/colors.ts` — EmotionColors, EmotionColorsDark, getEmotionColors |
| Tipografía | Atkinson Hyperlegible, Typography.tsx, Button.tsx, Chip.tsx |
| Accesibilidad | useReduceMotion, contrast audit, focus rings (T-U*) |
| DB writes — frontend | `crisis_events` INSERT, `script_executions` INSERT |

### ⏳ Pendientes Ana (Week 2–4)
- `2.3` Dictionary S20
- `2.5` Unlocked insights (3 / 7 / 15 check-ins)
- `2.6` Script progress persistence (Zustand)
- `T-V9` Body map con colores de emoción histórica (Week 4)
- `T-4.1` Script fading mechanism (Week 4)

---

## 🤖 Aibus — Backend, Auth, Edge Functions

| Área | Qué hace |
|---|---|
| Autenticación | Privy ↔ Supabase session, `sync-privy-user` Edge Function |
| Edge Function AI | `interpret-checkin` (GPT-4o-mini), seguridad, rate limiting |
| T-V8 | Calendar Year in Pixels en S19 History |
| T-U8 | Focus rings audit en Card/Pressable |
| 2.7 | Persist test scores en Supabase inmediatamente |
| T-3.1 | Rate limiting por user_id en interpret-checkin |
| T-3.2 | AI output logging (ai_logs table) |
| Bug activo | Duplicate check-ins (double save) + AuthApiError en app open |

---

## 📋 Regla general

> **¿Es código de pantalla / componente / navegación / colores?** → Ana  
> **¿Es auth / base de datos / Edge Function / AI?** → Aibus  
> **¿Es un bug sin dueño claro?** → Menciona a ambos, decidimos

---

## 📊 Estado actual (2026-03-11)

| Semana | Estado |
|---|---|
| Week 1 — MVP | ✅ COMPLETO |
| Week 2 — History + Dictionary + Customization | 🔄 En progreso |
| Week 3 — Trust Network + Notifications | ⏳ |
| Week 4 — AI + Therapist View | ⏳ |
| Week 5 — EAS + APK final | ⏳ |

Ver `STATUS.md` para el detalle completo de cada ticket.
