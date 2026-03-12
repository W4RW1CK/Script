/**
 * rescue/assess.tsx — S17: Evaluación de Crisis
 *
 * Primera pantalla del protocolo de rescate.
 * El usuario llega aquí desde el RescueFAB (botón corazón global).
 *
 * Flujo completo (T-C1 — safety screening):
 *   RescueFAB
 *     → paso 'screening': "¿Estás pensando en hacerte daño?" [Sí / No]
 *       → Sí → paso 'crisis_support': Línea de la Vida + SAPTEL (sin pasar por niveles)
 *       → No → paso 'levels': ¿Dónde estás ahora? (Nivel 1/2/3 estándar)
 *     → protocol.tsx (S18)
 *
 * T-C1 — Fundamento clínico:
 *   Cassidy et al. (2018): 66% adultos con ASD reportan ideación suicida.
 *   Hirvikoski et al. (2016): mortalidad por suicidio 9× mayor en ASD.
 *   La pregunta de screening debe estar en el primer punto de contacto
 *   con el usuario en crisis — antes de seleccionar nivel de intensidad.
 *
 * Recursos en paso 'crisis_support':
 *   Línea de la Vida: 800 911-2000 (México, gratuita, 24h)
 *   SAPTEL: (55) 5259-8121 (México, gratuita, 24h)
 *
 * Diseño §11 (FRONTEND_GUIDELINES) — aplica a los 3 pasos:
 *   ✅ Fondo script-crisis / script-dark-crisis
 *   ✅ Texto mínimo 28px (variant="crisis")
 *   ✅ Botones mínimo 64px de alto
 *   ✅ "← Salir" visible arriba a la izquierda en todos los pasos
 *   ✅ Un solo punto focal por paso
 *   ✅ Máximo 5 palabras por instrucción
 *   ❌ Sin animaciones
 *   ❌ Sin tab bar
 */
import React, { useState, useCallback } from "react";
import {
  View,
  Pressable,
  Text,
  StyleSheet,
  useColorScheme,
  Linking,
} from "react-native";
import { useRouter } from "expo-router";
import * as Haptics from "expo-haptics";
import { SafeScreen, Typography } from "@/components/ui";

// ── Tipo de paso dentro de esta pantalla ───────────────────────────────────
type AssessStep =
  | "screening"      // Pregunta inicial de ideación suicida (T-C1)
  | "crisis_support" // Recursos de crisis si screening = Sí (T-C1)
  | "levels";        // Selección de nivel estándar (Nivel 1/2/3)

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

// ── Números de crisis ───────────────────────────────────────────────────────
const LINEA_VIDA_TEL = "tel:8009112000";    // Línea de la Vida México — 800 911-2000
const SAPTEL_TEL     = "tel:5552598121";    // SAPTEL México — (55) 5259-8121

