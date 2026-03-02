/**
 * checkin/index.tsx — Redirect al flujo de check-in (S10)
 *
 * Esta pantalla es el punto de entrada del tab "Check-in".
 * Redirige automáticamente a body.tsx (S10 — Mapa Corporal),
 * que es la primera pantalla real del flujo implementada en Fase 1.5.
 *
 * Usa <Redirect> de expo-router en lugar de useRouter().replace()
 * para evitar que esta pantalla aparezca en el historial de navegación.
 * El usuario siempre llega directo al BodyMap.
 */
import { Redirect } from "expo-router";

export default function CheckinIndex() {
  // Redirect declarativo — no agrega esta ruta al history stack
  return <Redirect href="/(app)/checkin/body" />;
}
