/**
 * polyfills.ts — Polyfills necesarios para Privy + jose en React Native (Hermes)
 *
 * DEBE importarse PRIMERO en app/_layout.tsx (antes de cualquier otro import).
 *
 * ¿Por qué?
 * - Privy usa la librería `jose` para JWT, que necesita `crypto.subtle`
 * - Hermes (RN 0.83+) ya tiene WebCrypto nativo en `globalThis.crypto`
 * - Pero algunas librerías buscan `global.crypto`, que no existe por defecto
 * - Buffer es necesario para varias operaciones de encoding en Privy
 *
 * IMPORTANTE:
 * - NO instalar ni referenciar `readable-stream` (no está en el proyecto)
 * - NO usar polyfills de crypto pesados — Hermes ya lo tiene nativo
 */

import { Buffer } from "buffer";

// Buffer global — requerido por varias dependencias de Privy
global.Buffer = Buffer;

// Crypto — Hermes RN 0.83 tiene WebCrypto nativo en globalThis
// Solo necesitamos asegurarnos de que `global.crypto` apunte ahí
if (typeof global.crypto === "undefined" && typeof globalThis.crypto !== "undefined") {
  // @ts-ignore — asignar crypto nativo de Hermes al global de Node-style
  global.crypto = globalThis.crypto;
}
