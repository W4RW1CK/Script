/**
 * Layout del Historial (S19).
 *
 * Stack navigator — pantalla única por ahora.
 * En Semana 2 se agregarán sub-pantallas (detalle de check-in, diccionario emocional).
 */
import { Stack } from "expo-router";

export default function HistoryLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
