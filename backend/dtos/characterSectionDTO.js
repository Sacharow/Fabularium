"use strict";

/**
 * Mapuje dane postaci z bazy do formatu CharacterSection dla frontendu
 * @param {Object} character - Pełny obiekt Character
 * @returns {Object} CharacterSection
 */
const mapCharacterToSection = (character) => {
  if (!character) return null;

  const profBonus = 2 + Math.floor((character.level - 1) / 4);
  const spellsByLevel = Array.from(
    { length: 10 },
    (_, level) => `level${level}`,
  ).reduce((acc, key) => {
    acc[key] = [];
    return acc;
  }, {});

  const addSpellToLevel = (spell) => {
    const name = spell?.name || spell?.id;
    const description =
      typeof spell?.description === "string" ? spell.description : "";
    const rawLevel = typeof spell?.level === "number" ? spell.level : 0;
    const safeLevel = Math.max(0, Math.min(9, rawLevel));
    const key = `level${safeLevel}`;

    if (name && !spellsByLevel[key].some((entry) => entry.name === name)) {
      spellsByLevel[key].push({
        name,
        description,
      });
    }
  };

  (character.knownSpells || []).forEach((ks) => addSpellToLevel(ks.spell));
  (character.preparedSpells || []).forEach((ps) => addSpellToLevel(ps.spell));

  return {
    id: character.id,
    campaignId: character.campaignId,
    name: character.name,
    image: character.image || undefined,
    icon: character.icon || undefined,
    level: character.level,
    xp: character.xp || 0,
    inspiration: character.inspiration || false,
    profBonus,
    characterClass: character.class || null,
    characterRace: character.race || null,
    characterSubrace: character.subrace || null,
    characterSubclass: character.subclass || null,
    alignment: character.alignment,

    // Ability scores
    abilityScores: character.stats
      ? {
          str: character.stats.str,
          dex: character.stats.dex,
          con: character.stats.con,
          int: character.stats.int,
          wis: character.stats.wis,
          cha: character.stats.cha,
        }
      : {},

    // Saving throw proficiencies
    abilityProf: character.saves
      ? Object.keys(character.saves)
          .filter((key) => character.saves[key] === true)
          .map((key) => {
            const mapping = {
              strProficient: "str",
              dexProficient: "dex",
              conProficient: "con",
              intProficient: "int",
              wisProficient: "wis",
              chaProficient: "cha",
            };
            return mapping[key];
          })
          .filter(Boolean)
      : [],

    // Stats for compatibility
    stats: character.stats
      ? [
          { name: "str", value: character.stats.str },
          { name: "dex", value: character.stats.dex },
          { name: "con", value: character.stats.con },
          { name: "int", value: character.stats.int },
          { name: "wis", value: character.stats.wis },
          { name: "cha", value: character.stats.cha },
        ]
      : [],

    // Skills
    skillProf: character.skills
      ? character.skills
          .filter((skill) => skill.proficient)
          .map((skill) => skill.name)
      : [],

    skillExpertise: character.skills
      ? character.skills
          .filter((skill) => skill.expertise)
          .map((skill) => skill.name)
      : [],

    // Equipment from inventory
    equipment: character.inventoryItems
      ? character.inventoryItems
          .filter((inv) => inv.equipped)
          .map((inv) => ({
            name: inv.item?.name || inv.item?.id,
            type: inv.item?.type || "Equipment",
            description: inv.item?.description || "",
            weight: inv.item?.weight ?? null,
          }))
      : [],

    // Features
    features: character.features
      ? character.features.map((cf) => cf.feature?.name || cf.feature?.id)
      : [],

    // Money
    money: character.currency
      ? {
          gp: character.currency.gp,
          sp: character.currency.sp,
          ep: character.currency.ep,
          cp: character.currency.cp,
          pp: character.currency.pp,
        }
      : {},

    // Personality
    background: character.background,
    personalityTraits: character.personalityTraits,
    ideals: character.ideals,
    bonds: character.bonds,
    flaws: character.flaws,

    // Combat
    initiativeBonus: character.combat?.initiative,
    speed: character.combat?.speed,
    hitDice: character.combat?.hitDiceTotal,
    hitPointsMax: character.combat?.hpMax,
    hitPointsCurrent: character.combat?.hp,
    armorClass: character.combat?.ac,
    passivePerception: character.combat?.passivePerception,

    // Spells
    knownSpells: character.knownSpells
      ? character.knownSpells.map((ks) => ks.spell?.name || ks.spell?.id)
      : [],

    preparedSpells: character.preparedSpells
      ? character.preparedSpells.map((ps) => ps.spell?.name || ps.spell?.id)
      : [],

    spellsByLevel,

    spellSlots: character.spellSlots || [],
  };
};

/**
 * Mapuje listę postaci do uprościonego formatu
 * @param {Array} characters - Tablica postaci
 * @returns {Array} Uproszczone CharacterSection
 */
const mapCharactersToList = (characters) => {
  return characters.map((char) => ({
    id: char.id,
    name: char.name,
    image: char.image,
    icon: char.icon,
    level: char.level,
    race: char.race || null,
    class: char.class || null,
    hp: char.combat?.hp ?? null,
    speed: char.combat?.speed ?? null,
    armorClass: char.combat?.ac ?? null,
    campaignId: char.campaignId,
    connectedCampaign: char.campaign?.name || null,
  }));
};

module.exports = {
  mapCharacterToSection,
  mapCharactersToList,
};
