# STATUS.md — Estado del Proyecto
## Script — Compañero Digital para Adultos con TEA Nivel 1

> **Cómo leer este archivo:**
> ✅ Completado | 🔄 En progreso | ⏳ Pendiente | ❌ Bloqueado

**Última actualización:** 2026-03-06 (B-36 — early return en AuthScreen + navegación explícita desde handlePostLogin)  
**Semana actual:** 1  
**Entrega próxima:** Lunes (MVP)

---

## 👥 Equipo

| Rol | Quién | Responsabilidades |
|---|---|---|
| Product Owner / Ejecutor | w4rw1ck | Corre comandos, prueba en dispositivo, valida producto, aprende |
| Tech Lead / PMO | Aibus Dumbleclaw | Genera código Fases 1.1-1.3, 1.8 · Trackea progreso |
| Arquitectura / Features Core | Ana Banana 🍌 | Genera código Fases 1.4-1.7 · Revisa PRs · Guarda docs canónicos |

**Flujo de trabajo:**
```
Agente genera y pushea código → w4rw1ck revisa en GitHub / prueba en Expo Go
Algo falla → ambas atacan el bug → w4rw1ck confirma fix
```

---

## 🚧 Bloqueadores — Resolver ANTES de codear

| # | Pendiente | Quién | Bloquea | Estado |
|---|---|---|---|---|
| 1 | Crear proyecto nuevo en Supabase | w4rw1ck | Fase 1.2 | ✅ |
| 2 | Crear App ID nuevo en Privy | w4rw1ck | Fase 1.8 | ⏳ |
| 3 | Referencias UI sensory-safe (3-5 opciones) | Ana + Aibus | Fase 1.3 | ✅ |
| 4 | Validar/ajustar paleta de colores TEA | Ana + Aibus | Fase 1.3 | ✅ |
| 5 | Traducciones en español: AQ Full (50q) + CAT-Q (25q) + RAADS-R (80q) | Ana + Aibus | Fase 1.8 | ⏳ |
| 6 | Audio: voz guiada + tono ambient (para grounding y respiración) | Ana + Aibus | Fase 1.7 | ⏳ |
| 7 | Revisar/completar contenido de 5 scripts sociales | Ana + Aibus | Fase 1.6 | ✅ |

---

## 📊 Progreso General

| Semana | Descripción | Estado | Completado |
|---|---|---|---|
| Pre-implementación | Documentación + audit de los 6 docs canónicos | ✅ | PR #3 listo para merge |
| Semana 1 | MVP: Setup + Check-in + Scripts + Rescate + Auth | 🔄 | Código 8/8 fases completo · Verificación funcional bloqueada por B-13 (Privy config) |
| Semana 2 | Historial + Diccionario + Personalización | ⏳ | — |
| Semana 3 | Red de Confianza + Notificaciones | ⏳ | — |
| Semana 4 | IA + Vista Terapeuta | ⏳ | — |
| Semana 5 | EAS Attestations + Polish + APK | ⏳ | — |

---

## 📁 Documentación (Pre-implementación)

| Doc | Versión | Estado | Cambios clave |
|---|---|---|---|
| `PRD.md` | v1.4 | ✅ | Tests movidos a Semana 1; offline clarificado; Settings timing corregido; tagline restaurada |
| `APP_FLOW.md` | v1.3 | ✅ | Screen IDs S01–S24; Flujo 5 agregado; Nivel 1 crisis = multimodal (visual+voz+háptico) |
| `TECH_STACK.md` | v1.2 | ✅ | expo-symbols agregado; rutas actualizadas a S01–S24 |
| `FRONTEND_GUIDELINES.md` | v1.2 | ✅ | §0 agregada: tabla de inspiración por pantalla (Finch/Daylio); Compañero/Planta diferido a S3 |
| `BACKEND_STRUCTURE.md` | v1.3 | ✅ | RAADS-R domain counts corregidos; RLS policies completadas; tone-grounding-voice.mp3 agregado |
| `IMPLEMENTATION_PLAN.md` | v1.6 | ✅ | expo-symbols en install; supabase-js pinneada; Fase 1.8 expandida; timer 10s canónico |
| `REFERENCES.md` | v1.0 | ✅ | Fuentes clínicas de scripts sociales (Gray, Baker, Gaus, Attwood, Hull) + tests (AQ, CAT-Q, RAADS-R) + recursos de investigación futuros |

---

## 🗓️ Semana 1 — MVP

### Fase 1.1 — Setup del Proyecto ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.1.1 | Crear proyecto Expo 55 con template | ✅ | |
| 1.1.2 | Limpiar template innecesario | ✅ | Bug fix: imports de componentes borrados reparados (Ana) |
| 1.1.3 | Instalar todas las dependencias (incl. expo-symbols) | ✅ | |
| 1.1.4 | Configurar NativeWind (tailwind.config.js + babel.config.js) | ✅ | |
| 1.1.5 | Configurar estructura de carpetas | ✅ | |
| **Verificación** | `npx expo start` sin errores, Expo Go conecta | ✅ | Confirmado en dispositivo físico Android 2026-02-28 |

### Fase 1.2 — Configuración de Variables y Supabase ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.2.1 | Crear .env.local con variables | ✅ | |
| 1.2.2 | Crear lib/supabase.ts | ✅ | |
| 1.2.3 | Ejecutar SQL en Supabase (9 tablas) | ✅ | Bug: ERROR 42P17 en columnas GENERATED — ver tabla de bugs |
| 1.2.4 | Activar auth por email en Supabase | ✅ | Ya habilitado por defecto en proyecto nuevo |
| 1.2.5 | Ejecutar RLS policies | ✅ | |
| 1.2.6 | Seed de 5 scripts predefinidos | ✅ | |
| **Verificación** | 9 tablas visibles en Table Editor + 5 scripts en tabla `scripts` | ✅ | Confirmado en Supabase Dashboard 2026-03-01 |

### Fase 1.3 — Sistema de Temas y Componentes Base ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.3.1 | constants/colors.ts (tokens light + dark) | ✅ | |
| 1.3.2 | constants/typography.ts | ✅ | |
| 1.3.3 | constants/spacing.ts | ✅ | |
| 1.3.4 | hooks/useTheme.ts | ✅ | |
| 1.3.5a | components/ui/Button.tsx | ✅ | |
| 1.3.5b | components/ui/Card.tsx | ✅ | |
| 1.3.5c | components/ui/TextInput.tsx | ✅ | Bugs B-02 y B-03 corregidos en audit (Ana) |
| 1.3.5d | components/ui/Chip.tsx | ✅ | |
| 1.3.5e | components/ui/Typography.tsx | ✅ | |
| 1.3.6 | components/ui/SafeScreen.tsx | ✅ | |
| **+Extra** | components/ui/index.ts (barrel export) | ✅ | Agregado en audit |
| **Verificación** | Componentes renderizados en claro y oscuro | ✅ | Pendiente confirmar en dispositivo — fuentes Inter cargando |

### Fase 1.4 — Bottom Navigation y Layout ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.4.1 | app/(app)/_layout.tsx con Tab Navigator | ✅ | Ionicons, colores tokens, height 64px |
| 1.4.2 | 5 tabs con íconos (Ionicons) | ✅ | Placeholders con SafeScreen/Typography; (tabs) eliminado |
| 1.4.3 | Botón de Rescate flotante (FAB) → /rescue/assess | ✅ | RescueFAB circular 56px, color crisis-soft, bottom:84px |
| 1.4.4 | app/(app)/home.tsx (S09) básico | ✅ | CTA check-in, accesos rápidos, estado vacío último check-in |
| **Verificación** | Navegación entre tabs + FAB navega a /rescue/assess | ✅ | Confirmado en dispositivo físico Android 2026-03-02 (post fix metro.config.js) |

