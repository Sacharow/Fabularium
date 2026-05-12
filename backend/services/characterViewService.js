"use strict";

const prisma = require("../config/database");
const {
  mapCharacterToSection,
  mapCharactersToList,
} = require("../dtos/characterSectionDTO");

const getCharacterSectionById = async (characterId, userId) => {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: {
      stats: true,
      saves: true,
      combat: true,
      currency: true,
      skills: true,
      proficiencies: true,
      features: {
        include: {
          feature: { select: { id: true, name: true, description: true } },
        },
      },
      inventoryItems: {
        include: {
          item: { select: { id: true, name: true } },
        },
      },
      knownSpells: {
        include: {
          spell: { select: { id: true, name: true } },
        },
      },
      preparedSpells: {
        include: {
          spell: { select: { id: true, name: true } },
        },
      },
      spellSlots: true,
    },
  });

  if (!character) {
    return { error: { status: 404, message: "Character not found" } };
  }

  if (character.ownerId !== userId) {
    return { error: { status: 403, message: "Forbidden" } };
  }

  return {
    character: mapCharacterToSection(character),
  };
};

/**
 * Pobiera listę postaci użytkownika w formacie listy
 */
const listCharacterSections = async (userId) => {
  const characters = await prisma.character.findMany({
    where: { ownerId: userId },
    include: {
      campaign: { select: { name: true } },
      combat: { select: { hp: true, ac: true, speed: true } },
    },
    orderBy: { updatedAt: "desc" },
  });

  return mapCharactersToList(characters);
};

module.exports = {
  getCharacterSectionById,
  listCharacterSections,
};
