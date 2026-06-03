"use strict";

const router = require("express").Router();
const {
  addNPC,
  getNPCs,
  getNPCById,
  updateNPC,
  deleteNPC,
  listCampaignNPCs,
  toggleNPCVisibility,
} = require("../../controllers/campaignControllers");
const { auth } = require("../../middleware/safety");

router.post("/:id/npcs", auth, addNPC);
router.get("/npcs", getNPCs);
router.get("/:id/npcs/:npcId", getNPCById);
router.put("/:id/npcs/:npcId", auth, updateNPC);
router.delete("/:id/npcs/:npcId", auth, deleteNPC);
router.put("/:id/npcs/:npcId/visibility", auth, toggleNPCVisibility);
router.get("/:id/npcs", listCampaignNPCs);

module.exports = router;
