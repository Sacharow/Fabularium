"use strict";

const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();
const z = require("zod");
const crypto = require("crypto");

const createCampaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
});

const updateCampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

const generateJoinCodeSchema = z.object({
  id: z.string(),
});

const joinCampaignSchema = z.object({
  userId: z.string(),
  joinCode: z.string().min(6),
});

const contributorSchema = z.object({
  campaignId: z.string(),
  userId: z.string(),
});

const npcSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  campaignId: z.string().optional(),
});

const updateNPCSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
});

const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const missionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  locationId: z.string(),
});

const updateMissionSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  locationId: z.string().optional(),
});

const noteSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateNoteSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
});

const updateMapSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  file: z.string().optional(),
});

const makeJoinCode = async () => {
  for (let i = 0; i < 30; i++) {
    const code = crypto.randomBytes(6).toString("base64url").slice(0, 10);
    const duplicate = await prisma.campaign.findFirst({
      where: { joinCode: code },
    });
    if (!duplicate) {
      return code;
    }
  }
  throw new Error(
    "Could not generate unique join code after multiple attempts",
  );
};

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
    const joinCode = await makeJoinCode();
    const campaign = await prisma.campaign.create({
      data: {
        name: data.data.name,
        description: data.data.description,
        ownerId: user.id,
        joinCode,
      },
      include: { owner: true },
    });
    return res.status(201).json(campaign);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Failed to create campaign", error: String(err) });
  }
};

const getCampaigns = async (req, res) => {
  try {
    const campaigns = await prisma.campaign.findMany({
      include: { owner: true, contributors: true },
    });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id },
      include: {
        owner: true,
        contributors: true,
        characters: true,
        missions: { include: { location: true } },
        notes: true,
        maps: true,
        locations: { include: { npcs: true } },
        npcs: true,
      },
    });
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
    const ownerCheck = await prisma.campaign.findUnique({
      where: { id: parsed.data.id },
      select: { ownerId: true },
    });
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const campaign = await prisma.campaign.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });
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
    const ownerCheck = await prisma.campaign.findUnique({
      where: { id },
      select: { ownerId: true },
    });
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await prisma.campaign.delete({ where: { id } });
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
    const ownerCheck = await prisma.campaign.findUnique({
      where: { id: parsed.data.id },
      select: { ownerId: true },
    });
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const joinCode = await makeJoinCode();
    const campaign = await prisma.campaign.update({
      where: { id: parsed.data.id },
      data: { joinCode },
      select: { id: true, joinCode: true },
    });
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
    const campaign = await prisma.campaign.findFirst({
      where: { joinCode: parsed.data.joinCode },
    });
    if (!campaign)
      return res.status(404).json({ message: "Invalid or expired join code" });

    const updated = await prisma.campaign.update({
      where: { id: campaign.id },
      data: {
        contributors: { connect: { id: parsed.data.userId } },
      },
      include: { contributors: true },
    });
    return res.status(200).json(updated);
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
    const ownerCheck = await prisma.campaign.findUnique({
      where: { id: parsed.data.campaignId },
      select: { ownerId: true },
    });
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updated = await prisma.campaign.update({
      where: { id: parsed.data.campaignId },
      data: { contributors: { connect: { id: parsed.data.userId } } },
      include: { contributors: true },
    });
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
    const ownerCheck = await prisma.campaign.findUnique({
      where: { id: parsed.data.campaignId },
      select: { ownerId: true },
    });
    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    if (ownerCheck.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }

    const updated = await prisma.campaign.update({
      where: { id: parsed.data.campaignId },
      data: { contributors: { disconnect: { id: parsed.data.userId } } },
      include: { contributors: true },
    });
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
    const contributors = await prisma.campaign.findUnique({
      where: { id },
      select: { contributors: true },
    });
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
    const chars = await prisma.character.findMany({
      where: { campaignId: id },
    });
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

    const ownerCheck = await prisma.campaign.findUnique({
      where: {
        id: validated.data.campaignId,
      },
      select: {
        ownerId: true,
      },
    });

    if (!ownerCheck) {
      return res.status(404).json({ message: "Campaign not found" });
    }

    if (ownerCheck.ownerId !== req.user.id) {
      return res.status(403).json({ message: "Forbidden, not yours campaign" });
    }

    const addedNpc = await prisma.nPC.create({ data: validated.data });
    return res.status(201).json(addedNpc);
  } catch (er) {
    return res
      .status(500)
      .json({ message: "Something went wrong with adding npc", error: er });
  }
};

