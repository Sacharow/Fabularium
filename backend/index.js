"use strict";
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const systemRoutes = require("./routes/systemRoutes.js");
const characterRoutes = require("./routes/charactersRoutes.js");
const {checkAdmin, auth} = require("./middleware/safety.js");
const cookieParser = require("cookie-parser");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));


app.use('/users', userRoutes);
app.use("/characters", auth, characterRoutes);
app.use("/system", auth, systemRoutes);

app.use('/', (req, res) => {
    res.send("żelo elo");
});

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("serwer działa na porcie 3000");
});








