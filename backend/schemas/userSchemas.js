"use strict";

const z = require("zod");

const registerSchema = z.object({
  name: z.string().min(1),
  email: z.email({ message: "not valid email" }),
  password: z.string().min(8),
});

const updateProfileSchema = z.object({
  name: z.string().min(1).max(50),
  bio: z.string().max(500).optional().default(""),
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

module.exports = {
  registerSchema,
  loginSchema,
  updateProfileSchema,
};
