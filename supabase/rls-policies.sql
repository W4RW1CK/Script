-- =============================================================
-- SCRIPT — Row Level Security Policies
-- Ejecutar DESPUÉS de schema.sql
-- =============================================================

-- users
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
CREATE POLICY "users_own_data" ON users
  FOR ALL USING (auth.uid() = id)
  WITH CHECK (auth.uid() = id);

-- profiles
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
CREATE POLICY "profiles_own_data" ON profiles
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- checkins
ALTER TABLE checkins ENABLE ROW LEVEL SECURITY;
CREATE POLICY "checkins_own_data" ON checkins
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);
CREATE POLICY "checkins_therapist_view" ON checkins
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM therapist_patients
      WHERE therapist_id = auth.uid()
      AND patient_id = checkins.user_id
      AND can_see_checkins = TRUE
      AND status = 'active'
      AND (share_data_until IS NULL OR share_data_until > NOW())
    )
  );

-- emotional_dictionary
ALTER TABLE emotional_dictionary ENABLE ROW LEVEL SECURITY;
CREATE POLICY "dictionary_own_data" ON emotional_dictionary
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- scripts
ALTER TABLE scripts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "scripts_predefined_read" ON scripts
  FOR SELECT USING (is_predefined = TRUE);
CREATE POLICY "scripts_own_data" ON scripts
  FOR ALL USING (auth.uid() = owner_user_id)
  WITH CHECK (auth.uid() = owner_user_id);
CREATE POLICY "scripts_therapist_view" ON scripts
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM therapist_patients
      WHERE therapist_id = auth.uid()
      AND patient_id = scripts.owner_user_id
      AND can_see_scripts = TRUE
      AND status = 'active'
      AND (share_data_until IS NULL OR share_data_until > NOW())
    )
  );

-- script_executions
ALTER TABLE script_executions ENABLE ROW LEVEL SECURITY;
CREATE POLICY "executions_own_data" ON script_executions
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- trusted_contacts
ALTER TABLE trusted_contacts ENABLE ROW LEVEL SECURITY;
CREATE POLICY "contacts_own_data" ON trusted_contacts
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- crisis_events
ALTER TABLE crisis_events ENABLE ROW LEVEL SECURITY;
CREATE POLICY "crisis_own_data" ON crisis_events
  FOR ALL USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- therapist_patients
ALTER TABLE therapist_patients ENABLE ROW LEVEL SECURITY;
CREATE POLICY "tp_therapist_view" ON therapist_patients
  FOR SELECT USING (auth.uid() = therapist_id OR auth.uid() = patient_id);
CREATE POLICY "tp_patient_manage" ON therapist_patients
  FOR ALL USING (auth.uid() = patient_id)
  WITH CHECK (auth.uid() = patient_id);
