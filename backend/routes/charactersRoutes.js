'use strict'

const {createCharacter, deleteCharacter, updateCharacter, listMyCharacters, getCharacterById} = require("../controllers/charactersControl");
const {checkOwnership} = require("../middleware/safety");
const router = require("express").Router();

router.get("/mycharacters", listMyCharacters);
router.post("/", createCharacter);
router.get("/character/:id", checkOwnership, getCharacterById);
router.delete("/:id", checkOwnership, deleteCharacter);
router.put("/:id", checkOwnership, updateCharacter);

module.exports = router;