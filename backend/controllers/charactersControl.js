'use strict';
require('dotenv').config();
const { PrismaClient } = require("../generated/prisma/client");
const z = require("zod");
const prisma = new PrismaClient();

const statsSchema = z.object({
    str: z.number().int().min(1).max(30),
    dex: z.number().int().min(1).max(30),
    con: z.number().int().min(1).max(30),
    int: z.number().int().min(1).max(30),
    wis: z.number().int().min(1).max(30),
    cha: z.number().int().min(1).max(30)
});

const createCharacterSchema = z.object({
    name: z.string().min(1).max(60),
    background: z.string().optional(),
    alignment: z.string().optional(),
    level: z.number().int().min(1).max(20).optional(),
    raceId: z.string().optional(),
    classId: z.string().optional(),
    subclassId: z.string().optional(),
    campaignId: z.string().optional(),
    personalityTraits: z.string().optional(),
    ideals: z.string().optional(),
    bonds: z.string().optional(),
    flaws: z.string().optional(),
    stats: statsSchema.optional()
});

const updateCharacterSchema = z.object({
    name: z.string().min(1).max(60).optional(),
    background: z.string().nullable().optional(),
    alignment: z.string().nullable().optional(),
    level: z.number().int().min(1).max(20).optional(),
    raceId: z.string().nullable().optional(),
    classId: z.string().nullable().optional(),
    subclassId: z.string().nullable().optional(),
    campaignId: z.string().nullable().optional(),
    personalityTraits: z.string().nullable().optional(),
    ideals: z.string().nullable().optional(),
    bonds: z.string().nullable().optional(),
    flaws: z.string().nullable().optional(),
    stats: statsSchema.optional()
});

async function ensureOwnership(characterId, userId) {
    const c = await prisma.character.findUnique({
        where: { id: characterId },
        select: { id: true, ownerId: true }
    });
    if (!c) return { error: { status: 404, message: "Character not found" } };
    if (c.ownerId !== userId) return { error: { status: 403, message: "Forbidden" } };
    return { character: c };
}

const createCharacter = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

        const parsed = createCharacterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Validation failed", error: parsed.error.format() });
        }

        const data = parsed.data;

        const created = await prisma.character.create({
            data: {
                name: data.name,
                ownerId: user.id,
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
                stats: data.stats
                    ? { create: { ...data.stats } }
                    : undefined
            },
            include: { stats: true }
        });

        return res.status(201).json(created);
    } catch (err) {
        return res.status(500).json({ message: "Failed to create character", error: String(err) });
    }
};


const getCharacterById = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;

        const { error } = await ensureOwnership(id, user.id);
        if (error) return res.status(error.status).json({ message: error.message });

        const character = await prisma.character.findUnique({
            where: { id },
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

        return res.status(200).json(character);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch character", error: String(err) });
    }
};

const listMyCharacters = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

        const characters = await prisma.character.findMany({
            where: { ownerId: user.id },
            select: {
                id: true,
                name: true,
                level: true,
                background: true,
                alignment: true,
                classId: true,
                raceId: true,
                campaignId: true,
                updatedAt: true
            }
        });

        return res.status(200).json(characters);
    } catch (err) {
        return res.status(500).json({ message: "Failed to list characters", error: String(err) });
    }
};

const updateCharacter = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;

        const parsed = updateCharacterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Validation failed", error: parsed.error.format() });
        }

        const { error } = await ensureOwnership(id, user.id);
        if (error) return res.status(error.status).json({ message: error.message });

        const data = parsed.data;

        const updated = await prisma.character.update({
            where: { id },
            data: {
                name: data.name,
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

        return res.status(200).json(updated);
    } catch (err) {
        return res.status(500).json({ message: "Failed to update character", error: String(err) });
    }
};

// DELETE /characters/:id
const deleteCharacter = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;

        const { error } = await ensureOwnership(id, user.id);
        if (error) return res.status(error.status).json({ message: error.message });

        await prisma.character.delete({ where: { id } });
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete character", error: String(err) });
    }
};

module.exports = {
    createCharacter,
    getCharacterById,
    listMyCharacters,
    updateCharacter,
    deleteCharacter
};
