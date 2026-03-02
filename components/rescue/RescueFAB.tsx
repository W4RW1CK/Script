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
 * Arquitectura de posicionamiento (B-07):
 *  View overlay con absoluteFillObject + pointerEvents="box-none"
 *  + flexbox para posicionar bottom-right. Ver comentarios en styles.
 *
 * Círculo (B-07 v4):
 *  En Android, Pressable no renderiza borderRadius+backgroundColor
 *  correctamente. Solución: View circular contenedor con el fondo,
 *  Pressable dentro solo maneja el toque.
 */
import { Pressable, StyleSheet, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useColorScheme } from "react-native";

export function RescueFAB() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  // Colores del FAB según tema — siempre suaves, nunca rojos
  const bgColor   = isDark ? "#6A3E3E" : "#E8C4C4"; // script-dark-crisis-soft / script-crisis-soft
  const iconColor = isDark ? "#F0D0D0" : "#8B4C4C"; // Tono cálido visible sobre el fondo

  return (
    // Overlay: cubre toda la pantalla, NO intercepta toques (box-none)
    <View style={styles.overlay} pointerEvents="box-none">
      {/* Círculo visual: View con borderRadius + backgroundColor
          En Android, un View renderiza el borderRadius+bg mejor que Pressable */}
      <View style={[styles.circle, { backgroundColor: bgColor }]}>
        <Pressable
          onPress={() => router.push("/(app)/rescue/assess")}
          accessibilityRole="button"
          accessibilityLabel="Necesito calmarme"
          accessibilityHint="Abre el protocolo de calma y grounding"
          style={({ pressed }) => [
            styles.pressable,
            { opacity: pressed ? 0.7 : 1 },
          ]}
        >
          {/* Ionicons: multiplataforma iOS/Android/web (B-07) */}
          <Ionicons name="heart" size={26} color={iconColor} />
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  // Overlay invisible: cubre toda la pantalla
  overlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "flex-end",     // Empuja hacia abajo
    alignItems: "flex-end",         // Empuja hacia la derecha
    paddingBottom: 84,              // Encima del tab bar (64px + 20px margen)
    paddingRight: 20,               // Separación del borde derecho
    zIndex: 999,
    elevation: 999,
  },
  // Círculo visual del FAB — View para que Android renderice bg+borderRadius
  circle: {
    width: 56,
    height: 56,
    borderRadius: 28,
    elevation: 10,                  // Sombra Android
    // Sombra iOS
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
  // Área tocable: ocupa todo el círculo
  pressable: {
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
  },
});
