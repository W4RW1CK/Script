# FRONTEND_GUIDELINES.md — Sistema de Diseño
## Script — Compañero Digital para Adultos con TEA Nivel 1

**Versión:** 1.0  
**Última actualización:** 2026-02-25

> **Principio rector:** Ningún elemento de la UI puede ser un detonante sensorial. Cada decisión de diseño debe reducir la carga cognitiva y sensorial, no aumentarla.

---

## 1. Paleta de Colores

### Light Mode (Modo Claro — Pastel)

| Token | Hex | Uso |
|---|---|---|
| `color-bg-primary` | `#F8F6F2` | Fondo principal (blanco cálido, no puro) |
| `color-bg-secondary` | `#EFEFEA` | Fondos de tarjetas, inputs |
| `color-bg-elevated` | `#FFFFFF` | Modals, bottom sheets |
| `color-text-primary` | `#2D2D2D` | Texto principal |
| `color-text-secondary` | `#6B6B6B` | Texto secundario, hints |
| `color-text-disabled` | `#ABABAB` | Elementos deshabilitados |
| `color-accent-blue` | `#A8C5DA` | Acciones primarias, selección |
| `color-accent-green` | `#B8DABC` | Confirmación, éxito, "me siento bien" |
| `color-accent-peach` | `#F2C9B0` | Alertas suaves, scripts |
| `color-accent-lavender` | `#C4B8DA` | Historial, diccionario emocional |
| `color-accent-yellow` | `#F5E4A0` | Notas, recordatorios |
| `color-crisis-bg` | `#F5EFEF` | Fondo pantalla de rescate |
| `color-crisis-soft` | `#E8C4C4` | Elementos de crisis (suave, nunca rojo alarma) |
| `color-border` | `#E0DDD8` | Bordes de tarjetas, separadores |

### Dark Mode (Modo Oscuro — Desaturado)

| Token | Hex | Uso |
|---|---|---|
| `color-bg-primary` | `#1C1C22` | Fondo principal |
| `color-bg-secondary` | `#26262E` | Fondos de tarjetas, inputs |
| `color-bg-elevated` | `#2F2F38` | Modals, bottom sheets |
| `color-text-primary` | `#E8E8E8` | Texto principal |
| `color-text-secondary` | `#9A9AA5` | Texto secundario |
| `color-text-disabled` | `#55555E` | Elementos deshabilitados |
| `color-accent-blue` | `#5A7E92` | Acciones primarias |
| `color-accent-green` | `#5A7A5E` | Confirmación, éxito |
| `color-accent-peach` | `#8A6454` | Scripts |
| `color-accent-lavender` | `#6A5E8A` | Historial |
| `color-accent-yellow` | `#8A7A40` | Notas |
| `color-crisis-bg` | `#221E1E` | Fondo pantalla de rescate |
| `color-crisis-soft` | `#6A3E3E` | Elementos de crisis |
| `color-border` | `#3A3A44` | Bordes |

### Modo Crisis (se activa al entrar al protocolo de rescate)

En modo crisis, la UI adopta automáticamente:
- Fondo: `color-crisis-bg` del modo activo
- Reducción de contraste: todos los colores de acento se desaturan 30%
- Modo oscuro forzado si el sistema está en modo claro (reduce estimulación)

---

## 2. Tipografía

| Rol | Familia | Peso | Tamaño | Line Height |
|---|---|---|---|---|
| Heading XL | Inter | 700 (Bold) | 32px | 40px |
| Heading L | Inter | 600 (SemiBold) | 24px | 32px |
| Heading M | Inter | 600 (SemiBold) | 20px | 28px |
| Body | Inter | 400 (Regular) | 16px | 24px |
| Body Large | Inter | 400 (Regular) | 18px | 28px |
| Caption | Inter | 400 (Regular) | 14px | 20px |
| Crisis Text | Inter | 700 (Bold) | 28px | 36px |
| Button | Inter | 600 (SemiBold) | 16px | — |

**Font:** `Inter` — importar desde `expo-google-fonts/inter`

```typescript
import { 
  useFonts,
  Inter_400Regular,
  Inter_600SemiBold,
  Inter_700Bold 
} from '@expo-google-fonts/inter'
```

**Reglas:**
- Tamaño mínimo de texto: 14px (nunca menor)
- Sin itálica en contenido principal (dificulta lectura en dislexia)
- Letra tracking: normal (no tight, no wide)
- En pantalla de crisis: solo Body Large y Crisis Text

