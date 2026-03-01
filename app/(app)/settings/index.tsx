/**
 * S21 — Configuración
 *
 * Ajustes de la app: perfil sensorial, contactos de confianza, preferencias.
 * Implementación completa en Semana 2 (Fase 2.1).
 *
 * Funcionalidades planificadas:
 *  - Editar perfil sensorial (sensory_defaults)
 *  - Gestión de contactos de confianza (S22)
 *  - Acceso a tests opcionales: AQ Full, CAT-Q, RAADS-R (S04–S06)
 *  - Preferencias: modo oscuro, tamaño de fuente, haptics on/off
 *  - Vista de terapeuta (S23) — si hay terapeuta vinculado
 */
import { SafeScreen, Typography, Card } from "@/components/ui";
import { View } from "react-native";

/** Secciones de configuración — referencia visual hasta Fase 2.1 */
const SETTINGS_SECTIONS = [
  { emoji: "👤", label: "Mi perfil sensorial" },
  { emoji: "🤝", label: "Contactos de confianza" },
  { emoji: "🧪", label: "Tests de autoconocimiento" },
  { emoji: "🎨", label: "Apariencia y accesibilidad" },
];

export default function SettingsScreen() {
  return (
    <SafeScreen>
      {/* Header de la sección */}
      <View className="pt-6 pb-4">
        <Typography variant="headingL">Ajustes</Typography>
        <Typography variant="body" className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1">
          Personaliza tu experiencia
        </Typography>
      </View>

      {/* Preview de secciones */}
      <View className="gap-3">
        {SETTINGS_SECTIONS.map((section) => (
          <Card key={section.label} className="flex-row items-center gap-3 opacity-50">
            <Typography variant="headingL">{section.emoji}</Typography>
            <Typography variant="body">{section.label}</Typography>
          </Card>
        ))}

        {/* Nota de desarrollo */}
        <Typography variant="caption" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary mt-4">
          Configuración completa disponible en Semana 2
        </Typography>
      </View>
    </SafeScreen>
  );
}
