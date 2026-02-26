# PRD.md — Product Requirements Document
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.3  
**Última actualización:** 2026-02-26  
**Cambios v1.1:** Agregadas preguntas AQ-10 en Apéndice A, guidance de body map SVG en Apéndice B.  
**Cambios v1.2:** RAADS-R domain counts corregidos (Apéndice E). §3.4 notificaciones acotadas a nivel 3. §4 Semana 2 auth redundante eliminada. §6 Principio 6 alineado con APP_FLOW.md (1 tap, no 2).  
**Cambios v1.3:** §3.1 Fase Profunda — aclarado que Settings access es Semana 1 (Phase 1.8). §4 Semana 2 — tests de screening removidos (son Semana 1). §4 Semana 5 — "offline completo" acotado para no confundir con offline-first base de Semana 1.
**Owner:** W4RW1CK  
**Estado:** MVP en desarrollo

---

## 1. Resumen del Producto

Script es una aplicación móvil (Android-first, web-compatible) que actúa como compañero digital para adultos con Trastorno del Espectro Autista (TEA) Nivel 1. No es un terapeuta ni un sistema de diagnóstico. Es una herramienta de autoconocimiento, regulación emocional y apoyo en crisis.

**Problema central:** Los adultos con TEA Nivel 1 frecuentemente no pueden identificar ni nombrar lo que sienten (alexitimia), experimentan sobrecarga sensorial sin herramientas para manejarla, y navegan situaciones sociales sin guías adaptadas a su forma de procesar el mundo.

**Solución:** Script ofrece tres pilares:
1. **Conocerse** — check-ins corporales + diccionario emocional personal
2. **Prepararse** — scripts sociales adaptados para situaciones desafiantes
3. **Sobrevivir la crisis** — protocolo de rescate multimodal + red de apoyo

---

## 2. Usuarios

### Usuario Primario: Adulto con TEA Nivel 1
- **Edad objetivo:** 18–25 (diseño extensible a todas las edades)
- **Diagnóstico:** Preferentemente diagnosticado formalmente. La app alienta a quienes no tienen diagnóstico a buscarlo.
- **Género:** Diseño neutral. Prioridad estadística en hombres, sin descuidar mujeres (subdiagnosticadas).
- **Geografía:** Latinoamérica hispanohablante. Español como idioma principal.
- **Contexto:** Trabaja, estudia o socializa. Por fuera "funciona". Por dentro carga una máscara.

### Usuario Secundario: Persona de Confianza
- Familiar, amigo cercano o pareja del usuario primario
- Recibe alertas de crisis y tiene instrucciones de cómo apoyar
- No necesita la app para recibir notificaciones (push nativo / SMS fallback)
- Puede tener acceso limitado a la app con permisos específicos

### Usuario Terciario: Terapeuta
- Profesional de salud mental con acceso autorizado por el usuario
- Ve reportes de check-ins, patrones detectados, y scripts del paciente
- Puede crear y modificar scripts para su paciente
- Recibe reportes automáticos según configuración del usuario

---

## 3. Features — MVP (Semana 1, entrega lunes)

### 3.1 Onboarding

El onboarding tiene dos fases: **rápida** (obligatoria, ~3 min) y **profunda** (opcional, ~15-30 min).

#### Fase Rápida — Obligatoria
- **Pantalla de bienvenida** con opción "Modo Calma" (bypass directo a crisis si se necesita)
- **Test AQ-10** (Autism Quotient-10): 10 preguntas, resultado orientativo, no diagnóstico
  - Score ≥6: perfil semilla pre-configurado + recomienda AQ completo
  - Score <6: perfil semilla base + recomienda CAT-Q (detecta enmascaramiento)
- **Cuestionario personal:** nombre, intereses, sensibilidades, herramientas que ya usa (5–8 preguntas)
- **Configuración de personas de confianza** (opcional, omitible)

#### Fase Profunda — Opcional (disponible post AQ-10)
Tests adicionales que **alimentan el perfil semilla** con mayor precisión. El usuario puede:
- Hacerlos todos durante el onboarding (flujo S04 → S05 → S06)
- Retomarlos en cualquier momento desde Configuración → "Completar mi perfil" (S21) — **disponible desde Semana 2** (Fase 2.1 — las pantallas S04–S06 existen desde Semana 1, el entry point en Settings se construye en Semana 2)
- Saltarlos completamente (sin penalización)

