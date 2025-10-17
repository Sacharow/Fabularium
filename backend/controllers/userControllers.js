'use strict';

const {PrismaClient} = require("../generated/prisma/client");


const ameno = async () => {
    try {
        const prisma = new PrismaClient();
        const data = await prisma.$connect().then(() => {
            console.log("baza");    
        });
    } catch (err) {
        console.log(err);
    }
}

ameno();