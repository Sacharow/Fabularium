/*
  Warnings:

  - Changed the type of `status` on the `Mission` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- CreateEnum
CREATE TYPE "MissionStatus" AS ENUM ('pending', 'in_progress', 'completed');

-- AlterTable
ALTER TABLE "Mission" DROP COLUMN "status",
ADD COLUMN     "status" "MissionStatus" NOT NULL;

-- CreateTable
CREATE TABLE "_CampaignContributors" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_CampaignContributors_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_LocationToNPC" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL,

    CONSTRAINT "_LocationToNPC_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_CampaignContributors_B_index" ON "_CampaignContributors"("B");

-- CreateIndex
CREATE INDEX "_LocationToNPC_B_index" ON "_LocationToNPC"("B");

-- AddForeignKey
ALTER TABLE "_CampaignContributors" ADD CONSTRAINT "_CampaignContributors_A_fkey" FOREIGN KEY ("A") REFERENCES "Campaign"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CampaignContributors" ADD CONSTRAINT "_CampaignContributors_B_fkey" FOREIGN KEY ("B") REFERENCES "Users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToNPC" ADD CONSTRAINT "_LocationToNPC_A_fkey" FOREIGN KEY ("A") REFERENCES "Location"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LocationToNPC" ADD CONSTRAINT "_LocationToNPC_B_fkey" FOREIGN KEY ("B") REFERENCES "NPC"("id") ON DELETE CASCADE ON UPDATE CASCADE;
