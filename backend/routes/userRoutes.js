/**
 * @swagger
 * tags:
 *   name: Users
 *   description: Operacje na użytkownikach
 */

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobierz wszystkich użytkowników
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Lista użytkowników
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/User'
 *       500:
 *         description: Błąd serwera
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Rejestracja nowego użytkownika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - email
 *               - password
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       201:
 *         description: Użytkownik utworzony
 *       400:
 *         description: Błąd walidacji
 *       500:
 *         description: Błąd serwera
 */

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: Logowanie użytkownika
 *     tags: [Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Zalogowano pomyślnie
 *       400:
 *         description: Błąd walidacji
 *       401:
 *         description: Nieprawidłowe dane logowania
 *       404:
 *         description: Użytkownik nie znaleziony
 *       500:
 *         description: Błąd serwera
 */

/**
 * @swagger
 * /users/logout:
 *   post:
 *     summary: Wylogowanie użytkownika
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Wylogowano pomyślnie
 *       500:
 *         description: Błąd serwera
 */

/**
 * @swagger
 * /users/refresh:
 *   post:
 *     summary: Odśwież token dostępu
 *     tags: [Users]
 *     responses:
 *       200:
 *         description: Nowy token dostępu
 *       401:
 *         description: Brak refresh tokena
 *       500:
 *         description: Błąd serwera
 */

/**
 * @swagger
 * components:
 *   schemas:
 *     User:
 *       type: object
 *       properties:
 *         id:
 *           type: integer
 *         name:
 *           type: string
 *         email:
 *           type: string
 *         role:
 *           type: string
 */
'use strict';

/**
 * @swagger
 * /users:
 *   get:
 *     summary: Pobierz wszystkich użytkowników
 *     responses:
 *       200:
 *         description: Lista użytkowników
 */

const express = require('express');
const { getAllUsers, createUserClassic, login, logout, refresh } = require('../controllers/userControllers.js');
const { checkAdmin, auth } = require('../middleware/safety.js');

const router = express.Router();

router.get("/", auth, checkAdmin, getAllUsers);
router.post("/register", createUserClassic);
router.post("/login", login);
router.post("/logout", auth, logout);
router.post("/refresh", auth, refresh);


module.exports = router;