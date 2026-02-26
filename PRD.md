# PRD.md — Product Requirements Document
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.1  
**Última actualización:** 2026-02-26  
**Cambios v1.1:** Agregadas preguntas AQ-10 en Apéndice A, guidance de body map SVG en Apéndice B.
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
- **Pantalla de bienvenida** con opción "Modo Calma" (bypass directo a crisis si se necesita)
- **Test AQ-10** (Autism Quotient-10): 10 preguntas, resultado orientativo (no diagnóstico)
  - Resultado bajo: app disponible, mensaje alentando diagnóstico formal
  - Resultado alto: perfil semilla pre-configurado con patrones TEA comunes
- **Cuestionario personal:** nombre, intereses, actividades, preferencias sensoriales (5–8 preguntas)
- **Configuración de personas de confianza** (opcional, omitible, siempre editable)

**Criterio de éxito:** Usuario completa onboarding en menos de 5 minutos.

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
   - **Nivel 2:** Respiración guiada (visual + audio + háptico)
   - **Nivel 3:** Respiración + notificación automática a red de confianza
4. **Secuencia de calma multimodal:**
   - Visual: círculo que expande/contrae al ritmo de respiración
   - Audio: tono suave al ritmo (activable/desactivable)
   - Háptico: vibración sutil al ritmo (si dispositivo lo permite)
5. **Notificación a red de confianza (nivel 2–3):**
   - Si online: push notification nativa con ubicación + contexto breve
   - Si offline: SMS nativo pre-formateado como fallback
   - Mensajes a todos los contactos en paralelo
6. Opciones al finalizar: "Me siento mejor" / "Necesito más ayuda" / "Llamar a alguien"

**En crisis real (nivel 3):** Instrucciones mínimas de 2–3 palabras. Sin texto largo.

**Criterio de éxito:** Usuario puede activar el protocolo con una mano, en oscuridad, bajo estrés.

---

## 4. Features — Post-MVP (Semanas 2–5)

### Semana 2
- Autenticación completa (Privy: email/social + wallet)
- Historial de check-ins con visualización de patrones básicos
- Diccionario emocional personal (vocabulario que crece con uso)
- Personalización: modo claro/oscuro, paleta de colores, animaciones on/off

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
- Modo offline completo con sincronización inteligente
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
6. **Acceso de emergencia:** El botón de rescate es alcanzable en máximo 2 taps desde cualquier pantalla

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
