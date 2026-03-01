/**
 * Layout del Protocolo de Rescate (S17–S18).
 *
 * Stack navigator para:
 *   assess   → S17 Evaluación de nivel de crisis (entrada via FAB)
 *   protocol → S18 Protocolo de calma multimodal
 *
 * Nota: rescue NO es un tab — se accede via RescueFAB desde cualquier pantalla.
 * Las pantallas de rescue no muestran header para maximizar el espacio en crisis.
 */
import { Stack } from "expo-router";

export default function RescueLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
