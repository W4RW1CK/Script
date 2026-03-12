/**
 * scripts/index.tsx — S14: Biblioteca de Scripts
 *
 * Lista todos los scripts sociales predefinidos del usuario.
 * Permite filtrar por categoría con chips.
 *
 * Flujo: S14 → [id] (S15 Detalle) → execute (S16 Ejecución)
 *
 * Datos:
 *   - Fetch desde Supabase: WHERE is_predefined=true AND is_active=true
 *   - La política RLS "scripts_predefined_read" permite leer sin auth
 *   - Sin filtro de usuario (scripts públicos del MVP)
 *
 * UX (FRONTEND_GUIDELINES §0):
 *   - Inspiración Daylio+Finch: lista visual, emoji de categoría, tiempo estimado
 *   - Chip "Todos" + chip por categoría — tap en activo lo deselecciona
 *   - Card táctil → S15 (detalle + ejecutar)
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen, Typography, Chip, Card } from "@/components/ui";
import { supabase } from "@/lib/supabase";

// ── Tipos ──────────────────────────────────────────────────────────────────
/** Categorías válidas del schema de Supabase */
type CategoryId =
  | "conversacion"
  | "lugar_publico"
  | "trabajo_estudio"
  | "crisis"
  | "personalizado";

/** Shape mínimo de script para la lista */
type ScriptListItem = {
  id: string;
  title: string;
  description: string | null;
  category: CategoryId;
  estimated_duration_seconds: number | null;
};

// ── Metadata de categorías ─────────────────────────────────────────────────
const CATEGORIES: Array<{ id: CategoryId; label: string; emoji: string }> = [
  { id: "conversacion",    label: "Conversación",      emoji: "💬" },
  { id: "lugar_publico",   label: "Lugar público",     emoji: "🏪" },
  { id: "trabajo_estudio", label: "Trabajo / Estudio", emoji: "🏢" },
  { id: "crisis",          label: "Crisis",            emoji: "🚨" },
];

// ── Helpers ────────────────────────────────────────────────────────────────
/** Convierte segundos a etiqueta "~N min" */
function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  return `~${Math.ceil(seconds / 60)} min`;
}

/** Devuelve emoji+label de una categoría */
function getCategoryMeta(id: CategoryId) {
  return CATEGORIES.find((c) => c.id === id) ?? { label: id, emoji: "📄" };
}

// ── Componente ─────────────────────────────────────────────────────────────
export default function ScriptsIndexScreen() {
  const router = useRouter();
  const isDark = (useColorScheme() ?? 'light') === 'dark';
  const spinnerColor = isDark ? "#5A7E92" : "#A8C5DA";

  // Lista completa + estado de carga
  const [scripts, setScripts] = useState<ScriptListItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Categoría seleccionada para filtrar (null = "Todos")
  const [selectedCategory, setSelectedCategory] = useState<CategoryId | null>(null);

  /**
   * Fetch de scripts predefinidos desde Supabase.
   * La RLS policy "scripts_predefined_read" permite leer sin autenticar.
   */
  const fetchScripts = useCallback(async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("scripts")
        .select("id, title, description, category, estimated_duration_seconds")
        .eq("is_predefined", true)
        .eq("is_active", true)
        .order("category"); // Agrupar por categoría visualmente

      if (error) throw error;
      setScripts(data ?? []);
    } catch (e) {
      console.warn("[Scripts] Error fetching:", e);
      setScripts([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Cargar scripts al montar
  useEffect(() => {
    fetchScripts();
  }, [fetchScripts]);

  // Scripts filtrados por categoría seleccionada
  const filteredScripts = selectedCategory
    ? scripts.filter((s) => s.category === selectedCategory)
    : scripts;

  /** Toggle de chip de categoría — tap en activo lo deselecciona */
  const handleCategoryPress = (catId: CategoryId) => {
    setSelectedCategory((prev) => (prev === catId ? null : catId));
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8 gap-5">

          {/* ── Encabezado ────────────────────────────────────────────── */}
          <View className="gap-1">
            <Typography variant="headingL">Tus scripts</Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Frases preparadas para situaciones sociales
            </Typography>
          </View>

          {/* ── Chips de categoría ────────────────────────────────────── */}
          <View className="flex-row flex-wrap gap-2">
            {/* "Todos" — sin categoría seleccionada */}
            <Chip
              label="Todos"
              selected={selectedCategory === null}
              onPress={() => setSelectedCategory(null)}
            />
            {CATEGORIES.map((cat) => (
              <Chip
                key={cat.id}
                label={`${cat.emoji} ${cat.label}`}
                selected={selectedCategory === cat.id}
                onPress={() => handleCategoryPress(cat.id)}
              />
            ))}
          </View>

          {/* ── Estado de carga ──────────────────────────────────────── */}
          {isLoading && (
            <View className="flex-1 items-center justify-center py-10 gap-3">
              <ActivityIndicator size="large" color={spinnerColor} />
              <Typography
                variant="caption"
                className="text-script-text-secondary dark:text-script-dark-text-secondary"
              >
                Cargando scripts...
              </Typography>
            </View>
          )}

          {/* ── Lista de scripts ──────────────────────────────────────── */}
          {!isLoading && (
            <View className="gap-3">
              {filteredScripts.length === 0 ? (
                /*
                 * Dos estados vacíos:
                 * - Sin scripts en toda la DB (seed no ejecutado o DB vacía)
                 * - Sin scripts en la categoría seleccionada (filtro activo)
                 */
                <View className="items-center py-10 gap-2">
                  <Typography
                    variant="headingM"
                    className="text-center"
                  >
                    {scripts.length === 0 ? "🌱" : "🔍"}
                  </Typography>
                  <Typography
                    variant="body"
                    className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
                  >
                    {scripts.length === 0
                      ? "Aún no hay scripts disponibles. Vuelve pronto 🌱"
                      : "No hay scripts en esta categoría."}
                  </Typography>
                </View>
              ) : (
                filteredScripts.map((script) => {
                  const catMeta = getCategoryMeta(script.category);
                  return (
                    <Card
                      key={script.id}
                      onPress={() =>
                        router.push({
                          pathname: "/(app)/scripts/[id]",
                          params: { id: script.id },
                        })
                      }
                      accessibilityRole="button"
                      accessibilityLabel={`Script: ${script.title}`}
                    >
                      {/* Fila superior: emoji de categoría + duración estimada */}
                      <View className="flex-row items-center justify-between mb-2">
                        <View className="flex-row items-center gap-1">
                          <Typography variant="caption">{catMeta.emoji}</Typography>
                          <Typography
                            variant="caption"
                            className="text-script-text-secondary dark:text-script-dark-text-secondary"
                          >
                            {catMeta.label}
                          </Typography>
                        </View>
                        {script.estimated_duration_seconds ? (
                          <Typography
                            variant="caption"
                            className="text-script-text-secondary dark:text-script-dark-text-secondary"
                          >
                            ⏱ {formatDuration(script.estimated_duration_seconds)}
                          </Typography>
                        ) : null}
                      </View>

                      {/* Título del script */}
                      <Typography variant="headingS">{script.title}</Typography>

                      {/* Descripción breve */}
                      {script.description ? (
                        <Typography
                          variant="caption"
                          className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
                        >
                          {script.description}
                        </Typography>
                      ) : null}
                    </Card>
                  );
                })
              )}
            </View>
          )}

        </View>
      </ScrollView>
    </SafeScreen>
  );
}
