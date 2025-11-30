'use strict';

const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient()

const checkOwnership = async (model) => {
    return async (req, res, next) => {
        const user = req.user;

        if (!user) {
            return res.status(403).json({message: "User not logged in"});
        }
        
        if (user.role === "admin") {
            return next();
        };

        const id = req.params.id;

        const resource = await prisma[model].findUnique({
            where: {
                id: Number(id)
            },
            select: {
                ownerId: true
            }
        });

        if (!resource) {
            return res.status(404).json({message: "Not found"});
        }

        if (resource.ownerId !== user.id) {
            return res.status(403).json({message: "Forbidden"});
        }

        next();
    }

};

const checkAdmin = async (req, res, next) => {
    const user = req.user;

    if (!user) {
        return res.status(403).json({message: "User not logged in"});
    }
    
    if (user.role !== "admin") {
        return res.status(403).json({message: "Forbidden"});
    }

    next();
}

module.exports = {checkOwnership, checkAdmin};