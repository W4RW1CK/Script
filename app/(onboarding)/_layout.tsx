/**
 * (onboarding)/_layout.tsx — Layout del flujo de onboarding
 *
 * Stack Navigator sin header (cada pantalla maneja su propio header).
 * El flujo es lineal: Welcome → AQ-10 → Resultado → Tests opcionales → Perfil → Contactos
 *
 * No se muestra el RescueFAB aquí porque ya está en el root _layout.tsx
 */
import { Stack } from "expo-router";

export default function OnboardingLayout() {
  return (
    <Stack screenOptions={{ headerShown: false, animation: "slide_from_right" }}>
      <Stack.Screen name="index" />
      {/* T-C3: pantalla de consentimiento informado (LFPDPPP) antes del AQ-10 */}
      <Stack.Screen name="consent" />
      <Stack.Screen name="aq10" />
      <Stack.Screen name="aq10-result" />
      <Stack.Screen name="aq-full" />
      <Stack.Screen name="catq" />
      <Stack.Screen name="raads" />
      <Stack.Screen name="profile" />
      <Stack.Screen name="contacts" />
    </Stack>
  );
}
