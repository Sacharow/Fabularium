"use strict";

const router = require("express").Router();
const {
  createLocation,
  listCampaignLocations,
  getLocation,
  updateLocation,
  deleteLocation,
  createMap,
  listCampaignMaps,
  getMapById,
  updateMap,
  deleteMap,
  createMission,
  updateMission,
  deleteMission,
  createNote,
  updateNote,
  deleteNote,
} = require("../../controllers/campaignControllers");
const { auth } = require("../../middleware/safety");

router.post("/:id/locations", auth, createLocation);
router.get("/:id/locations", auth, listCampaignLocations);
router.get("/:id/locations/:locationId", auth, getLocation);
router.put("/:id/locations/:locationId", auth, updateLocation);
router.delete("/:id/locations/:locationId", auth, deleteLocation);

router.get("/:id/maps", auth, listCampaignMaps);
router.post("/:id/maps", auth, createMap);
router.get("/:id/maps/:mapId", auth, getMapById);
router.put("/:id/maps/:mapId", auth, updateMap);
router.delete("/:id/maps/:mapId", auth, deleteMap);

router.post("/:id/missions", auth, createMission);
router.put("/:id/missions/:missionId", auth, updateMission);
router.delete("/:id/missions/:missionId", auth, deleteMission);

router.post("/:id/notes", auth, createNote);
router.put("/:id/notes/:noteId", auth, updateNote);
router.delete("/:id/notes/:noteId", auth, deleteNote);

module.exports = router;