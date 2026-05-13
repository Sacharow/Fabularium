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

const spellLevelKeys = Array.from(
  { length: 10 },
  (_, level) => `level${level}`,
);

const normalizeSpellsByLevelPayload = (spellsByLevel = {}) => {
  return spellLevelKeys.reduce((acc, key) => {
    const levelSpells = Array.isArray(spellsByLevel[key])
      ? spellsByLevel[key]
          .map((spell) => {
            if (typeof spell === "string") {
              const name = spell.trim();
              return name ? { name } : null;
            }

            if (spell && typeof spell === "object") {
              const name = String(spell.name || "").trim();
              const description =
                typeof spell.description === "string"
                  ? spell.description.trim()
                  : undefined;

              if (!name) {
                return null;
              }

              return {
                name,
                description,
              };
            }

            return null;
          })
          .filter(Boolean)
          .filter(
            (spell, index, arr) =>
              arr.findIndex((entry) => entry.name === spell.name) === index,
          )
          .filter(Boolean)
      : [];
    acc[key] = levelSpells;
    return acc;
  }, {});
};

const flattenSpellsByLevel = (spellsByLevel = {}) => {
  const flat = [];

  spellLevelKeys.forEach((key, index) => {
    const names = Array.isArray(spellsByLevel[key]) ? spellsByLevel[key] : [];
    names.forEach((spell) => {
      flat.push({
        spellName: spell.name,
        description: spell.description,
        level: index,
      });
    });
  });

  return flat;
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

  const normalizedSpellsByLevel = data.spellsByLevel
    ? normalizeSpellsByLevelPayload(data.spellsByLevel)
    : null;
  const flattenedSpells = normalizedSpellsByLevel
    ? flattenSpellsByLevel(normalizedSpellsByLevel)
    : [];

  const uniqueSpellsByName = flattenedSpells.reduce((acc, spell) => {
    if (!acc.has(spell.spellName)) {
      acc.set(spell.spellName, spell);
    }
    return acc;
  }, new Map());

  try {
    if (normalizedSpellsByLevel && uniqueSpellsByName.size > 0) {
      await Promise.all(
        Array.from(uniqueSpellsByName.values()).map((spell) =>
          prisma.spell.upsert({
            where: { name: spell.spellName },
            create: {
              name: spell.spellName,
              level: spell.level,
              description: spell.description || null,
            },
            update: {
              level: spell.level,
              ...(spell.description !== undefined
                ? { description: spell.description || null }
                : {}),
            },
          }),
        ),
      );
    }

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
        features: data.features
          ? {
              deleteMany: { characterId },
              create: data.features.map((featureName) => ({
                feature: {
                  create: {
                    name: featureName,
                  },
                },
              })),
            }
          : undefined,
        inventoryItems: data.equipment
          ? {
              deleteMany: { characterId },
              create: data.equipment.map((item) => {
                const itemData =
                  typeof item === "string" ? { name: item } : item;

                return {
                  quantity: 1,
                  equipped: true,
                  item: {
                    connectOrCreate: {
                      where: { name: itemData.name },
                      create: {
                        name: itemData.name,
                        type: itemData.type || "Equipment",
                        weight:
                          itemData.weight === undefined
                            ? null
                            : itemData.weight,
                        description: itemData.description || null,
                      },
                    },
                  },
                };
              }),
            }
          : undefined,
        knownSpells: normalizedSpellsByLevel
          ? {
              deleteMany: { characterId },
              create: flattenedSpells.map(({ spellName }) => ({
                spell: {
                  connect: {
                    name: spellName,
                  },
                },
              })),
            }
          : data.knownSpells
            ? {
                deleteMany: { characterId },
                create: data.knownSpells.map((spellName) => ({
                  spell: {
                    connectOrCreate: {
                      where: { name: spellName },
                      create: {
                        name: spellName,
                        level: 0,
                      },
                    },
                  },
                })),
              }
            : undefined,
        preparedSpells: normalizedSpellsByLevel
          ? {
              deleteMany: { characterId },
              create: flattenedSpells.map(({ spellName }) => ({
                spell: {
                  connect: {
                    name: spellName,
                  },
                },
              })),
            }
          : data.preparedSpells
            ? {
                deleteMany: { characterId },
                create: data.preparedSpells.map((spellName) => ({
                  spell: {
                    connectOrCreate: {
                      where: { name: spellName },
                      create: {
                        name: spellName,
                        level: 0,
                      },
                    },
                  },
                })),
              }
            : undefined,
        spellSlots: data.spellSlots
          ? {
              deleteMany: { characterId },
              create: data.spellSlots.map((slot) => ({
                spellLevel: slot.spellLevel,
                maxSlots: slot.maxSlots,
                usedSlots: slot.usedSlots,
              })),
            }
          : normalizedSpellsByLevel
            ? {
                deleteMany: { characterId },
                create: spellLevelKeys
                  .map((key, spellLevel) => ({
                    spellLevel,
                    maxSlots:
                      spellLevel === 0
                        ? 0
                        : Math.max(
                            0,
                            Array.isArray(normalizedSpellsByLevel[key])
                              ? normalizedSpellsByLevel[key].length
                              : 0,
                          ),
                    usedSlots: 0,
                  }))
                  .filter((slot) => slot.maxSlots > 0 || slot.spellLevel === 0),
              }
            : undefined,
        currency: data.money
          ? {
              upsert: {
                create: {
                  gp: data.money.gp ?? 0,
                  sp: data.money.sp ?? 0,
                  ep: data.money.ep ?? 0,
                  cp: data.money.cp ?? 0,
                  pp: data.money.pp ?? 0,
                },
                update: {
                  gp: data.money.gp ?? 0,
                  sp: data.money.sp ?? 0,
                  ep: data.money.ep ?? 0,
                  cp: data.money.cp ?? 0,
                  pp: data.money.pp ?? 0,
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
