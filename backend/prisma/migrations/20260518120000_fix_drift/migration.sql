-- Manual migration to fix drift detected by Prisma
-- 1) Remove legacy npcId column from Mission
ALTER TABLE "Mission" DROP COLUMN IF EXISTS "npcId";

-- 2) Ensure Users.bio has a default and is NOT NULL
UPDATE "Users" SET "bio" = '' WHERE "bio" IS NULL;
ALTER TABLE "Users" ALTER COLUMN "bio" SET DEFAULT '';
ALTER TABLE "Users" ALTER COLUMN "bio" SET NOT NULL;
