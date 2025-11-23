'use strict';

const express = require('express');
const { getAllUsers, createUserClassic, login } = require('../controllers/userControllers.js');

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", createUserClassic);
router.post("/login", login);


module.exports = router;