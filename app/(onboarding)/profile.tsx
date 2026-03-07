/**
 * (onboarding)/profile.tsx — S07: Cuestionario Personal
 *
 * Formulario con react-hook-form + zod para recopilar datos básicos:
 * - Nombre, edad, intereses, sensibilidades, herramientas existentes
 *
 * Guarda en tabla `profiles` de Supabase vía upsert (B-41).
 * Al completar: navega a contacts.tsx (S08).
 */
import React, { useState } from "react";
import { View, ScrollView, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { useForm, Controller } from "react-hook-form";
import { SafeScreen, Typography, Button, TextInput, Chip } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

// Opciones predefinidas
const INTERESTS = [
  "Tecnología", "Música", "Arte", "Ciencia", "Videojuegos",
  "Lectura", "Naturaleza", "Cocina", "Deportes", "Cine",
  "Escritura", "Fotografía", "Historia", "Matemáticas", "Idiomas",
];

const SENSITIVITIES = [
  { key: "light", label: "Luz" },
  { key: "sound", label: "Sonido" },
  { key: "textures", label: "Texturas" },
  { key: "crowds", label: "Multitudes" },
];

const TOOLS = [
  "Journaling", "Terapia", "Meditación", "Ejercicio", "Ninguna",
];

interface FormData {
  name: string;
  age: string;
}

export default function ProfileScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);
  const [isSaving, setIsSaving] = useState(false);

  // Multiselect states (managed outside react-hook-form for simplicity)
  const [selectedInterests, setSelectedInterests] = useState<string[]>([]);
  const [selectedSensitivities, setSelectedSensitivities] = useState<string[]>([]);
  const [selectedTools, setSelectedTools] = useState<string[]>([]);

  const { control, handleSubmit } = useForm<FormData>({
    defaultValues: { name: "", age: "" },
  });

  /** Toggle un item en un array de selección */
  const toggle = (
    item: string,
    selected: string[],
    setSelected: (v: string[]) => void
  ) => {
    if (selected.includes(item)) {
      setSelected(selected.filter((i) => i !== item));
    } else {
      setSelected([...selected, item]);
    }
  };

  const onSubmit = async (data: FormData) => {
    setIsSaving(true);
    try {
      if (!supabaseUserId) {
        // M-04: supabaseUserId puede ser null si sync-privy-user falló (sin internet, etc.)
        // En ese caso no intentamos el UPSERT (fallaría con RLS error) y continuamos el flujo.
        // El perfil se puede completar más tarde desde Ajustes.
        console.warn("[Profile] supabaseUserId es null — saltando guardado en Supabase");
      } else {
        /**
         * B-41: Usar upsert en vez de update.
         *
         * Problema original: si sync-privy-user no creó la fila en `profiles`
         * (sin conexión, Edge Function no deployada, etc.), `.update()` ejecuta
         * 0 rows affected silenciosamente — el perfil del usuario se pierde.
         *
         * upsert({ user_id, ...data }, { onConflict: 'user_id' }):
         *   - Si existe fila con ese user_id → hace UPDATE
         *   - Si no existe → hace INSERT
         *   - Nunca falla silenciosamente por fila inexistente
         */
        await supabase
          .from("profiles")
          .upsert(
            {
              user_id: supabaseUserId,
              display_name: data.name || null,
              age: data.age ? parseInt(data.age, 10) : null,
              interests: selectedInterests,
              sensitivities: selectedSensitivities,
              existing_tools: selectedTools,
            },
            { onConflict: "user_id" }
          );
      }
    } catch (e) {
      console.warn("[Profile] Error guardando perfil:", e);
      // No bloqueamos al usuario — puede completar perfil desde Ajustes (Semana 2)
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
          <View className="gap-2">
            <Typography variant="headingL">Cuéntanos sobre ti</Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Esto nos ayuda a personalizar tu experiencia. Todo es opcional.
            </Typography>
          </View>

          {/* Nombre */}
          <View className="gap-2">
            <Typography variant="headingS">¿Cómo te llamamos?</Typography>
            <Controller
              control={control}
              name="name"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Tu nombre o apodo"
                  accessibilityLabel="Nombre o apodo"
                />
              )}
            />
          </View>

          {/* Edad */}
          <View className="gap-2">
            <Typography variant="headingS">Edad</Typography>
            <Controller
              control={control}
              name="age"
              render={({ field: { onChange, value } }) => (
                <TextInput
                  value={value}
                  onChangeText={onChange}
                  placeholder="Ej: 28"
                  keyboardType="number-pad"
                  accessibilityLabel="Edad"
                />
              )}
            />
          </View>

          {/* Intereses */}
          <View className="gap-2">
            <Typography variant="headingS">Intereses</Typography>
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

          {/* Sensibilidades */}
          <View className="gap-2">
            <Typography variant="headingS">Sensibilidades</Typography>
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              ¿Qué estímulos te afectan más de lo habitual?
            </Typography>
            <View className="flex-row flex-wrap gap-2">
              {SENSITIVITIES.map((s) => (
                <Chip
                  key={s.key}
                  label={s.label}
                  selected={selectedSensitivities.includes(s.key)}
                  onPress={() =>
                    toggle(
                      s.key,
                      selectedSensitivities,
                      setSelectedSensitivities
                    )
                  }
                />
              ))}
            </View>
          </View>

          {/* Herramientas existentes */}
          <View className="gap-2">
            <Typography variant="headingS">
              ¿Qué herramientas ya usas?
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
