-- Migration: 20260510120000_add_user_bio
-- Adds bio column to Users table (already applied on DB)

ALTER TABLE IF EXISTS "Users" ADD COLUMN IF NOT EXISTS "bio" TEXT;
