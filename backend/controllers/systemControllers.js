'use strict';
require('dotenv').config();
const { PrismaClient } = require("../generated/prisma/client");
const z = require("zod");

const prisma = new PrismaClient();

const raceSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    size: z.enum(['Tiny', 'Small', 'Medium', 'Large', 'Huge', 'Gargantuan']).optional(),
    speed: z.number().int().optional(),
    languages: z.string().optional()
});

const getAllRaces = async (req, res) => {
    try {
        const races = await prisma.race.findMany({
            include: { raceAbilities: true, subRaces: true }
        });
        return res.status(200).json(races);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching races", error: err });
    }
};

const getRaceById = async (req, res) => {
    try {
        const race = await prisma.race.findUnique({
            where: { id: req.params.id },
            include: { raceAbilities: true, subRaces: { include: { subRaceAbilities: true } } }
        });
        if (!race) {
            return res.status(404).json({ message: "Race not found" });
        }
        return res.status(200).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race", error: err });
    }
};

const createRace = async (req, res) => {
    try {
        const data = raceSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const race = await prisma.race.create({ data: data.data });
        return res.status(201).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error creating race", error: err });
    }
};

const updateRace = async (req, res) => {
    try {
        const data = raceSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const race = await prisma.race.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error updating race", error: err });
    }
};

const deleteRace = async (req, res) => {
    try {
        await prisma.race.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Race deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting race", error: err });
    }
};

const classSchema = z.object({
    name: z.string().min(1),
    hitDie: z.number().int(),
    spellcasting: z.boolean().default(false),
    savingThrows: z.array(), 
    description: z.string().optional()
});

const getAllClasses = async (req, res) => {
    try {
        const classes = await prisma.class.findMany({
            include: { subclasses: true, progressions: true }
        });
        return res.status(200).json(classes);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching classes", error: err });
    }
};

const getClassById = async (req, res) => {
    try {
        const classData = await prisma.class.findUnique({
            where: { id: req.params.id },
            include: { subclasses: true, progressions: true }
        });
        if (!classData) {
            return res.status(404).json({ message: "Class not found" });
        }
        return res.status(200).json(classData);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching class", error: err });
    }
};

const createClass = async (req, res) => {
    try {
        const data = classSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const classData = await prisma.class.create({ data: data.data });
        return res.status(201).json(classData);
    } catch (err) {
        return res.status(500).json({ message: "Error creating class", error: err });
    }
};

