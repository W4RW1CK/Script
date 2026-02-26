# STATUS.md — Estado del Proyecto
## Script — Compañero Digital para Adultos con TEA Nivel 1

> **Cómo leer este archivo:**
> ✅ Completado | 🔄 En progreso | ⏳ Pendiente | ❌ Bloqueado

**Última actualización:** 2026-02-26  
**Semana actual:** 1  
**Entrega próxima:** Lunes (MVP)

---

## 📊 Progreso General

| Semana | Descripción | Estado | Completado |
|---|---|---|---|
| Pre-implementación | Documentación + audit de los 6 docs canónicos | ✅ | PR #3 listo para merge |
| Semana 1 | MVP: Setup + Check-in + Scripts + Rescate + Auth | ⏳ | 0 / 8 fases |
| Semana 2 | Historial + Diccionario + Personalización | ⏳ | — |
| Semana 3 | Red de Confianza + Notificaciones | ⏳ | — |
| Semana 4 | IA + Vista Terapeuta | ⏳ | — |
| Semana 5 | On-Chain + Polish + APK | ⏳ | — |

---

## 📁 Documentación (Pre-implementación)

| Doc | Versión | Estado | Cambios clave |
|---|---|---|---|
| `PRD.md` | v1.3 | ✅ | Tests movidos a Semana 1; offline clarificado; Settings timing corregido |
| `APP_FLOW.md` | v1.2 | ✅ | Screen IDs re-numerados S01–S24; Flujo 5 ("Completar mi perfil") agregado |
| `TECH_STACK.md` | v1.2 | ✅ | expo-symbols agregado; rutas actualizadas a S01–S24 |
| `FRONTEND_GUIDELINES.md` | v1.1 | ✅ | Tabla NativeWind tokens §1.3; template dark mode corregido |
| `BACKEND_STRUCTURE.md` | v1.2 | ✅ | RAADS-R domain counts corregidos; RLS policies completadas |
| `IMPLEMENTATION_PLAN.md` | v1.3 | ✅ | expo-symbols en install; supabase-js versión pinneada |

---

## 🗓️ Semana 1 — MVP

### Fase 1.1 — Setup del Proyecto
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.1.1 | Crear proyecto Expo 55 con template | ⏳ | |
| 1.1.2 | Limpiar template innecesario | ⏳ | |
| 1.1.3 | Instalar todas las dependencias (incl. expo-symbols) | ⏳ | |
| 1.1.4 | Configurar NativeWind (tailwind.config.js + babel.config.js) | ⏳ | |
| 1.1.5 | Configurar estructura de carpetas | ⏳ | |
| **Verificación** | `npx expo start` sin errores, Expo Go conecta | ⏳ | |

### Fase 1.2 — Configuración de Variables y Supabase
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.2.1 | Crear .env.local con variables | ⏳ | |
| 1.2.2 | Crear lib/supabase.ts | ⏳ | |
| 1.2.3 | Ejecutar SQL en Supabase (9 tablas) | ⏳ | |
| 1.2.4 | Activar auth por email en Supabase | ⏳ | |
| 1.2.5 | Ejecutar RLS policies | ⏳ | |
| 1.2.6 | Seed de 5 scripts predefinidos | ⏳ | |
| **Verificación** | `supabase.from('scripts').select('*')` retorna 5 scripts | ⏳ | |

### Fase 1.3 — Sistema de Temas y Componentes Base
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.3.1 | constants/colors.ts (tokens light + dark) | ⏳ | Ver FRONTEND_GUIDELINES §1 + §1.3 |
| 1.3.2 | constants/typography.ts | ⏳ | |
| 1.3.3 | constants/spacing.ts | ⏳ | |
| 1.3.4 | hooks/useTheme.ts | ⏳ | |
| 1.3.5a | components/ui/Button.tsx | ⏳ | |
| 1.3.5b | components/ui/Card.tsx | ⏳ | |
| 1.3.5c | components/ui/TextInput.tsx | ⏳ | |
| 1.3.5d | components/ui/Chip.tsx | ⏳ | |
| 1.3.5e | components/ui/Typography.tsx | ⏳ | |
| 1.3.6 | components/ui/SafeScreen.tsx | ⏳ | |
| **Verificación** | Componentes renderizados en claro y oscuro | ⏳ | |

### Fase 1.4 — Bottom Navigation y Layout
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.4.1 | app/(app)/_layout.tsx con Tab Navigator | ⏳ | |
| 1.4.2 | 5 tabs con íconos (expo-symbols) | ⏳ | |
| 1.4.3 | Botón de Rescate flotante (FAB) → /rescue/assess | ⏳ | |
| 1.4.4 | app/(app)/home.tsx (S09) básico | ⏳ | |
| **Verificación** | Navegación entre tabs + FAB navega a /rescue/assess | ⏳ | |

### Fase 1.5 — Check-in Corporal (Feature Core #1)
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.5.1 | components/body-map/BodyMap.tsx (SVG 6 zonas) | ⏳ | Ver FRONTEND_GUIDELINES §5 |
| 1.5.2 | app/(app)/checkin/body.tsx **(S10)** | ⏳ | |
| 1.5.3 | app/(app)/checkin/notes.tsx **(S11)** | ⏳ | |
| 1.5.4 | app/(app)/checkin/reflect.tsx **(S12)** | ⏳ | |
| 1.5.5 | app/(app)/checkin/result.tsx **(S13)** | ⏳ | |
| 1.5.6 | Supabase Edge Function: interpret-checkin | ⏳ | |
| **Verificación** | Check-in completo S10→S11→S12→S13, dato guardado en Supabase | ⏳ | |