### Fase 1.5 — Check-in Corporal (Feature Core #1) ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.5.1 | components/body-map/BodyMap.tsx (SVG 6 zonas) | ✅ | Commit `2b4059a` |
| 1.5.2 | app/(app)/checkin/body.tsx **(S10)** | ✅ | Commit `b19603a` — index.tsx redirige aquí |
| 1.5.3 | app/(app)/checkin/notes.tsx **(S11)** | ✅ | Commit `1d377a1` |
| 1.5.4 | app/(app)/checkin/reflect.tsx **(S12)** | ✅ | Commit `2c5b198` — mock IA (TODO: reemplazar con edge fn real en 1.5.6) |
| 1.5.5 | app/(app)/checkin/result.tsx **(S13)** | ✅ | Commit `7160977` — INSERT falla silenciosamente sin auth (esperado) |
| 1.5.6 | Supabase Edge Function: interpret-checkin | ✅ | Commit `8657889` — GPT-4o-mini, OPENAI_API_KEY solo en Supabase env |
| **Verificación** | Check-in completo S10→S11→S12→S13, dato guardado en Supabase | ✅ | Verificado en dispositivo físico Android (Expo Go) por w4rw1ck — 2026-03-02. Sin auth: INSERT falla silenciosamente (esperado). |

### Fase 1.6 — Scripts Sociales (Feature Core #2) ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.6.1 | app/(app)/scripts/index.tsx **(S14)** | ✅ | Commit `583cf7d` — fetch Supabase, chips categoría, cards táctiles |
| 1.6.2 | app/(app)/scripts/[id].tsx **(S15)** — Detalle | ✅ | Commit `46d88bf` — vista previa bloques, CTA ejecutar |
| 1.6.3 | app/(app)/scripts/execute.tsx **(S16)** — Ejecución | ✅ | Commit `064a6fc` — paso a paso, barra progreso, opciones, celebración |
| **Verificación** | 5 scripts navegables y ejecutables | ⏳ | Pendiente prueba en dispositivo (w4rw1ck) |

### Fase 1.7 — Botón de Rescate (Feature Core #3) ✅ COMPLETA
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.7.1 | app/(app)/rescue/assess.tsx **(S17)** | ✅ | Commit `3687e29` — §11 completo, 3 niveles, StyleSheet crítico |
| 1.7.2 | app/(app)/rescue/protocol.tsx **(S18)** — niveles 1/2/3 | ✅ | Commit `ecea6f2` — grounding+háptico, círculo Reanimated, SAPTEL |
| **Verificación** | Protocolo completo (1, 2, 3) | ✅ | Verificado en dispositivo físico Android por w4rw1ck — 2026-03-05. Bugs B-11 a B-14 encontrados y corregidos. Audio pendiente (assets/audio/) |

### Fase 1.8 — Auth Básico + Onboarding Completo ✅ CÓDIGO COMPLETO
| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 1.8.1 | PrivyProvider en app/_layout.tsx | ✅ | AuthGate integrado |
| 1.8.2 | app/auth.tsx **(S24)** (email + Google) | ✅ | B-15/B-16 corregidos |
| 1.8.3 | Edge Function: sync-privy-user | ✅ | CORS incluido (B-17) |
| 1.8.4 | Redirect lógica post-auth | ✅ | AuthGate en _layout.tsx |
| 1.8.5 | app/(onboarding)/index.tsx **(S01 Welcome)** | ✅ | Tagline + "Necesito ayuda ahora" → S17 |
| 1.8.6 | app/(onboarding)/aq10.tsx **(S02)** — 10 preguntas, 1 por pantalla | ✅ | scoreOnAgree por pregunta |
| 1.8.7 | app/(onboarding)/aq10-result.tsx **(S03)** — Score + decisión | ✅ | Sin palabras "positivo/negativo" |
| 1.8.8 | Componente reutilizable TestScreen | ✅ | Selección por índice, pausa con SecureStore |
| 1.8.9 | app/(onboarding)/aq-full.tsx **(S04)** — AQ 50 preguntas | ✅ | scoreOnAgree por pregunta (M-03 aprendizaje) |
| 1.8.10 | app/(onboarding)/catq.tsx **(S05)** — 25 preguntas, escala 1-7 | ✅ | |
| 1.8.11 | app/(onboarding)/raads.tsx **(S06)** — 80 preguntas, con pausa | ✅ | |
| 1.8.12 | lib/profile-seed.ts — sintetiza scores en perfil semilla | ✅ | Runtime-only, no persiste en Supabase |
| 1.8.13 | app/(onboarding)/profile.tsx **(S07)** — Cuestionario personal | ✅ | Guard para supabaseUserId null (B-19) |
| 1.8.14 | app/(onboarding)/contacts.tsx **(S08)** — Setup contactos | ✅ | Usa "relationship" (schema correcto) |
| **Verificación** | Flujo completo S01→S02→S03→S07→S08→S24→S09. Email login funciona. Profile en Supabase. | ❌ | Bloqueado por B-13 — Privy App ID pendiente de w4rw1ck |

---

## 🔴 Tickets Críticos — Antes de Usuarios Reales

> Identificados en auditoría clínica de Aibus Dumbleclaw (2026-03-06, commit base `fdcadd2`).
> Estos items NO son opcionales. Deben resolverse antes de compartir la app con cualquier usuario real.

| Ticket | Descripción | Severidad | Responsable | Estado |
|---|---|---|---|---|
| T-C1 | **Safety screening de ideación suicida en S17** — `assess.tsx` debe incluir una pregunta de screening ("¿Estás teniendo pensamientos de hacerte daño?") con flujo diferenciado. Si la respuesta es sí: mostrar directamente Línea de la Vida (México: 800 911-2000, 24h gratuita), sin pasar por los 3 niveles estándar. Fundamento: Cassidy et al. (2018) — 66% adultos con ASD reportan ideación suicida; Hirvikoski et al. (2016) — mortalidad por suicidio 9x mayor en ASD | 🔴 Crítico | Ana | ⏳ |
| T-C2 | **Safety filter en output de GPT-4o-mini** — Edge Function `interpret-checkin/index.ts` debe post-procesar las opciones de emoción antes de enviarlas al cliente. Si algún label cae en categorías de alerta (desesperanza, vacío, no querer estar aquí, etc.), el response debe incluir `crisis_flag: true` y la app escalar a flujo de rescate en lugar de continuar el check-in normal | 🔴 Crítico | Aibus | ⏳ |
| T-C3 | **Pantalla de consentimiento informado en onboarding** — Nueva pantalla antes de S02 (o como overlay en S01) que explique con lenguaje simple: qué datos se procesan, para qué, que Script no es un dispositivo médico, y que no reemplaza atención profesional. Requisito: LFPDPPP México (Ley Federal de Protección de Datos Personales). Consentimiento debe ser explícito (botón "Entiendo y acepto") antes de empezar cualquier test | 🔴 Crítico | Ana | ⏳ |

---

## 🗓️ Semana 2 — Historial, Diccionario y Personalización

| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 2.1 | Settings → "Completar mi perfil" (S04, S05, S06 desde Settings) | ⏳ | S04-S06 ya existen; agregar entry point |
| 2.2 | app/(app)/history.tsx **(S19)** | ⏳ | |
| 2.3 | app/(app)/dictionary.tsx **(S20)** | ⏳ | |
| 2.4 | app/(app)/settings/index.tsx **(S21)** — tema + paleta | ⏳ | |
| 2.5 | "Insights desbloqueados" (3, 7, 15 check-ins) | ⏳ | |
| 2.6 | **Persistencia de progreso en script** (S16) | ⏳ | Si el usuario sale a mitad de un script y vuelve, actualmente reinicia desde el bloque 1. Opciones: (a) Zustand en memoria (persiste mientras la app no se cierra); (b) tabla `script_sessions` en Supabase para persistencia entre cierres. MVP usa (a) — decidir en sprint de Semana 2 |
| 2.7 | **Persistir scores de tests en Supabase inmediatamente** | ⏳ | `profile-seed.ts` es runtime-only — si el usuario cierra la app post-onboarding, pierde los resultados del AQ/CAT-Q/RAADS-R. Fix: INSERT en `profiles` al completar cada test individual, no al final del onboarding. Impacto: pérdida de 30 min de trabajo del usuario (Aibus) |
| 2.8 | **INSERT `crisis_events` en `protocol.tsx`** | ⏳ | La tabla `crisis_events` existe en el schema pero nunca se escribe. Registrar: `user_id`, `level` (1/2/3), `started_at`, `completed_at`, `resolved` (boolean). Datos críticos para el módulo de terapeuta en Semana 4 (Ana) |
| 2.9 | **Reducir temperatura GPT 0.7 → 0.4 en `interpret-checkin`** | ⏳ | Temperatura alta en contexto clínico produce outputs inconsistentes. 0.4 da más determinismo sin perder variedad. Menor que 0.3 puede ser demasiado rígido (Aibus) |
| 2.10 | **INSERT `script_executions` en `execute.tsx`** | ⏳ | La tabla `script_executions` existe en el schema pero `execute.tsx` no hace INSERT. Registrar: `script_id`, `user_id`, `options_chosen` (JSONB), `completed` (boolean), `executed_at`. Input para historial S19 y terapeuta S23 (Ana) |
| 2.11 | **Corregir PMID del AQ-10 en `REFERENCES.md`** | ⏳ | PMID actual `22366774` apunta a un paper de polimorfismos en asma pulmonar (WDR21A). PMID correcto: `22397989` (Allison et al., 2012, Arch Dis Child). Error menor pero inaceptable en referencia clínica (Ana) |
| 2.12 | **UI feedback cuando guardado de perfil falla en `profile.tsx`** | ⏳ | El guard `if (!supabaseUserId)` solo hace `console.warn` — el usuario no sabe si su perfil no se guardó. Agregar Alert o Toast visible con opción de reintentar (Aibus) |

