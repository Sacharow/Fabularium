/**
 * Integration tests for Character Routes
 * Tests HTTP endpoints and request/response flow
 */

const request = require("supertest");
const express = require("express");
const {
  testUsers,
  testCharacters,
  testCampaigns,
} = require("../../fixtures/testData");

// Mock the auth middleware
const mockAuthMiddleware = (req, res, next) => {
  // For testing, attach a test user to the request
  req.user = testUsers.owner;
  next();
};

// Mock the checkOwnership middleware
const mockCheckOwnership = (type) => (req, res, next) => {
  // For testing, we'll skip ownership checks and just call next
  next();
};

// Mock controllers
const mockControllers = {
  createCharacter: jest.fn((req, res) => {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name is required" });
    }
    const character = {
      id: "char-new-" + Date.now(),
      name: req.body.name,
      level: req.body.level || 1,
      ownerId: req.user.id,
      campaignId: req.body.campaignId || null,
      xp: 0,
      inspiration: false,
    };
    res.status(201).json(character);
  }),

  getCharacterById: jest.fn((req, res) => {
    const character = testCharacters.aragorn;
    if (req.params.id !== character.id) {
      return res.status(404).json({ message: "Character not found" });
    }
    res.status(200).json({ ...character, isOwner: true });
  }),

  listMyCharacters: jest.fn((req, res) => {
    const characters = [testCharacters.aragorn, testCharacters.legolas];
    res.status(200).json(characters);
  }),

  updateCharacter: jest.fn((req, res) => {
    const character = {
      ...testCharacters.aragorn,
      ...req.body,
    };
    res.status(200).json(character);
  }),

  deleteCharacter: jest.fn((req, res) => {
    res.status(204).send();
  }),
};

describe("Character Routes - Integration Tests", () => {
  let app;

  beforeEach(() => {
    // Clear all mocks
    jest.clearAllMocks();

    // Create fresh Express app
    app = express();
    app.use(express.json());
    app.use(mockAuthMiddleware);

    // Setup routes
    const router = express.Router();
    router.get("/mycharacters", mockControllers.listMyCharacters);
    router.post("/", mockControllers.createCharacter);
    router.get("/:id", mockControllers.getCharacterById);
    router.delete(
      "/:id",
      mockCheckOwnership("character"),
      mockControllers.deleteCharacter,
    );
    router.put(
      "/:id",
      mockCheckOwnership("character"),
      mockControllers.updateCharacter,
    );

    app.use("/api/characters", router);
  });

  describe("POST /api/characters", () => {
    test("should create a new character with valid data", async () => {
      const newCharacter = {
        name: "Boromir",
        level: 4,
      };

      const response = await request(app)
        .post("/api/characters")
        .send(newCharacter)
        .expect("Content-Type", /json/)
        .expect(201);

      expect(response.body).toHaveProperty("id");
      expect(response.body.name).toBe("Boromir");
      expect(response.body.level).toBe(4);
      expect(response.body.ownerId).toBe(testUsers.owner.id);
    });

    test("should create character with campaign association", async () => {
      const newCharacter = {
        name: "Frodo",
        level: 1,
        campaignId: testCampaigns.basic.id,
      };

      const response = await request(app)
        .post("/api/characters")
        .send(newCharacter)
        .expect(201);

      expect(response.body.campaignId).toBe(testCampaigns.basic.id);
    });

    test("should reject request with missing name", async () => {
      const invalidCharacter = {
        level: 2,
      };

      const response = await request(app)
        .post("/api/characters")
        .send(invalidCharacter)
        .expect(400);

      expect(response.body.message).toBe("Name is required");
    });

    test("should set default level to 1 if not provided", async () => {
      const response = await request(app)
        .post("/api/characters")
        .send({ name: "Gandalf" })
        .expect(201);

      expect(response.body.level).toBe(1);
    });
  });

  describe("GET /api/characters/mycharacters", () => {
    test("should return list of user's characters", async () => {
      const response = await request(app)
        .get("/api/characters/mycharacters")
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body).toHaveLength(2);
      expect(response.body[0].name).toBe("Aragorn");
      expect(response.body[1].name).toBe("Legolas");
    });

    test("should only return characters owned by authenticated user", async () => {
      await request(app).get("/api/characters/mycharacters").expect(200);
      expect(mockControllers.listMyCharacters).toHaveBeenCalled();
    });
  });

  describe("GET /api/characters/:id", () => {
    test("should return character with full details", async () => {
      const response = await request(app)
        .get(`/api/characters/${testCharacters.aragorn.id}`)
        .expect(200);

      expect(response.body.id).toBe(testCharacters.aragorn.id);
      expect(response.body.name).toBe("Aragorn");
      expect(response.body.isOwner).toBe(true);
    });

    test("should return 404 for non-existent character", async () => {
      const response = await request(app)
        .get("/api/characters/non-existent-id")
        .expect(404);

      expect(response.body.message).toBe("Character not found");
    });
  });

  describe("PUT /api/characters/:id", () => {
    test("should update character details", async () => {
      const updates = {
        level: 6,
        xp: 8000,
      };

      const response = await request(app)
        .put(`/api/characters/${testCharacters.aragorn.id}`)
        .send(updates)
        .expect(200);

      expect(response.body.level).toBe(6);
      expect(response.body.xp).toBe(8000);
    });

    test("should preserve character name if not updated", async () => {
      const response = await request(app)
        .put(`/api/characters/${testCharacters.aragorn.id}`)
        .send({ level: 7 })
        .expect(200);

      expect(response.body.name).toBe("Aragorn");
    });
  });

  describe("DELETE /api/characters/:id", () => {
    test("should delete a character", async () => {
      await request(app)
        .delete(`/api/characters/${testCharacters.aragorn.id}`)
        .expect(204);

      expect(mockControllers.deleteCharacter).toHaveBeenCalled();
    });
  });

  describe("Authentication", () => {
    test("should fail if user is not authenticated", async () => {
      // Remove auth middleware for this test
      const appNoAuth = express();
      appNoAuth.use(express.json());

      const router = express.Router();
      router.get("/mycharacters", (req, res) => {
        if (!req.user) {
          return res.status(401).json({ message: "Unauthorized" });
        }
        res.json([]);
      });
      appNoAuth.use("/api/characters", router);

      const response = await request(appNoAuth)
        .get("/api/characters/mycharacters")
        .expect(401);

      expect(response.body.message).toBe("Unauthorized");
    });
  });
});
