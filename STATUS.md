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
| Semana 1 | MVP: Setup + Check-in + Scripts + Rescate + Auth | ⏳ | 0 / 8 fases |
| Semana 2 | Historial + Diccionario + Personalización | ⏳ | — |
| Semana 3 | Red de Confianza + Notificaciones | ⏳ | — |
| Semana 4 | IA + Vista Terapeuta | ⏳ | — |
| Semana 5 | On-Chain + Polish + APK | ⏳ | — |

---

## 🗓️ Semana 1 — MVP

### Fase 1.1 — Setup del Proyecto
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.1.1 | Crear proyecto Expo 55 con template | ⏳ | |
| 1.1.2 | Limpiar template innecesario | ⏳ | |
| 1.1.3 | Instalar todas las dependencias | ⏳ | |
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
| 1.3.1 | constants/colors.ts | ⏳ | |
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
| 1.4.2 | 5 tabs con íconos correctos | ⏳ | |
| 1.4.3 | Botón de Rescate flotante (FAB) | ⏳ | |
| 1.4.4 | app/(app)/home.tsx básico | ⏳ | |
| **Verificación** | Navegación entre tabs + FAB navega a /rescue/assess | ⏳ | |

### Fase 1.5 — Check-in Corporal
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.5.1 | components/body-map/BodyMap.tsx (SVG 6 zonas) | ⏳ | |
| 1.5.2 | app/(app)/checkin/body.tsx (S06) | ⏳ | |
| 1.5.3 | app/(app)/checkin/notes.tsx (S07) | ⏳ | |
| 1.5.4 | app/(app)/checkin/reflect.tsx (S08) | ⏳ | |
| 1.5.5 | app/(app)/checkin/result.tsx (S09) | ⏳ | |
| 1.5.6 | Supabase Edge Function: interpret-checkin | ⏳ | |
| **Verificación** | Check-in completo, dato guardado en Supabase | ⏳ | |

### Fase 1.6 — Scripts Sociales
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.6.1 | app/(app)/scripts/index.tsx (S10) | ⏳ | |
| 1.6.2 | app/(app)/scripts/[id].tsx (S11) — Preparación | ⏳ | |
| 1.6.3 | app/(app)/scripts/[id]/execute.tsx (S12) — Ejecución | ⏳ | |
| **Verificación** | 5 scripts navegables y ejecutables | ⏳ | |

### Fase 1.7 — Botón de Rescate
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.7.1 | app/(app)/rescue/assess.tsx (S13) | ⏳ | |
| 1.7.2a | Protocolo Nivel 1: Grounding 5-4-3-2-1 | ⏳ | |
| 1.7.2b | Protocolo Nivel 2-3: BreathingGuide (SVG + haptic + audio) | ⏳ | |
| 1.7.2c | Nivel 3: Edge Function send-crisis-notification | ⏳ | |
| 1.7.2d | Opciones finales de resolución | ⏳ | |
| **Verificación** | Protocolo completo (1, 2, 3), notificación llega a dispositivo de prueba | ⏳ | |

### Fase 1.8 — Auth Básico
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.8.1 | PrivyProvider en app/_layout.tsx | ⏳ | |
| 1.8.2 | app/auth.tsx (email + Google) | ⏳ | |
| 1.8.3 | Edge Function: sync-privy-user | ⏳ | |
| 1.8.4 | Redirect lógica post-auth | ⏳ | |
| 1.8.5 | app/(onboarding)/index.tsx (S01 Welcome) | ⏳ | |
| **Verificación** | Login con email funciona, usuario en Supabase, redirect correcto | ⏳ | |

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
| 2026-02-26 | On-chain control de acceso en Semana 4+ | Prioridad es MVP funcional primero |
| 2026-02-26 | SMS nativo como fallback offline en crisis | Funciona sin internet ni app del contacto |

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
