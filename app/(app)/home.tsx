/**
 * S09 — Pantalla Home (Inicio)
 *
 * Pantalla principal de la zona autenticada. Punto de entrada
 * para las tres funciones core del MVP.
 *
 * Contenido:
 *  - Saludo personalizado con nombre del usuario
 *  - CTA principal: "¿Cómo estás hoy?" → check-in corporal (S10)
 *  - Acceso rápido a Scripts (S14)
 *  - Último check-in reciente (estado vacío si no hay)
 *
 * Nota: El nombre del usuario viene de Privy/Supabase (Fase 1.8).
 * Por ahora se muestra un saludo genérico.
 */
import { View, Pressable } from "react-native";
import { useRouter } from "expo-router";
import { SafeScreen, Typography, Button, Card } from "@/components/ui";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function HomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  // Color del ícono de acceso rápido según tema
  const iconColor = isDark ? "#5A7E92" : "#A8C5DA";

  // TODO (Fase 1.8): obtener nombre real desde Supabase/Privy
  const userName = ""; // Vacío = saludo genérico

  return (
    <SafeScreen>
      {/* ── Saludo ──────────────────────────────────────── */}
      <View className="pt-6 pb-4">
        <Typography variant="headingL">
          {userName ? `Hola, ${userName} 👋` : "Hola 👋"}
        </Typography>
        <Typography variant="body" className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1">
          ¿Cómo estás en este momento?
        </Typography>
      </View>

      {/* ── CTA Principal — Check-in ─────────────────────── */}
      {/*
        Botón grande y prominente — acción más importante de la app.
        Deshabilitado hasta Fase 1.5 (BodyMap aún no implementado).
        En Fase 1.5: onPress navega a /(app)/checkin/body
      */}
      <Pressable
        onPress={() => router.push("/(app)/checkin")}
        accessibilityRole="button"
        accessibilityLabel="¿Cómo estás hoy? Iniciar check-in corporal"
        className="w-full rounded-3xl bg-script-blue dark:bg-script-dark-blue p-6 items-center gap-2 mb-6"
        style={({ pressed }) => ({ opacity: pressed ? 0.85 : 1 })}
      >
        {/* Ícono grande centrado — Ionicons multiplataforma (B-07) */}
        <Ionicons name="body" size={40} color="white" />
        {/* Texto del CTA — fuente grande, blanca */}
        <Typography variant="headingM" className="text-white text-center">
          ¿Cómo estás hoy?
        </Typography>
        <Typography variant="caption" className="text-white/80 text-center">
          Toca para hacer un check-in corporal
        </Typography>
      </Pressable>

      {/* ── Accesos Rápidos ──────────────────────────────── */}
      <Typography variant="headingM" className="mb-3">
        Acceso rápido
      </Typography>

      <View className="flex-row gap-3 mb-6">
        {/* Acceso rápido — Scripts */}
        <Pressable
          onPress={() => router.push("/(app)/scripts")}
          accessibilityRole="button"
          accessibilityLabel="Ir a Scripts sociales"
          className="flex-1 rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-4 items-center gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Ionicons name="chatbubbles" size={28} color={iconColor} />
          <Typography variant="caption" className="text-center font-semibold">
            Scripts
          </Typography>
        </Pressable>

        {/* Acceso rápido — Historial */}
        <Pressable
          onPress={() => router.push("/(app)/history")}
          accessibilityRole="button"
          accessibilityLabel="Ir al historial de check-ins"
          className="flex-1 rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-4 items-center gap-2"
          style={({ pressed }) => ({ opacity: pressed ? 0.8 : 1 })}
        >
          <Ionicons name="bar-chart" size={28} color={iconColor} />
          <Typography variant="caption" className="text-center font-semibold">
            Historial
          </Typography>
        </Pressable>
      </View>

      {/* ── Último check-in ──────────────────────────────── */}
      {/*
        TODO (Fase 1.5+): mostrar el último check-in real desde Supabase.
        Por ahora muestra el estado vacío.
      */}
      <Typography variant="headingM" className="mb-3">
        Último check-in
      </Typography>

      <Card className="items-center py-8 gap-2">
        <Typography variant="headingXL">🌱</Typography>
        <Typography variant="body" className="text-center font-semibold">
          Todavía no hay check-ins
        </Typography>
        <Typography variant="caption" className="text-center text-script-text-secondary dark:text-script-dark-text-secondary">
          Tu primer check-in aparecerá aquí
        </Typography>
      </Card>
    </SafeScreen>
  );
}
