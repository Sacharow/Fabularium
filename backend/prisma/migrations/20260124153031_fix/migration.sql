/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Feat` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[name]` on the table `RaceAbility` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Feat_name_key" ON "Feat"("name");

-- CreateIndex
CREATE UNIQUE INDEX "RaceAbility_name_key" ON "RaceAbility"("name");
