"use strict";

const z = require("zod");
const campaignService = require("../services/campaignService");
const {
  createCampaignSchema,
  updateCampaignSchema,
  generateJoinCodeSchema,
  joinCampaignSchema,
  contributorSchema,
  npcSchema,
  updateNPCSchema,
  updateLocationSchema,
  updateMissionSchema,
  updateNoteSchema,
  updateMapSchema,
  mapSchema,
  missionNpcSchema,
} = require("../schemas/campaignSchemas");

const createCampaign = async (req, res) => {
  try {
    const data = createCampaignSchema.safeParse(req.body);
    const user = req.user;
    if (!user?.id) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    if (!data.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: data.error });
    }
    const campaign = await campaignService.createCampaignForOwner(
      data.data,
      user.id,
    );
    return res.status(201).json(campaign);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create campaign", error: String(err) });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await campaignService.listCampaigns();
    return res.status(200).json(campaigns);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list campaigns", error: String(err) });
  }
};

const getCampaignById = async (req, res) => {
  try {
    const id = req.params.id;

    const campaign = await campaignService.getCampaignById(id);
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    return res.status(200).json(campaign);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get campaign", error: String(err) });
  }
};

const updateCampaign = async (req, res) => {
  try {
    const user = req.user;
    const parsed = updateCampaignSchema.safeParse({
      ...req.body,
      id: req.params.id,
    });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }
    const ownerCheck = await campaignService.getCampaignOwnerById(
      parsed.data.id,
    );
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const campaign = await campaignService.updateCampaignById(
      parsed.data.id,
      parsed.data,
    );
    return res.status(200).json(campaign);
  } catch (err) {
    if (String(err).includes("Record to update not found"))
      return res.status(404).json({ message: "Campaign not found" });
    return res
      .status(500)
      .json({ message: "Failed to update campaign", error: String(err) });
  }
};

const deleteCampaign = async (req, res) => {
  try {
    const user = req.user;
    const id = req.params.id;
    const ownerCheck = await campaignService.getCampaignOwnerById(id);
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await campaignService.deleteCampaignById(id);
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Campaign not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete campaign", error: String(err) });
  }
};

const generateJoinCode = async (req, res) => {
  try {
    const user = req.user;
    const parsed = generateJoinCodeSchema.safeParse({ id: req.params.id });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }
    const ownerCheck = await campaignService.getCampaignOwnerById(
      parsed.data.id,
    );
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const campaign = await campaignService.generateJoinCodeForCampaign(
      parsed.data.id,
    );
    return res.status(200).json(campaign);
  } catch (err) {
    if (String(err).includes("Record to update not found"))
      return res.status(404).json({ message: "Campaign not found" });
    return res
      .status(500)
      .json({ message: "Failed to generate join code", error: String(err) });
  }
};

const joinCampaignUsingCode = async (req, res) => {
  try {
    const parsed = joinCampaignSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }
    const result = await campaignService.joinCampaignUsingCode(
      parsed.data.userId,
      parsed.data.joinCode,
    );
    if (result.error) {
      return res.status(result.error.status).json({ message: result.error.message });
    }

    return res.status(200).json(result.campaign);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to join campaign", error: String(err) });
  }
};

const addContributor = async (req, res) => {
  try {
    const user = req.user;
    const parsed = contributorSchema.safeParse(req.body);
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }
    const ownerCheck = await campaignService.getCampaignOwnerById(
      parsed.data.campaignId,
    );
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updated = await campaignService.addContributorToCampaign(
      parsed.data.campaignId,
      parsed.data.userId,
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to add contributor", error: String(err) });
  }
};

const removeContributor = async (req, res) => {
  try {
    const user = req.user;
    const parsed = contributorSchema.safeParse(req.body);

    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }
    const ownerCheck = await campaignService.getCampaignOwnerById(
      parsed.data.campaignId,
    );
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await campaignService.removeContributorFromCampaign(
      parsed.data.campaignId,
      parsed.data.userId,
    );
    return res.status(200).json(updated);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to remove contributor", error: String(err) });
  }
};

const listContributors = async (req, res) => {
  try {
    const id = req.params.id;
    if (!z.string().safeParse(id).success)
      return res.status(400).json({ message: "Invalid id" });
    const contributors = await campaignService.listContributorsByCampaignId(id);
    if (!contributors)
      return res.status(404).json({ message: "Campaign not found" });
    return res.status(200).json(contributors.contributors);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list contributors", error: String(err) });
  }
};

const listCampaignCharacters = async (req, res) => {
  try {
    const id = req.params.id;
    if (!z.string().safeParse(id).success) {
      return res.status(400).json({ message: "Invalid id" });
    }
    const chars = await campaignService.listCharactersByCampaignId(id);
    return res.status(200).json(chars);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list characters", error: String(err) });
  }
};

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

    const addedNpc = await campaignService.createNPC(validated.data);
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
      id: req.params.id,
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
    const id = req.params.id;
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
    const npcs = await campaignService.listCampaignNPCsByCampaignId(id);
    return res.status(200).json(npcs);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list campaign NPCs", error: String(err) });
  }
};


