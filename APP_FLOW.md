# APP_FLOW.md — Flujos de Navegación
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.0  
**Última actualización:** 2026-02-25

---

## Inventario de Pantallas

| ID | Nombre | Ruta | Descripción |
|---|---|---|---|
| S01 | Splash / Welcome | `/` | Primera pantalla, dos opciones |
| S02 | AQ-10 Test | `/onboarding/aq10` | 10 preguntas orientativas |
| S03 | Cuestionario Personal | `/onboarding/profile` | Intereses, preferencias sensoriales |
| S04 | Setup Contactos | `/onboarding/contacts` | Agregar personas de confianza (omitible) |
| S05 | Home | `/home` | Dashboard principal |
| S06 | Check-in — Mapa Corporal | `/checkin/body` | Silueta interactiva |
| S07 | Check-in — Texto Libre | `/checkin/notes` | Input de sensaciones |
| S08 | Check-in — Interpretación IA | `/checkin/reflect` | Opciones de emoción |
| S09 | Check-in — Resultado | `/checkin/result` | Emoción + recomendación |
| S10 | Scripts — Biblioteca | `/scripts` | Lista de scripts disponibles |
| S11 | Script — Detalle / Preparación | `/scripts/[id]` | Vista completa del script |
| S12 | Script — Ejecución | `/scripts/[id]/execute` | Modo tiempo real, paso a paso |
| S13 | Rescate — Evaluación | `/rescue/assess` | Escala de intensidad 1–3 |
| S14 | Rescate — Protocolo | `/rescue/protocol` | Calma multimodal |
| S15 | Historial | `/history` | Check-ins anteriores |
| S16 | Diccionario Emocional | `/dictionary` | Vocabulario personal |
| S17 | Configuración | `/settings` | Perfil, temas, notificaciones |
| S18 | Gestión de Contactos | `/settings/contacts` | Agregar/editar/eliminar |
| S19 | Vista Terapeuta | `/therapist` | Dashboard de paciente (rol terapeuta) |
| S20 | Login / Auth | `/auth` | Privy: email/social/wallet |

---

## Flujos Principales

---

### FLUJO 1: Primera Apertura — Onboarding

**Trigger:** Usuario abre la app por primera vez (sin sesión)

```
S01 Welcome
├── [Botón: "Comenzar mi camino"] → S02 AQ-10
│   ├── Usuario responde 10 preguntas (escala Likert)
│   ├── Resultado calculado (≤6: orientativo bajo / ≥7: perfil TEA probable)
│   ├── Pantalla de resultado con mensaje NO diagnóstico
│   │   ├── Score bajo: "Esto no es un diagnóstico. Script es para cualquiera que necesite apoyo."
│   │   └── Score alto: "Muchas personas con TEA se identifican con esto. Considera hablar con un especialista."
│   └── [Botón: "Continuar"] → S03 Cuestionario Personal
│       ├── Preguntas: nombre, edad, intereses (multiselect), 
│         sensibilidades (luz / sonido / texturas / multitudes),
│         herramientas que ya usas (ninguna / journaling / terapia / meditación)
│       └── [Botón: "Continuar"] → S04 Setup Contactos
│           ├── [Botón: "Agregar contacto de confianza"] → Form: nombre + teléfono + relación
│           ├── [Botón: "Omitir por ahora"] → S20 Auth
│           └── [Botón: "Listo"] → S20 Auth
│               └── Auth completado → S05 Home
│
└── [Botón: "Necesito ayuda ahora"] → S13 Rescate (bypass de onboarding)
    └── Al finalizar protocolo → S01 Welcome (opción de completar onboarding)
```

**Errores:**
- AQ-10 sin completar todas las preguntas: mostrar indicador de preguntas pendientes, no bloquear
- Auth falla: mostrar error específico, opción de reintentar o continuar sin cuenta (modo local)

---

### FLUJO 2: Check-in Corporal

**Trigger:** Usuario toca "Check-in" desde S05 Home, o desde notificación recordatorio

