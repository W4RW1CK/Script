# APP_FLOW.md — Flujos de Navegación
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.3  
**Última actualización:** 2026-02-27  
**Cambios v1.2:** IDs de pantallas re-numerados para eliminar duplicados. Referencias cruzadas corregidas. Nuevas pantallas S03-S06 (tests de screening).

---

## Inventario de Pantallas

### Onboarding

| ID | Nombre | Ruta | Descripción |
|---|---|---|---|
| S01 | Splash / Welcome | `/` | Primera pantalla, dos opciones |
| S02 | AQ-10 Test | `/onboarding/aq10` | 10 preguntas orientativas |
| S03 | Resultado AQ-10 + Next Steps | `/onboarding/aq10-result` | Score + tests recomendados |
| S04 | AQ Completo (50 preguntas) | `/onboarding/aq-full` | Solo si AQ-10 ≥6, omitible |
| S05 | CAT-Q (25 preguntas) | `/onboarding/catq` | Mide enmascaramiento, omitible |
| S06 | RAADS-R (80 preguntas) | `/onboarding/raads` | Presentación subcrítica, omitible |
| S07 | Cuestionario Personal | `/onboarding/profile` | Intereses, preferencias sensoriales |
| S08 | Setup Contactos | `/onboarding/contacts` | Agregar personas de confianza (omitible) |
| S24 | Login / Auth | `/auth` | Privy: email/social/wallet |

### App Principal

| ID | Nombre | Ruta | Descripción |
|---|---|---|---|
| S09 | Home | `/home` | Dashboard principal |
| S10 | Check-in — Mapa Corporal | `/checkin/body` | Silueta interactiva |
| S11 | Check-in — Texto Libre | `/checkin/notes` | Input de sensaciones |
| S12 | Check-in — Interpretación IA | `/checkin/reflect` | Opciones de emoción |
| S13 | Check-in — Resultado | `/checkin/result` | Emoción + recomendación |
| S14 | Scripts — Biblioteca | `/scripts` | Lista de scripts disponibles |
| S15 | Script — Detalle / Preparación | `/scripts/[id]` | Vista completa del script |
| S16 | Script — Ejecución | `/scripts/[id]/execute` | Modo tiempo real, paso a paso |
| S17 | Rescate — Evaluación | `/rescue/assess` | Escala de intensidad 1–3 |
| S18 | Rescate — Protocolo | `/rescue/protocol` | Calma multimodal |
| S19 | Historial | `/history` | Check-ins anteriores |
| S20 | Diccionario Emocional | `/dictionary` | Vocabulario personal |
| S21 | Configuración | `/settings` | Perfil, temas, notificaciones |
| S22 | Gestión de Contactos | `/settings/contacts` | Agregar/editar/eliminar |
| S23 | Vista Terapeuta | `/therapist` | Dashboard de paciente (rol terapeuta) |

**Total: 24 pantallas**

---

## Flujos Principales

---

### FLUJO 1: Primera Apertura — Onboarding

**Trigger:** Usuario abre la app por primera vez (sin sesión)

```
S01 Welcome
├── [Botón: "Comenzar mi camino"] → S02 AQ-10
│   ├── Usuario responde 10 preguntas (escala Likert, ver PRD Apéndice A)
│   ├── Resultado calculado (≤5: score bajo / ≥6: score alto)
│   └── → S03 Resultado AQ-10 + Next Steps
│       ├── Muestra score + mensaje NO diagnóstico
│       ├── Score ≥6:
│       │   ├── Recomendación: "Siguiente paso: AQ Completo (50 preguntas)"
│       │   └── [Botón: "Hacer AQ completo ahora"] → S04 AQ Completo
│       │       └── Completado o [Omitir] → S05 CAT-Q (opcional)
│       │           └── Completado o [Omitir] → S06 RAADS-R (opcional)
│       │               └── Completado o [Omitir] → S07 Cuestionario Personal
│       ├── Score <6:
│       │   ├── Recomendación: "Siguiente paso: CAT-Q (mide enmascaramiento)"
│       │   └── [Botón: "Hacer CAT-Q ahora"] → S05 CAT-Q
│       │       └── Completado o [Omitir] → S06 RAADS-R (opcional)
│       │           └── Completado o [Omitir] → S07 Cuestionario Personal
│       └── [Botón: "Saltar tests adicionales"] → S07 Cuestionario Personal
│
│   S07 Cuestionario Personal
│   ├── Preguntas: nombre, edad, intereses (multiselect),
│   │   sensibilidades (luz / sonido / texturas / multitudes),
│   │   herramientas que ya usas (ninguna / journaling / terapia / meditación)
│   └── [Botón: "Continuar"] → S08 Setup Contactos
│       ├── [Botón: "Agregar contacto de confianza"] → Form: nombre + teléfono + relación
│       ├── [Botón: "Omitir por ahora"] → S24 Auth
│       └── [Botón: "Listo"] → S24 Auth
│           └── Auth completado → S09 Home
│
└── [Botón: "Necesito ayuda ahora"] → S17 Rescate (bypass de onboarding)
    └── Al finalizar protocolo → S01 Welcome (opción de completar onboarding)
```

