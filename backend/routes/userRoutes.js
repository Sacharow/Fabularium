'use strict';

const express = require('express');
const { getAllUsers, createUserClassic, login, logout } = require('../controllers/userControllers.js');

const router = express.Router();

router.get("/", getAllUsers);
router.post("/register", createUserClassic);
router.post("/login", login);
router.post("/logout", logout);


module.exports = router;