**Test 2: AQ Completo (Autism Quotient — 50 preguntas)**
- Solo recomendado si AQ-10 score ≥6
- Mismo formato que AQ-10 (Totalmente de acuerdo → Totalmente en desacuerdo)
- 5 dominios: Habilidades sociales, Cambio de atención, Atención al detalle, Comunicación, Imaginación
- Score ≥32/50 → perfil semilla con mayor sensibilidad a patrones TEA
- Fuente: Baron-Cohen et al. (2001). Ver Apéndice C para las 50 preguntas.

**Test 3: CAT-Q (Camouflaging Autistic Traits Questionnaire — 25 preguntas)**
- Especialmente recomendado si AQ-10 score <6 (detecta autistas que "pasan desapercibidos")
- Mide 3 dimensiones: Asimilación, Compensación, Enmascaramiento
- Escala 1–7 (Totalmente en desacuerdo → Totalmente de acuerdo)
- Score alto en Enmascaramiento → app enfatiza herramientas de expresión auténtica y reduce presión social
- Fuente: Hull et al. (2019). Ver Apéndice D para las 25 preguntas.

**Test 4: RAADS–R (Ritvo Autism Asperger Diagnostic Scale-Revised — 80 preguntas)**
- Diseñado específicamente para adultos que "escapan el diagnóstico" por presentación subcrítica
- 4 dominios: Relaciones sociales, Lenguaje, Intereses circunscritos, Motor sensorial
- Escala 0–3 por ítem
- Los scores por dominio alimentan el perfil sensorial del usuario en la app
- Fuente: Ritvo et al. (2011). Ver Apéndice E para estructura y preguntas.

**Impacto de los tests en el perfil semilla:**

| Test | Qué cambia en la app |
|---|---|
| AQ-10 alto | Scripts de socialización aparecen primero; más énfasis en zona "cabeza/mandíbula" en check-in |
| CAT-Q alto en Enmascaramiento | App refuerza mensajes de autenticidad; recordatorio sutil de "no tienes que actuar aquí" |
| CAT-Q alto en Compensación | Más scripts de "estrategias de navegación social" |
| RAADS-R alto en Motor sensorial | Perfil sensorial pre-populado con sensibilidades auditivas/táctiles |
| RAADS-R alto en Relaciones sociales | Scripts de interacción social marcados como prioritarios |

**Criterio de éxito:** Usuario completa fase rápida en menos de 5 minutos. Fase profunda es voluntaria y no bloquea el uso de la app.

---

### 3.2 Check-in Corporal
**Descripción:** El corazón del producto. El usuario identifica sensaciones físicas como puerta de entrada a la conciencia emocional.

**Flujo:**
1. Usuario abre check-in
2. Ve silueta corporal SVG interactiva con 6 zonas:
   - Cabeza / Ojos / Mandíbula
   - Garganta / Cuello
   - Pecho / Corazón
   - Estómago / Abdomen
   - Manos / Brazos
   - Piernas / Pies
3. Toca una o varias zonas → zona(s) se iluminan
4. Campo de texto libre: "¿Qué percibes ahí?"
5. IA presenta 3–5 opciones de emoción: "¿Podría ser algo como esto?"
6. Usuario confirma, descarta, o escribe su propia palabra
7. App sugiere script o técnica de regulación según emoción identificada
8. Resultado guardado en historial + diccionario emocional personal

**Duración objetivo:** ~5 minutos  
**Frecuencia:** Diaria (incentivada, no obligatoria)  
**Offline:** Check-in funciona offline. Sincroniza al reconectarse.

**Criterio de éxito:** Usuario identifica o se acerca a una emoción en el 80% de los check-ins.

---

### 3.3 Scripts Sociales
**Descripción:** Guías paso a paso para navegar situaciones sociales desafiantes.

**Estructura de cada script:**
```
[Apertura] → [Reconocimiento del Contexto] → [Petición/Acción] → [Salida opcional]
```
Cada bloque tiene 2–3 opciones de lenguaje. El usuario elige en el momento, no memoriza.

**5 scripts predefinidos para MVP:**
1. Interrumpir o unirse a una conversación
2. Pedir algo en lugar público (restaurante, tienda, transporte)
3. Situación de sobrecarga sensorial en público (pedir salir / espacio)
4. Primera reunión o entrevista de trabajo
5. Conflicto o malentendido con alguien

