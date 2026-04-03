'use strict';

const systemService = require("../../services/systemService");
const {
    spellSchema,
    itemSchema,
    featureSchema,
    featSchema
} = require("../../schemas/systemSchemas");

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
        return res.status(204).send();
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
        return res.status(204).send();
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
        return res.status(204).send();
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
        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Error deleting feat", error: err });
    }
};

module.exports = {
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
};
