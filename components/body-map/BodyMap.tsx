/**
 * BodyMap.tsx — Mapa Corporal Interactivo
 *
 * Silueta SVG simplificada con 6 zonas táctiles independientes.
 * El usuario toca las zonas donde siente algo (multi-selección).
 *
 * Props:
 *   selectedZones  - array de ZoneId actualmente seleccionadas
 *   onZonesChange  - callback cuando cambia la selección
 *   width          - ancho en px (default 200; height = width × 2)
 *
 * 6 Zonas canónicas (FRONTEND_GUIDELINES §5):
 *   head     → Cabeza / Ojos / Mandíbula
 *   throat   → Garganta / Cuello
 *   chest    → Pecho / Corazón
 *   stomach  → Estómago / Abdomen
 *   arms     → Manos / Brazos (ambos lados, un solo grupo)
 *   legs     → Piernas / Pies (ambas piernas, un solo grupo)
 *
 * Colores: NO se pueden usar clases NativeWind en SVG —
 * se usan valores hex directos de constants/colors.ts.
 *
 * Accesibilidad:
 *   - accessibilityRole="button" en cada zona
 *   - accessibilityState.selected refleja estado actual
 *   - accessibilityLabel describe la zona en español
 */
import React, { useCallback } from "react";
import { View, useColorScheme } from "react-native";
import Svg, { G, Ellipse, Rect } from "react-native-svg";

// ── Tipos exportados ───────────────────────────────────────────────────────
/** IDs canónicos de las 6 zonas corporales */
export type ZoneId = "head" | "throat" | "chest" | "stomach" | "arms" | "legs";

/**
 * Metadata de cada zona: etiqueta UI y label de accesibilidad.
 * Exportado para usarse en chips, chips de historial, etc.
 */
export const ZONE_META: Record<ZoneId, { label: string; a11yLabel: string }> = {
  head:    { label: "Cabeza / Ojos / Mandíbula", a11yLabel: "Zona de cabeza, ojos y mandíbula" },
  throat:  { label: "Garganta / Cuello",         a11yLabel: "Zona de garganta y cuello" },
  chest:   { label: "Pecho / Corazón",           a11yLabel: "Zona de pecho y corazón" },
  stomach: { label: "Estómago / Abdomen",        a11yLabel: "Zona de estómago y abdomen" },
  arms:    { label: "Manos / Brazos",            a11yLabel: "Zona de manos y brazos" },
  legs:    { label: "Piernas / Pies",            a11yLabel: "Zona de piernas y pies" },
};

/**
 * Orden canónico de zonas de arriba a abajo.
 * Usado para renderizar chips en el mismo orden que el cuerpo.
 */
export const ZONE_ORDER: ZoneId[] = [
  "head", "throat", "chest", "stomach", "arms", "legs",
];

// ── Props ──────────────────────────────────────────────────────────────────
interface BodyMapProps {
  /** Zonas actualmente seleccionadas */
  selectedZones: ZoneId[];
  /** Callback cuando el usuario toca/destoca una zona (toggle) */
  onZonesChange: (zones: ZoneId[]) => void;
  /** Ancho del componente en px (height = width × 2) */
  width?: number;
}

// ── Paleta de colores (hex directo, no NativeWind) ─────────────────────────
// Mapeados desde constants/colors.ts y FRONTEND_GUIDELINES §1.3
const PALETTE = {
  light: {
    bgSecondary:   "#EFEFEA",    // script-bg-secondary (zona default fill)
    border:        "#E0DDD8",    // script-border (zona default stroke)
    accentBlue:    "#A8C5DA",    // script-blue (zona seleccionada stroke)
    accentBlueMd:  "#A8C5DA99", // script-blue 60% (zona seleccionada fill)
  },
  dark: {
    bgSecondary:   "#26262E",    // script-dark-secondary
    border:        "#3A3A44",    // script-dark-border
    accentBlue:    "#5A7E92",    // script-dark-blue
    accentBlueMd:  "#5A7E9299", // script-dark-blue 60%
  },
};

// ── Componente ─────────────────────────────────────────────────────────────
/**
 * BodyMap — Silueta corporal interactiva con 6 zonas táctiles.
 *
 * Cada zona cambia de color al seleccionarse.
 * Multi-selección: el usuario puede activar todas las zonas que necesite.
 */
