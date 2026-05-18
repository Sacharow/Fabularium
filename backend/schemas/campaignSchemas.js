"use strict";

const z = require("zod");

const createCampaignSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  currentSession: z.number().int().optional(),
});

const updateCampaignSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  photo: z.string().optional(),
  currentSession: z.number().int().optional(),
});

const generateJoinCodeSchema = z.object({
  id: z.string(),
});

const joinCampaignSchema = z.object({
  joinCode: z.string().min(6),
});

const contributorSchema = z.object({
  userId: z.string(),
});

const npcSchema = z.object({
  name: z.string().min(1),
  description: z.string().min(1),
  campaignId: z.string().optional(),
  linkedLocationIds: z.array(z.string()).optional(),
  linkedMissionIds: z.array(z.string()).optional(),
});

const updateNPCSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().min(1).optional(),
  linkedLocationIds: z.array(z.string()).optional(),
  linkedMissionIds: z.array(z.string()).optional(),
});

const locationSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
});

const updateLocationSchema = z.object({
  id: z.string(),
  name: z.string().min(1).optional(),
  description: z.string().optional(),
  linkedNpcIds: z.array(z.string()).optional(),
  linkedMissionIds: z.array(z.string()).optional(),
});

const missionSchema = z.object({
  title: z.string().min(1),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  locationId: z.string().optional(),
});

const updateMissionSchema = z.object({
  id: z.string(),
  title: z.string().min(1).optional(),
  description: z.string().optional(),
  status: z.enum(["pending", "in_progress", "completed"]).optional(),
  linkedLocationIds: z.array(z.string()).optional(),
  linkedNpcIds: z.array(z.string()).optional(),
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

const mapSchema = z.object({
  name: z.string().min(1),
  description: z.string().optional(),
  file: z.string().optional(),
});

const missionNpcSchema = z.object({
  MissionId: z.string().min(1),
  npcId: z.string().min(1),
});

module.exports = {
  createCampaignSchema,
  updateCampaignSchema,
  generateJoinCodeSchema,
  joinCampaignSchema,
  contributorSchema,
  npcSchema,
  updateNPCSchema,
  locationSchema,
  updateLocationSchema,
  missionSchema,
  updateMissionSchema,
  noteSchema,
  updateNoteSchema,
  updateMapSchema,
  mapSchema,
  missionNpcSchema,
};
