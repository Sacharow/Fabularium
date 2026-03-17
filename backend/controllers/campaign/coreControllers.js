"use strict";

const z = require("zod");
const campaignService = require("../../services/campaignService");
const {
  createCampaignSchema,
  updateCampaignSchema,
  generateJoinCodeSchema,
  joinCampaignSchema,
  contributorSchema,
} = require("../../schemas/campaignSchemas");

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
      return res
        .status(result.error.status)
        .json({ message: result.error.message });
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
};
