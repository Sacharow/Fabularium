"use strict";
import dotenv from 'dotenv';
dotenv.config();
import express from 'express';
import morgan from 'morgan';
import cors from 'cors';
import {userRoutes} from "./routes/userRoutes.js";

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("elo żelo");
});
app.use('/users', userRoutes);
app.use('/', (req, res) => {
    res.send("żelo elo");
});







