-- AlterTable
ALTER TABLE "Character" ADD COLUMN     "bonds" TEXT,
ADD COLUMN     "flaws" TEXT,
ADD COLUMN     "ideals" TEXT,
ADD COLUMN     "personalityTraits" TEXT,
ADD COLUMN     "subraceId" TEXT;

-- CreateTable
CREATE TABLE "SubRace" (
    "id" TEXT NOT NULL,
    "parentRaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SubRace_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SubRaceAbility" (
    "id" TEXT NOT NULL,
    "subRaceId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,

    CONSTRAINT "SubRaceAbility_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "SubRace_name_key" ON "SubRace"("name");

-- AddForeignKey
ALTER TABLE "Character" ADD CONSTRAINT "Character_subraceId_fkey" FOREIGN KEY ("subraceId") REFERENCES "SubRace"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubRace" ADD CONSTRAINT "SubRace_parentRaceId_fkey" FOREIGN KEY ("parentRaceId") REFERENCES "Race"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SubRaceAbility" ADD CONSTRAINT "SubRaceAbility_subRaceId_fkey" FOREIGN KEY ("subRaceId") REFERENCES "SubRace"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
