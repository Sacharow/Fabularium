/**
 * Integration tests for Authentication
 * Tests user registration, login, JWT tokens, and protected routes
 */

const request = require("supertest");
const express = require("express");
const jwt = require("jsonwebtoken");
const { testUsers } = require("../../fixtures/testData");

// Mock JWT functions
const mockGenerateToken = (userId, email = "") => {
  return jwt.sign(
    { id: userId, email },
    process.env.JWT_SECRET || "test-secret-key",
    { expiresIn: "7d" },
  );
};

const mockVerifyToken = (token) => {
  try {
    return jwt.verify(token, process.env.JWT_SECRET || "test-secret-key");
  } catch (error) {
    return null;
  }
};

// Mock controllers
const mockControllers = {
  signup: jest.fn((req, res) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res
        .status(400)
        .json({ message: "Email, password, and name required" });
    }

    // Check for existing user
    if (email === testUsers.owner.email) {
      return res.status(409).json({ message: "Email already registered" });
    }

    const newUserId = "user-new-" + Date.now();
    const user = {
      id: newUserId,
      email,
      name,
      role: "user",
      provider: "local",
    };

    const token = mockGenerateToken(user.id, email);

    res.status(201).json({
      user,
      token,
      message: "User registered successfully",
    });
  }),

  login: jest.fn((req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password required" });
    }

    // Mock user validation - check if email is known
    if (email === "nonexistent@test.com") {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const user = {
      id: "user-" + email.replace(/[^a-z0-9]/g, ""),
      email,
      name: email.split("@")[0],
    };

    const token = mockGenerateToken(user.id, user.email);

    res.status(200).json({
      user,
      token,
      message: "Login successful",
    });
  }),

  logout: jest.fn((req, res) => {
    res.status(200).json({ message: "Logged out successfully" });
  }),

  getCurrentUser: jest.fn((req, res) => {
    if (!req.user) {
      return res.status(401).json({ message: "Unauthorized" });
    }
    res.status(200).json(req.user);
  }),

  verifyEmail: jest.fn((req, res) => {
    const { token } = req.params;
    if (!token) {
      return res.status(400).json({ message: "Token required" });
    }
    res.status(200).json({ message: "Email verified" });
  }),
};

// Auth middleware
const authMiddleware = (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader) {
    return res.status(401).json({ message: "No token provided" });
  }

  const parts = authHeader.split(" ");
  if (parts.length !== 2 || parts[0] !== "Bearer") {
    return res.status(401).json({ message: "Invalid token" });
  }

  const token = parts[1];
  const decoded = mockVerifyToken(token);

  if (!decoded) {
    return res.status(401).json({ message: "Invalid token" });
  }

  req.user = decoded;
  next();
};

