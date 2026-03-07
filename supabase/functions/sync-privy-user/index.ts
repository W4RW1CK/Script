/**
 * sync-privy-user — Supabase Edge Function
 *
 * Sincroniza un usuario de Privy con la tabla `users` de Supabase.
 * Se llama después de cada login exitoso desde la app.
 *
 * Lógica:
 * 1. Recibe privy_user_id + email
 * 2. Busca si ya existe un usuario con ese privy_user_id (nombre correcto en schema)
 * 3. Si existe: actualiza email + updated_at, lee onboarding_complete de `profiles`
 * 4. Si no existe: crea registro en `users` + perfil vacío en `profiles`
 *
 * Schema (schema.sql):
 *   users.privy_user_id   VARCHAR(255) UNIQUE — campo de lookup (B-42: antes era "privy_id")
 *   profiles.onboarding_complete BOOLEAN      — NO está en users (B-43: antes leía de users)
 *   users: sin campo last_login                — (B-45: antes intentaba escribir last_login)
 *
 * Deploy: `supabase functions deploy sync-privy-user`
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const supabaseUrl     = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

// CORS headers — necesarios para peticiones desde web (y buena práctica general)
const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  // M-02: responder a preflight CORS
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

    // Service role key para bypass RLS — solo en Edge Functions server-side
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // ── Buscar usuario existente ──────────────────────────────────────────
    // B-42 FIX: columna es "privy_user_id" en schema, NO "privy_id"
    const { data: existingUser } = await supabase
      .from("users")
      .select("id")
      .eq("privy_user_id", privy_user_id)   // B-42: corregido de "privy_id"
      .single();

    if (existingUser) {
      // ── Usuario existe: actualizar email + timestamp ────────────────────
      // B-45 FIX: eliminado "last_login" — no existe en schema.sql users table
      // Solo actualizamos email y updated_at (campo que SÍ existe)
      await supabase
        .from("users")
        .update({
          email,
          updated_at: new Date().toISOString(), // campo correcto del schema
        })
        .eq("id", existingUser.id);

      // B-43 FIX: onboarding_complete está en `profiles`, NO en `users`
      // Leer de profiles con el user_id que tenemos
      const { data: profile } = await supabase
        .from("profiles")
        .select("onboarding_complete")
        .eq("user_id", existingUser.id)
        .single();

      return new Response(
        JSON.stringify({
          user_id: existingUser.id,
          onboarding_complete: profile?.onboarding_complete ?? false,
          created: false,
        }),
        { headers: corsHeaders }
      );
    }

    // ── Usuario nuevo: crear en users ─────────────────────────────────────
    // B-42 FIX: campo es "privy_user_id" en schema, NO "privy_id"
    // B-43 FIX: eliminado "onboarding_complete" del INSERT de users — no existe ahí
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        privy_user_id,   // B-42: nombre correcto del campo
        email,
        // onboarding_complete NO va aquí — solo existe en profiles (B-43)
      })
      .select("id")
      .single();

    if (userError) {
      throw userError;
    }

    // Crear perfil vacío asociado — onboarding_complete=false por default del schema
    await supabase.from("profiles").insert({
      user_id: newUser.id,
      // onboarding_complete = false por DEFAULT del schema — no hace falta explicitarlo
    });

    return new Response(
      JSON.stringify({
        user_id: newUser.id,
        onboarding_complete: false,
        created: true,
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
