"use strict";

const cookieSecurity = [{ accessCookieAuth: [] }];
const refreshCookieSecurity = [{ refreshCookieAuth: [] }];

const pathParam = (name, description) => ({
  name,
  in: "path",
  required: true,
  schema: { type: "string" },
  description,
});

const jsonRequest = (schemaRef, required = true) => ({
  required,
  content: {
    "application/json": {
      schema: { $ref: schemaRef },
    },
  },
});

const openApiSpec = {
  openapi: "3.0.3",
  info: {
    title: "Fabularium API",
    version: "1.0.0",
    description:
      "Backend API for Fabularium. Authenticated routes use HttpOnly cookies. Main token checked by middleware: access_token cookie.",
  },
  servers: [
    {
      url: "http://localhost:3000",
      description: "Local development",
    },
  ],
  tags: [
    { name: "Users", description: "Authentication and user endpoints" },
    { name: "Characters", description: "Character CRUD for authenticated user" },
    { name: "Campaigns", description: "Campaign management" },
    { name: "Campaign Content", description: "Locations, maps, missions and notes" },
    { name: "Campaign NPC", description: "NPC and mission-NPC relation endpoints" },
    { name: "System", description: "RPG catalog resources" },
    { name: "Misc", description: "Public helper endpoints" },
  ],
  components: {
    securitySchemes: {
      accessCookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "access_token",
        description: "HttpOnly cookie used by auth middleware.",
      },
      refreshCookieAuth: {
        type: "apiKey",
        in: "cookie",
        name: "refresh_token",
        description: "HttpOnly refresh cookie used by /api/users/refresh endpoint.",
      },
    },
    schemas: {
      ErrorResponse: {
        type: "object",
        properties: {
          message: { type: "string" },
          errors: { type: "object", additionalProperties: true },
          error: { type: "object", additionalProperties: true },
        },
        required: ["message"],
      },
      SuccessMessage: {
        type: "object",
        properties: {
          message: { type: "string" },
        },
        required: ["message"],
      },
      GenericObject: {
        type: "object",
        additionalProperties: true,
      },
      GenericList: {
        type: "array",
        items: { type: "object", additionalProperties: true },
      },

      RegisterRequest: {
        type: "object",
        required: ["name", "email", "password"],
        properties: {
          name: { type: "string", minLength: 1 },
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },
      LoginByNameRequest: {
        type: "object",
        required: ["name", "password"],
        properties: {
          name: { type: "string", minLength: 1 },
          password: { type: "string", minLength: 8 },
        },
      },
      LoginByEmailRequest: {
        type: "object",
        required: ["email", "password"],
        properties: {
          email: { type: "string", format: "email" },
          password: { type: "string", minLength: 8 },
        },
      },

      CharacterStats: {
        type: "object",
        properties: {
          str: { type: "integer", minimum: 1, maximum: 30 },
          dex: { type: "integer", minimum: 1, maximum: 30 },
          con: { type: "integer", minimum: 1, maximum: 30 },
          int: { type: "integer", minimum: 1, maximum: 30 },
          wis: { type: "integer", minimum: 1, maximum: 30 },
          cha: { type: "integer", minimum: 1, maximum: 30 },
        },
      },
      CharacterCreateInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1, maxLength: 60 },
          background: { type: "string" },
          alignment: { type: "string" },
          level: { type: "integer", minimum: 1, maximum: 20 },
          raceId: { type: "string" },
          classId: { type: "string" },
          subclassId: { type: "string" },
          campaignId: { type: "string" },
          personalityTraits: { type: "string" },
          ideals: { type: "string" },
          bonds: { type: "string" },
          flaws: { type: "string" },
          stats: { $ref: "#/components/schemas/CharacterStats" },
        },
      },
      CharacterUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1, maxLength: 60 },
          background: { type: "string", nullable: true },
          alignment: { type: "string", nullable: true },
          level: { type: "integer", minimum: 1, maximum: 20 },
          raceId: { type: "string", nullable: true },
          classId: { type: "string", nullable: true },
          subclassId: { type: "string", nullable: true },
          campaignId: { type: "string", nullable: true },
          personalityTraits: { type: "string", nullable: true },
          ideals: { type: "string", nullable: true },
          bonds: { type: "string", nullable: true },
          flaws: { type: "string", nullable: true },
          stats: { $ref: "#/components/schemas/CharacterStats" },
        },
      },

      CampaignCreateInput: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
        },
      },
      CampaignUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
        },
      },
      JoinCampaignInput: {
        type: "object",
        required: ["joinCode"],
        properties: {
          joinCode: { type: "string", minLength: 6 },
        },
      },
      ContributorInput: {
        type: "object",
        required: ["userId"],
        properties: {
          userId: { type: "string" },
        },
      },

      LocationCreateInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
      LocationUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
      MapCreateInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          file: { type: "string" },
        },
      },
      MapUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          file: { type: "string" },
        },
      },
      MissionCreateInput: {
        type: "object",
        required: ["title"],
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed"],
          },
          locationId: { type: "string" },
        },
      },
      MissionUpdateInput: {
        type: "object",
        properties: {
          title: { type: "string", minLength: 1 },
          description: { type: "string" },
          status: {
            type: "string",
            enum: ["pending", "in_progress", "completed"],
          },
          locationId: { type: "string" },
        },
      },
      NoteCreateInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
      NoteUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
      NpcCreateInput: {
        type: "object",
        required: ["name", "description"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
          campaignId: { type: "string" },
        },
      },
      NpcUpdateInput: {
        type: "object",
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string", minLength: 1 },
        },
      },
      MissionNpcInput: {
        type: "object",
        required: ["MissionId", "npcId"],
        properties: {
          MissionId: { type: "string", minLength: 1 },
          npcId: { type: "string", minLength: 1 },
        },
      },

      RaceInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          size: {
            type: "string",
            enum: ["Tiny", "Small", "Medium", "Large", "Huge", "Gargantuan"],
          },
          speed: { type: "integer" },
          languages: { type: "string" },
        },
      },
      ClassInput: {
        type: "object",
        required: ["name", "hitDie", "savingThrows"],
        properties: {
          name: { type: "string", minLength: 1 },
          hitDie: { type: "integer" },
          spellcasting: { type: "boolean", default: false },
          savingThrows: { type: "array", items: { type: "string" } },
          description: { type: "string" },
        },
      },
      SubclassInput: {
        type: "object",
        required: ["name", "classId"],
        properties: {
          name: { type: "string", minLength: 1 },
          classId: { type: "string" },
          description: { type: "string" },
        },
      },
      SubraceInput: {
        type: "object",
        required: ["name", "parentRaceId"],
        properties: {
          name: { type: "string", minLength: 1 },
          parentRaceId: { type: "string" },
          description: { type: "string" },
        },
      },
      SubraceAbilityInput: {
        type: "object",
        required: ["name", "subRaceId"],
        properties: {
          name: { type: "string", minLength: 1 },
          subRaceId: { type: "string" },
          description: { type: "string" },
        },
      },
      RaceAbilityInput: {
        type: "object",
        required: ["name", "raceId"],
        properties: {
          name: { type: "string", minLength: 1 },
          raceId: { type: "string", format: "uuid" },
          description: { type: "string" },
        },
      },
      SpellInput: {
        type: "object",
        required: ["name", "level"],
        properties: {
          name: { type: "string", minLength: 1 },
          level: { type: "integer", minimum: 0, maximum: 9 },
          school: { type: "string" },
          castingTime: { type: "string" },
          range: { type: "string" },
          components: { type: "string" },
          duration: { type: "string" },
          description: { type: "string" },
        },
      },
      ItemInput: {
        type: "object",
        required: ["name", "type"],
        properties: {
          name: { type: "string", minLength: 1 },
          type: { type: "string", minLength: 1 },
          description: { type: "string" },
          weight: { type: "number" },
          value: { type: "integer" },
          properties: { type: "string" },
        },
      },
      FeatureInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
          sourceType: { type: "string" },
          sourceId: { type: "string" },
        },
      },
      FeatInput: {
        type: "object",
        required: ["name"],
        properties: {
          name: { type: "string", minLength: 1 },
          description: { type: "string" },
        },
      },
    },
    responses: {
      OkObject: {
        description: "Success",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenericObject" },
          },
        },
      },
      OkList: {
        description: "Success",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenericList" },
          },
        },
      },
      CreatedObject: {
        description: "Created",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/GenericObject" },
          },
        },
      },
      NoContent: {
        description: "No content",
      },
      BadRequest: {
        description: "Validation failed or malformed request",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Unauthorized: {
        description: "Authentication required or token invalid",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      Forbidden: {
        description: "Forbidden",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      NotFound: {
        description: "Resource not found",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
      InternalError: {
        description: "Internal server error",
        content: {
          "application/json": {
            schema: { $ref: "#/components/schemas/ErrorResponse" },
          },
        },
      },
    },
  },
  paths: {
    "/api/users": {
      get: {
        tags: ["Users"],
        summary: "List users (admin)",
        description: "Requires authenticated user with admin role.",
        security: cookieSecurity,
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/users/me": {
      get: {
        tags: ["Users"],
        summary: "Get current user",
        security: cookieSecurity,
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/users/register": {
      post: {
        tags: ["Users"],
        summary: "Register user",
        requestBody: jsonRequest("#/components/schemas/RegisterRequest"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/users/login": {
      post: {
        tags: ["Users"],
        summary: "Login user",
        description: "Accepts either { name, password } or { email, password }. Sets auth cookies.",
        requestBody: {
          required: true,
          content: {
            "application/json": {
              schema: {
                oneOf: [
                  { $ref: "#/components/schemas/LoginByNameRequest" },
                  { $ref: "#/components/schemas/LoginByEmailRequest" },
                ],
              },
            },
          },
        },
        responses: {
          200: {
            description: "Logged in",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/users/logout": {
      post: {
        tags: ["Users"],
        summary: "Logout user",
        security: cookieSecurity,
        responses: {
          200: {
            description: "Logged out",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/users/refresh": {
      post: {
        tags: ["Users"],
        summary: "Refresh access token",
        security: refreshCookieSecurity,
        responses: {
          200: {
            description: "Token refreshed",
            content: {
              "application/json": {
                schema: { $ref: "#/components/schemas/SuccessMessage" },
              },
            },
          },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/characters/mycharacters": {
      get: {
        tags: ["Characters"],
        summary: "List my characters",
        security: cookieSecurity,
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/characters": {
      post: {
        tags: ["Characters"],
        summary: "Create character",
        security: cookieSecurity,
        requestBody: jsonRequest("#/components/schemas/CharacterCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/characters/{id}": {
      get: {
        tags: ["Characters"],
        summary: "Get character by id",
        security: cookieSecurity,
        parameters: [pathParam("id", "Character id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Characters"],
        summary: "Update character by id",
        security: cookieSecurity,
        parameters: [pathParam("id", "Character id")],
        requestBody: jsonRequest("#/components/schemas/CharacterUpdateInput"),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Characters"],
        summary: "Delete character by id",
        security: cookieSecurity,
        parameters: [pathParam("id", "Character id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns": {
      get: {
        tags: ["Campaigns"],
        summary: "List campaigns",
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Campaigns"],
        summary: "Create campaign",
        security: cookieSecurity,
        requestBody: jsonRequest("#/components/schemas/CampaignCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}": {
      get: {
        tags: ["Campaigns"],
        summary: "Get campaign by id",
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Campaigns"],
        summary: "Update campaign by id",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/CampaignUpdateInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaigns"],
        summary: "Delete campaign by id",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/join-code": {
      post: {
        tags: ["Campaigns"],
        summary: "Generate campaign join code",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/join": {
      post: {
        tags: ["Campaigns"],
        summary: "Join campaign with code",
        security: cookieSecurity,
        requestBody: jsonRequest("#/components/schemas/JoinCampaignInput"),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/contributors": {
      get: {
        tags: ["Campaigns"],
        summary: "List contributors",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Campaigns"],
        summary: "Add contributor",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/ContributorInput"),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaigns"],
        summary: "Remove contributor",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/ContributorInput"),
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/characters": {
      get: {
        tags: ["Campaigns"],
        summary: "List campaign characters",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          401: { $ref: "#/components/responses/Unauthorized" },
          403: { $ref: "#/components/responses/Forbidden" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns/{id}/locations": {
      post: {
        tags: ["Campaign Content"],
        summary: "Create location",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/LocationCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      get: {
        tags: ["Campaign Content"],
        summary: "List campaign locations",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/locations/{locationId}": {
      get: {
        tags: ["Campaign Content"],
        summary: "Get location",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("locationId", "Location id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Campaign Content"],
        summary: "Update location",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("locationId", "Location id")],
        requestBody: jsonRequest("#/components/schemas/LocationUpdateInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaign Content"],
        summary: "Delete location",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("locationId", "Location id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns/{id}/maps": {
      get: {
        tags: ["Campaign Content"],
        summary: "List campaign maps",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Campaign Content"],
        summary: "Create map",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/MapCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/maps/{mapId}": {
      get: {
        tags: ["Campaign Content"],
        summary: "Get map",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("mapId", "Map id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Campaign Content"],
        summary: "Update map",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("mapId", "Map id")],
        requestBody: jsonRequest("#/components/schemas/MapUpdateInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaign Content"],
        summary: "Delete map",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("mapId", "Map id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns/{id}/missions": {
      post: {
        tags: ["Campaign Content"],
        summary: "Create mission",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/MissionCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/missions/{missionId}": {
      put: {
        tags: ["Campaign Content"],
        summary: "Update mission",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("missionId", "Mission id")],
        requestBody: jsonRequest("#/components/schemas/MissionUpdateInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaign Content"],
        summary: "Delete mission",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("missionId", "Mission id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns/{id}/notes": {
      post: {
        tags: ["Campaign Content"],
        summary: "Create note",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/NoteCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/notes/{noteId}": {
      put: {
        tags: ["Campaign Content"],
        summary: "Update note",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("noteId", "Note id")],
        requestBody: jsonRequest("#/components/schemas/NoteUpdateInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaign Content"],
        summary: "Delete note",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("noteId", "Note id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns/npcs": {
      get: {
        tags: ["Campaign NPC"],
        summary: "List all NPCs",
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/npcs": {
      post: {
        tags: ["Campaign NPC"],
        summary: "Create campaign NPC",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id")],
        requestBody: jsonRequest("#/components/schemas/NpcCreateInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      get: {
        tags: ["Campaign NPC"],
        summary: "List NPCs for campaign",
        parameters: [pathParam("id", "Campaign id")],
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/{id}/npcs/{npcId}": {
      get: {
        tags: ["Campaign NPC"],
        summary: "Get campaign NPC",
        parameters: [pathParam("id", "Campaign id"), pathParam("npcId", "NPC id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Campaign NPC"],
        summary: "Update campaign NPC",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("npcId", "NPC id")],
        requestBody: jsonRequest("#/components/schemas/NpcUpdateInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaign NPC"],
        summary: "Delete campaign NPC",
        security: cookieSecurity,
        parameters: [pathParam("id", "Campaign id"), pathParam("npcId", "NPC id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/campaigns/mission-npcs": {
      get: {
        tags: ["Campaign NPC"],
        summary: "List mission-NPC links",
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      post: {
        tags: ["Campaign NPC"],
        summary: "Create mission-NPC link",
        security: cookieSecurity,
        requestBody: jsonRequest("#/components/schemas/MissionNpcInput"),
        responses: {
          201: { $ref: "#/components/responses/CreatedObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/campaigns/mission-npcs/{MissionId}/{npcId}": {
      get: {
        tags: ["Campaign NPC"],
        summary: "Get mission-NPC link",
        parameters: [pathParam("MissionId", "Mission id"), pathParam("npcId", "NPC id")],
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      put: {
        tags: ["Campaign NPC"],
        summary: "Update mission-NPC link",
        security: cookieSecurity,
        parameters: [pathParam("MissionId", "Mission id"), pathParam("npcId", "NPC id")],
        requestBody: jsonRequest("#/components/schemas/MissionNpcInput", false),
        responses: {
          200: { $ref: "#/components/responses/OkObject" },
          400: { $ref: "#/components/responses/BadRequest" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
      delete: {
        tags: ["Campaign NPC"],
        summary: "Delete mission-NPC link",
        security: cookieSecurity,
        parameters: [pathParam("MissionId", "Mission id"), pathParam("npcId", "NPC id")],
        responses: {
          204: { $ref: "#/components/responses/NoContent" },
          401: { $ref: "#/components/responses/Unauthorized" },
          404: { $ref: "#/components/responses/NotFound" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },

    "/api/classes": {
      get: {
        tags: ["Misc"],
        summary: "List classes (shortcut)",
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
    "/api/races": {
      get: {
        tags: ["Misc"],
        summary: "List races (shortcut)",
        responses: {
          200: { $ref: "#/components/responses/OkList" },
          500: { $ref: "#/components/responses/InternalError" },
        },
      },
    },
  },
};

const systemResources = [
  { resource: "races", schema: "RaceInput", singular: "race" },
  { resource: "classes", schema: "ClassInput", singular: "class" },
  { resource: "subclasses", schema: "SubclassInput", singular: "subclass" },
  { resource: "subraces", schema: "SubraceInput", singular: "subrace" },
  { resource: "race-abilities", schema: "RaceAbilityInput", singular: "race ability" },
  { resource: "subrace-abilities", schema: "SubraceAbilityInput", singular: "subrace ability" },
  { resource: "spells", schema: "SpellInput", singular: "spell" },
  { resource: "items", schema: "ItemInput", singular: "item" },
  { resource: "features", schema: "FeatureInput", singular: "feature" },
  { resource: "feats", schema: "FeatInput", singular: "feat" },
];

for (const { resource, schema, singular } of systemResources) {
  const collectionPath = `/api/system/${resource}`;
  const singlePath = `/api/system/${resource}/{id}`;

  openApiSpec.paths[collectionPath] = {
    get: {
      tags: ["System"],
      summary: `List ${resource}`,
      security: cookieSecurity,
      responses: {
        200: { $ref: "#/components/responses/OkList" },
        401: { $ref: "#/components/responses/Unauthorized" },
        500: { $ref: "#/components/responses/InternalError" },
      },
    },
    post: {
      tags: ["System"],
      summary: `Create ${singular}`,
      description: "Requires authenticated user with admin role.",
      security: cookieSecurity,
      requestBody: jsonRequest(`#/components/schemas/${schema}`),
      responses: {
        201: { $ref: "#/components/responses/CreatedObject" },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        500: { $ref: "#/components/responses/InternalError" },
      },
    },
  };

  openApiSpec.paths[singlePath] = {
    get: {
      tags: ["System"],
      summary: `Get ${singular} by id`,
      security: cookieSecurity,
      parameters: [pathParam("id", `${singular} id`)],
      responses: {
        200: { $ref: "#/components/responses/OkObject" },
        401: { $ref: "#/components/responses/Unauthorized" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/InternalError" },
      },
    },
    put: {
      tags: ["System"],
      summary: `Update ${singular} by id`,
      description: "Requires authenticated user with admin role.",
      security: cookieSecurity,
      parameters: [pathParam("id", `${singular} id`)],
      requestBody: jsonRequest(`#/components/schemas/${schema}`, false),
      responses: {
        200: { $ref: "#/components/responses/OkObject" },
        400: { $ref: "#/components/responses/BadRequest" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/InternalError" },
      },
    },
    delete: {
      tags: ["System"],
      summary: `Delete ${singular} by id`,
      description: "Requires authenticated user with admin role.",
      security: cookieSecurity,
      parameters: [pathParam("id", `${singular} id`)],
      responses: {
        204: { $ref: "#/components/responses/NoContent" },
        401: { $ref: "#/components/responses/Unauthorized" },
        403: { $ref: "#/components/responses/Forbidden" },
        404: { $ref: "#/components/responses/NotFound" },
        500: { $ref: "#/components/responses/InternalError" },
      },
    },
  };
}

module.exports = openApiSpec;
