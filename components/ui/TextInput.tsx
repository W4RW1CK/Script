/**
 * Input de texto base de Script.
 *
 * Comportamiento:
 *  - Borde cambia de color al enfocar (script-border → script-blue)
 *  - Soporte multiline: altura mínima 120px, texto alineado arriba
 *  - Single-line: altura mínima 44px (tap target WCAG)
 *  - Label opcional encima del input
 *  - numberOfLines: controla cuántas líneas se muestran en modo multiline
 *
 * Nota: placeholderTextColor no es configurable por NativeWind —
 * se pasa como prop nativa directamente (#ABABAB = script-text disabled).
 */
import { TextInput as RNTextInput, View, Text, KeyboardTypeOptions, TextInputProps as RNTextInputProps } from "react-native";
import { useState } from "react";

interface TextInputProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  /** Label visible encima del input */
  label?: string;
  /** Si true, el input es multilínea con altura mínima 120px */
  multiline?: boolean;
  /**
   * Número de líneas visibles en modo multiline.
   * Controla la altura inicial del TextInput.
   * Solo tiene efecto cuando multiline=true.
   */
  numberOfLines?: number;
  /** Label para lectores de pantalla (default: usa label si existe) */
  accessibilityLabel?: string;
  /** Texto adicional que TalkBack/VoiceOver lee después del label */
  accessibilityHint?: string;
  /** Keyboard type (e.g. "email-address", "phone-pad", "number-pad") */
  keyboardType?: KeyboardTypeOptions;
  /** Auto-capitalization behavior */
  autoCapitalize?: RNTextInputProps["autoCapitalize"];
  /** Auto-complete hint for password managers / system keyboards */
  autoComplete?: RNTextInputProps["autoComplete"];
  /** Whether to disable spell-check/autocorrect */
  autoCorrect?: boolean;
}

export function TextInput({
  value,
  onChangeText,
  placeholder,
  label,
  multiline = false,
  numberOfLines,
  accessibilityLabel,
  accessibilityHint,
  keyboardType,
  autoCapitalize,
  autoComplete,
  autoCorrect,
}: TextInputProps) {
  // Controla el estado de foco para cambiar el borde
  const [focused, setFocused] = useState(false);

  return (
    <View className="w-full gap-1">
      {/* Label opcional — visible solo si se pasa */}
      {/* Label opcional — dark:text-script-dark-text-secondary (not dark-blue accent) */}
      {label && (
        <Text className="text-sm text-script-text-secondary dark:text-script-dark-text-secondary mb-1">
          {label}
        </Text>
      )}
      <RNTextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        // placeholderTextColor no es clase NativeWind — se pasa como prop nativa
        placeholderTextColor="#ABABAB"
        multiline={multiline}
        // numberOfLines: solo en multiline — define altura inicial visible
        numberOfLines={multiline ? numberOfLines : undefined}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
        autoComplete={autoComplete}
        autoCorrect={autoCorrect}
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
        accessibilityLabel={accessibilityLabel ?? label}
        accessibilityHint={accessibilityHint}
        // textAlignVertical no es clase NativeWind válida — requiere style prop nativo
        style={multiline ? { textAlignVertical: "top" } : undefined}
        className={`rounded-2xl bg-script-bg dark:bg-script-dark-bg p-4 text-base text-script-text dark:text-white border-[1.5px] ${
          // Borde azul al enfocar, gris neutro en reposo
          focused
            ? "border-script-blue dark:border-script-dark-blue"
            : "border-script-border dark:border-script-dark-border"
        } ${multiline ? "min-h-[120px]" : "min-h-[44px]"}`}
      />
    </View>
  );
}