const updateClass = async (req, res) => {
    try {
        const data = classSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const classData = await prisma.class.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(classData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating class", error: err });
    }
};

const deleteClass = async (req, res) => {
    try {
        await prisma.class.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Class deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting class", error: err });
    }
};

const subclassSchema = z.object({
    name: z.string().min(1),
    classId: z.string(),
    description: z.string().optional()
});

const getAllSubclasses = async (req, res) => {
    try {
        const subclasses = await prisma.subclass.findMany({
            include: { class: true }
        });
        return res.status(200).json(subclasses);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subclasses", error: err });
    }
};

const getSubclassById = async (req, res) => {
    try {
        const subclass = await prisma.subclass.findUnique({
            where: { id: req.params.id },
            include: { class: true }
        });
        if (!subclass) {
            return res.status(404).json({ message: "Subclass not found" });
        }
        return res.status(200).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subclass", error: err });
    }
};

const createSubclass = async (req, res) => {
    try {
        const data = subclassSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subclass = await prisma.subclass.create({ data: data.data });
        return res.status(201).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error creating subclass", error: err });
    }
};

const updateSubclass = async (req, res) => {
    try {
        const data = subclassSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subclass = await prisma.subclass.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subclass", error: err });
    }
};

const deleteSubclass = async (req, res) => {
    try {
        await prisma.subclass.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Subclass deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subclass", error: err });
    }
};

const raceAbilitySchema = z.object({
    name: z.string().min(1),
    raceId: z.string().uuid(),
    description: z.string().optional()
});


const getAllRaceAbilities = async (req, res) => {
    try {
        const raceAbilities = await prisma.raceAbility.findMany({
            include: { race: true }
        });
        return res.status(200).json(raceAbilities);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race abilities", error: err });
    }
};

const getRaceAbilityById = async (req, res) => {
    try {
        const raceAbility = await prisma.raceAbility.findUnique({
            where: { id: req.params.id },
            include: { race: true }
        });
        if (!raceAbility) {
            return res.status(404).json({ message: "Race ability not found" });
        }
        return res.status(200).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race ability", error: err });
    }
};

const createRaceAbility = async (req, res) => {
    try {
        const data = raceAbilitySchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const raceAbility = await prisma.raceAbility.create({ data: data.data });
        return res.status(201).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error creating race ability", error: err });
    }
};

const updateRaceAbility = async (req, res) => {
    try {
        const data = raceAbilitySchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const raceAbility = await prisma.raceAbility.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error updating race ability", error: err });
    }
};

const deleteRaceAbility = async (req, res) => {
    try {
        await prisma.raceAbility.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Race ability deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting race ability", error: err });
    }
};

const subraceSchema = z.object({
    parentRaceId: z.string().min(1),
    name: z.string().min(1),
    description: z.string().optional()
});

const getAllSubraces = async (req, res) => {
    try {
        const subraces = await prisma.subRace.findMany({
            include: { parentRace: true, subRaceAbilities: true }
        });
        return res.status(200).json(subraces);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subraces", error: err });
    }
};

const getSubraceById = async (req, res) => {
    try {
        const subrace = await prisma.subRace.findUnique({
            where: { id: req.params.id },
            include: { parentRace: true, subRaceAbilities: true }
        });
        if (!subrace) {
            return res.status(404).json({ message: "Subrace not found" });
        }
        return res.status(200).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace", error: err });
    }
};

const createSubrace = async (req, res) => {
    try {
        const data = subraceSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }

        const parentRace = await prisma.race.findUnique({
            where: { id: data.data.parentRaceId }
        });
        if (!parentRace) {
            return res.status(404).json({ message: "Parent race not found" });
        }
        
        const subrace = await prisma.subRace.create({ data: data.data });
        return res.status(201).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error creating subrace", error: err });
    }
};

const updateSubrace = async (req, res) => {
    try {
        const data = subraceSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subrace = await prisma.subRace.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subrace", error: err });
    }
};

const deleteSubrace = async (req, res) => {
    try {
        await prisma.subRace.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Subrace deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subrace", error: err });
    }
};

const subraceAbilitySchema = z.object({
    subRaceId: z.string(),
    name: z.string().min(1),
    description: z.string().optional()
});

const getAllSubraceAbilities = async (req, res) => {
    try {
        const subraceAbilities = await prisma.subRaceAbility.findMany({
            include: { subRace: true }
        });
        return res.status(200).json(subraceAbilities);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace abilities", error: err });
    }
};

const getSubraceAbilityById = async (req, res) => {
    try {
        const subraceAbility = await prisma.subRaceAbility.findUnique({
            where: { id: req.params.id },
            include: { subRace: true }
        });
        if (!subraceAbility) {
            return res.status(404).json({ message: "Subrace ability not found" });
        }
        return res.status(200).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace ability", error: err });
    }
};

const createSubraceAbility = async (req, res) => {
    try {
        const data = subraceAbilitySchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }

        const subRace = await prisma.subRace.findUnique({
            where: { id: data.data.subRaceId }
        });

        if (!subRace) {
            return res.status(404).json({ message: "Subrace not found" });
        }
        
        const subraceAbility = await prisma.subRaceAbility.create({ data: data.data });
        return res.status(201).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error creating subrace ability", error: err });
    }
};

const updateSubraceAbility = async (req, res) => {
    try {
        const data = subraceAbilitySchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const subraceAbility = await prisma.subRaceAbility.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subrace ability", error: err });
    }
};

const deleteSubraceAbility = async (req, res) => {
    try {
        await prisma.subRaceAbility.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Subrace ability deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subrace ability", error: err });
    }
};

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

const getAllSpells = async (req, res) => {
    try {
        const spells = await prisma.spell.findMany();
        return res.status(200).json(spells);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching spells", error: err });
    }
};

const getSpellById = async (req, res) => {
    try {
        const spell = await prisma.spell.findUnique({
            where: { id: req.params.id }
        });
        if (!spell) {
            return res.status(404).json({ message: "Spell not found" });
        }
        return res.status(200).json(spell);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching spell", error: err });
    }
};

