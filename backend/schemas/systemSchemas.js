'use strict';

const z = require("zod");

const raceSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    size: z.enum(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']).optional(),
    speed: z.number().int().optional(),
    languages: z.string().optional()
});

const classSchema = z.object({
    name: z.string().min(1),
    hitDie: z.number().int(),
    spellcasting: z.boolean().default(false),
    savingThrows: z.array(), 
    description: z.string().optional()
});

const subclassSchema = z.object({
    name: z.string().min(1),
    classId: z.string(),
    description: z.string().optional()
});

const raceAbilitySchema = z.object({
    name: z.string().min(1),
    raceId: z.string().uuid(),
    description: z.string().optional()
});

const subraceSchema = z.object({
    parentRaceId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional()
});

const subraceAbilitySchema = z.object({
    subRaceId: z.string(),
    name: z.string().min(1),
    description: z.string().optional()
});

const spellSchema = z.object({
    name: z.string().min(1),
    level: z.number().int().min(0).max(9),
    school: z.string().optional(),
    castingTime: z.string().optional(),
    range: z.string().optional(),
    components: z.string().optional(),
    duration: z.string().optional(),
    description: z.string().optional()
});

const itemSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    description: z.string().optional(),
    weight: z.number().optional(),
    value: z.number().int().optional(),
    properties: z.string().optional()
});

const featureSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    sourceType: z.string().optional(),
    sourceId: z.string().optional()
});

const featSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional()
});

const missionNpcSchema = z.object({
    MissionId: z.string().min(1),
    npcId: z.string().min(1)
});

module.exports = {
    raceSchema,
    classSchema,
    subclassSchema,
    raceAbilitySchema,
    subraceSchema,
    subraceAbilitySchema,
    spellSchema,
    itemSchema,
    featureSchema,
    featSchema,
    missionNpcSchema,
};
