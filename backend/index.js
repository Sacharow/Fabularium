"use strict";
require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const userRoutes = require('./routes/userRoutes.js');
const systemRoutes = require("./routes/systemRoutes.js");
const characterRoutes = require("./routes/charactersRoutes.js");
const miscRoutes = require("./routes/miscRoutes.js");
const { auth, errorHandler } = require("./middleware/safety.js");
const cookieParser = require("cookie-parser");
const campaignRoutes = require("./routes/campaignRoutes.js");
const swaggerUi = require('swagger-ui-express');
const openApiSpec = require("./docs/openapi");

const app = express();
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next(err);
});
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}));
app.use(morgan("dev"));

app.use('/api/users', userRoutes);
app.use("/api/characters", auth, characterRoutes);
app.use("/api/system", auth, systemRoutes);
app.use("/api/campaigns", campaignRoutes);
app.use("/api", miscRoutes);

app.get('/api-docs.json', (req, res) => {
  res.json(openApiSpec);
});
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(openApiSpec, { explorer: true }));

app.get('/', (req, res) => {
    res.send("app working");
});
app.use(errorHandler());

const port = process.env.PORT || 3000;

app.listen(port, () => {
    console.log("serwer działa na porcie 3000");
});








