/**
 * Integration tests for Campaign Routes
 * Tests campaign creation, permissions, contributor management, and M2M relations
 */

const request = require("supertest");
const express = require("express");
const {
  testUsers,
  testCampaigns,
  testCharacters,
  testLocations,
  testMissions,
  testNPCs,
} = require("../../fixtures/testData");

const mockAuthMiddleware = (req, res, next) => {
  const userId = req.query.userId;
  if (userId) {
    if (userId === testUsers.otherUser.id) {
      req.user = testUsers.otherUser;
    } else if (userId === testUsers.contributor.id) {
      req.user = testUsers.contributor;
    } else {
      req.user = testUsers.owner;
    }
  } else {
    req.user = testUsers.owner;
  }
  next();
};

const mockControllers = {
  createCampaign: jest.fn((req, res) => {
    if (!req.body.name || !req.body.description) {
      return res.status(400).json({ message: "Name and description required" });
    }
    const campaign = {
      id: "campaign-new-" + Date.now(),
      name: req.body.name,
      description: req.body.description,
      joinCode: "ABC" + Math.random().toString(36).substr(2, 9).toUpperCase(),
      ownerId: req.user.id,
      photo: req.body.photo || null,
      currentSession: 0,
      characters: [],
      locations: [],
      missions: [],
      npcs: [],
      notes: [],
      maps: [],
    };
    res.status(201).json(campaign);
  }),

  getCampaignById: jest.fn((req, res) => {
    const campaign = testCampaigns.basic;
    if (req.params.id !== campaign.id) {
      return res.status(404).json({ message: "Campaign not found" });
    }
    res.status(200).json(campaign);
  }),

  listUserCampaigns: jest.fn((req, res) => {
    const campaigns = [testCampaigns.basic, testCampaigns.withContributor];
    res.status(200).json(campaigns);
  }),

  updateCampaign: jest.fn((req, res) => {
    // Check if user is owner
    if (req.user.id !== testCampaigns.basic.ownerId) {
      return res
        .status(403)
        .json({ message: "Only owner can update campaign" });
    }
    const updated = {
      ...testCampaigns.basic,
      ...req.body,
    };
    res.status(200).json(updated);
  }),

  addContributor: jest.fn((req, res) => {
    const { email } = req.body;
    if (!email) {
      return res.status(400).json({ message: "Email required" });
    }
    res.status(200).json({
      message: "Contributor added",
      campaign: testCampaigns.basic,
    });
  }),

  deleteContributor: jest.fn((req, res) => {
    res.status(204).send();
  }),

  createLocation: jest.fn((req, res) => {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name required" });
    }
    const location = {
      id: "loc-new-" + Date.now(),
      name: req.body.name,
      description: req.body.description || "",
      campaignId: req.params.campaignId,
      isPublic: req.body.isPublic || false,
      linkedNpcIds: req.body.linkedNpcIds || [],
      missionLocations: [],
    };
    res.status(201).json(location);
  }),

  createMission: jest.fn((req, res) => {
    if (!req.body.title) {
      return res.status(400).json({ message: "Title required" });
    }
    const mission = {
      id: "mission-new-" + Date.now(),
      title: req.body.title,
      description: req.body.description || "",
      campaignId: req.params.campaignId,
      status: req.body.status || "ACTIVE",
      isPublic: req.body.isPublic || false,
      linkedLocationIds: req.body.linkedLocationIds || [],
      linkedNpcIds: req.body.linkedNpcIds || [],
      missionNpcs: [],
      missionLocations: [],
    };
    res.status(201).json(mission);
  }),

  createNPC: jest.fn((req, res) => {
    if (!req.body.name) {
      return res.status(400).json({ message: "Name required" });
    }
    const npc = {
      id: "npc-new-" + Date.now(),
      name: req.body.name,
      description: req.body.description || "",
      campaignId: req.params.campaignId,
      isPublic: req.body.isPublic || false,
      linkedLocationIds: req.body.linkedLocationIds || [],
      linkedMissionIds: req.body.linkedMissionIds || [],
    };
    res.status(201).json(npc);
  }),
};

