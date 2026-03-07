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
    // B-51 v2: ahora usamos Supabase Auth real via verifyOtp + Admin API.
    // autoRefreshToken: true → Supabase renueva el access_token automáticamente
    // usando el refresh_token retornado por verifyOtp(). Sin esto el token
    // expira en ~1 hora y las queries RLS empiezan a fallar.
    autoRefreshToken:   true,
    persistSession:     true,  // Sesión persiste en SecureStore entre reinicios de app
    detectSessionInUrl: false,
  },
});

/**
 * setSupabaseToken — Activa la sesión Supabase usando el OTP token hash
 * generado por sync-privy-user via Admin API.
 *
 * B-51 v2 (Admin API approach):
 *   sync-privy-user ahora retorna `otp_token_hash` en lugar de `access_token`.
 *   El token_hash proviene de auth.admin.generateLink({ type: 'magiclink' }).
 *   Llamar verifyOtp con ese token produce una sesión real de Supabase Auth:
 *   - access_token válido firmado por Supabase (no por nosotros)
 *   - refresh_token para auto-renovación (autoRefreshToken: true lo usa)
 *   - auth.uid() retorna el UUID del usuario → RLS policies funcionan
 *
 * Ya no se requiere SUPABASE_JWT_SECRET — el Admin API maneja todo internamente.
 *
 * @param tokenHash - hashed_token de la respuesta de generateLink (Admin API)
 */
export async function setSupabaseToken(tokenHash: string): Promise<void> {
  try {
    const { data, error } = await supabase.auth.verifyOtp({
      token_hash: tokenHash,
      type: "email", // 'email' es el tipo genérico para magic links via Admin API
    });
    if (error) throw error;
    if (!data.session) throw new Error("verifyOtp no retornó sesión");
    console.log("[Supabase] Sesión activada via verifyOtp — RLS habilitada");
  } catch (e) {
    // No es crítico — la app funciona sin RLS en modo degradado (scripts públicos)
    console.warn("[Supabase] Error activando sesión:", e);
  }
}
