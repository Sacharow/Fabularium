"use strict";

const prisma = require("../config/database");

const mapCharacterForeignKeyError = (err) => {
  if (err?.code !== "P2003") {
    return null;
  }

  const fieldName = String(err?.meta?.field_name || "");
  if (fieldName.includes("campaignId")) {
    return { status: 400, message: "Invalid campaignId" };
  }

  if (fieldName.includes("ownerId")) {
    return { status: 401, message: "Invalid user context" };
  }

  return { status: 400, message: "Invalid related resource id" };
};

const throwMappedError = (mapped) => {
  const error = new Error(mapped.message);
  error.status = mapped.status;
  throw error;
};

const ensureOwnership = async (characterId, userId) => {
  const character = await prisma.character.findUnique({
    where: { id: characterId },
    select: { id: true, ownerId: true },
  });

  if (!character) {
    return { error: { status: 404, message: "Character not found" } };
  }

  if (character.ownerId !== userId) {
    return { error: { status: 403, message: "Forbidden" } };
  }

  return { character };
};

const characterUpdateInclude = {
  stats: true,
  saves: true,
  combat: true,
  currency: true,
  proficiencies: true,
  features: { include: { feature: true } },
  skills: true,
  inventoryItems: { include: { item: true } },
  knownSpells: { include: { spell: true } },
  preparedSpells: { include: { spell: true } },
  spellSlots: true,
};

const createCharacterForUser = async (userId, data) => {
  try {
    return await prisma.character.create({
      data: {
        name: data.name,
        ownerId: userId,
        image: data.image ?? null,
        icon: data.icon ?? null,
        background: data.background ?? null,
        alignment: data.alignment ?? null,
        level: data.level ?? 1,
        race: data.race ?? data.raceId ?? null,
        class: data.class ?? data.classId ?? null,
        subclass: data.subclass ?? data.subclassId ?? null,
        subrace: data.subrace ?? data.subraceId ?? null,
        campaignId: data.campaignId ?? null,
        personalityTraits: data.personalityTraits ?? null,
        ideals: data.ideals ?? null,
        bonds: data.bonds ?? null,
        flaws: data.flaws ?? null,
        stats: data.stats ? { create: { ...data.stats } } : undefined,
      },
      include: { stats: true },
    });
  } catch (err) {
    const mapped = mapCharacterForeignKeyError(err);
    if (mapped) {
      throwMappedError(mapped);
    }
    throw err;
  }
};

const getOwnedCharacterById = async (characterId, userId) => {
  const ownership = await ensureOwnership(characterId, userId);
  if (ownership.error) {
    return { error: ownership.error };
  }

  const character = await prisma.character.findUnique({
    where: { id: characterId },
    include: characterUpdateInclude,
  });

  return { character };
};

const listCharactersForUser = async (userId) => {
  return prisma.character.findMany({
    where: { ownerId: userId },
    select: {
      id: true,
      name: true,
      level: true,
      background: true,
      alignment: true,
      class: true,
      race: true,
      subrace: true,
      subclass: true,
      campaignId: true,
      updatedAt: true,
      // names are stored directly on the character now
      campaign: { select: { name: true } },
      combat: { select: { hp: true, ac: true, speed: true } },
    },
  });
};

const updateOwnedCharacter = async (characterId, userId, data) => {
  const ownership = await ensureOwnership(characterId, userId);
  if (ownership.error) {
    return { error: ownership.error };
  }

  let character;

  try {
    console.log(
      "📝 Updating character with data:",
      JSON.stringify(data, null, 2),
    );
    character = await prisma.character.update({
      where: { id: characterId },
      data: {
        name: data.name,
        image: data.image ?? undefined,
        icon: data.icon ?? undefined,
        background: data.background ?? undefined,
        alignment: data.alignment ?? undefined,
        level: data.level,
        xp: data.xp,
        inspiration: data.inspiration,
        race: data.race ?? data.raceId ?? undefined,
        class: data.class ?? data.classId ?? undefined,
        subclass: data.subclass ?? data.subclassId ?? undefined,
        subrace: data.subrace ?? data.subraceId ?? undefined,
        campaignId: data.campaignId ?? undefined,
        personalityTraits: data.personalityTraits ?? undefined,
        ideals: data.ideals ?? undefined,
        bonds: data.bonds ?? undefined,
        flaws: data.flaws ?? undefined,
        stats: data.stats
          ? {
              upsert: {
                create: { ...data.stats },
                update: { ...data.stats },
              },
            }
          : undefined,
        saves: data.saves
          ? {
              upsert: {
                create: { ...data.saves },
                update: { ...data.saves },
              },
            }
          : undefined,
        combat: data.combat
          ? {
              upsert: {
                create: {
                  hp: data.combat.hp ?? 0,
                  hpMax: data.combat.hpMax ?? 0,
                  ac: data.combat.ac ?? null,
                  initiative: data.combat.initiative ?? null,
                  speed: data.combat.speed ?? null,
                  hitDiceType: data.combat.hitDiceType ?? null,
                  hitDiceCurrent: data.combat.hitDiceCurrent ?? null,
                  hitDiceTotal: data.combat.hitDiceTotal ?? null,
                  passivePerception: data.combat.passivePerception ?? null,
                },
                update: {
                  hp: data.combat.hp ?? 0,
                  hpMax: data.combat.hpMax ?? 0,
                  ac: data.combat.ac ?? null,
                  initiative: data.combat.initiative ?? null,
                  speed: data.combat.speed ?? null,
                  hitDiceType: data.combat.hitDiceType ?? null,
                  hitDiceCurrent: data.combat.hitDiceCurrent ?? null,
                  hitDiceTotal: data.combat.hitDiceTotal ?? null,
                  passivePerception: data.combat.passivePerception ?? null,
                },
              },
            }
          : undefined,
        skills: data.skills
          ? {
              deleteMany: { characterId },
              create: data.skills.map((skill) => ({
                name: skill.name,
                proficient: skill.proficient,
                expertise: skill.expertise,
                bonus: skill.bonus ?? null,
              })),
            }
          : undefined,
      },
      include: characterUpdateInclude,
    });
  } catch (err) {
    console.error("❌ Update error:", err);
    const mapped = mapCharacterForeignKeyError(err);
    if (mapped) {
      throwMappedError(mapped);
    }
    throw err;
  }

  console.log("✅ Character updated successfully");
  return { character };
};

const deleteOwnedCharacter = async (characterId, userId) => {
  const ownership = await ensureOwnership(characterId, userId);
  if (ownership.error) {
    return { error: ownership.error };
  }

  await prisma.character.delete({ where: { id: characterId } });
  return {};
};

module.exports = {
  createCharacterForUser,
  getOwnedCharacterById,
  listCharactersForUser,
  updateOwnedCharacter,
  deleteOwnedCharacter,
};
