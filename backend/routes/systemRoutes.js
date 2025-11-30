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

router.get("/races", getAllRaces);
router.get("/races/:id", getRaceById);
router.post("/races", createRace);
router.put("/races/:id", updateRace);
router.delete("/races/:id", deleteRace);

router.get("/classes", getAllClasses);
router.get("/classes/:id", getClassById);
router.post("/classes", createClass);
router.put("/classes/:id", updateClass);
router.delete("/classes/:id", deleteClass);

router.get("/subclasses", getAllSubclasses);
router.get("/subclasses/:id", getSubclassById);
router.post("/subclasses", createSubclass);
router.put("/subclasses/:id", updateSubclass);
router.delete("/subclasses/:id", deleteSubclass);

router.get("/race-abilities", getAllRaceAbilities);
router.get("/race-abilities/:id", getRaceAbilityById);
router.post("/race-abilities", createRaceAbility);
router.put("/race-abilities/:id", updateRaceAbility);
router.delete("/race-abilities/:id", deleteRaceAbility);

router.get("/spells", getAllSpells);
router.get("/spells/:id", getSpellById);
router.post("/spells", createSpell);
router.put("/spells/:id", updateSpell);
router.delete("/spells/:id", deleteSpell);

router.get("/items", getAllItems);
router.get("/items/:id", getItemById);
router.post("/items", createItem);
router.put("/items/:id", updateItem);
router.delete("/items/:id", deleteItem);

router.get("/features", getAllFeatures);
router.get("/features/:id", getFeatureById);
router.post("/features", createFeature);
router.put("/features/:id", updateFeature);
router.delete("/features/:id", deleteFeature);

router.get("/feats", getAllFeats);
router.get("/feats/:id", getFeatById);
router.post("/feats", createFeat);
router.put("/feats/:id", updateFeat);
router.delete("/feats/:id", deleteFeat);

module.exports = router;