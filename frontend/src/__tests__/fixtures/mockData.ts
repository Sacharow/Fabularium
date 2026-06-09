/**
 * Mock data fixtures for frontend tests
 */

export const mockUser = {
  id: "user-1",
  email: "test@example.com",
  name: "Test User",
  role: "user",
  provider: "local",
  bio: "Test user bio",
};

export const mockCampaign = {
  id: "campaign-1",
  name: "Lost Mines of Phandalin",
  description: "A classic D&D adventure",
  joinCode: "ABC123",
  ownerId: mockUser.id,
  photo: null,
  currentSession: 0,
  characters: [],
  locations: [],
  missions: [],
  npcs: [],
  notes: [],
  maps: [],
  contributors: [],
};

export const mockCharacter = {
  id: "char-1",
  name: "Aragorn",
  ownerId: mockUser.id,
  campaignId: mockCampaign.id,
  level: 5,
  xp: 6500,
  background: "Ranger",
  alignment: "Lawful Good",
  race: "Human",
  class: "Ranger",
  subrace: null,
  subclass: "Fey Wanderer",
  inspiration: false,
  createdAt: new Date("2024-01-01"),
  updatedAt: new Date("2024-01-15"),
  stats: {
    str: 16,
    dex: 15,
    con: 14,
    int: 10,
    wis: 13,
    cha: 11,
  },
  combat: {
    hp: 45,
    hpMax: 50,
    ac: 16,
    initiative: 2,
    speed: 30,
  },
  skills: [],
  features: [],
  knownSpells: [],
  currency: {
    gp: 100,
    sp: 50,
    ep: 0,
    cp: 20,
    pp: 0,
  },
};

export const mockLocation = {
  id: "loc-1",
  name: "Phandalin",
  description: "A frontier town in the Sword Coast",
  campaignId: mockCampaign.id,
  isPublic: true,
  npcs: [],
  missionLocations: [],
};

export const mockMission = {
  id: "mission-1",
  title: "Find the Goblin Necklace",
  description: "Recover the stolen necklace from the goblin chieftain",
  campaignId: mockCampaign.id,
  status: "ACTIVE",
  isPublic: true,
  missionNpcs: [],
  missionLocations: [],
};

export const mockNPC = {
  id: "npc-1",
  name: "Grickle",
  description: "A goblin shaman with mysterious powers",
  campaignId: mockCampaign.id,
  isPublic: true,
  missionNpcs: [],
  locations: [],
};

/**
 * Helper to create mock auth context
 */
export const createMockAuthContext = (overrides = {}) => ({
  user: mockUser,
  token: "mock-jwt-token",
  isLoading: false,
  error: null,
  login: () => Promise.resolve(),
  logout: () => Promise.resolve(),
  signup: () => Promise.resolve(),
  ...overrides,
});

/**
 * Helper to create mock campaign with defaults
 */
export const createMockCampaign = (overrides = {}) => ({
  ...mockCampaign,
  ...overrides,
});

/**
 * Helper to create mock character with defaults
 */
export const createMockCharacter = (overrides = {}) => ({
  ...mockCharacter,
  ...overrides,
});
