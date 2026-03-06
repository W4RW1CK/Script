/**
 * metro.config.js — Configuración de Metro Bundler para NativeWind 4 + Privy/jose
 *
 * Dos configuraciones críticas aquí:
 *
 * 1. NativeWind: `withNativeWind()` procesa CSS de Tailwind → estilos RN
 *    Sin esto, todos los `className` se ignoran silenciosamente.
 *
 * 2. jose/Privy: `unstable_conditionNames` resuelve imports condicionales
 *    de la librería `jose` (usada por Privy para JWT). Sin esto, Metro
 *    no encuentra los exports correctos y falla con "module not found".
 *    DEBE ir DESPUÉS de withNativeWind (que puede sobreescribir resolver).
 *
 * IMPORTANTE: NO agregar paquetes a extraNodeModules si no están instalados.
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Obtener la configuración base de Expo
const config = getDefaultConfig(__dirname);

// Polyfill para el módulo `buffer` de Node.js
// Metro no incluye módulos de Node stdlib en el bundle de RN.
// Al apuntarlo al paquete npm `buffer`, Privy y otras libs pueden usarlo.
// NOTA: NO agregar `readable-stream` aquí — no está instalado.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve("buffer"),
};

// Envolver con NativeWind — apunta al archivo CSS global con los @tailwind directives
const nativeWindConfig = withNativeWind(config, {
  input: "./global.css",
});

// Agregar conditionNames para jose (usado por Privy para JWT)
// 'browser' hace que jose use la implementación WebCrypto (compatible con Hermes)
// en lugar de la implementación Node.js que no existe en RN
nativeWindConfig.resolver.unstable_conditionNames = [
  "browser",
  "require",
  "default",
];

module.exports = nativeWindConfig;
