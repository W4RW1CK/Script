/**
 * Pantalla Home — placeholder de Fase 1.1
 * Esta pantalla será reemplazada en Fase 1.4 con el Home real (S09).
 * Por ahora solo confirma que el setup de Expo + NativeWind funciona.
 */
import { View, Text } from "react-native";

export default function HomeScreen() {
  return (
    // bg-script-bg: color base del tema light (#F8F6F2)
    // dark:bg-script-dark-bg: color base del tema dark (#1C1C22)
    <View className="flex-1 items-center justify-center bg-script-bg dark:bg-script-dark-bg">
      <Text className="text-2xl font-bold text-script-text dark:text-white">
        Script 🍌
      </Text>
      <Text className="text-base text-script-text-secondary dark:text-script-dark-text-secondary mt-2">
        Setup completo — Fase 1.1 ✅
      </Text>
    </View>
  );
}