### Fase 1.6 — Scripts Sociales (Feature Core #2)
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.6.1 | app/(app)/scripts/index.tsx **(S14)** | ⏳ | |
| 1.6.2 | app/(app)/scripts/[id].tsx **(S15)** — Modo Preparación | ⏳ | |
| 1.6.3 | app/(app)/scripts/[id]/execute.tsx **(S16)** — Modo Ejecución | ⏳ | |
| **Verificación** | 5 scripts navegables y ejecutables | ⏳ | |

### Fase 1.7 — Botón de Rescate (Feature Core #3)
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.7.1 | app/(app)/rescue/assess.tsx **(S17)** | ⏳ | Aplicar FRONTEND_GUIDELINES §11 |
| 1.7.2a | Protocolo Nivel 1: Grounding 5-4-3-2-1 | ⏳ | |
| 1.7.2b | Protocolo Nivel 2-3: BreathingGuide **(S18)** (SVG + haptic + audio) | ⏳ | expo-audio, NO expo-av |
| 1.7.2c | Nivel 3: Edge Function send-crisis-notification | ⏳ | |
| 1.7.2d | Opciones finales de resolución | ⏳ | |
| **Verificación** | Protocolo completo (1, 2, 3), notificación llega a dispositivo de prueba | ⏳ | |

### Fase 1.8 — Auth Básico + Onboarding Completo
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.8.1 | PrivyProvider en app/_layout.tsx | ⏳ | |
| 1.8.2 | app/auth.tsx **(S24)** (email + Google) | ⏳ | |
| 1.8.3 | Edge Function: sync-privy-user | ⏳ | |
| 1.8.4 | Redirect lógica post-auth | ⏳ | |
| 1.8.5 | app/(onboarding)/index.tsx **(S01 Welcome)** | ⏳ | Tagline + "Necesito ayuda ahora" → S17 |
| 1.8.6 | app/(onboarding)/aq10.tsx **(S02)** — 10 preguntas, 1 por pantalla | ⏳ | Preguntas de PRD Apéndice A |
| 1.8.7 | app/(onboarding)/aq10-result.tsx **(S03)** — Score + decisión | ⏳ | Sin palabras "positivo/negativo" |
| 1.8.8 | Componente reutilizable TestScreen | ⏳ | Props: questions[], scale, onComplete |
| 1.8.9 | app/(onboarding)/aq-full.tsx **(S04)** — AQ 50 preguntas | ⏳ | Preguntas de PRD Apéndice C |
| 1.8.10 | app/(onboarding)/catq.tsx **(S05)** — 25 preguntas, escala 1-7 | ⏳ | Preguntas de PRD Apéndice D |
| 1.8.11 | app/(onboarding)/raads.tsx **(S06)** — 80 preguntas, con pausa | ⏳ | Preguntas de PRD Apéndice E |
| 1.8.12 | lib/profile-seed.ts — sintetiza scores en perfil semilla | ⏳ | |
| 1.8.13 | app/(onboarding)/profile.tsx **(S07)** — Cuestionario personal | ⏳ | react-hook-form + zod |
| 1.8.14 | app/(onboarding)/contacts.tsx **(S08)** — Setup contactos | ⏳ | |
| **Verificación** | Flujo completo S01→S02→S03→S07→S08→S24→S09. Email login funciona. Profile en Supabase. | ⏳ | |

---

## 🗓️ Semana 2 — Historial, Diccionario y Personalización

| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 2.1 | Settings → "Completar mi perfil" (S04, S05, S06 desde Settings) | ⏳ | S04-S06 ya existen; agregar entry point |
| 2.2 | app/(app)/history.tsx **(S19)** | ⏳ | |
| 2.3 | app/(app)/dictionary.tsx **(S20)** | ⏳ | |
| 2.4 | app/(app)/settings/index.tsx **(S21)** — tema + paleta | ⏳ | |
| 2.5 | "Insights desbloqueados" (3, 7, 15 check-ins) | ⏳ | |

---

## 🐛 Bugs Conocidos

_Ninguno reportado aún._

| ID | Descripción | Severidad | Fase | Estado |
|---|---|---|---|---|
| — | — | — | — | — |

---

## 🔒 Decisiones Técnicas Tomadas

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-02-26 | Expo SDK 55 como base | Versión actual estable |
| 2026-02-26 | expo-audio en lugar de expo-av | expo-av deprecated en Expo 55 |
| 2026-02-26 | Zod 4.x | Versión actual, API compatible con hookform resolvers 5.x |
| 2026-02-26 | openai SDK v6 | Versión actual con API estable |
| 2026-02-26 | On-chain control de acceso en Semana 5 | Prioridad es MVP funcional primero |
| 2026-02-26 | SMS nativo como fallback offline en crisis | Funciona sin internet ni app del contacto |
| 2026-02-26 | Screen IDs S01–S24 (re-numerados) | Onboarding expandido con tests opcionales AQ/CAT-Q/RAADS-R |
| 2026-02-26 | Settings entry para tests en Semana 2 (no 1) | settings/index.tsx se construye en Fase 2.4 |

---

## 📝 Notas del Sprint

### Semana 1
_Agregar notas, blockers o decisiones aquí durante la semana._

---

## 🔄 Cómo Actualizar Este Archivo

- Al completar un paso: cambiar ⏳ → ✅ y agregar nota si aplica
- Al encontrar un bug: agregar a tabla de Bugs Conocidos
- Al tomar una decisión técnica: agregar a tabla de Decisiones
- Formato del commit al actualizar: `status: fase X.X completada`
