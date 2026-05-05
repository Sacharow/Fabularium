/*
  Warnings:

  - You are about to drop the column `npcId` on the `Mission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Character" ADD COLUMN     "icon" TEXT,
ADD COLUMN     "image" TEXT;

-- AlterTable
ALTER TABLE "public"."Mission" DROP COLUMN "npcId";
