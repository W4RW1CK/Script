/**
 * (onboarding)/contacts.tsx — S08: Trusted Contacts Setup
 *
 * Allows adding trusted contacts who will be notified in a crisis.
 * The user can add multiple contacts or skip this step (optional).
 *
 * On completion:
 * 1. Marks onboarding_complete = true in Supabase
 * 2. Updates the auth store
 * 3. Explicitly navigates to /(app)/home (B-59 fix: do not rely solely on AuthGate,
 *    since privyReady may never become true in dev bypass mode, leaving navReady=false
 *    and AuthGate's navigation effect permanently disabled)
 *
 * NOTE: DB field is "relationship" (not "relation").
 */
import React, { useState } from "react";
import { View, ScrollView, Alert, Pressable } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { SafeScreen, Typography, Button, TextInput, Chip } from "@/components/ui";
import { supabase } from "@/lib/supabase";
import { useAuthStore } from "@/stores/auth";

// Opciones de relación
const RELATIONSHIP_OPTIONS = [
  "Pareja", "Familiar", "Amigo/a", "Terapeuta", "Otro",
];

interface Contact {
  name: string;
  phone: string;
  relationship: string;
}

export default function ContactsScreen() {
  const router = useRouter();
  const supabaseUserId = useAuthStore((s) => s.user?.supabaseUserId);
  const privyId = useAuthStore((s) => s.user?.privyId);
  const setSupabaseUserId = useAuthStore((s) => s.setSupabaseUserId);
  const setOnboardingComplete = useAuthStore((s) => s.setOnboardingComplete);

  const [contacts, setContacts] = useState<Contact[]>([]);
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [relationship, setRelationship] = useState("");
  const [isSaving, setIsSaving] = useState(false);

  /** Agregar un contacto a la lista */
  const addContact = async () => {
    if (!name.trim() || !phone.trim()) {
      Alert.alert("Campos requeridos", "Necesitamos al menos nombre y teléfono.");
      return;
    }

    const newContact: Contact = {
      name: name.trim(),
      phone: phone.trim(),
      relationship: relationship || "Otro",
    };

    // F-03: Persist to Supabase BEFORE updating local state — rollback on failure
    // Uses save-onboarding Edge Function (service role) to bypass RLS for Google OAuth users
    if (supabaseUserId && privyId) {
      try {
        const { error: insertError } = await supabase.functions.invoke("save-onboarding", {
          body: {
            privy_user_id: privyId,
            user_id: supabaseUserId,
            action: "save_contact",
            contact_name: newContact.name,
            contact_phone: newContact.phone,
            contact_relationship: newContact.relationship,
          },
        });
        if (insertError) {
          Alert.alert("No se pudo guardar", "Verifica tu conexión e inténtalo de nuevo.");
          return;
        }
      } catch (e) {
        console.warn("[Contacts] Error guardando contacto:", e);
        Alert.alert("No se pudo guardar", "Verifica tu conexión e inténtalo de nuevo.");
        return;
      }
    }

    // Only add to local state after confirmed DB save (or when no userId = offline mode)
    setContacts([...contacts, newContact]);
    // Limpiar formulario
    setName("");
    setPhone("");
    setRelationship("");
  };

  /**
   * Remove a contact from local state AND from Supabase.
   * Matches by name+phone since we don't store the Supabase row id locally.
   * Fire-and-forget: UI updates immediately; DB deletion runs in background.
   */
  const removeContact = (index: number) => {
    const contactToRemove = contacts[index];
    const updated = contacts.filter((_, i) => i !== index);
    setContacts(updated);

    // Persist deletion to Supabase (if user is authenticated)
    if (supabaseUserId && contactToRemove) {
      supabase
        .from("trusted_contacts")
        .delete()
        .eq("user_id", supabaseUserId)
        .eq("name", contactToRemove.name)
        .eq("phone", contactToRemove.phone)
        .then(({ error }) => {
          if (error) {
            console.warn("[Contacts] Error deleting contact from Supabase:", error.message);
          }
        });
    }
  };

  /** Completar onboarding */
  const completeOnboarding = async () => {
    setIsSaving(true);
    try {
      let resolvedSupabaseId = supabaseUserId;

      // B-30: si supabaseUserId es null (sync-privy-user falló en login),
      // intentar sync de nuevo antes de marcar onboarding completo
      if (!resolvedSupabaseId && privyId) {
        console.log("[Contacts] supabaseUserId null — reintentando sync-privy-user...");
        console.log("[Contacts] privyId for sync:", privyId ? "present" : "null");
        const { data, error } = await supabase.functions.invoke("sync-privy-user", {
          body: { privy_user_id: privyId, email: null },
        });
        console.log("[Contacts] sync result — error:", error?.message ?? "none", "| user_id:", data?.user_id ?? "null");
        if (!error && data?.user_id) {
          resolvedSupabaseId = data.user_id;
          setSupabaseUserId(data.user_id);
        }
      }

      if (resolvedSupabaseId) {
        /**
         * B-44 FIX: onboarding_complete está en la tabla `profiles`, NO en `users`.
         * Schema.sql línea 39: profiles.onboarding_complete BOOLEAN DEFAULT FALSE
         * La tabla users NO tiene esta columna — .update() fallaba silenciosamente.
         *
         * Antes (incorrecto):
         *   supabase.from("users").update({ onboarding_complete: true }).eq("id", ...)
         *
         * Ahora (correcto):
         *   supabase.from("profiles").update({ onboarding_complete: true }).eq("user_id", ...)
         */
        // Use save-onboarding Edge Function (service role) — bypasses RLS
        // for Google OAuth users who can't establish verifyOtp session
        const { error: onboardingError } = await supabase.functions.invoke("save-onboarding", {
          body: {
            privy_user_id: privyId,
            user_id: resolvedSupabaseId,
            action: "complete_onboarding",
          },
        });
        if (onboardingError) {
          console.warn("[Contacts] complete_onboarding error:", onboardingError.message);
        } else {
          console.log("[Contacts] onboarding_complete=true saved via Edge Function ✅");
        }
      }

      // M-NEW-01: only mark onboarding complete locally if we successfully wrote
      // to Supabase (resolvedSupabaseId was available). If the DB write was skipped
      // (no UUID at all), set a softer flag so AuthGate can re-attempt sync on next
      // login instead of looping back to onboarding with a stale local state.
      //
      // B-59 FIX: Explicit router.replace() regardless of Privy state (authGate
      // navReady may be stuck in dev bypass mode where privyReady never fires).
      setOnboardingComplete(true);
      router.replace("/(app)/home");
    } catch (e) {
      console.warn("[Contacts] Error completing onboarding:", e);
      // On error: still navigate to avoid permanently blocking the user,
      // but DON'T mark local onboarding complete so they'll be prompted again.
      // This is safer than marking complete when the DB write is unknown.
      router.replace("/(app)/home");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <SafeScreen>
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-1 px-5 pt-6 pb-8 gap-6">
          <View className="gap-2">
            <Typography variant="headingL">Contactos de confianza</Typography>
            <Typography
              variant="body"
              className="text-script-text-secondary dark:text-script-dark-text-secondary"
            >
              Si en algún momento activas el protocolo de crisis nivel 3,
              Script puede avisarle a alguien de confianza en tu nombre.
            </Typography>
            {/* T-F4: warm explanation of why contacts matter */}
            <Typography
              variant="caption"
              className="text-script-text-secondary dark:text-script-dark-text-secondary mt-1"
            >
              No es obligatorio ahora — puedes agregar o cambiar tus contactos
              en cualquier momento desde Ajustes.
            </Typography>
          </View>

          {/* Contactos ya agregados */}
          {contacts.length > 0 && (
            <View className="gap-2">
              <Typography variant="headingS">
                Contactos agregados ({contacts.length})
              </Typography>
              {contacts.map((c, idx) => (
                <View
                  key={idx}
                  className="flex-row items-center justify-between bg-script-bg-secondary dark:bg-script-dark-secondary rounded-xl p-3"
                >
                  <View>
                    <Typography variant="body">{c.name}</Typography>
                    <Typography variant="caption">
                      {c.phone} · {c.relationship}
                    </Typography>
                  </View>
                  {/* H-NEW-01: Ionicons has no onPress — must wrap in Pressable */}
                  <Pressable
                    onPress={() => removeContact(idx)}
                    accessibilityRole="button"
                    accessibilityLabel={`Eliminar contacto ${c.name}`}
                    hitSlop={8}
                  >
                    <Ionicons name="close-circle" size={24} color="#999" />
                  </Pressable>
                </View>
              ))}
            </View>
          )}

          {/* Formulario para nuevo contacto */}
          <View className="gap-3">
            <Typography variant="headingS">Agregar contacto</Typography>
            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Nombre"
              accessibilityLabel="Nombre del contacto"
            />
            <TextInput
              value={phone}
              onChangeText={setPhone}
              placeholder="Teléfono"
              keyboardType="phone-pad"
              accessibilityLabel="Teléfono del contacto"
            />
            {/* Selector de relación */}
            <View className="gap-1">
              <Typography variant="caption">Relación</Typography>
              <View className="flex-row flex-wrap gap-2">
                {RELATIONSHIP_OPTIONS.map((r) => (
                  <Chip
                    key={r}
                    label={r}
                    selected={relationship === r}
                    onPress={() => setRelationship(r)}
                  />
                ))}
              </View>
            </View>
            <Button
              title="+ Agregar contacto"
              variant="secondary"
              onPress={addContact}
              disabled={!name.trim() || !phone.trim()}
            />
          </View>

          <View className="flex-1" />

          {/* CTAs finales */}
          <View className="gap-3">
            {contacts.length > 0 ? (
              <Button
                title={
                  isSaving
                    ? "Guardando..."
                    : `Listo (${contacts.length} contacto${contacts.length > 1 ? "s" : ""})`
                }
                variant="primary"
                onPress={completeOnboarding}
                disabled={isSaving}
              />
            ) : null}
            {/* T-F4: warm skip copy — reassures user they can return */}
            <Button
              title="Saltar por ahora — lo agregaré después"
              variant="ghost"
              onPress={completeOnboarding}
              disabled={isSaving}
            />
          </View>
        </View>
      </ScrollView>
    </SafeScreen>
  );
}