// ── Componente ─────────────────────────────────────────────────────────────
export default function RescueAssessScreen() {
  const router  = useRouter();
  const isDark  = (useColorScheme() ?? 'light') === 'dark';

  /**
   * T-C1: paso actual del flujo de evaluación.
   * Comienza en 'screening' (pregunta de seguridad).
   */
  const [step, setStep] = useState<AssessStep>("screening");

  // Colores adaptativos — crisis debe ser legible en ambos modos
  const btnBg        = isDark ? "#6A3E3E" : "#E8C4C4"; // crisis-soft
  const btnLabel     = isDark ? "#F0D0D0" : "#2D2D2D";
  const btnHint      = isDark ? "#C0A0A0" : "#6B6B6B";
  const exitColor    = isDark ? "#A0A0A0" : "#6B6B6B";

  // Botones de "Sí" y "No" del screening
  const yesBg        = isDark ? "#7A3030" : "#DCA8A8"; // más cálido/rojo para énfasis
  const yesLabel     = isDark ? "#F5D0D0" : "#2D0000";
  const noBg         = isDark ? "#3A4E3A" : "#C8DCC8"; // verde calmo para "No"
  const noLabel      = isDark ? "#C8E8C8" : "#0A2010";

  // Botones de recursos de crisis
  const crisisBtnBg  = isDark ? "#5A3030" : "#D4A0A0";
  const crisisBtnLabel = isDark ? "#F5D0D0" : "#2D0000";

  /** Navegar al protocolo con el nivel elegido (paso 'levels') */
  const handleLevelSelect = useCallback((level: 1 | 2 | 3) => {
    router.push({
      pathname: "/(app)/rescue/protocol",
      params: { level: String(level) },
    });
  }, [router]);

  /**
   * Respuesta afirmativa en screening (T-C1).
   * Háptico de warning + cambiar a paso 'crisis_support'.
   * NO navega al protocolo de niveles — va directo a recursos de ayuda.
   */
  const handleScreeningYes = useCallback(() => {
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    setStep("crisis_support");
  }, []);

  /**
   * Respuesta negativa en screening.
   * Continúa al flujo estándar de selección de nivel.
   */
  const handleScreeningNo = useCallback(() => {
    setStep("levels");
  }, []);

  /** Abrir marcador de teléfono para Línea de la Vida */
  const callLineaDeVida = useCallback(() => {
    Linking.openURL(LINEA_VIDA_TEL);
  }, []);

  /** Abrir marcador de teléfono para SAPTEL */
  const callSAPTEL = useCallback(() => {
    Linking.openURL(SAPTEL_TEL);
  }, []);

  return (
    <SafeScreen crisis scrollable={false}>
      <View style={styles.container}>

        {/* ── "← Salir" — visible en todos los pasos (§11.9) ─────────── */}
        <Pressable
          onPress={() => router.back()}
          style={({ pressed }) => [
            styles.exitBtn,
            pressed && styles.exitBtnPressed,
          ]}
          accessibilityRole="button"
          accessibilityLabel="Salir del protocolo de rescate"
        >
          <Text style={[styles.exitText, { color: exitColor }]}>← Salir</Text>
        </Pressable>

        {/* ── Paso 1: Screening (T-C1) ─────────────────────────────────── */}
        {step === "screening" && (
          <View style={styles.centerContent}>
            {/* Pregunta de seguridad — tono directo y sin alarmar */}
            <Typography variant="crisis" className="text-center mb-3">
              ¿Estás pensando en hacerte daño?
            </Typography>

            <Typography
              variant="body"
              className="text-center mb-10 text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Estás en el lugar correcto.
            </Typography>

            {/* Botones Sí / No — 64px+ (§11.6) */}
            <View style={styles.optionsContainer}>
              <Pressable
                onPress={handleScreeningYes}
                style={({ pressed }) => [
                  styles.levelBtn,
                  { backgroundColor: yesBg },
                  pressed && styles.levelBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Sí, estoy pensando en hacerme daño"
              >
                <Text style={[styles.levelBtnLabel, { color: yesLabel }]}>
                  Sí
                </Text>
              </Pressable>

              <Pressable
                onPress={handleScreeningNo}
                style={({ pressed }) => [
                  styles.levelBtn,
                  { backgroundColor: noBg },
                  pressed && styles.levelBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="No, no estoy pensando en hacerme daño"
              >
                <Text style={[styles.levelBtnLabel, { color: noLabel }]}>
                  No
                </Text>
              </Pressable>
            </View>
          </View>
        )}

        {/* ── Paso 2: Recursos de crisis (T-C1 — respuesta Sí) ─────────── */}
        {step === "crisis_support" && (
          <View style={styles.centerContent}>
            {/* Mensaje de acogida — sin alarmar */}
            <Typography variant="crisis" className="text-center mb-2">
              Aquí estoy contigo.
            </Typography>
            <Typography
              variant="body"
              className="text-center mb-8 text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Habla con alguien ahora. Es gratis y confidencial.
            </Typography>

            <View style={styles.optionsContainer}>

              {/* ── Línea de la Vida ──────────────────────────────────── */}
              <Pressable
                onPress={callLineaDeVida}
                style={({ pressed }) => [
                  styles.levelBtn,
                  { backgroundColor: crisisBtnBg },
                  pressed && styles.levelBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Llamar a la Línea de la Vida, 800 911-2000, gratuita 24 horas"
              >
                <Text style={[styles.levelBtnLabel, { color: crisisBtnLabel }]}>
                  Línea de la Vida
                </Text>
                <Text style={[styles.levelBtnHint, { color: btnHint }]}>
                  800 911-2000 · gratuita · 24h
                </Text>
              </Pressable>

              {/* ── SAPTEL ───────────────────────────────────────────── */}
              <Pressable
                onPress={callSAPTEL}
                style={({ pressed }) => [
                  styles.levelBtn,
                  { backgroundColor: crisisBtnBg },
                  pressed && styles.levelBtnPressed,
                ]}
                accessibilityRole="button"
                accessibilityLabel="Llamar a SAPTEL, 55 5259-8121, gratuita 24 horas"
              >
                <Text style={[styles.levelBtnLabel, { color: crisisBtnLabel }]}>
                  SAPTEL
                </Text>
                <Text style={[styles.levelBtnHint, { color: btnHint }]}>
                  (55) 5259-8121 · gratuita · 24h
                </Text>
              </Pressable>

            </View>

            {/* Opción secundaria: ejercicios de respiración (no es CTA principal) */}
            <Pressable
              onPress={() => setStep("levels")}
              style={[styles.secondaryLink]}
              accessibilityRole="button"
              accessibilityLabel="Continuar con ejercicios de respiración"
            >
              <Text style={[styles.secondaryLinkText, { color: btnHint }]}>
                Prefiero hacer un ejercicio →
              </Text>
            </Pressable>
          </View>
        )}

        {/* ── Paso 3: Selección de nivel estándar (respuesta No) ────────── */}
        {step === "levels" && (
          <View style={styles.centerContent}>
            <Typography variant="crisis" className="text-center mb-10">
              ¿Dónde estás ahora?
            </Typography>

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
                  <Text style={[styles.levelBtnLabel, { color: btnLabel }]}>
                    {label}
                  </Text>
                  <Text style={[styles.levelBtnHint, { color: btnHint }]}>
                    {hint}
                  </Text>
                </Pressable>
              ))}
            </View>
          </View>
        )}

      </View>
    </SafeScreen>
  );
}

// ── Estilos ────────────────────────────────────────────────────────────────
// StyleSheet obligatorio en rescue/* — valores de crisis son críticos y no
// deben variar con la compilación de NativeWind (FRONTEND_GUIDELINES §11).
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
  },
  // ── Contenido centrado ───────────────────────────────────────────────────
  centerContent: {
    flex: 1,
    justifyContent: "center",
  },
  // ── Botones de opción ────────────────────────────────────────────────────
  optionsContainer: {
    gap: 16,
  },
  levelBtn: {
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
    fontSize: 22,
    fontWeight: "600",
    textAlign: "center",
  },
  levelBtnHint: {
    fontSize: 13,
    textAlign: "center",
  },
  // ── Link secundario (opción de ejercicios en crisis_support) ─────────────
  secondaryLink: {
    marginTop: 28,
    alignSelf: "center",
    paddingVertical: 12,
    paddingHorizontal: 16,
    minHeight: 44, // Tap target WCAG
  },
  secondaryLinkText: {
    fontSize: 15,
    textAlign: "center",
  },
});