```
S05 Home → [Botón: "¿Cómo estás hoy?"] → S06 Check-in Mapa Corporal
│
S06 Mapa Corporal
├── Silueta SVG con 6 zonas táctiles:
│   1. Cabeza / Ojos / Mandíbula
│   2. Garganta / Cuello  
│   3. Pecho / Corazón
│   4. Estómago / Abdomen
│   5. Manos / Brazos
│   6. Piernas / Pies
├── Usuario toca 1+ zonas → zonas se iluminan con color suave
├── Indicador visual de zonas seleccionadas
└── [Botón: "Describir lo que siento"] → S07 Texto Libre
    │
    S07 Texto Libre
    ├── Campo de texto libre: "¿Qué percibes en esas zonas? Cualquier palabra vale."
    ├── Zonas seleccionadas visibles como chips en la parte superior
    ├── Teclado abre automáticamente
    └── [Botón: "Listo"] (o submit) → S08 Interpretación IA
        │
        S08 Interpretación IA
        ├── Loader: "Conectando los puntos..."
        ├── IA recibe: zonas seleccionadas + texto libre + hora del día + historial reciente
        ├── Muestra 3–5 opciones en formato de tarjeta:
        │   "¿Podría ser algo como... [opción]?"
        │   Ejemplo: "Ansiedad social", "Sobrecarga sensorial", "Agotamiento", "Frustración", "Vacío"
        ├── [Tap en opción] → opción seleccionada / confirmada
        ├── [Botón: "No, ninguna"] → campo de texto: escribe tu propia palabra
        └── [Botón: "Continuar"] → S09 Resultado
            │
            S09 Resultado
            ├── Emoción identificada mostrada con nombre + icono visual
            ├── Sugerencia: script relevante O técnica de regulación
            ├── [Botón: "Ver script sugerido"] → S11 Script Detalle
            ├── [Botón: "Guardar y salir"] → Guardado en historial → S05 Home
            └── [Botón: "🚩 Esto no se siente bien"] → marca interpretación para revisión → S05 Home
```

**Offline:** S06 y S07 funcionan sin conexión. S08 usa interpretación local simplificada (reglas, no IA). Se marca como "pendiente de análisis completo". Al reconectar, se procesa con IA y se actualiza resultado.

**Errores:**
- IA sin respuesta en >5s: mostrar opciones genéricas basadas en zonas seleccionadas
- Sin zonas seleccionadas al avanzar: tooltip "Toca al menos una zona"

---

### FLUJO 3: Scripts Sociales

**Trigger:** Usuario toca "Scripts" desde S05 Home, o desde sugerencia post check-in

```
S05 Home → [Botón: "Scripts"] → S10 Biblioteca de Scripts
│
S10 Biblioteca
├── Lista de scripts organizados por categoría:
│   - Conversaciones sociales
│   - Lugares públicos
│   - Trabajo / Estudio
│   - Crisis / Sobrecarga
│   - Personalizados (vacío al inicio)
├── Cada tarjeta muestra: nombre + icono + duración estimada + modo (preparación/ejecución)
└── [Tap en script] → S11 Script Detalle
    │
    S11 Script Detalle — Modo Preparación
    ├── Título + descripción del escenario
    ├── Lista de bloques:
    │   [Apertura]: 2–3 opciones de frase
    │   [Contexto]: descripción de la situación
    │   [Petición/Acción]: 2–3 opciones de frase
    │   [Salida]: 2–3 opciones de frase (opcional)
    ├── Usuario puede leer, familiarizarse, marcar favoritos
    ├── [Botón: "Modo Ejecución"] → S12 Script Ejecución
    └── [Botón: "← Volver"] → S10 Biblioteca
        │
        S12 Script Ejecución — Tiempo Real
        ├── Un bloque visible a la vez (pantalla limpia, mínima)
        ├── Bloque actual en grande con 2–3 opciones de frase
        ├── Usuario toca la frase que va a usar → se resalta
        ├── [Botón: "→ Siguiente"] → siguiente bloque
        ├── [Botón: "← Atrás"] → bloque anterior
        ├── Indicador de progreso (1/4, 2/4, etc.)
        └── Último bloque: [Botón: "✓ Listo"] → pantalla de cierre
            ├── "¿Cómo resultó?" — escala 1-3 (Bien / Regular / Difícil)
            └── Guardado en historial → S05 Home
```

**Errores:**
- Script sin conexión: funciona completamente offline (contenido cacheado)

---

### FLUJO 4: Botón de Rescate

**Trigger:** Usuario toca botón de rescate (siempre visible, bottom nav o floating button)

