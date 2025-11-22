'use strict';

import express from 'express';
import { getAllUsers } from "../controllers/userControllers.js";

const userRoutes = express.Router();

userRoutes.get("/", getAllUsers);


export {userRoutes};