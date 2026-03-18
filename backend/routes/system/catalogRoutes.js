'use strict';

const router = require("express").Router();
const {
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
} = require("../../controllers/systemControllers");
const { checkAdmin } = require("../../middleware/safety");

router.get("/spells", getAllSpells);
router.get("/spells/:id", getSpellById);
router.post("/spells", checkAdmin, createSpell);
router.put("/spells/:id", checkAdmin, updateSpell);
router.delete("/spells/:id", checkAdmin, deleteSpell);

router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.post("/items", checkAdmin, createItem);
router.put("/items/:id", checkAdmin, updateItem);
router.delete("/items/:id", checkAdmin, deleteItem);

router.get("/features", getAllFeatures);
router.get("/features/:id", getFeatureById);
router.post("/features", checkAdmin, createFeature);
router.put("/features/:id", checkAdmin, updateFeature);
router.delete("/features/:id", checkAdmin, deleteFeature);

router.get("/feats", getAllFeats);
router.get("/feats/:id", getFeatById);
router.post("/feats", checkAdmin, createFeat);
router.put("/feats/:id", checkAdmin, updateFeat);
router.delete("/feats/:id", checkAdmin, deleteFeat);

module.exports = router;