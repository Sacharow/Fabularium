'use strict';
require('dotenv').config();
const {
    createCharacterForUser,
    getOwnedCharacterById,
    listCharactersForUser,
    updateOwnedCharacter,
    deleteOwnedCharacter
} = require("../services/characterService");
const {
    createCharacterSchema,
    updateCharacterSchema
} = require("../schemas/characterSchemas");

const createCharacter = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

        const parsed = createCharacterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Validation failed", error: parsed.error.format() });
        }

        const created = await createCharacterForUser(user.id, parsed.data);

        return res.status(201).json(created);
    } catch (err) {
        if (err?.status) {
            return res.status(err.status).json({ message: err.message });
        }
        return res.status(500).json({ message: "Failed to create character", error: String(err) });
    }
};


const getCharacterById = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;

        const { error, character } = await getOwnedCharacterById(id, user.id);
        if (error) return res.status(error.status).json({ message: error.message });

        return res.status(200).json(character);
    } catch (err) {
        return res.status(500).json({ message: "Failed to fetch character", error: String(err) });
    }
};

const listMyCharacters = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });

        const characters = await listCharactersForUser(user.id);

        return res.status(200).json(characters);
    } catch (err) {
        return res.status(500).json({ message: "Failed to list characters", error: String(err) });
    }
};

const updateCharacter = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;

        const parsed = updateCharacterSchema.safeParse(req.body);
        if (!parsed.success) {
            return res.status(400).json({ message: "Validation failed", error: parsed.error.format() });
        }

        const { error, character } = await updateOwnedCharacter(id, user.id, parsed.data);
        if (error) return res.status(error.status).json({ message: error.message });

        return res.status(200).json(character);
    } catch (err) {
        if (err?.status) {
            return res.status(err.status).json({ message: err.message });
        }
        return res.status(500).json({ message: "Failed to update character", error: String(err) });
    }
};

const deleteCharacter = async (req, res) => {
    try {
        const user = req.user;
        if (!user?.id) return res.status(401).json({ message: "Unauthorized" });
        const { id } = req.params;

        const { error } = await deleteOwnedCharacter(id, user.id);
        if (error) return res.status(error.status).json({ message: error.message });

        return res.status(204).send();
    } catch (err) {
        return res.status(500).json({ message: "Failed to delete character", error: String(err) });
    }
};

module.exports = {
    createCharacter,
    getCharacterById,
    listMyCharacters,
    updateCharacter,
    deleteCharacter
};