const createLocation = async (req, res) => {
  try {
    const data = req.body;
    if (
      !data ||
      typeof data.name !== "string" ||
      data.name.trim().length === 0
    ) {
      return res
        .status(400)
        .json({ message: "Validation failed: name is required" });
    }
    const campaignId = req.params.id || data.campaignId;
    if (!campaignId)
      return res.status(400).json({ message: "campaignId is required" });
    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === userId ||
      campaign.contributors.some((c) => c.id === userId);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await campaignService.createLocation({
      name: data.name,
      description: data.description ?? "",
      campaignId: campaignId,
    });
    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create location", error: String(err) });
  }
};

const listCampaignLocations = async (req, res) => {
  try {
    const id = req.params.id;
    if (!z.string().safeParse(id).success)
      return res.status(400).json({ message: "Invalid id" });
    const locations = await campaignService.listCampaignLocationsByCampaignId(id);
    return res.status(200).json(locations);
  } catch (err) {
    return res.status(500).json({
      message: "Failed to list campaign locations",
      error: String(err),
    });
  }
};

const getLocation = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const locationId = req.params.locationId;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(locationId).success)
      return res.status(400).json({ message: "Invalid location id" });

    const location = await campaignService.getLocationById(locationId);

    if (!location || location.campaignId !== campaignId)
      return res
        .status(404)
        .json({ message: "Location not found in campaign" });

    return res.status(200).json(location);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get location", error: String(err) });
  }
};

const updateLocation = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const locationId = req.params.locationId;
    const data = req.body;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(locationId).success)
      return res.status(400).json({ message: "Invalid location id" });

    const parsed = updateLocationSchema.safeParse({ ...data, id: locationId });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const location = await campaignService.getLocationByIdBasic(locationId);
    if (!location || location.campaignId !== campaignId)
      return res
        .status(404)
        .json({ message: "Location not found in campaign" });

    const updated = await campaignService.updateLocationById(
      locationId,
      parsed.data,
    );
    return res.status(200).json(updated);
  } catch (err) {
    if (String(err).includes("Record to update not found"))
      return res.status(404).json({ message: "Location not found" });
    return res
      .status(500)
      .json({ message: "Failed to update location", error: String(err) });
  }
};

const deleteLocation = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const locationId = req.params.locationId;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(locationId).success)
      return res.status(400).json({ message: "Invalid location id" });

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const location = await campaignService.getLocationByIdBasic(locationId);
    if (!location || location.campaignId !== campaignId)
      return res
        .status(404)
        .json({ message: "Location not found in campaign" });

    await campaignService.deleteLocationById(locationId);
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Location not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete location", error: String(err) });
  }
};

const createMission = async (req, res) => {
  try {
    const data = req.body;
    const campaignId = req.params.id || data.campaignId;
    if (!campaignId)
      return res.status(400).json({ message: "campaignId is required" });
    if (
      !data ||
      typeof data.title !== "string" ||
      data.title.trim().length === 0
    )
      return res.status(400).json({ message: "title is required" });


    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const isContributor =
      campaign.ownerId === userId ||
      campaign.contributors.some((c) => c.id === userId);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await campaignService.createMission({
      title: data.title,
      description: data.description ?? "",
      status: data.status ?? "pending",
      ...(data.locationId ? { locationId: data.locationId } : {}),
      campaignId: campaignId,
    });
    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create mission", error: String(err) });
  }
};

const updateMission = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const missionId = req.params.missionId;
    const data = req.body;
    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(missionId).success)
      return res.status(400).json({ message: "Invalid mission id" });

    const parsed = updateMissionSchema.safeParse({ ...data, id: missionId });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const isContributor =
      campaign.ownerId === userId ||
      campaign.contributors.some((c) => c.id === userId);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const mission = await campaignService.getMissionById(missionId);
    if (!mission || mission.campaignId !== campaignId)
      return res.status(404).json({ message: "Mission not found in campaign" });

    const updated = await campaignService.updateMissionById(
      missionId,
      parsed.data,
    );
    return res.status(200).json(updated);
  } catch (err) {
    if (String(err).includes("Record to update not found"))
      return res.status(404).json({ message: "Mission not found" });
    return res
      .status(500)
      .json({ message: "Failed to update mission", error: String(err) });
  }
};

const deleteMission = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const missionId = req.params.missionId;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(missionId).success)
      return res.status(400).json({ message: "Invalid mission id" });

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const mission = await campaignService.getMissionById(missionId);
    if (!mission || mission.campaignId !== campaignId)
      return res.status(404).json({ message: "Mission not found in campaign" });

    await campaignService.deleteMissionById(missionId);
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Mission not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete mission", error: String(err) });
  }
};


