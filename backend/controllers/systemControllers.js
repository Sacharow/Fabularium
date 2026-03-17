'use strict';
require('dotenv').config();
const systemService = require("../services/systemService");
const {
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
    missionNpcSchema
} = require("../schemas/systemSchemas");

const getAllRaces = async (req, res) => {
    try {
        const races = await systemService.getAllRaces();
        return res.status(200).json(races);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching races", error: err });
    }
};

const getRaceById = async (req, res) => {
    try {
        const race = await systemService.getRaceById(req.params.id);
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
        const race = await systemService.createRace(data.data);
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
        const race = await systemService.updateRace(req.params.id, data.data);
        return res.status(200).json(race);
    } catch (err) {
        return res.status(500).json({ message: "Error updating race", error: err });
    }
};

const deleteRace = async (req, res) => {
    try {
        await systemService.deleteRace(req.params.id);
        return res.status(200).json({ message: "Race deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting race", error: err });
    }
};

const getAllClasses = async (req, res) => {
    try {
        const classes = await systemService.getAllClasses();
        return res.status(200).json(classes);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching classes", error: err });
    }
};

const getClassById = async (req, res) => {
    try {
        const classData = await systemService.getClassById(req.params.id);
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
        const classData = await systemService.createClass(data.data);
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
        const classData = await systemService.updateClass(req.params.id, data.data);
        return res.status(200).json(classData);
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: "Error updating class", error: err });
    }
};

const deleteClass = async (req, res) => {
    try {
        await systemService.deleteClass(req.params.id);
        return res.status(200).json({ message: "Class deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting class", error: err });
    }
};

const getAllSubclasses = async (req, res) => {
    try {
        const subclasses = await systemService.getAllSubclasses();
        return res.status(200).json(subclasses);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subclasses", error: err });
    }
};

const getSubclassById = async (req, res) => {
    try {
        const subclass = await systemService.getSubclassById(req.params.id);
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
        const subclass = await systemService.createSubclass(data.data);
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
        const subclass = await systemService.updateSubclass(req.params.id, data.data);
        return res.status(200).json(subclass);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subclass", error: err });
    }
};

const deleteSubclass = async (req, res) => {
    try {
        await systemService.deleteSubclass(req.params.id);
        return res.status(200).json({ message: "Subclass deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subclass", error: err });
    }
};

const getAllRaceAbilities = async (req, res) => {
    try {
        const raceAbilities = await systemService.getAllRaceAbilities();
        return res.status(200).json(raceAbilities);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching race abilities", error: err });
    }
};

