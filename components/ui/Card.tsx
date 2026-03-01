/**
 * Card — tarjeta base de Script.
 *
 * Uso: contenedor de contenido agrupado (check-in, script, etc.)
 * Fondo secundario (no blanco puro) para reducir contraste agresivo.
 * Bordes redondeados 24px (rounded-3xl) para apariencia suave.
 * Sombra sutil en light mode para separar del fondo principal.
 *
 * @example
 *   <Card>
 *     <Typography variant="headingM">Título</Typography>
 *   </Card>
 */
import { View } from "react-native";
import type { ReactNode } from "react";

interface CardProps {
  children: ReactNode;
  /** Clases NativeWind adicionales (márgenes, padding extra, etc.) */
  className?: string;
}

export function Card({ children, className = "" }: CardProps) {
  return (
    <View
      // bg-script-bg-secondary: más cálido que blanco puro, menos fatiga visual
      // dark:bg-script-dark-secondary: equivalente oscuro
      // shadow-sm: elevación sutil solo en light mode
      className={`rounded-3xl bg-script-bg-secondary dark:bg-script-dark-secondary p-5 shadow-sm ${className}`}
    >
      {children}
    </View>
  );
}
