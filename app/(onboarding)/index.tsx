/**
 * (onboarding)/index.tsx — S01: Pantalla de Bienvenida
 *
 * Primera pantalla del onboarding. Muestra el nombre de la app,
 * la tagline y dos opciones:
 * - "Comenzar mi camino" → inicia el AQ-10
 * - "Necesito ayuda ahora" → va directo al protocolo de rescate
 *
 * El tono es cálido y sin presión. No se pide nada al usuario todavía.
 */
import React from "react";
import { View, useColorScheme } from "react-native";
import { useRouter } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { SafeScreen, Typography, Button } from "@/components/ui";

export default function OnboardingWelcomeScreen() {
  const router = useRouter();
  const isDark = useColorScheme() === "dark";

  return (
    <SafeScreen>
      <View className="flex-1 px-6 pt-20 pb-8 items-center">
        {/* Logo / Ícono */}
        <Ionicons
          name="document-text-outline"
          size={80}
          color={isDark ? "#5A7E92" : "#A8C5DA"} // script-dark-blue / script-blue
        />

        {/* Nombre de la app */}
        <Typography variant="headingL" className="mt-6 text-center">
          Script
        </Typography>

        {/* Tagline — exacta del plan */}
        <Typography
          variant="body"
          className="mt-4 text-center text-script-text-secondary dark:text-script-dark-text-secondary px-4"
        >
          Un manual para quienes sienten que son el único actor en la obra el
          cual no conoce el guión
        </Typography>

        <View className="flex-1" />

        {/* CTAs */}
        <View className="w-full gap-4">
          <Button
            title="Comenzar mi camino"
            onPress={() => router.push("/(onboarding)/aq10")}
            variant="primary"
          />
          <Button
            title="Necesito ayuda ahora"
            onPress={() => router.push("/(app)/rescue/assess")}
            variant="ghost"
          />
        </View>
      </View>
    </SafeScreen>
  );
}
