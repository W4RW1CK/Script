/**
 * sync-privy-user — Supabase Edge Function
 *
 * Sincroniza un usuario de Privy con la tabla `users` de Supabase y genera
 * una sesión real de Supabase Auth para que las RLS policies funcionen.
 *
 * Flow (B-51 v2 — Admin API approach, no JWT secret needed):
 * 1. Recibe privy_user_id + email del cliente
 * 2. Busca/crea el usuario en tabla `users` (privy_user_id → UUID)
 * 3. Crea/verifica el usuario en `auth.users` con el MISMO UUID via Admin API
 * 4. Genera un magic link token (Admin API — NO envía email)
 * 5. Retorna { user_id, onboarding_complete, otp_token_hash }
 * 6. Cliente llama supabase.auth.verifyOtp({ token_hash }) → obtiene sesión real
 * 7. auth.uid() ahora retorna el UUID → todas las RLS policies funcionan
 *
 * ¿Por qué este approach en lugar de JWT minting?
 *   El nuevo dashboard de Supabase migró el Legacy JWT Secret a JWT Signing Keys
 *   asimétricos y ya no expone el secret en la UI. En lugar de depender de un
 *   secret manual, usamos el Admin API oficial de Supabase para crear sesiones.
 *   Esto es más robusto y no requiere ningún secret adicional.
 *
 * Schema fixes incluidos:
 *   B-42: columna correcta es `privy_user_id` (no `privy_id`)
 *   B-43: `onboarding_complete` está en `profiles`, no en `users`
 *   B-45: eliminado `last_login` (no existe en schema)
 *
 * Requiere env vars:
 *   SUPABASE_URL              — URL del proyecto (inyectado automáticamente)
 *   SUPABASE_SERVICE_ROLE_KEY — para bypass RLS y acceso a Admin API (inyectado automáticamente)
 *
 * Deploy: supabase functions deploy sync-privy-user
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

// ── Handler principal ───────────────────────────────────────────────────────
serve(async (req) => {
  // Preflight CORS
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

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    // Admin client con service_role — bypass RLS para operaciones de sync server-side
    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── 1. Buscar/crear usuario en public.users ───────────────────────────
    // B-42: columna correcta es "privy_user_id" (schema.sql línea 9)
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, email")
      .eq("privy_user_id", privy_user_id)
      .single();

    let userId: string;
    const isNew = !existingUser;

    if (existingUser) {
      // Usuario existe: actualizar email + updated_at
      // B-45: eliminado last_login — no existe en schema.sql
      await supabase
        .from("users")
        .update({ email, updated_at: new Date().toISOString() })
        .eq("id", existingUser.id);
      userId = existingUser.id;
    } else {
      // Usuario nuevo: crear en users + profile vacío
      // B-42: campo correcto es "privy_user_id"
      // B-43: onboarding_complete va en profiles, no aquí
      const { data: newUser, error: userError } = await supabase
        .from("users")
        .insert({ privy_user_id, email })
        .select("id")
        .single();

      if (userError) throw userError;

      // Perfil vacío — onboarding_complete = false por DEFAULT del schema
      await supabase.from("profiles").insert({ user_id: newUser!.id });

      userId = newUser!.id;
    }

    // ── 2. Leer onboarding_complete de profiles (B-43) ────────────────────
    // El campo está en profiles, NO en users (schema.sql línea 39)
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("user_id", userId)
      .single();

    const onboardingComplete = profile?.onboarding_complete ?? false;

    // ── 3. Asegurar que el usuario existe en auth.users con el MISMO UUID ─
    //
    // CRÍTICO para RLS: auth.uid() en las policies lee el `sub` del JWT de
    // Supabase Auth. Si creamos el auth user con el mismo UUID que public.users.id,
    // las policies `auth.uid() = user_id` funcionan sin ningún mapeo adicional.
    //
    // Usamos el userId (UUID de public.users) como email si no hay email real,
    // garantizando que siempre tengamos un email válido y único.
    const authEmail = email ?? `${userId}@privy.noemail`;

    const { data: authUserData } = await supabase.auth.admin.getUserById(
      userId
    );

    if (!authUserData?.user) {
      // Primera vez: crear auth user con el UUID exacto del public.users.id
      const { error: createError } = await supabase.auth.admin.createUser({
        id: userId, // ← MISMO UUID que public.users.id → auth.uid() retorna este valor
        email: authEmail,
        email_confirm: true, // Marcar email como confirmado — no requiere flujo de verificación
        user_metadata: { privy_user_id },
      });

      if (createError) {
        // No lanzamos error — el usuario existe en public.users aunque auth falle
        console.error(
          "[sync] auth.admin.createUser error:",
          createError.message
        );
      }
    } else {
      // Auth user existe — actualizar metadata si cambió (fire-and-forget, no crítico)
      supabase.auth.admin
        .updateUserById(userId, {
          email: email ?? undefined,
          user_metadata: { privy_user_id },
        })
        .catch((e: Error) =>
          console.warn("[sync] updateUserById failed:", e.message)
        );
    }

    // ── 4. Generar magic link token (Admin API — NO envía email) ──────────
    //
    // generateLink con type 'magiclink' genera un hashed_token que el cliente
    // puede usar para obtener una sesión real via supabase.auth.verifyOtp().
    // El Admin API NO envía ningún email — solo retorna el token para que
    // lo usemos directamente en el cliente.
    //
    // Este approach reemplaza el JWT minting manual (que requería SUPABASE_JWT_SECRET)
    // con el mecanismo oficial de Supabase Auth. (B-51 v2)
    const { data: linkData, error: linkError } =
      await supabase.auth.admin.generateLink({
        type: "magiclink",
        email: authEmail,
      });

    if (linkError || !linkData?.properties?.hashed_token) {
      // Degradar gracefully: retornar sin token.
      // La app funciona pero sin RLS para operaciones cliente-directo.
      console.warn(
        "[sync] generateLink failed — RLS no funcionará:",
        linkError?.message
      );
      return new Response(
        JSON.stringify({
          user_id: userId,
          onboarding_complete: onboardingComplete,
          created: isNew,
          otp_token_hash: null,
        }),
        { headers: corsHeaders }
      );
    }

    // Retornar el hashed_token al cliente para que llame verifyOtp()
    return new Response(
      JSON.stringify({
        user_id: userId,
        onboarding_complete: onboardingComplete,
        created: isNew,
        // otp_token_hash: cliente llama supabase.auth.verifyOtp({ token_hash, type: 'email' })
        // Esto genera una sesión real de Supabase → auth.uid() funciona → RLS resuelto
        otp_token_hash: linkData.properties.hashed_token,
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
