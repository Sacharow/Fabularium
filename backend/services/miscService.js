'use strict';

const prisma = require("../config/database");

async function listClasses() {
    return prisma.class.findMany({});
}

async function listRaces() {
    return prisma.race.findMany({});
}

module.exports = {
    listClasses,
    listRaces,
};
