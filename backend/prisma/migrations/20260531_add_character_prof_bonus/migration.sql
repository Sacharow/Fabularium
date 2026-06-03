-- Migration: 20260531_add_character_prof_bonus
-- Adds profBonus integer column to Character

ALTER TABLE IF EXISTS "Character"
  ADD COLUMN IF NOT EXISTS "profBonus" INTEGER;
