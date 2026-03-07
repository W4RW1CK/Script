/**
 * sync-privy-user — Supabase Edge Function
 *
 * Sincroniza un usuario de Privy con la tabla `users` y devuelve un JWT
 * compatible con Supabase Auth para que las RLS policies funcionen (B-51).
 *
 * Flow completo (Option A — B-51):
 * 1. Recibe privy_user_id + email del cliente
 * 2. Busca/crea el usuario en tabla `users` (privy_user_id → UUID)
 * 3. Minta un JWT HS256 firmado con SUPABASE_JWT_SECRET, sub = UUID del usuario
 * 4. Retorna { user_id, onboarding_complete, access_token }
 * 5. Cliente llama supabase.auth.setSession({ access_token })
 * 6. auth.uid() ahora retorna el UUID → RLS policies funcionan
 *
 * Schema fixes incluidos:
 *   B-42: columna correcta es `privy_user_id` (no `privy_id`)
 *   B-43: `onboarding_complete` está en `profiles`, no en `users`
 *   B-45: eliminado `last_login` (no existe en schema)
 *
 * Requiere env vars:
 *   SUPABASE_URL                — URL del proyecto
 *   SUPABASE_SERVICE_ROLE_KEY   — para bypass RLS en operaciones de sync
 *   SUPABASE_JWT_SECRET         — para firmar el JWT (Dashboard → Settings → API)
 *
 * Deploy: supabase functions deploy sync-privy-user
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// ── JWT minting (B-51 — Option A) ──────────────────────────────────────────

/**
 * Base64URL encode sin padding (estándar JWT — RFC 7515).
 * No usa Buffer (no disponible en Deno nativo).
 */
function base64url(data: string | Uint8Array): string {
  const bytes =
    typeof data === "string" ? new TextEncoder().encode(data) : data;
  const binary = Array.from(bytes, (b) => String.fromCharCode(b)).join("");
  return btoa(binary)
    .replace(/\+/g, "-")
    .replace(/\//g, "_")
    .replace(/=/g, "");
}

/**
 * Minta un JWT HS256 compatible con Supabase Auth.
 *
 * El campo `sub` es el UUID del usuario en nuestra tabla `users`.
 * auth.uid() en las RLS policies lee exactamente este campo.
 * Con `role: "authenticated"` las policies del tipo `auth.uid() = user_id` funcionan.
 *
 * @param userUuid   - UUID del usuario en `users.id`
 * @param userEmail  - Email del usuario (opcional, incluido en el payload)
 * @param jwtSecret  - SUPABASE_JWT_SECRET del proyecto
 * @param expiresIn  - Duración en segundos (default: 30 días)
 */
async function mintSupabaseJWT(
  userUuid: string,
  userEmail: string | null,
  jwtSecret: string,
  expiresIn = 30 * 24 * 60 * 60 // 30 días para MVP (no hay refresh flow todavía)
): Promise<string> {
  const now = Math.floor(Date.now() / 1000);

  // Header JWT estándar HS256
  const header = { alg: "HS256", typ: "JWT" };

  // Payload compatible con Supabase Auth (lo que espera auth.uid() y las RLS policies)
  const payload = {
    aud:   "authenticated",   // Requerido por Supabase
    iss:   "supabase",        // Requerido por Supabase
    sub:   userUuid,          // ← auth.uid() leerá este valor en RLS
    role:  "authenticated",   // Requerido para que las policies apliquen
    email: userEmail ?? "",
    iat:   now,
    exp:   now + expiresIn,
  };

  // Construir signing input: header.payload (ambos en base64url)
  const headerB64  = base64url(JSON.stringify(header));
  const payloadB64 = base64url(JSON.stringify(payload));
  const signingInput = `${headerB64}.${payloadB64}`;

  // Importar el secreto como clave HMAC-SHA256
  const key = await crypto.subtle.importKey(
    "raw",
    new TextEncoder().encode(jwtSecret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"]
  );

  // Firmar
  const signatureBuffer = await crypto.subtle.sign(
    "HMAC",
    key,
    new TextEncoder().encode(signingInput)
  );

  const signature = base64url(new Uint8Array(signatureBuffer));
  return `${signingInput}.${signature}`;
}

// ── Handler principal ───────────────────────────────────────────────────────
serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const { privy_user_id, email } = await req.json();

    if (!privy_user_id) {
      return new Response(
        JSON.stringify({ error: "privy_user_id is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    const supabaseUrl    = Deno.env.get("SUPABASE_URL")!;
    const serviceKey     = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;
    const jwtSecret      = Deno.env.get("SUPABASE_JWT_SECRET");

    // Service role key para bypass RLS en operaciones de sync (server-side)
    const supabase = createClient(supabaseUrl, serviceKey);

    // ── Buscar usuario existente ──────────────────────────────────────────
    // B-42: columna correcta es "privy_user_id" (schema.sql línea 9)
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("privy_user_id", privy_user_id)
      .single();

    let userId: string;

    if (existingUser) {
      // ── Usuario existe: actualizar email + updated_at ─────────────────
      // B-45: eliminado last_login — no existe en schema.sql
      await supabase
        .from("users")
        .update({ email, updated_at: new Date().toISOString() })
        .eq("id", existingUser.id);

      userId = existingUser.id;
    } else {
      // ── Usuario nuevo: crear en users + profile vacío ─────────────────
      // B-42: campo correcto es "privy_user_id"
      // B-43: onboarding_complete va en profiles, no aquí
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({ privy_user_id, email })
        .select("id")
        .single();

      if (userError) throw userError;

      // Perfil vacío — onboarding_complete = false por DEFAULT del schema
      await supabase.from("profiles").insert({ user_id: newUser.id });

      userId = newUser.id;
    }

    // ── Leer onboarding_complete de profiles (B-43) ───────────────────────
    // El campo está en profiles, NO en users (schema.sql línea 39)
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("user_id", userId)
      .single();

    const onboardingComplete = profile?.onboarding_complete ?? false;

    // ── Minta JWT compatible con Supabase Auth (B-51 — Option A) ─────────
    // Si no está configurado SUPABASE_JWT_SECRET, omitir el token (degradación graceful)
    let accessToken: string | null = null;
    if (jwtSecret) {
      accessToken = await mintSupabaseJWT(
        userId,
        email ?? null,
        jwtSecret
      );
    } else {
      console.warn(
        "[sync-privy-user] SUPABASE_JWT_SECRET no configurado — " +
        "RLS no funcionará para operaciones cliente-directo (B-51)"
      );
    }

    return new Response(
      JSON.stringify({
        user_id:             userId,
        onboarding_complete: onboardingComplete,
        created:             !existingUser,
        // B-51: JWT para que el cliente configure supabase.auth.setSession()
        // null si SUPABASE_JWT_SECRET no está disponible en el entorno
        access_token:        accessToken,
        expires_in:          30 * 24 * 60 * 60, // 30 días en segundos
      }),
      { headers: corsHeaders }
    );

  } catch (error) {
    console.error("[sync-privy-user] Error:", error);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
