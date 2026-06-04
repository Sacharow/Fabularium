"use strict";

const prisma = require("../config/database");

const characterUpdateInclude = {
  stats: true,
  characterEventLogs: true,
  currency: true,
  features: {
    include: {
      feature: true,
    },
  },
  knownSpells: {
    include: {
      spell: true,
    },
  },
  preparedSpells: {
    include: {
      spell: true,
    },
  },
  spellSlots: true,
  inventoryItems: {
    include: {
      item: true,
    },
  },
  // Include saves and skills so update responses contain them
  saves: true,
  skills: true,
  // Include combat stats
  combat: true,
};

const ensureOwnership = async (characterId, userId) => {
  const record = await prisma.character.findUnique({
    where: { id: characterId },
    select: { ownerId: true },
  });
  if (!record) return { error: { status: 404, message: "Not found" } };
  if (record.ownerId !== userId) {
    return { error: { status: 403, message: "Forbidden" } };
  }
  return {};
};

const normalizeMoney = (money) => ({
  gp: money?.gp ?? 0,
  sp: money?.sp ?? 0,
  ep: money?.ep ?? 0,
  cp: money?.cp ?? 0,
  pp: money?.pp ?? 0,
});

const getSpellMetadataByName = (spellsByLevel) => {
  const metadataByName = new Map();

  if (!spellsByLevel || typeof spellsByLevel !== "object") {
    return metadataByName;
  }

  for (const [levelKey, spellEntries] of Object.entries(spellsByLevel)) {
    const levelMatch = levelKey.match(/^level(\d)$/);
    const spellLevel = levelMatch ? Number(levelMatch[1]) : 0;

    if (!Array.isArray(spellEntries)) {
      continue;
    }

    for (const spellEntry of spellEntries) {
      const spellName =
        typeof spellEntry === "string"
          ? spellEntry.trim()
          : String(spellEntry?.name || "").trim();

      if (!spellName || metadataByName.has(spellName)) {
        continue;
      }

      metadataByName.set(spellName, {
        level: spellLevel,
        description:
          typeof spellEntry === "object" &&
          spellEntry !== null &&
          typeof spellEntry.description === "string"
            ? spellEntry.description
            : "",
      });
    }
  }

  return metadataByName;
};

const resolveFeatureId = async (tx, featureName) => {
  const normalizedName = String(featureName || "").trim();
  if (!normalizedName) {
    return null;
  }

  const existingFeature = await tx.feature.findFirst({
    where: { name: normalizedName },
    select: { id: true },
  });

  if (existingFeature) {
    return existingFeature.id;
  }

  const createdFeature = await tx.feature.create({
    data: { name: normalizedName },
    select: { id: true },
  });

  return createdFeature.id;
};

const upsertItemByName = async (tx, itemData) => {
  const name = String(itemData?.name || "").trim();
  if (!name) {
    return null;
  }

  return tx.item.upsert({
    where: { name },
    update: {
      type: itemData.type || "Equipment",
      description: itemData.description || null,
      weight:
        itemData.weight === undefined || itemData.weight === null
          ? null
          : itemData.weight,
    },
    create: {
      name,
      type: itemData.type || "Equipment",
      description: itemData.description || null,
      weight:
        itemData.weight === undefined || itemData.weight === null
          ? null
          : itemData.weight,
    },
    select: { id: true },
  });
};

const upsertSpellByName = async (tx, spellName, spellData) => {
  const normalizedName = String(spellName || "").trim();
  if (!normalizedName) {
    return null;
  }

  return tx.spell.upsert({
    where: { name: normalizedName },
    update: {
      level: spellData.level,
      description: spellData.description || null,
    },
    create: {
      name: normalizedName,
      level: spellData.level,
      description: spellData.description || null,
    },
    select: { id: true },
  });
};

