'use strict';

const prisma = require("../config/database");

const mapCharacterForeignKeyError = (err) => {
    if (err?.code !== "P2003") {
        return null;
    }

    const fieldName = String(err?.meta?.field_name || "");

    if (fieldName.includes("raceId")) {
        return { status: 400, message: "Invalid raceId" };
    }

    if (fieldName.includes("classId")) {
        return { status: 400, message: "Invalid classId" };
    }

    if (fieldName.includes("subclassId")) {
        return { status: 400, message: "Invalid subclassId" };
    }

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
        select: { id: true, ownerId: true }
    });

    if (!character) {
        return { error: { status: 404, message: "Character not found" } };
    }

    if (character.ownerId !== userId) {
        return { error: { status: 403, message: "Forbidden" } };
    }

    return { character };
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
                raceId: data.raceId ?? null,
                classId: data.classId ?? null,
                subclassId: data.subclassId ?? null,
                campaignId: data.campaignId ?? null,
                personalityTraits: data.personalityTraits ?? null,
                ideals: data.ideals ?? null,
                bonds: data.bonds ?? null,
                flaws: data.flaws ?? null,
                stats: data.stats ? { create: { ...data.stats } } : undefined
            },
            include: { stats: true }
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
        include: {
            stats: true,
            saves: true,
            combat: true,
            currency: true,
            proficiencies: true,
            features: true,
            skills: true,
            inventoryItems: { include: { item: true } },
            knownSpells: { include: { spell: true } },
            preparedSpells: { include: { spell: true } },
            spellSlots: true
        }
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
            classId: true,
            raceId: true,
            campaignId: true,
            updatedAt: true,
            class: { select: { name: true } },
            race: { select: { name: true } }
        }
    });
};

const updateOwnedCharacter = async (characterId, userId, data) => {
    const ownership = await ensureOwnership(characterId, userId);
    if (ownership.error) {
        return { error: ownership.error };
    }

    let character;

    try {
        character = await prisma.character.update({
            where: { id: characterId },
            data: {
                name: data.name,
                image: data.image ?? undefined,
                icon: data.icon ?? undefined,
                background: data.background ?? undefined,
                alignment: data.alignment ?? undefined,
                level: data.level,
                raceId: data.raceId ?? undefined,
                classId: data.classId ?? undefined,
                subclassId: data.subclassId ?? undefined,
                campaignId: data.campaignId ?? undefined,
                personalityTraits: data.personalityTraits ?? undefined,
                ideals: data.ideals ?? undefined,
                bonds: data.bonds ?? undefined,
                flaws: data.flaws ?? undefined,
                stats: data.stats
                    ? {
                        upsert: {
                            create: { ...data.stats },
                            update: { ...data.stats }
                        }
                    }
                    : undefined
            },
            include: { stats: true }
        });
    } catch (err) {
        const mapped = mapCharacterForeignKeyError(err);
        if (mapped) {
            throwMappedError(mapped);
        }
        throw err;
    }

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
