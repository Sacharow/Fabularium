'use strict';

const systemService = require("../../services/systemService");
const { missionNpcSchema } = require("../../schemas/systemSchemas");

const getAllMissionNpcs = async (req, res) => {
    try {
        const missionNpcs = await systemService.getAllMissionNpcs();
        return res.status(200).json(missionNpcs);
    } catch (err) {
        return res.status(500).json({ message: "Error fetching mission NPCs", error: err });
    }
};

const getMissionNpcById = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        const missionNpc = await systemService.getMissionNpcById(MissionId, npcId);
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
        const missionNpc = await systemService.createMissionNpc(data.data);
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
        const missionNpc = await systemService.updateMissionNpc(MissionId, npcId, data.data);
        return res.status(200).json(missionNpc);
    } catch (err) {
        return res.status(500).json({ message: "Error updating mission NPC", error: err });
    }
};

const deleteMissionNpc = async (req, res) => {
    try {
        const { MissionId, npcId } = req.params;
        await systemService.deleteMissionNpc(MissionId, npcId);
        return res.status(200).json({ message: "MissionNpc deleted" });
    } catch (err) {
        return res.status(500).json({ message: "Error deleting mission NPC", error: err });
    }
};

module.exports = {
    getAllMissionNpcs,
    getMissionNpcById,
    createMissionNpc,
    updateMissionNpc,
    deleteMissionNpc
};
