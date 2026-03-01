import { TextInput as RNTextInput, View, Text } from "react-native";
import { useState } from "react";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  label?: string;
  multiline?: boolean;
  accessibilityLabel?: string;
}

/**
 * Input de texto de Script.
 * Borde que cambia de color al enfocar. Min height 44px.
 */
export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  accessibilityLabel,
}: TextInputProps) {
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full gap-1">
      {label && (
        <Text className="text-sm text-script-text-secondary dark:text-script-dark-blue mb-1">
          {label}
        </Text>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#ABABAB"
        multiline={multiline}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={accessibilityLabel ?? label}
        className={`rounded-2xl bg-script-bg dark:bg-script-dark-bg p-4 text-base text-script-text dark:text-white border-[1.5px] ${
          focused
            ? "border-script-blue dark:border-script-dark-blue"
            : "border-script-border dark:border-[#3A3A44]"
        } ${multiline ? "min-h-[120px] text-top" : "min-h-[44px]"}`}
      />
    </View>
  );
}
