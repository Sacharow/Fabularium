'use strict';

const express = require('express');
const { getAllUsers, createUserClassic, login, logout } = require('../controllers/userControllers.js');
const { checkAdmin, auth } = require('../middleware/safety.js');

const router = express.Router();

router.get("/", auth, checkAdmin, getAllUsers);
router.post("/register", createUserClassic);
router.post("/login", login);
router.post("/logout", auth, logout);


module.exports = router;