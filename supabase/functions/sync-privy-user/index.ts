/**
 * sync-privy-user — Supabase Edge Function
 *
 * Sincroniza un usuario de Privy con la tabla `users` de Supabase.
 * Se llama después de cada login exitoso desde la app.
 *
 * Lógica:
 * 1. Recibe privy_user_id + email
 * 2. Busca si ya existe un usuario con ese privy_id
 * 3. Si existe: actualiza email y last_login, retorna user_id + onboarding_complete
 * 4. Si no existe: crea nuevo registro en users + profiles
 *
 * La tabla `users` tiene privy_id como campo único.
 * La tabla `profiles` se crea con valores por defecto para el nuevo usuario.
 *
 * Deploy: `supabase functions deploy sync-privy-user`
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.97.0";

const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
const supabaseServiceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

serve(async (req) => {
  try {
    const { privy_user_id, email } = await req.json();

    if (!privy_user_id) {
      return new Response(
        JSON.stringify({ error: "privy_user_id is required" }),
        { status: 400, headers: { "Content-Type": "application/json" } }
      );
    }

    // Usar service role key para bypass RLS (esto es server-side)
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Buscar usuario existente por privy_id
    const { data: existingUser } = await supabase
      .from("users")
      .select("id, onboarding_complete")
      .eq("privy_id", privy_user_id)
      .single();

    if (existingUser) {
      // Usuario existe — actualizar email y timestamp
      await supabase
        .from("users")
        .update({ email, last_login: new Date().toISOString() })
        .eq("id", existingUser.id);

      return new Response(
        JSON.stringify({
          user_id: existingUser.id,
          onboarding_complete: existingUser.onboarding_complete ?? false,
          created: false,
        }),
        { headers: { "Content-Type": "application/json" } }
      );
    }

    // Usuario nuevo — crear en users
    const { data: newUser, error: userError } = await supabase
      .from("users")
      .insert({
        privy_id: privy_user_id,
        email,
        onboarding_complete: false,
      })
      .select("id")
      .single();

    if (userError) {
      throw userError;
    }

    // Crear perfil vacío asociado
    await supabase.from("profiles").insert({
      user_id: newUser.id,
    });

    return new Response(
      JSON.stringify({
        user_id: newUser.id,
        onboarding_complete: false,
        created: true,
      }),
      { headers: { "Content-Type": "application/json" } }
    );
  } catch (error) {
    console.error("[sync-privy-user] Error:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
});
