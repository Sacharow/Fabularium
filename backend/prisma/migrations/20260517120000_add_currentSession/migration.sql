-- Migration: 20260517120000_add_currentSession
-- Adds currentSession integer column to Campaign

ALTER TABLE IF EXISTS "Campaign" ADD COLUMN IF NOT EXISTS "currentSession" INTEGER DEFAULT 0;
