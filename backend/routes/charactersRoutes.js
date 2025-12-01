'use strict'

const {createCharacter, deleteCharacter, updateCharacter, listMyCharacters} = require("../controllers/charactersControl");
const {checkOwnership} = require("../middleware/safety");
const router = require("express").Router();

router.get("/mycharactrs", checkOwnership, listMyCharacters);
router.post("/", checkOwnership, createCharacter);
router.delete("/:id", checkOwnership, deleteCharacter);
router.patch("/:id", checkOwnership, updateCharacter);

module.exports = router;