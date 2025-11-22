'use strict';
import dotenv from 'dotenv';
dotenv.config();
import {PrismaClient} from "../generated/prisma/client.js";

const prisma = new PrismaClient();


const ameno = async () => {
    try {
        const data = await prisma.$connect().then(() => {
            console.log("baza");    
        });
    } catch (err) {
        console.log(err);
    }
}


const getAllUsers = async (req, res) => {
    try {
        const data = await prisma.users.findMany();
        return res.status(200).json(data);
    } catch (err) {
        return res.status(500).json({message: "Błąd przy pobieraniu użytkowników", error: err});
    }
}

const addUser = async (req, res) => {

}


export {getAllUsers};