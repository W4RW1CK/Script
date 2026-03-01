/**
 * RescueFAB — Botón de Acción Flotante de Rescate.
 *
 * Siempre visible sobre el Bottom Tab Navigator en todas las pantallas
 * de la zona autenticada. Navega directamente a S17 (rescue/assess).
 *
 * Diseño intencional (FRONTEND_GUIDELINES §4 + PRD §2.3):
 *  - Color: script-crisis-soft (suave, NO rojo alarmante — reduce ansiedad)
 *  - Posición: bottom-right, encima del tab bar (bottom: 80px)
 *  - Ícono: heart.fill (expo-symbols) — presencia, no emergencia
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
import { SymbolView } from "expo-symbols";
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
      <SymbolView
        name="heart.fill"
        tintColor={iconColor}
        type="hierarchical"
        style={{ width: 26, height: 26 }}
      />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  fab: {
    // Posicionado sobre el tab bar (64px height + safe area estimado ~20px)
    position: "absolute",
    bottom: 84,
    right: 20,
    width: 56,
    height: 56,
    borderRadius: 28,   // Perfectamente circular
    alignItems: "center",
    justifyContent: "center",
    // Sombra visible pero discreta
    elevation: 6,       // Android
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
