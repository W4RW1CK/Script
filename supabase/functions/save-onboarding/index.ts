/**
 * save-onboarding — Saves profile and trusted contacts using service role key.
 *
 * WHY: Direct DB writes from client require a valid Supabase RLS session
 * (auth.uid() = user_id). For users authenticated via Google OAuth through Privy,
 * verifyOtp (magic link) fails — so RLS is never established. This Edge Function
 * uses service role to bypass RLS, validating the request server-side via
 * privy_user_id + user_id match in public.users.
 *
 * Handles: profile upsert, trusted_contacts insert, onboarding_complete flag.
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
    const body = await req.json();
    const {
      privy_user_id,
      user_id,
      action, // "save_profile" | "save_contact" | "complete_onboarding"
      // Profile fields
      display_name,
      sensory_sensitivities,
      interests,
      communication_style,
      // Contact fields
      contact_name,
      contact_phone,
      contact_relationship,
    } = body;

    if (!privy_user_id || !user_id || !action) {
      return new Response(
        JSON.stringify({ error: "privy_user_id, user_id, and action are required" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!,
    );

    // Security: verify privy_user_id + user_id match in public.users
    const { data: userRow, error: userError } = await supabase
      .from("users")
      .select("id")
      .eq("id", user_id)
      .eq("privy_user_id", privy_user_id)
      .maybeSingle();

    if (userError || !userRow) {
      console.warn("[save-onboarding] User validation failed:", userError?.message ?? "no match");
      return new Response(
        JSON.stringify({ error: "User validation failed" }),
        { status: 403, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    // ── ACTION: save_profile ──────────────────────────────────────────────
    if (action === "save_profile") {
      // Column names must match profiles schema exactly:
      //   sensitivities (JSONB)  NOT sensory_sensitivities
      //   interests (text[])
      //   existing_tools (text[])
      //   display_name lives in users table, NOT profiles
      const profilePayload: Record<string, unknown> = { user_id };
      if (sensory_sensitivities !== undefined) profilePayload.sensitivities = sensory_sensitivities;
      if (interests !== undefined) profilePayload.interests = interests;
      if (communication_style !== undefined) profilePayload.existing_tools = communication_style;

      const { error } = await supabase
        .from("profiles")
        .upsert(profilePayload, { onConflict: "user_id" });

      if (error) {
        console.warn("[save-onboarding] profile upsert error:", error.message);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log("[save-onboarding] Profile saved for user:", user_id);
    }

    // ── ACTION: save_contact ──────────────────────────────────────────────
    if (action === "save_contact") {
      if (!contact_name || !contact_phone) {
        return new Response(
          JSON.stringify({ error: "contact_name and contact_phone are required" }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }

      const { error } = await supabase.from("trusted_contacts").insert({
        user_id,
        name: contact_name,
        phone: contact_phone,
        relationship: contact_relationship ?? "Otro",
        is_active: true,
      });

      if (error) {
        console.warn("[save-onboarding] contact insert error:", error.message);
        return new Response(
          JSON.stringify({ error: error.message }),
          { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      console.log("[save-onboarding] Contact saved for user:", user_id);
    }

    // ── ACTION: complete_onboarding ───────────────────────────────────────
    if (action === "complete_onboarding") {
      const { data: existing } = await supabase
        .from("profiles")
        .select("user_id")
        .eq("user_id", user_id)
        .maybeSingle();

      if (existing) {
        await supabase
          .from("profiles")
          .update({ onboarding_complete: true })
          .eq("user_id", user_id);
      } else {
        await supabase
          .from("profiles")
          .upsert({ user_id, onboarding_complete: true }, { onConflict: "user_id" });
      }
      console.log("[save-onboarding] onboarding_complete=true for user:", user_id);
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (e) {
    console.error("[save-onboarding] Unexpected error:", e);
    return new Response(
      JSON.stringify({ error: "Internal error" }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});
