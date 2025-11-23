/*
  Warnings:

  - You are about to drop the column `password` on the `Users` table. All the data in the column will be lost.
  - Added the required column `passwordHashed` to the `Users` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Users" DROP COLUMN "password",
ADD COLUMN     "passwordHashed" TEXT NOT NULL;
