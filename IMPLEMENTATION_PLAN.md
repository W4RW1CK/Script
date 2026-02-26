# IMPLEMENTATION_PLAN.md — Plan de Implementación
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.3  
**Última actualización:** 2026-02-26  
**Cambios v1.3:** FASE 1.1 — agregado expo-symbols al install; corregido @supabase/supabase-js de npx expo install → npm install@2.97.0 (versión pinneada, consistente con TECH_STACK.md).  
**Cambios v1.2:** Screen IDs actualizados (S06-S14 → S10-S18). expo-av→expo-audio. react-native-worklets, @privy-io/expo y expo-device agregados al install. Pasos 13-14 agregados en Fase 1.8 (profile.tsx, contacts.tsx). Semana 2 Step 2.1 corregido. Directorio de tests en Fase 1.1.
**Duración total:** 5 semanas  
**Entrega intermedia:** Semana 1 (lunes)

> **Instrucción para AI agents:** Ejecuta los pasos en el orden exacto indicado. Cada paso referencia documentos canónicos. No tomes decisiones de stack, diseño o arquitectura fuera de lo especificado en PRD.md, TECH_STACK.md, FRONTEND_GUIDELINES.md y BACKEND_STRUCTURE.md.

---

## SEMANA 1 — MVP: Check-in + Scripts + Rescate
**Objetivo:** App funcional con las 3 features core. Entregable el lunes.

---

### FASE 1.1 — Setup del Proyecto
**Referencias:** TECH_STACK.md § Inicialización del Proyecto

```bash
# Paso 1: Crear proyecto Expo
npx create-expo-app@latest script-app --template tabs
cd script-app

# Paso 2: Limpiar template — eliminar archivos innecesarios
# Borrar: app/(tabs)/explore.tsx, components/ParallaxScrollView.tsx,
#         components/ThemedText.tsx, components/ThemedView.tsx

# Paso 3: Instalar dependencias (exactamente en este orden)
# ⚠️ react-native-worklets DEBE ir antes que react-native-reanimated
npx expo install expo-router
npx expo install react-native-svg
npx expo install react-native-worklets react-native-reanimated
npx expo install expo-audio expo-haptics expo-notifications expo-device
npx expo install expo-location expo-sms
npx expo install expo-secure-store @react-native-async-storage/async-storage
npx expo install expo-font @expo-google-fonts/inter
npx expo install expo-symbols
npm install @supabase/supabase-js@2.97.0
npm install @privy-io/expo@0.63.6
npm install openai@6.25.0
npm install zustand@5.0.11 @tanstack/react-query@5.90.21
npm install date-fns@4.1.0 zod@4.3.6
npm install react-hook-form@7.55.0 @hookform/resolvers@5.2.2
npm install nativewind@4.2.2 tailwindcss@3.4.0
npm install --save-dev @types/react @types/react-native

# Paso 4: Configurar NativeWind
# Crear tailwind.config.js con content paths correctos para Expo Router
# Agregar NativeWind plugin a babel.config.js

# Paso 5: Configurar estructura de carpetas
mkdir -p app/\(onboarding\) app/\(app\)/checkin app/\(app\)/scripts app/\(app\)/rescue
mkdir -p app/\(app\)/settings app/therapist
mkdir -p components/ui components/body-map components/scripts components/rescue
mkdir -p lib hooks stores types constants supabase/functions/interpret-checkin
mkdir -p supabase/functions/send-crisis-notification supabase/functions/sync-privy-user
```

**Verificación:** `npx expo start` corre sin errores. Expo Go conecta.

---

### FASE 1.2 — Configuración de Variables y Supabase

**Referencias:** TECH_STACK.md § Variables de Entorno, BACKEND_STRUCTURE.md § 2

```
Paso 1: Crear .env.local con variables de Supabase (ver TECH_STACK.md)
Paso 2: Crear lib/supabase.ts con el cliente configurado
Paso 3: En Supabase Dashboard → SQL Editor, ejecutar el SQL de BACKEND_STRUCTURE.md §2
        en este orden:
        a) Tabla users
        b) Tabla profiles
        c) Tabla scripts
        d) Tabla checkins
        e) Tabla emotional_dictionary
        f) Tabla trusted_contacts
        g) Tabla crisis_events
        h) Tabla therapist_patients
        i) Tabla script_executions
Paso 4: En Supabase → Authentication → Activar provider "Email" (magic link)
Paso 5: Ejecutar RLS policies de BACKEND_STRUCTURE.md §3
Paso 6: Ejecutar seed de scripts predefinidos de BACKEND_STRUCTURE.md §6
```

