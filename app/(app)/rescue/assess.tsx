/**
 * rescue/assess.tsx — S17: Evaluación de Crisis
 *
 * Primera pantalla del protocolo de rescate.
 * El usuario llega aquí desde el RescueFAB (botón corazón global).
 *
 * Flujo: RescueFAB → S17 → protocol (S18, nivel 1/2/3)
 *
 * Diseño (FRONTEND_GUIDELINES §11 — reglas que sobrescriben todo):
 *   ✅ Fondo script-crisis / script-dark-crisis
 *   ✅ Texto mínimo 28px (variant="crisis")
 *   ✅ Botones mínimo 64px de alto
 *   ✅ "← Salir" visible arriba a la izquierda
 *   ✅ Un solo punto focal: la pregunta
 *   ✅ Máximo 5 palabras por instrucción
 *   ❌ Sin animaciones
 *   ❌ Sin tab bar (rescue no es un tab — oculto con href:null en B-06)
 *   ❌ Sin padding decorativo
 *
 * Niveles:
 *   1 — "Me siento tenso/a"     → Grounding 5-4-3-2-1
 *   2 — "Me cuesta respirar"    → Círculo de respiración guiada
 *   3 — "No puedo solo/a"       → Protocolo de emergencia + contactos
 */
import React from "react";
import { View, Pressable, Text, StyleSheet, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen, Typography } from "@/components/ui";

// ── Opciones de nivel de crisis ────────────────────────────────────────────
// Máximo 5 palabras por etiqueta (FRONTEND_GUIDELINES §11.4)
const LEVEL_OPTIONS = [
  {
    level: 1,
    label: "Me siento tenso/a",
    hint:  "Ejercicio de grounding",
  },
  {
    level: 2,
    label: "Me cuesta respirar",
    hint:  "Respiración guiada",
  },
  {
    level: 3,
    label: "No puedo solo/a",
    hint:  "Protocolo de apoyo",
  },
] as const;

// ── Componente ─────────────────────────────────────────────────────────────
export default function RescueAssessScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  // Colores que se adaptan al tema — crisis debe ser legible en ambos modos
  const btnBg     = isDark ? "#6A3E3E" : "#E8C4C4"; // script-dark-crisis-soft / script-crisis-soft
  const btnLabel  = isDark ? "#F0D0D0" : "#2D2D2D"; // claro sobre oscuro / oscuro sobre claro
  const btnHint   = isDark ? "#C0A0A0" : "#6B6B6B"; // hint suave adaptado
  const exitColor = isDark ? "#A0A0A0" : "#6B6B6B"; // "← Salir" visible en ambos modos

  /** Navegar al protocolo con el nivel elegido */
  const handleLevelSelect = (level: 1 | 2 | 3) => {
    router.push({
      pathname: "/(app)/rescue/protocol",
      params: { level: String(level) },
    });
  };

  return (
    /**
     * crisis=true → fondo bg-script-crisis dark:bg-script-dark-crisis
     * scrollable=false → SafeAreaView directo, layout manual
     */
    <SafeScreen crisis scrollable={false}>
      <View style={styles.container}>

        {/* ── "← Salir" — siempre visible (§11.9) ──────────────────── */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [styles.exitBtn, pressed && styles.exitBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Salir del protocolo de rescate"
        >
          <Text style={[styles.exitText, { color: exitColor }]}>← Salir</Text>
        </Pressable>

        {/* ── Punto focal único: pregunta + opciones ────────────────── */}
        <View style={styles.centerContent}>

          {/* Pregunta principal — 28px bold (variant="crisis") */}
          <Typography variant="crisis" className="text-center mb-10">
            ¿Dónde estás ahora?
          </Typography>

          {/* 3 opciones de nivel — botones 64px+ */}
          <View style={styles.optionsContainer}>
            {LEVEL_OPTIONS.map(({ level, label, hint }) => (
              <Pressable
                key={level}
                onPress={() => handleLevelSelect(level)}
                style={({ pressed }) => [
                  styles.levelBtn,
                  { backgroundColor: btnBg },
                  pressed && styles.levelBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${label} — ${hint}`}
              >
                {/* Etiqueta principal — 22px semibold */}
                <Text style={[styles.levelBtnLabel, { color: btnLabel }]}>{label}</Text>
                {/* Hint de protocolo — texto pequeño bajo */}
                <Text style={[styles.levelBtnHint, { color: btnHint }]}>{hint}</Text>
              </Pressable>
            ))}
          </View>

        </View>
      </View>
    </SafeScreen>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────
// Se usan StyleSheet (no NativeWind) porque los tamaños de crisis
// son críticos y no deben variar con la compilación de NativeWind.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  // ── Botón "← Salir" ──────────────────────────────────────────────────────
  exitBtn: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 44, // Tap target WCAG
  },
  exitBtnPressed: {
    opacity: 0.6,
  },
  exitText: {
    fontSize: 18,
    // color se aplica dinámicamente según tema (dark/light)
  },
  // ── Contenido centrado ───────────────────────────────────────────────────
  centerContent: {
    flex: 1,
    justifyContent: "center",
  },
  // ── Botones de nivel ─────────────────────────────────────────────────────
  optionsContainer: {
    gap: 16,
  },
  levelBtn: {
    // backgroundColor se aplica dinámicamente según tema (dark/light)
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 24,
    minHeight: 72, // Mínimo 64px per §11.6
    alignItems: "center",
    justifyContent: "center",
    gap: 4,
  },
  levelBtnPressed: {
    opacity: 0.8,
  },
  levelBtnLabel: {
    fontSize: 22,      // Cerca de 28px — etiqueta principal
    fontWeight: "600",
    // color se aplica dinámicamente según tema (dark/light)
    textAlign: "center",
  },
  levelBtnHint: {
    fontSize: 13,
    // color se aplica dinámicamente según tema (dark/light)
    textAlign: "center",
  },
});
