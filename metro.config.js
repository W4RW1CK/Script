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
config.resolver.extraNodeModules = {
  ...config.resolver.extraNodeModules,
  buffer: require.resolve("buffer"),
  uuid: require.resolve("uuid"),
};

/**
 * FIX CRÍTICO — uuid/wrapper.mjs crash (B-39)
 *
 * PROBLEMA: @privy-io/js-sdk-core importa `uuid` desde archivos .mjs (ESM).
 * Metro, al procesar imports ESM, evalúa el campo `exports` del package.json
 * de uuid y puede seleccionar `wrapper.mjs` (condición "node").
 * `wrapper.mjs` hace `require('crypto')` de Node.js que NO existe en Hermes/RN.
 * Resultado: `uuid` es undefined → `uuid.v1` lanza TypeError → Privy nunca carga.
 *
 * SOLUCIÓN: `resolveRequest` intercepta TODA resolución de `uuid` antes de
 * evaluar el campo `exports` y lo fuerza al build CJS puro (sin crypto de Node).
 * El build CJS usa `Math.random()` como fallback si crypto no está disponible,
 * y nuestro polyfill de expo-crypto garantiza que crypto SÍ esté disponible.
 *
 * extraNodeModules NO es suficiente porque no aplica a imports ESM en .mjs.
 */
const path = require("path");

// Pre-resolve module paths at Metro startup time (avoids hardcoding paths)
const uuidCjsPath = require.resolve("uuid");
const privyCjsPath = require.resolve("@privy-io/expo");

/**
 * resolveRequest — canonical module deduplication
 *
 * PROBLEM: unstable_conditionNames: ['browser', 'require', 'default'] causes Metro
 * to resolve the same package to DIFFERENT files depending on how it's imported:
 *   - ESM import  → 'browser' condition → ./dist/esm/index.js  (instance A)
 *   - CJS require → 'require' condition → ./dist/index.js      (instance B)
 *
 * When @privy-io/expo loads as two different instances, PrivyProvider provides
 * React context from instance A, but usePrivy() looks for context from instance B.
 * No match → usePrivy() returns default values (ready: undefined, authenticated: undefined).
 *
 * FIX: intercept ALL resolutions of these packages and force them to one canonical
 * file path. Metro then deduplicates by path — one module instance, one React context.
 */
config.resolver.resolveRequest = (context, moduleName, platform) => {
  // Force uuid to CJS — never wrapper.mjs (uses Node crypto that doesn't exist in RN)
  if (moduleName === "uuid" || moduleName.startsWith("uuid/")) {
    return { filePath: uuidCjsPath, type: "sourceFile" };
  }

  // Force @privy-io/expo to single CJS instance — prevents dual ESM+CJS context split
  if (moduleName === "@privy-io/expo") {
    return { filePath: privyCjsPath, type: "sourceFile" };
  }

  // Default resolver for everything else
  return context.resolveRequest(context, moduleName, platform);
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
