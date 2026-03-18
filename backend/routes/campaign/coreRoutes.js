"use strict";

const router = require("express").Router();
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
} = require("../../controllers/campaignControllers");
const { auth } = require("../../middleware/safety");

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

module.exports = router;