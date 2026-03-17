'use strict';

const prisma = require("../config/database");

const getAllRaces = async () => {
    return prisma.race.findMany({
        include: { raceAbilities: true, subRaces: true }
    });
};

const getRaceById = async (id) => {
    return prisma.race.findUnique({
        where: { id },
        include: { raceAbilities: true, subRaces: { include: { subRaceAbilities: true } } }
    });
};

const createRace = async (data) => {
    return prisma.race.create({ data });
};

const updateRace = async (id, data) => {
    return prisma.race.update({
        where: { id },
        data
    });
};

const deleteRace = async (id) => {
    return prisma.race.delete({ where: { id } });
};

const getAllClasses = async () => {
    return prisma.class.findMany({
        include: { subclasses: true, progressions: true }
    });
};

const getClassById = async (id) => {
    return prisma.class.findUnique({
        where: { id },
        include: { subclasses: true, progressions: true }
    });
};

const createClass = async (data) => {
    return prisma.class.create({ data });
};

const updateClass = async (id, data) => {
    return prisma.class.update({
        where: { id },
        data
    });
};

const deleteClass = async (id) => {
    return prisma.class.delete({ where: { id } });
};

const getAllSubclasses = async () => {
    return prisma.subclass.findMany({
        include: { class: true }
    });
};

const getSubclassById = async (id) => {
    return prisma.subclass.findUnique({
        where: { id },
        include: { class: true }
    });
};

const createSubclass = async (data) => {
    return prisma.subclass.create({ data });
};

const updateSubclass = async (id, data) => {
    return prisma.subclass.update({
        where: { id },
        data
    });
};

const deleteSubclass = async (id) => {
    return prisma.subclass.delete({ where: { id } });
};

const getAllRaceAbilities = async () => {
    return prisma.raceAbility.findMany({
        include: { race: true }
    });
};

const getRaceAbilityById = async (id) => {
    return prisma.raceAbility.findUnique({
        where: { id },
        include: { race: true }
    });
};

const createRaceAbility = async (data) => {
    return prisma.raceAbility.create({ data });
};

const updateRaceAbility = async (id, data) => {
    return prisma.raceAbility.update({
        where: { id },
        data
    });
};

const deleteRaceAbility = async (id) => {
    return prisma.raceAbility.delete({ where: { id } });
};

const getAllSubraces = async () => {
    return prisma.subRace.findMany({
        include: { parentRace: true, subRaceAbilities: true }
    });
};

const getSubraceById = async (id) => {
    return prisma.subRace.findUnique({
        where: { id },
        include: { parentRace: true, subRaceAbilities: true }
    });
};

const createSubrace = async (data) => {
    const parentRace = await prisma.race.findUnique({
        where: { id: data.parentRaceId }
    });

    if (!parentRace) {
        return { error: { status: 404, message: "Parent race not found" } };
    }

    const subrace = await prisma.subRace.create({ data });
    return { subrace };
};

const updateSubrace = async (id, data) => {
    return prisma.subRace.update({
        where: { id },
        data
    });
};

const deleteSubrace = async (id) => {
    return prisma.subRace.delete({ where: { id } });
};

const getAllSubraceAbilities = async () => {
    return prisma.subRaceAbility.findMany({
        include: { subRace: true }
    });
};

const getSubraceAbilityById = async (id) => {
    return prisma.subRaceAbility.findUnique({
        where: { id },
        include: { subRace: true }
    });
};

const createSubraceAbility = async (data) => {
    const subRace = await prisma.subRace.findUnique({
        where: { id: data.subRaceId }
    });

    if (!subRace) {
        return { error: { status: 404, message: "Subrace not found" } };
    }

    const subraceAbility = await prisma.subRaceAbility.create({ data });
    return { subraceAbility };
};

const updateSubraceAbility = async (id, data) => {
    return prisma.subRaceAbility.update({
        where: { id },
        data
    });
};

