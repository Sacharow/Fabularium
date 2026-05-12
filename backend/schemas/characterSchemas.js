"use strict";

const z = require("zod");

const statsSchema = z.object({
  str: z.number().int().min(1).max(30),
  dex: z.number().int().min(1).max(30),
  con: z.number().int().min(1).max(30),
  int: z.number().int().min(1).max(30),
  wis: z.number().int().min(1).max(30),
  cha: z.number().int().min(1).max(30),
});

const savesSchema = z.object({
  strProficient: z.boolean(),
  dexProficient: z.boolean(),
  conProficient: z.boolean(),
  intProficient: z.boolean(),
  wisProficient: z.boolean(),
  chaProficient: z.boolean(),
});

const skillSchema = z.object({
  name: z.string().min(1),
  proficient: z.boolean(),
  expertise: z.boolean(),
  bonus: z.number().int().nullable().optional(),
});

const combatSchema = z.object({
  hp: z.number().int().min(0).optional(),
  hpMax: z.number().int().min(0).optional(),
  ac: z.number().int().min(0).nullable().optional(),
  initiative: z.number().int().nullable().optional(),
  speed: z.number().int().min(0).nullable().optional(),
  hitDiceType: z.number().int().nullable().optional(),
  hitDiceCurrent: z.number().int().nullable().optional(),
  hitDiceTotal: z.number().int().nullable().optional(),
  passivePerception: z.number().int().nullable().optional(),
});

const createCharacterSchema = z.object({
  name: z.string().min(1).max(60),
  image: z.string().url().optional(),
  icon: z.string().url().optional(),
  background: z.string().optional(),
  alignment: z.string().optional(),
  level: z.number().int().min(1).max(20).optional(),
  race: z.string().optional(),
  raceId: z.string().optional(),
  class: z.string().optional(),
  classId: z.string().optional(),
  subclass: z.string().optional(),
  subclassId: z.string().optional(),
  campaignId: z.string().optional(),
  personalityTraits: z.string().optional(),
  ideals: z.string().optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  stats: statsSchema.optional(),
});

const updateCharacterSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  image: z.string().url().nullable().optional(),
  icon: z.string().url().nullable().optional(),
  background: z.string().nullable().optional(),
  alignment: z.string().nullable().optional(),
  level: z.number().int().min(1).max(20).optional(),
  xp: z.number().int().min(0).optional(),
  inspiration: z.boolean().optional(),
  race: z.string().nullable().optional(),
  raceId: z.string().nullable().optional(),
  class: z.string().nullable().optional(),
  classId: z.string().nullable().optional(),
  subclass: z.string().nullable().optional(),
  subclassId: z.string().nullable().optional(),
  subrace: z.string().nullable().optional(),
  subraceId: z.string().nullable().optional(),
  campaignId: z.string().nullable().optional(),
  personalityTraits: z.string().nullable().optional(),
  ideals: z.string().nullable().optional(),
  bonds: z.string().nullable().optional(),
  flaws: z.string().nullable().optional(),
  stats: statsSchema.optional(),
  saves: savesSchema.optional(),
  skills: z.array(skillSchema).optional(),
  combat: combatSchema.optional(),
});

module.exports = {
  statsSchema,
  savesSchema,
  skillSchema,
  combatSchema,
  createCharacterSchema,
  updateCharacterSchema,
};