**Verificación:** `supabase.from('scripts').select('*')` retorna 5 scripts.

---

### FASE 1.3 — Sistema de Temas y Componentes Base

**Referencias:** FRONTEND_GUIDELINES.md § 1, 2, 3, 4

```
Paso 1: Crear constants/colors.ts con todos los tokens de color (light + dark)
Paso 2: Crear constants/typography.ts con la escala tipográfica
Paso 3: Crear constants/spacing.ts con la escala de espaciado
Paso 4: Crear hook hooks/useTheme.ts que lee preferencia del sistema
Paso 5: Crear componentes UI base:
        a) components/ui/Button.tsx (primary, secondary, ghost, danger)
        b) components/ui/Card.tsx
        c) components/ui/TextInput.tsx
        d) components/ui/Chip.tsx
        e) components/ui/Typography.tsx (Heading, Body, Caption)
Paso 6: Crear components/ui/SafeScreen.tsx (wrapper con SafeAreaView + tema)
```

**Verificación:** Renderizar cada componente en una pantalla de prueba. Verificar en modo claro y oscuro.

---

### FASE 1.4 — Bottom Navigation y Layout Principal

**Referencias:** APP_FLOW.md § Navegación Persistente, FRONTEND_GUIDELINES.md § 4

```
Paso 1: Configurar app/(app)/_layout.tsx con Tab Navigator (Expo Router)
Paso 2: Implementar 5 tabs: Home, Check-in, Scripts, Historial, Settings
        - Usar íconos de FRONTEND_GUIDELINES.md §8
        - Colores activo/inactivo según FRONTEND_GUIDELINES.md §4
Paso 3: Agregar botón de Rescate flotante (FAB) visible en todas las tabs
        - Posición: bottom-right, encima del bottom nav
        - Color: color-crisis-soft (suave, no alarmista)
        - Navega a: /rescue/assess
Paso 4: Crear app/(app)/home.tsx — pantalla Home básica con:
        - Saludo con nombre del usuario
        - Botón grande "¿Cómo estás hoy?" → /checkin/body
        - Acceso rápido a Scripts
        - Acceso rápido al último check-in
```

**Verificación:** Navegación entre tabs funciona. FAB visible y navega correctamente.

---

### FASE 1.5 — Check-in Corporal (Feature Core #1)

**Referencias:** APP_FLOW.md § FLUJO 2, FRONTEND_GUIDELINES.md §5, BACKEND_STRUCTURE.md §2 (checkins)

```
Paso 1: Crear componente components/body-map/BodyMap.tsx
        - SVG con silueta humana (frente)
        - 6 zonas táctiles como definidas en FRONTEND_GUIDELINES.md §5
        - Estado por zona: default / pressed / selected
        - Soporte multi-selección
        - Emite evento: onZonesChange(zones: string[])

Paso 2: Crear app/(app)/checkin/body.tsx (S10)
        - Render BodyMap
        - Header: "¿Qué siente tu cuerpo?"
        - Instrucción: "Toca las zonas donde sientes algo"
        - Chips con zonas seleccionadas
        - Botón "Describir lo que siento" (deshabilitado si 0 zonas)
        - Guarda zonas seleccionadas en estado local

Paso 3: Crear app/(app)/checkin/notes.tsx (S11)
        - Muestra zonas seleccionadas como chips (read-only)
        - TextInput multiline: "¿Qué percibes ahí?"
        - Placeholder: "Cualquier palabra vale. Presión, calor, nada, mariposas..."
        - Botón "Listo" → navega a /checkin/reflect
        - Guarda texto en estado

Paso 4: Crear app/(app)/checkin/reflect.tsx (S12)
        - Loader animado: "Conectando los puntos..."
        - Llamar a Supabase Edge Function interpret-checkin
          (Si edge function no está lista: usar mock con 5 opciones hardcodeadas)
        - Mostrar 3-5 opciones como tarjetas seleccionables
        - Botón "Ninguna de estas" → TextInput para escribir propia
        - Botón "Continuar" → /checkin/result

Paso 5: Crear app/(app)/checkin/result.tsx (S13)
        - Mostrar emoción confirmada con ícono visual
        - Texto: "Gracias por explorar esto."
        - Si hay script sugerido: mostrar tarjeta con botón "Ver script"
        - Botón "Guardar" → inserta en tabla checkins → S09 Home
        - Botón "🚩 Esto no se siente bien" → marca flagged_for_review = true

Paso 6: Crear Supabase Edge Function: interpret-checkin
        - Runtime: Deno
        - Importar OpenAI
        - System prompt con contexto TEA (ver instrucciones en este mismo paso)
        - Retornar JSON con array de opciones
        
        SYSTEM PROMPT BASE:
        "Eres un asistente especializado en apoyar a personas con TEA Nivel 1 
        a identificar sus emociones. Tu rol es proponer, no diagnosticar. 
        Usa lenguaje de exploración: '¿Podría ser...?', 'Algunas personas describen esto como...'
        Nunca uses: 'Tú sientes', 'Esto es', 'Claramente'.
        Responde SIEMPRE en español.
        Devuelve un JSON con: { options: [{label, description, confidence}] }
        Máximo 5 opciones. Mínimo 3."
```