```
[Botón Rescate — cualquier pantalla] → S13 Rescate Evaluación
│
S13 Evaluación (pantalla neutra, contraste reducido)
├── Texto mínimo: "¿Qué tan intenso se siente esto?"
├── Tres opciones táctiles grandes:
│   1️⃣ Incómodo   2️⃣ Difícil   3️⃣ No puedo
└── [Tap en opción] → S14 Protocolo (según nivel)
    │
    S14 Protocolo de Calma
    │
    ├── NIVEL 1 — Grounding 5-4-3-2-1
    │   ├── Secuencia guiada visual:
    │   │   5 cosas que puedes VER / 4 que puedes TOCAR /
    │   │   3 que puedes OÍR / 2 que puedes OLER / 1 que puedes SABOREAR
    │   ├── Una instrucción a la vez, fuente grande, fondo neutro
    │   └── [Botón: "Siguiente"] avanza / auto-avanza en 10s
    │
    ├── NIVEL 2 — Respiración Guiada
    │   ├── Círculo SVG: expande (inhalar 4s) → pausa (2s) → contrae (exhalar 6s)
    │   ├── Audio: tono suave sincronizado (activable)
    │   ├── Háptico: vibración sutil sincronizada (si disponible)
    │   ├── Sin texto largo — solo "Inhala" / "Pausa" / "Exhala"
    │   ├── 3 ciclos mínimo, el usuario puede extender
    │   └── → Transición a Grounding 5-4-3-2-1
    │
    └── NIVEL 3 — Respiración + Activación de Red
        ├── Inicia respiración guiada (igual que Nivel 2)
        ├── Simultáneamente (background):
        │   ├── Si online → push notification a todos los contactos:
        │   │   "[Nombre] necesita apoyo. Ubicación adjunta."
        │   │   Contactos ven: nombre + ubicación + contexto breve + 3 opciones respuesta
        │   └── Si offline → SMS nativo fallback:
        │       "[Nombre] está pasando un momento difícil. Por favor contáctale."
        ├── Respuestas de contactos aparecen en pantalla como notificación suave
        └── Al completar respiración → opciones finales:
            ├── [Botón: "Me siento mejor"] → S05 Home
            ├── [Botón: "Necesito más ayuda"] → opciones de contacto directo
            └── [Botón: "Registrar cómo resultó"] → mini check-in post-crisis

```

**Reglas críticas de UI en pantalla de rescate:**
- Fondo: color neutro (no blanco puro, no negro puro)
- Animaciones: MÍNIMAS o ninguna (excepto la respiración guiada)
- Texto: máximo 5 palabras por instrucción en nivel 3
- Botón de salida siempre visible: "← Salir del protocolo"

---

### FLUJO 5: Configuración y Perfil

```
S05 Home → [Ícono Settings] → S17 Configuración
├── Sección: Perfil
│   ├── Nombre, foto, edad
│   └── Editar cuestionario personal
├── Sección: Apariencia
│   ├── Modo: Claro / Oscuro / Sistema
│   ├── Paleta de colores (5 opciones pastel)
│   └── Animaciones: Activadas / Reducidas / Desactivadas
├── Sección: Personas de Confianza → S18 Gestión de Contactos
│   ├── Lista de contactos configurados
│   ├── [Botón: "+ Agregar contacto"]
│   ├── Por contacto: nombre + relación + canal (push/SMS) + qué puede ver
│   └── Opción: eliminar / desactivar temporalmente
├── Sección: Notificaciones
│   ├── Recordatorio diario: on/off + hora preferida
│   └── Notificaciones de contactos: on/off
└── Sección: Datos y Privacidad
    ├── Qué se comparte con terapeuta (selección granular)
    ├── Exportar mis datos
    └── Eliminar cuenta
```

---

### FLUJO 6: Vista Terapeuta (Semana 4+)

**Trigger:** Usuario con rol "terapeuta" ingresa a la app

```
S20 Auth (rol terapeuta) → S19 Dashboard Terapeuta
├── Lista de pacientes vinculados
└── [Tap en paciente] → Vista de Paciente
    ├── Resumen: últimos 7 días de check-ins
    ├── Patrones detectados (IA)
    ├── Scripts activos del paciente
    │   ├── [Botón: "Sugerir script"] → crear/editar script para este paciente
    │   └── [Botón: "Aprobar script del paciente"]
    ├── Interpretaciones marcadas con 🚩
    └── [Botón: "Generar reporte"] → PDF/resumen enviado a medio predefinido
```

---

## Navegación Persistente (Bottom Navigation)

Disponible en todas las pantallas excepto onboarding y protocolo de rescate:

| Tab | Ícono | Destino |
|---|---|---|
| Home | 🏠 | S05 Home |
| Check-in | ✋ | S06 Mapa Corporal |
| Scripts | 📋 | S10 Biblioteca |
| Historial | 📊 | S15 Historial |
| Configuración | ⚙️ | S17 Configuración |

**Botón de Rescate:** Siempre visible como botón flotante o en posición prominente. Color: suave pero distinguible. No agresivo visualmente.

---

## Reglas de Navegación Globales

1. El botón de rescate es accesible en **máximo 2 taps** desde cualquier pantalla
2. Ninguna pantalla requiere scroll horizontal
3. Toda acción destructiva (eliminar, desconectar terapeuta) requiere confirmación de 2 pasos
4. El botón "← Atrás" siempre disponible excepto en Home
5. En protocolo de crisis: solo existe "continuar protocolo" o "salir del protocolo" — sin distracciones
6. Onboarding: se puede omitir el AQ-10 pero queda marcado como pendiente
