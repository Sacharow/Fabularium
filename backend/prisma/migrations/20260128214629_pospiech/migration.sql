-- AlterTable
ALTER TABLE "Mission" ADD COLUMN     "npcId" TEXT;

-- CreateTable
CREATE TABLE "MissionNpc" (
    "MissionId" TEXT NOT NULL,
    "npcId" TEXT NOT NULL,

    CONSTRAINT "MissionNpc_pkey" PRIMARY KEY ("MissionId","npcId")
);

-- AddForeignKey
ALTER TABLE "MissionNpc" ADD CONSTRAINT "MissionNpc_MissionId_fkey" FOREIGN KEY ("MissionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionNpc" ADD CONSTRAINT "MissionNpc_npcId_fkey" FOREIGN KEY ("npcId") REFERENCES "NPC"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
