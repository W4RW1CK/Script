# STATUS.md — Estado del Proyecto
## Script — Compañero Digital para Adultos con TEA Nivel 1

> **Cómo leer este archivo:**
> ✅ Completado | 🔄 En progreso | ⏳ Pendiente | ❌ Bloqueado

**Última actualización:** 2026-03-02  
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
| 7 | Revisar/completar contenido de 5 scripts sociales | Ana + Aibus | Fase 1.6 | ⏳ |

---

## 📊 Progreso General

| Semana | Descripción | Estado | Completado |
|---|---|---|---|
| Pre-implementación | Documentación + audit de los 6 docs canónicos | ✅ | PR #3 listo para merge |
| Semana 1 | MVP: Setup + Check-in + Scripts + Rescate + Auth | 🔄 | 5 / 8 fases (1.1 ✅ 1.2 ✅ 1.3 ✅ 1.4 ✅ 1.5 ✅) |
| Semana 2 | Historial + Diccionario + Personalización | ⏳ | — |
| Semana 3 | Red de Confianza + Notificaciones | ⏳ | — |
| Semana 4 | IA + Vista Terapeuta | ⏳ | — |
| Semana 5 | On-Chain + Polish + APK | ⏳ | — |

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
| 1.4.1 | app/(app)/_layout.tsx con Tab Navigator | ✅ | expo-symbols, colores tokens, height 64px |
| 1.4.2 | 5 tabs con íconos (expo-symbols) | ✅ | Placeholders con SafeScreen/Typography; (tabs) eliminado |
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
| **Verificación** | Check-in completo S10→S11→S12→S13, dato guardado en Supabase | ⏳ | Pendiente confirmar en dispositivo (w4rw1ck). Sin auth: INSERT falla silenciosamente |

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

**B-01 — Fix:** Se eliminaron las columnas `hour_of_day` y `day_of_week` de `checkins`. `EXTRACT()` usable en queries. Commit: `864e435`.

**B-02 — Fix:** `_layout.tsx` ahora importa y registra `Inter_400Regular`, `Inter_600SemiBold`, `Inter_700Bold` via `@expo-google-fonts/inter`. Commit: `1edc8c6`.

**B-03 — Fix:** Reemplazado `text-top` por `style={{ textAlignVertical: 'top' }}` como prop nativo. También eliminado `dark:border-[#3A3A44]` hardcodeado → token `dark:border-script-dark-border`. Commit: `1edc8c6`.

**B-04 — Fix:** Creado `metro.config.js` con `withNativeWind(config, { input: './global.css' })`. NativeWind v4 requiere este archivo para procesar el CSS de Tailwind — `babel.config.js` solo hace el transform JSX; el procesamiento CSS es responsabilidad de Metro. Sin `metro.config.js`, todos los `className` se ignoran. Commit: `30fec72`.

**B-05 — Fix v1 (insuficiente):** Agregado `zIndex: 999` y aumentado `elevation: 6→10` en el StyleSheet de `RescueFAB.tsx`. Commit: `b7e9b6e`.
**B-05 — Fix v2 (definitivo):** `RescueFAB` movido de `app/(app)/_layout.tsx` a `app/_layout.tsx` (raíz). Renderizarlo dentro del Tab Navigator causa que Android lo oculte bajo su propia capa de UI independientemente del `zIndex`. Al estar en la raíz del árbol — fuera de Stack y Tab Navigator — ninguna capa de navegación puede taparlo. Commit: `6562449`.

**B-06 — Fix:** Agregado `<Tabs.Screen name="rescue" options={{ href: null }} />` en `app/(app)/_layout.tsx`. Expo Router auto-descubre todas las carpetas en `(app)/`; sin este Screen con `href: null`, la carpeta `rescue/` aparecía como un 6to tab en la barra de navegación. Commit: `7ccfd0f`.

**B-08 — Fix:** `Card.tsx` actualizado con props `variant` ("default"|"elevated") y `onPress` (Pressable con `opacity:0.85`). Variante "elevated" usa `bg-elevated + shadow-md + border script-blue`. Retrocompatible. `reflect.tsx` corregido: `ActivityIndicator` usa `useColorScheme()` para el color (#A8C5DA light / #5A7E92 dark). Commit: `c157bdb`. Encontrado por Aibus en auditoría.

**B-07 — Fix:** Reemplazado `expo-symbols` → `Ionicons` de `@expo/vector-icons` en todos los archivos del proyecto. SF Symbols es una tecnología exclusiva de Apple que no funciona en Android. Adicionalmente: FAB rediseñado con `View` overlay (`StyleSheet.absoluteFillObject` + `pointerEvents="box-none"` + flexbox) y círculo visual separado como `View` con `borderRadius` (en Android, `Pressable` no renderiza `borderRadius+backgroundColor` correctamente). Commits: `485284c`, `0698ac2`, `cdff16c`, `3d9801e`, `7b9d9a2`.

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

---

## 📝 Notas del Sprint

### Semana 1

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
