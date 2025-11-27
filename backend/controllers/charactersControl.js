'use strict';
require('dotenv').config();
const { PrismaClient, Role } = require("../generated/prisma/client");
const jwt = require("jsonwebtoken");
const z = require("zod");
const crypt = require("bcryptjs");
const { id } = require('zod/v4/locales');
const path = require('path');

const characterSchema = z.object({
    name: z.string().min(1).max(30),
    race: z.string(),
    class: z.string(),
    stats: z.json({
        ""
    })
})