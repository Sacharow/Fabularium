'use strict';

/**
 * Mapuje dane postaci z bazy do formatu CharacterSection dla frontendu
 * @param {Object} character - Pełny obiekt Character z relacjami
 * @returns {Object} CharacterSection
 */
const mapCharacterToSection = (character) => {
    if (!character) return null;

    const profBonus = 2 + Math.floor((character.level - 1) / 4);

    return {
        id: character.id,
        campaignId: character.campaignId,
        name: character.name,
        image: character.image || undefined,
        icon: character.icon || undefined,
        level: character.level,
        profBonus,
        characterClass: character.class?.name,
        characterRace: character.race?.name,
        characterSubrace: character.subRace?.name,
        characterSubclass: character.subclass?.name,

        // Ability scores
        abilityScores: character.stats
            ? {
                str: character.stats.str,
                dex: character.stats.dex,
                con: character.stats.con,
                int: character.stats.int,
                wis: character.stats.wis,
                cha: character.stats.cha
            }
            : {},

        // Saving throw proficiencies
        abilityProf: character.saves
            ? Object.keys(character.saves)
                .filter(key => character.saves[key] === true)
                .map(key => {
                    const mapping = {
                        strProficient: 'str',
                        dexProficient: 'dex',
                        conProficient: 'con',
                        intProficient: 'int',
                        wisProficient: 'wis',
                        chaProficient: 'cha'
                    };
                    return mapping[key];
                })
                .filter(Boolean)
            : [],

        // Stats for compatibility
        stats: character.stats
            ? [
                { name: 'str', value: character.stats.str },
                { name: 'dex', value: character.stats.dex },
                { name: 'con', value: character.stats.con },
                { name: 'int', value: character.stats.int },
                { name: 'wis', value: character.stats.wis },
                { name: 'cha', value: character.stats.cha }
            ]
            : [],

        // Skills
        skillProf: character.skills
            ? character.skills
                .filter(skill => skill.proficient)
                .map(skill => skill.name)
            : [],

        skillExpertise: character.skills
            ? character.skills
                .filter(skill => skill.expertise)
                .map(skill => skill.name)
            : [],

        // Equipment from inventory
        equipment: character.inventoryItems
            ? character.inventoryItems
                .filter(inv => inv.equipped)
                .map(inv => inv.item?.name || inv.item?.id)
            : [],

        // Features
        features: character.features
            ? character.features.map(cf => cf.feature?.name || cf.feature?.id)
            : [],

        // Money
        money: character.currency
            ? {
                gp: character.currency.gp,
                sp: character.currency.sp,
                ep: character.currency.ep,
                cp: character.currency.cp,
                pp: character.currency.pp
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
            ? character.knownSpells.map(ks => ks.spell?.name || ks.spell?.id)
            : [],

        preparedSpells: character.preparedSpells
            ? character.preparedSpells.map(ps => ps.spell?.name || ps.spell?.id)
            : [],

        spellSlots: character.spellSlots || []
    };
};

/**
 * Mapuje listę postaci do uprościonego formatu
 * @param {Array} characters - Tablica postaci z relacjami
 * @returns {Array} Uproszczone CharacterSection
 */
const mapCharactersToList = (characters) => {
    return characters.map(char => ({
        id: char.id,
        name: char.name,
        image: char.image,
        icon: char.icon,
        level: char.level,
        characterClass: char.class?.name,
        characterRace: char.race?.name,
        background: char.background,
        campaignId: char.campaignId
    }));
};

module.exports = {
    mapCharacterToSection,
    mapCharactersToList
};
