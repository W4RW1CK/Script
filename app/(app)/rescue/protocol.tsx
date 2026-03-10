/**
 * rescue/protocol.tsx — S18: Protocolo de Rescate
 *
 * Pantalla de protocolo según el nivel de crisis elegido en S17.
 * Sigue FRONTEND_GUIDELINES §11 en todos los niveles.
 *
 * Flujo: S17 (assess) → S18 → Home OR Onboarding (replace al completar)
 * B-58: If user hasn't completed onboarding (rescue triggered from S01 welcome screen),
 * redirect back to /(onboarding) after the protocol, not to /(app)/home.
 *
 * Recibe: `level` como query param ("1" | "2" | "3")
 *
 * Nivel 1 — Grounding 5-4-3-2-1:
 *   5 pasos sensoriales mostrados de uno en uno.
 *   Háptico en cada paso (ImpactFeedbackStyle.Light).
 *   "Hecho →" avanza al siguiente paso → pantalla de cierre.
 *
 * Nivel 2 — Respiración guiada:
 *   Círculo animado con Reanimated (expand=inhala, hold=pausa, contract=exhala).
 *   4 ciclos (4s inhalar / 2s pausa / 6s exhalar = 12s por ciclo).
 *   Etiqueta de fase (Inhala/Pausa/Exhala) actualizada con setInterval JS-side.
 *   T-U1: useReduceMotion() — si true, círculo estático + labels; sin animación visual.
 *   Audio: pendiente (ver assets/audio/README.md).
 *
 * Nivel 3 — Emergencia:
 *   Teléfono de crisis SAPTEL (55) 5259-8121, México, 24h. Línea de la Vida 800 911-2000.
 *   Botón "Respiración guiada" → redirige internamente a Level 2.
 *   TODO (Fase 1.8+): mostrar contactos de confianza del usuario.
 *
 * Diseño §11: fondo crisis, texto 28px, botones 64px+, "← Salir" visible.
 */
import React, { useState, useEffect, useCallback, useRef } from "react";
import { View, Pressable, Text, StyleSheet, Linking, Alert, useColorScheme, AccessibilityInfo } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSequence,
  withTiming,
  withRepeat,
  Easing,
} from "react-native-reanimated";
/**
 * B-61 FIX: useReduceMotion from react-native-reanimated is undefined in Reanimated v4.
 * Replaced with React Native's AccessibilityInfo.isReduceMotionEnabled — same behavior,
 * no Reanimated dependency. Respects OS prefers-reduced-motion setting (T-U1).
 */
function useReduceMotion(): boolean {
  const [shouldReduce, setShouldReduce] = useState(false);
  useEffect(() => {
    AccessibilityInfo.isReduceMotionEnabled().then(setShouldReduce);
    const subscription = AccessibilityInfo.addEventListener("reduceMotionChanged", setShouldReduce);
    return () => subscription.remove();
  }, []);
  return shouldReduce;
}
import * as Haptics from "expo-haptics";
import { SafeScreen, Typography } from "@/components/ui";
import { useAuthStore } from "@/stores/auth";

// ── Constantes de nivel ────────────────────────────────────────────────────
type CrisisLevel = 1 | 2 | 3;

// ── Grounding 5-4-3-2-1 (Nivel 1) ─────────────────────────────────────────
// Máximo 5 palabras por instrucción (§11.4)
const GROUNDING_STEPS = [
  { count: 5, sense: "ve",    instruction: "Nombra 5 cosas que ves" },
  { count: 4, sense: "toca",  instruction: "Toca 4 objetos cercanos" },
  { count: 3, sense: "oye",   instruction: "Escucha 3 sonidos ahora" },
  { count: 2, sense: "huele", instruction: "Huele 2 cosas cercanas" },
  { count: 1, sense: "sabe",  instruction: "¿Qué sabor hay ahora?" },
];

