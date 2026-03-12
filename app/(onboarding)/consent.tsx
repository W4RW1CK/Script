/**
 * (onboarding)/consent.tsx — S01.5: Consentimiento Informado
 *
 * Pantalla que aparece ANTES del AQ-10 (primera prueba del onboarding).
 * Cumple con LFPDPPP (Ley Federal de Protección de Datos Personales
 * en Posesión de los Particulares), artículo 8° — consentimiento expreso.
 *
 * T-C3: Esta pantalla es obligatoria antes de recopilar cualquier dato
 * del usuario. El consentimiento debe ser explícito (botón "Entiendo
 * y acepto") — no tácito ni por omisión.
 *
 * Flujo: index (S01) → consent (S01.5) → aq10 (S02)
 *
 * Diseño: tono cálido, lenguaje simple (no jerga legal), estructura
 * visual clara con íconos semánticos. Sin presión de tiempo.
 *
 * Ref: FRONTEND_GUIDELINES §3 (formularios + consentimiento)
 */
import React from "react";
import { View, ScrollView, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Button } from "@/components/ui";

// ── Bloque de información de consentimiento ────────────────────────────────
// Cada ítem tiene un ícono, título y descripción corta.
// Diseñado para ser leído en <2 minutos (FRONTEND_GUIDELINES §3).
const CONSENT_ITEMS = [
  {
    icon:  "heart-outline" as const,
    title: "Script es una herramienta de apoyo",
    desc:  "No es un dispositivo médico ni un servicio de salud mental. No diagnostica ni trata ninguna condición.",
  },
  {
    icon:  "person-outline" as const,
    title: "No reemplaza a un profesional",
    desc:  "Si estás en crisis o necesitas apoyo clínico, habla con un psicólogo o psiquiatra especializado en TEA.",
  },
  {
    icon:  "lock-closed-outline" as const,
    title: "Tus datos son privados",
    desc:  "Solo tú accedes a tus respuestas y registros. No se comparten con terceros ni se usan con fines comerciales.",
  },
  {
    icon:  "document-text-outline" as const,
    title: "Qué recopila Script",
    desc:  "Respuestas a cuestionarios de autoconocimiento, registros de check-in emocional y scripts personalizados.",
  },
  {
    icon:  "trash-outline" as const,
    title: "Puedes salir cuando quieras",
    desc:  "Tienes derecho a eliminar tu cuenta y todos tus datos en cualquier momento desde Configuración.",
  },
] as const;

// ── Componente ─────────────────────────────────────────────────────────────
export default function ConsentScreen() {
  const router = useRouter();

  /** Aceptar consentimiento → iniciar onboarding (AQ-10) */
  const handleAccept = () => {
    // Navegar al AQ-10 (S02) — primera pantalla de evaluación
    router.push("/(onboarding)/aq10");
  };

  /** Rechazar → volver a la pantalla de bienvenida */
  const handleDecline = () => {
    router.back();
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-6 pt-8 pb-10 gap-8">

          {/* ── Encabezado ────────────────────────────────────────────── */}
          <View className="gap-2">
            <Typography variant="headingL">
              Antes de comenzar
            </Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Necesitas saber esto para usar Script con tranquilidad.
            </Typography>
          </View>

          {/* ── Lista de ítems de consentimiento ─────────────────────── */}
          <View className="gap-5">
            {CONSENT_ITEMS.map((item) => (
              <ConsentItem
                key={item.title}
                icon={item.icon}
                title={item.title}
                desc={item.desc}
              />
            ))}
          </View>

          {/* ── Nota legal LFPDPPP ───────────────────────────────────── */}
          <View className="bg-script-bg-secondary dark:bg-script-dark-secondary rounded-2xl p-4">
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary text-center"
            >
              Fundamento legal: LFPDPPP (Ley Federal de Protección de Datos
              Personales en Posesión de los Particulares), artículo 8° —
              consentimiento expreso. Datos almacenados en servidores seguros
              bajo Supabase. Puedes consultar nuestra política de privacidad
              en Configuración.
            </Typography>
          </View>

          {/* ── Acciones ─────────────────────────────────────────────── */}
          <View className="gap-3 mt-auto">
            {/* CTA principal — consentimiento expreso */}
            <Button
              title="Entiendo y acepto"
              onPress={handleAccept}
              variant="primary"
              accessibilityLabel="Entiendo y acepto los términos. Comenzar mi evaluación."
            />

            {/* Opción de salir sin aceptar */}
            <Button
              title="No acepto"
              onPress={handleDecline}
              variant="secondary"
              accessibilityLabel="No acepto. Volver a la pantalla de inicio."
            />
          </View>

        </View>
      </ScrollView>
    </SafeScreen>
  );
}

// ── Subcomponente: ítem individual de consentimiento ──────────────────────
/**
 * ConsentItem — muestra un ícono + título + descripción.
 * Diseño compact: reduce carga cognitiva al separar cada concepto
 * en su propio bloque visual (FRONTEND_GUIDELINES §3).
 *
 * Color del ícono: script-blue (#A8C5DA) en light / script-dark-blue (#5A7E92) en dark.
 * Ionicons no soporta className de NativeWind — color se pasa como prop directa.
 */
function ConsentItem({
  icon,
  title,
  desc,
}: {
  icon: React.ComponentProps<typeof Ionicons>["name"];
  title: string;
  desc: string;
}) {
  // Ionicons requiere color como prop (no soporta className de NativeWind)
  const isDark     = (useColorScheme() ?? 'light') === 'dark';
  const iconColor  = isDark ? "#5A7E92" : "#A8C5DA"; // script-dark-blue / script-blue

  return (
    <View className="flex-row gap-4 items-start">
      {/* Ícono semántico — 22px (§8: action icon 20px; usamos 22 para más peso visual) */}
      <View className="mt-0.5">
        <Ionicons name={icon} size={22} color={iconColor} />
      </View>

      {/* Texto */}
      <View className="flex-1 gap-1">
        {/* headingS (18px semibold) — título del ítem de consentimiento */}
        <Typography variant="headingS">
          {title}
        </Typography>
        <Typography
          variant="body"
          className="text-script-text-secondary dark:text-script-dark-text-secondary"
        >
          {desc}
        </Typography>
      </View>
    </View>
  );
}
