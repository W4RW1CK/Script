/**
 * Layout de Configuración (S21–S22).
 *
 * Stack navigator para:
 *   index    → S21 Configuración principal
 *   contacts → S22 Gestión de contactos (Semana 2)
 */
import { Stack } from "expo-router";

export default function SettingsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
