"use strict";
require("dotenv").config();
const { Role } = require("../generated/prisma/client");
const z = require("zod");
const { registerSchema, loginSchema } = require("../schemas/userSchemas");
const {
  createClassicUser,
  authenticateUser,
  buildAccessTokenFromRefreshPayload,
  verifyRefreshToken,
  listAllUsers,
  getUserById,
} = require("../services/userService");

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
    const user = await createClassicUser(data.data);
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

    const authResult = await authenticateUser(data.data);
    if (authResult.error) {
      return res.status(authResult.error.status).json({ message: authResult.error.message });
    }

    const { accessToken, refreshToken } = authResult;

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

    return;
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
    const decoded = verifyRefreshToken(refreshToken);
    const accessToken = buildAccessTokenFromRefreshPayload(decoded);

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
    const data = await listAllUsers();
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

    const { error, user } = await getUserById(req.user.id);
    if (error) {
      return res.status(error.status).json({ message: error.message });
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