**Dos modos:**
- **Modo Preparación:** Lees el script antes del evento. Repasa los bloques, practica mentalmente.
- **Modo Ejecución:** Usas el script en tiempo real. Pantalla mínima, un bloque visible a la vez, avanzas con tap.

**Scripts personalizados (semana 2+):** Usuario crea sus propios scripts. IA ayuda a refinar.

**Criterio de éxito:** Usuario puede ejecutar un script durante una situación real sin detenerse.

---

### 3.4 Botón de Rescate (Crisis)
**Descripción:** Acceso en un tap desde cualquier pantalla. Protocolo de calma + activación de red de apoyo.

**Flujo al presionar:**
1. Pantalla de transición inmediata: fondo neutro, reducción de contraste, animación mínima
2. Evaluación rápida (1 pregunta, escala 1–3): "¿Qué tan intenso se siente esto?"
   - 1 = Incómodo / 2 = Difícil / 3 = No puedo
3. Según nivel, inicia protocolo:
   - **Nivel 1:** Técnica de grounding 5-4-3-2-1 con guía visual
   - **Nivel 2:** Respiración guiada (visual + audio + háptico) — sin notificación
   - **Nivel 3:** Respiración guiada + notificación automática a red de confianza
4. **Secuencia de calma multimodal:**
   - Visual: círculo que expande/contrae al ritmo de respiración
   - Audio: tono suave al ritmo (activable/desactivable)
   - Háptico: vibración sutil al ritmo (si dispositivo lo permite)
5. **Notificación a red de confianza (nivel 3 únicamente):**
   - Si online: push notification nativa con ubicación + contexto breve
   - Si offline: SMS nativo pre-formateado como fallback
   - Mensajes a todos los contactos en paralelo
6. Opciones al finalizar: "Me siento mejor" / "Necesito más ayuda" / "Llamar a alguien"

**En crisis real (nivel 3):** Instrucciones mínimas de 2–3 palabras. Sin texto largo.

**Criterio de éxito:** Usuario puede activar el protocolo con una mano, en oscuridad, bajo estrés.

---

## 4. Features — Post-MVP (Semanas 2–5)

### Semana 2
- Historial de check-ins con visualización de patrones básicos (S19)
- Diccionario emocional personal (vocabulario que crece con uso) (S20)
- Personalización: modo claro/oscuro, paleta de colores, animaciones on/off (S21)

> ℹ️ **Nota:** Los tests AQ Full (S04), CAT-Q (S05) y RAADS-R (S06) están implementados desde **Semana 1** (Phase 1.8) y son accesibles desde el onboarding y desde Configuración → "Completar mi perfil".

### Semana 3
- Red de confianza completa (agregar contactos, configurar qué ven, comunicación bilateral)
- Notificaciones configurables (hora, frecuencia, tono)
- Sistema de "Insights desbloqueados" (después de 3, 7, 15 check-ins)
- Telegram Bot para personas de confianza sin app

### Semana 4
- Integración IA (OpenAI GPT-4o) para detección de patrones y recomendaciones
- Vista terapeuta (reportes automáticos, acceso a scripts, anotaciones)
- Scripts personalizados con asistencia de IA
- Botón "🚩 Esto no se siente bien" para supervisión clínica

### Semana 5
- Control de acceso on-chain (EVM L2 — TBD)
- Sincronización inteligente avanzada (resolución de conflictos, queue de pendientes, background sync) — las funciones core ya son offline-first desde Semana 1
- Reducción sensorial automática en crisis (contraste, animaciones)
- Build APK para Android
- Polish sensorial y accesibilidad completa

---

## 5. Fuera de Alcance (Explícito)

- ❌ Diagnóstico clínico de ningún tipo
- ❌ Reemplazo de terapia profesional
- ❌ Rastreo de ubicación continuo (solo en crisis, con consentimiento)
- ❌ Venta o monetización de datos del usuario
- ❌ Gamificación punitiva (sin "perdiste tu racha")
- ❌ Soporte para TEA Nivel 2 o 3 en v1
- ❌ iOS App Store en v1 (APK Android primero)
- ❌ Contenido generado por IA sin validación del usuario
- ❌ Notificaciones push sin consentimiento explícito

