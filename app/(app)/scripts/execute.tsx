/**
 * scripts/execute.tsx — S16: Ejecución del Script
 *
 * Pantalla de ejecución paso a paso de un script social.
 * Muestra los bloques del script de uno en uno con barra de progreso.
 *
 * Flujo: S15 (detalle) → S16 → S14 (biblioteca) [replace al completar]
 *
 * Recibe: `id` como query param desde S15.
 *
 * Tipos de bloque (schema.sql → scripts.blocks JSONB):
 *   "apertura" — opciones para iniciar la conversación
 *   "contexto" — texto informativo, solo leer + "Entendido →"
 *   "accion"   — opciones de qué decir (bloque principal)
 *   "salida"   — opciones para cerrar (puede ser optional:true)
 *
 * UX del flujo:
 *   - Bloques con options: Cards seleccionables (una a la vez)
 *   - Bloque contexto:     Card de solo lectura + "Entendido →"
 *   - Bloque optional:     botón "Saltar este paso" siempre visible
 *   - "Siguiente →":       deshabilitado hasta seleccionar (excepto contexto)
 *   - Barra de progreso:   `(paso actual + 1) / total` → ancho dinámico
 *   - Al terminar:         pantalla de celebración + volver a scripts
 */
import React, { useState, useEffect, useCallback } from "react";
import {
  View,
  ScrollView,
  ActivityIndicator,
  useColorScheme,
} from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeScreen, Typography, Card, Button } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

// ── Tipos ──────────────────────────────────────────────────────────────────
type BlockType = "apertura" | "contexto" | "accion" | "salida";

type ScriptBlock = {
  type: BlockType;
  text?: string;      // Solo en bloques "contexto"
  options?: string[]; // Opciones para seleccionar
  optional?: boolean; // Si true, el bloque puede saltarse
};

type ScriptForExecution = {
  id: string;
  title: string;
  blocks: ScriptBlock[];
};

// ── Labels de tipo de bloque ───────────────────────────────────────────────
/** Título visible del bloque — qué es lo que ocurre en este paso */
const BLOCK_TITLE: Record<BlockType, string> = {
  apertura: "Para empezar",
  contexto: "Ten esto en mente",
  accion:   "Di esto",
  salida:   "Para cerrar",
};

/** Subtítulo/hint debajo del título del bloque */
const BLOCK_HINT: Record<BlockType, string> = {
  apertura: "Elige cómo iniciar la conversación",
  contexto: "Información útil para este momento",
  accion:   "Elige qué decir",
  salida:   "Elige cómo cerrar la conversación",
};

