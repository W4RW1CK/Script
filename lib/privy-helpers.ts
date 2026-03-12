/**
 * lib/privy-helpers.ts — Shared Privy utility functions
 *
 * Centralizes Privy user object manipulation to avoid duplicated `as any` casts
 * across auth.tsx and _layout.tsx (S-03 deep audit fix, 2026-03-12).
 *
 * Privy v0.63.6 user object shape is not fully typed — these helpers
 * wrap the necessary `as any` casts in one place so the rest of the app
 * uses typed functions.
 */

/**
 * Extracts the user's email address from a Privy user object.
 * Handles both OAuth (linked_accounts) and magic link (email.address) shapes.
 *
 * @param privyUser - Raw Privy user object (any shape from usePrivy().user)
 * @returns Email address string or null if not found
 */
export function getPrivyEmail(privyUser: unknown): string | null {
  if (!privyUser) return null;
  const u = privyUser as any;
  return (
    u.email?.address ??
    u.linked_accounts?.find((a: any) => a.type === "email")?.address ??
    null
  );
}
