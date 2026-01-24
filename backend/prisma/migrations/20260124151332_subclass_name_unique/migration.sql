/*
  Warnings:

  - A unique constraint covering the columns `[name]` on the table `Subclass` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Subclass_name_key" ON "Subclass"("name");
