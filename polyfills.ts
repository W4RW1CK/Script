/**
 * polyfills.ts — Polyfills necesarios para Privy + jose en React Native (Hermes)
 *
 * DEBE importarse PRIMERO en app/_layout.tsx (antes de cualquier otro import).
 *
 * ¿Por qué necesitamos esto?
 * - Privy usa `jose` para JWT, que necesita `crypto.subtle`
 * - `@noble/hashes` (dep de Privy) necesita `crypto.getRandomValues`
 * - Buffer es necesario para encoding en Privy/jose
 *
 * ¿Por qué `react-native-get-random-values`?
 * - En Hermes (RN 0.83), acceder a `global.crypto` cuando NO existe lanza
 *   ReferenceError (distinto a V8 que retorna undefined).
 * - `globalThis.crypto` también puede ser undefined en algunos dispositivos.
 * - Este paquete inyecta `crypto.getRandomValues` nativo y registra
 *   `global.crypto` de forma segura — es el estándar para RN + Privy.
 *
 * Orden de imports: esta secuencia es CRÍTICA — no reordenar.
 *  1. react-native-get-random-values → registra global.crypto (nativo)
 *  2. buffer → registra global.Buffer
 *
 * Docs Privy RN: https://docs.privy.io/guide/expo/setup
 */

// 1. Polyfill de crypto — PRIMERO, antes de cualquier lib que use crypto
//    expo-crypto está incluido en Expo Go y provee getRandomValues nativo.
//    react-native-get-random-values es el fallback (requiere native module linkado).
import * as ExpoCrypto from "expo-crypto";

// Registrar crypto.getRandomValues de forma que uuid y Privy lo encuentren
if (typeof global.crypto === "undefined" || typeof global.crypto.getRandomValues !== "function") {
  // @ts-ignore — bridge entre expo-crypto y la interfaz Web Crypto
  global.crypto = {
    getRandomValues: <T extends ArrayBufferView>(array: T): T => {
      const bytes = ExpoCrypto.getRandomBytes(array.byteLength);
      new Uint8Array(array.buffer, array.byteOffset, array.byteLength).set(bytes);
      return array;
    },
    // subtle está en globalThis.crypto en Hermes RN 0.83+
    ...(typeof globalThis.crypto?.subtle !== "undefined"
      ? { subtle: globalThis.crypto.subtle }
      : {}),
  };
}

// 2. Polyfill de Buffer — requerido por Privy/jose para encoding
import { Buffer } from "buffer";
global.Buffer = Buffer;

// 3. Asegurar que global.crypto apunte a globalThis.crypto para librerías
//    que usan global.crypto.subtle (patrón Node.js vs patrón browser)
//    react-native-get-random-values ya registró global.crypto, así que
//    esta línea solo refuerza la referencia si falta algo.
if (typeof globalThis.crypto !== "undefined" && typeof global.crypto === "undefined") {
  // @ts-ignore — bridge entre namespace de Node-style y browser-style
  global.crypto = globalThis.crypto;
}
