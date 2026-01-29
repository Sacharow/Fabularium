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
  listCampaignNPCs,
  createLocation,
  listCampaignLocations,
  getAllMissionNpcs,
  getMissionNpcById,
  createMissionNpc,
  updateMissionNpc,
  deleteMissionNpc,
  createMap,
  listCampaignMaps,
  getMapById,
  updateMap,
  deleteMap,
  createMission,
  createNote,
  updateMission,
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
router.post("/:id/locations", auth, createLocation);
router.get("/:id/locations", auth, listCampaignLocations);

router.get("/:id/maps", auth, listCampaignMaps);
router.post("/:id/maps", auth, createMap);
router.get("/:id/maps/:mapId", auth, getMapById);
router.put("/:id/maps/:mapId", auth, updateMap);
router.delete("/:id/maps/:mapId", auth, deleteMap);

router.post("/:id/missions", auth, createMission);
router.put("/:id/missions/:missionId", auth, updateMission);

router.post("/:id/notes", auth, createNote);

router.post("/:id/npcs", auth, addNPC);
router.get("/npcs", getNPCs);
router.get("/:id/npcs/:npcId", getNPCById);
router.put("/:id/npcs/:npcId", auth, updateNPC);
router.delete("/:id/npcs/:npcId", auth, deleteNPC);
router.get("/:id/npcs", listCampaignNPCs);

// MissionNpc routes
router.get("/mission-npcs", getAllMissionNpcs);
router.get("/mission-npcs/:MissionId/:npcId", getMissionNpcById);
router.post("/mission-npcs", auth, createMissionNpc);
router.put("/mission-npcs/:MissionId/:npcId", auth, updateMissionNpc);
router.delete("/mission-npcs/:MissionId/:npcId", auth, deleteMissionNpc);

module.exports = router;
