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
import { View, ScrollView, Alert } from "react-native";
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

    // Guardar en Supabase inmediatamente
    if (supabaseUserId) {
      try {
        await supabase.from("trusted_contacts").insert({
          user_id: supabaseUserId,
          name: newContact.name,
          phone: newContact.phone,
          relationship: newContact.relationship, // Campo correcto: "relationship"
          is_active: true,
        });
      } catch (e) {
        console.warn("[Contacts] Error guardando contacto:", e);
      }
    }

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
        const { error: updateError, count } = await supabase
          .from("profiles")
          .update({ onboarding_complete: true })
          .eq("user_id", resolvedSupabaseId)
          .select("user_id", { count: "exact", head: true });

        if (updateError) {
          console.warn("[Contacts] profiles update error:", updateError.message);
        } else if (count === 0) {
          // profiles row missing — upsert it
          console.log("[Contacts] profiles row missing — inserting with onboarding_complete=true");
          const { error: upsertError } = await supabase
            .from("profiles")
            .upsert({ user_id: resolvedSupabaseId, onboarding_complete: true });
          if (upsertError) console.warn("[Contacts] profiles upsert error:", upsertError.message);
        } else {
          console.log("[Contacts] onboarding_complete=true saved to Supabase ✅");
        }
      }

      // Update store, then navigate explicitly.
      // B-59 FIX: Do not rely solely on AuthGate for navigation here.
      // In dev bypass mode, privyReady never becomes true → navReady stays false →
      // AuthGate's navigation effect is permanently disabled → buttons appear to do nothing.
      // Explicit router.replace() works regardless of Privy state.
      setOnboardingComplete(true);
      router.replace("/(app)/home");
    } catch (e) {
      console.warn("[Contacts] Error completing onboarding:", e);
      // Still mark complete and navigate to avoid blocking the user
      setOnboardingComplete(true);
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
                  <Ionicons
                    name="close-circle"
                    size={24}
                    color="#999"
                    onPress={() => removeContact(idx)}
                  />
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
