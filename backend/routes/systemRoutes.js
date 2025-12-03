'use strict';

const router = require("express").Router();
const {
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
    deleteFeat
} = require("../controllers/systemControllers");
const { checkAdmin } = require("../middleware/safety");

router.get("/races", getAllRaces);
router.get("/races/:id", getRaceById);
router.post("/races", checkAdmin, createRace);
router.put("/races/:id", checkAdmin, updateRace);
router.delete("/races/:id", checkAdmin, deleteRace);

router.get("/classes", getAllClasses);
router.get("/classes/:id", getClassById);
router.post("/classes", checkAdmin, createClass);
router.put("/classes/:id", checkAdmin, updateClass);
router.delete("/classes/:id", checkAdmin, deleteClass);

router.get("/subclasses", getAllSubclasses);
router.get("/subclasses/:id", getSubclassById);
router.post("/subclasses", checkAdmin, createSubclass);
router.put("/subclasses/:id", checkAdmin, updateSubclass);
router.delete("/subclasses/:id", checkAdmin, deleteSubclass);

router.get("/race-abilities", getAllRaceAbilities);
router.get("/race-abilities/:id", getRaceAbilityById);
router.post("/race-abilities", checkAdmin, createRaceAbility);
router.put("/race-abilities/:id", checkAdmin, updateRaceAbility);
router.delete("/race-abilities/:id", checkAdmin, deleteRaceAbility);

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