**Verificación:** Usuario puede completar un check-in de inicio a fin. Dato guardado en Supabase.

---

### FASE 1.6 — Scripts Sociales (Feature Core #2)

**Referencias:** APP_FLOW.md § FLUJO 3, BACKEND_STRUCTURE.md §6

```
Paso 1: Crear app/(app)/scripts/index.tsx (S14)
        - Fetch de scripts (predefinidos + personalizados del usuario)
        - Agrupar por categoría
        - Tarjeta por script: título + ícono de categoría + duración estimada
        - Sin búsqueda en MVP (lista simple)

Paso 2: Crear app/(app)/scripts/[id].tsx (S15 — Modo Preparación)
        - Título y descripción del script
        - Renderizar cada bloque:
          - type "apertura" / "accion" / "salida": mostrar opciones como chips seleccionables
          - type "contexto": texto descriptivo (no interactivo)
        - Botón "Modo Ejecución" → /scripts/[id]/execute
        - Botón "← Volver" → /scripts

Paso 3: Crear app/(app)/scripts/[id]/execute.tsx (S16 — Modo Ejecución)
        - Estado: bloque actual (índice)
        - Un bloque visible a la vez (pantalla limpia)
        - Para bloques con opciones: tarjetas táctiles grandes
        - Opción seleccionada se resalta
        - Botón "→ Siguiente" / "← Atrás"
        - Indicador de progreso: "Paso 2 de 4"
        - Último bloque: botón "✓ Completado"
        - Pantalla de cierre: escala 1-3 + guardar en script_executions → S09 Home
```

**Verificación:** Usuario puede navegar y ejecutar los 5 scripts predefinidos.

---

### FASE 1.7 — Botón de Rescate (Feature Core #3)

**Referencias:** APP_FLOW.md § FLUJO 4, FRONTEND_GUIDELINES.md §11, BACKEND_STRUCTURE.md §2 (crisis_events)

```
Paso 1: Crear app/(app)/rescue/assess.tsx (S17)
        - APLICAR TODAS las reglas de FRONTEND_GUIDELINES.md §11
        - Texto: "¿Qué tan intenso se siente esto?"
        - 3 botones grandes (mínimo 64px alto):
          1️⃣ "Incómodo"   2️⃣ "Difícil"   3️⃣ "No puedo"
        - Guardar nivel en estado
        - → /rescue/protocol (pasar nivel como parámetro)
        - Botón "← Salir" (arriba izquierda, siempre visible)

Paso 2: Crear app/(app)/rescue/protocol.tsx (S18)
        - APLICAR TODAS las reglas de FRONTEND_GUIDELINES.md §11
        
        A) Si nivel === 1: Renderizar GroundingSequence
           - Componente que muestra pasos 5-4-3-2-1
           - Un paso a la vez, fuente grande
           - Auto-avanza en 12s o tap para avanzar
        
        B) Si nivel === 2 o 3: Renderizar BreathingGuide
           - Componente con círculo SVG animado (ver FRONTEND_GUIDELINES.md §6)
           - Integrar expo-haptics: vibración sutil al ritmo
           - Integrar expo-audio (NO expo-av): cargar y reproducir audio (si usuario lo activó)
             Ejemplo: const player = useAudioPlayer(require('../../assets/audio/calm-tone.mp3'))
           - 3 ciclos mínimo (inhalar 4s + pausa 2s + exhalar 6s = 12s por ciclo)
           - Después de ciclos: mostrar opciones finales
        
        C) Si nivel === 3 (adicional):
           - Background: pedir permiso de ubicación si no está concedido
           - Llamar a Supabase Edge Function send-crisis-notification
           - Mostrar confirmación suave: "Avisando a tus contactos..."
        
        D) Opciones finales (todos los niveles):
           - "Me siento mejor" → S09 Home
           - "Necesito más ayuda" → mostrar botón de llamada directa al contacto #1
           - "Registrar" → mini form (1 campo: ¿cómo resultó?) → crisis_events → S09 Home

Paso 3: Crear Supabase Edge Function: send-crisis-notification
        - Buscar trusted_contacts del usuario
        - Para cada contacto activo: llamar Expo Push API
        - Guardar registro en crisis_events
        - Retornar { notified: number }
        
        Formato de notificación push:
        Título: "⚡ [Nombre] necesita apoyo"
        Cuerpo: "Está teniendo un momento difícil. [Dirección si disponible]"
        Data: { type: 'crisis', user_id, latitude?, longitude? }
```