const createSpell = async (req, res) => {
    try {
        const data = spellSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const spell = await prisma.spell.create({ data: data.data });
        return res.status(201).json(spell);
    } catch (err) {
        return res.status(500).json({ message: "Error creating spell", error: err });
    }
};

const updateSpell = async (req, res) => {
    try {
        const data = spellSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const spell = await prisma.spell.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(spell);
    } catch (err) {
        return res.status(500).json({ message: "Error updating spell", error: err });
    }
};

const deleteSpell = async (req, res) => {
    try {
        await prisma.spell.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Spell deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting spell", error: err });
    }
};

const itemSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    description: z.string().optional(),
    weight: z.number().optional(),
    value: z.number().int().optional(),
    properties: z.string().optional()
});

const getAllItems = async (req, res) => {
    try {
        const items = await prisma.item.findMany();
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching items", error: err });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await prisma.item.findUnique({
            where: { id: req.params.id }
        });
        if (!item) {
            return res.status(404).json({ message: "Item not found" });
        }
        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching item", error: err });
    }
};

const createItem = async (req, res) => {
    try {
        const data = itemSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const item = await prisma.item.create({ data: data.data });
        return res.status(201).json(item);
    } catch (err) {
        return res.status(500).json({ message: "Error creating item", error: err });
    }
};

const updateItem = async (req, res) => {
    try {
        const data = itemSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const item = await prisma.item.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({ message: "Error updating item", error: err });
    }
};

const deleteItem = async (req, res) => {
    try {
        await prisma.item.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Item deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting item", error: err });
    }
};

const featureSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional(),
    sourceType: z.string().optional(),
    sourceId: z.string().optional()
});

const getAllFeatures = async (req, res) => {
    try {
        const features = await prisma.feature.findMany();
        return res.status(200).json(features);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching features", error: err });
    }
};

const getFeatureById = async (req, res) => {
    try {
        const feature = await prisma.feature.findUnique({
            where: { id: req.params.id }
        });
        if (!feature) {
            return res.status(404).json({ message: "Feature not found" });
        }
        return res.status(200).json(feature);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching feature", error: err });
    }
};

const createFeature = async (req, res) => {
    try {
        const data = featureSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const feature = await prisma.feature.create({ data: data.data });
        return res.status(201).json(feature);
    } catch (err) {
        return res.status(500).json({ message: "Error creating feature", error: err });
    }
};

const updateFeature = async (req, res) => {
    try {
        const data = featureSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const feature = await prisma.feature.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(feature);
    } catch (err) {
        return res.status(500).json({ message: "Error updating feature", error: err });
    }
};

const deleteFeature = async (req, res) => {
    try {
        await prisma.feature.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Feature deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting feature", error: err });
    }
};

const featSchema = z.object({
    name: z.string().min(1),
    description: z.string().optional()
});

const getAllFeats = async (req, res) => {
    try {
        const feats = await prisma.feat.findMany();
        return res.status(200).json(feats);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching feats", error: err });
    }
};

const getFeatById = async (req, res) => {
    try {
        const feat = await prisma.feat.findUnique({
            where: { id: req.params.id }
        });
        if (!feat) {
            return res.status(404).json({ message: "Feat not found" });
        }
        return res.status(200).json(feat);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching feat", error: err });
    }
};

const createFeat = async (req, res) => {
    try {
        const data = featSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const feat = await prisma.feat.create({ data: data.data });
        return res.status(201).json(feat);
    } catch (err) {
        return res.status(500).json({ message: "Error creating feat", error: err });
    }
};

const updateFeat = async (req, res) => {
    try {
        const data = featSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const feat = await prisma.feat.update({
            where: { id: req.params.id },
            data: data.data
        });
        return res.status(200).json(feat);
    } catch (err) {
        return res.status(500).json({ message: "Error updating feat", error: err });
    }
};

const deleteFeat = async (req, res) => {
    try {
        await prisma.feat.delete({ where: { id: req.params.id } });
        return res.status(200).json({ message: "Feat deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting feat", error: err });
    }
};

module.exports = {

    getAllRaces,
    getRaceById,
    createRace,
    updateRace,
    deleteRace,

    getAllSubraces,
    getSubraceById,
    createSubrace,
    updateSubrace,
    deleteSubrace,

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
    
    // Feat
    getAllFeats,
    getFeatById,
    createFeat,
    updateFeat,
    deleteFeat
};
