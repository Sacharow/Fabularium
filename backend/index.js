"use strict";
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const systemRoutes = require("./routes/systemRoutes.js");
const characterRoutes = require("./routes/charactersRoutes.js");
const {checkAdmin, auth, errorHandler} = require("./middleware/safety.js");
const cookieParser = require("cookie-parser");
const campaignRoutes = require("./routes/campaignRoutes.js");

const app = express();
app.use(express.json());
app.use(cookieParser());
app.use(cors());
app.use(morgan("dev"));

app.use('/api/users', userRoutes);
app.use("/api/characters", auth, characterRoutes);
app.use("/api/system", auth, systemRoutes);
app.use("/api/campaigns", campaignRoutes);

app.use('/', (req, res) => {
    res.send("app working");
});
app.use(errorHandler());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("serwer działa na porcie 3000");
});








