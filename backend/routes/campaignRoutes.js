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
	listCampaignCharacters
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

module.exports = router;

