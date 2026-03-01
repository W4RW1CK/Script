/**
 * metro.config.js — Configuración de Metro Bundler para NativeWind 4
 *
 * ⚠️  ESTE ARCHIVO ES CRÍTICO PARA QUE LOS ESTILOS FUNCIONEN.
 *
 * NativeWind v4 requiere `withNativeWind()` en Metro para procesar
 * los archivos CSS de Tailwind y convertirlos en estilos de React Native.
 * Sin este archivo, todos los `className` se ignoran silenciosamente
 * y la UI se ve sin estilos (solo texto plano).
 *
 * Referencias:
 *  - NativeWind v4 docs: https://www.nativewind.dev/getting-started/expo-router
 *  - Bug conocido: el plugin `nativewind/babel` solo es suficiente para
 *    transforms de JSX; el procesamiento CSS requiere el plugin de Metro.
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Obtener la configuración base de Expo
const config = getDefaultConfig(__dirname);

// Envolver con NativeWind — apunta al archivo CSS global con los @tailwind directives
module.exports = withNativeWind(config, {
  // Ruta al CSS global que contiene @tailwind base/components/utilities
  input: "./global.css",
});