**Verificación:** Protocolo completo funciona (nivel 1, 2, y 3). Notificación llega a un dispositivo de prueba.

---

### FASE 1.8 — Auth Básico + Onboarding Completo

**Referencias:** TECH_STACK.md § Autenticación, BACKEND_STRUCTURE.md §8, PRD.md §3.1 + Apéndices A-E, APP_FLOW.md § FLUJO 1

```
Paso 1: Instalar @privy-io/expo y configurar PrivyProvider en app/_layout.tsx
Paso 2: Crear app/auth.tsx con:
        - Botón "Continuar con email" (magic link)
        - Botón "Continuar con Google"
        - Texto: "Sin cuenta, solo un email. Tus datos son tuyos."
Paso 3: Crear Supabase Edge Function sync-privy-user:
        - Recibe privy_user_id + email
        - Crea o actualiza registro en users
        - Retorna Supabase user token
Paso 4: Configurar redirect post-auth:
        - Si onboarding_complete = false → /onboarding
        - Si onboarding_complete = true → /home
Paso 5: Crear app/(onboarding)/index.tsx (S01 Welcome):
        - Pantalla con logo/nombre "Script"
        - Tagline: "Un manual para quienes sienten que son el único actor que no conoce el guión"
        - Botón "Comenzar mi camino" → /onboarding/aq10
        - Botón "Necesito ayuda ahora" → /rescue/assess

Paso 6: Crear app/(onboarding)/aq10.tsx (S02):
        - 10 preguntas del PRD Apéndice A, UNA por pantalla
        - Escala: 4 opciones (Totalmente de acuerdo / Ligeramente de acuerdo /
          Ligeramente en desacuerdo / Totalmente en desacuerdo)
        - Barra de progreso: "Pregunta X de 10"
        - Sin botón "atrás" entre preguntas (para evitar over-thinking)
        - Al terminar: calcular score y navegar a /onboarding/aq10-result

Paso 7: Crear app/(onboarding)/aq10-result.tsx (S03):
        - Mostrar score + mensaje de PRD Apéndice A (sin usar palabras "positivo/negativo")
        - Si score ≥6: mostrar tarjeta recomendando AQ Completo
        - Si score <6: mostrar tarjeta recomendando CAT-Q
        - Siempre mostrar opción de RAADS-R como tercer test
        - Botón por test: "Hacer ahora" / "Más tarde"
        - Botón: "Saltar tests adicionales → Continuar" → /onboarding/profile

Paso 8: Crear componente reutilizable TestScreen con:
        - Props: questions[], scale, title, onComplete(scores)
        - Navegación pregunta por pregunta
        - Botón "Pausar y continuar después" (guarda progreso en SecureStore)
        - Progreso visible: "Pregunta X de Y"

Paso 9: Crear app/(onboarding)/aq-full.tsx (S04 — AQ 50 preguntas):
        - Usar componente TestScreen
        - 50 preguntas del PRD Apéndice C
        - Mismo formato escala que AQ-10
        - Al completar: guardar aq_full_score + aq_full_domain_scores en profiles
        - Botón "Omitir" siempre visible → /onboarding/catq

Paso 10: Crear app/(onboarding)/catq.tsx (S05 — 25 preguntas):
        - Usar componente TestScreen
        - 25 preguntas del PRD Apéndice D
        - Escala 1-7 (7 opciones)
        - Al completar: calcular catq_total_score + catq_subscores, guardar en profiles
        - Botón "Omitir" siempre visible → /onboarding/raads

Paso 11: Crear app/(onboarding)/raads.tsx (S06 — 80 preguntas):
        - Usar componente TestScreen con soporte de pausa
        - 80 preguntas del PRD Apéndice E
        - Escala 0-3 (4 opciones)
        - Al completar: calcular raads scores por dominio, guardar en profiles
        - Botón "Omitir" siempre visible → /onboarding/profile

Paso 12: Crear función lib/profile-seed.ts:
        - INPUT: scores de todos los tests completados
        - OUTPUT: perfil semilla con:
          - scripts_priority: string[] (qué scripts mostrar primero)
          - sensory_defaults: { light, sound, touch, crowds }
          - emphasis: 'social' | 'sensory' | 'masking' | 'general'
        - Esta función alimenta la primera experiencia personalizada del usuario

Paso 13: Crear app/(onboarding)/profile.tsx (S07 — Cuestionario Personal):
        - Formulario con react-hook-form + zod
        - Campos: nombre (text), edad (number), intereses (multiselect chips),
          sensibilidades (checkboxes: luz / sonido / texturas / multitudes),
          herramientas que ya usa (multiselect: journaling / terapia / meditación / ninguna)
        - Guardar en tabla profiles (interests, sensitivities, existing_tools)
        - Botón "Continuar" → /onboarding/contacts

Paso 14: Crear app/(onboarding)/contacts.tsx (S08 — Setup Contactos):
        - Formulario: nombre + teléfono + relación (selector)
        - Botón "Agregar contacto" → guarda en trusted_contacts
        - Lista de contactos ya agregados (chips eliminables)
        - Botón "Omitir por ahora" → S24 Auth
        - Botón "Listo (X contactos)" → S24 Auth
        - Al llegar a auth: marcar onboarding_complete = true en profiles
```