---

## 3. Espaciado (Spacing Scale)

Usar múltiplos de 4px. NativeWind map:

| Token | px | NativeWind |
|---|---|---|
| `space-1` | 4px | `p-1`, `m-1` |
| `space-2` | 8px | `p-2`, `m-2` |
| `space-3` | 12px | `p-3`, `m-3` |
| `space-4` | 16px | `p-4`, `m-4` |
| `space-5` | 20px | `p-5`, `m-5` |
| `space-6` | 24px | `p-6`, `m-6` |
| `space-8` | 32px | `p-8`, `m-8` |
| `space-10` | 40px | `p-10`, `m-10` |
| `space-12` | 48px | `p-12`, `m-12` |

**Padding estándar de pantalla:** `px-5` (20px horizontal)  
**Gap entre elementos de lista:** `gap-3` (12px)  
**Gap entre secciones:** `gap-6` (24px)

---

## 4. Componentes Core

### Botones

```
Primary Button
├── Fondo: color-accent-blue
├── Texto: blanco, Inter SemiBold 16px
├── Padding: py-4 px-6 (16px vertical, 24px horizontal)
├── Border radius: rounded-2xl (16px)
├── Tamaño mínimo: ancho completo (w-full) en mobile
└── Estado pressed: opacidad 0.85, sin scale

Secondary Button  
├── Fondo: transparente
├── Borde: 1.5px color-accent-blue
├── Texto: color-accent-blue, Inter SemiBold 16px
└── Resto igual que primary

Danger Button
├── Fondo: color-crisis-soft
├── Texto: color-text-primary
└── Solo usar para acciones destructivas (eliminar, desconectar)

Ghost Button
├── Sin fondo, sin borde
├── Texto: color-text-secondary
└── Para acciones secundarias (omitir, cancelar)
```

**Tamaño mínimo de tap target:** 44x44px (WCAG / Apple HIG)

### Tarjetas

```
Card
├── Fondo: color-bg-secondary
├── Border radius: rounded-3xl (24px)
├── Padding: p-5 (20px todos los lados)
├── Sombra: shadow-sm (solo light mode)
└── Sin borde (el fondo diferencia suficiente)
```

### Inputs de Texto

```
TextInput
├── Fondo: color-bg-primary
├── Borde: 1.5px color-border
├── Borde focused: 1.5px color-accent-blue
├── Border radius: rounded-2xl (16px)
├── Padding: p-4 (16px)
├── Texto: Inter Regular 16px, color-text-primary
├── Placeholder: color-text-disabled
└── Min height: 44px (single line) / 120px (multiline)
```

### Chips / Tags

```
Chip (zona corporal seleccionada, categoría de script)
├── Fondo: color-accent-blue con 20% opacidad
├── Texto: color-accent-blue, Inter SemiBold 14px
├── Padding: py-1 px-3
├── Border radius: rounded-full
└── Con ícono opcional a la izquierda
```

### Bottom Navigation

```
Bottom Nav
├── Fondo: color-bg-elevated
├── 5 tabs: Home, Check-in, Scripts, Historial, Settings
├── Tab activo: ícono + label con color-accent-blue
├── Tab inactivo: ícono + label con color-text-disabled
├── Altura: 64px + safe area inset
└── Sin borde superior (separación por sombra sutil)
```

---

## 5. Componente: Silueta Corporal (Body Map)

```
SVG Body Map
├── Dimensiones: 200px ancho × 400px alto (escalable)
├── Fondo: transparente
├── Silueta base: color-border con fill suave
└── 6 zonas táctiles:
    ├── Cabeza/Ojos/Mandíbula: elipse superior
    ├── Garganta/Cuello: rectángulo central superior
    ├── Pecho/Corazón: zona torácica
    ├── Estómago/Abdomen: zona media
    ├── Manos/Brazos: zonas laterales
    └── Piernas/Pies: zona inferior

Estados de zona:
├── Default: fill color-bg-secondary, stroke color-border
├── Hover/Press: fill color-accent-blue 30% opacidad
├── Seleccionada: fill color-accent-blue 60% opacidad, stroke color-accent-blue
└── Animación de selección: scale 1.0 → 1.05 → 1.0 (100ms, solo si animaciones activas)
```

---

## 6. Componente: Círculo de Respiración