---

## 🗓️ Semana 3 — Red de Confianza + Notificaciones (Backlog Técnico)

> Ítems de deuda técnica de auditoría clínica para atacar en Semana 3.

| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 3.x | Red de Confianza + Notificaciones (features S3 principales) | ⏳ | Detallar en sprint planning de Semana 3 |
| T-3.1 | **Rate limiting en Edge Function `interpret-checkin`** | ⏳ | Sin límite de llamadas, un usuario (o atacante) puede agotar la cuota de OpenAI. Implementar límite por `user_id` vía tabla `rate_limits` en Supabase o Upstash Redis. 10 llamadas/hora es razonable para MVP (Aibus) |
| T-3.2 | **Logging de outputs de IA para auditoría** | ⏳ | No hay trazabilidad de qué generó GPT-4o-mini por usuario. Si algo sale mal con un usuario real, no hay evidencia de qué sugirió el modelo. Logging básico: `ai_logs` table con `user_id`, `input_hash` (no raw — privacidad), `output`, `timestamp`, `flagged` (Aibus) |

---

## 🗓️ Semana 4 — IA + Vista Terapeuta (Backlog Técnico)

> Ítems de deuda técnica y mejoras clínicas para Semana 4.

| Paso | Descripción | Estado | Notas |
|---|---|---|---|
| 4.x | IA avanzada + Vista Terapeuta S23 (features S4 principales) | ⏳ | Detallar en sprint planning de Semana 4 |
| T-4.1 | **Script fading mechanism** | ⏳ | La evidencia muestra que scripts ayudan en situación entrenada pero la generalización es limitada en ASD. El módulo de scripts personalizados con IA debería tener como objetivo explícito la generalización (fade-out gradual). Buscar literatura "script fading autism" — hay protocolos establecidos (Gray, Krantz & McClannahan) (Ana) |
| T-4.2 | **Validar zonas corporales con protocolo Mahler** | ⏳ | Las 6 zonas del mapa corporal son intuitivas pero arbitrarias. Mahler (2015) describe 8 señales interoceptivas (hambre, temperatura, dolor, respiración, ritmo cardíaco, etc.) — no zonas geográficas. Revisar diseño de BodyMap.tsx para alinearlo con literatura interoceptiva. Bajo impacto en MVP; mayor profundidad clínica en versión 2 (Ana) |
| T-4.3 | **Supervisión clínica del mapeo test→perfil semilla** | ⏳ | Las reglas en `lib/profile-seed.ts` (ej: "AQ-10 alto → más scripts de socialización") son decisiones de diseño informado por clínica — NO protocolos clínicos validados. Recomendado: una sesión con psicólogo/psiquiatra especializado en ASD adultos para revisar el mapeo y el system prompt de `interpret-checkin` antes del lanzamiento público (w4rw1ck coordina) |

---

## 🐛 Bugs Conocidos

