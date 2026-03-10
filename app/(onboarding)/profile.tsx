/**
 * (onboarding)/profile.tsx — S07: Profile Questionnaire
 *
 * Mandatory profile screen — no skip button (C1 decision 2026-03-10).
 * Trimmed to 5 questions: name (required), sensory profile (sound + light + textures + crowds),
 * interests (optional chips), existing tools (optional multiselect).
 *
 * T-F3 changes (2026-03-10):
 *   - Removed age field — not in DB schema, no clinical value without interpretation context
 *   - Name is the only hard validation block — form cannot submit without it
 *   - Sensitivities section always shown (sound + light are primary per profile spec)
 *   - Interests trimmed to 8 most common options
 *   - Subtitle updated: warm framing, name is the only required field
 *   - No skip button
 *
 * Saves to Supabase:
 *   display_name → users table (B-46)
 *   interests, sensitivities {key: boolean}, existing_tools → profiles table (B-41/B-48)
 *
 * On success: navigates to contacts.tsx (S08).
 * On Supabase failure: logs warning and continues — profile can be completed from Settings.
 */
import React, { useState } from "react";
import { View, ScrollView } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { SafeScreen, Typography, Button, TextInput, Chip } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

// All 6 canonical ASD sensory types — multiselect, none required (pick as many as apply).
// Source: Aibus sensory profile decision 2026-03-10 (w4rw1ck confirmed).
// Stored as JSONB object: { sound: true, light: true, ... } (B-48).
const SENSITIVITIES = [
  { key: "sound",    label: "Sonido" },           // auditory
  { key: "light",    label: "Luz" },              // visual brightness
  { key: "smell",    label: "Olores" },           // olfactory
  { key: "touch",    label: "Tacto" },            // tactile / textures
  { key: "patterns", label: "Patrones visuales" }, // visual patterns / movement
  { key: "taste",    label: "Sabor" },            // gustatory
];

// Interests — trimmed to 8 most relevant options (full list available in Settings later)
const INTERESTS = [
  "Tecnología", "Música", "Arte", "Ciencia",
  "Videojuegos", "Lectura", "Naturaleza", "Cine",
];

// Tools currently in use — optional multiselect
const TOOLS = [
  "Journaling", "Terapia", "Meditación", "Ejercicio", "Ninguna",
];

interface FormData {
  /** Required — only hard validation block. Saved to users.display_name */
  name: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);
  const [isSaving, setIsSaving] = useState(false);

  // Multiselect state — managed outside react-hook-form (no text input, chip toggles)
  const [selectedSensitivities, setSelectedSensitivities] = useState<string[]>([]);
  const [selectedInterests,     setSelectedInterests]     = useState<string[]>([]);
  const [selectedTools,         setSelectedTools]         = useState<string[]>([]);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>({
    defaultValues: { name: "" },
  });

  /** Toggle a chip item in a string array */
  const toggle = (
    item: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    setSelected(
      selected.includes(item)
        ? selected.filter((i) => i !== item)
        : [...selected, item]
    );
  };

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      if (!supabaseUserId) {
        // supabaseUserId can be null if sync-privy-user failed (no network, etc.).
        // We skip the upsert and continue — profile can be completed from Settings (T-F5).
        console.warn("[Profile] supabaseUserId is null — skipping Supabase save");
      } else {
        /**
         * Two-operation save pattern (B-46):
         *   1. profiles table: interests, sensitivities, existing_tools
         *   2. users table: display_name
         *
         * B-41: using upsert (not update) to handle new rows safely.
         * B-48: sensitivities saved as JSONB object {key: boolean}, not array.
         * B-47: age field removed — does not exist in schema.
         */

        // ── 1. Profile data → profiles table ──────────────────────────────
        await supabase
          .from("profiles")
          .upsert(
            {
              user_id:        supabaseUserId,
              interests:      selectedInterests,
              // B-48: JSONB object format: { sound: true, light: true }
              sensitivities:  Object.fromEntries(
                selectedSensitivities.map((k) => [k, true])
              ),
              existing_tools: selectedTools,
            },
            { onConflict: "user_id" }
          );

        // ── 2. Display name → users table (B-46) ──────────────────────────
        if (data.name.trim()) {
          await supabase
            .from("users")
            .update({ display_name: data.name.trim() })
            .eq("id", supabaseUserId);
        }
      }
    } catch (e) {
      console.warn("[Profile] Error saving profile:", e);
      // Non-blocking — user can complete profile from Settings (T-F5)
    } finally {
      setIsSaving(false);
      router.push("/(onboarding)/contacts");
    }
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8 gap-6">

          {/* Header — warm framing, name-only requirement */}
          <View className="gap-2">
            <Typography variant="headingL">Cuéntanos sobre ti</Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Solo tu nombre es necesario — el resto nos ayuda a personalizar
              tu experiencia, pero puedes completarlo después.
            </Typography>
          </View>

          {/* ── Question 1: Name (required) ── */}
          <View className="gap-2">
            <Typography variant="headingS">
              ¿Cómo te llamamos?{" "}
              <Typography
                variant="headingS"
                className="text-script-crisis-soft"
              >
                *
              </Typography>
            </Typography>
            <Controller
              control={control}
              name="name"
              rules={{ required: "Necesitamos un nombre para continuar" }}
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Tu nombre o apodo"
                  accessibilityLabel="Nombre o apodo (obligatorio)"
                />
              )}
            />
            {/* Inline validation error */}
            {errors.name && (
              <Typography
                variant="caption"
                className="text-script-crisis-soft"
              >
                {errors.name.message}
              </Typography>
            )}
          </View>

          {/* ── Question 2: Sensory profile ── */}
          <View className="gap-2">
            <Typography variant="headingS">¿Qué estímulos te afectan?</Typography>
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Selecciona los que apliquen — no tienes que elegir ninguno.
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {SENSITIVITIES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={selectedSensitivities.includes(s.key)}
                  onPress={() =>
                    toggle(s.key, selectedSensitivities, setSelectedSensitivities)
                  }
                />
              ))}
            </View>
          </View>

          {/* ── Question 3: Interests (optional) ── */}
          <View className="gap-2">
            <Typography variant="headingS">
              ¿Qué cosas te interesan?{" "}
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary"
              >
                (opcional)
              </Typography>
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {INTERESTS.map((interest) => (
                <Chip
                  key={interest}
                  label={interest}
                  selected={selectedInterests.includes(interest)}
                  onPress={() =>
                    toggle(interest, selectedInterests, setSelectedInterests)
                  }
                />
              ))}
            </View>
          </View>

          {/* ── Question 4: Existing tools (optional) ── */}
          <View className="gap-2">
            <Typography variant="headingS">
              ¿Qué herramientas ya usas?{" "}
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary"
              >
                (opcional)
              </Typography>
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {TOOLS.map((tool) => (
                <Chip
                  key={tool}
                  label={tool}
                  selected={selectedTools.includes(tool)}
                  onPress={() =>
                    toggle(tool, selectedTools, setSelectedTools)
                  }
                />
              ))}
            </View>
          </View>

          <View className="flex-1" />

          {/* Submit — disabled while saving */}
          <Button
            title={isSaving ? "Guardando..." : "Continuar →"}
            onPress={handleSubmit(onSubmit)}
            variant="primary"
            disabled={isSaving}
          />
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
