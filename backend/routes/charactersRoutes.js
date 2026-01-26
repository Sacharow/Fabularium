'use strict'

const {createCharacter, deleteCharacter, updateCharacter, listMyCharacters, getCharacterById} = require("../controllers/charactersControl");
const {checkOwnership} = require("../middleware/safety");
const router = require("express").Router();

router.get("/mycharacters", listMyCharacters);
router.post("/", createCharacter);
router.get("/:id", checkOwnership("character"), getCharacterById);
router.delete("/:id", checkOwnership("character"), deleteCharacter);
router.put("/:id", checkOwnership("character"), updateCharacter);

module.exports = router;