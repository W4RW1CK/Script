import { useColorScheme } from "react-native";
import { Colors } from "@/constants/colors";

/**
 * Hook para acceder a los colores del tema activo.
 * Retorna los tokens de color según el modo del sistema (light/dark).
 *
 * En componentes, preferir clases NativeWind (bg-script-bg dark:bg-script-dark-bg).
 * Este hook es para cuando necesitas hex directo (SVG fills, Reanimated, etc).
 */
export function useTheme() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  return {
    colors: isDark ? Colors.dark : Colors.light,
    isDark,
    colorScheme: colorScheme ?? "light",
  };
}
