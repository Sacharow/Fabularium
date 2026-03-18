'use strict';
const { listClasses, listRaces } = require("../services/miscService");

const listClassesController = async (req, res) => {
    try {
        const classes = await listClasses();
        return res.status(200).json(classes);
    } catch (err) {
        return res.status(500).json({ message: "Failed to list classes", error: String(err) });
    }
};

const listRacesController = async (req, res) => {
    try {
        const races = await listRaces();
        return res.status(200).json(races);
    } catch (err) {
        return res.status(500).json({ message: "Failed to list races", error: String(err) });
    }
};

module.exports = {
    listClasses: listClassesController,
    listRaces: listRacesController
};
