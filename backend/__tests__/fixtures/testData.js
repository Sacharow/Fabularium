/**
 * Test data fixtures for unit and integration tests
 */

const testUsers = {
  owner: {
    id: "user-owner-1",
    email: "owner@test.com",
    name: "Owner User",
    role: "user",
    passwordHashed: "$2a$10$hashedpassword",
    provider: "local",
  },
  contributor: {
    id: "user-contributor-1",
    email: "contributor@test.com",
    name: "Contributor User",
    role: "user",
    passwordHashed: "$2a$10$hashedpassword",
    provider: "local",
  },
  otherUser: {
    id: "user-other-1",
    email: "other@test.com",
    name: "Other User",
    role: "user",
    passwordHashed: "$2a$10$hashedpassword",
    provider: "local",
  },
};

const testCampaigns = {
  basic: {
    id: "campaign-1",
    name: "Lost Mines of Phandalin",
    description: "A classic D&D adventure",
    joinCode: "ABC123",
    ownerId: testUsers.owner.id,
    photo: null,
    currentSession: 0,
  },
  withContributor: {
    id: "campaign-2",
    name: "Curse of Strahd",
    description: "Dark and gritty campaign",
    joinCode: "XYZ789",
    ownerId: testUsers.owner.id,
    photo: null,
    currentSession: 5,
  },
};

const testCharacters = {
  aragorn: {
    id: "char-1",
    name: "Aragorn",
    ownerId: testUsers.owner.id,
    campaignId: testCampaigns.basic.id,
    level: 5,
    xp: 6500,
    background: "Ranger",
    alignment: "Lawful Good",
    race: "Human",
    class: "Ranger",
    inspiration: false,
  },
  legolas: {
    id: "char-2",
    name: "Legolas",
    ownerId: testUsers.owner.id,
    campaignId: testCampaigns.basic.id,
    level: 5,
    xp: 6500,
    background: "Outlander",
    alignment: "Chaotic Good",
    race: "Elf",
    class: "Ranger",
    inspiration: false,
  },
};

const testLocations = {
  phandalin: {
    id: "loc-1",
    name: "Phandalin",
    description: "A frontier town in the Sword Coast",
    campaignId: testCampaigns.basic.id,
    isPublic: true,
  },
  mineEntrance: {
    id: "loc-2",
    name: "Lost Mines Entrance",
    description: "The entrance to the old dwarven mine",
    campaignId: testCampaigns.basic.id,
    isPublic: false,
  },
};

const testMissions = {
  findNecklace: {
    id: "mission-1",
    title: "Find the Goblin Necklace",
    description: "Recover the stolen necklace from the goblin chieftain",
    campaignId: testCampaigns.basic.id,
    status: "ACTIVE",
    isPublic: true,
  },
  clearMines: {
    id: "mission-2",
    title: "Clear the Lost Mines",
    description: "Defeat monsters occupying the ancient dwarven mines",
    campaignId: testCampaigns.basic.id,
    status: "ACTIVE",
    isPublic: false,
  },
};

const testNPCs = {
  grickle: {
    id: "npc-1",
    name: "Grickle",
    description: "A goblin shaman with mysterious powers",
    campaignId: testCampaigns.basic.id,
    isPublic: true,
  },
  sildar: {
    id: "npc-2",
    name: "Sildar Hallwinter",
    description: "A human fighter and survivor of Iarno's party",
    campaignId: testCampaigns.basic.id,
    isPublic: true,
  },
};

module.exports = {
  testUsers,
  testCampaigns,
  testCharacters,
  testLocations,
  testMissions,
  testNPCs,
};