// ── Componente ─────────────────────────────────────────────────────────────
export default function ScriptExecuteScreen() {
  const router         = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);

  // `id` pasado como query param desde S15
  const { id } = useLocalSearchParams<{ id: string }>();

  const isDark = useColorScheme() === "dark";
  const spinnerColor = isDark ? "#5A7E92" : "#A8C5DA";
  // Color del progress bar inline (no puede ser NativeWind dinámico)
  const progressColor = isDark ? "#5A7E92" : "#A8C5DA";

  // Estado del script y navegación por bloques
  const [script, setScript] = useState<ScriptForExecution | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [currentBlockIndex, setCurrentBlockIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState<string | null>(null);
  const [isComplete, setIsComplete] = useState(false);

  // Fetch del script al montar
  useEffect(() => {
    if (!id) return;

    const fetchScript = async () => {
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from("scripts")
          .select("id, title, blocks")
          .eq("id", id)
          .single();

        if (error) throw error;
        setScript(data as ScriptForExecution);
      } catch (e) {
        console.warn("[ScriptExecute] Error:", e);
      } finally {
        setIsLoading(false);
      }
    };

    fetchScript();
  }, [id]);

  /**
   * handleNext — avanza al siguiente bloque o completa el script.
   * Limpia la opción seleccionada al cambiar de bloque.
   */
  const handleNext = useCallback(() => {
    if (!script) return;
    setSelectedOption(null);

    if (currentBlockIndex < script.blocks.length - 1) {
      setCurrentBlockIndex((prev) => prev + 1);
    } else {
      // 2.10: INSERT script_executions on completion — fire and forget, non-blocking
      if (supabaseUserId && script?.id) {
        supabase
          .from("script_executions")
          .insert({
            user_id:    supabaseUserId,
            script_id:  script.id,
            mode:       "execution",
            completed:  true,
            // executed_at: DEFAULT NOW() in schema
          })
          .then(({ error }) => {
            if (error) console.warn("[ScriptExecute] script_executions INSERT error:", error.message);
          });
      }
      // Último bloque completado → pantalla de celebración
      setIsComplete(true);
    }
  }, [script, currentBlockIndex, supabaseUserId]);

  // ── Estado de carga ──────────────────────────────────────────────────────
  if (isLoading) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={spinnerColor} />
        </View>
      </SafeScreen>
    );
  }

  // ── Error de carga ───────────────────────────────────────────────────────
  if (!script) {
    return (
      <SafeScreen>
        <View className="flex-1 items-center justify-center px-5 gap-4">
          <Typography
            variant="body"
            className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            No se pudo cargar el script.
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

  // ── Pantalla de celebración (script completado) ──────────────────────────
  if (isComplete) {
    return (
      <SafeScreen>
        <View className="flex-1 px-5 pt-6 pb-8 items-center justify-center gap-6">
          {/* Emoji de celebración */}
          <Typography variant="headingL" className="text-center">
            🎉
          </Typography>

          <Typography variant="headingL" className="text-center">
            ¡Lo hiciste!
          </Typography>

          <Typography
            variant="body"
            className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
          >
            Completaste "{script.title}".{"\n"}
            Cada vez que lo practicas se vuelve más natural.
          </Typography>

          {/* Volver a la biblioteca — replace para no volver al script */}
          <Button
            title="Volver a scripts"
            onPress={() => router.replace("/(app)/scripts")}
            variant="primary"
          />
        </View>
      </SafeScreen>
    );
  }

  // ── Datos del bloque actual ──────────────────────────────────────────────
  const block = script.blocks[currentBlockIndex];
  const isContextBlock = block.type === "contexto";
  const isOptional = block.optional === true;

  // Progreso: fracción de bloques completados (incluyendo el actual)
  const progress = (currentBlockIndex + 1) / script.blocks.length;

  // El botón "Siguiente" está activo si: es contexto (siempre) o se eligió una opción
  const canProceed = isContextBlock || selectedOption !== null;

  // ── Pantalla principal de ejecución ─────────────────────────────────────
  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-4 pb-8 gap-5">

          {/* ── Header: título del script + salir ────────────────────── */}
          <View className="gap-2">
            {/* Botón salir */}
            <Button
              title="✕ Salir del script"
              onPress={() => router.back()}
              variant="ghost"
            />

            {/* Título centrado */}
            <Typography variant="headingS" className="text-center">
              {script.title}
            </Typography>

            {/* Barra de progreso — width dinámico via style (no NativeWind) */}
            <View className="w-full h-2 rounded-full bg-script-bg-secondary dark:bg-script-dark-secondary overflow-hidden">
              <View
                className="h-2 rounded-full"
                style={{
                  width: `${progress * 100}%`,
                  backgroundColor: progressColor,
                }}
              />
            </View>

            {/* Contador de pasos */}
            <Typography
              variant="caption"
              className="text-center text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Paso {currentBlockIndex + 1} de {script.blocks.length}
            </Typography>
          </View>

          {/* ── Tipo + hint del bloque actual ────────────────────────── */}
          <View className="gap-1">
            <Typography
              variant="headingM"
              className="text-script-blue dark:text-script-dark-blue"
            >
              {BLOCK_TITLE[block.type]}
            </Typography>
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              {BLOCK_HINT[block.type]}
              {isOptional ? " — este paso es opcional" : ""}
            </Typography>
          </View>

          {/* ── Contenido del bloque ─────────────────────────────────── */}
          {isContextBlock && block.text ? (
            /* Bloque "contexto": solo texto informativo, sin opciones */
            <Card variant="elevated">
              <Typography variant="body">{block.text}</Typography>
            </Card>
          ) : block.options && block.options.length > 0 ? (
            /* Bloques con opciones: cards seleccionables */
            <View className="gap-3">
              {block.options.map((option) => (
                <Card
                  key={option}
                  variant={selectedOption === option ? "elevated" : "default"}
                  onPress={() => setSelectedOption(option)}
                  accessibilityRole="button"
                  accessibilityState={{ selected: selectedOption === option }}
                  accessibilityLabel={option}
                >
                  {/* Las opciones son frases que el usuario diría — van entre comillas */}
                  <Typography variant="body">"{option}"</Typography>
                </Card>
              ))}
            </View>
          ) : null}

          <View className="flex-1" />

          {/* ── CTAs ─────────────────────────────────────────────────── */}
          <View className="gap-3">
            {/* Siguiente — deshabilitado hasta elegir (excepto contexto) */}
            <Button
              title={
                currentBlockIndex < script.blocks.length - 1
                  ? "Siguiente →"
                  : "Finalizar ✓"
              }
              onPress={handleNext}
              variant="primary"
              disabled={!canProceed}
              accessibilityHint={
                !canProceed
                  ? "Selecciona una opción primero"
                  : currentBlockIndex < script.blocks.length - 1
                  ? "Continuar al siguiente paso"
                  : "Completar el script"
              }
            />

            {/* Saltar — solo para bloques marcados como optional */}
            {isOptional && (
              <Button
                title="Saltar este paso"
                onPress={handleNext}
                variant="ghost"
                accessibilityHint="Omitir este paso opcional y continuar"
              />
            )}
          </View>

        </View>
      </ScrollView>
    </SafeScreen>
  );
}