const createNote = async (req, res) => {
  try {
    const data = req.body;
    const campaignId = req.params.id || data.campaignId;
    if (!campaignId)
      return res.status(400).json({ message: "campaignId is required" });
    if (!data || typeof data.name !== "string" || data.name.trim().length === 0)
      return res.status(400).json({ message: "name is required" });

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await campaignService.createNote({
      name: data.name,
      description: data.description ?? "",
      author: user.name ?? user.id ?? "unknown",
      date: new Date(),
      campaignId: campaignId,
    });
    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create note", error: String(err) });
  }
};

const updateNote = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const noteId = req.params.noteId;
    const data = req.body;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(noteId).success)
      return res.status(400).json({ message: "Invalid note id" });

    const parsed = updateNoteSchema.safeParse({ ...data, id: noteId });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const note = await campaignService.getNoteById(noteId);
    if (!note || note.campaignId !== campaignId)
      return res.status(404).json({ message: "Note not found in campaign" });

    const updated = await campaignService.updateNoteById(noteId, parsed.data);
    return res.status(200).json(updated);
  } catch (err) {
    if (String(err).includes("Record to update not found"))
      return res.status(404).json({ message: "Note not found" });
    return res
      .status(500)
      .json({ message: "Failed to update note", error: String(err) });
  }
};

const deleteNote = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const noteId = req.params.noteId;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(noteId).success)
      return res.status(400).json({ message: "Invalid note id" });

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const note = await campaignService.getNoteById(noteId);
    if (!note || note.campaignId !== campaignId)
      return res.status(404).json({ message: "Note not found in campaign" });

    await campaignService.deleteNoteById(noteId);
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Note not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete note", error: String(err) });
  }
};


const createMap = async (req, res) => {
  try {
    const data = req.body;
    const campaignId = req.params.id || data.campaignId;
    if (!campaignId)
      return res.status(400).json({ message: "campaignId is required" });

    const validated = mapSchema.safeParse(data);
    if (!validated.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: validated.error });
    }

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await campaignService.createMap({
      name: validated.data.name,
      description: validated.data.description ?? "",
      file: validated.data.file ?? "",
      campaignId: campaignId,
    });
    return res.status(201).json(created);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create map", error: String(err) });
  }
};

const listCampaignMaps = async (req, res) => {
  try {
    const id = req.params.id;
    if (!z.string().safeParse(id).success)
      return res.status(400).json({ message: "Invalid id" });
    const maps = await campaignService.listCampaignMapsByCampaignId(id);
    return res.status(200).json(maps);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to list campaign maps", error: String(err) });
  }
};

const getMapById = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const mapId = req.params.mapId;
    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(mapId).success)
      return res.status(400).json({ message: "Invalid map id" });

    const map = await campaignService.getMapById(mapId);
    if (!map || map.campaignId !== campaignId)
      return res.status(404).json({ message: "Map not found in campaign" });
    return res.status(200).json(map);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to get map", error: String(err) });
  }
};

const updateMap = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const mapId = req.params.mapId;
    const data = req.body;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(mapId).success)
      return res.status(400).json({ message: "Invalid map id" });

    const parsed = updateMapSchema.safeParse({ ...data, id: mapId });
    if (!parsed.success) {
      return res
        .status(400)
        .json({ message: "Validation failed", errors: parsed.error });
    }

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const map = await campaignService.getMapById(mapId);
    if (!map || map.campaignId !== campaignId)
      return res.status(404).json({ message: "Map not found in campaign" });

    const updated = await campaignService.updateMapById(mapId, parsed.data);
    return res.status(200).json(updated);
  } catch (err) {
    if (String(err).includes("Record to update not found"))
      return res.status(404).json({ message: "Map not found" });
    return res
      .status(500)
      .json({ message: "Failed to update map", error: String(err) });
  }
};

const deleteMap = async (req, res) => {
  try {
    const campaignId = req.params.id;
    const mapId = req.params.mapId;

    if (!z.string().safeParse(campaignId).success)
      return res.status(400).json({ message: "Invalid campaign id" });
    if (!z.string().safeParse(mapId).success)
      return res.status(400).json({ message: "Invalid map id" });

    const campaign = await campaignService.getCampaignWithContributorsById(
      campaignId,
    );
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const map = await campaignService.getMapById(mapId);
    if (!map || map.campaignId !== campaignId)
      return res.status(404).json({ message: "Map not found in campaign" });

    await campaignService.deleteMapById(mapId);
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Map not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete map", error: String(err) });
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
    return res.status(200).json({ message: "MissionNpc deleted" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error deleting mission NPC", error: err });
  }
};


module.exports = {
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
  getLocation,
  updateLocation,
  deleteLocation,
  createMission,
  updateMission,
  deleteMission,
  createNote,
  updateNote,
  deleteNote,
  createMap,
  listCampaignMaps,
  getMapById,
  updateMap,
  deleteMap,
  getAllMissionNpcs,
  getMissionNpcById,
  createMissionNpc,
  updateMissionNpc,
  deleteMissionNpc,
};
