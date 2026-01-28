/*
  Warnings:

  - You are about to drop the column `size` on the `Race` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "CharacterCombatStats" ADD COLUMN     "size" "Size";

-- AlterTable
ALTER TABLE "Race" DROP COLUMN "size";
