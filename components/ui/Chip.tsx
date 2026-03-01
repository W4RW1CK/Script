import { Pressable, Text } from "react-native";

interface ChipProps {
  label: string;
  selected?: boolean;
  onPress?: () => void;
  accessibilityLabel?: string;
}

/**
 * Chip/tag de Script.
 * Usado para zonas corporales seleccionadas, categorías de scripts, etc.
 */
export function Chip({
  label,
  selected = false,
  onPress,
  accessibilityLabel,
}: ChipProps) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityLabel={accessibilityLabel ?? label}
      accessibilityState={{ selected }}
      className={`rounded-full py-1 px-3 ${
        selected
          ? "bg-script-blue/20 dark:bg-script-dark-blue/20"
          : "bg-script-bg-secondary dark:bg-script-dark-secondary"
      }`}
      style={({ pressed }) => ({ opacity: pressed ? 0.7 : 1 })}
    >
      <Text
        className={`text-sm font-semibold ${
          selected
            ? "text-script-blue dark:text-script-dark-blue"
            : "text-script-text-secondary"
        }`}
      >
        {label}
      </Text>
    </Pressable>
  );
}