**Verificación:** Flujo completo: S01 → S02 → S03 → S07 → S08 → S24 → S09. Login con email funciona. Perfil con datos básicos en Supabase. Función profile-seed retorna datos coherentes con scores.

---

## SEMANA 2 — Historial, Diccionario y Personalización

```
2.1 Tests opcionales de screening accesibles desde Configuración
    - Completar los pasos que el usuario omitió durante onboarding (S04, S05, S06)
    - app/(app)/settings/index.tsx: agregar sección "Completar mi perfil"
    - Mostrar tests pendientes con indicador de progreso
    - Tests disponibles desde Settings sin necesidad de repetir onboarding
    - Nota: AQ-10, cuestionario y contactos ya implementados en Semana 1 Fase 1.8

2.2 Historial de check-ins
    - app/(app)/history.tsx: lista de check-ins con fecha, emoción, zonas
    - Gráfico simple: emociones de los últimos 7 días (bar chart básico)
    - Tap en item → ver detalle del check-in

2.3 Diccionario emocional
    - app/(app)/dictionary.tsx: palabras confirmadas con frecuencia
    - Visual: grid de chips con tamaño proporcional a frecuencia
    - Tap en palabra → ver check-ins donde apareció

2.4 Personalización
    - app/(app)/settings/index.tsx: selección de tema y paleta
    - Zustand store para preferencias (persistido en SecureStore)
    - Hook useTheme() actualizado para leer del store

2.5 "Insights desbloqueados"
    - Después de 3 check-ins: primer insight ("Tu zona más activa esta semana es...")
    - Después de 7: insight de patrón temporal ("Tus momentos más difíciles son los...")
    - Banner no intrusivo en Home cuando hay nuevo insight
```

---

## SEMANA 3 — Red de Confianza y Notificaciones

```
3.1 Gestión completa de contactos de confianza
    - app/(app)/settings/contacts.tsx: CRUD completo
    - Configurar permisos por contacto (qué puede ver)
    - Test de notificación

3.2 Sistema de notificaciones completo
    - Registrar dispositivo en Expo Push
    - Configurar notificaciones locales recordatorio de check-in
    - Configurar hora preferida del usuario

3.3 Telegram Bot para personas de confianza
    - Crear bot con @BotFather
    - Edge function actualizada para enviar por Telegram
    - Flujo de registro: usuario da link al contacto → contacto inicia chat con bot

3.4 Respuesta bilateral en crisis
    - Cuando contacto recibe notificación push, puede responder con opciones predefinidas
    - Respuesta aparece en pantalla del usuario como banner suave
    - Historial de respuestas en crisis_events

3.5 SMS fallback offline
    - Integrar expo-sms
    - Preparar mensaje pre-formateado con datos del usuario
    - Activar solo cuando no hay conexión
```