const createCharacterForUser = async (userId, data) => {
  const createData = {
    owner: {
      connect: { id: userId },
    },
    name: data.name ?? "New Character",
    image: data.image ?? null,
    icon: data.icon ?? null,
    background: data.background ?? null,
    alignment: data.alignment ?? null,
    level: data.level ?? 1,
    profBonus: data.profBonus ?? null,
    xp: data.xp ?? 0,
    inspiration: data.inspiration ?? false,
    race: data.race ?? data.raceId ?? null,
    class: data.class ?? data.classId ?? null,
    subclass: data.subclass ?? data.subclassId ?? null,
    subrace: data.subrace ?? data.subraceId ?? null,
    personalityTraits: data.personalityTraits ?? null,
    ideals: data.ideals ?? null,
    languages: data.languages ?? null,
    bonds: data.bonds ?? null,
    flaws: data.flaws ?? null,
    height: data.height ?? null,
    weight: data.weight === undefined ? null : data.weight,
    eyeColor: data.eyeColor ?? null,
    hairColor: data.hairColor ?? null,
    skinColor: data.skinColor ?? null,
    age: data.age === undefined ? null : data.age,
  };

  if (data.campaignId) {
    createData.campaign = {
      connect: { id: data.campaignId },
    };
  }

  const character = await prisma.character.create({
    data: createData,
    include: characterUpdateInclude,
  });

  if (Array.isArray(data.notes) && data.notes.length > 0) {
    const noteData = data.notes.map((note) => ({
      characterId: character.id,
      type: "note",
      payload: note,
    }));
    await prisma.characterEventLog.createMany({ data: noteData });
  }

  return character;
};

const getOwnedCharacterById = async (characterId, userId) => {
  const character = await prisma.character.findFirst({
    where: { id: characterId, ownerId: userId },
    include: characterUpdateInclude,
  });
  if (!character) return { error: { status: 404, message: "Not found" } };
  return { character };
};

const listCharactersForUser = async (userId) => {
  const characters = await prisma.character.findMany({
    where: { ownerId: userId },
    include: { stats: true },
  });
  return { characters };
};

