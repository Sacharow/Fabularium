'use strict'
const { listClasses, listRaces } = require("../controllers/miscControl");
const router = require("express").Router();

router.get("/classes", listClasses);
router.get("/races", listRaces);

module.exports = router;
