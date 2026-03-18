"use strict";

const router = require("express").Router();

router.use("/", require("./coreRoutes"));
router.use("/", require("./contentRoutes"));
router.use("/", require("./npcRoutes"));
router.use("/", require("./missionNpcRoutes"));

module.exports = router;