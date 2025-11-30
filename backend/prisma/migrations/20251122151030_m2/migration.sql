/*
  Warnings:

  - The primary key for the `Characters` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The primary key for the `Users` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the `Campaigns` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `alignment` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `armorPoints` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `background` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `class` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deathSavesFail` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `deathSavesSuccess` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `equipment` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hp` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `hpMax` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `initiative` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `inspiration` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `knownSpells` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magicBonus` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magicDC` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `magicSkill` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `money` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `passivePerception` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `preparedSpells` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `proficiencies` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `race` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `racialAbilities` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `saves` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `size` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `skills` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `speed` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `spellSlots` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `stats` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `xp` to the `Characters` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "public"."Campaigns" DROP CONSTRAINT "Campaigns_ownerId_fkey";

-- DropForeignKey
ALTER TABLE "public"."Characters" DROP CONSTRAINT "Characters_ownerId_fkey";

-- AlterTable
ALTER TABLE "public"."Characters" DROP CONSTRAINT "Characters_pkey",
ADD COLUMN     "alignment" TEXT NOT NULL,
ADD COLUMN     "armorPoints" INTEGER NOT NULL,
ADD COLUMN     "background" TEXT NOT NULL,
ADD COLUMN     "campaignId" TEXT,
ADD COLUMN     "class" TEXT NOT NULL,
ADD COLUMN     "deathSavesFail" INTEGER NOT NULL,
ADD COLUMN     "deathSavesSuccess" INTEGER NOT NULL,
ADD COLUMN     "equipment" JSONB NOT NULL,
ADD COLUMN     "hp" INTEGER NOT NULL,
ADD COLUMN     "hpMax" INTEGER NOT NULL,
ADD COLUMN     "initiative" INTEGER NOT NULL,
ADD COLUMN     "inspiration" BOOLEAN NOT NULL,
ADD COLUMN     "knownSpells" JSONB NOT NULL,
ADD COLUMN     "level" INTEGER NOT NULL,
ADD COLUMN     "magicBonus" INTEGER NOT NULL,
ADD COLUMN     "magicDC" INTEGER NOT NULL,
ADD COLUMN     "magicSkill" INTEGER NOT NULL,
ADD COLUMN     "money" INTEGER NOT NULL,
ADD COLUMN     "passivePerception" INTEGER NOT NULL,
ADD COLUMN     "preparedSpells" JSONB NOT NULL,
ADD COLUMN     "proficiencies" JSONB NOT NULL,
ADD COLUMN     "race" TEXT NOT NULL,
ADD COLUMN     "racialAbilities" JSONB NOT NULL,
ADD COLUMN     "saves" JSONB NOT NULL,
ADD COLUMN     "size" TEXT NOT NULL,
ADD COLUMN     "skills" JSONB NOT NULL,
ADD COLUMN     "speed" INTEGER NOT NULL,
ADD COLUMN     "spellSlots" JSONB NOT NULL,
ADD COLUMN     "stats" JSONB NOT NULL,
ADD COLUMN     "xp" INTEGER NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "ownerId" SET DATA TYPE TEXT,
ADD CONSTRAINT "Characters_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Characters_id_seq";

-- AlterTable
ALTER TABLE "public"."Users" DROP CONSTRAINT "Users_pkey",
ADD COLUMN     "name" TEXT NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "Users_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Users_id_seq";

-- DropTable
DROP TABLE "public"."Campaigns";

-- CreateTable
CREATE TABLE "public"."Campaign" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "joinCode" TEXT NOT NULL,
    "ownerId" TEXT NOT NULL,

    CONSTRAINT "Campaign_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Mission" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Mission_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Note" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "date" TIMESTAMP(3) NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Note_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Map" (
    "id" TEXT NOT NULL,
    "file" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Map_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Location" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "Location_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."NPC" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "campaignId" TEXT NOT NULL,

    CONSTRAINT "NPC_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Characters" ADD CONSTRAINT "Characters_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Characters" ADD CONSTRAINT "Characters_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Campaign" ADD CONSTRAINT "Campaign_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "public"."Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Mission" ADD CONSTRAINT "Mission_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Note" ADD CONSTRAINT "Note_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Map" ADD CONSTRAINT "Map_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."Location" ADD CONSTRAINT "Location_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."NPC" ADD CONSTRAINT "NPC_campaignId_fkey" FOREIGN KEY ("campaignId") REFERENCES "public"."Campaign"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
