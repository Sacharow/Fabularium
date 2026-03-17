'use strict';

const prisma = require("../config/database");

const listClasses = async () => {
    return prisma.class.findMany({});
};

const listRaces = async () => {
    return prisma.race.findMany({});
};

module.exports = {
    listClasses,
    listRaces,
};