---

## 6. Principios de Diseño (No Negociables)

1. **Sensory-first:** Ningún elemento de la UI puede ser un detonante sensorial
2. **Control total del usuario:** El usuario decide qué se guarda, qué se comparte y con quién
3. **Sin juicio:** La app nunca evalúa, corrige ni califica las emociones del usuario
4. **Lenguaje de exploración:** La IA propone, el usuario confirma. Nunca "tú sientes X"
5. **Offline-ready:** Las funciones core funcionan sin internet
6. **Acceso de emergencia:** El botón de rescate (→ S17) es alcanzable en **máximo 1 tap** desde cualquier pantalla de la app (FAB siempre visible)

---

## 7. Métricas de Éxito

| Métrica | Objetivo MVP | Objetivo v1 |
|---|---|---|
| Onboarding completado | >80% de usuarios que abren la app | >90% |
| Check-ins por semana (usuarios activos) | ≥3 | ≥5 |
| Uso del botón de rescate (con protocolo completado) | 100% completan el protocolo | 100% |
| Scripts usados en modo ejecución | Al menos 1 por usuario en primera semana | ≥3 |
| Retención a 7 días | >40% | >60% |

---

## 8. Dependencias y Riesgos

| Riesgo | Probabilidad | Mitigación |
|---|---|---|
| IA hace interpretación emocional incorrecta | Media | Sistema de confirmación por usuario + botón de reporte |
| Persona de confianza sin app ni Telegram | Alta | SMS nativo como fallback siempre disponible |
| Burnout del usuario ante check-ins diarios | Media | Sin obligación, insights como motivación, no streaks |
| Dato sensible expuesto | Baja | Encriptación en reposo, RLS en Supabase, on-chain en v2 |
| App se convierte en detonante en crisis | Baja | Modo reducción sensorial automático en crisis |

---

## Apéndice A — Preguntas AQ-10 (Autism Quotient-10)

> Estas son las 10 preguntas oficiales del AQ-10 (versión adultos). Deben aparecer **exactamente así** en la pantalla S02. No inventar ni modificar las preguntas.

**Instrucciones para el usuario (mostrar antes de empezar):**
> "Estas preguntas no son un diagnóstico. Son una forma de conocerte mejor. Responde según cómo te sientes habitualmente, no en situaciones de estrés específicas. No hay respuestas correctas o incorrectas."

**Escala de respuesta (la misma para todas las preguntas):**
- Totalmente de acuerdo → **1 punto**
- Ligeramente de acuerdo → **1 punto**
- Ligeramente en desacuerdo → **0 puntos**
- Totalmente en desacuerdo → **0 puntos**

**Las 10 preguntas:**

| # | Pregunta | Puntúa con 1 cuando... |
|---|---|---|
| 1 | A menudo noto pequeños sonidos que otros no escuchan. | De acuerdo |
| 2 | Por lo general me concentro más en el todo que en los pequeños detalles. | En desacuerdo |
| 3 | En grupos sociales, puedo seguir varias conversaciones a la vez fácilmente. | En desacuerdo |
| 4 | Si algo me interrumpe, puedo volver a lo que estaba haciendo muy rápidamente. | En desacuerdo |
| 5 | No me cuesta saber si alguien que está escuchándome se está aburriendo. | En desacuerdo |
| 6 | Cuando estoy leyendo un relato, me resulta difícil determinar las intenciones de los personajes. | De acuerdo |
| 7 | Me gustan los eventos sociales y de reunión con varias personas. | En desacuerdo |
| 8 | Cuando hablo por teléfono, no siempre estoy seguro/a de cuándo es mi turno para hablar. | De acuerdo |
| 9 | Me gustan coleccionar información sobre categorías de cosas (tipos de coches, pájaros, trenes, plantas, etc.) | De acuerdo |
| 10 | Me resulta difícil saber cómo terminar una conversación. | De acuerdo |

**Interpretación del score (mostrar al usuario al terminar):**

| Score | Mensaje en pantalla |
|---|---|
| 0 – 5 | "Tu perfil no muestra señales claras de TEA. Si te identificas con estas experiencias de otras formas, considera hablar con un especialista. Script puede ser útil para cualquiera." |
| 6 – 10 | "Muchas personas con TEA se identifican con estas respuestas. Este resultado no es un diagnóstico — solo un especialista puede darlo. Script está diseñado pensando en personas como tú." |

