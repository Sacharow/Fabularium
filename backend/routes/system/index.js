'use strict';

const router = require("express").Router();

router.use("/", require("./ancestryAndClassRoutes"));
router.use("/", require("./catalogRoutes"));

module.exports = router;