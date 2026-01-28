/*
  Warnings:

  - You are about to drop the column `size` on the `Character` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Character" DROP COLUMN "size";

-- AlterTable
ALTER TABLE "Race" ADD COLUMN     "size" "Size";
