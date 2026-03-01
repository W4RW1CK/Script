/**
 * Layout del flujo de Scripts Sociales (S14–S16).
 *
 * Stack navigator para:
 *   index      → S14 Biblioteca de scripts (entrada del tab)
 *   [id]       → S15 Modo Preparación
 *   [id]/execute → S16 Modo Ejecución
 */
import { Stack } from "expo-router";

export default function ScriptsLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
