-- CreateTable
CREATE TABLE "MissionLocation" (
    "MissionId" TEXT NOT NULL,
    "LocationId" TEXT NOT NULL,

    CONSTRAINT "MissionLocation_pkey" PRIMARY KEY ("MissionId","LocationId")
);

-- AddForeignKey
ALTER TABLE "MissionLocation" ADD CONSTRAINT "MissionLocation_MissionId_fkey" FOREIGN KEY ("MissionId") REFERENCES "Mission"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "MissionLocation" ADD CONSTRAINT "MissionLocation_LocationId_fkey" FOREIGN KEY ("LocationId") REFERENCES "Location"("id") ON DELETE RESTRICT ON UPDATE CASCADE;