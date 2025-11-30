"use strict";
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const systemRoutes = require("./routes/systemRoutes.js");
const characterRoutes = require("./routes/charactersRoutes.js");
const {checkAdmin} = require("./middleware/safety.js");

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));


app.use('/users', userRoutes);
app.use("/characters", characterRoutes);
app.use("/system", checkAdmin, systemRoutes);

app.use('/', (req, res) => {
    res.send("żelo elo");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("elo żelo");
});