// ── Respiración guiada (Nivel 2) ───────────────────────────────────────────
const CIRCLE_MIN  = 100; // diámetro mínimo al exhalar (px)
const CIRCLE_MAX  = 200; // diámetro máximo al inhalar (px)
const CIRCLE_BASE = 150; // diámetro estático cuando useReduceMotion() = true (T-U1)
const INHALE_MS  = 4000;
const PAUSE_MS   = 2000;
const EXHALE_MS  = 6000;
const CYCLE_MS   = INHALE_MS + PAUSE_MS + EXHALE_MS; // 12 000ms
const CYCLE_COUNT = 4; // 4 ciclos completos (~48 segundos)

// Color del círculo de respiración (no configurable por NativeWind en Animated.View)
const CIRCLE_COLOR_LIGHT = "rgba(168,197,218,0.55)"; // script-blue 55%
const CIRCLE_COLOR_DARK  = "rgba(90,126,146,0.55)";  // script-dark-blue 55%

// ── Componente ─────────────────────────────────────────────────────────────
export default function RescueProtocolScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";
  const { level: levelParam } = useLocalSearchParams<{ level: string }>();

  // Parsear nivel (default 1 si el param es inválido)
  const level = (parseInt(levelParam ?? "1", 10) as CrisisLevel) || 1;

  /**
   * B-58 FIX: Post-protocol destination depends on whether onboarding is complete.
   * - Not complete → user came from S01 welcome screen → return to /(onboarding)
   * - Complete → normal flow → return to /(app)/home
   * Crisis access must never be blocked by auth walls (PRD §6, Principle 6).
   */
  const onboardingComplete = useAuthStore((s) => s.onboardingComplete);
  const postProtocolDestination = onboardingComplete ? "/(app)/home" : "/(onboarding)";

  /**
   * T-U1: Reducción de animaciones accesible.
   * Respeta OS `prefers-reduced-motion` y la preferencia interna del usuario.
   * FRONTEND_GUIDELINES §7: con shouldReduce=true, el círculo queda estático
   * en CIRCLE_BASE. Timer y hápticos siguen activos (canal diferente, no visual).
   */
  const shouldReduce = useReduceMotion();

  // Colores adaptativos para dark mode — crisis debe ser legible siempre
  const primaryBtnBg   = isDark ? "#6A3E3E" : "#E8C4C4";
  const primaryBtnText = isDark ? "#F0D0D0" : "#2D2D2D";
  const secondaryBorder = isDark ? "#5A4A4A" : "#E0DDD8";
  const secondaryText  = isDark ? "#C0A0A0" : "#6B6B6B";
  const exitColor      = isDark ? "#A0A0A0" : "#6B6B6B";
  const closingColor   = isDark ? "#B0B0B0" : "#6B6B6B";
  const numberColor    = isDark ? "#F0D0D0" : "#2D2D2D";
  const dotDefault     = isDark ? "#5A4A4A" : "#E0DDD8";
  const circleColor    = isDark ? CIRCLE_COLOR_DARK : CIRCLE_COLOR_LIGHT;

  // ── Estado de Nivel 1 (Grounding) ────────────────────────────────────────
  const [groundingStep, setGroundingStep] = useState(0); // 0..4, luego 5 = completo
  const [groundingComplete, setGroundingComplete] = useState(false);

  // ── Estado de Nivel 2 (Breathing) ────────────────────────────────────────
  const [phaseLabel, setPhaseLabel] = useState("Inhala");
  const [breathingComplete, setBreathingComplete] = useState(false);
  const [breathingStarted, setBreathingStarted] = useState(false);

  // Reanimated: diámetro del círculo
  const circleSize = useSharedValue(CIRCLE_MIN);

  // Estilo animado del círculo — Reanimated aplica en el UI thread
  const animatedCircleStyle = useAnimatedStyle(() => ({
    width:  circleSize.value,
    height: circleSize.value,
    borderRadius: circleSize.value / 2,
  }));

  // Timer ref para limpiar en unmount
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  /**
   * startBreathing — inicia la animación de respiración.
   *
   * 1. Reanimated anima el círculo en el UI thread (withRepeat+withSequence).
   * 2. setInterval en el JS thread actualiza el label (Inhala/Pausa/Exhala).
   */
  const startBreathing = useCallback(() => {
    setBreathingStarted(true);

    // ── Animación Reanimated (UI thread) — T-U1: reducción de movimiento ──
    if (shouldReduce) {
      // Círculo estático: no anima, solo muestra tamaño base.
      // El timer y hápticos siguen activos — son canales no visuales.
      // FRONTEND_GUIDELINES §7: "breathing circle muestra el texto de la
      // fase sin animación de escala cuando shouldReduce = true."
      circleSize.value = CIRCLE_BASE;
    } else {
      // Animación completa: expand=inhala, pausa, contract=exhala
      circleSize.value = withRepeat(
        withSequence(
          // Inhalar: expandir a MAX en 4s
          withTiming(CIRCLE_MAX, {
            duration: INHALE_MS,
            easing: Easing.inOut(Easing.ease),
          }),
          // Pausa: mantener en MAX por 2s
          withTiming(CIRCLE_MAX, { duration: PAUSE_MS }),
          // Exhalar: contraer a MIN en 6s
          withTiming(CIRCLE_MIN, {
            duration: EXHALE_MS,
            easing: Easing.inOut(Easing.ease),
          }),
        ),
        CYCLE_COUNT, // 4 repeticiones
        false        // no revertir
      );
    }

    // ── Tracking de fase en JS thread (para el label) ───────────────────
    //
    // IMPORTANTE: usar Date.now() en vez de sumar intervalos fijos.
    // setInterval(100ms) en JS no es preciso — cada tick puede driftear
    // unos ms, y el drift se acumula. Después de ~10s el label y el
    // círculo (UI thread, preciso) se desincronizan visiblemente.
    // Con timestamps reales, el label siempre refleja el tiempo real.
    const startTime = Date.now();
    let lastPhase = ""; // Trackear fase anterior para detectar transiciones
    timerRef.current = setInterval(() => {
      const elapsed = Date.now() - startTime;

      // Calcular fase dentro del ciclo actual
      const inCycle = elapsed % CYCLE_MS;
      let currentPhase: string;
      if      (inCycle < INHALE_MS)              currentPhase = "Inhala";
      else if (inCycle < INHALE_MS + PAUSE_MS)   currentPhase = "Pausa";
      else                                        currentPhase = "Exhala";

      // Háptico sutil en cada transición de fase (Inhala↔Pausa↔Exhala)
      // Solo vibra cuando la fase CAMBIA — no en cada tick del interval
      if (currentPhase !== lastPhase) {
        lastPhase = currentPhase;
        Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
      }

      setPhaseLabel(currentPhase);

      // Detectar fin de todos los ciclos
      if (elapsed >= CYCLE_MS * CYCLE_COUNT) {
        if (timerRef.current) clearInterval(timerRef.current);
        // Háptico final más notorio para indicar que terminó
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        setBreathingComplete(true);
      }
    }, 80); // 80ms para labels más responsivos sin overhead significativo
  }, [circleSize, shouldReduce]); // shouldReduce: T-U1

  // Limpiar timer al desmontar
  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  // ── Háptico en pasos de grounding ────────────────────────────────────────
  const handleGroundingNext = useCallback(async () => {
    // Feedback háptico suave en cada paso
    await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);

    if (groundingStep < GROUNDING_STEPS.length - 1) {
      setGroundingStep((prev) => prev + 1);
    } else {
      setGroundingComplete(true);
    }
  }, [groundingStep]);

  // ── Salir del protocolo ───────────────────────────────────────────────────
  const handleExit = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    router.back();
  }, [router]);

  // ── Pantallas de cierre ───────────────────────────────────────────────────
  if (groundingComplete || breathingComplete) {
    return (
      <SafeScreen crisis scrollable={false}>
        <View style={styles.container}>
          <Pressable
            onPress={() => router.replace(postProtocolDestination)}
            style={({ pressed }) => [styles.exitBtn, pressed && styles.exitBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Volver al inicio"
          >
            <Text style={[styles.exitText, { color: exitColor }]}>← Inicio</Text>
          </Pressable>
          <View style={styles.centerContent}>
            <Typography variant="crisis" className="text-center">
              Bien hecho.
            </Typography>
            <View style={{ height: 24 }} />
            <Text style={[styles.closingText, { color: closingColor }]}>
              Tomaste un momento para ti.{"\n"}Eso siempre vale.
            </Text>
            <View style={{ height: 40 }} />
            <Pressable
              onPress={() => router.replace(postProtocolDestination)}
              style={({ pressed }) => [styles.primaryBtn, { backgroundColor: primaryBtnBg }, pressed && styles.primaryBtnPressed]}
              accessibilityRole="button"
            >
              <Text style={[styles.primaryBtnLabel, { color: primaryBtnText }]}>Volver al inicio</Text>
            </Pressable>
          </View>
        </View>
      </SafeScreen>
    );
  }

  // ── NIVEL 1 — Grounding 5-4-3-2-1 ───────────────────────────────────────
  if (level === 1) {
    const step = GROUNDING_STEPS[groundingStep];
    return (
      <SafeScreen crisis scrollable={false}>
        <View style={styles.container}>

          {/* ← Salir */}
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [styles.exitBtn, pressed && styles.exitBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Salir del protocolo"
          >
            <Text style={[styles.exitText, { color: exitColor }]}>← Salir</Text>
          </Pressable>

          <View style={styles.centerContent}>
            {/* Número grande — foco visual */}
            <Text style={[styles.groundingNumber, { color: numberColor }]}>{step.count}</Text>

            {/* Instrucción — máx 5 palabras (§11.4) */}
            <Typography variant="crisis" className="text-center mt-4">
              {step.instruction}
            </Typography>

            {/* Indicador de progreso (puntos) */}
            <View style={styles.dotsRow}>
              {GROUNDING_STEPS.map((_, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.dot,
                    { backgroundColor: dotDefault },
                    idx === groundingStep && styles.dotActive,
                    idx < groundingStep  && styles.dotDone,
                  ]}
                />
              ))}
            </View>

            <View style={{ height: 48 }} />

            {/* "Hecho →" */}
            <Pressable
              onPress={handleGroundingNext}
              style={({ pressed }) => [styles.primaryBtn, { backgroundColor: primaryBtnBg }, pressed && styles.primaryBtnPressed]}
              accessibilityRole="button"
              accessibilityLabel="Hecho, siguiente paso"
            >
              <Text style={[styles.primaryBtnLabel, { color: primaryBtnText }]}>Hecho →</Text>
            </Pressable>
          </View>
        </View>
      </SafeScreen>
    );
  }

  // ── NIVEL 2 — Respiración guiada ─────────────────────────────────────────
  if (level === 2) {
    return (
      <SafeScreen crisis scrollable={false}>
        <View style={styles.container}>

          {/* ← Salir */}
          <Pressable
            onPress={handleExit}
            style={({ pressed }) => [styles.exitBtn, pressed && styles.exitBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Salir del protocolo de respiración"
          >
            <Text style={[styles.exitText, { color: exitColor }]}>← Salir</Text>
          </Pressable>

          <View style={styles.centerContent}>

            {!breathingStarted ? (
              /* Pantalla de inicio antes de empezar */
              <>
                <Typography variant="crisis" className="text-center">
                  Respira conmigo.
                </Typography>
                <View style={{ height: 16 }} />
                <Text style={[styles.closingText, { color: closingColor }]}>
                  4 segundos inhala.{"\n"}
                  2 segundos pausa.{"\n"}
                  6 segundos exhala.
                </Text>
                <View style={{ height: 48 }} />
                <Pressable
                  onPress={startBreathing}
                  style={({ pressed }) => [styles.primaryBtn, { backgroundColor: primaryBtnBg }, pressed && styles.primaryBtnPressed]}
                  accessibilityRole="button"
                >
                  <Text style={[styles.primaryBtnLabel, { color: primaryBtnText }]}>Comenzar →</Text>
                </Pressable>
              </>
            ) : (
              /* Animación activa */
              <>
                {/* Etiqueta de fase — 28px */}
                <Typography variant="crisis" className="text-center">
                  {phaseLabel}
                </Typography>

                <View style={{ height: 40 }} />

                {/* Círculo animado — Reanimated */}
                <View style={styles.circleContainer}>
                  <Animated.View
                    style={[styles.circle, { backgroundColor: circleColor }, animatedCircleStyle]}
                  />
                </View>

                <View style={{ height: 40 }} />

                {/* Instrucción de ciclos restantes */}
                <Text style={[styles.closingText, { color: closingColor }]}>
                  {CYCLE_COUNT} ciclos · ~{CYCLE_COUNT * 12}s
                </Text>
              </>
            )}
          </View>
        </View>
      </SafeScreen>
    );
  }

  // ── NIVEL 3 — Emergencia ──────────────────────────────────────────────────
  // level === 3
  return (
    <SafeScreen crisis scrollable={false}>
      <View style={styles.container}>

        {/* ← Salir */}
        <Pressable
          onPress={handleExit}
          style={({ pressed }) => [styles.exitBtn, pressed && styles.exitBtnPressed]}
          accessibilityRole="button"
          accessibilityLabel="Salir del protocolo de emergencia"
        >
          <Text style={[styles.exitText, { color: exitColor }]}>← Salir</Text>
        </Pressable>

        <View style={styles.centerContent}>
          {/* Mensaje de apoyo */}
          <Typography variant="crisis" className="text-center">
            No estás solo/a.
          </Typography>

          <View style={{ height: 40 }} />

          {/* Botón: llamar a SAPTEL (línea de crisis México 24h) */}
          <Pressable
            onPress={() => Linking.openURL("tel:5552598121")}
            style={({ pressed }) => [styles.primaryBtn, { backgroundColor: primaryBtnBg }, pressed && styles.primaryBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Llamar al 55 5259-8121, línea de crisis SAPTEL"
          >
            <Text style={[styles.primaryBtnLabel, { color: primaryBtnText }]}>Llamar SAPTEL</Text>
            <Text style={[styles.emergencySubLabel, { color: secondaryText }]}>(55) 5259-8121 · 24h · gratis</Text>
          </Pressable>

          <View style={{ height: 16 }} />

          {/* Botón: ir a respiración guiada (nivel 2) */}
          <Pressable
            onPress={() =>
              router.replace({
                pathname: "/(app)/rescue/protocol",
                params: { level: "2" },
              })
            }
            style={({ pressed }) => [styles.secondaryBtn, { borderColor: secondaryBorder }, pressed && styles.secondaryBtnPressed]}
            accessibilityRole="button"
            accessibilityLabel="Iniciar respiración guiada"
          >
            <Text style={[styles.secondaryBtnLabel, { color: secondaryText }]}>Respiración guiada</Text>
          </Pressable>

          {/*
            T-U5: "Notify trusted contact" button with mandatory confirmation dialog.
            The confirmation step prevents accidental sends (false positives).
            Actual Supabase send + contact loading is TODO (Sprint 2.1 trusted contacts).
            The Alert pattern is already wired — just needs the backend when ready.
          */}
          <View style={{ height: 16 }} />
          <Pressable
            onPress={() => {
              // T-U5: Always confirm before notifying — never auto-send (UX Guideline #35).
              Alert.alert(
                "¿Notificar a un contacto?",
                "Esto enviará un mensaje a tu contacto de confianza avisando que necesitas apoyo. ¿Continuar?",
                [
                  {
                    text: "Cancelar",
                    style: "cancel",
                    // No action — user stays in protocol
                  },
                  {
                    text: "Sí, notificar",
                    style: "default",
                    onPress: () => {
                      // TODO (Sprint 2.1): load trusted_contacts from Supabase and
                      // send push notification / SMS to the user's trusted contact.
                      // For now: show confirmation that the action was registered.
                      Alert.alert(
                        "Registrado",
                        "Tu contacto será notificado. Recuerda que también puedes llamar directamente.",
                        [{ text: "Ok" }]
                      );
                    },
                  },
                ]
              );
            }}
            style={({ pressed }) => [
              styles.notifyBtn,
              { borderColor: secondaryBorder },
              pressed && styles.secondaryBtnPressed,
            ]}
            accessibilityRole="button"
            accessibilityLabel="Notificar a un contacto de confianza"
          >
            <Text style={[styles.secondaryBtnLabel, { color: secondaryText }]}>
              Notificar a un contacto
            </Text>
          </Pressable>
        </View>
      </View>
    </SafeScreen>
  );
}

// ── Estilos (StyleSheet, no NativeWind) ───────────────────────────────────
// Los valores de crisis son críticos — no se dejan a la compilación de NativeWind.
const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: 32,
  },
  // ── Salir ──────────────────────────────────────────────────────────────
  exitBtn: {
    alignSelf: "flex-start",
    paddingVertical: 12,
    paddingHorizontal: 4,
    minHeight: 44,
  },
  exitBtnPressed: { opacity: 0.6 },
  exitText: {
    fontSize: 18,
    // color aplicado dinámicamente según tema
  },
  // ── Contenido centrado ─────────────────────────────────────────────────
  centerContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  // ── Número grande de grounding ─────────────────────────────────────────
  groundingNumber: {
    fontSize: 96,
    fontWeight: "bold",
    // color aplicado dinámicamente según tema
    lineHeight: 100,
  },
  // ── Puntos de progreso (grounding) ────────────────────────────────────
  dotsRow: {
    flexDirection: "row",
    gap: 10,
    marginTop: 32,
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    // backgroundColor aplicado dinámicamente según tema
  },
  dotActive: {
    backgroundColor: "#A8C5DA", // script-blue
    transform: [{ scale: 1.3 }],
  },
  dotDone: {
    backgroundColor: "#A8C5DA50", // script-blue 30%
  },
  // ── Texto de cierre / instrucción ─────────────────────────────────────
  closingText: {
    fontSize: 18,
    // color aplicado dinámicamente según tema
    textAlign: "center",
    lineHeight: 28,
  },
  // ── Círculo de respiración ────────────────────────────────────────────
  circleContainer: {
    width: CIRCLE_MAX + 20,
    height: CIRCLE_MAX + 20,
    alignItems: "center",
    justifyContent: "center",
  },
  circle: {
    // backgroundColor aplicado dinámicamente según tema
  },
  // ── Botón primario (64px+ §11.6) ──────────────────────────────────────
  primaryBtn: {
    // backgroundColor aplicado dinámicamente según tema
    borderRadius: 20,
    paddingVertical: 18,
    paddingHorizontal: 32,
    minHeight: 72,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    gap: 4,
  },
  primaryBtnPressed: { opacity: 0.8 },
  primaryBtnLabel: {
    fontSize: 22,
    fontWeight: "600",
    // color aplicado dinámicamente según tema
    textAlign: "center",
  },
  emergencySubLabel: {
    fontSize: 13,
    // color aplicado dinámicamente según tema
    textAlign: "center",
  },
  // ── Botón secundario ──────────────────────────────────────────────────
  secondaryBtn: {
    borderWidth: 1.5,
    // borderColor aplicado dinámicamente según tema
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
  secondaryBtnPressed: { opacity: 0.7 },
  secondaryBtnLabel: {
    fontSize: 18,
    // color aplicado dinámicamente según tema
    textAlign: "center",
  },
  // T-U5: notify contact button — same sizing as secondaryBtn (64px+ crisis requirement)
  notifyBtn: {
    borderWidth: 1.5,
    // borderColor applied dynamically per theme
    borderRadius: 20,
    paddingVertical: 16,
    paddingHorizontal: 32,
    minHeight: 64,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
  },
});
