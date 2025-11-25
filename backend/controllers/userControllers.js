'use strict';
require('dotenv').config();
const { PrismaClient, Role } = require("../generated/prisma/client");
const jwt = require("jsonwebtoken");
const z = require("zod");
const crypt = require("bcryptjs");
const { id } = require('zod/v4/locales');
const path = require('path');

const prisma = new PrismaClient();

const registerSchema = z.object({
    name: z.string().min(1),
    email: z.email({message: "not valid email"}),
    password: z.string().min(8)
});

const loginSchema = z.union([
    z.object({
        name: z.string().min(1),
        password: z.string().min(8)
    }),
    z.object({
        email: z.email({ message: "not valid email" }),
        password: z.string().min(8)
    })
]);


const createUserClassic = async (req, res) => {
    try {
        const data = registerSchema.safeParse(req.body);

        if (!data.success) {
            return res.status(400).json({message: "Validation failed", errors: z.treeifyError(data.error)});
        }
        const validated = data.data;
        console.log(validated);
        
        validated.passwordHashed = await crypt.hash(validated.password, 13);
        delete validated.password;
        console.log(validated);
        
        const user = await prisma.users.create({data: validated})
        return res.status(201).json(user);
    } catch (err) {
        return res.status(500).json({message: "problem with creating user", error: err});
    }
}

const login = async (req, res) => {
    try {
        const data = loginSchema.safeParse(req.body);

        if (!data.success) {
            return res.status(400).json({message: "Validation failed", errors: z.treeifyError(data.error)});
        }

        const validated = data.data;
        const user = await prisma.users.findFirst({ where: {name: validated.name} });
        if (!user) {
            return res.status(404).json({message: "No such user in database"});
        }

        const ok = await crypt.compare(validated.password, user.passwordHashed);

        if (!ok) {
            return res.status(401).json({ message: "Invalid password" });
        }

        const token = jwt.sign(
            {
                id: user.id,
                role: user.role
            },
            process.env.JWT_SECRET,
            {expiresIn: "20m"}
        )

        res.cookie("access_token", token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: "strict",
            maxAge: 20 * 60 * 1000,
            path: "/"
        });

        return res.json({message: "Logged in"});


    } catch (error) {
        return res.status(500).json({message: "An error occured while logging in", error: error});
    }
};

const logout = async (req, res) => {
    try {
        res.clearCookie("access_token", {
            httpOnly: true,
            secure: true,
            sameSite: "strict"
        });

        return res.status(200).json({message: "user logged out"});
    } catch (errors) {
        return res.status(500).json({message: "Problem with logging out", error: errors})
    }
}

//dodaj refresh token


const getAllUsers = async (req, res) => {
    try {
        const data = await prisma.users.findMany();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({message: "Błąd przy pobieraniu użytkowników", error: err});
    }
}



module.exports = {getAllUsers, createUserClassic, login, logout};