---

## SEMANA 4 — Inteligencia Artificial y Vista Terapeuta

```
4.1 Mejorar interpret-checkin con contexto completo
    - Incluir últimos 5 check-ins en el prompt
    - Incluir perfil sensorial del usuario
    - Incluir hora y día de la semana
    - Ajustar temperatura y tokens

4.2 Detección de patrones
    - Edge function analyze-patterns:
      INPUT: historial de 30 días
      OUTPUT: { top_zones, top_emotions, trigger_times, trigger_contexts }
    - Visualización en pantalla de historial

4.3 Scripts personalizados con IA
    - Form para crear script: situación → IA sugiere bloques
    - Usuario edita y confirma
    - Guardar en scripts con owner_user_id

4.4 Vista terapeuta
    - Rol 'therapist' en users
    - app/therapist/index.tsx: lista de pacientes
    - Vista de paciente: check-ins, patrones, scripts
    - Crear/editar scripts para paciente
    - Botón "Generar reporte" → descarga JSON/PDF

4.5 Botón 🚩 y supervisión clínica
    - Terapeuta ve interpretaciones marcadas
    - Puede agregar nota aclaratoria
    - Usuario recibe feedback del terapeuta
```

---

## SEMANA 5 — On-Chain, Polish y APK

```
5.1 On-chain access control (Privy wallet + EVM L2)
    - Definir red (Arbitrum Sepolia para testnet)
    - Smart contract simple: mapping de permisos (patient → therapist → expiry)
    - Funciones: grantAccess(), revokeAccess(), checkAccess()
    - Integrar con vista de gestión de permisos del terapeuta

5.2 Sincronización offline completa
    - Implementar offline-sync.ts (ver BACKEND_STRUCTURE.md §7)
    - Queue de operaciones pendientes
    - Indicador visual de estado de sync

5.3 Accesibilidad y sensory polish
    - Revisar accessibilityLabel en todos los componentes interactivos
    - Verificar contraste en ambos modos (WCAG AA)
    - Modo reducción de animaciones completo
    - Modo crisis: verificar que cumple TODAS las reglas de FRONTEND_GUIDELINES.md §11

5.4 Build APK
    - Configurar app.json: nombre, ícono, splash screen
    - Configurar eas.json (ver TECH_STACK.md § Build y Deploy)
    - Ejecutar: eas build --platform android --profile preview
    - Instalar APK en dispositivo físico y hacer prueba completa

5.5 Testing con usuario real
    - Instalar APK en dispositivo del amigo diagnosticado
    - Sesión de prueba de 30 minutos con los 3 flows principales
    - Documentar friction points
    - Iterar lo crítico
```

---

## Checklist de Entrega por Semana

### Semana 1 (Lunes) ✅
- [ ] App corre en Expo Go en dispositivo físico
- [ ] Onboarding funciona: S01 → S02 → S03 → S07 → S08 → S24 → S09
- [ ] Check-in completo de inicio a fin: S10 → S11 → S12 → S13
- [ ] 5 scripts navegables en modo preparación (S15) y ejecución (S16)
- [ ] Botón de rescate funciona (nivel 1, 2, y 3): S17 → S18
- [ ] Datos se guardan en Supabase (profiles + checkins + crisis_events)
- [ ] Auth básico con email (Privy + sync-privy-user)

### Semana 2 ✅
- [ ] Tests opcionales accesibles desde Configuración (S04, S05, S06)
- [ ] Historial de check-ins visible (S19)
- [ ] Diccionario emocional se construye (S20)
- [ ] Tema claro/oscuro funcional (S21)

### Semana 3 ✅
- [ ] Contactos de confianza completamente configurables
- [ ] Notificación push llega en crisis
- [ ] Telegram bot funcional (opcional)
- [ ] SMS fallback offline funcional

### Semana 4 ✅
- [ ] IA mejora interpretaciones con historial
- [ ] Patrones visibles después de 7+ check-ins
- [ ] Vista terapeuta básica funcional
- [ ] Scripts personalizados con asistencia IA

### Semana 5 ✅
- [ ] APK instalable generado y probado
- [ ] On-chain access control funcional (testnet)
- [ ] Prueba completa con usuario real
- [ ] App no genera ningún detonante sensorial (validado por usuario con TEA)
