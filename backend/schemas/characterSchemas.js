'use strict';

const z = require("zod");

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

module.exports = {
    statsSchema,
    createCharacterSchema,
    updateCharacterSchema
};
