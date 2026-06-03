"use strict";

const z = require("zod");

const statsSchema = z.object({
  str: z.number().int().min(1).max(30),
  strModifier: z.number().int().optional().nullable(),
  dex: z.number().int().min(1).max(30),
  dexModifier: z.number().int().optional().nullable(),
  con: z.number().int().min(1).max(30),
  conModifier: z.number().int().optional().nullable(),
  int: z.number().int().min(1).max(30),
  intModifier: z.number().int().optional().nullable(),
  wis: z.number().int().min(1).max(30),
  wisModifier: z.number().int().optional().nullable(),
  cha: z.number().int().min(1).max(30),
  chaModifier: z.number().int().optional().nullable(),
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

const spellSlotSchema = z.object({
  spellLevel: z.number().int().min(0),
  maxSlots: z.number().int().min(0),
  usedSlots: z.number().int().min(0),
});

const spellLevelEntrySchema = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    description: z.string().optional(),
  }),
]);

const spellsByLevelSchema = z.object({
  level0: z.array(spellLevelEntrySchema).optional(),
  level1: z.array(spellLevelEntrySchema).optional(),
  level2: z.array(spellLevelEntrySchema).optional(),
  level3: z.array(spellLevelEntrySchema).optional(),
  level4: z.array(spellLevelEntrySchema).optional(),
  level5: z.array(spellLevelEntrySchema).optional(),
  level6: z.array(spellLevelEntrySchema).optional(),
  level7: z.array(spellLevelEntrySchema).optional(),
  level8: z.array(spellLevelEntrySchema).optional(),
  level9: z.array(spellLevelEntrySchema).optional(),
});

const moneySchema = z.object({
  gp: z.number().int().min(0).optional(),
  sp: z.number().int().min(0).optional(),
  ep: z.number().int().min(0).optional(),
  cp: z.number().int().min(0).optional(),
  pp: z.number().int().min(0).optional(),
});

const equipmentItemSchema = z.union([
  z.string().min(1),
  z.object({
    name: z.string().min(1),
    type: z.string().optional(),
    weight: z.number().nullable().optional(),
    description: z.string().optional(),
  }),
]);

const createCharacterSchema = z.object({
  name: z.string().min(1).max(60),
  image: z.string().url().optional(),
  icon: z.string().url().optional(),
  background: z.string().optional(),
  alignment: z.string().optional(),
  level: z.number().int().positive().optional(),
  profBonus: z.number().int().optional(),
  race: z.string().optional(),
  raceId: z.string().optional(),
  class: z.string().optional(),
  classId: z.string().optional(),
  subclass: z.string().optional(),
  subclassId: z.string().optional(),
  campaignId: z.string().optional(),
  personalityTraits: z.string().optional(),
  ideals: z.string().optional(),
  languages: z.string().optional(),
  notes: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .optional(),
  bonds: z.string().optional(),
  flaws: z.string().optional(),
  height: z.string().optional(),
  weight: z.number().nullable().optional(),
  eyeColor: z.string().optional(),
  hairColor: z.string().optional(),
  skinColor: z.string().optional(),
  age: z.number().int().nullable().optional(),
  stats: statsSchema.optional(),
  statModifiers: z
    .object({
      str: z.number().int().optional().nullable(),
      dex: z.number().int().optional().nullable(),
      con: z.number().int().optional().nullable(),
      int: z.number().int().optional().nullable(),
      wis: z.number().int().optional().nullable(),
      cha: z.number().int().optional().nullable(),
    })
    .optional(),
});

const updateCharacterSchema = z.object({
  name: z.string().min(1).max(60).optional(),
  image: z.string().url().nullable().optional(),
  icon: z.string().url().nullable().optional(),
  background: z.string().nullable().optional(),
  alignment: z.string().nullable().optional(),
  level: z.number().int().positive().optional(),
  profBonus: z.number().int().optional(),
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
  languages: z.string().nullable().optional(),
  notes: z
    .array(
      z.object({
        title: z.string().optional(),
        content: z.string().optional(),
      }),
    )
    .optional(),
  bonds: z.string().nullable().optional(),
  flaws: z.string().nullable().optional(),
  height: z.string().nullable().optional(),
  weight: z.number().nullable().optional(),
  eyeColor: z.string().nullable().optional(),
  hairColor: z.string().nullable().optional(),
  skinColor: z.string().nullable().optional(),
  age: z.number().int().nullable().optional(),
  stats: statsSchema.optional(),
  statModifiers: z
    .object({
      str: z.number().int().optional().nullable(),
      dex: z.number().int().optional().nullable(),
      con: z.number().int().optional().nullable(),
      int: z.number().int().optional().nullable(),
      wis: z.number().int().optional().nullable(),
      cha: z.number().int().optional().nullable(),
    })
    .optional(),
  saves: savesSchema.optional(),
  skills: z.array(skillSchema).optional(),
  combat: combatSchema.optional(),
  features: z.array(z.string().min(1)).optional(),
  knownSpells: z.array(z.string().min(1)).optional(),
  preparedSpells: z.array(z.string().min(1)).optional(),
  spellsByLevel: spellsByLevelSchema.optional(),
  spellSlots: z.array(spellSlotSchema).optional(),
  equipment: z.array(equipmentItemSchema).optional(),
  money: moneySchema.optional(),
});

module.exports = {
  statsSchema,
  savesSchema,
  skillSchema,
  combatSchema,
  createCharacterSchema,
  updateCharacterSchema,
};
