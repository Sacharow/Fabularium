"use strict";

const router = require("express").Router();
const {
  getAllMissionNpcs,
  getMissionNpcById,
  createMissionNpc,
  updateMissionNpc,
  deleteMissionNpc,
} = require("../../controllers/campaignControllers");
const { auth } = require("../../middleware/safety");

router.get("/mission-npcs", getAllMissionNpcs);
router.get("/mission-npcs/:MissionId/:npcId", getMissionNpcById);
router.post("/mission-npcs", auth, createMissionNpc);
router.put("/mission-npcs/:MissionId/:npcId", auth, updateMissionNpc);
router.delete("/mission-npcs/:MissionId/:npcId", auth, deleteMissionNpc);

module.exports = router;