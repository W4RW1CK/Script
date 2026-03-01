/**
 * S14 — Biblioteca de Scripts Sociales
 *
 * Lista todos los scripts predefinidos del usuario (obtenidos de Supabase).
 * En Fase 1.6 se implementará la lista real + filtros por categoría.
 *
 * Flujo completo (Fase 1.6):
 *   scripts/index (S14) → scripts/[id] (S15 Preparación) → scripts/[id]/execute (S16 Ejecución)
 */
import { SafeScreen, Typography, Card } from "@/components/ui";
import { View } from "react-native";

/** Categorías de scripts — referencia visual hasta que se conecte Supabase en Fase 1.6 */
const PREVIEW_CATEGORIES = [
  { emoji: "💬", label: "Conversación" },
  { emoji: "🏪", label: "Lugar público" },
  { emoji: "🚨", label: "Crisis" },
  { emoji: "🏢", label: "Trabajo / Estudio" },
];

export default function ScriptsIndexScreen() {
  return (
    <SafeScreen>
      {/* Header de la sección */}
      <View className="pt-6 pb-4">
        <Typography variant="headingL">Tus scripts</Typography>
        <Typography variant="body" className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1">
          Frases preparadas para situaciones sociales
        </Typography>
      </View>

      {/* Preview de categorías — placeholder hasta Fase 1.6 */}
      <View className="gap-3">
        {PREVIEW_CATEGORIES.map((cat) => (
          <Card key={cat.label} className="flex-row items-center gap-3">
            <Typography variant="headingL">{cat.emoji}</Typography>
            <Typography variant="body">{cat.label}</Typography>
          </Card>
        ))}

        {/* Indicador de estado */}
        <Typography variant="caption" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary mt-4">
          Scripts completos disponibles en Fase 1.6
        </Typography>
      </View>
    </SafeScreen>
  );
}
