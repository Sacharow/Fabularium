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
    getAllSubraces,
    getSubraceById,
    createSubrace,
    updateSubrace,
    deleteSubrace,
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

router.get("/subraces", getAllSubraces);
router.get("/subraces/:id", getSubraceById);
router.post("/subraces", checkAdmin, createSubrace);
router.put("/subraces/:id", checkAdmin, updateSubrace);
router.delete("/subraces/:id", checkAdmin, deleteSubrace);

router.get("/race-abilities", getAllRaceAbilities);
router.get("/race-abilities/:id", getRaceAbilityById);
router.post("/race-abilities", checkAdmin, createRaceAbility);
router.put("/race-abilities/:id", checkAdmin, updateRaceAbility);
router.delete("/race-abilities/:id", checkAdmin, deleteRaceAbility);

router.get("/subrace-abilities", getAllSubraceAbilities);
router.get("/subrace-abilities/:id", getSubraceAbilityById);
router.post("/subrace-abilities", checkAdmin, createSubraceAbility);
router.put("/subrace-abilities/:id", checkAdmin, updateSubraceAbility);
router.delete("/subrace-abilities/:id", checkAdmin, deleteSubraceAbility);

module.exports = router;