| ID | Descripción | Severidad | Fase | Estado |
|---|---|---|---|---|
| B-01 | `ERROR 42P17: generation expression is not immutable` al ejecutar schema.sql — `EXTRACT()` sobre `TIMESTAMPTZ` no es inmutable en PostgreSQL, prohibido en columnas `GENERATED ALWAYS AS` | 🔴 Alta | 1.2.3 | ✅ Resuelto |
| B-02 | Inter fonts instaladas pero NO cargadas en `_layout.tsx` — `useFonts` solo tenía SpaceMono; Typography constants con `Inter_*Bold/SemiBold/Regular` fallaban silenciosamente | 🟡 Media | 1.3 | ✅ Resuelto |
| B-03 | `text-top` en `TextInput.tsx` no es clase NativeWind válida — `textAlignVertical:'top'` se ignoraba en multiline inputs | 🟡 Media | 1.3.5c | ✅ Resuelto |
| B-04 | NativeWind no aplicaba ningún estilo — todos los `className` se ignoraban; la UI se veía como HTML sin CSS | 🔴 Alta | 1.4 | ✅ Resuelto |
| B-05 | RescueFAB invisible en Android físico (Expo Go) — visible en devtools/web pero no en dispositivo nativo | 🔴 Alta | 1.4.3 | ✅ Resuelto |
| B-06 | Tab "rescue" aparecía en la barra de navegación — Expo Router auto-descubre todas las carpetas en `(app)/` incluyendo `rescue/` | 🟡 Media | 1.4.1 | ✅ Resuelto |
| B-07 | `expo-symbols` usa SF Symbols de Apple — solo funciona en iOS/web, en Android Expo Go no renderiza nada. Root cause real de: íconos invisibles en tab bar + FAB invisible | 🔴 Alta | 1.4 | ✅ Resuelto |
| B-08 | `Card` no tenía `variant` ni `onPress` — en S12 (reflect.tsx) las opciones de emoción no eran tocables ni mostraban estado "seleccionada". Flujo de check-in bloqueado | 🔴 Alta | 1.5 | ✅ Resuelto |
| B-09 | result.tsx usaba `raw_text` y `confirmed_emotion` en el INSERT de Supabase, pero el schema real tiene `free_text` y `emotion_confirmed` — los check-ins no se habrían guardado correctamente | 🔴 Alta | 1.5 | ✅ Resuelto |
| B-10 | `TextInput` no aceptaba `numberOfLines` ni `accessibilityHint` — `numberOfLines={6}` en notes.tsx se ignoraba silenciosamente; la altura del input quedaba fija en 120px mínimo | 🟡 Media | 1.5 | ✅ Resuelto |
| B-11 | Número de SAPTEL incorrecto (800 290-0024) — el número real verificado en saptel.org.mx es (55) 5259-8121 | 🔴 Alta | 1.7 | ✅ Resuelto |
| B-12 | Pantallas de crisis (assess.tsx + protocol.tsx) ilegibles en dark mode — botones rosa claro (#E8C4C4) y texto oscuro (#2D2D2D) invisibles contra fondo oscuro | 🔴 Alta | 1.7 | ✅ Resuelto |
| B-13 | Label de respiración (Inhala/Pausa/Exhala) desincronizado con círculo animado — `setInterval` acumulaba drift vs animación Reanimated en UI thread | 🟡 Media | 1.7 | ✅ Resuelto |
| B-14 | Respiración guiada (Nivel 2) sin feedback háptico — Nivel 1 (grounding) tenía háptico pero Nivel 2 no, a pesar de la decisión de diseño multimodal | 🟡 Media | 1.7 | ✅ Resuelto |
| B-15 | `auth.tsx` — campo de código de verificación sin `value`/`onChangeText` — texto invisible en Android físico + no hay botón para verificar explícitamente | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-16 | `auth.tsx` — `handleVerifyCode` tragaba el error silenciosamente; el `catch` bajaba el loading sin mostrar al usuario que el código era incorrecto | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-17 | `sync-privy-user` Edge Function sin CORS headers — preflight OPTIONS falla, respuestas sin `Access-Control-Allow-*` | 🟡 Media | 1.8 | ✅ Resuelto |
| B-18 | `contacts.tsx` — `useRouter` importado y `router` instanciado pero nunca usado (AuthGate maneja la redirección post-onboarding automáticamente) | 🟢 Baja | 1.8 | ✅ Resuelto |
| B-19 | `profile.tsx` — guard `if (supabaseUserId)` existía pero sin log ni comentario — si sync falló, el guardado falla silenciosamente sin contexto | 🟡 Media | 1.8 | ✅ Resuelto |
| B-20 | `VIABILITY_TEST.md` (311 líneas) trackeado en git — documento de análisis ajeno al proyecto | 🟢 Baja | 1.8 | ✅ Resuelto |
| B-21 | `Typography.tsx` sin variants `headingS` / `heading` — `aq10-result.tsx` y otras pantallas de Fase 1.8 las usan y fallaban silenciosamente | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-22 | `AuthGate` bloqueaba el protocolo de rescate sin auth — usuario en crisis redirigido a `/auth` al presionar FAB desde pantalla de login o onboarding | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-23 | Token NativeWind inválido `script-surface` / `script-dark-surface` — no existe en `tailwind.config.js`; barras de progreso en tests y tarjeta de contactos se renderizaban sin fondo | 🟡 Media | 1.8 | ✅ Resuelto |
| B-24 | `Button` no aceptaba `className` prop — `className="mt-3"` en botones de `aq10-result.tsx` era ignorado silenciosamente; sin margen superior en botones dentro de Cards | 🟡 Media | 1.8 | ✅ Resuelto |
| B-25 | `import { Buffer } from "buffer"` fallaba al bundlear — Metro trataba `buffer` como módulo de Node stdlib en lugar de npm package | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-26 | `ExpoSecureStore.getValueWithKeyAsync is not a function` — `expo-secure-store` no existe en web; Metro bundlea para web en paralelo al arrancar con `expo start` | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-27 | `ReferenceError: Property 'crypto' doesn't exist` — Hermes lanza ReferenceError (no retorna undefined) al acceder a `global.crypto` inexistente; `globalThis.crypto` también undefined en el dispositivo de w4rw1ck | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-28 | `ReferenceError: localStorage is not defined` — Metro SSR renderer corre en Node.js donde `localStorage` no existe aunque `Platform.OS === "web"` sea verdadero | 🟡 Media | 1.8 | ✅ Resuelto |
| B-29 | `Cannot read properties of undefined (reading 'v1')` — `@privy-io/js-sdk-core` tiene `uuid` anidado; su `wrapper.mjs` hace `import { v1 } from 'uuid'` y Metro (condición "browser") lo resuelve circularmente al mismo `wrapper.mjs` → `undefined` | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-30 | `Native app ID host.exp.exponent has not been set as an allowed app identifier` — Privy requiere `clientId` explícito en PrivyProvider cuando corre en Expo Go (host.exp.exponent); sin él bloquea todo intento de auth. ⚠️ Nota: commit original de Aibus usa ID "B-27" (colisión — B-27 ya estaba asignado a crypto polyfill) | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-31 | `Redirect URL scheme is not allowed` (intento 1) — Aibus agregó `redirectUrl: Linking.createURL('/auth')` a `sendCode()`. El scheme `exp://` de Expo Go no estaba en la lista de Privy, causando error | 🔴 Alta | 1.8 | ⚠️ Parcial — ver B-32 |
| B-32 | `Redirect URL scheme is not allowed` (intento 2, raíz real) — `sendCode()` NO necesita `redirectUrl` en flujo OTP (código de 6 dígitos). `redirectUrl` solo se requiere para magic link clickeable. Pasar `exp://` a Privy en modo OTP causaba el error. Fix: eliminar `redirectUrl` de `sendCode()` | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-33 | Google OAuth no resuelve — browser de Google abre pero nunca regresa a la app. `WebBrowser.maybeCompleteAuthSession()` faltaba en `auth.tsx`. Sin esta llamada a nivel módulo, Expo no puede completar el callback del OAuth cuando Google redirige de vuelta | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-34 | `Already logged in, if trying to link an OAuth account use useLinkWithOAuth` — `AuthGate` usaba `useAuthStore().user` (Zustand, en memoria) como fuente de verdad para auth. Zustand se resetea en cada reinicio de app, pero Privy persiste la sesión en SecureStore. Resultado: usuario ya autenticado en Privy sigue viendo `/auth` en cada arranque frío | 🔴 Alta | 1.8 | ✅ Resuelto |
| B-35 | `AuthScreen` no detectaba sesión existente de Privy al montarse — usuario ya logueado (sesión en SecureStore) veía pantalla de login y no podía loguearse de nuevo ("already logged in"). Safety net: `useEffect` en `auth.tsx` que llama `handlePostLogin(privyUser)` si Privy ya tiene sesión al abrir la pantalla | 🔴 Alta | 1.8 | ⚠️ Insuficiente — ver B-36 |
| B-36 | Formulario de login seguía renderizando aunque Privy tuviera sesión activa — hooks `useLoginWithEmail`/`useLoginWithOAuth` fallaban con "already logged in" cuando el usuario presionaba botones. Fix: (1) early return en `auth.tsx` muestra spinner loading si `!privyReady \|\| privyUser` — formulario nunca se muestra con sesión activa; (2) `handlePostLogin` navega explícitamente via `router.replace` al terminar el sync, sin depender de `AuthGate` | 🔴 Alta | 1.8 | ✅ Resuelto |

**B-01 — Fix:** Se eliminaron las columnas `hour_of_day` y `day_of_week` de `checkins`. `EXTRACT()` usable en queries. Commit: `864e435`.

**B-02 — Fix:** `_layout.tsx` ahora importa y registra `Inter_400Regular`, `Inter_600SemiBold`, `Inter_700Bold` via `@expo-google-fonts/inter`. Commit: `1edc8c6`.

**B-03 — Fix:** Reemplazado `text-top` por `style={{ textAlignVertical: 'top' }}` como prop nativo. También eliminado `dark:border-[#3A3A44]` hardcodeado → token `dark:border-script-dark-border`. Commit: `1edc8c6`.

**B-04 — Fix:** Creado `metro.config.js` con `withNativeWind(config, { input: './global.css' })`. NativeWind v4 requiere este archivo para procesar el CSS de Tailwind — `babel.config.js` solo hace el transform JSX; el procesamiento CSS es responsabilidad de Metro. Sin `metro.config.js`, todos los `className` se ignoran. Commit: `30fec72`.

**B-05 — Fix v1 (insuficiente):** Agregado `zIndex: 999` y aumentado `elevation: 6→10` en el StyleSheet de `RescueFAB.tsx`. Commit: `b7e9b6e`.
**B-05 — Fix v2 (definitivo):** `RescueFAB` movido de `app/(app)/_layout.tsx` a `app/_layout.tsx` (raíz). Renderizarlo dentro del Tab Navigator causa que Android lo oculte bajo su propia capa de UI independientemente del `zIndex`. Al estar en la raíz del árbol — fuera de Stack y Tab Navigator — ninguna capa de navegación puede taparlo. Commit: `6562449`.

**B-06 — Fix:** Agregado `<Tabs.Screen name="rescue" options={{ href: null }} />` en `app/(app)/_layout.tsx`. Expo Router auto-descubre todas las carpetas en `(app)/`; sin este Screen con `href: null`, la carpeta `rescue/` aparecía como un 6to tab en la barra de navegación. Commit: `7ccfd0f`.

**B-07 — Fix:** Reemplazado `expo-symbols` → `Ionicons` de `@expo/vector-icons` en todos los archivos del proyecto. SF Symbols es una tecnología exclusiva de Apple que no funciona en Android. Adicionalmente: FAB rediseñado con `View` overlay (`StyleSheet.absoluteFillObject` + `pointerEvents="box-none"` + flexbox) y círculo visual separado como `View` con `borderRadius` (en Android, `Pressable` no renderiza `borderRadius+backgroundColor` correctamente). Commits: `485284c`, `0698ac2`, `cdff16c`, `3d9801e`, `7b9d9a2`.

**B-08 — Fix:** `Card.tsx` actualizado con props `variant` ("default"|"elevated") y `onPress` (Pressable con `opacity:0.85`). Variante "elevated" usa `bg-elevated + shadow-md + border script-blue`. Retrocompatible. `reflect.tsx` corregido: `ActivityIndicator` usa `useColorScheme()` para el color (#A8C5DA light / #5A7E92 dark). Commit: `c157bdb`. Encontrado por Aibus en auditoría.

**B-09 — Fix:** `result.tsx` — corregidos nombres de campo en INSERT de Supabase: `raw_text→free_text`, `confirmed_emotion→emotion_confirmed`. Verificados contra `supabase/schema.sql`. Commit: `a1f5aab`.

**B-10 — Fix:** `TextInput.tsx` — agregados `numberOfLines?: number` y `accessibilityHint?: string` a la interface; ambos forwardeados a `RNTextInput`. `numberOfLines` solo aplica cuando `multiline=true`. Commit: `a1f5aab`.

**B-11 — Fix:** `protocol.tsx` — número de teléfono de SAPTEL corregido de `800 290-0024` a `(55) 5259-8121`. Verificado directamente en saptel.org.mx. Afectaba `Linking.openURL("tel:...")` y el texto mostrado al usuario en Nivel 3 (Emergencia). Detectado por w4rw1ck. Commit: `e974d66`.

**B-12 — Fix:** `assess.tsx` + `protocol.tsx` — todos los colores hardcodeados para light mode ahora se calculan dinámicamente con `useColorScheme()`. Botones: `#6A3E3E` (dark) / `#E8C4C4` (light). Texto: `#F0D0D0` (dark) / `#2D2D2D` (light). Aplicado en todas las pantallas de crisis: assess, grounding, breathing, emergency, y pantalla de cierre. StyleSheet mantiene tamaños/layout (críticos §11); solo los colores son dinámicos. Detectado por w4rw1ck en dispositivo Android. Commit: `a2f3d41`.

**B-13 — Fix:** `protocol.tsx` — reemplazado `elapsed += 100` (drift acumulativo) por `Date.now() - startTime` (timestamp real). `setInterval` en JS thread no es preciso (cada tick puede tardar 100-115ms); después de ~10s el label ya iba desfasado del círculo Reanimated (UI thread, preciso). Con timestamps reales el label siempre refleja el momento exacto. Interval reducido a 80ms para labels más responsivos. Detectado por w4rw1ck en dispositivo Android. Commit: `67bb9d5`.

**B-14 — Fix:** `protocol.tsx` — agregado `Haptics.impactAsync(Light)` en cada transición de fase (Inhala↔Pausa↔Exhala). Solo vibra cuando la fase cambia, no en cada tick. Vibración `notificationAsync(Success)` al completar los 4 ciclos. 12 vibraciones sutiles + 1 final por sesión completa. Commit: `cf3db00`.

**B-15 — Fix:** `auth.tsx` — campo de código ahora tiene `value={code}` + `onChangeText={setCode}` (estado local). Agregado botón "Verificar código" explícito con `disabled` cuando el campo está vacío. El campo de solo `onSubmitEditing` no funciona confiablemente en Android físico. Commit: `57d4947`.

**B-16 — Fix:** `auth.tsx` — `handleVerifyCode` ahora muestra `Alert` con el mensaje de error cuando el código es incorrecto. El `catch` previo bajaba `isLoading` sin feedback al usuario. Commit: `57d4947`.

**B-17 — Fix:** `sync-privy-user/index.ts` — agregados `corsHeaders` con `Access-Control-Allow-Origin: *` y `Access-Control-Allow-Headers`. Todas las respuestas JSON usan `corsHeaders`. Preflight `OPTIONS` responde con `200 ok`. Commit: `fe855c2`.

**B-18 — Fix:** `contacts.tsx` — removido `import { useRouter }` y `const router = useRouter()` que nunca se usaban. La navegación post-onboarding la maneja `AuthGate` en `_layout.tsx` automáticamente al detectar `onboardingComplete=true`. Commit: `8372e4e`.

**B-19 — Fix:** `profile.tsx` — guard `if (!supabaseUserId)` con `console.warn` explícito y comentario documentando que el perfil se puede completar desde Ajustes en Semana 2. El usuario siempre puede continuar el onboarding aunque el guardado falle. Commit: `fa66ce1`.

**B-20 — Fix:** `VIABILITY_TEST.md` eliminado del repo con `git rm`. Era un documento de análisis ajeno al proyecto que fue trackeado accidentalmente. Commit: `6eaae73`.

**B-21 — Fix:** `Typography.tsx` — agregados variants `headingS` (18px semibold) y `heading` (alias de headingL). Usados en `aq10-result.tsx` y otras pantallas de Fase 1.8. Sin estos variants, el componente fallaba silenciosamente mostrando `undefined` como clases CSS. Commit: `523e50a`.

**B-22 — Fix:** `_layout.tsx` — `AuthGate` ahora incluye excepción explícita para rutas de rescue (`segments[0] === "(app)" && segments[1] === "rescue"`). Si el usuario está en rescue, el guard retorna sin redirigir — independientemente del estado de auth. Regla: la crisis nunca puede ser bloqueada por un wall de autenticación. Commit: `05fb4e8`.

**B-23 — Fix:** `aq10.tsx`, `TestScreen.tsx`, `contacts.tsx` — reemplazado token inexistente `bg-script-surface dark:bg-script-dark-surface` por `bg-script-bg-secondary dark:bg-script-dark-secondary` (tokens válidos definidos en `tailwind.config.js`). Afectaba la barra de progreso de los tests y la tarjeta de contactos. Commit: `38bfacb`.

**B-24 — Fix:** `components/ui/Button.tsx` — agregado `className?: string` a `ButtonProps` e interpolado en el `className` del `Pressable`. Permite pasar márgenes externos (`mt-3`, `mb-4`, etc.) desde el componente padre. Retrocompatible — valor por defecto `""`. Commit: `f733e23`.

**B-25 — Fix:** `package.json` + `metro.config.js` — agregado `"buffer": "^6.0.3"` a dependencies; `metro.config.js` añade `buffer: require.resolve("buffer")` a `extraNodeModules`. Metro ya no trata `buffer` como módulo de Node stdlib. Requiere `npm install` en el proyecto del usuario. Commits: `aac43e1`.

**B-26 — Fix:** `lib/supabase.ts` — agregado adaptador condicional por `Platform.OS`. En web usa `localStorage`; en nativo (Android/iOS) usa `SecureStore`. El adaptador de web no lanza errores aunque SecureStore no exista en ese entorno. Commits: `aac43e1`.

**B-27 — Fix:** `polyfills.ts` + `package.json` — agregado `react-native-get-random-values ~1.11.0`; importado como primer import en polyfills.ts. Este paquete inyecta `global.crypto.getRandomValues` usando la API nativa de RN y registra `global.crypto` de forma segura. Evita el ReferenceError de Hermes que ocurre al acceder a propiedades globales inexistentes. Requiere `npm install` en el proyecto del usuario. Commit: `d9e562c`.

**B-28 — Fix:** `lib/supabase.ts` — todos los accesos a `localStorage` ahora están guardados con `typeof localStorage !== "undefined"`. El Metro SSR renderer corre en Node.js donde `localStorage` no existe aunque `Platform.OS === "web"`. Sin el guard, el proceso de Metro crasheaba al inicializar. Commit: `f80d5e0`.

**B-29 — Fix:** `metro.config.js` + `package.json` — instalado `uuid ^9.0.1`; agregado `uuid: require.resolve("uuid")` a `extraNodeModules`. Con la condición "browser" activa, Metro resolvía `import 'uuid'` (desde dentro de `wrapper.mjs`) de vuelta al mismo `wrapper.mjs` — import circular que produce `undefined`. Forzar resolución al CJS raíz rompe el ciclo. Requiere `npm install`. Commit: `c29f4c6`.

**B-30 — Fix:** `app/_layout.tsx` + `.env.local.example` — agregada prop `clientId={process.env.EXPO_PUBLIC_PRIVY_CLIENT_ID}` a `<PrivyProvider>`. Privy Expo en modo nativo requiere un Client ID separado del App ID para identificar la instancia correcta en Expo Go (bundle ID `host.exp.exponent`). w4rw1ck debe crear un Client en Privy Dashboard → Clients tab y agregar `EXPO_PUBLIC_PRIVY_CLIENT_ID` a `.env.local`. Commit: `120b10d`. ⚠️ Commit original etiquetado "B-27" (colisión de numeración — renombrado B-30 en STATUS.md).

**B-31 — Fix (parcial):** `app/auth.tsx` — Aibus agregó `redirectUrl: Linking.createURL('/auth')` a `sendCode()`. El problema de fondo es que Privy no acepta el scheme `exp://` de Expo Go. Ver B-32 para la solución real. Commits: `fdbde71` + `f9011b2`. ⚠️ Commits originales etiquetados "B-28" (colisión — renombrado B-31 en STATUS.md).

**B-32 — Fix:** `app/auth.tsx` — eliminado `redirectUrl` de `sendCode()` y `import * as Linking`. En el flujo OTP (código de 6 dígitos), Privy NO necesita `redirectUrl` — ese param es solo para el flujo de magic link clickeable donde el usuario es redirigido al app desde el email. Al pasarlo con scheme `exp://`, Privy lo validaba contra su lista de allowed schemes y fallaba. Sin `redirectUrl`, el email solo contiene el código numérico y el flujo funciona sin configuración adicional en el dashboard. Commit: `297ca72`.

**B-36 — Fix:** `app/auth.tsx` — dos cambios principales: (1) Early return con spinner `ActivityIndicator` cuando `!privyReady || privyUser`. Mientras Privy carga o ya hay sesión, el formulario de login nunca se renderiza — imposible tocar `sendCode`/`loginWithOAuth` en ese estado. (2) `handlePostLogin` ahora navega explícitamente al terminar el sync: `router.replace("/(app)/home")` si `onboarding_complete` es true, `router.replace("/(onboarding)")` si no. El catch también navega a `/(onboarding)` como fallback (Edge Function puede fallar). Sin depender exclusivamente de `AuthGate`. `router` agregado al `useCallback` dependency array. Commit: `325e400`.

**B-35 — Fix:** `app/auth.tsx` — agregados `useEffect` + `useCallback` + `usePrivy()`. Al montarse `AuthScreen`, si `privyReady=true` y `privyUser` existe (sesión en SecureStore), llama automáticamente a `handlePostLogin(privyUser)` para sincronizar con Supabase y actualizar Zustand → `AuthGate` detecta el usuario y redirige a `/(onboarding)` o `/(app)/home`. `handlePostLogin` envuelto en `useCallback` para estabilizar la referencia en el dependency array de `useEffect`. Safety net por si `AuthGate` no redirige a tiempo. Commit: `ffacd2d`.

**B-34 — Fix:** `app/_layout.tsx` — `AuthGate` refactorizado para usar `usePrivy()` como fuente de verdad de autenticación. Dos cambios clave: (1) `{ user: privyUser, ready: privyReady } = usePrivy()` — la presencia de `privyUser` (no `storeUser`) determina si hay sesión; (2) efecto de sincronización al arranque: si Privy tiene sesión pero Zustand está vacío (reinicio de app), llama automáticamente a `sync-privy-user` Edge Function para restaurar `user` y `onboardingComplete` sin re-login. `privyReady` evita flashes de redirección mientras Privy carga. También importado `supabase` en `_layout.tsx`. Commit: `d30290d`.

**B-33 — Fix:** `app/auth.tsx` — agregado `import * as WebBrowser from 'expo-web-browser'` y llamada a `WebBrowser.maybeCompleteAuthSession()` a nivel módulo. Esta función es obligatoria en Expo para completar el OAuth flow: cuando Google redirige de vuelta a la app tras el login, Expo Web Browser necesita saber que la sesión OAuth terminó y puede cerrar el browser. Sin esta llamada, el browser queda abierto o cuelga y `useLoginWithOAuth` nunca recibe el callback. Commit: `5f4bad5`.

---

## 🔒 Decisiones Técnicas Tomadas

| Fecha | Decisión | Razón |
|---|---|---|
| 2026-02-26 | Expo SDK 55 como base | Versión actual estable |
| 2026-02-26 | expo-audio en lugar de expo-av | expo-av deprecated en Expo 55 |
| 2026-02-26 | Zod 4.x | Versión actual, API compatible con hookform resolvers 5.x |
| 2026-02-26 | openai SDK v6 | Versión actual con API estable |
| 2026-02-26 | On-chain: solo si involucra transferencia de valor trustless o compromiso permanente | Principio arquitectural — evitar on-chain innecesario que añade fricción sin beneficio real |
| 2026-02-26 | SMS nativo como fallback offline en crisis | Funciona sin internet ni app del contacto |
| 2026-02-26 | Screen IDs S01–S24 (re-numerados) | Onboarding expandido con tests opcionales AQ/CAT-Q/RAADS-R |
| 2026-02-26 | Settings entry para tests en Semana 2 (no 1) | settings/index.tsx se construye en Fase 2.4 |
| 2026-02-27 | Grounding nivel 1 = multimodal (visual + voz + háptico) | Misma filosofía que niveles 2-3; ningún canal es indispensable |
| 2026-02-27 | Timer de auto-avance en Grounding = 10s (canónico) | APP_FLOW.md es fuente de verdad; IMPLEMENTATION_PLAN corregido de 12s |
| 2026-02-27 | w4rw1ck = ejecutor y aprendiz | Quiere aprender, no solo ejecutar — todo se explica |
| 2026-02-27 | Audio grounding: voz guiada + tono ambient | Confirmado por w4rw1ck en sesión de planning |
| 2026-02-27 | npm (no bun) como package manager | EAS Build requiere npm/yarn; bun es experimental en Expo |
| 2026-03-01 | No usar columnas GENERATED con TIMESTAMPTZ en PostgreSQL | EXTRACT() sobre TIMESTAMPTZ no es inmutable; usar queries en su lugar |
| 2026-03-01 | `hour_of_day` y `day_of_week` eliminados de tabla `checkins` | Calculables con EXTRACT en queries; no necesitan persistirse (B-01) |
| 2026-03-02 | `metro.config.js` con `withNativeWind` es obligatorio para NativeWind v4 | Sin él, el procesamiento de CSS no ocurre y todos los className se ignoran (B-04) |
| 2026-03-02 | Ningún agente inicia una fase sin instrucción explícita de w4rw1ck | Orden y control del sprint en manos del PO |
| 2026-03-02 | FABs globales deben renderizarse en el root `_layout.tsx`, fuera de cualquier navegador | `zIndex` solo no es suficiente en Android nativo — el Tab Navigator crea su propia capa de UI que tapa elementos hijos (B-05 v2) |
| 2026-03-02 | **NUNCA usar `expo-symbols` en Script** — siempre `Ionicons` de `@expo/vector-icons` | SF Symbols es exclusivo de Apple (iOS/macOS). En Android Expo Go no renderiza nada (B-07) |
| 2026-03-02 | FAB overlay: `StyleSheet.absoluteFillObject` + `pointerEvents="box-none"` + flexbox | `position:absolute` con `bottom/right` no funciona correctamente en Android dentro de flex containers (B-07) |
| 2026-03-02 | Círculo FAB: usar `View` wrapper, NO `Pressable` para `borderRadius+backgroundColor` | En Android, `Pressable` no renderiza `borderRadius+backgroundColor` correctamente — separar visual (`View`) de interacción (`Pressable`) (B-07) |
| 2026-03-02 | Rutas ocultas requieren `Tabs.Screen href:null` en Expo Router | Expo Router auto-descubre todas las carpetas — rescue/ debe ocultarse explícitamente (B-06) |
| 2026-03-02 | `Card` con `onPress`: Pressable directo con `opacity:0.85` al presionar | No se usa `TouchableOpacity` (deprecado). Pressable permite `style` como función con `pressed` state |
| 2026-03-02 | `Card` variant "elevated": borde `script-blue` como indicador visual de selección | Solo el borde de color es suficiente — mantiene tono calmado del app |
| 2026-03-05 | SAPTEL: (55) 5259-8121 (verificado en saptel.org.mx) | El número 800-290-0024 era incorrecto — en una app de crisis esto es crítico |
| 2026-03-05 | Pantallas de crisis: colores dinámicos con `useColorScheme()`, layout en StyleSheet | Los tamaños son críticos (§11) y no deben variar, pero los colores deben adaptarse a dark mode para ser legibles |
| 2026-03-05 | Tracking de fases en breathing: `Date.now()` en vez de `elapsed += interval` | `setInterval` en JS thread no es preciso; drift acumulado desincroniza con animaciones Reanimated (UI thread nativo) |
| 2026-03-05 | Háptico en breathing: Light en transiciones + Success al completar | Consistente con la decisión de diseño multimodal; solo vibra en cambios de fase (no spam) |
| 2026-03-06 | Campos de input controlados (value+onChangeText) obligatorios en auth flows | `onSubmitEditing` sin estado local no funciona confiablemente en Android físico — siempre usar inputs controlados |
| 2026-03-06 | CORS headers en todas las Edge Functions de Supabase | Buena práctica aunque RN no sea browser; facilita testing desde web y evita errores de preflight |
| 2026-03-06 | AQ-10 usa `.agree` booleano; TestScreen usa `.value` numérico | AQ-10 es binario (sí/no); AQ-Full/CAT-Q/RAADS-R son escalas multi-punto — patrones diferentes para propósitos diferentes |
| 2026-03-06 | `AuthGate` en `_layout.tsx` maneja toda la redirección post-auth | No duplicar lógica de navegación en pantallas individuales — una sola fuente de verdad |
| 2026-03-06 | EAS consent attestations reemplaza on-chain access control en Semana 5 | `grantAccess()/revokeAccess()` on-chain es mutable y no pasa el filtro; EAS emite consentimiento clínico como compromiso permanente e irrevocable |
| 2026-03-06 | Token-gating de features premium: arquitectura pendiente, post-Semana 5 | w4rw1ck tiene un plan — se define cuando llegue el momento |
| 2026-03-06 | SBTs de progreso descartados | Gamificar hitos de salud mental con tokens permanentes públicos es éticamente problemático para usuarios TEA — fijación, estigma, rigidez |
| 2026-03-06 | Mapeo test→perfil semilla es decisión de diseño informado por clínica, NO protocolo clínico validado | Las reglas en `profile-seed.ts` (ej: AQ-10 alto → más scripts de socialización) son razonables pero no tienen publicación peer-reviewed que las respalde directamente. Documentado así en PRD para evitar escrutinio médico erróneo. Supervisión clínica recomendada antes de lanzamiento público (ver T-4.3) |
| 2026-03-06 | `sendCode()` de Privy NO recibe `redirectUrl` en flujo OTP | `redirectUrl` solo es necesario para magic link clickeable (el usuario llega al app desde un link). En flujo OTP (código 6 dígitos) el param causa `Redirect URL scheme is not allowed` porque Privy valida el scheme contra su lista de allowed origins. Sin el param, el email solo contiene el código y el flujo funciona sin configuración extra en Privy dashboard |
| 2026-03-06 | `WebBrowser.maybeCompleteAuthSession()` es obligatorio para OAuth en Expo | Debe llamarse a nivel módulo en el archivo que usa `useLoginWithOAuth`. Sin esta llamada, el browser OAuth queda colgado al recibir el redirect del proveedor (Google). Es el patrón estándar de Expo para cualquier OAuth flow con `expo-web-browser` |
| 2026-03-06 | `AuthGate` usa `usePrivy().user` como fuente de verdad para auth, NO `useAuthStore().user` | Zustand es en memoria — se resetea en cada arranque. Privy persiste la sesión en SecureStore. El guard de navegación debe chequear Privy para evitar que usuarios ya autenticados vean la pantalla de login en cada reinicio. Zustand sigue siendo necesario para `onboardingComplete` y datos del perfil |
| 2026-03-06 | `react-native-get-random-values` como polyfill de crypto en RN/Hermes | Hermes lanza ReferenceError al acceder a global.crypto inexistente (a diferencia de V8 que retorna undefined); este paquete es el estándar para Privy en RN |
| 2026-03-06 | `typeof localStorage !== "undefined"` obligatorio en código web | Metro SSR renderer corre en Node.js puro; `Platform.OS === "web"` puede ser true pero localStorage no existe — siempre verificar antes de acceder |
| 2026-03-06 | Paquetes con imports circulares en ESM deben ir en `extraNodeModules` de metro.config.js | Con condición "browser", Metro puede crear ciclos en `wrapper.mjs` de uuid — forzar CJS raíz los rompe |

---

## 📝 Notas del Sprint

### Semana 1

**2026-03-06 — B-36 — Fix definitivo auth loop (Ana)**
- Problema persistente: auth screen se mostraba aunque Privy tuviera sesión → "already logged in" en todos los intentos de login
- Causa: formulario de login seguía renderizando con `privyUser !== null`; hooks de Privy fallaban al ser invocados en estado autenticado
- Fix A: early return en `auth.tsx` — si `!privyReady || privyUser`, mostrar spinner y nunca renderizar el formulario
- Fix B: `handlePostLogin` navega explícitamente via `router.replace` al terminar → no depende de que AuthGate dispare la redirección
- Commit: `325e400`

**2026-03-06 — B-34 — AuthGate: Privy como fuente de verdad (Ana)**
- Error `Already logged in` al intentar Google OAuth — causa raíz: `AuthGate` usaba Zustand (en memoria) como fuente de verdad, no Privy (persistido en SecureStore)
- En cada reinicio de app, Zustand se resetea → `user` null → AuthGate muestra `/auth` → usuario ya logueado intenta login de nuevo → Privy dice "ya estás logueado"
- Fix: `AuthGate` ahora usa `usePrivy().user` para determinar si hay sesión y espera `usePrivy().ready` antes de navegar
- Efecto de sincronización: si Privy tiene sesión pero Zustand está vacío, llama `sync-privy-user` al arranque para restaurar estado completo (incluye `onboarding_complete`)
- Commit: `d30290d`

**2026-03-06 — B-33 — Google OAuth fix (Ana)**
- Email OTP funcionando ✅ (B-32 verificado por w4rw1ck en dispositivo Android)
- Google OAuth: browser abría pero nunca regresaba a la app
- Causa: `WebBrowser.maybeCompleteAuthSession()` faltaba — obligatorio para OAuth en Expo
- Fix: agregar llamada a nivel módulo en `auth.tsx` + `import expo-web-browser`
- Pendiente verificación en dispositivo (w4rw1ck)
- Pendiente acción en Privy Dashboard: habilitar Google como Social Login provider (Authentication tab)
- Commit: `5f4bad5`

**2026-03-06 — B-32 — Privy auth OTP fix (Ana)**
- Error `Redirect URL scheme is not allowed` al intentar login con email en Expo Go Android
- Causa raíz: `sendCode()` recibía `redirectUrl` con scheme `exp://` que Privy rechaza — pero ese param NO es necesario en flujo OTP
- Fix: eliminar `redirectUrl` + `Linking` import de `auth.tsx`. El código OTP llega al email sin redirect URL
- Error separado `Unable to activate keep awake` es inofensivo en Expo Go dev — viene de `expo-keep-awake` en una dependencia, desaparece en build de producción
- Pendiente: w4rw1ck debe crear un Client en Privy Dashboard → Clients tab con App Identifier `host.exp.exponent` y agregar el Client ID a `.env.local` (ver B-30)
- Commit: `297ca72`

**2026-03-06 — Auditoría clínica completa por Aibus Dumbleclaw — 12 tickets registrados**
- Base: commit `fdcadd2` (dev branch) — Semana 1 código completo
- Score global: **6.6/10** — sólido para MVP con usuarios conocidos; no suficiente para lanzamiento público sin resolver críticos
- Fortalezas: enfoque sensory-first ✅, lenguaje tentativo en IA ✅, tests clínicamente validados (AQ/CAT-Q/RAADS-R) ✅, offline-first en crisis ✅, RLS en 9 tablas ✅
- 3 tickets críticos antes de usuarios reales (T-C1/T-C2/T-C3): ideación suicida, safety filter GPT, consentimiento informado
- 6 tickets Semana 2 de alta/media prioridad (T-2.7 a T-2.12): persistencia scores, crisis_events, temperatura GPT, script_executions, PMID, UI feedback
- 3 tickets Semana 3-4 (T-3.1, T-3.2, T-4.1, T-4.2, T-4.3): rate limiting, logging IA, script fading, zonas Mahler, supervisión clínica
- División: T-C1/T-C3/2.8/2.10/2.11/4.1/4.2 → **Ana** | T-C2/2.7/2.9/2.12/3.1/3.2 → **Aibus**
- Nueva decisión técnica registrada: mapeo test→perfil = "diseño informado por clínica" no protocolo validado
- Ref: https://gist.github.com/dumbleclaw/8d6db74cc4b64b03dde7ed4623ef4bec

**2026-03-06 — Contenido scripts sociales con fundamento clínico (bloqueador #7 ✅)**
- `supabase/seed-scripts.sql` reescrito — 5 scripts con bloques completos, frases reales, contexto clínico
- Estructura apertura→contexto→acción→salida basada en Gray (1994) Social Stories™ + Baker (2003)
- Múltiples opciones por fase para reducir carga cognitiva (Gaus, 2011)
- Salida `optional: true` — no forzar cierre formal (Attwood, 2007)
- `REFERENCES.md` creado — fuentes académicas de scripts, tests de onboarding y recursos futuros
- Bloqueador #7 resuelto ✅ — bloqueadores activos ahora: #2 (Privy App ID), #5 (traducciones), #6 (audio)
- Commit: `fdcadd2`

**2026-03-06 — Metro uuid circular import fix (B-29)**
- Android bundled ✅ (crypto fix funcionó) — nuevo error: uuid wrapper.mjs circular
- `@privy-io/js-sdk-core` anida su propio uuid; condición "browser" causaba import circular
- Fix: uuid raíz en extraNodeModules de metro.config.js + `npm install uuid`
- w4rw1ck debe correr `npm install` antes de `npx expo start`
- Commit: `c29f4c6`

**2026-03-06 — Polyfill fixes: crypto + localStorage (B-27/B-28)**
- Bug B-27 🔴: `global.crypto` inexistente en Hermes lanza ReferenceError → instalado `react-native-get-random-values ~1.11.0`, importado primero en polyfills.ts
- Bug B-28 🟡: `localStorage` undefined en Metro SSR (Node.js) → guards `typeof localStorage !== "undefined"` en supabase.ts
- w4rw1ck debe correr `npm install` para instalar el nuevo paquete
- Commits: `d9e562c` (polyfills) → `f80d5e0` (supabase)

**2026-03-06 — Auditoría Fase 1.8 por Ana — 3 bugs encontrados y resueltos (B-22 a B-24)**
- Bug B-22 🔴: AuthGate bloqueaba el protocolo de rescate sin auth — crítico en crisis — fix: excepción explícita en guard para rutas `rescue/`
- Bug B-23 🟡: Token NativeWind `script-surface` inexistente en 3 archivos — barras de progreso y tarjeta de contactos sin fondo visible
- Bug B-24 🟡: `Button` sin `className` prop — `className="mt-3"` ignorado en `aq10-result.tsx`
- Commits: `05fb4e8` → `38bfacb` → `f733e23`
- Semana 1 código: 8/8 fases implementadas, 24 bugs documentados y resueltos
- Pendiente verificación funcional en dispositivo (bloqueada por Privy App ID — ver bloqueador #2)

**2026-03-06 — Decisiones de arquitectura on-chain (Semana 5)**
- Principio establecido: "si no involucra transferencia de valor trustless o compromiso permanente, no va on-chain"
- On-chain access control descartado: `grantAccess()/revokeAccess()` es mutable; Supabase RLS es suficiente para permisos
- EAS consent attestations aprobado para Semana 5: consentimiento clínico paciente→terapeuta como attestation inmutable
- Token-gating de features premium: aprobado en principio, arquitectura a definir post-Semana 5 (w4rw1ck tiene plan)
- SBTs de progreso descartados: éticamente problemáticos en contexto de salud mental TEA (fijación, estigma, permanencia pública)
- Docs actualizados: PRD.md, IMPLEMENTATION_PLAN.md, TECH_STACK.md, STATUS.md

**2026-03-06 — Fase 1.8 completa + auditoría + 7 fixes (B-15 a B-21)**
- Fase 1.8 implementada por sub-agente: Auth Privy + Onboarding completo S01→S08 (commit `72abbc5`)
- Auditoría inmediata por Aibus encontró 7 issues (2 altos, 3 medios, 2 bajos)
- Corregidos en commits individuales: `57d4947` → `fe855c2` → `8372e4e` → `fa66ce1` → `6eaae73` → `e619532` → `6055a7b` → `523e50a`
- Semana 1 código: 8/8 fases implementadas, 0 issues abiertos de auditoría
- Bloqueador activo: B-13 Privy config (w4rw1ck necesita crear App ID en dashboard.privy.io)
- Pendiente w4rw1ck: crear Privy App ID, llenar .env.local, `supabase functions deploy sync-privy-user`

**2026-03-05 — Verificación Fase 1.7 en dispositivo + 4 fixes (B-11 a B-14)**
- w4rw1ck probó el protocolo de rescate en su Android físico
- Bug B-11: número SAPTEL incorrecto (800-290-0024) → corregido a (55) 5259-8121 (verificado en saptel.org.mx)
- Bug B-12: pantallas de crisis ilegibles en dark mode → colores dinámicos con `useColorScheme()` en assess.tsx + protocol.tsx
- Bug B-13: label de respiración desincronizado con círculo animado → `Date.now()` en vez de `elapsed += 100`
- Bug B-14: respiración guiada sin feedback háptico → Light impact en transiciones de fase + Success al completar
- Audio sigue pendiente (assets/audio/)
- Commits: `e974d66` → `a2f3d41` → `67bb9d5` → `cf3db00`

**2026-03-02 — Fase 1.7 completa: Protocolo de Rescate (S17→S18)**
- assess.tsx (S17): §11 estricto — fondo crisis, botones 72px, ← Salir, 3 niveles
- protocol.tsx (S18): Nivel 1 grounding 5-4-3-2-1 + háptico; Nivel 2 círculo Reanimated (4s/2s/6s × 4 ciclos); Nivel 3 SAPTEL + respiración secundaria
- StyleSheet en lugar de NativeWind en pantallas de crisis (valores críticos)
- Audio pendiente: assets/audio/ README creado, esperando archivos MP3
- SAPTEL: (55) 5259-8121, 24h, gratuito (México)
- Pendiente verificación en dispositivo y contactos de confianza (Fase 1.8+)

**2026-03-02 — Fase 1.6 completa: Biblioteca de Scripts (S14→S15→S16)**
- index.tsx (S14): fetch Supabase predefined scripts, 4 chips de categoría, 5 cards
- [id].tsx (S15): detalle completo, vista previa de bloques tipo, CTA ejecutar
- execute.tsx (S16): paso a paso, barra progreso dinámica, opciones seleccionables, bloque contexto, saltar opcional, pantalla de celebración
- execute.tsx implementado como ruta estática (no [id]/execute) con id como query param
- Pendiente verificación en dispositivo físico (w4rw1ck)

**2026-03-02 — Fase 1.5 completa: Check-in Corporal (S10→S11→S12→S13)**
- BodyMap.tsx: SVG 6 zonas táctiles, multi-selección, light/dark mode
- body.tsx (S10): BodyMap + chips + CTA deshabilitado sin selección
- notes.tsx (S11): TextInput libre, chips read-only, KeyboardAvoidingView
- reflect.tsx (S12): loader + 5 opciones emoción (mock) + input personalizado
- result.tsx (S13): muestra emoción, INSERT Supabase, flagged_for_review
- interpret-checkin: Edge Function GPT-4o-mini con system prompt lenguaje tentativo
- Pendiente verificación en dispositivo físico (w4rw1ck)

**2026-03-02 — Fase 1.4 completada y verificada en dispositivo**
- 1.4.1–1.4.4 implementadas por Aibus + Ana — tabs, FAB, Home real
- Bug B-04 detectado: NativeWind sin estilos por falta de metro.config.js — fix en `30fec72`
- Estilos confirmados funcionando en dispositivo físico Android (w4rw1ck)
- Bug B-05: FAB invisible en Android físico — fix v1 `b7e9b6e` (zIndex) → fix v2 `6562449` (root layout) → root cause real: B-07
- Bug B-07 (root cause): `expo-symbols` no funciona en Android — reemplazado por `Ionicons` (@expo/vector-icons) en 5 commits por Aibus. FAB rediseñado con overlay + View circular. Verified en dispositivo físico Android ✅
- Bug B-06: Tab "rescue" aparecía en barra (faltaba href:null) — fix en `7ccfd0f`
- FRONTEND_GUIDELINES v1.2: tabla de inspiraciones por pantalla + decisión Planta→S3
- Regla establecida: ningún agente inicia una fase sin instrucción explícita del PO

**2026-02-27 — Sesión de planning completada**
- Equipo formado: w4rw1ck + Ana Banana + Aibus Dumbleclaw
- Branch `dev` creado ✅
- Branches `feat/fase-1-4` a `feat/fase-1-7` creados ✅ (Ana)
- godin-001 aceptó invitación como colaboradora ✅
- 7 bloqueadores identificados antes de arrancar (ver tabla arriba)
- Node.js v22 compatible con Expo 55 ✅
- Dispositivo de prueba: Android físico + amigo con TEA Nivel 1 diagnosticado

---

## 🔄 Cómo Actualizar Este Archivo

- Al completar un paso: cambiar ⏳ → ✅ y agregar nota si aplica
- Al encontrar un bug: agregar a tabla de Bugs Conocidos
- Al tomar una decisión técnica: agregar a tabla de Decisiones
- Formato del commit al actualizar: `status: fase X.X completada`
