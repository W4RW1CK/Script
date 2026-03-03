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
import { View, Pressable, Text, StyleSheet } from "react-native";
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
          <Text style={styles.exitText}>← Salir</Text>
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
                  pressed && styles.levelBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel={`${label} — ${hint}`}
              >
                {/* Etiqueta principal — 28px */}
                <Text style={styles.levelBtnLabel}>{label}</Text>
                {/* Hint de protocolo — texto pequeño bajo */}
                <Text style={styles.levelBtnHint}>{hint}</Text>
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
    color: "#6B6B6B", // script-text-secondary — nunca color alarmante
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
    backgroundColor: "#E8C4C4", // script-crisis-soft — suave, nunca rojo
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
    color: "#2D2D2D",  // script-text — alto contraste
    textAlign: "center",
  },
  levelBtnHint: {
    fontSize: 13,
    color: "#6B6B6B",  // script-text-secondary
    textAlign: "center",
  },
});
