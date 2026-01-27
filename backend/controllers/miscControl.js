'use strict';
const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient();

const listClasses = async (req, res) => {
    try {
        const classes = await prisma.class.findMany({});
        return res.status(200).json(classes);
    } catch (err) {
        return res.status(500).json({ message: "Failed to list classes", error: String(err) });
    }
};

const listRaces = async (req, res) => {
    try {
        const races = await prisma.race.findMany({});
        return res.status(200).json(races);
    } catch (err) {
        return res.status(500).json({ message: "Failed to list races", error: String(err) });
    }
};

module.exports = {
    listClasses,
    listRaces
};
