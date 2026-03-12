/**
 * stores/auth.ts — Zustand store para el estado de autenticación
 *
 * Centraliza toda la información del usuario autenticado.
 * `onboardingComplete` se persiste en SecureStore para que esté
 * disponible inmediatamente en el siguiente arranque, sin esperar
 * a que Supabase responda — elimina el flash de onboarding → home.
 */

import { create } from "zustand";
import * as SecureStore from "expo-secure-store";

const ONBOARDING_KEY = "script_onboarding_complete";

/** Datos mínimos del usuario autenticado */
export interface AuthUser {
  /** Privy user ID (formato: "did:privy:xxxxx") */
  privyId: string;
  /** Email del usuario (de magic link o Google) */
  email: string | null;
  /** Supabase user_id (UUID) — se obtiene tras sync-privy-user */
  supabaseUserId: string | null;
}

interface AuthState {
  /** Usuario autenticado, null si no hay sesión */
  user: AuthUser | null;
  /** Si el onboarding ya fue completado — persiste en SecureStore */
  onboardingComplete: boolean;
  /**
   * Guest mode — user chose "Continuar sin cuenta" on auth screen.
   * Can access: Rescue (local, not saved) + Scripts (read-only).
   * Cannot access: check-in, history, dictionary.
   * No supabaseUserId — all Supabase writes are silently skipped.
   * T-Guest: set by Ana's auth screen button; read by home.tsx + AuthGate.
   */
  isGuest: boolean;
  /** Setear usuario tras login exitoso */
  setUser: (user: AuthUser) => void;
  /** Actualizar el supabaseUserId tras sync */
  setSupabaseUserId: (id: string) => void;
  /** Marcar onboarding como completo (persiste en SecureStore) */
  setOnboardingComplete: (complete: boolean) => void;
  /** Activar modo invitado (sin cuenta) */
  setGuest: (guest: boolean) => void;
  /** Limpiar sesión (logout) — borra SecureStore también */
  clearUser: () => void;
  /** Cargar onboardingComplete desde SecureStore al arrancar */
  loadPersistedState: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  onboardingComplete: false,
  isGuest: false,

  setUser: (user) => set({ user }),

  setSupabaseUserId: (id) =>
    set((state) => ({
      user: state.user ? { ...state.user, supabaseUserId: id } : null,
    })),

  setOnboardingComplete: (complete) => {
    // Persist to SecureStore (fire-and-forget — non-blocking)
    SecureStore.setItemAsync(ONBOARDING_KEY, complete ? "1" : "0").catch(
      (e) => console.warn("[AuthStore] SecureStore write failed:", e)
    );
    set({ onboardingComplete: complete });
  },

  setGuest: (guest) => set({ isGuest: guest }),

  clearUser: () => {
    // Clear persisted onboarding state on logout — also resets guest mode
    SecureStore.deleteItemAsync(ONBOARDING_KEY).catch(() => {});
    set({ user: null, onboardingComplete: false, isGuest: false });
  },

  loadPersistedState: async () => {
    try {
      const stored = await SecureStore.getItemAsync(ONBOARDING_KEY);
      if (stored === "1") {
        set({ onboardingComplete: true });
      }
    } catch (e) {
      console.warn("[AuthStore] SecureStore read failed:", e);
    }
  },
}));