**Reglas de los tests opcionales (S04, S05, S06):**
- Cada test tiene un botón "Omitir por ahora" siempre visible
- Si se omite, aparece disponible en S21 Configuración → "Completar mi perfil"
- Los resultados de cada test se guardan inmediatamente al terminar (no se pierden si cierran la app)
- La barra de progreso es visible pero sin presión: "Pregunta 12 de 25"
- Tests largos (S06 RAADS-R, 80 preguntas) se pueden pausar y continuar

**Errores:**
- AQ-10 sin completar todas las preguntas: mostrar indicador de preguntas pendientes, no bloquear
- Auth falla: mostrar error específico, opción de reintentar o continuar sin cuenta (modo local)

---

### FLUJO 2: Check-in Corporal

**Trigger:** Usuario toca "Check-in" desde S09 Home, o desde notificación recordatorio

```
S09 Home → [Botón: "¿Cómo estás hoy?"] → S10 Mapa Corporal
│
S10 Mapa Corporal
├── Silueta SVG con 6 zonas táctiles (ver PRD Apéndice B):
│   1. Cabeza / Ojos / Mandíbula
│   2. Garganta / Cuello
│   3. Pecho / Corazón
│   4. Estómago / Abdomen
│   5. Manos / Brazos
│   6. Piernas / Pies
├── Usuario toca 1+ zonas → zonas se iluminan con color suave
├── Indicador visual de zonas seleccionadas
└── [Botón: "Describir lo que siento"] → S11 Texto Libre
    │
    S11 Texto Libre
    ├── Campo de texto libre: "¿Qué percibes en esas zonas? Cualquier palabra vale."
    ├── Zonas seleccionadas visibles como chips en la parte superior
    ├── Teclado abre automáticamente
    └── [Botón: "Listo"] (o submit) → S12 Interpretación IA
        │
        S12 Interpretación IA
        ├── Loader: "Conectando los puntos..."
        ├── IA recibe: zonas seleccionadas + texto libre + hora del día + historial reciente
        ├── Muestra 3–5 opciones en formato de tarjeta:
        │   "¿Podría ser algo como... [opción]?"
        │   Ejemplo: "Ansiedad social", "Sobrecarga sensorial", "Agotamiento", "Frustración", "Vacío"
        ├── [Tap en opción] → opción seleccionada / confirmada
        ├── [Botón: "No, ninguna"] → campo de texto: escribe tu propia palabra
        └── [Botón: "Continuar"] → S13 Resultado
            │
            S13 Resultado
            ├── Emoción identificada mostrada con nombre + icono visual
            ├── Sugerencia: script relevante O técnica de regulación
            ├── [Botón: "Ver script sugerido"] → S15 Script Detalle
            ├── [Botón: "Guardar y salir"] → Guardado en historial → S09 Home
            └── [Botón: "🚩 Esto no se siente bien"] → marca interpretación para revisión → S09 Home
```

**Offline:** S10 y S11 funcionan sin conexión. S12 usa interpretación local simplificada (reglas, no IA). Se marca como "pendiente de análisis completo". Al reconectar, se procesa con IA y se actualiza resultado.

**Errores:**
- IA sin respuesta en >5s: mostrar opciones genéricas basadas en zonas seleccionadas
- Sin zonas seleccionadas al avanzar: tooltip "Toca al menos una zona"

---

### FLUJO 3: Scripts Sociales

**Trigger:** Usuario toca "Scripts" desde S09 Home, o desde sugerencia post check-in (S13)

```
S09 Home → [Botón: "Scripts"] → S14 Biblioteca de Scripts
│
S14 Biblioteca
├── Lista de scripts organizados por categoría:
│   - Conversaciones sociales
│   - Lugares públicos
│   - Trabajo / Estudio
│   - Crisis / Sobrecarga
│   - Personalizados (vacío al inicio)
├── Cada tarjeta muestra: nombre + icono + duración estimada + modo (preparación/ejecución)
└── [Tap en script] → S15 Script Detalle
    │
    S15 Script Detalle — Modo Preparación
    ├── Título + descripción del escenario
    ├── Lista de bloques:
    │   [Apertura]: 2–3 opciones de frase
    │   [Contexto]: descripción de la situación
    │   [Petición/Acción]: 2–3 opciones de frase
    │   [Salida]: 2–3 opciones de frase (opcional)
    ├── Usuario puede leer, familiarizarse, marcar favoritos
    ├── [Botón: "Modo Ejecución"] → S16 Script Ejecución
    └── [Botón: "← Volver"] → S14 Biblioteca
        │
        S16 Script Ejecución — Tiempo Real
        ├── Un bloque visible a la vez (pantalla limpia, mínima)
        ├── Bloque actual en grande con 2–3 opciones de frase
        ├── Usuario toca la frase que va a usar → se resalta
        ├── [Botón: "→ Siguiente"] → siguiente bloque
        ├── [Botón: "← Atrás"] → bloque anterior
        ├── Indicador de progreso (1/4, 2/4, etc.)
        └── Último bloque: [Botón: "✓ Listo"] → pantalla de cierre
            ├── "¿Cómo resultó?" — escala 1-3 (Bien / Regular / Difícil)
            └── Guardado en historial → S09 Home
```