const getNPCs = async (req, res) => {
  try {
    const npcs = await prisma.nPC.findMany({
      include: {
        campaigns: true,
        locations: true,
      },
    });
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
    const npc = await prisma.nPC.findUnique({
      where: { id: npcId },
      include: {
        campaign: true,
        locations: true,
      },
    });
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
    const npc = await prisma.nPC.findUnique({
      where: { id: parsed.data.id },
      select: { campaignId: true, campaign: { select: { ownerId: true } } },
    });
    if (!npc) {
      return res.status(404).json({ message: "NPC not found" });
    }
    if (npc.campaign.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    const updatedNPC = await prisma.nPC.update({
      where: { id: parsed.data.id },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
      include: {
        campaign: true,
        locations: true,
      },
    });
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
    const npc = await prisma.nPC.findUnique({
      where: { id },
      select: { campaignId: true, campaigns: { select: { ownerId: true } } },
    });
    if (!npc) {
      return res.status(404).json({ message: "NPC not found" });
    }
    if (npc.campaigns.ownerId !== user.id) {
      return res.status(403).json({ message: "Forbidden" });
    }
    await prisma.nPC.delete({ where: { id } });
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
    const npcs = await prisma.nPC.findMany({
      where: { campaignId: id },
      include: {
        locations: true,
      },
    });
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
    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === userId ||
      campaign.contributors.some((c) => c.id === userId);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await prisma.location.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        campaignId: campaignId,
      },
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
    const locations = await prisma.location.findMany({
      where: { campaignId: id },
      include: { npcs: true, missions: true },
    });
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

    const location = await prisma.location.findUnique({
      where: { id: locationId },
      include: { npcs: true, missions: true },
    });

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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location || location.campaignId !== campaignId)
      return res
        .status(404)
        .json({ message: "Location not found in campaign" });

    const updated = await prisma.location.update({
      where: { id: locationId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
      include: { npcs: true, missions: true },
    });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const location = await prisma.location.findUnique({
      where: { id: locationId },
    });
    if (!location || location.campaignId !== campaignId)
      return res
        .status(404)
        .json({ message: "Location not found in campaign" });

    await prisma.location.delete({ where: { id: locationId } });
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
    if (!data.locationId)
      return res.status(400).json({ message: "locationId is required" });

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const isContributor =
      campaign.ownerId === userId ||
      campaign.contributors.some((c) => c.id === userId);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await prisma.mission.create({
      data: {
        title: data.title,
        description: data.description ?? "",
        status: data.status ?? "pending",
        locationId: data.locationId,
        campaignId: campaignId,
      },
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const userId = req.user?.id;
    if (!userId) return res.status(401).json({ message: "Unauthorized" });
    const isContributor =
      campaign.ownerId === userId ||
      campaign.contributors.some((c) => c.id === userId);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission || mission.campaignId !== campaignId)
      return res.status(404).json({ message: "Mission not found in campaign" });

    const updated = await prisma.mission.update({
      where: { id: missionId },
      data: {
        title: parsed.data.title,
        description: parsed.data.description,
        status: parsed.data.status,
        locationId: parsed.data.locationId,
      },
      include: { location: true },
    });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const mission = await prisma.mission.findUnique({
      where: { id: missionId },
    });
    if (!mission || mission.campaignId !== campaignId)
      return res.status(404).json({ message: "Mission not found in campaign" });

    await prisma.mission.delete({ where: { id: missionId } });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });
    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await prisma.note.create({
      data: {
        name: data.name,
        description: data.description ?? "",
        author: user.name ?? user.id ?? "unknown",
        date: new Date(),
        campaignId: campaignId,
      },
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.campaignId !== campaignId)
      return res.status(404).json({ message: "Note not found in campaign" });

    const updated = await prisma.note.update({
      where: { id: noteId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
      },
    });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const note = await prisma.note.findUnique({ where: { id: noteId } });
    if (!note || note.campaignId !== campaignId)
      return res.status(404).json({ message: "Note not found in campaign" });

    await prisma.note.delete({ where: { id: noteId } });
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Note not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete note", error: String(err) });
  }
};

const mapSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  file: z.string().optional(),
});

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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const created = await prisma.map.create({
      data: {
        name: validated.data.name,
        description: validated.data.description ?? "",
        file: validated.data.file ?? "",
        campaignId: campaignId,
      },
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
    const maps = await prisma.map.findMany({ where: { campaignId: id } });
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

    const map = await prisma.map.findUnique({ where: { id: mapId } });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const map = await prisma.map.findUnique({ where: { id: mapId } });
    if (!map || map.campaignId !== campaignId)
      return res.status(404).json({ message: "Map not found in campaign" });

    const updated = await prisma.map.update({
      where: { id: mapId },
      data: {
        name: parsed.data.name,
        description: parsed.data.description,
        file: parsed.data.file,
      },
    });
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

    const campaign = await prisma.campaign.findUnique({
      where: { id: campaignId },
      include: { contributors: true },
    });
    if (!campaign)
      return res.status(404).json({ message: "Campaign not found" });

    const user = req.user;
    if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

    const isContributor =
      campaign.ownerId === user.id ||
      campaign.contributors.some((c) => c.id === user.id);
    if (!isContributor) return res.status(403).json({ message: "Forbidden" });

    const map = await prisma.map.findUnique({ where: { id: mapId } });
    if (!map || map.campaignId !== campaignId)
      return res.status(404).json({ message: "Map not found in campaign" });

    await prisma.map.delete({ where: { id: mapId } });
    return res.status(204).send();
  } catch (err) {
    if (String(err).includes("Record to delete does not exist"))
      return res.status(404).json({ message: "Map not found" });
    return res
      .status(500)
      .json({ message: "Failed to delete map", error: String(err) });
  }
};

const missionNpcSchema = z.object({
    MissionId: z.string().min(1),
    npcId: z.string().min(1)
});

const getAllMissionNpcs = async (req, res) => {
    try {
        const missionNpcs = await prisma.missionNpc.findMany({
            include: { mission: true, npc: true }
        });
        return res.status(200).json(missionNpcs);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching mission NPCs", error: err });
    }
};

const getMissionNpcById = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        const missionNpc = await prisma.missionNpc.findUnique({
            where: { MissionId_npcId: { MissionId, npcId } },
            include: { mission: true, npc: true }
        });
        if (!missionNpc) {
            return res.status(404).json({ message: "MissionNpc not found" });
        }
        return res.status(200).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching mission NPC", error: err });
    }
};

const createMissionNpc = async (req, res) => {
    try {
        const data = missionNpcSchema.safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const missionNpc = await prisma.missionNpc.create({ data: data.data });
        return res.status(201).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error creating mission NPC", error: err });
    }
};

const updateMissionNpc = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        const data = missionNpcSchema.partial().safeParse(req.body);
        if (!data.success) {
            return res.status(400).json({ message: "Validation failed", errors: data.error });
        }
        const missionNpc = await prisma.missionNpc.update({
            where: { MissionId_npcId: { MissionId, npcId } },
            data: data.data
        });
        return res.status(200).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error updating mission NPC", error: err });
    }
};

const deleteMissionNpc = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        await prisma.missionNpc.delete({
            where: { MissionId_npcId: { MissionId, npcId } }
        });
        return res.status(200).json({ message: "MissionNpc deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting mission NPC", error: err });
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
