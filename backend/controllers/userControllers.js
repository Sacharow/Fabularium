"use strict";
require("dotenv").config();
const { PrismaClient, Role } = require("../generated/prisma/client");
const jwt = require("jsonwebtoken");
const z = require("zod");
const crypt = require("bcryptjs");
const path = require("path");
const swaggerUi = require("swagger-ui-express");

const prisma = new PrismaClient();

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email({ message: "not valid email" }),
  password: z.string().min(8),
});

const loginSchema = z.union([
  z.object({
    name: z.string().min(1),
    password: z.string().min(8),
  }),
  z.object({
    email: z.email({ message: "not valid email" }),
    password: z.string().min(8),
  }),
]);

const createUserClassic = async (req, res) => {
  try {
    const data = registerSchema.safeParse(req.body);

    if (!data.success) {
      return res
        .status(400)
        .json({
          message: "Validation failed",
          errors: z.treeifyError(data.error),
        });
    }
    const validated = data.data;

    validated.passwordHashed = await crypt.hash(validated.password, 13);
    delete validated.password;

    const user = await prisma.users.create({ data: validated });
    return res.status(201).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "problem with creating user", error: err });
  }
};

const login = async (req, res) => {
  try {
    const data = loginSchema.safeParse(req.body);

    if (!data.success) {
      return res
        .status(400)
        .json({
          message: "Validation failed",
          errors: z.treeifyError(data.error),
        });
    }

    const validated = data.data;
    const user = await prisma.users.findFirst({
      where: {
        OR: [{ name: validated.name }, { email: validated.email }],
      },
    });
    if (!user) {
      return res.status(404).json({ message: "No such user in database" });
    }

    const ok = await crypt.compare(validated.password, user.passwordHashed);

    if (!ok) {
      return res.status(401).json({ message: "Invalid password" });
    }

    const accessToken = jwt.sign(
      {
        id: user.id,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    const refreshToken = jwt.sign(
      { id: user.id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "1d" },
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    res
      .cookie("refresh_token", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
        path: "/",
      })
      .header("Authorization", accessToken)
      .json({ message: "Logged in" });

    return res.status(200).json({ message: "Logged in", user: safeUser });
  } catch (error) {
    console.error(error);
    return res
      .status(500)
      .json({ message: "An error occured while logging in", error });
  }
};

const logout = async (req, res) => {
  try {
    res.clearCookie("access_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    res.clearCookie("refresh_token", {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
    });

    return res.status(200).json({ message: "user logged out" });
  } catch (errors) {
    return res
      .status(500)
      .json({ message: "Problem with logging out", error: errors });
  }
};

const refresh = (req, res) => {
  const refreshToken = req.cookies.refresh_token;

  if (!refreshToken) {
    return res
      .status(401)
      .json({ message: "Access denied. No refresh token provided" });
  }

  try {
    const decoded = jwt.verify(refreshToken, process.env.JWT_SECRET);
    const accessToken = jwt.sign(
      { id: decoded.id, role: decoded.role },
      process.env.JWT_SECRET,
      { expiresIn: "1h" },
    );

    res.cookie("access_token", accessToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
    });

    return res.status(200).json({ message: "Token refreshed" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error with refreshing token", err });
  }
};

const getAllUsers = async (req, res) => {
  try {
    const data = await prisma.users.findMany();
    return res.status(200).json(data);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Błąd przy pobieraniu użytkowników", error: err });
  }
};

const getCurrentUser = async (req, res) => {
  try {
    if (!req.user?.id) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await prisma.users.findUnique({
      where: { id: req.user.id },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true,
        updatedAt: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    return res.status(200).json(user);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Błąd przy pobieraniu użytkownika", error: err });
  }
};

module.exports = {
  getAllUsers,
  createUserClassic,
  login,
  logout,
  refresh,
  getCurrentUser,
};
