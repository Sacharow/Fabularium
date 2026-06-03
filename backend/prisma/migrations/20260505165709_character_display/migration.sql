-- Migration: 20260505165709_character_display
-- Adds display columns to Character table (already applied on DB)

ALTER TABLE IF EXISTS "Character" ADD COLUMN IF NOT EXISTS "icon" TEXT;
ALTER TABLE IF EXISTS "Character" ADD COLUMN IF NOT EXISTS "image" TEXT;
