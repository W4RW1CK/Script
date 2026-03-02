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
 *  El Pressable con position:'absolute' no se posiciona correctamente
 *  en Android dentro de un flex container (se va a 0,0 ignorando bottom/right).
 *  Solución: View overlay con StyleSheet.absoluteFillObject + pointerEvents="box-none"
 *  que cubre toda la pantalla sin bloquear toques, y dentro el Pressable
 *  se posiciona con flexbox (justifyContent/alignItems) en vez de offsets.
 *
 * Accesibilidad:
 *  - accessibilityRole="button"
 *  - accessibilityLabel describe la acción sin generar alarma
 *  - accessibilityHint explica qué sucede al activarlo
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
    // View overlay: cubre toda la pantalla pero NO intercepta toques
    // (pointerEvents="box-none" = el View ignora toques, solo sus hijos los reciben)
    <View style={styles.overlay} pointerEvents="box-none">
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
        {/* Ionicons: multiplataforma iOS/Android/web (B-07) */}
        <Ionicons name="heart" size={26} color={iconColor} />
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  // Overlay invisible que cubre toda la pantalla
  overlay: {
    ...StyleSheet.absoluteFillObject,   // position:absolute + top/left/right/bottom = 0
    justifyContent: "flex-end",         // Empuja contenido hacia abajo
    alignItems: "flex-end",             // Empuja contenido hacia la derecha
    // Padding para posicionar el FAB exactamente donde queremos:
    // bottom: tab bar (64px) + margen (20px) = 84px
    // right: 20px del borde
    paddingBottom: 84,
    paddingRight: 20,
    // zIndex/elevation para estar encima de todo
    zIndex: 999,
    elevation: 999,
  },
  fab: {
    // Tamaño y forma circular
    width: 56,
    height: 56,
    borderRadius: 28,
    alignItems: "center",
    justifyContent: "center",
    // Sombra Android
    elevation: 10,
    // Sombra iOS (discreta)
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
  },
});