> ⚠️ **Nunca usar las palabras "positivo" o "negativo" para el resultado.** El lenguaje debe ser neutro y de apoyo, nunca alarmista.

---

## Apéndice B — Body Map SVG: Guía de Implementación

El componente `BodyMap.tsx` necesita una silueta humana SVG con 6 zonas táctiles. El AI agent que lo implemente debe seguir estas especificaciones:

**Dimensiones del canvas SVG:** `viewBox="0 0 200 400"`

**Las 6 zonas y sus áreas aproximadas en el SVG:**

| Zona | ID | Área aproximada (x, y, width, height) |
|---|---|---|
| Cabeza / Ojos / Mandíbula | `zone-head` | Círculo: cx=100, cy=45, r=35 |
| Garganta / Cuello | `zone-throat` | Rect: x=85, y=78, w=30, h=25 |
| Pecho / Corazón | `zone-chest` | Ellipse: cx=100, cy=140, rx=45, ry=35 |
| Estómago / Abdomen | `zone-abdomen` | Ellipse: cx=100, cy=200, rx=38, ry=30 |
| Manos / Brazos | `zone-arms` | Dos paths laterales — aprox x=25-65 y x=135-175, y=120-220 |
| Piernas / Pies | `zone-legs` | Rect dividido: x=70, y=240, w=60, h=140 |

**Comportamiento de cada zona:**
```typescript
// Props que debe aceptar el componente
type BodyZone = 'head' | 'throat' | 'chest' | 'abdomen' | 'arms' | 'legs'

interface BodyMapProps {
  selectedZones: BodyZone[]
  onZoneToggle: (zone: BodyZone) => void
  disabled?: boolean
}

// Estados visuales (con NativeWind / SVG fill):
// Default: fill="#EFEFEA" stroke="#E0DDD8" strokeWidth={1.5}
// Selected: fill="#A8C5DA" stroke="#A8C5DA" strokeWidth={2} opacity={0.8}
// Pressed: fill="#A8C5DA" opacity={0.4} (feedback visual inmediato)
```

**Etiquetas de zona (mostrar como chips debajo del SVG):**
```typescript
const ZONE_LABELS: Record<BodyZone, string> = {
  head: 'Cabeza / Ojos / Mandíbula',
  throat: 'Garganta / Cuello',
  chest: 'Pecho / Corazón',
  abdomen: 'Estómago / Abdomen',
  arms: 'Manos / Brazos',
  legs: 'Piernas / Pies',
}
```

---

## Apéndice C — AQ Completo (Autism Quotient — 50 preguntas)

> ⚠️ **Instrucción para AI agents:** Las 50 preguntas deben obtenerse de la fuente oficial:
> Baron-Cohen, S., Wheelwright, S., Skinner, R., Martin, J., & Clubley, E. (2001).
> El cuestionario completo está disponible públicamente en: https://www.autismresearchcentre.com/arc_tests
> No generar preguntas de memoria — usar la fuente.

**Estructura:** 50 preguntas, misma escala que AQ-10 (4 opciones)

**5 dominios (10 preguntas cada uno):**

| Dominio | Qué mide | Score máx |
|---|---|---|
| Habilidades sociales | Dificultad en interacción social | 10 |
| Cambio de atención | Rigidez / dificultad para cambiar de foco | 10 |
| Atención al detalle | Preferencia por detalles locales sobre globales | 10 |
| Comunicación | Dificultades pragmáticas del lenguaje | 10 |
| Imaginación | Dificultad con ficción, perspectivas ajenas | 10 |

**Scoring:**
- Score total: 0–50
- Umbral orientativo: ≥32 (no diagnóstico, solo indicativo)
- Score por dominio: guardado en `aq_full_domain_scores` (JSONB)

**Qué guarda la app:**
```json
{
  "aq_full_score": 38,
  "aq_full_domain_scores": {
    "social": 8,
    "attention_switching": 7,
    "attention_detail": 9,
    "communication": 7,
    "imagination": 7
  }
}
```

---

## Apéndice D — CAT-Q (Camouflaging Autistic Traits Questionnaire — 25 preguntas)

