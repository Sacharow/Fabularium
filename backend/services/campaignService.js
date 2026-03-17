"use strict";

const crypto = require("crypto");
const prisma = require("../config/database");

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

  throw new Error("Could not generate unique join code after multiple attempts");
};

const createCampaignForOwner = async (campaignData, ownerId) => {
  const joinCode = await makeJoinCode();

  return prisma.campaign.create({
    data: {
      name: campaignData.name,
      description: campaignData.description,
      ownerId,
      joinCode,
    },
    include: { owner: true },
  });
};

const listCampaigns = async () => {
  return prisma.campaign.findMany({
    include: { owner: true, contributors: true },
  });
};

const getCampaignById = async (id) => {
  return prisma.campaign.findUnique({
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
};

const getCampaignOwnerById = async (id) => {
  return prisma.campaign.findUnique({
    where: { id },
    select: { ownerId: true },
  });
};

const updateCampaignById = async (id, data) => {
  return prisma.campaign.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
  });
};

const deleteCampaignById = async (id) => {
  return prisma.campaign.delete({ where: { id } });
};

const generateJoinCodeForCampaign = async (id) => {
  const joinCode = await makeJoinCode();

  return prisma.campaign.update({
    where: { id },
    data: { joinCode },
    select: { id: true, joinCode: true },
  });
};

const joinCampaignUsingCode = async (userId, joinCode) => {
  const campaign = await prisma.campaign.findFirst({
    where: { joinCode },
  });

  if (!campaign) {
    return { error: { status: 404, message: "Invalid or expired join code" } };
  }

  const updated = await prisma.campaign.update({
    where: { id: campaign.id },
    data: {
      contributors: { connect: { id: userId } },
    },
    include: { contributors: true },
  });

  return { campaign: updated };
};

const addContributorToCampaign = async (campaignId, userId) => {
  return prisma.campaign.update({
    where: { id: campaignId },
    data: { contributors: { connect: { id: userId } } },
    include: { contributors: true },
  });
};

const removeContributorFromCampaign = async (campaignId, userId) => {
  return prisma.campaign.update({
    where: { id: campaignId },
    data: { contributors: { disconnect: { id: userId } } },
    include: { contributors: true },
  });
};

const listContributorsByCampaignId = async (id) => {
  return prisma.campaign.findUnique({
    where: { id },
    select: { contributors: true },
  });
};

const listCharactersByCampaignId = async (id) => {
  return prisma.character.findMany({
    where: { campaignId: id },
  });
};

module.exports = {
  createCampaignForOwner,
  listCampaigns,
  getCampaignById,
  getCampaignOwnerById,
  updateCampaignById,
  deleteCampaignById,
  generateJoinCodeForCampaign,
  joinCampaignUsingCode,
  addContributorToCampaign,
  removeContributorFromCampaign,
  listContributorsByCampaignId,
  listCharactersByCampaignId,
};