const updateOwnedCharacter = async (characterId, userId, data) => {
  const ownership = await ensureOwnership(characterId, userId);
  if (ownership.error) return { error: ownership.error };

  try {
    const updatePayload = {
      name: data.name,
      image: data.image ?? undefined,
      icon: data.icon ?? undefined,
      background: data.background ?? undefined,
      alignment: data.alignment ?? undefined,
      level: data.level,
      profBonus: data.profBonus,
      xp: data.xp,
      inspiration: data.inspiration,
      race: data.race ?? data.raceId ?? undefined,
      class: data.class ?? data.classId ?? undefined,
      subclass: data.subclass ?? data.subclassId ?? undefined,
      subrace: data.subrace ?? data.subraceId ?? undefined,
      campaignId: data.campaignId === undefined ? undefined : data.campaignId,
      personalityTraits: data.personalityTraits ?? undefined,
      ideals: data.ideals ?? undefined,
      languages: data.languages === undefined ? undefined : data.languages,
      bonds: data.bonds ?? undefined,
      flaws: data.flaws ?? undefined,
      height: data.height === undefined ? undefined : data.height,
      weight: data.weight === undefined ? undefined : data.weight,
      eyeColor: data.eyeColor === undefined ? undefined : data.eyeColor,
      hairColor: data.hairColor === undefined ? undefined : data.hairColor,
      skinColor: data.skinColor === undefined ? undefined : data.skinColor,
      age: data.age === undefined ? undefined : data.age,
    };

    if (data.stats) {
      updatePayload.stats = {
        upsert: {
          create: {
            ...data.stats,
            strModifier: data.statModifiers?.str ?? null,
            dexModifier: data.statModifiers?.dex ?? null,
            conModifier: data.statModifiers?.con ?? null,
            intModifier: data.statModifiers?.int ?? null,
            wisModifier: data.statModifiers?.wis ?? null,
            chaModifier: data.statModifiers?.cha ?? null,
          },
          update: {
            ...data.stats,
            strModifier:
              data.statModifiers?.str === undefined
                ? undefined
                : data.statModifiers.str,
            dexModifier:
              data.statModifiers?.dex === undefined
                ? undefined
                : data.statModifiers.dex,
            conModifier:
              data.statModifiers?.con === undefined
                ? undefined
                : data.statModifiers.con,
            intModifier:
              data.statModifiers?.int === undefined
                ? undefined
                : data.statModifiers.int,
            wisModifier:
              data.statModifiers?.wis === undefined
                ? undefined
                : data.statModifiers.wis,
            chaModifier:
              data.statModifiers?.cha === undefined
                ? undefined
                : data.statModifiers.cha,
          },
        },
      };
    }

    const spellMetadataByName = getSpellMetadataByName(data.spellsByLevel);
    const hasSpellsByLevelPayload = data.spellsByLevel !== undefined;
    const requestedKnownSpells = hasSpellsByLevelPayload
      ? Array.from(spellMetadataByName.keys())
      : Array.isArray(data.knownSpells)
        ? data.knownSpells
        : [];
    const requestedPreparedSpells = hasSpellsByLevelPayload
      ? Array.from(spellMetadataByName.keys())
      : Array.isArray(data.preparedSpells)
        ? data.preparedSpells
        : [];
    const requestedSpellNames = new Set([
      ...requestedKnownSpells,
      ...requestedPreparedSpells,
    ]);

    const character = await prisma.$transaction(async (tx) => {
      await tx.character.update({
        where: { id: characterId },
        data: updatePayload,
      });

      if (Array.isArray(data.notes)) {
        await tx.characterEventLog.deleteMany({ where: { characterId } });
        if (data.notes.length > 0) {
          await tx.characterEventLog.createMany({
            data: data.notes.map((note) => ({
              characterId,
              type: "note",
              payload: note,
            })),
          });
        }
      }

      if (Array.isArray(data.features)) {
        await tx.characterFeature.deleteMany({ where: { characterId } });

        const featureIds = [];
        for (const featureName of data.features) {
          const featureId = await resolveFeatureId(tx, featureName);
          if (featureId) {
            featureIds.push(featureId);
          }
        }

        if (featureIds.length > 0) {
          await tx.characterFeature.createMany({
            data: featureIds.map((featureId) => ({
              characterId,
              featureId,
            })),
          });
        }
      }

      if (
        data.spellsByLevel ||
        Array.isArray(data.knownSpells) ||
        Array.isArray(data.preparedSpells)
      ) {
        await tx.characterKnownSpell.deleteMany({ where: { characterId } });
        await tx.characterPreparedSpell.deleteMany({ where: { characterId } });

        const spellIdsByName = new Map();

        for (const spellName of requestedSpellNames) {
          const normalizedSpellName = String(spellName || "").trim();
          if (!normalizedSpellName) {
            continue;
          }

          const spellMeta = spellMetadataByName.get(normalizedSpellName) || {
            level: 0,
            description: "",
          };

          const spell = await upsertSpellByName(
            tx,
            normalizedSpellName,
            spellMeta,
          );
          if (spell) {
            spellIdsByName.set(normalizedSpellName, spell.id);
          }
        }

        if (requestedKnownSpells.length > 0) {
          await tx.characterKnownSpell.createMany({
            data: requestedKnownSpells
              .map((spellName) =>
                spellIdsByName.get(String(spellName || "").trim()),
              )
              .filter(Boolean)
              .map((spellId) => ({ characterId, spellId })),
          });
        }

        if (requestedPreparedSpells.length > 0) {
          await tx.characterPreparedSpell.createMany({
            data: requestedPreparedSpells
              .map((spellName) =>
                spellIdsByName.get(String(spellName || "").trim()),
              )
              .filter(Boolean)
              .map((spellId) => ({ characterId, spellId })),
          });
        }
      }

      if (Array.isArray(data.equipment)) {
        await tx.inventoryItem.deleteMany({ where: { characterId } });

        const inventoryRows = [];
        for (const equipmentItem of data.equipment) {
          const item = await upsertItemByName(tx, equipmentItem);
          if (item) {
            inventoryRows.push({
              characterId,
              itemId: item.id,
              quantity: 1,
              equipped: true,
            });
          }
        }

        if (inventoryRows.length > 0) {
          await tx.inventoryItem.createMany({ data: inventoryRows });
        }
      }

      // Saving throws (CharacterSaves) upsert
      if (data.saves) {
        await tx.characterSaves.upsert({
          where: { characterId },
          update: {
            strProficient: data.saves.strProficient ?? false,
            dexProficient: data.saves.dexProficient ?? false,
            conProficient: data.saves.conProficient ?? false,
            intProficient: data.saves.intProficient ?? false,
            wisProficient: data.saves.wisProficient ?? false,
            chaProficient: data.saves.chaProficient ?? false,
          },
          create: {
            characterId,
            strProficient: data.saves.strProficient ?? false,
            dexProficient: data.saves.dexProficient ?? false,
            conProficient: data.saves.conProficient ?? false,
            intProficient: data.saves.intProficient ?? false,
            wisProficient: data.saves.wisProficient ?? false,
            chaProficient: data.saves.chaProficient ?? false,
          },
        });
      }

      // Skills: replace existing skills if payload provided
      if (Array.isArray(data.skills)) {
        await tx.characterSkill.deleteMany({ where: { characterId } });

        if (data.skills.length > 0) {
          const skillRows = data.skills.map((s) => ({
            characterId,
            name: String(s.name || "").trim(),
            proficient: !!s.proficient,
            expertise: !!s.expertise,
            bonus:
              s.bonus === undefined || s.bonus === null
                ? null
                : Number(s.bonus),
          }));

          await tx.characterSkill.createMany({ data: skillRows });
        }
      }
      if (data.money) {
        await tx.characterCurrency.upsert({
          where: { characterId },
          update: normalizeMoney(data.money),
          create: {
            characterId,
            ...normalizeMoney(data.money),
          },
        });
      }

      // Combat stats upsert
      if (data.combat) {
        await tx.characterCombatStats.upsert({
          where: { characterId },
          update: {
            hp:
              data.combat.hp === undefined ? undefined : Number(data.combat.hp),
            hpMax:
              data.combat.hpMax === undefined
                ? undefined
                : Number(data.combat.hpMax),
            ac: data.combat.ac === undefined ? undefined : data.combat.ac,
            initiative:
              data.combat.initiative === undefined
                ? undefined
                : data.combat.initiative,
            speed:
              data.combat.speed === undefined
                ? undefined
                : Number(data.combat.speed),
            hitDiceType:
              data.combat.hitDiceType === undefined
                ? undefined
                : data.combat.hitDiceType,
            hitDiceCurrent:
              data.combat.hitDiceCurrent === undefined
                ? undefined
                : data.combat.hitDiceCurrent,
            hitDiceTotal:
              data.combat.hitDiceTotal === undefined
                ? undefined
                : data.combat.hitDiceTotal,
            passivePerception:
              data.combat.passivePerception === undefined
                ? undefined
                : data.combat.passivePerception,
          },
          create: {
            characterId,
            hp: data.combat.hp === undefined ? 0 : Number(data.combat.hp),
            hpMax:
              data.combat.hpMax === undefined ? 0 : Number(data.combat.hpMax),
            ac: data.combat.ac === undefined ? null : data.combat.ac,
            initiative:
              data.combat.initiative === undefined
                ? null
                : data.combat.initiative,
            speed:
              data.combat.speed === undefined
                ? null
                : Number(data.combat.speed),
            hitDiceType:
              data.combat.hitDiceType === undefined
                ? null
                : data.combat.hitDiceType,
            hitDiceCurrent:
              data.combat.hitDiceCurrent === undefined
                ? null
                : data.combat.hitDiceCurrent,
            hitDiceTotal:
              data.combat.hitDiceTotal === undefined
                ? null
                : data.combat.hitDiceTotal,
            passivePerception:
              data.combat.passivePerception === undefined
                ? null
                : data.combat.passivePerception,
          },
        });
      }

      return tx.character.findUnique({
        where: { id: characterId },
        include: characterUpdateInclude,
      });
    });

    return { character };
  } catch (err) {
    console.error("❌ Update error:", err);
    throw err;
  }
};

const deleteOwnedCharacter = async (characterId, userId) => {
  const ownership = await ensureOwnership(characterId, userId);
  if (ownership.error) return { error: ownership.error };

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
