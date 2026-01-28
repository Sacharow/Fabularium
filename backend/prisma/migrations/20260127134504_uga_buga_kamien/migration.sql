-- DropForeignKey
ALTER TABLE "CharacterCombatStats" DROP CONSTRAINT "CharacterCombatStats_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterCurrency" DROP CONSTRAINT "CharacterCurrency_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterEventLog" DROP CONSTRAINT "CharacterEventLog_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterFeature" DROP CONSTRAINT "CharacterFeature_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterKnownSpell" DROP CONSTRAINT "CharacterKnownSpell_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterPreparedSpell" DROP CONSTRAINT "CharacterPreparedSpell_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterProficiency" DROP CONSTRAINT "CharacterProficiency_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterSaves" DROP CONSTRAINT "CharacterSaves_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterSkill" DROP CONSTRAINT "CharacterSkill_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterSpellSlot" DROP CONSTRAINT "CharacterSpellSlot_characterId_fkey";

-- DropForeignKey
ALTER TABLE "CharacterStats" DROP CONSTRAINT "CharacterStats_characterId_fkey";

-- DropForeignKey
ALTER TABLE "InventoryItem" DROP CONSTRAINT "InventoryItem_characterId_fkey";

-- AddForeignKey
ALTER TABLE "CharacterStats" ADD CONSTRAINT "CharacterStats_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSaves" ADD CONSTRAINT "CharacterSaves_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSkill" ADD CONSTRAINT "CharacterSkill_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterProficiency" ADD CONSTRAINT "CharacterProficiency_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterCombatStats" ADD CONSTRAINT "CharacterCombatStats_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "InventoryItem" ADD CONSTRAINT "InventoryItem_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterKnownSpell" ADD CONSTRAINT "CharacterKnownSpell_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterPreparedSpell" ADD CONSTRAINT "CharacterPreparedSpell_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterSpellSlot" ADD CONSTRAINT "CharacterSpellSlot_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterFeature" ADD CONSTRAINT "CharacterFeature_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterCurrency" ADD CONSTRAINT "CharacterCurrency_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CharacterEventLog" ADD CONSTRAINT "CharacterEventLog_characterId_fkey" FOREIGN KEY ("characterId") REFERENCES "Character"("id") ON DELETE CASCADE ON UPDATE CASCADE;
