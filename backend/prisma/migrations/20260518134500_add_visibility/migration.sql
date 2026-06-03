-- Migration: 20260518134500_add_visibility
-- Adds owner-controlled visibility toggles for campaign locations, missions, and NPCs.

ALTER TABLE IF EXISTS "Location"
  ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT TRUE;

ALTER TABLE IF EXISTS "Mission"
  ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT TRUE;

ALTER TABLE IF EXISTS "NPC"
  ADD COLUMN IF NOT EXISTS "isPublic" BOOLEAN DEFAULT TRUE;
