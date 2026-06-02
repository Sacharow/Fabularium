export type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

export type SpellLevelEntry = {
  name: string;
  description: string;
};

export type SpellLevelPayloadEntry = SpellLevelEntry | string;

export type CharacterViewData = {
  id: string;
  name: string;
  level: number;
  xp?: number;
  inspiration?: boolean;
  profBonus?: number;
  characterClass?: string;
  characterRace?: string;
  characterSubrace?: string;
  characterSubclass?: string;
  abilityScores?: Partial<Record<AbilityKey, number>>;
  statModifiers?: Partial<Record<AbilityKey, number | null>>;
  abilityProf?: string[];
  stats?: Array<{ name: string; value: number }>;
  skillProf?: string[];
  skillExpertise?: string[];
  skillBonuses?: Record<string, number | null>;
  equipment?: Array<{
    name: string;
    type?: string;
    description?: string;
    weight?: number | null;
  }>;
  features?: string[];
  money?: Record<string, number>;
  background?: string | null;
  alignment?: string | null;
  personalityTraits?: string | null;
  ideals?: string | null;
  languages?: string | null;
  bonds?: string | null;
  flaws?: string | null;
  height?: string | null;
  weight?: number | null;
  eyeColor?: string | null;
  hairColor?: string | null;
  skinColor?: string | null;
  age?: number | null;
  notes?: Array<{ title?: string; content?: string }>;
  initiativeBonus?: number | null;
  speed?: number | null;
  hitDice?: number | null;
  hitPointsMax?: number | null;
  hitPointsCurrent?: number | null;
  armorClass?: number | null;
  passivePerception?: number | null;
  spellsByLevel?: Partial<
    Record<
      `level${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`,
      SpellLevelPayloadEntry[]
    >
  >;
  campaignId?: string | null;
  isOwner?: boolean;
  isCampaignOwner?: boolean;
};

export type CharacterUpdatePayload = {
  name?: string;
  level?: number;
  profBonus?: number;
  xp?: number;
  inspiration?: boolean;
  background?: string | null;
  alignment?: string | null;
  personalityTraits?: string | null;
  ideals?: string | null;
  languages?: string | null;
  bonds?: string | null;
  flaws?: string | null;
  height?: string | null;
  weight?: number | null;
  eyeColor?: string | null;
  hairColor?: string | null;
  skinColor?: string | null;
  age?: number | null;
  class?: string;
  race?: string;
  subclass?: string;
  subrace?: string;
  stats?: {
    str: number;
    dex: number;
    con: number;
    int: number;
    wis: number;
    cha: number;
  };
  statModifiers?: Partial<Record<AbilityKey, number | null>>;
  saves?: {
    strProficient: boolean;
    dexProficient: boolean;
    conProficient: boolean;
    intProficient: boolean;
    wisProficient: boolean;
    chaProficient: boolean;
  };
  skills?: Array<{
    name: string;
    proficient: boolean;
    expertise: boolean;
    bonus?: number | null;
  }>;
  combat?: {
    hp?: number;
    hpMax?: number;
    ac?: number | null;
    initiative?: number | null;
    speed?: number | null;
    hitDiceType?: number | null;
    hitDiceCurrent?: number | null;
    hitDiceTotal?: number | null;
    passivePerception?: number | null;
  };
  features?: string[];
  spellsByLevel?: Partial<
    Record<`level${0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9}`, SpellLevelEntry[]>
  >;
  equipment?: Array<{
    name: string;
    type?: string;
    weight?: number;
    description?: string;
  }>;
  money?: {
    gp?: number;
    sp?: number;
    ep?: number;
    cp?: number;
    pp?: number;
  };
  notes?: Array<{ title?: string; content?: string }>;
};
