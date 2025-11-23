/*
  Warnings:

  - A unique constraint covering the columns `[providerId]` on the table `Users` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Users" ADD COLUMN     "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "provider" TEXT NOT NULL DEFAULT 'local',
ADD COLUMN     "providerId" TEXT,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "passwordHashed" DROP NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Users_providerId_key" ON "Users"("providerId");
