/**
 * S19 — Historial de Check-ins
 *
 * Lista los check-ins pasados con visualización de patrones emocionales.
 * Implementación completa en Semana 2 (Fase 2.x).
 *
 * Funcionalidades planificadas:
 *  - Lista de check-ins ordenada por fecha
 *  - Filtros por emoción, zona corporal, período
 *  - "Insights desbloqueados" a los 3, 7 y 15 check-ins
 *  - Acceso al Diccionario Emocional (S20)
 */
import { SafeScreen, Typography, Card } from "@/components/ui";
import { View } from "react-native";

export default function HistoryScreen() {
  return (
    <SafeScreen>
      {/* Header de la sección */}
      <View className="pt-6 pb-4">
        <Typography variant="headingL">Historial</Typography>
        <Typography variant="body" className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1">
          Tus check-ins recientes
        </Typography>
      </View>

      {/* Placeholder de estado vacío */}
      <Card className="items-center py-10 gap-3">
        <Typography variant="headingXL">📊</Typography>
        <Typography variant="headingM" className="text-center">
          Sin check-ins todavía
        </Typography>
        <Typography variant="body" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary">
          Cuando hagas tu primer check-in, aparecerá aquí.
        </Typography>
      </Card>

      {/* Nota de desarrollo */}
      <Typography variant="caption" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary mt-4">
        Historial completo disponible en Semana 2
      </Typography>
    </SafeScreen>
  );
}