const getRaceAbilityById = async (req, res) => {
    try {
        const raceAbility = await systemService.getRaceAbilityById(req.params.id);
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
        const raceAbility = await systemService.createRaceAbility(data.data);
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
        const raceAbility = await systemService.updateRaceAbility(req.params.id, data.data);
        return res.status(200).json(raceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error updating race ability", error: err });
    }
};

const deleteRaceAbility = async (req, res) => {
    try {
        await systemService.deleteRaceAbility(req.params.id);
        return res.status(200).json({ message: "Race ability deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting race ability", error: err });
    }
};

const getAllSubraces = async (req, res) => {
    try {
        const subraces = await systemService.getAllSubraces();
        return res.status(200).json(subraces);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subraces", error: err });
    }
};

const getSubraceById = async (req, res) => {
    try {
        const subrace = await systemService.getSubraceById(req.params.id);
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

        const { error, subrace } = await systemService.createSubrace(data.data);
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

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
        const subrace = await systemService.updateSubrace(req.params.id, data.data);
        return res.status(200).json(subrace);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subrace", error: err });
    }
};

const deleteSubrace = async (req, res) => {
    try {
        await systemService.deleteSubrace(req.params.id);
        return res.status(200).json({ message: "Subrace deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subrace", error: err });
    }
};

const getAllSubraceAbilities = async (req, res) => {
    try {
        const subraceAbilities = await systemService.getAllSubraceAbilities();
        return res.status(200).json(subraceAbilities);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching subrace abilities", error: err });
    }
};

const getSubraceAbilityById = async (req, res) => {
    try {
        const subraceAbility = await systemService.getSubraceAbilityById(req.params.id);
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

        const { error, subraceAbility } = await systemService.createSubraceAbility(data.data);
        if (error) {
            return res.status(error.status).json({ message: error.message });
        }

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
        const subraceAbility = await systemService.updateSubraceAbility(req.params.id, data.data);
        return res.status(200).json(subraceAbility);
    } catch (err) {
        return res.status(500).json({ message: "Error updating subrace ability", error: err });
    }
};

const deleteSubraceAbility = async (req, res) => {
    try {
        await systemService.deleteSubraceAbility(req.params.id);
        return res.status(200).json({ message: "Subrace ability deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting subrace ability", error: err });
    }
};

const getAllSpells = async (req, res) => {
    try {
        const spells = await systemService.getAllSpells();
        return res.status(200).json(spells);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching spells", error: err });
    }
};

const getSpellById = async (req, res) => {
    try {
        const spell = await systemService.getSpellById(req.params.id);
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
        const spell = await systemService.createSpell(data.data);
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
        const spell = await systemService.updateSpell(req.params.id, data.data);
        return res.status(200).json(spell);
    } catch (err) {
        return res.status(500).json({ message: "Error updating spell", error: err });
    }
};

const deleteSpell = async (req, res) => {
    try {
        await systemService.deleteSpell(req.params.id);
        return res.status(200).json({ message: "Spell deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting spell", error: err });
    }
};

const getAllItems = async (req, res) => {
    try {
        const items = await systemService.getAllItems();
        return res.status(200).json(items);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching items", error: err });
    }
};

const getItemById = async (req, res) => {
    try {
        const item = await systemService.getItemById(req.params.id);
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
        const item = await systemService.createItem(data.data);
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
        const item = await systemService.updateItem(req.params.id, data.data);
        return res.status(200).json(item);
    } catch (err) {
        return res.status(500).json({ message: "Error updating item", error: err });
    }
};

const deleteItem = async (req, res) => {
    try {
        await systemService.deleteItem(req.params.id);
        return res.status(200).json({ message: "Item deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting item", error: err });
    }
};

const getAllFeatures = async (req, res) => {
    try {
        const features = await systemService.getAllFeatures();
        return res.status(200).json(features);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching features", error: err });
    }
};

const getFeatureById = async (req, res) => {
    try {
        const feature = await systemService.getFeatureById(req.params.id);
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
        const feature = await systemService.createFeature(data.data);
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
        const feature = await systemService.updateFeature(req.params.id, data.data);
        return res.status(200).json(feature);
    } catch (err) {
        return res.status(500).json({ message: "Error updating feature", error: err });
    }
};

const deleteFeature = async (req, res) => {
    try {
        await systemService.deleteFeature(req.params.id);
        return res.status(200).json({ message: "Feature deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting feature", error: err });
    }
};

const getAllFeats = async (req, res) => {
    try {
        const feats = await systemService.getAllFeats();
        return res.status(200).json(feats);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching feats", error: err });
    }
};

const getFeatById = async (req, res) => {
    try {
        const feat = await systemService.getFeatById(req.params.id);
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
        const feat = await systemService.createFeat(data.data);
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
        const feat = await systemService.updateFeat(req.params.id, data.data);
        return res.status(200).json(feat);
    } catch (err) {
        return res.status(500).json({ message: "Error updating feat", error: err });
    }
};

const deleteFeat = async (req, res) => {
    try {
        await systemService.deleteFeat(req.params.id);
        return res.status(200).json({ message: "Feat deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting feat", error: err });
    }
};

const getAllMissionNpcs = async (req, res) => {
    try {
        const missionNpcs = await systemService.getAllMissionNpcs();
        return res.status(200).json(missionNpcs);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching mission NPCs", error: err });
    }
};

const getMissionNpcById = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        const missionNpc = await systemService.getMissionNpcById(MissionId, npcId);
        if (!missionNpc) {
            return res.status(404).json({ message: "MissionNpc not found" });
        }
        return res.status(200).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching mission NPC", error: err });
    }
};

const createMissionNpc = async (req, res) => {
    try {
        const data = missionNpcSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const missionNpc = await systemService.createMissionNpc(data.data);
        return res.status(201).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error creating mission NPC", error: err });
    }
};

const updateMissionNpc = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        const data = missionNpcSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const missionNpc = await systemService.updateMissionNpc(MissionId, npcId, data.data);
        return res.status(200).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error updating mission NPC", error: err });
    }
};

const deleteMissionNpc = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        await systemService.deleteMissionNpc(MissionId, npcId);
        return res.status(200).json({ message: "MissionNpc deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting mission NPC", error: err });
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
    deleteFeat,

    getAllMissionNpcs,
    getMissionNpcById,
    createMissionNpc,
    updateMissionNpc,
    deleteMissionNpc
};
