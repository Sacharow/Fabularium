"use strict";

const prisma = require("../config/database");
const jwt = require("jsonwebtoken");
const crypt = require("bcryptjs");

const createClassicUser = async (validatedUserData) => {
  const data = { ...validatedUserData };
  data.passwordHashed = await crypt.hash(data.password, 13);
  delete data.password;

  return prisma.users.create({ data });
};

const authenticateUser = async (credentials) => {
  const user = await prisma.users.findFirst({
    where: {
      OR: [{ name: credentials.name }, { email: credentials.email }],
    },
  });

  if (!user) {
    return { error: { status: 404, message: "No such user in database" } };
  }

  const ok = await crypt.compare(credentials.password, user.passwordHashed);
  if (!ok) {
    return { error: { status: 401, message: "Invalid password" } };
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

  return {
    user,
    accessToken,
    refreshToken,
  };
};

const buildAccessTokenFromRefreshPayload = (decodedRefreshToken) => {
  return jwt.sign(
    { id: decodedRefreshToken.id, role: decodedRefreshToken.role },
    process.env.JWT_SECRET,
    { expiresIn: "1h" },
  );
};

const verifyRefreshToken = (refreshToken) => {
  return jwt.verify(refreshToken, process.env.JWT_SECRET);
};

const listAllUsers = async () => {
  return prisma.users.findMany();
};

const getUserById = async (userId) => {
  const user = await prisma.users.findUnique({
    where: { id: userId },
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
    return { error: { status: 404, message: "User not found" } };
  }

  return { user };
};

module.exports = {
  createClassicUser,
  authenticateUser,
  buildAccessTokenFromRefreshPayload,
  verifyRefreshToken,
  listAllUsers,
  getUserById,
};
