"use strict";

const campaignRoutes = require("../routes/campaignRoutes");
const systemRoutes = require("../routes/systemRoutes");

const flattenRoutes = (router, prefix = "") => {
  const routes = [];
  for (const layer of router.stack || []) {
    if (layer.route) {
      const methods = Object.keys(layer.route.methods)
        .map((method) => method.toUpperCase())
        .sort();
      for (const method of methods) {
        routes.push(`${method} ${prefix}${layer.route.path}`);
      }
      continue;
    }

    if (layer.name === "router" && layer.handle && Array.isArray(layer.handle.stack)) {
      routes.push(...flattenRoutes(layer.handle, prefix));
    }
  }
  return routes;
};

const assertRouteContract = (name, router, expectedRoutes) => {
  const actualRoutes = flattenRoutes(router).sort();
  const expectedSorted = [...expectedRoutes].sort();
  const actualSet = new Set(actualRoutes);
  const expectedSet = new Set(expectedSorted);

  const missing = expectedSorted.filter((route) => !actualSet.has(route));
  const extra = actualRoutes.filter((route) => !expectedSet.has(route));

  if (missing.length === 0 && extra.length === 0) {
    console.log(`${name}: ok (${actualRoutes.length} routes)`);
    return true;
  }

  console.error(`${name}: route contract mismatch`);
  if (missing.length > 0) {
    console.error("Missing routes:");
    for (const route of missing) {
      console.error(`  - ${route}`);
    }
  }
  if (extra.length > 0) {
    console.error("Extra routes:");
    for (const route of extra) {
      console.error(`  - ${route}`);
    }
  }
  return false;
};

const expectedCampaignRoutes = [
  "GET /",
  "GET /:id",
  "POST /",
  "PUT /:id",
  "DELETE /:id",
  "POST /:id/join-code",
  "POST /join",
  "GET /:id/contributors",
  "POST /:id/contributors",
  "DELETE /:id/contributors",
  "GET /:id/characters",
  "POST /:id/locations",
  "GET /:id/locations",
  "GET /:id/locations/:locationId",
  "PUT /:id/locations/:locationId",
  "DELETE /:id/locations/:locationId",
  "GET /:id/maps",
  "POST /:id/maps",
  "GET /:id/maps/:mapId",
  "PUT /:id/maps/:mapId",
  "DELETE /:id/maps/:mapId",
  "POST /:id/missions",
  "PUT /:id/missions/:missionId",
  "DELETE /:id/missions/:missionId",
  "POST /:id/notes",
  "PUT /:id/notes/:noteId",
  "DELETE /:id/notes/:noteId",
  "POST /:id/npcs",
  "GET /npcs",
  "GET /:id/npcs/:npcId",
  "PUT /:id/npcs/:npcId",
  "DELETE /:id/npcs/:npcId",
  "GET /:id/npcs",
  "GET /mission-npcs",
  "GET /mission-npcs/:MissionId/:npcId",
  "POST /mission-npcs",
  "PUT /mission-npcs/:MissionId/:npcId",
  "DELETE /mission-npcs/:MissionId/:npcId",
];

const expectedSystemRoutes = [
  "GET /races",
  "GET /races/:id",
  "POST /races",
  "PUT /races/:id",
  "DELETE /races/:id",
  "GET /classes",
  "GET /classes/:id",
  "POST /classes",
  "PUT /classes/:id",
  "DELETE /classes/:id",
  "GET /subclasses",
  "GET /subclasses/:id",
  "POST /subclasses",
  "PUT /subclasses/:id",
  "DELETE /subclasses/:id",
  "GET /race-abilities",
  "GET /race-abilities/:id",
  "POST /race-abilities",
  "PUT /race-abilities/:id",
  "DELETE /race-abilities/:id",
  "GET /spells",
  "GET /spells/:id",
  "POST /spells",
  "PUT /spells/:id",
  "DELETE /spells/:id",
  "GET /items",
  "GET /items/:id",
  "POST /items",
  "PUT /items/:id",
  "DELETE /items/:id",
  "GET /features",
  "GET /features/:id",
  "POST /features",
  "PUT /features/:id",
  "DELETE /features/:id",
  "GET /feats",
  "GET /feats/:id",
  "POST /feats",
  "PUT /feats/:id",
  "DELETE /feats/:id",
];

const campaignOk = assertRouteContract(
  "campaignRoutes",
  campaignRoutes,
  expectedCampaignRoutes,
);
const systemOk = assertRouteContract("systemRoutes", systemRoutes, expectedSystemRoutes);

if (!campaignOk || !systemOk) {
  process.exit(1);
}

console.log("Route contracts are stable.");