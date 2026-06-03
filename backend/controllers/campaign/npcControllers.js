"use strict";

const z = require("zod");
const campaignService = require("../../services/campaignService");
const {
  npcSchema,
  updateNPCSchema,
  missionNpcSchema,
} = require("../../schemas/campaignSchemas");

const addNPC = async (req, res) => {
  try {
    const data = req.body;
    const validated = npcSchema.safeParse(data);
    if (!validated.success) {
      return res.status(400).json({
        message: "Validation failed while adding npc",
        error: z.treeifyError(validated.error),
      });
    }

    const ownerCheck = await campaignService.getCampaignOwnerById(
      validated.data.campaignId,
    );

    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (ownerCheck.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden, not yours campaign" });
    }

    const addedNpc = await campaignService.createNPC({
      ...validated.data,
      linkedLocationIds: validated.data.linkedLocationIds,
      linkedMissionIds: validated.data.linkedMissionIds,
    });
    return res.status(201).json(addedNpc);
  } catch (er) {
    return res
      .status(500)
      .json({ message: "Something went wrong with adding npc", error: er });
  }
};

const getNPCs = async (req, res) => {
  try {
    const npcs = await campaignService.listNPCs();
    return res.status(200).json(npcs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list NPCs", error: String(err) });
  }
};

const getNPCById = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const npcId = req.params.npcId;
    if (
      !z.string().safeParse(campaignId).success ||
      !z.string().safeParse(npcId).success
    ) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const npc = await campaignService.getNPCById(npcId);
    if (!npc || npc.campaignId !== campaignId) {
      return res.status(404).json({ message: "NPC not found" });
    }

    const viewerId = req.user?.id;
    if (npc.isPublic === false && viewerId !== npc.campaign.ownerId)
      return res.status(404).json({ message: "NPC not found" });

    return res.status(200).json(npc);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get NPC", error: String(err) });
  }
};

const updateNPC = async (req, res) => {
  try {
    const user = req.user;
    const parsed = updateNPCSchema.safeParse({
      ...req.body,
      id: req.params.npcId,
    });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }
    const npc = await campaignService.getNPCOwnerForUpdateById(parsed.data.id);
    if (!npc) {
      return res.status(404).json({ message: "NPC not found" });
    }
    if (npc.campaign.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedNPC = await campaignService.updateNPCById(
      parsed.data.id,
      parsed.data,
    );
    return res.status(200).json(updatedNPC);
  } catch (err) {
    if (String(err).includes("Record to update not found")) {
      return res.status(404).json({ message: "NPC not found" });
    }
    return res
      .status(500)
      .json({ message: "Failed to update NPC", error: String(err) });
  }
};

const deleteNPC = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.npcId;
    if (!z.string().safeParse(id).success) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const npc = await campaignService.getNPCOwnerForDeleteById(id);
    if (!npc) {
      return res.status(404).json({ message: "NPC not found" });
    }
    if (npc.campaigns.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await campaignService.deleteNPCById(id);
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist")) {
      return res.status(404).json({ message: "NPC not found" });
    }
    return res
      .status(500)
      .json({ message: "Failed to delete NPC", error: String(err) });
  }
};

const listCampaignNPCs = async (req, res) => {
  try {
    const id = req.params.id;
    if (!z.string().safeParse(id).success) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const viewerId = req.user?.id;
    const npcs = await campaignService.listCampaignNPCsByCampaignId(
      id,
      viewerId,
    );
    return res.status(200).json(npcs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list campaign NPCs", error: String(err) });
  }
};

const toggleNPCVisibility = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const npcId = req.params.npcId;
    const data = req.body;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(npcId).success)
      return res.status(400).json({ message: "Invalid npc id" });

    const campaign =
      await campaignService.getCampaignWithContributorsById(campaignId);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
    if (campaign.ownerId !== user.id)
      return res.status(403).json({ message: "Forbidden" });

    if (typeof data.isPublic !== "boolean")
      return res.status(400).json({ message: "isPublic boolean required" });

    const npc = await campaignService.getNPCById(npcId);
    if (!npc || npc.campaignId !== campaignId)
      return res.status(404).json({ message: "NPC not found in campaign" });

    const updated = await campaignService.updateNPCById(npcId, {
      isPublic: data.isPublic,
    });
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to toggle NPC visibility", error: err });
  }
};

const getAllMissionNpcs = async (req, res) => {
  try {
    const missionNpcs = await campaignService.listMissionNpcs();
    return res.status(200).json(missionNpcs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching mission NPCs", error: err });
  }
};

const getMissionNpcById = async (req, res) => {
  try {
    const { MissionId, npcId } = req.params;
    const missionNpc = await campaignService.getMissionNpcById(
      MissionId,
      npcId,
    );
    if (!missionNpc) {
      return res.status(404).json({ message: "MissionNpc not found" });
    }
    return res.status(200).json(missionNpc);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching mission NPC", error: err });
  }
};

const createMissionNpc = async (req, res) => {
  try {
    const data = missionNpcSchema.safeParse(req.body);
    if (!data.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: data.error });
    }
    const missionNpc = await campaignService.createMissionNpc(data.data);
    return res.status(201).json(missionNpc);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error creating mission NPC", error: err });
  }
};

const updateMissionNpc = async (req, res) => {
  try {
    const { MissionId, npcId } = req.params;
    const data = missionNpcSchema.partial().safeParse(req.body);
    if (!data.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: data.error });
    }
    const missionNpc = await campaignService.updateMissionNpcById(
      MissionId,
      npcId,
      data.data,
    );
    return res.status(200).json(missionNpc);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error updating mission NPC", error: err });
  }
};

const deleteMissionNpc = async (req, res) => {
  try {
    const { MissionId, npcId } = req.params;
    await campaignService.deleteMissionNpcById(MissionId, npcId);
    return res.status(204).send();
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting mission NPC", error: err });
  }
};

module.exports = {
  addNPC,
  getNPCs,
  getNPCById,
  updateNPC,
  deleteNPC,
  listCampaignNPCs,
  toggleNPCVisibility,
  getAllMissionNpcs,
  getMissionNpcById,
  createMissionNpc,
  updateMissionNpc,
  deleteMissionNpc,
};