export function BodyMap({
  selectedZones,
  onZonesChange,
  width = 200,
}: BodyMapProps) {
  const isDark = useColorScheme() === "dark";
  const c = isDark ? PALETTE.dark : PALETTE.light;

  // La altura mantiene ratio 1:2 (200×400 base)
  const height = width * 2;

  /** Toggle: quita la zona si está seleccionada, la agrega si no */
  const toggleZone = useCallback(
    (id: ZoneId) => {
      if (selectedZones.includes(id)) {
        onZonesChange(selectedZones.filter((z) => z !== id));
      } else {
        onZonesChange([...selectedZones, id]);
      }
    },
    [selectedZones, onZonesChange]
  );

  /** Fill SVG según estado de la zona */
  const fill  = (id: ZoneId) => selectedZones.includes(id) ? c.accentBlueMd : c.bgSecondary;
  /** Stroke SVG según estado */
  const stroke = (id: ZoneId) => selectedZones.includes(id) ? c.accentBlue : c.border;
  /** Grosor del stroke (más grueso cuando seleccionada) */
  const sw = (id: ZoneId) => (selectedZones.includes(id) ? 2 : 1.5);

  return (
    <View
      style={{ width, height }}
      accessibilityLabel="Mapa corporal interactivo"
      accessibilityHint="Toca las zonas de tu cuerpo donde sientes algo"
    >
      {/*
        ViewBox fija el sistema de coordenadas a 200×400.
        El SVG se escala automáticamente al `width` recibido.
      */}
      <Svg width={width} height={height} viewBox="0 0 200 400">

        {/* ── Cabeza ────────────────────────────────────────────────── */}
        <G
          onPress={() => toggleZone("head")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ZONE_META.head.a11yLabel}
          accessibilityState={{ selected: selectedZones.includes("head") }}
        >
          <Ellipse
            cx={100} cy={48} rx={30} ry={32}
            fill={fill("head")} stroke={stroke("head")} strokeWidth={sw("head")}
          />
        </G>

        {/* ── Garganta / Cuello ─────────────────────────────────────── */}
        <G
          onPress={() => toggleZone("throat")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ZONE_META.throat.a11yLabel}
          accessibilityState={{ selected: selectedZones.includes("throat") }}
        >
          <Rect
            x={88} y={80} width={24} height={20} rx={6}
            fill={fill("throat")} stroke={stroke("throat")} strokeWidth={sw("throat")}
          />
        </G>

        {/* ── Brazos (izquierdo + derecho = un solo grupo táctil) ───── */}
        <G
          onPress={() => toggleZone("arms")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ZONE_META.arms.a11yLabel}
          accessibilityState={{ selected: selectedZones.includes("arms") }}
        >
          {/* Brazo izquierdo */}
          <Rect
            x={22} y={100} width={38} height={92} rx={18}
            fill={fill("arms")} stroke={stroke("arms")} strokeWidth={sw("arms")}
          />
          {/* Brazo derecho */}
          <Rect
            x={140} y={100} width={38} height={92} rx={18}
            fill={fill("arms")} stroke={stroke("arms")} strokeWidth={sw("arms")}
          />
        </G>

        {/* ── Pecho / Corazón (torso superior) ─────────────────────── */}
        <G
          onPress={() => toggleZone("chest")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ZONE_META.chest.a11yLabel}
          accessibilityState={{ selected: selectedZones.includes("chest") }}
        >
          <Rect
            x={60} y={100} width={80} height={58} rx={10}
            fill={fill("chest")} stroke={stroke("chest")} strokeWidth={sw("chest")}
          />
        </G>

        {/* ── Estómago / Abdomen (torso inferior) ──────────────────── */}
        <G
          onPress={() => toggleZone("stomach")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ZONE_META.stomach.a11yLabel}
          accessibilityState={{ selected: selectedZones.includes("stomach") }}
        >
          <Rect
            x={60} y={158} width={80} height={58} rx={10}
            fill={fill("stomach")} stroke={stroke("stomach")} strokeWidth={sw("stomach")}
          />
        </G>

        {/* ── Piernas / Pies (izquierda + derecha = un solo grupo) ──── */}
        <G
          onPress={() => toggleZone("legs")}
          accessible
          accessibilityRole="button"
          accessibilityLabel={ZONE_META.legs.a11yLabel}
          accessibilityState={{ selected: selectedZones.includes("legs") }}
        >
          {/* Pierna izquierda */}
          <Rect
            x={63} y={216} width={34} height={164} rx={16}
            fill={fill("legs")} stroke={stroke("legs")} strokeWidth={sw("legs")}
          />
          {/* Pierna derecha */}
          <Rect
            x={103} y={216} width={34} height={164} rx={16}
            fill={fill("legs")} stroke={stroke("legs")} strokeWidth={sw("legs")}
          />
        </G>

      </Svg>
    </View>
  );
}
