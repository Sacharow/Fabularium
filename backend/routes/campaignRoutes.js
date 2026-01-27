"use strict";

const express = require("express");
const router = express.Router();

const {
	createCampaign,
	getCampaigns,
	getCampaignById,
	updateCampaign,
	deleteCampaign,
	generateJoinCode,
	joinCampaignUsingCode,
	addContributor,
	removeContributor,
	listContributors,
	listCampaignCharacters,
	addNPC,
	getNPCs,
	getNPCById,
	updateNPC,
	deleteNPC,
	listCampaignNPCs
} = require("../controllers/campaignControllers");

const { auth } = require("../middleware/safety");


router.get("/", getCampaigns);
router.get("/:id", getCampaignById);
router.post("/", auth, createCampaign);
router.put("/:id", auth, updateCampaign);
router.delete("/:id", auth, deleteCampaign);

router.post("/:id/join-code", auth, generateJoinCode);
router.post("/join", auth, joinCampaignUsingCode);

router.get("/:id/contributors", auth, listContributors);
router.post("/:id/contributors", auth, addContributor);
router.delete("/:id/contributors", auth, removeContributor);

router.get("/:id/characters", auth, listCampaignCharacters);
// Location routes
router.post("/:id/locations", auth, (req, res, next) => {
	// forward to controller createLocation
	return require('../controllers/campaignControllers').createLocation(req, res, next);
});
router.get("/:id/locations", auth, (req, res, next) => {
	return require('../controllers/campaignControllers').listCampaignLocations(req, res, next);
});

// Map routes
router.get('/:id/maps', auth, (req, res, next) => {
	return require('../controllers/campaignControllers').listCampaignMaps(req, res, next);
});
router.post('/:id/maps', auth, (req, res, next) => {
	return require('../controllers/campaignControllers').createMap(req, res, next);
});
router.get('/:id/maps/:mapId', auth, (req, res, next) => {
	return require('../controllers/campaignControllers').getMapById(req, res, next);
});

// Missions (quests) and notes
router.post('/:id/missions', auth, (req, res, next) => {
	return require('../controllers/campaignControllers').createMission(req, res, next);
});
// update mission (e.g. set locationId)
router.put('/:id/missions/:missionId', auth, (req, res, next) => {
    return require('../controllers/campaignControllers').updateMission(req, res, next);
});
router.post('/:id/notes', auth, (req, res, next) => {
	return require('../controllers/campaignControllers').createNote(req, res, next);
});

// NPC routes
router.post("/:id/npcs", auth, addNPC);
router.get("/npcs", getNPCs);
router.get("/:id/npcs/:npcId", getNPCById);
router.put("/:id/npcs/:npcId", auth, updateNPC);
router.delete("/:id/npcs/:npcId", auth, deleteNPC);
router.get("/:id/npcs", listCampaignNPCs);

module.exports = router;

