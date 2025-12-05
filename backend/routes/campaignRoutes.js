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

router.get("/campaigns", getCampaigns);
router.get("/campaigns/:id", getCampaignById);
router.post("/campaigns", auth, createCampaign);
router.put("/campaigns/:id", auth, updateCampaign);
router.delete("/campaigns/:id", auth, deleteCampaign);

router.post("/campaigns/:id/join-code", auth, generateJoinCode);
router.post("/campaigns/join", auth, joinCampaignUsingCode);

router.get("/campaigns/:id/contributors", auth, listContributors);
router.post("/campaigns/:id/contributors", auth, addContributor);
router.delete("/campaigns/:id/contributors", auth, removeContributor);

router.get("/campaigns/:id/characters", auth, listCampaignCharacters);

// NPC routes
router.post("/campaigns/:id/npcs", auth, addNPC);
router.get("/npcs", getNPCs);
router.get("/npcs/:id", getNPCById);
router.put("/npcs/:id", auth, updateNPC);
router.delete("/npcs/:id", auth, deleteNPC);
router.get("/campaigns/:id/npcs", listCampaignNPCs);

module.exports = router;

