-- Add missing campaign photo column
ALTER TABLE "Campaign" ADD COLUMN "photo" TEXT;

-- Fix Mission.locationId constraint
-- Drop the existing foreign key constraint
ALTER TABLE "Mission" DROP CONSTRAINT IF EXISTS "Mission_locationId_fkey";

-- Make locationId nullable (if not already)
ALTER TABLE "Mission" ALTER COLUMN "locationId" DROP NOT NULL;

-- Re-add the foreign key constraint
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE SET NULL ON UPDATE CASCADE;
