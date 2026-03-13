/**
 * lib/profile-seed.ts — Sintetiza scores de tests en un perfil semilla
 *
 * INPUT: scores de todos los tests completados durante onboarding
 * OUTPUT: perfil semilla que personaliza la primera experiencia del usuario
 *
 * ⚠️ RUNTIME ONLY: estos valores NO se persisten en Supabase
 * (no existen esas columnas en la tabla profiles).
 * Se guardan en el Zustand store y se re-calculan desde los scores guardados.
 * Opcionalmente se pueden cachear en SecureStore.
 *
 * H-NEW-03 — TODO Sprint 3.X: Wire up `generateProfileSeed()` to onboarding completion.
 * Call from `app/(onboarding)/contacts.tsx::completeOnboarding()` after scores are saved:
 *   const seed = generateProfileSeed(authStore.scores);
 *   authStore.setProfileSeed(seed); // add to stores/auth.ts
 * This seeds script priorities (scriptsPriority) and sensory defaults into home.tsx
 * so the first-session content is personalized, not generic.
 *
 * La lógica está basada en las tablas de impacto del PRD §3.1:
 * - AQ alto → scripts de socialización primero
 * - CAT-Q alto en enmascaramiento → mensajes de autenticidad
 * - CAT-Q alto en compensación → scripts de navegación social
 * - RAADS-R alto en motor sensorial → perfil sensorial pre-populado
 * - RAADS-R alto en relaciones sociales → scripts sociales prioritarios
 */

/** Scores de entrada (todos opcionales — el usuario puede saltar tests) */
export interface TestScores {
  aq10Score?: number;
  aqFullScore?: number;
  aqFullDomainScores?: {
    social: number;
    attention_switching: number;
    attention_detail: number;
    communication: number;
    imagination: number;
  };
  catqTotalScore?: number;
  catqSubscores?: {
    compensation: number;
    masking: number;
    assimilation: number;
  };
  raadsTotalScore?: number;
  raadsDomainScores?: {
    social_relatedness: number;
    language: number;
    circumscribed_interests: number;
    sensory_motor: number;
  };
}

/** Perfil semilla generado */
export interface ProfileSeed {
  /** Qué categorías de scripts mostrar primero */
  scriptsPriority: string[];
  /** Valores por defecto del perfil sensorial */
  sensoryDefaults: {
    light: "low" | "medium" | "high";
    sound: "low" | "medium" | "high";
    touch: "low" | "medium" | "high";
    crowds: "low" | "medium" | "high";
  };
  /** Énfasis principal del perfil */
  emphasis: "social" | "sensory" | "masking" | "general";
}

/**
 * Genera un perfil semilla a partir de los scores de los tests.
 * Si no hay scores, retorna un perfil general por defecto.
 */
export function generateProfileSeed(scores: TestScores): ProfileSeed {
  const scriptsPriority: string[] = [];
  let emphasis: ProfileSeed["emphasis"] = "general";

  // Sensory defaults — empezamos en "medium" y ajustamos con datos
  const sensoryDefaults: ProfileSeed["sensoryDefaults"] = {
    light: "medium",
    sound: "medium",
    touch: "medium",
    crowds: "medium",
  };

  // === AQ (10 o Full) — determina si scripts sociales son prioridad ===
  const aqScore = scores.aqFullScore ?? (scores.aq10Score ?? 0) * 5; // Normalizar AQ-10 a escala ~50
  if (aqScore >= 32 || (scores.aq10Score && scores.aq10Score >= 6)) {
    scriptsPriority.push("social_interaction", "conversation_basics");
    emphasis = "social";
  }

  // === AQ Full domain scores — ajustes finos ===
  if (scores.aqFullDomainScores) {
    const d = scores.aqFullDomainScores;
    if (d.communication >= 7) {
      scriptsPriority.push("communication_strategies");
    }
    if (d.attention_switching >= 7) {
      scriptsPriority.push("transition_helpers");
    }
  }

  // === CAT-Q — enmascaramiento y compensación ===
  if (scores.catqSubscores) {
    const { masking, compensation, assimilation } = scores.catqSubscores;

    // Enmascaramiento alto (≥20 de 28): reforzar autenticidad
    if (masking >= 20) {
      scriptsPriority.push("authenticity_reminders");
      emphasis = "masking";
    }

    // Compensación alta (≥60 de 84): scripts de navegación social
    if (compensation >= 60) {
      scriptsPriority.push("social_navigation");
    }

    // Asimilación alta (≥45 de 63): scripts con observación
    if (assimilation >= 45) {
      scriptsPriority.push("observation_strategies");
    }
  }

  // === RAADS-R — perfil sensorial y social ===
  if (scores.raadsDomainScores) {
    const r = scores.raadsDomainScores;

    // Motor sensorial alto: pre-popular sensibilidades
    if (r.sensory_motor >= 30) {
      sensoryDefaults.sound = "high";
      sensoryDefaults.touch = "high";
      sensoryDefaults.light = "high";
      sensoryDefaults.crowds = "high";
      if (emphasis === "general") emphasis = "sensory";
    }

    // Relaciones sociales alto: scripts sociales prioritarios
    if (r.social_relatedness >= 60) {
      if (!scriptsPriority.includes("social_interaction")) {
        scriptsPriority.push("social_interaction");
      }
      if (emphasis === "general") emphasis = "social";
    }
  }

  // Si no hay scripts específicos, poner los genéricos
  if (scriptsPriority.length === 0) {
    scriptsPriority.push("general", "daily_routines", "self_care");
  }

  return { scriptsPriority, sensoryDefaults, emphasis };
}
