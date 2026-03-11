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
 * El FAB de Rescate (S17) se renderiza en app/_layout.tsx (raíz) — encima de todo.
 * Íconos: Ionicons (@expo/vector-icons) — multiplataforma iOS/Android/web.
 * expo-symbols (SF Symbols) solo funciona en iOS/web, NO en Android (B-07).
 * Colores activo/inactivo: FRONTEND_GUIDELINES §4 + §1.3 tokens.
 */
import { Tabs } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import { useColorScheme } from "react-native";

export default function AppTabLayout() {
  const colorScheme = useColorScheme();
  const isDark = colorScheme === "dark";

  // Tokens de color mapeados desde constants/colors.ts
  const activeColor  = isDark ? "#5A7E92" : "#A8C5DA"; // script-dark-blue / script-blue
  const inactiveColor = isDark ? "#55555E" : "#ABABAB"; // disabled dark / disabled light
  const bgColor      = isDark ? "#2F2F38" : "#FFFFFF";  // script-dark-elevated / script-bg-elevated

  return (
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
          // T-U3: Atkinson has no SemiBold — use Bold (700) per decision 2026-03-10
          fontFamily: "AtkinsonHyperlegible_700Bold",
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
            <Ionicons name="home" size={24} color={color} />
          ),
          tabBarAccessibilityLabel: "Pantalla de inicio",
        }}
      />

      {/* Tab 2 — Check-in corporal (S10–S13)
          unmountOnBlur: true — ensures the entire check-in stack is dismounted
          when the user navigates away from this tab. On return, the stack
          mounts fresh (index → body) with no stale state from a previous flow. */}
      <Tabs.Screen
        name="checkin"
        options={{
          title: "Check-in",
          tabBarIcon: ({ color }) => (
            <Ionicons name="body" size={24} color={color} />
          ),
          tabBarAccessibilityLabel: "Hacer un check-in corporal",
          unmountOnBlur: true,
        }}
      />

      {/* Tab 3 — Biblioteca de scripts (S14–S16) */}
      <Tabs.Screen
        name="scripts"
        options={{
          title: "Scripts",
          tabBarIcon: ({ color }) => (
            <Ionicons name="chatbubbles" size={24} color={color} />
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
            <Ionicons name="bar-chart" size={24} color={color} />
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
            <Ionicons name="settings" size={24} color={color} />
          ),
          tabBarAccessibilityLabel: "Configuración",
        }}
      />

      {/*
        Rutas ocultas del tab bar — Expo Router auto-descubre TODAS las
        carpetas en (app)/, incluida rescue/. Sin este Screen con href:null,
        aparecería una tab "rescue" en la barra de navegación.
        La pantalla rescue/assess se accede solo via RescueFAB o navegación programática.
      */}
      <Tabs.Screen
        name="rescue"
        options={{
          href: null,          // Oculta del tab bar (B-06)
          tabBarItemStyle: { display: "none" },
        }}
      />
    </Tabs>
  );
}