```
Breathing Circle (SVG animado)
├── Radio base: 80px
├── Radio máximo (inhalar): 120px
├── Radio mínimo (exhalar): 60px
├── Color: color-accent-blue con gradiente radial a color-accent-lavender
├── Opacidad: 0.7 base, 0.9 en máximo
├── Animación: react-native-reanimated withTiming
│   ├── Inhalar (4s): radius 80→120, opacity 0.7→0.9
│   ├── Pausa (2s): sin cambio
│   └── Exhalar (6s): radius 120→60, opacity 0.9→0.6
├── Label interior: "Inhala" / "Pausa" / "Exhala" (Inter Bold 16px, blanco)
└── Fondo pantalla: color-crisis-bg, sin otros elementos
```

---

## 7. Animaciones

**Filosofía:** Las animaciones comunican estado, no decoran. Deben ser predecibles.

| Animación | Duración | Curva | Cuándo |
|---|---|---|---|
| Page transition | 200ms | easeInOut | Entre pantallas |
| Card press | 100ms | easeOut | Feedback de tap |
| Modal enter | 300ms | easeOut | Bottom sheet aparece |
| Zone selection | 100ms | easeOut | Zona corporal tocada |
| Breathing circle | 4000/6000ms | easeInOut | Solo en protocolo |
| Chip add/remove | 150ms | easeOut | Agregar/quitar chip |

**Modo reducción de animaciones:** Cuando el usuario lo activa (o en modo crisis), TODAS las animaciones excepto el círculo de respiración se desactivan. La breathing circle siempre se muestra pero su duración se mantiene constante.

```typescript
// Hook para verificar preferencia
import { useReducedMotion } from 'react-native-reanimated'
const reducedMotion = useReducedMotion()
```

---

## 8. Iconografía

**Librería:** Expo Symbols (SF Symbols en iOS, equivalentes en Android)

| Uso | Ícono |
|---|---|
| Home | `house.fill` |
| Check-in | `hand.raised.fill` |
| Scripts | `doc.text.fill` |
| Historial | `chart.bar.fill` |
| Settings | `gearshape.fill` |
| Rescate | `heart.fill` |
| Agregar | `plus.circle.fill` |
| Eliminar | `trash.fill` |
| Editar | `pencil` |
| Compartir | `square.and.arrow.up` |
| Crisis flag | `flag.fill` |
| Persona confianza | `person.2.fill` |
| Terapeuta | `stethoscope` |

**Tamaños:**
- Navigation icon: 24px
- Action icon: 20px
- Inline icon: 16px

---

## 9. Layout y Responsive

**Ancho máximo de contenido:** 480px (centrado en tablets/web)  
**Safe areas:** Usar `SafeAreaView` o padding con `useSafeAreaInsets()`  
**Orientación:** Portrait locked (sin soporte landscape en v1)  
**Densidad mínima soportada:** 320px de ancho (iPhone SE)

```typescript
// Template de pantalla estándar
<SafeAreaView className="flex-1 bg-[#F8F6F2]">
  <ScrollView 
    className="flex-1 px-5"
    showsVerticalScrollIndicator={false}
  >
    {/* contenido */}
  </ScrollView>
</SafeAreaView>
```

---

## 10. Accesibilidad

- `accessibilityLabel` en todos los botones e íconos interactivos
- `accessibilityHint` en acciones no obvias
- Contraste de texto: mínimo 4.5:1 (WCAG AA)
- Contraste en modo crisis: mínimo 3:1 (reducido intencionalmente para alivio sensorial)
- `accessibilityRole` correcto en todos los elementos (`button`, `text`, `image`)
- `accessible={true}` en zonas del body map con `accessibilityLabel` por zona

---

## 11. Pantalla de Crisis — Reglas Especiales

Estas reglas **sobrescriben** todas las demás cuando se está en `/rescue/*`:

1. ❌ Sin padding top decorativo
2. ❌ Sin bottom navigation visible
3. ❌ Sin animaciones excepto el círculo de respiración
4. ❌ Sin más de 5 palabras en cualquier instrucción
5. ✅ Texto mínimo 28px
6. ✅ Botones mínimo 64px de alto
7. ✅ Fondo siempre `color-crisis-bg`
8. ✅ Contraste reducido (no eliminado)
9. ✅ Botón "← Salir" siempre visible arriba a la izquierda
10. ✅ Un solo punto focal por pantalla
