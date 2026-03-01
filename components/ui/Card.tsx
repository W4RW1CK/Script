import { View } from "react-native";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  className?: string;
}

/**
 * Tarjeta base de Script.
 * Fondo secundario, bordes redondeados 24px, padding 20px.
 */
export function Card({ children, className = "" }: CardProps) {
  return (
    <View
      className={`rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-5 shadow-sm ${className}`}
    >
      {children}
    </View>
  );
}
