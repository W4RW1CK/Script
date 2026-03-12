/**
 * sync-privy-user — Supabase Edge Function
 *
 * Syncs a Privy user with the Supabase `users` table and generates a
 * Supabase Auth session so that RLS policies work for client-side queries.
 *
 * Flow:
 * 1. Receive privy_user_id + email from client
 * 2. Upsert user in public.users (privy_user_id → UUID)
 * 3. Upsert profile in public.profiles
 * 4. Create auth.users entry if missing (same UUID as public.users.id)
 * 5. Generate magic link token for Supabase session
 * 6. Return { user_id, onboarding_complete, otp_token_hash }
 *
 * Auto-injected env vars (Supabase provides these automatically):
 *   SUPABASE_URL              — project URL
 *   SUPABASE_SERVICE_ROLE_KEY — service role key (bypasses RLS)
 */

import { serve } from "https://deno.land/std@0.177.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.45.0";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
  "Content-Type": "application/json",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response("ok", { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { privy_user_id, email } = body;

    if (!privy_user_id) {
      return new Response(
        JSON.stringify({ error: "privy_user_id is required" }),
        { status: 400, headers: corsHeaders }
      );
    }

    console.log("[sync] Starting sync for privy_user_id:", privy_user_id.slice(0, 20) + "...");

    const supabaseUrl = Deno.env.get("SUPABASE_URL")!;
    const serviceKey = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!;

    const supabase = createClient(supabaseUrl, serviceKey, {
      auth: { persistSession: false, autoRefreshToken: false },
    });

    // ── 1. Find or create user in public.users ────────────────────────────
    let userId: string;
    let isNew = false;

    // Try to find existing user
    const { data: existingUser, error: findError } = await supabase
      .from("users")
      .select("id")
      .eq("privy_user_id", privy_user_id)
      .maybeSingle(); // maybeSingle returns null (not error) when no row found

    if (findError) {
      console.error("[sync] Error finding user:", findError.message);
      throw new Error("Failed to query users table: " + findError.message);
    }

    if (existingUser) {
      userId = existingUser.id;
      console.log("[sync] Found existing user:", userId);

      // Update email if provided
      if (email) {
        await supabase
          .from("users")
          .update({ email, updated_at: new Date().toISOString() })
          .eq("id", userId);
      }
    } else {
      // Create new user
      console.log("[sync] Creating new user...");
      isNew = true;

      const { data: newUser, error: insertError } = await supabase
        .from("users")
        .insert({ privy_user_id, email: email ?? null })
        .select("id")
        .single();

      if (insertError) {
        // Could be a race condition — try to find again
        console.warn("[sync] Insert failed, retrying find:", insertError.message);
        const { data: retryUser } = await supabase
          .from("users")
          .select("id")
          .eq("privy_user_id", privy_user_id)
          .maybeSingle();

        if (!retryUser) {
          throw new Error("Failed to create user: " + insertError.message);
        }
        userId = retryUser.id;
        isNew = false;
      } else {
        userId = newUser!.id;
        console.log("[sync] Created new user:", userId);
      }
    }

    // ── 2. Upsert profile ─────────────────────────────────────────────────
    // Use upsert to avoid errors if profile already exists
    await supabase
      .from("profiles")
      .upsert({ user_id: userId }, { onConflict: "user_id", ignoreDuplicates: true });

    // ── 3. Read onboarding_complete ───────────────────────────────────────
    const { data: profile } = await supabase
      .from("profiles")
      .select("onboarding_complete")
      .eq("user_id", userId)
      .maybeSingle();

    const onboardingComplete = profile?.onboarding_complete ?? false;
    console.log("[sync] onboarding_complete:", onboardingComplete);

    // ── 4. Ensure auth.users entry exists ─────────────────────────────────
    // ALWAYS use fake UUID-based email for auth operations — never the real email.
    // If the real email exists in auth.users under a different UUID (previous test sessions),
    // generateLink returns a token for that UUID → auth.uid() ≠ public.users.id → RLS fails
    // silently (SELECT returns 0 rows, no error). Fake email is guaranteed unique per user.
    const authEmail = `${userId}@privy.script.app`;
    let otpTokenHash: string | null = null;

    try {
      // ── Check if auth user exists by UUID ─────────────────────────────
      const { data: authUserData } = await supabase.auth.admin.getUserById(userId);

      // B-66 v3: If auth user exists but UUID doesn't match public.users.id,
      // delete and recreate. This catches stale auth entries created before the
      // fake-email fix (B-66) or created by a previous generateLink call that
      // auto-created an auth user with a different UUID.
      const existingAuthUser = authUserData?.user;

      if (existingAuthUser && existingAuthUser.id !== userId) {
        // Auth user found by UUID but it's the wrong UUID — should not happen,
        // but handle defensively: delete and recreate below.
        console.warn("[sync] Auth user UUID mismatch via getUserById:", existingAuthUser.id, "≠", userId, "— deleting");
        await supabase.auth.admin.deleteUser(existingAuthUser.id);
      }

      if (!existingAuthUser || existingAuthUser.id !== userId) {
        // Auth user doesn't exist with correct UUID — check if authEmail is
        // already taken by a different auth user (stale entry from before B-66).
        // Use generateLink first; if it returns wrong UUID, delete and recreate.
        // D-04: getUserByEmail — O(1) direct lookup instead of listUsers (downloads ALL users at scale)
        const { data: { user: byEmail } } = await supabase.auth.admin.getUserByEmail(authEmail);


        if (byEmail && byEmail.id !== userId) {
          console.warn("[sync] UUID mismatch via email lookup — deleting stale auth user:", byEmail.id);
          await supabase.auth.admin.deleteUser(byEmail.id);
        }

        console.log("[sync] Creating auth user with id:", userId);
        const { data: createdAuthUser, error: createError } = await supabase.auth.admin.createUser({
          id: userId,
          email: authEmail,
          email_confirm: true,
          user_metadata: { privy_user_id },
        });

        if (createError) {
          // ROOT CAUSE FIX: if createUser fails, DO NOT call generateLink.
          // generateLink auto-creates a new auth user with a RANDOM UUID when
          // no user exists for that email — producing a new UUID mismatch and
          // breaking RLS silently on every subsequent login.
          console.error("[sync] auth.admin.createUser FAILED — aborting to prevent UUID mismatch:", createError.message);
          throw new Error(`createUser failed: ${createError.message}`);
        }

        // Verify the created user has the correct UUID before proceeding
        if (createdAuthUser?.user?.id && createdAuthUser.user.id !== userId) {
          console.error("[sync] createUser returned wrong UUID:", createdAuthUser.user.id, "≠", userId);
          throw new Error(`createUser UUID mismatch: got ${createdAuthUser.user.id}, expected ${userId}`);
        }

        console.log("[sync] Auth user created with correct UUID:", userId);
      }

      // ── 5. Generate magic link token ──────────────────────────────────
      // At this point auth user with id=userId MUST exist — verified above.
      // generateLink will find the user by email and return a token for userId.
      const { data: linkData, error: linkError } =
        await supabase.auth.admin.generateLink({
          type: "magiclink",
          email: authEmail,
        });

      if (linkError) {
        console.warn("[sync] generateLink error:", linkError.message);
      } else {
        // Final safety check: verify the token is for the correct user.
        const returnedUserId = (linkData as any)?.user?.id;
        if (returnedUserId && returnedUserId !== userId) {
          // This should never happen after the createUser fix above,
          // but log loudly so we can diagnose if it somehow occurs.
          console.error("[sync] generateLink still returned wrong UUID:", returnedUserId, "≠", userId, "— RLS WILL FAIL");
          otpTokenHash = null;
        } else {
          otpTokenHash = linkData?.properties?.hashed_token ?? null;
          console.log("[sync] Token generated for correct UUID:", userId);
        }
      }
    } catch (authError) {
      // Auth operations failed — app still works but RLS may not
      console.warn("[sync] Auth admin operations failed:", (authError as Error).message);
    }

    console.log("[sync] Done. user_id:", userId, "otp:", otpTokenHash ? "yes" : "no");

    return new Response(
      JSON.stringify({
        user_id: userId,
        onboarding_complete: onboardingComplete,
        created: isNew,
        otp_token_hash: otpTokenHash,
      }),
      { headers: corsHeaders }
    );
  } catch (error) {
    console.error("[sync-privy-user] Fatal error:", (error as Error).message);
    return new Response(
      JSON.stringify({ error: (error as Error).message }),
      { status: 500, headers: corsHeaders }
    );
  }
});
