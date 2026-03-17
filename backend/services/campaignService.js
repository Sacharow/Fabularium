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

const getCampaignWithContributorsById = async (id) => {
  return prisma.campaign.findUnique({
    where: { id },
    include: { contributors: true },
  });
};

const createLocation = async (data) => {
  return prisma.location.create({ data });
};

const listCampaignLocationsByCampaignId = async (campaignId) => {
  return prisma.location.findMany({
    where: { campaignId },
    include: { npcs: true, missions: true },
  });
};

const getLocationById = async (id) => {
  return prisma.location.findUnique({
    where: { id },
    include: { npcs: true, missions: true },
  });
};

const getLocationByIdBasic = async (id) => {
  return prisma.location.findUnique({
    where: { id },
  });
};

const updateLocationById = async (id, data) => {
  return prisma.location.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
    include: { npcs: true, missions: true },
  });
};

const deleteLocationById = async (id) => {
  return prisma.location.delete({ where: { id } });
};

const createMap = async (data) => {
  return prisma.map.create({ data });
};

const listCampaignMapsByCampaignId = async (campaignId) => {
  return prisma.map.findMany({ where: { campaignId } });
};

const getMapById = async (id) => {
  return prisma.map.findUnique({ where: { id } });
};

const updateMapById = async (id, data) => {
  return prisma.map.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
      file: data.file,
    },
  });
};

const deleteMapById = async (id) => {
  return prisma.map.delete({ where: { id } });
};

const createNPC = async (data) => {
  return prisma.nPC.create({ data });
};

const listNPCs = async () => {
  return prisma.nPC.findMany({
    include: {
      campaigns: true,
      locations: true,
    },
  });
};

const getNPCById = async (id) => {
  return prisma.nPC.findUnique({
    where: { id },
    include: {
      campaign: true,
      locations: true,
    },
  });
};

const getNPCOwnerForUpdateById = async (id) => {
  return prisma.nPC.findUnique({
    where: { id },
    select: { campaignId: true, campaign: { select: { ownerId: true } } },
  });
};

const updateNPCById = async (id, data) => {
  return prisma.nPC.update({
    where: { id },
    data: {
      name: data.name,
      description: data.description,
    },
    include: {
      campaign: true,
      locations: true,
    },
  });
};

const getNPCOwnerForDeleteById = async (id) => {
  return prisma.nPC.findUnique({
    where: { id },
    select: { campaignId: true, campaigns: { select: { ownerId: true } } },
  });
};

const deleteNPCById = async (id) => {
  return prisma.nPC.delete({ where: { id } });
};

const listCampaignNPCsByCampaignId = async (campaignId) => {
  return prisma.nPC.findMany({
    where: { campaignId },
    include: {
      locations: true,
    },
  });
};

const listMissionNpcs = async () => {
  return prisma.missionNpc.findMany({
    include: { mission: true, npc: true },
  });
};

const getMissionNpcById = async (MissionId, npcId) => {
  return prisma.missionNpc.findUnique({
    where: { MissionId_npcId: { MissionId, npcId } },
    include: { mission: true, npc: true },
  });
};

const createMissionNpc = async (data) => {
  return prisma.missionNpc.create({ data });
};

const updateMissionNpcById = async (MissionId, npcId, data) => {
  return prisma.missionNpc.update({
    where: { MissionId_npcId: { MissionId, npcId } },
    data,
  });
};

const deleteMissionNpcById = async (MissionId, npcId) => {
  return prisma.missionNpc.delete({
    where: { MissionId_npcId: { MissionId, npcId } },
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
  getCampaignWithContributorsById,
  createLocation,
  listCampaignLocationsByCampaignId,
  getLocationById,
  getLocationByIdBasic,
  updateLocationById,
  deleteLocationById,
  createMap,
  listCampaignMapsByCampaignId,
  getMapById,
  updateMapById,
  deleteMapById,
  createNPC,
  listNPCs,
  getNPCById,
  getNPCOwnerForUpdateById,
  updateNPCById,
  getNPCOwnerForDeleteById,
  deleteNPCById,
  listCampaignNPCsByCampaignId,
  listMissionNpcs,
  getMissionNpcById,
  createMissionNpc,
  updateMissionNpcById,
  deleteMissionNpcById,
};