**Errores:**
- Script sin conexión: funciona completamente offline (contenido cacheado)

---

### FLUJO 4: Botón de Rescate

**Trigger:** Usuario toca botón de rescate (siempre visible, FAB flotante sobre bottom nav)

```
[Botón Rescate — cualquier pantalla] → S17 Rescate Evaluación
│
S17 Evaluación (pantalla neutra, contraste reducido)
├── Texto mínimo: "¿Qué tan intenso se siente esto?"
├── Tres opciones táctiles grandes:
│   1️⃣ Incómodo   2️⃣ Difícil   3️⃣ No puedo
└── [Tap en opción] → S18 Protocolo (según nivel)
    │
    S18 Protocolo de Calma
    │
    ├── NIVEL 1 — Grounding 5-4-3-2-1
    │   ├── Secuencia multimodal (visual + voz guiada + háptico):
    │   │   5 cosas que puedes VER / 4 que puedes TOCAR /
    │   │   3 que puedes OÍR / 2 que puedes OLER / 1 que puedes SABOREAR
    │   ├── Una instrucción a la vez, fuente grande, fondo neutro
    │   ├── Audio: tone-grounding-voice.mp3 (voz) + tone-ambient.mp3 (fondo)
    │   ├── Háptico: vibración sutil al cambiar de paso (si disponible)
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
            ├── [Botón: "Me siento mejor"] → S09 Home
            ├── [Botón: "Necesito más ayuda"] → opciones de contacto directo
            └── [Botón: "Registrar cómo resultó"] → mini check-in post-crisis → S09 Home
```

**Reglas críticas de UI en S17 y S18:**
- Fondo: color neutro (`color-crisis-bg`, ver FRONTEND_GUIDELINES.md)
- Animaciones: MÍNIMAS o ninguna (excepto el círculo de respiración)
- Texto: máximo 5 palabras por instrucción en nivel 3
- Botón de salida siempre visible: "← Salir del protocolo"
- Sin bottom navigation visible

---

### FLUJO 5: Configuración y Perfil

**Trigger:** Usuario toca ⚙️ en bottom navigation

```
S09 Home → [Tab: Configuración] → S21 Configuración
├── Sección: Perfil
│   ├── Nombre, foto, edad
│   └── Editar cuestionario personal
├── Sección: Completar mi perfil
│   ├── Tests pendientes con estado visual: ⏳ AQ Completo / ✅ CAT-Q / ⏳ RAADS-R
│   └── [Tap en test pendiente] → pantalla de test correspondiente (S04 / S05 / S06)
├── Sección: Apariencia
│   ├── Modo: Claro / Oscuro / Sistema
│   ├── Paleta de colores (5 opciones pastel)
│   └── Animaciones: Activadas / Reducidas / Desactivadas
├── Sección: Personas de Confianza → S22 Gestión de Contactos
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

**Trigger:** Usuario con rol `therapist` ingresa a la app

```
S24 Auth (rol terapeuta) → S23 Dashboard Terapeuta
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

Disponible en **todas las pantallas excepto** onboarding (S01–S08), protocolo de rescate (S17, S18), y auth (S24).

| Tab | Ícono | Destino |
|---|---|---|
| Home | 🏠 | S09 Home |
| Check-in | ✋ | S10 Mapa Corporal |
| Scripts | 📋 | S14 Biblioteca |
| Historial | 📊 | S19 Historial |
| Configuración | ⚙️ | S21 Configuración |

**Botón de Rescate (FAB):** Siempre visible en todas las pantallas de la app principal (S09–S22). Posición: bottom-right, sobre el bottom nav. Color: `color-crisis-soft` (suave, nunca rojo alarma). Navega a S17.

---

## Reglas de Navegación Globales

1. El botón de rescate (→ S17) es accesible en **máximo 1 tap** desde cualquier pantalla de la app
2. Ninguna pantalla requiere scroll horizontal
3. Toda acción destructiva (eliminar, desconectar terapeuta) requiere confirmación de 2 pasos
4. El botón "← Atrás" siempre disponible excepto en S09 Home y S01 Welcome
5. En protocolo de crisis (S17, S18): solo existe "continuar protocolo" o "salir del protocolo"
6. Onboarding: AQ-10 obligatorio; AQ Completo, CAT-Q, RAADS-R opcionales
7. Los tests opcionales omitidos quedan accesibles en S21 → "Completar mi perfil"
