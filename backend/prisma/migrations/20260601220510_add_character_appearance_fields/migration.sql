/*
  Warnings:

  - You are about to drop the column `locationId` on the `Mission` table. All the data in the column will be lost.
  - Made the column `currentSession` on table `Campaign` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPublic` on table `Location` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPublic` on table `Mission` required. This step will fail if there are existing NULL values in that column.
  - Made the column `isPublic` on table `NPC` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "Mission" DROP CONSTRAINT "Mission_locationId_fkey";

-- DropForeignKey
ALTER TABLE "MissionLocation" DROP CONSTRAINT "MissionLocation_LocationId_fkey";

-- DropForeignKey
ALTER TABLE "MissionLocation" DROP CONSTRAINT "MissionLocation_MissionId_fkey";

-- DropForeignKey
ALTER TABLE "MissionNpc" DROP CONSTRAINT "MissionNpc_MissionId_fkey";

-- DropForeignKey
ALTER TABLE "MissionNpc" DROP CONSTRAINT "MissionNpc_npcId_fkey";

-- AlterTable
ALTER TABLE "Campaign" ALTER COLUMN "currentSession" SET NOT NULL;

-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "age" INTEGER,
ADD COLUMN     "eyeColor" TEXT,
ADD COLUMN     "hairColor" TEXT,
ADD COLUMN     "height" TEXT,
ADD COLUMN     "skinColor" TEXT,
ADD COLUMN     "weight" DOUBLE PRECISION;

-- AlterTable
ALTER TABLE "CharacterStats" ADD COLUMN     "chaModifier" INTEGER,
ADD COLUMN     "conModifier" INTEGER,
ADD COLUMN     "dexModifier" INTEGER,
ADD COLUMN     "intModifier" INTEGER,
ADD COLUMN     "strModifier" INTEGER,
ADD COLUMN     "wisModifier" INTEGER;

-- AlterTable
ALTER TABLE "Location" ALTER COLUMN "isPublic" SET NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false;

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "locationId",
ALTER COLUMN "isPublic" SET NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false;

-- AlterTable
ALTER TABLE "NPC" ALTER COLUMN "isPublic" SET NOT NULL,
ALTER COLUMN "isPublic" SET DEFAULT false;

-- AddForeignKey
ALTER TABLE "MissionNpc" ADD CONSTRAINT "MissionNpc_MissionId_fkey" FOREIGN KEY ("MissionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionNpc" ADD CONSTRAINT "MissionNpc_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "NPC"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionLocation" ADD CONSTRAINT "MissionLocation_MissionId_fkey" FOREIGN KEY ("MissionId") REFERENCES "Mission"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionLocation" ADD CONSTRAINT "MissionLocation_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;
