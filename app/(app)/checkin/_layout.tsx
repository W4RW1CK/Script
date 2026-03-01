/**
 * Layout del flujo de Check-in (S10–S13).
 *
 * Stack navigator propio para las 4 pantallas del flujo:
 *   index  → S10 Mapa Corporal (entrada del tab)
 *   body   → S10 (alias, implementado en Fase 1.5)
 *   notes  → S11 Texto libre
 *   reflect → S12 Interpretación IA
 *   result → S13 Resultado
 *
 * El header está oculto — cada pantalla gestiona su propio encabezado.
 */
import { Stack } from "expo-router";

export default function CheckinLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