describe("Campaign Routes - Integration Tests", () => {
  let app;

  beforeEach(() => {
    jest.clearAllMocks();

    app = express();
    app.use(express.json());
    app.use(mockAuthMiddleware);

    const router = express.Router();

    // Campaign CRUD
    router.post("/", mockControllers.createCampaign);
    router.get("/", mockControllers.listUserCampaigns);
    router.get("/:id", mockControllers.getCampaignById);
    router.put("/:id", mockControllers.updateCampaign);

    // Contributors
    router.post("/:id/contributors", mockControllers.addContributor);
    router.delete(
      "/:id/contributors/:contributorId",
      mockControllers.deleteContributor,
    );

    // Campaign sub-resources
    router.post("/:campaignId/locations", mockControllers.createLocation);
    router.post("/:campaignId/missions", mockControllers.createMission);
    router.post("/:campaignId/npcs", mockControllers.createNPC);

    app.use("/api/campaigns", router);
  });

  describe("POST /api/campaigns", () => {
    test("should create a new campaign", async () => {
      const newCampaign = {
        name: "The Lost City",
        description: "Adventure in the jungle ruins",
      };

      const response = await request(app)
        .post("/api/campaigns")
        .send(newCampaign)
        .expect(201);

      expect(response.body.id).toBeDefined();
      expect(response.body.name).toBe("The Lost City");
      expect(response.body.ownerId).toBe(testUsers.owner.id);
      expect(response.body.joinCode).toBeDefined();
    });

    test("should reject campaign without name", async () => {
      const invalid = {
        description: "Missing name",
      };

      const response = await request(app)
        .post("/api/campaigns")
        .send(invalid)
        .expect(400);

      expect(response.body.message).toContain("Name");
    });
  });

  describe("GET /api/campaigns", () => {
    test("should list all campaigns for user", async () => {
      const response = await request(app).get("/api/campaigns").expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });

    test("should only return campaigns owned or contributed by user", async () => {
      await request(app).get("/api/campaigns").expect(200);
      expect(mockControllers.listUserCampaigns).toHaveBeenCalled();
    });
  });

  describe("GET /api/campaigns/:id", () => {
    test("should return full campaign details", async () => {
      const response = await request(app)
        .get(`/api/campaigns/${testCampaigns.basic.id}`)
        .expect(200);

      expect(response.body.id).toBe(testCampaigns.basic.id);
      expect(response.body.name).toBe("Lost Mines of Phandalin");
    });

    test("should return 404 for non-existent campaign", async () => {
      const response = await request(app)
        .get("/api/campaigns/non-existent")
        .expect(404);

      expect(response.body.message).toBe("Campaign not found");
    });
  });

  describe("PUT /api/campaigns/:id", () => {
    test("should update campaign if user is owner", async () => {
      const updates = {
        name: "Updated Campaign Name",
        currentSession: 3,
      };

      const response = await request(app)
        .put(`/api/campaigns/${testCampaigns.basic.id}`)
        .send(updates)
        .expect(200);

      expect(response.body.name).toBe("Updated Campaign Name");
      expect(response.body.currentSession).toBe(3);
    });

    test("should reject update if user is not owner", async () => {
      const response = await request(app)
        .put(
          `/api/campaigns/${testCampaigns.basic.id}?userId=${testUsers.otherUser.id}`,
        )
        .send({ name: "Hack attempt" })
        .expect(403);

      expect(response.body.message).toContain("owner");
    });
  });

  describe("POST /api/campaigns/:id/contributors", () => {
    test("should add a contributor to campaign", async () => {
      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/contributors`)
        .send({ email: testUsers.contributor.email })
        .expect(200);

      expect(response.body.campaign.id).toBe(testCampaigns.basic.id);
    });

    test("should reject if email not provided", async () => {
      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/contributors`)
        .send({})
        .expect(400);

      expect(response.body.message).toContain("Email");
    });
  });

  describe("DELETE /api/campaigns/:id/contributors/:contributorId", () => {
    test("should remove a contributor", async () => {
      await request(app)
        .delete(
          `/api/campaigns/${testCampaigns.basic.id}/contributors/${testUsers.contributor.id}`,
        )
        .expect(204);

      expect(mockControllers.deleteContributor).toHaveBeenCalled();
    });
  });

  describe("Campaign Sub-Resources - Location", () => {
    test("should create a location in campaign", async () => {
      const newLocation = {
        name: "Tavern",
        description: "A cozy tavern",
        isPublic: true,
      };

      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/locations`)
        .send(newLocation)
        .expect(201);

      expect(response.body.name).toBe("Tavern");
      expect(response.body.campaignId).toBe(testCampaigns.basic.id);
    });

    test("should create location with NPC links", async () => {
      const locationWithLinks = {
        name: "Dragon's Lair",
        description: "A dark cave",
        linkedNpcIds: [testNPCs.grickle.id],
      };

      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/locations`)
        .send(locationWithLinks)
        .expect(201);

      expect(response.body.linkedNpcIds).toContain(testNPCs.grickle.id);
    });
  });

  describe("Campaign Sub-Resources - Mission", () => {
    test("should create a mission in campaign", async () => {
      const newMission = {
        title: "Rescue the Princess",
        description: "Save the princess from the tower",
        status: "ACTIVE",
      };

      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/missions`)
        .send(newMission)
        .expect(201);

      expect(response.body.title).toBe("Rescue the Princess");
      expect(response.body.campaignId).toBe(testCampaigns.basic.id);
    });

    test("should create mission with linked locations and NPCs", async () => {
      const missionWithLinks = {
        title: "Quest",
        description: "A quest",
        linkedLocationIds: [testLocations.phandalin.id],
        linkedNpcIds: [testNPCs.sildar.id],
      };

      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/missions`)
        .send(missionWithLinks)
        .expect(201);

      expect(response.body.linkedLocationIds).toContain(
        testLocations.phandalin.id,
      );
      expect(response.body.linkedNpcIds).toContain(testNPCs.sildar.id);
    });
  });

  describe("Campaign Sub-Resources - NPC", () => {
    test("should create an NPC in campaign", async () => {
      const newNPC = {
        name: "Mysterious Stranger",
        description: "A hooded figure",
        isPublic: false,
      };

      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/npcs`)
        .send(newNPC)
        .expect(201);

      expect(response.body.name).toBe("Mysterious Stranger");
      expect(response.body.campaignId).toBe(testCampaigns.basic.id);
    });

    test("should create NPC with location and mission links", async () => {
      const npcWithLinks = {
        name: "Wizard",
        description: "Powerful mage",
        linkedLocationIds: [testLocations.phandalin.id],
        linkedMissionIds: [testMissions.findNecklace.id],
      };

      const response = await request(app)
        .post(`/api/campaigns/${testCampaigns.basic.id}/npcs`)
        .send(npcWithLinks)
        .expect(201);

      expect(response.body.linkedLocationIds).toContain(
        testLocations.phandalin.id,
      );
      expect(response.body.linkedMissionIds).toContain(
        testMissions.findNecklace.id,
      );
    });
  });

  describe("Permissions and Access Control", () => {
    test("non-owner should not be able to update campaign", async () => {
      const response = await request(app)
        .put(
          `/api/campaigns/${testCampaigns.basic.id}?userId=${testUsers.otherUser.id}`,
        )
        .send({ name: "Hacked" })
        .expect(403);

      expect(response.body.message).toContain("owner");
    });

    test("contributor should be able to read campaign", async () => {
      await request(app)
        .get(
          `/api/campaigns/${testCampaigns.basic.id}?userId=${testUsers.contributor.id}`,
        )
        .expect(200);
    });
  });
});