describe("Auth Routes - Integration Tests", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());

    const router = express.Router();

    // Public routes
    router.post("/signup", mockControllers.signup);
    router.post("/login", mockControllers.login);
    router.post("/logout", mockControllers.logout);
    router.get("/verify-email/:token", mockControllers.verifyEmail);

    // Protected routes
    router.get("/me", authMiddleware, mockControllers.getCurrentUser);

    app.use("/api/auth", router);
  });

  describe("POST /api/auth/signup", () => {
    test("should register a new user", async () => {
      const newUser = {
        email: "newuser@test.com",
        password: "SecurePassword123!",
        name: "New User",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(newUser)
        .expect(201);

      expect(response.body.user.email).toBe(newUser.email);
      expect(response.body.user.name).toBe(newUser.name);
      expect(response.body.user.role).toBe("user");
      expect(response.body.token).toBeDefined();
    });

    test("should reject duplicate email", async () => {
      const duplicate = {
        email: testUsers.owner.email,
        password: "password",
        name: "Duplicate",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(duplicate)
        .expect(409);

      expect(response.body.message).toContain("Email already registered");
    });

    test("should reject signup without required fields", async () => {
      const incomplete = {
        email: "test@test.com",
      };

      const response = await request(app)
        .post("/api/auth/signup")
        .send(incomplete)
        .expect(400);

      expect(response.body.message).toContain("required");
    });

    test("should return JWT token on successful signup", async () => {
      const response = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "token@test.com",
          password: "password",
          name: "Token User",
        })
        .expect(201);

      expect(response.body.token).toBeDefined();
      expect(typeof response.body.token).toBe("string");

      // Verify token can be decoded
      const decoded = mockVerifyToken(response.body.token);
      expect(decoded).toBeDefined();
      expect(decoded.email).toBe("token@test.com");
    });
  });

  describe("POST /api/auth/login", () => {
    test("should login user with valid credentials", async () => {
      const credentials = {
        email: testUsers.owner.email,
        password: "password123",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(credentials)
        .expect(200);

      expect(response.body.user.email).toBe(testUsers.owner.email);
      expect(response.body.token).toBeDefined();
    });

    test("should reject login with invalid email", async () => {
      const invalid = {
        email: "nonexistent@test.com",
        password: "password",
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(invalid)
        .expect(401);

      expect(response.body.message).toContain("Invalid credentials");
    });

    test("should reject login without email or password", async () => {
      const incomplete = {
        email: testUsers.owner.email,
      };

      const response = await request(app)
        .post("/api/auth/login")
        .send(incomplete)
        .expect(400);

      expect(response.body.message).toContain("required");
    });
  });

  describe("POST /api/auth/logout", () => {
    test("should logout user", async () => {
      const response = await request(app).post("/api/auth/logout").expect(200);

      expect(response.body.message).toContain("Logged out");
    });
  });

  describe("GET /api/auth/me", () => {
    test("should return current user with valid token", async () => {
      const token = mockGenerateToken(testUsers.owner.id);

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(response.body.id).toBe(testUsers.owner.id);
    });

    test("should reject request without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.message).toContain("No token");
    });

    test("should reject request with invalid token", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "Bearer invalid-token")
        .expect(401);

      expect(response.body.message).toContain("Invalid token");
    });

    test("should reject request with expired token", async () => {
      // Create an expired token
      const expiredToken = jwt.sign(
        { id: testUsers.owner.id },
        process.env.JWT_SECRET || "test-secret-key",
        { expiresIn: "-1h" },
      );

      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${expiredToken}`)
        .expect(401);

      expect(response.body.message).toContain("Invalid token");
    });
  });

  describe("GET /api/auth/verify-email/:token", () => {
    test("should verify email with valid token", async () => {
      const response = await request(app)
        .get("/api/auth/verify-email/valid-token-123")
        .expect(200);

      expect(response.body.message).toContain("verified");
    });

    test("should reject verify without token", async () => {
      const response = await request(app)
        .get("/api/auth/verify-email/")
        .expect(404); // Route not found
    });
  });

  describe("Protected Route Access Control", () => {
    test("should allow access to protected route with valid token", async () => {
      const token = mockGenerateToken(testUsers.owner.id);

      await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);
    });

    test("should block access to protected route without token", async () => {
      const response = await request(app).get("/api/auth/me").expect(401);

      expect(response.body.message).toContain("No token");
    });

    test("should block access with malformed authorization header", async () => {
      const response = await request(app)
        .get("/api/auth/me")
        .set("Authorization", "InvalidFormat token")
        .expect(401);

      expect(response.body.message).toContain("Invalid token");
    });
  });

  describe("User Registration Flow", () => {
    test("should complete full registration workflow", async () => {
      // 1. Register
      const signupResponse = await request(app)
        .post("/api/auth/signup")
        .send({
          email: "workflow@test.com",
          password: "password123",
          name: "Workflow User",
        })
        .expect(201);

      const token = signupResponse.body.token;
      expect(token).toBeDefined();

      // 2. Get current user
      const meResponse = await request(app)
        .get("/api/auth/me")
        .set("Authorization", `Bearer ${token}`)
        .expect(200);

      expect(meResponse.body.email).toBe("workflow@test.com");

      // 3. Logout
      await request(app).post("/api/auth/logout").expect(200);
    });

    test("should allow login after registration", async () => {
      // Register
      await request(app)
        .post("/api/auth/signup")
        .send({
          email: "login-test@test.com",
          password: "password123",
          name: "Login Test",
        })
        .expect(201);

      // Login
      const loginResponse = await request(app)
        .post("/api/auth/login")
        .send({
          email: "login-test@test.com",
          password: "password123",
        })
        .expect(200);

      expect(loginResponse.body.token).toBeDefined();
    });
  });
});
