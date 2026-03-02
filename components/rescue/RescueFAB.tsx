/**
 * RescueFAB — Botón de Acción Flotante de Rescate.
 *
 * Siempre visible sobre el Bottom Tab Navigator en todas las pantallas
 * de la zona autenticada. Navega directamente a S17 (rescue/assess).
 *
 * Diseño intencional (FRONTEND_GUIDELINES §4 + PRD §2.3):
 *  - Color: script-crisis-soft (suave, NO rojo alarmante — reduce ansiedad)
 *  - Posición: bottom-right, encima del tab bar (bottom: 84px)
 *  - Ícono: heart (Ionicons) — presencia, no emergencia
 *  - Tamaño: 56px × 56px (tap target holgado)
 *  - Sombra visible pero no exagerada
 *
 * Principio: el FAB debe sentirse como un recurso accesible,
 * no como una alarma. El usuario lo activa cuando lo necesita.
 *
 * Accesibilidad:
 *  - accessibilityRole="button"
 *  - accessibilityLabel describe la acción sin generar alarma
 *  - accessibilityHint explica qué sucede al activarlo
 */
import { Pressable, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export function RescueFAB() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  // Colores del FAB según tema — siempre suaves, nunca rojos
  const bgColor    = isDark ? "#6A3E3E" : "#E8C4C4"; // script-dark-crisis-soft / script-crisis-soft
  const iconColor  = isDark ? "#F0D0D0" : "#8B4C4C"; // Tono cálido visible sobre el fondo

  return (
    <Pressable
      onPress={() => router.push("/(app)/rescue/assess")}
      accessibilityRole="button"
      accessibilityLabel="Necesito calmarme"
      accessibilityHint="Abre el protocolo de calma y grounding"
      style={({ pressed }) => [
        styles.fab,
        { backgroundColor: bgColor, opacity: pressed ? 0.85 : 1 },
      ]}
    >
      {/* Ionicons: multiplataforma iOS/Android/web — expo-symbols solo iOS/web (B-07) */}
      <Ionicons name="heart" size={26} color={iconColor} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    // Posición: esquina inferior derecha, encima del tab bar
    // bottom=84: tab bar (64px) + margen (20px)
    // right=20: separación del borde derecho
    position: "absolute",
    bottom: 84,
    right: 20,
    // Tamaño y forma circular
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    // Android z-ordering: elevation controla el orden visual en Android.
    // zIndex es para iOS/web. Ambos son necesarios para multiplataforma.
    zIndex: 999,
    elevation: 10,
    // Sombra iOS (discreta)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
