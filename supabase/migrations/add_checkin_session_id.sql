-- Migration: B-72 — Add session_id idempotency key to checkins table
--
-- Purpose: Prevent duplicate check-in INSERTs regardless of client-side behavior.
-- A UUID is generated when the check-in flow STARTS (body.tsx) and passed through
-- to result.tsx. The UNIQUE constraint ensures the DB rejects any second INSERT
-- with the same session_id.
--
-- Run in: Supabase Dashboard → SQL Editor → New query → Paste → Run
-- Safe to run multiple times (IF NOT EXISTS / DO NOTHING pattern).

ALTER TABLE checkins
  ADD COLUMN IF NOT EXISTS session_id UUID;

-- Add unique constraint only if it doesn't already exist
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint
    WHERE conname = 'checkins_session_id_key'
  ) THEN
    ALTER TABLE checkins ADD CONSTRAINT checkins_session_id_key UNIQUE (session_id);
  END IF;
END $$;
