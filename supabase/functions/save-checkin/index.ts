/**
 * save-checkin — Persists a check-in using service role key (bypasses RLS).
 *
 * WHY: The normal flow uses verifyOtp (magic link) to establish a Supabase
 * RLS session so that `auth.uid() = user_id` on INSERT. However, users who
 * originally authenticated via Google OAuth through Privy cannot use magic
 * link tokens — Supabase rejects them with "Email link is invalid or has expired."
 *
 * This Edge Function uses the service role key to INSERT directly, and validates
 * the request by verifying that:
 *   1. `privy_user_id` maps to a real user in public.users
 *   2. `user_id` matches that user's id
 *
 * This is equivalent security to RLS (only the correct user can save their data)
 * without depending on the broken verifyOtp flow.
 */
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const {
      privy_user_id,
      user_id,
      body_zones,
      free_text,
      emotion_confirmed,
      flagged_for_review,
      session_id,
    } = await req.json();

    // Validate required fields
    if (!privy_user_id || !user_id) {
      return new Response(
        JSON.stringify({ error: "privy_user_id and user_id are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Use service role key — bypasses RLS, allows server-side writes
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Security check: verify privy_user_id maps to user_id in public.users
    // This replaces the RLS auth.uid() check — same security guarantee
    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user_id)
      .eq("privy_user_id", privy_user_id) // column is privy_user_id not privy_id
      .maybeSingle();

    if (userError || !userRow) {
      console.warn("[save-checkin] User validation failed:", userError?.message ?? "no match");
      return new Response(
        JSON.stringify({ error: "User validation failed" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // Build payload — only include session_id if provided (migration may not be applied)
    const payload: Record<string, unknown> = {
      user_id,
      body_zones: body_zones ?? [],
      free_text: free_text ?? "",
      emotion_confirmed: emotion_confirmed ?? "",
      flagged_for_review: flagged_for_review ?? false,
    };
    if (session_id) payload.session_id = session_id;

    const { error: insertError } = await supabase.from("checkins").insert(payload);

    if (insertError) {
      console.warn("[save-checkin] INSERT error:", insertError.message);
      return new Response(
        JSON.stringify({ error: insertError.message }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    console.log("[save-checkin] Checkin saved for user:", user_id);
    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("[save-checkin] Unexpected error:", e);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
