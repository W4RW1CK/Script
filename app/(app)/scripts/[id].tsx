/**
 * scripts/[id].tsx — S15: Detalle del Script
 *
 * Pantalla de preparación antes de ejecutar un script.
 * Muestra: categoría, título, descripción, tiempo estimado y
 * una vista previa de los bloques (tipo + opciones disponibles).
 *
 * Flujo: S14 (índice) → S15 → execute (S16 Ejecución)
 *
 * Recibe: `id` como parámetro de ruta dinámica (Expo Router [id])
 * Fetch: SELECT id, title, description, category, estimated_duration_seconds, blocks
 *
 * UX:
 *   - Botón "← Biblioteca" para volver (sin header del Stack)
 *   - Vista previa no-interactiva de bloques (tipo + n° de opciones)
 *   - "Ejecutar script →" navega a execute con id como query param
 *   - Error graceful si el script no se encontró
 */
import React, { useState, useEffect } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Card, Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";

// ── Tipos ──────────────────────────────────────────────────────────────────
/** Tipos de bloque del JSONB `blocks` */
type BlockType = "apertura" | "contexto" | "accion" | "salida";

/** Estructura de un bloque en el array `blocks` */
type ScriptBlock = {
  type: BlockType;
  text?: string;      // Solo en bloques tipo "contexto"
  options?: string[]; // Opciones seleccionables (apertura, accion, salida)
  optional?: boolean; // True en bloques de salida opcionales
};

/** Shape completo del script para S15 */
type ScriptDetail = {
  id: string;
  title: string;
  description: string | null;
  category: string;
  estimated_duration_seconds: number | null;
  blocks: ScriptBlock[];
};

// ── Metadata de visualización ──────────────────────────────────────────────
/** Label human-readable para cada tipo de bloque */
const BLOCK_LABELS: Record<BlockType, string> = {
  apertura: "Apertura",
  contexto: "Contexto",
  accion:   "Acción",
  salida:   "Cierre",
};

/** Emoji + label de categoría */
const CATEGORY_META: Record<string, { label: string; emoji: string }> = {
  conversacion:    { label: "Conversación",      emoji: "💬" },
  lugar_publico:   { label: "Lugar público",     emoji: "🏪" },
  trabajo_estudio: { label: "Trabajo / Estudio", emoji: "🏢" },
  crisis:          { label: "Crisis",            emoji: "🚨" },
  personalizado:   { label: "Personalizado",     emoji: "✏️" },
};

/** Formatea segundos a "~N min" */
function formatDuration(seconds: number | null): string {
  if (!seconds) return "";
  return `~${Math.ceil(seconds / 60)} min`;
}

// ── Componente ─────────────────────────────────────────────────────────────
export default function ScriptDetailScreen() {
  const router = useRouter();

  // `id` viene del segmento de ruta dinámica [id]
  const { id } = useLocalSearchParams<{ id: string }>();

  const isDark = useColorScheme() === "dark";
  const spinnerColor = isDark ? "#5A7E92" : "#A8C5DA";

  const [script, setScript] = useState<ScriptDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch del script por id al montar
  useEffect(() => {
    if (!id) {
      setError("ID de script no válido.");
      setIsLoading(false);
      return;
    }

    const fetchScript = async () => {
      setIsLoading(true);
      try {
        const { data, error: fetchError } = await supabase
          .from("scripts")
          .select(
            "id, title, description, category, estimated_duration_seconds, blocks"
          )
          .eq("id", id)
          .single(); // Espera exactamente 1 resultado

        if (fetchError) throw fetchError;
        setScript(data as ScriptDetail);
      } catch (e) {
        console.warn("[ScriptDetail] Error:", e);
        setError("No se pudo cargar el script.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchScript();
  }, [id]);

  // ── Estado de carga ────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={spinnerColor} />
        </View>
      </SafeScreen>
    );
  }

  // ── Estado de error ────────────────────────────────────────────────────
  if (error || !script) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-5 gap-4">
          <Typography
            variant="body"
            className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            {error ?? "Script no encontrado."}
          </Typography>
          <Button
            title="← Volver"
            onPress={() => router.back()}
            variant="ghost"
          />
        </View>
      </SafeScreen>
    );
  }

  // ── Pantalla principal ─────────────────────────────────────────────────
  const catMeta =
    CATEGORY_META[script.category] ?? { label: script.category, emoji: "📄" };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-4 pb-8 gap-5">

          {/* ── Botón volver ──────────────────────────────────────────── */}
          <Button
            title="← Biblioteca"
            onPress={() => router.back()}
            variant="ghost"
          />

          {/* ── Fila: categoría + duración ────────────────────────────── */}
          <View className="flex-row items-center justify-between">
            <View className="flex-row items-center gap-1">
              <Typography variant="body">{catMeta.emoji}</Typography>
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

          {/* ── Título + descripción ──────────────────────────────────── */}
          <View className="gap-2">
            <Typography variant="headingL">{script.title}</Typography>
            {script.description ? (
              <Typography
                variant="body"
                className="text-script-text-secondary dark:text-script-dark-text-secondary"
              >
                {script.description}
              </Typography>
            ) : null}
          </View>

          {/* ── Vista previa de bloques ───────────────────────────────── */}
          <View className="gap-2">
            <Typography variant="headingS">¿Qué incluye?</Typography>
            <View className="gap-2">
              {script.blocks.map((block, idx) => (
                <Card key={idx} variant="default">
                  <View className="flex-row items-center justify-between">
                    {/* Tipo de bloque como etiqueta */}
                    <Typography
                      variant="caption"
                      className="text-script-blue dark:text-script-dark-blue"
                    >
                      {BLOCK_LABELS[block.type]}
                      {block.optional ? " (opcional)" : ""}
                    </Typography>
                    {/* N° de opciones o indicador de texto */}
                    {block.options ? (
                      <Typography
                        variant="caption"
                        className="text-script-text-secondary dark:text-script-dark-text-secondary"
                      >
                        {block.options.length} opción
                        {block.options.length !== 1 ? "es" : ""}
                      </Typography>
                    ) : null}
                  </View>
                  {/* Texto del bloque contexto */}
                  {block.text ? (
                    <Typography
                      variant="caption"
                      className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
                    >
                      {block.text}
                    </Typography>
                  ) : null}
                </Card>
              ))}
            </View>
          </View>

          <View className="flex-1" />

          {/* ── CTA: Ejecutar script ──────────────────────────────────── */}
          <Button
            title="Ejecutar script →"
            onPress={() =>
              router.push({
                pathname: "/(app)/scripts/execute",
                params: { id: script.id },
              })
            }
            variant="primary"
            accessibilityHint="Inicia la ejecución paso a paso del script social"
          />

        </View>
      </ScrollView>
    </SafeScreen>
  );
}
