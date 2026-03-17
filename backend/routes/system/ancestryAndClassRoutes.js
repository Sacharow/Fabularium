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
} = require("../../controllers/systemControllers");
const { checkAdmin } = require("../../middleware/safety");

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

module.exports = router;