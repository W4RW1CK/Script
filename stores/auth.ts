/**
 * stores/auth.ts — Zustand store para el estado de autenticación
 *
 * Centraliza toda la información del usuario autenticado para que
 * cualquier pantalla pueda acceder sin depender de hooks de Privy
 * (que tienen problemas de stale closures en callbacks).
 *
 * Patrón: después de login exitoso con Privy, se llama setUser()
 * con los datos del usuario. El resto de la app lee de aquí.
 *
 * ¿Por qué no usar usePrivy().user directamente?
 * - En callbacks async (como loginWithOAuth), el hook puede tener
 *   un valor stale por closures de React. Mejor extraer el user
 *   del resultado de la función y guardarlo aquí.
 */

import { create } from "zustand";

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
  /** Si el onboarding ya fue completado */
  onboardingComplete: boolean;
  /** Setear usuario tras login exitoso */
  setUser: (user: AuthUser) => void;
  /** Actualizar el supabaseUserId tras sync */
  setSupabaseUserId: (id: string) => void;
  /** Marcar onboarding como completo */
  setOnboardingComplete: (complete: boolean) => void;
  /** Limpiar sesión (logout) */
  clearUser: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  onboardingComplete: false,

  setUser: (user) => set({ user }),

  setSupabaseUserId: (id) =>
    set((state) => ({
      user: state.user ? { ...state.user, supabaseUserId: id } : null,
    })),

  setOnboardingComplete: (complete) => set({ onboardingComplete: complete }),

  clearUser: () => set({ user: null, onboardingComplete: false }),
}));
