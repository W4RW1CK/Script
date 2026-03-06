/**
 * metro.config.js — Configuración de Metro Bundler para NativeWind 4 + Privy/jose
 *
 * Configuraciones críticas:
 *
 * 1. NativeWind: `withNativeWind()` procesa CSS de Tailwind → estilos RN
 *    Sin esto, todos los `className` se ignoran silenciosamente.
 *
 * 2. jose/Privy: `unstable_conditionNames` resuelve imports condicionales
 *    de la librería `jose` (usada por Privy para JWT). Sin esto, Metro
 *    no encuentra los exports correctos y falla con "module not found".
 *    DEBE ir DESPUÉS de withNativeWind (que puede sobreescribir resolver).
 *
 * 3. extraNodeModules: fuerza ciertos paquetes a resolverse desde la raíz
 *    en lugar de desde node_modules anidados — evita imports circulares.
 *
 * IMPORTANTE: Solo agregar paquetes a extraNodeModules si están instalados.
 */
const { getDefaultConfig } = require("expo/metro-config");
const { withNativeWind } = require("nativewind/metro");

// Obtener la configuración base de Expo
const config = getDefaultConfig(__dirname);

// Resolución de módulos desde la raíz del proyecto.
// Evita problemas con paquetes anidados en node_modules de dependencias.
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,

  // `buffer`: Metro trata "buffer" como módulo de Node stdlib (lo bloquea).
  // Al apuntarlo al paquete npm `buffer`, Privy y otras libs pueden usarlo.
  buffer: require.resolve("buffer"),

  // `uuid`: @privy-io/js-sdk-core tiene su propio uuid en node_modules anidados.
  // Su wrapper.mjs hace `import { v1 } from 'uuid'` y Metro (con condición "browser")
  // lo resuelve de vuelta al mismo wrapper.mjs → import circular → undefined.
  // Al forzar la resolución al uuid raíz (CJS), rompemos el ciclo.
  uuid: require.resolve("uuid"),
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
