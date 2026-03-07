/**
 * lib/supabase.ts — Cliente de Supabase para Script
 *
 * Usa la anon key para queries públicas (scripts predefinidos, etc.).
 * Para operaciones protegidas por RLS, el cliente necesita un JWT válido
 * configurado con setSupabaseToken() (B-51 — Option A).
 *
 * ¿Por qué autoRefreshToken: false?
 *   Usamos Privy como auth provider, no Supabase Auth.
 *   El refresh token de Supabase no aplica aquí — el JWT lo genera
 *   sync-privy-user cada vez que la app arranca y la sesión de Privy existe.
 *   Duración del JWT: 30 días. Si expira, la próxima carga de app re-minta
 *   automáticamente (ver AuthGate en _layout.tsx y handlePostLogin en auth.tsx).
 *
 * Almacenamiento de sesión:
 *   Supabase guarda el JWT (access_token) en nuestro storage (SecureStore en
 *   nativo, localStorage en web). En el próximo arranque, Supabase lo restaura
 *   automáticamente si no está expirado — sin llamada de red extra.
 */
import { createClient } from "@supabase/supabase-js";
import * as SecureStore from "expo-secure-store";
import { Platform } from "react-native";

/**
 * Adaptador de almacenamiento para la sesión de Supabase.
 *
 * En Android/iOS: usa SecureStore (encriptado en el dispositivo).
 * En web: usa localStorage (Expo dev tools corre un servidor web en paralelo;
 *         SecureStore no está disponible ahí y lanza getValueWithKeyAsync error).
 *
 * Esta distinción es necesaria porque `npx expo start` bundlea para web también
 * aunque la app sea mobile-only.
 */
const storage = Platform.OS === "web"
  ? {
      // Fallback para web — solo usado en Expo dev tools, no en producción
      getItem: (key: string) =>
        Promise.resolve(
          typeof localStorage !== "undefined" ? localStorage.getItem(key) : null
        ),
      setItem: (key: string, value: string) => {
        if (typeof localStorage !== "undefined") localStorage.setItem(key, value);
        return Promise.resolve();
      },
      removeItem: (key: string) => {
        if (typeof localStorage !== "undefined") localStorage.removeItem(key);
        return Promise.resolve();
      },
    }
  : {
      // Nativo (Android/iOS) — SecureStore encriptado
      getItem:    (key: string) => SecureStore.getItemAsync(key),
      setItem:    (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };

const supabaseUrl    = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken:  false, // B-51: no usamos Supabase Auth nativo — Privy maneja la sesión
    persistSession:    true,  // El JWT minted se persiste en SecureStore para los reinicios
    detectSessionInUrl: false,
  },
});

/**
 * setSupabaseToken — Activa el JWT minted por sync-privy-user en el cliente.
 *
 * B-51 (Option A): Después de cada llamada exitosa a sync-privy-user,
 * llamar esta función con el access_token recibido.
 * Esto hace que auth.uid() devuelva el UUID correcto → RLS policies funcionan.
 *
 * El JWT se persiste en SecureStore automáticamente (persistSession: true).
 * En el próximo arranque de app, Supabase lo restaura si no ha expirado (30 días).
 *
 * @param accessToken - JWT firmado con SUPABASE_JWT_SECRET, sub = UUID del usuario
 */
export async function setSupabaseToken(accessToken: string): Promise<void> {
  try {
    await supabase.auth.setSession({
      access_token:  accessToken,
      // Supabase requiere refresh_token aunque no lo usemos —
      // pasamos el mismo token como placeholder (no hay flow de refresh real).
      // El JWT tiene 30 días de validez; sync-privy-user re-minta al arrancar.
      refresh_token: accessToken,
    });
    console.log("[Supabase] Sesión activada — RLS habilitada para este usuario");
  } catch (e) {
    // No es crítico — la app funciona sin RLS en modo degradado (solo scripts públicos)
    console.warn("[Supabase] Error activando sesión:", e);
  }
}