const deleteSubraceAbility = async (id) => {
    return prisma.subRaceAbility.delete({ where: { id } });
};

const getAllSpells = async () => {
    return prisma.spell.findMany();
};

const getSpellById = async (id) => {
    return prisma.spell.findUnique({ where: { id } });
};

const createSpell = async (data) => {
    return prisma.spell.create({ data });
};

const updateSpell = async (id, data) => {
    return prisma.spell.update({
        where: { id },
        data
    });
};

const deleteSpell = async (id) => {
    return prisma.spell.delete({ where: { id } });
};

const getAllItems = async () => {
    return prisma.item.findMany();
};

const getItemById = async (id) => {
    return prisma.item.findUnique({ where: { id } });
};

const createItem = async (data) => {
    return prisma.item.create({ data });
};

const updateItem = async (id, data) => {
    return prisma.item.update({
        where: { id },
        data
    });
};

const deleteItem = async (id) => {
    return prisma.item.delete({ where: { id } });
};

const getAllFeatures = async () => {
    return prisma.feature.findMany();
};

const getFeatureById = async (id) => {
    return prisma.feature.findUnique({ where: { id } });
};

const createFeature = async (data) => {
    return prisma.feature.create({ data });
};

const updateFeature = async (id, data) => {
    return prisma.feature.update({
        where: { id },
        data
    });
};

const deleteFeature = async (id) => {
    return prisma.feature.delete({ where: { id } });
};

const getAllFeats = async () => {
    return prisma.feat.findMany();
};

const getFeatById = async (id) => {
    return prisma.feat.findUnique({ where: { id } });
};

const createFeat = async (data) => {
    return prisma.feat.create({ data });
};

const updateFeat = async (id, data) => {
    return prisma.feat.update({
        where: { id },
        data
    });
};

const deleteFeat = async (id) => {
    return prisma.feat.delete({ where: { id } });
};

const getAllMissionNpcs = async () => {
    return prisma.missionNpc.findMany({
        include: { mission: true, npc: true }
    });
};

const getMissionNpcById = async (MissionId, npcId) => {
    return prisma.missionNpc.findUnique({
        where: { MissionId_npcId: { MissionId, npcId } },
        include: { mission: true, npc: true }
    });
};

const createMissionNpc = async (data) => {
    return prisma.missionNpc.create({ data });
};

const updateMissionNpc = async (MissionId, npcId, data) => {
    return prisma.missionNpc.update({
        where: { MissionId_npcId: { MissionId, npcId } },
        data
    });
};

const deleteMissionNpc = async (MissionId, npcId) => {
    return prisma.missionNpc.delete({
        where: { MissionId_npcId: { MissionId, npcId } }
    });
};

module.exports = {
    getAllRaces,
    getRaceById,
    createRace,
    updateRace,
    deleteRace,
    getAllClasses,
    getClassById,
    createClass,
    updateClass,
    deleteClass,
    getAllSubclasses,
    getSubclassById,
    createSubclass,
    updateSubclass,
    deleteSubclass,
    getAllRaceAbilities,
    getRaceAbilityById,
    createRaceAbility,
    updateRaceAbility,
    deleteRaceAbility,
    getAllSubraces,
    getSubraceById,
    createSubrace,
    updateSubrace,
    deleteSubrace,
    getAllSubraceAbilities,
    getSubraceAbilityById,
    createSubraceAbility,
    updateSubraceAbility,
    deleteSubraceAbility,
    getAllSpells,
    getSpellById,
    createSpell,
    updateSpell,
    deleteSpell,
    getAllItems,
    getItemById,
    createItem,
    updateItem,
    deleteItem,
    getAllFeatures,
    getFeatureById,
    createFeature,
    updateFeature,
    deleteFeature,
    getAllFeats,
    getFeatById,
    createFeat,
    updateFeat,
    deleteFeat,
    getAllMissionNpcs,
    getMissionNpcById,
    createMissionNpc,
    updateMissionNpc,
    deleteMissionNpc,
};
