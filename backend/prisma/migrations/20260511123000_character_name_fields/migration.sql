-- Manual migration: convert FK id fields to simple string name fields on Character

-- 1) Add new string columns (nullable)
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "race" text;
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "class" text;
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "subrace" text;
ALTER TABLE "Character" ADD COLUMN IF NOT EXISTS "subclass" text;

-- 2) Populate new columns from referenced tables where possible
UPDATE "Character" SET "race" = r.name FROM "Race" r WHERE "Character"."raceId" = r.id;
UPDATE "Character" SET "subrace" = sr.name FROM "SubRace" sr WHERE "Character"."subraceId" = sr.id;
UPDATE "Character" SET "class" = c.name FROM "Class" c WHERE "Character"."classId" = c.id;
UPDATE "Character" SET "subclass" = sc.name FROM "Subclass" sc WHERE "Character"."subclassId" = sc.id;

-- 3) Drop FK id columns (and any constraints) — CASCADE to remove their FK constraints
ALTER TABLE "Character" DROP COLUMN IF EXISTS "raceId" CASCADE;
ALTER TABLE "Character" DROP COLUMN IF EXISTS "subraceId" CASCADE;
ALTER TABLE "Character" DROP COLUMN IF EXISTS "classId" CASCADE;
ALTER TABLE "Character" DROP COLUMN IF EXISTS "subclassId" CASCADE;

-- 4) (Optional) Trim whitespace on newly populated name fields
UPDATE "Character" SET "race" = NULLIF(trim(both ' ' from "race"), '') WHERE "race" IS NOT NULL;
UPDATE "Character" SET "subrace" = NULLIF(trim(both ' ' from "subrace"), '') WHERE "subrace" IS NOT NULL;
UPDATE "Character" SET "class" = NULLIF(trim(both ' ' from "class"), '') WHERE "class" IS NOT NULL;
UPDATE "Character" SET "subclass" = NULLIF(trim(both ' ' from "subclass"), '') WHERE "subclass" IS NOT NULL;
