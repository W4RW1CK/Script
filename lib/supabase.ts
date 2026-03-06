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
      // NOTA: Metro SSR renderer corre en Node.js donde localStorage no existe.
      // Verificar typeof antes de usarlo para evitar ReferenceError en SSR.
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
      getItem: (key: string) => SecureStore.getItemAsync(key),
      setItem: (key: string, value: string) => SecureStore.setItemAsync(key, value),
      removeItem: (key: string) => SecureStore.deleteItemAsync(key),
    };

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    storage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});
