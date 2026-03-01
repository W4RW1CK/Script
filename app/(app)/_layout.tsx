/**
 * Layout raíz de la zona autenticada — Tab Navigator de 5 tabs.
 *
 * Estructura de rutas:
 *   home          → S09 Pantalla principal
 *   checkin       → S10–S13 Flujo de check-in corporal
 *   scripts       → S14–S16 Biblioteca de scripts sociales
 *   history       → S19 Historial de check-ins
 *   settings      → S21 Configuración
 *
 * El FAB de Rescate (S17) se inyecta encima de este navigator en Paso 1.4.3.
 * Íconos: expo-symbols (SF Symbols en iOS, equivalentes en Android).
 * Colores activo/inactivo: FRONTEND_GUIDELINES §4 + §1.3 tokens.
 */
import { Tabs } from "expo-router";
import { SymbolView } from "expo-symbols";
import { useColorScheme, View } from "react-native";
import { RescueFAB } from "@/components/rescue/RescueFAB";

export default function AppTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Tokens de color mapeados desde constants/colors.ts
  const activeColor  = isDark ? "#5A7E92" : "#A8C5DA"; // script-dark-blue / script-blue
  const inactiveColor = isDark ? "#55555E" : "#ABABAB"; // disabled dark / disabled light
  const bgColor      = isDark ? "#2F2F38" : "#FFFFFF";  // script-dark-elevated / script-bg-elevated

  return (
    // View wrapper necesario para posicionar el FAB encima del Tab Navigator
    <View style={{ flex: 1 }}>
    <Tabs
      screenOptions={{
        tabBarActiveTintColor:   activeColor,
        tabBarInactiveTintColor: inactiveColor,
        tabBarStyle: {
          backgroundColor: bgColor,
          borderTopWidth: 0,     // Sin borde — separación por sombra (FRONTEND_GUIDELINES §4)
          height: 64,            // Altura fija + SafeArea inset lo gestiona Expo
          elevation: 8,          // Sombra Android
          shadowOpacity: 0.08,   // Sombra iOS (sutil)
          shadowRadius: 8,
          shadowOffset: { width: 0, height: -2 },
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontFamily: "Inter_600SemiBold",
          marginBottom: 4,
        },
        // El header lo gestiona cada pantalla individualmente
        headerShown: false,
      }}
    >
      {/* Tab 1 — Home (S09) */}
      <Tabs.Screen
        name="home"
        options={{
          title: "Inicio",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="house.fill"
              tintColor={color}
              type="hierarchical"
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarAccessibilityLabel: "Pantalla de inicio",
        }}
      />

      {/* Tab 2 — Check-in corporal (S10–S13) */}
      <Tabs.Screen
        name="checkin"
        options={{
          title: "Check-in",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="hand.raised.fill"
              tintColor={color}
              type="hierarchical"
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarAccessibilityLabel: "Hacer un check-in corporal",
        }}
      />

      {/* Tab 3 — Biblioteca de scripts (S14–S16) */}
      <Tabs.Screen
        name="scripts"
        options={{
          title: "Scripts",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="doc.text.fill"
              tintColor={color}
              type="hierarchical"
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarAccessibilityLabel: "Scripts sociales",
        }}
      />

      {/* Tab 4 — Historial de check-ins (S19) */}
      <Tabs.Screen
        name="history"
        options={{
          title: "Historial",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="chart.bar.fill"
              tintColor={color}
              type="hierarchical"
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarAccessibilityLabel: "Historial de check-ins",
        }}
      />

      {/* Tab 5 — Configuración (S21) */}
      <Tabs.Screen
        name="settings"
        options={{
          title: "Ajustes",
          tabBarIcon: ({ color }) => (
            <SymbolView
              name="gearshape.fill"
              tintColor={color}
              type="hierarchical"
              style={{ width: 24, height: 24 }}
            />
          ),
          tabBarAccessibilityLabel: "Configuración",
        }}
      />
    </Tabs>

    {/* FAB de Rescate — flotante, visible en todas las tabs (FRONTEND_GUIDELINES §4) */}
    <RescueFAB />
    </View>
  );
}