> ⚠️ **Instrucción para AI agents:** Las 25 preguntas deben obtenerse de:
> Hull, L., Mandy, W., Lai, M. C., Baron-Cohen, S., Allison, C., Smith, P., & Petrides, K. V. (2019).
> Development and validation of the Camouflaging Autistic Traits Questionnaire (CAT-Q).
> Journal of Autism and Developmental Disorders, 49(3), 819-833.
> El cuestionario completo está disponible en el supplementary material del paper.
> DOI: 10.1007/s10803-018-3792-6

**Estructura:** 25 preguntas, escala Likert 1–7

| Valor | Etiqueta |
|---|---|
| 1 | Totalmente en desacuerdo |
| 2 | Bastante en desacuerdo |
| 3 | Ligeramente en desacuerdo |
| 4 | Ni de acuerdo ni en desacuerdo |
| 5 | Ligeramente de acuerdo |
| 6 | Bastante de acuerdo |
| 7 | Totalmente de acuerdo |

**3 subescalas:**

| Subescala | # ítems | Score | Qué mide |
|---|---|---|---|
| Asimilación | 9 | 9–63 | Aprender y copiar comportamientos de otros para encajar |
| Compensación | 12 | 12–84 | Estrategias activas para ocultar dificultades sociales |
| Enmascaramiento | 4 | 4–28 | Suprimir características autistas, presentar persona "normal" |

**Score total:** 25–175 (suma de todos los ítems)

**Impacto en el perfil de Script:**
- Enmascaramiento alto (≥20): app refuerza mensajes de autenticidad, reduce presión social
- Compensación alta (≥60): más scripts de estrategias de navegación social
- Asimilación alta (≥45): scripts con observación e imitación explícitas

**Qué guarda la app:**
```json
{
  "catq_total_score": 142,
  "catq_subscores": {
    "assimilation": 52,
    "compensation": 68,
    "masking": 22
  }
}
```

---

## Apéndice E — RAADS–R (Ritvo Autism Asperger Diagnostic Scale-Revised — 80 preguntas)

> ⚠️ **Instrucción para AI agents:** Las 80 preguntas deben obtenerse de:
> Ritvo, R. A., Ritvo, E. R., Guthrie, D., Ritvo, M. J., Hufnagel, D. H., McMahon, W., ... & Eloff, J. (2011).
> The Ritvo Autism Asperger Diagnostic Scale-Revised (RAADS-R).
> Journal of Autism and Developmental Disorders, 41(8), 1076-1089.
> DOI: 10.1007/s10803-010-1133-5

**Estructura:** 80 preguntas, escala 0–3

| Valor | Etiqueta |
|---|---|
| 0 | Nunca es verdad |
| 1 | Verdad solo cuando era joven (hasta los 16 años), no ahora |
| 2 | Verdad solo ahora, no cuando era joven |
| 3 | Verdad ahora y cuando era joven |

**4 dominios:**

| Dominio | # ítems | Score máx | Qué mide |
|---|---|---|---|
| Relaciones sociales | 39 | 117 | Dificultades de reciprocidad social |
| Lenguaje | 7 | 21 | Uso y comprensión del lenguaje |
| Intereses circunscritos | 14 | 42 | Intereses intensos y repetitivos |
| Motor sensorial | 20 | 60 | Procesamiento sensorial y control motor |

**Score total:** 0–240
- Umbral orientativo TEA: ≥65

**Soporte de pausa — OBLIGATORIO:**
Con 80 preguntas, el test debe poder pausarse y retomarse:
- Guardar progreso en `expo-secure-store` después de cada respuesta
- Al abrir de nuevo: preguntar "¿Continuar donde lo dejaste?"
- Mostrar: "Completaste 34 de 80 preguntas"

**Impacto en el perfil de Script:**

| Score alto en... | Impacto en la app |
|---|---|
| Relaciones sociales | Scripts de interacción social marcados como prioritarios |
| Lenguaje | Scripts incluyen más opciones de frase literal/directa |
| Intereses circunscritos | Check-in incluye nota sobre actividades de interés especial |
| Motor sensorial | Perfil sensorial pre-populado con sensibilidades auditivas/táctiles/propioceptivas |

**Qué guarda la app:**
```json
{
  "raads_total_score": 134,
  "raads_domain_scores": {
    "social_relatedness": 72,
    "language": 14,
    "circumscribed_interests": 32,
    "sensory_motor": 16
  }
}
```
