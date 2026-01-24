/*
  Warnings:

  - Added the required column `locationId` to the `Mission` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "locationId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "Monster" (
    "id" TEXT NOT NULL,
    "apiId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "size" "Size",
    "type" TEXT NOT NULL,
    "subtype" TEXT,
    "alignment" TEXT,
    "armorClass" INTEGER,
    "hitPoints" INTEGER,
    "hitDice" TEXT,
    "speed" JSONB,
    "stats" JSONB,
    "actions" JSONB,
    "legendaryActions" JSONB,
    "specialAbilities" JSONB,
    "languages" TEXT,
    "challengeRating" DOUBLE PRECISION,
    "xp" INTEGER,
    "senses" JSONB,
    "damageImmunities" TEXT,
    "conditionImmunities" TEXT,
    "damageResistances" TEXT,
    "damageVulnerabilities" TEXT,
    "savingThrows" JSONB,
    "skills" JSONB,
    "reactions" JSONB,
    "environment" TEXT,
    "image" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Monster_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Monster_apiId_key" ON "Monster"("apiId");

-- AddForeignKey
ALTER TABLE "Mission" ADD CONSTRAINT "Mission_locationId_fkey" FOREIGN KEY ("locationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
