'use strict';

const { PrismaClient } = require("../generated/prisma/client");
const prisma = new PrismaClient()
const jwt = require("jsonwebtoken");

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

const auth = (req, res, next) => {
    try {
        const token = req.cookies.access_token;

        if (!token) {
            return res.status(401).json({ message: "Not logged in" });
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded;

        next();
    } catch (err) {
        return res.status(401).json({ message: "Invalid token" });
    }
};

const errorHandler = () => {
    return (err, req, res, next) => {
        console.error(err);
        
        const status = err.status || 500;
        const message = err.message || "Internal server error";
        
        res.status(status).json({ message });
    };
}


module.exports = {checkOwnership, checkAdmin, auth, errorHandler};