import { useEffect, useMemo, useState } from "react";
import { Scroll, User, Dumbbell, Wand2, Backpack, Zap } from "lucide-react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { characterService } from "../../../services/characterService";
import {
  GeneralSection,
  PersonalSection,
  StatsSection,
  AccordionSection,
  type CharacterSectionKey,
  type StatDetail,
  type PersonalSectionContent,
  type PersonalDetail,
  type PersonalNote,
  type SkillDetail,
  type StatSectionContent,
  type AccordionItem,
  type CharacterSection,
} from "../../components/CharacterPreview";

// Mock character data
const mockCharacter = {
  general: [
    { name: "Name", value: "Aragorn" },
    { name: "Last Name", value: "Strider" },
    { name: "Nickname", value: "The Ranger" },
    { name: "Level", value: 12 },
    { name: "Experience", value: "45,000 XP" },
    { name: "Class", value: "Fighter" },
    { name: "Subclass", value: "Champion" },
    { name: "Race", value: "Human" },
    { name: "Subrace", value: "Standard" },
    { name: "Hit Points", value: 98 },
    { name: "Armor Class", value: 16 },
    { name: "Speed", value: "30 ft." },
    { name: "Inspiration", value: 1 },
    { name: "Proficiency Bonus", value: "+3" },
  ] as StatDetail[],
  personal: {
    details: [
      {
        label: "Personality",
        value: "Stoic and determined with a dry sense of humor.",
      },
      { label: "Ideals", value: "Freedom and protection of the innocent." },
      {
        label: "Bonds",
        value: "Sworn to protect those who cannot protect themselves.",
      },
      { label: "Flaws", value: "Pushes himself beyond reasonable limits." },
      { label: "Alignment", value: "Lawful Good" },
      { label: "Languages", value: "Common, Elvish, Draconic" },
      { label: "Height", value: "6'4\"" },
      { label: "Weight", value: "215 lbs" },
      { label: "Eye Color", value: "Gray" },
      { label: "Hair Color", value: "Dark Brown" },
      { label: "Skin Color", value: "Fair" },
      { label: "Age", value: 35 },
    ] as PersonalDetail[],
    backstory:
      "Once a ranger of the wild lands, raised among the rangers and trained in the old ways. Now seeks redemption for past failures.",
    notes: [
      {
        title: "Family Heirloom Sword",
        content:
          "Carries a family heirloom sword passed down through generations.",
      },
      {
        title: "Fire Fear",
        content:
          "Becomes visibly tense around open flame and burning buildings.",
      },
    ] as PersonalNote[],
  },
  stats: {
    abilities: [
      {
        ability: "Strength",
        score: "16",
        modifier: "+3",
        savingThrow: "+6",
        savingThrowDistinction: "Proficiency",
        skills: [
          {
            name: "Athletics",
            modifier: "+9",
            distinction: "Expertise",
          },
        ],
      },
      {
        ability: "Dexterity",
        score: "14",
        modifier: "+2",
        savingThrow: "+2",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Acrobatics", modifier: "+2", distinction: "Nothing" },
          { name: "Sleight of Hand", modifier: "+2", distinction: "Nothing" },
          { name: "Stealth", modifier: "+2", distinction: "Nothing" },
        ],
      },
      {
        ability: "Constitution",
        score: "15",
        modifier: "+2",
        savingThrow: "+5",
        savingThrowDistinction: "Proficiency",
        skills: [],
      },
      {
        ability: "Intelligence",
        score: "13",
        modifier: "+1",
        savingThrow: "+1",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Arcana", modifier: "+4", distinction: "Proficiency" },
          { name: "History", modifier: "+4", distinction: "Proficiency" },
          { name: "Investigation", modifier: "+1", distinction: "Nothing" },
          { name: "Nature", modifier: "+1", distinction: "Nothing" },
          { name: "Religion", modifier: "+1", distinction: "Nothing" },
        ],
      },
      {
        ability: "Wisdom",
        score: "14",
        modifier: "+2",
        savingThrow: "+2",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Animal Handling", modifier: "+2", distinction: "Nothing" },
          { name: "Insight", modifier: "+2", distinction: "Nothing" },
          { name: "Medicine", modifier: "+2", distinction: "Nothing" },
          { name: "Perception", modifier: "+5", distinction: "Proficiency" },
          { name: "Survival", modifier: "+5", distinction: "Proficiency" },
        ],
      },
      {
        ability: "Charisma",
        score: "12",
        modifier: "+1",
        savingThrow: "+1",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Deception", modifier: "+1", distinction: "Nothing" },
          { name: "Intimidation", modifier: "+4", distinction: "Proficiency" },
          { name: "Performance", modifier: "+1", distinction: "Nothing" },
          { name: "Persuasion", modifier: "+1", distinction: "Nothing" },
        ],
      },
    ],
    proficiencyBonus: "+3",
  } satisfies StatSectionContent,
  features: [
    {
      title: "Class Features",
      content: "Fighter abilities and class-specific features",
      subitems: [
        { title: "Fighting Style", content: "Great Weapon Fighting" },
        { title: "Second Wind", content: "1d10 + 12 HP" },
        { title: "Action Surge", content: "Recharge on short rest" },
        { title: "Champion Archetype", content: "Improved Critical" },
      ],
    },
    {
      title: "Race Features",
      content: "Human racial abilities",
      subitems: [
        { title: "Ability Score Increase", content: "+1 to all attributes" },
        { title: "Extra Feat", content: "Great Weapon Master" },
      ],
    },
    {
      title: "Feats",
      content: "Character feats and special abilities",
      subitems: [
        { title: "Great Weapon Master", content: "-5 to hit, +10 damage" },
        { title: "Resilient", content: "Constitution saving throws +1" },
      ],
    },
    {
      title: "Other",
      content: "Additional features and abilities",
      subitems: [{ title: "Expertise", content: "Athletics, Intimidation" }],
    },
  ] as AccordionItem[],
  spells: [
    {
      title: "Cantrips (At Will)",
      content: "2 spells, at will",
      subitems: [
        { title: "Spell 1", content: "Description" },
        { title: "Spell 2", content: "Description" },
      ],
    },
    {
      title: "1st Level Spells",
      content: "2 spells, 4 total slots",
      subitems: [
        { title: "Spell Name 1", content: "Description" },
        { title: "Spell Name 2", content: "Description" },
      ],
    },
    {
      title: "2nd Level Spells",
      content: "1 spell, 3 total slots",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "3rd Level Spells",
      content: "1 spell, 3 total slots",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "4th Level Spells",
      content: "1 spell, 2 total slots",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "5th Level Spells",
      content: "1 spell, 1 total slot",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "6th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
    {
      title: "7th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
    {
      title: "8th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
    {
      title: "9th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
  ] as AccordionItem[],
  inventory: [
    {
      title: "Weapons",
      content: "Combat equipment",
      subitems: [
        { title: "Greatsword +1", content: "2d6 + 3, family heirloom" },
        { title: "Dagger", content: "1d4 + 3" },
      ],
    },
    {
      title: "Armor & Shields",
      content: "Protective equipment",
      subitems: [
        { title: "Plate Armor", content: "AC 18" },
        { title: "Shield", content: "+2 AC" },
      ],
    },
    {
      title: "Equipment",
      content: "Adventuring gear",
      subitems: [
        { title: "Backpack", content: "Standard adventurer's pack" },
        { title: "Rope (50ft)", content: "x2" },
        { title: "Torches", content: "x10" },
      ],
    },
    {
      title: "Magical Items",
      content: "Enchanted items and artifacts",
      subitems: [
        { title: "Ring of Protection", content: "+1 AC and saves" },
        { title: "Potion of Healing", content: "x3" },
      ],
    },
  ] as AccordionItem[],
};

void mockCharacter;

type AbilityKey = "str" | "dex" | "con" | "int" | "wis" | "cha";

type CharacterViewData = {
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
  abilityProf?: string[];
  stats?: Array<{ name: string; value: number }>;
  skillProf?: string[];
  skillExpertise?: string[];
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
  bonds?: string | null;
  flaws?: string | null;
  initiativeBonus?: number | null;
  speed?: number | null;
  hitDice?: number | null;
  hitPointsMax?: number | null;
  hitPointsCurrent?: number | null;
  armorClass?: number | null;
  passivePerception?: number | null;
  knownSpells?: string[];
  preparedSpells?: string[];
};

const abilityOrder: Array<{ key: AbilityKey; label: string }> = [
  { key: "str", label: "Strength" },
  { key: "dex", label: "Dexterity" },
  { key: "con", label: "Constitution" },
  { key: "int", label: "Intelligence" },
  { key: "wis", label: "Wisdom" },
  { key: "cha", label: "Charisma" },
];

const skillGroups: Record<AbilityKey, string[]> = {
  str: ["Athletics"],
  dex: ["Acrobatics", "Sleight of Hand", "Stealth"],
  con: [],
  int: ["Arcana", "History", "Investigation", "Nature", "Religion"],
  wis: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  cha: ["Deception", "Intimidation", "Performance", "Persuasion"],
};

const formatModifier = (value: number) => `${value >= 0 ? "+" : ""}${value}`;

const calculateModifier = (score: number) => Math.floor((score - 10) / 2);

const splitCharacterName = (name: string) => {
  const parts = name.trim().split("-");

  return {
    firstName: parts[0] || "",
    lastName: parts[1] || "",
    nickname: parts[2] || "",
  };
};

const buildFeatures = (features: string[] = []): AccordionItem[] => [
  {
    title: "Character Features",
    content:
      features.length > 0
        ? `${features.length} feature${features.length === 1 ? "" : "s"}`
        : "No features recorded",
    subitems:
      features.length > 0
        ? features.map((feature) => ({
            title: feature,
            content: "Feature detail unavailable",
          }))
        : undefined,
  },
];

const buildSpells = (
  knownSpells: string[] = [],
  preparedSpells: string[] = [],
): AccordionItem[] => [
  {
    title: "Known Spells",
    content:
      knownSpells.length > 0
        ? `${knownSpells.length} known`
        : "No known spells recorded",
    subitems:
      knownSpells.length > 0
        ? knownSpells.map((spell) => ({
            title: spell,
            content: "Spell detail unavailable",
          }))
        : undefined,
  },
  {
    title: "Prepared Spells",
    content:
      preparedSpells.length > 0
        ? `${preparedSpells.length} prepared`
        : "No prepared spells recorded",
    subitems:
      preparedSpells.length > 0
        ? preparedSpells.map((spell) => ({
            title: spell,
            content: "Prepared spell detail unavailable",
          }))
        : undefined,
  },
];

const buildInventory = (
  equipment: CharacterViewData["equipment"] = [],
  money: Record<string, number> = {},
): AccordionItem[] => {
  const currencyEntries = ["cp", "sp", "ep", "gp", "pp"]
    .map((currency) => ({
      currency,
      amount: money[currency] ?? 0,
    }))
    .map((entry) => ({
      title: entry.currency.toUpperCase(),
      content: `${entry.amount}`,
    }));

  return [
    {
      title: "Equipped Items",
      content:
        equipment.length > 0
          ? `${equipment.length} equipped`
          : "No equipped items recorded",
      subitems:
        equipment.length > 0
          ? equipment.map((item) => ({
              title: item.name,
              content: item.description || "No description provided",
              type: item.type || "Equipment",
              weight: item.weight ?? undefined,
            }))
          : undefined,
    },
    {
      title: "Currency",
      content: "5 coin types",
      subitems: currencyEntries,
    },
  ];
};

const buildCharacterSections = (
  character: CharacterViewData,
): CharacterSection[] => {
  const proficiencyBonus =
    character.profBonus ?? 2 + Math.floor((character.level - 1) / 4);
  const splitName = splitCharacterName(character.name);

  const getAbilityScore = (abilityKey: AbilityKey) => {
    const scoreFromObject = character.abilityScores?.[abilityKey];

    if (typeof scoreFromObject === "number") {
      return scoreFromObject;
    }

    const matchingStat = character.stats?.find(
      (stat) => stat.name === abilityKey,
    );

    return matchingStat?.value ?? 10;
  };

  const generalSection: StatDetail[] = [
    { name: "Name", value: splitName.firstName || "-" },
    { name: "Last Name", value: splitName.lastName || "-" },
    { name: "Nickname", value: splitName.nickname || "-" },
    { name: "Level", value: character.level },
    { name: "Experience", value: character.xp ?? 0 },
    { name: "Class", value: character.characterClass || "-" },
    { name: "Subclass", value: character.characterSubclass || "-" },
    { name: "Race", value: character.characterRace || "-" },
    { name: "Subrace", value: character.characterSubrace || "-" },
    { name: "Hit Points", value: character.hitPointsCurrent ?? "-" },
    { name: "Armor Class", value: character.armorClass ?? "-" },
    {
      name: "Speed",
      value: character.speed != null ? `${character.speed} ft.` : "-",
    },
    {
      name: "Inspiration",
      value: character.inspiration ? "Yes" : "No",
    },
    { name: "Proficiency Bonus", value: formatModifier(proficiencyBonus) },
  ];

  const personalSection: PersonalSectionContent = {
    details: [
      { label: "Personality", value: character.personalityTraits || "-" },
      { label: "Ideals", value: character.ideals || "-" },
      { label: "Bonds", value: character.bonds || "-" },
      { label: "Flaws", value: character.flaws || "-" },
      { label: "Alignment", value: character.alignment || "-" },
      { label: "Languages", value: "-" },
      { label: "Height", value: "-" },
      { label: "Weight", value: "-" },
      { label: "Eye Color", value: "-" },
      { label: "Hair Color", value: "-" },
      { label: "Skin Color", value: "-" },
      { label: "Age", value: "-" },
    ],
    backstory: character.background || "",
    notes: [],
  };

  const statsSection: StatSectionContent = {
    proficiencyBonus: formatModifier(proficiencyBonus),
    abilities: abilityOrder.map((ability) => {
      const score = getAbilityScore(ability.key);
      const modifier = calculateModifier(score);
      const isSavingThrowProficient =
        character.abilityProf?.includes(ability.key) || false;

      const skills: SkillDetail[] = skillGroups[ability.key].map(
        (skillName): SkillDetail => {
          const distinction: SkillDetail["distinction"] =
            character.skillExpertise?.includes(skillName)
              ? "Expertise"
              : character.skillProf?.includes(skillName)
                ? "Proficiency"
                : "Nothing";

          const skillBonus =
            modifier +
            (distinction === "Expertise"
              ? proficiencyBonus * 2
              : distinction === "Proficiency"
                ? proficiencyBonus
                : 0);

          return {
            name: skillName,
            modifier: formatModifier(skillBonus),
            distinction,
          };
        },
      );

      return {
        ability: ability.label,
        score: String(score),
        modifier: formatModifier(modifier),
        savingThrow: formatModifier(
          modifier + (isSavingThrowProficient ? proficiencyBonus : 0),
        ),
        savingThrowDistinction: isSavingThrowProficient
          ? "Proficiency"
          : "Nothing",
        skills,
      };
    }),
  };

  return [
    {
      key: "general",
      label: "General",
      icon: Scroll,
      intro: "Core information and vital statistics.",
      content: generalSection,
    },
    {
      key: "personal",
      label: "Personal",
      icon: User,
      intro: "Personality, background, and distinguishing features.",
      content: personalSection,
    },
    {
      key: "stats",
      label: "Stats",
      icon: Dumbbell,
      intro: "Ability scores, skills, and saving throws.",
      content: statsSection,
    },
    {
      key: "features",
      label: "Features",
      icon: Zap,
      intro: "Class features, racial abilities, feats, and special traits.",
      content: buildFeatures(character.features),
    },
    {
      key: "spells",
      label: "Spells",
      icon: Wand2,
      intro: "Prepared spells.",
      content: buildSpells(character.knownSpells, character.preparedSpells),
    },
    {
      key: "inventory",
      label: "Inventory",
      icon: Backpack,
      intro: "Equipment, items, and magical treasures.",
      content: buildInventory(character.equipment, character.money),
    },
  ];
};

type CharacterUpdatePayload = {
  name?: string;
  level?: number;
  xp?: number;
  inspiration?: boolean;
  background?: string | null;
  alignment?: string | null;
  personalityTraits?: string | null;
  ideals?: string | null;
  bonds?: string | null;
  flaws?: string | null;
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
  knownSpells?: string[];
  preparedSpells?: string[];
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
};

const parseMaybeNumber = (value: string | number | undefined) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "-") {
    return undefined;
  }

  const parsedValue = Number(trimmedValue.replace(/[^0-9-]/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

const parseMaybeText = (value: string | number | undefined) => {
  if (typeof value === "number") {
    return String(value);
  }

  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "-") {
    return undefined;
  }

  return trimmedValue;
};

const extractAccordionSubitemTitles = (items: AccordionItem[]) =>
  items.flatMap((item) =>
    (item.subitems ?? [])
      .map((subitem) => parseMaybeText(subitem.title))
      .filter((title): title is string => Boolean(title)),
  );

const extractEquipmentItems = (items: AccordionItem[]) => {
  return items.flatMap((item) =>
    (item.subitems ?? [])
      .map((subitem) => {
        const name = parseMaybeText(subitem.title);
        const description =
          typeof subitem.content === "string" ? subitem.content : "";

        return {
          name: name || "",
          type: subitem.type || "Equipment",
          weight: subitem.weight,
          description: description || "",
        };
      })
      .filter((item) => Boolean(item.name)),
  );
};

const getAccordionStringContent = (value: AccordionItem["content"]) =>
  typeof value === "string" ? value : "";

const parseCurrencySubitems = (currencyItems: AccordionItem | undefined) => {
  const money: CharacterUpdatePayload["money"] = {};
  (currencyItems?.subitems ?? []).forEach((subitem) => {
    const currencyKey = subitem.title.trim().toLowerCase();
    const amount = parseMaybeNumber(getAccordionStringContent(subitem.content));
    if (typeof amount !== "number") {
      return;
    }

    if (
      currencyKey === "gp" ||
      currencyKey === "sp" ||
      currencyKey === "ep" ||
      currencyKey === "cp" ||
      currencyKey === "pp"
    ) {
      money[currencyKey] = amount;
    }
  });

  return money;
};

const getDetailValue = (
  content: StatDetail[] | PersonalSectionContent,
  key: string,
) => {
  if (Array.isArray(content)) {
    return content.find((item) => item.name === key)?.value;
  }

  return content.details.find((item) => item.label === key)?.value;
};

const buildCharacterUpdatePayload = (
  sectionKey: CharacterSectionKey,
  content: CharacterSection["content"],
): CharacterUpdatePayload | null => {
  switch (sectionKey) {
    case "general": {
      const generalContent = content as StatDetail[];
      const firstName = parseMaybeText(getDetailValue(generalContent, "Name"));
      const lastName = parseMaybeText(
        getDetailValue(generalContent, "Last Name"),
      );
      const nickname = parseMaybeText(
        getDetailValue(generalContent, "Nickname"),
      );
      const level = parseMaybeNumber(getDetailValue(generalContent, "Level"));
      const xp = parseMaybeNumber(getDetailValue(generalContent, "Experience"));
      const hp = parseMaybeNumber(getDetailValue(generalContent, "Hit Points"));
      const armorClass = parseMaybeNumber(
        getDetailValue(generalContent, "Armor Class"),
      );
      const speed = parseMaybeNumber(getDetailValue(generalContent, "Speed"));
      const inspiration = parseMaybeText(
        getDetailValue(generalContent, "Inspiration"),
      );
      const characterClass = parseMaybeText(
        getDetailValue(generalContent, "Class"),
      );
      const characterRace = parseMaybeText(
        getDetailValue(generalContent, "Race"),
      );
      const subclass = parseMaybeText(
        getDetailValue(generalContent, "Subclass"),
      );
      const subrace = parseMaybeText(getDetailValue(generalContent, "Subrace"));

      const payload: CharacterUpdatePayload = {};

      if (firstName || lastName || nickname) {
        const parts = [firstName, lastName, nickname].map((p) => p || "");
        const builtName = parts
          .join("-")
          .replace(/^-+|-+$/g, "")
          .trim();
        if (builtName) {
          payload.name = builtName;
        }
      }

      if (typeof level === "number") {
        payload.level = level;
      }

      if (typeof xp === "number") {
        payload.xp = xp;
      }

      if (inspiration && inspiration.toLowerCase() === "yes") {
        payload.inspiration = true;
      } else if (inspiration && inspiration.toLowerCase() === "no") {
        payload.inspiration = false;
      }

      if (characterClass && characterClass !== "-") {
        payload.class = characterClass;
      }

      if (characterRace && characterRace !== "-") {
        payload.race = characterRace;
      }

      if (subclass && subclass !== "-") {
        payload.subclass = subclass;
      }

      if (subrace && subrace !== "-") {
        payload.subrace = subrace;
      }

      if (
        typeof hp === "number" ||
        typeof armorClass === "number" ||
        typeof speed === "number"
      ) {
        const combatData: any = {};
        if (typeof hp === "number") {
          combatData.hp = hp;
          combatData.hpMax = hp;
        }
        if (typeof armorClass === "number") {
          combatData.ac = armorClass;
        }
        if (typeof speed === "number") {
          combatData.speed = speed;
        }
        payload.combat = combatData;
      }

      return Object.keys(payload).length > 0 ? payload : null;
    }
    case "personal": {
      const personalContent = content as PersonalSectionContent;
      return {
        background: parseMaybeText(personalContent.backstory) ?? null,
        alignment:
          parseMaybeText(getDetailValue(personalContent, "Alignment")) ?? null,
        personalityTraits:
          parseMaybeText(getDetailValue(personalContent, "Personality")) ??
          null,
        ideals:
          parseMaybeText(getDetailValue(personalContent, "Ideals")) ?? null,
        bonds: parseMaybeText(getDetailValue(personalContent, "Bonds")) ?? null,
        flaws: parseMaybeText(getDetailValue(personalContent, "Flaws")) ?? null,
      };
    }
    case "stats": {
      const statsContent = content as StatSectionContent;
      const stats = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
      const saves = {
        strProficient: false,
        dexProficient: false,
        conProficient: false,
        intProficient: false,
        wisProficient: false,
        chaProficient: false,
      };
      const skills = statsContent.abilities.flatMap((ability) =>
        ability.skills.map((skill) => ({
          name: skill.name,
          proficient:
            skill.distinction === "Proficiency" ||
            skill.distinction === "Expertise",
          expertise: skill.distinction === "Expertise",
          bonus: parseMaybeNumber(skill.modifier),
        })),
      );

      statsContent.abilities.forEach((ability) => {
        const abilityKey = ability.ability
          .toLowerCase()
          .slice(0, 3) as keyof typeof stats;
        const score = parseMaybeNumber(ability.score);

        if (typeof score === "number") {
          stats[abilityKey] = score;
        }

        const saveKey = `${abilityKey}Proficient` as keyof typeof saves;
        saves[saveKey] = ability.savingThrowDistinction === "Proficiency";
      });

      return {
        stats,
        saves,
        skills,
      };
    }
    case "features": {
      const featureItems = content as AccordionItem[];
      return {
        features: extractAccordionSubitemTitles(featureItems),
      };
    }
    case "spells": {
      const spellItems = content as AccordionItem[];
      const knownSpellsItem = spellItems.find((item) =>
        item.title.toLowerCase().includes("known"),
      );
      const preparedSpellsItem = spellItems.find((item) =>
        item.title.toLowerCase().includes("prepared"),
      );

      return {
        knownSpells: extractAccordionSubitemTitles(
          knownSpellsItem ? [knownSpellsItem] : [],
        ),
        preparedSpells: extractAccordionSubitemTitles(
          preparedSpellsItem ? [preparedSpellsItem] : [],
        ),
      };
    }
    case "inventory": {
      const inventoryItems = content as AccordionItem[];
      const equippedItems = inventoryItems.find((item) =>
        item.title.toLowerCase().includes("equipped"),
      );
      const currencyItems = inventoryItems.find((item) =>
        item.title.toLowerCase().includes("currency"),
      );

      return {
        equipment: extractEquipmentItems(equippedItems ? [equippedItems] : []),
        money: parseCurrencySubitems(currencyItems),
      };
    }
    default:
      return null;
  }
};

function CharacterPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: characterId } = useParams();
  const [characterData, setCharacterData] = useState<CharacterViewData | null>(
    null,
  );
  const [loading, setLoading] = useState(Boolean(characterId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] =
    useState<CharacterSectionKey>("general");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] =
    useState<CharacterSectionKey | null>(null);
  const sections = useMemo(
    () =>
      characterId && characterData ? buildCharacterSections(characterData) : [],
    [characterData, characterId],
  );
  const sectionKeys = useMemo(
    () => sections.map((section) => section.key),
    [sections],
  );
  const [sectionContent, setSectionContent] = useState(
    new Map(sections.map((section) => [section.key, section.content])),
  );

  const sectionFromHash = location.hash.replace("#", "") as
    | CharacterSectionKey
    | "";
  const routeBase = characterId
    ? `/character/${characterId}`
    : "/preview/character";

  useEffect(() => {
    if (!characterId) {
      setCharacterData(null);
      setLoading(false);
      setLoadError(null);
      setSaveError(null);
      return;
    }

    let isMounted = true;

    const loadCharacter = async () => {
      try {
        setLoading(true);
        const data = await characterService.getCharacterById(characterId);

        if (!isMounted) {
          return;
        }

        setCharacterData(data);
        setLoadError(null);
      } catch (fetchError: any) {
        if (!isMounted) {
          return;
        }

        setCharacterData(null);
        setLoadError(fetchError?.message || "Failed to load character");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCharacter();

    return () => {
      isMounted = false;
    };
  }, [characterId]);

  useEffect(() => {
    setSectionContent(
      new Map(sections.map((section) => [section.key, section.content])),
    );
    setExpandedItems(new Set());
    setEditingSection(null);
  }, [sections]);

  useEffect(() => {
    if (
      !sectionFromHash ||
      !sectionKeys.includes(sectionFromHash as CharacterSectionKey)
    ) {
      navigate(`${routeBase}#general`, { replace: true });
      return;
    }

    setActiveSection(sectionFromHash as CharacterSectionKey);
  }, [location.hash, navigate, routeBase, sectionFromHash, sectionKeys]);

  const currentSection =
    sections.find((section) => section.key === activeSection) ?? sections[0];

  const currentContent = currentSection
    ? (sectionContent.get(activeSection) ?? currentSection.content)
    : undefined;

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleEditModeChange = (isEditing: boolean) => {
    if (isEditing) {
      setEditingSection(activeSection);
    } else {
      setEditingSection(null);
    }
  };

  const handleContentChange = async (
    newContent: CharacterSection["content"],
  ) => {
    const previousContent = sectionContent.get(activeSection);
    setSectionContent((prev) => new Map(prev).set(activeSection, newContent));
    setSaveError(null);

    if (!characterId) {
      return;
    }

    const payload = buildCharacterUpdatePayload(activeSection, newContent);
    if (!payload) {
      console.log("⏭️  No payload to send for section:", activeSection);
      return;
    }

    console.log(
      "🔄 Sending character update payload for section:",
      activeSection,
    );
    console.log("📋 Payload details:", JSON.stringify(payload, null, 2));

    try {
      setIsSaving(true);
      // Send update to server but don't wait for/refetch full character data
      // This keeps the UI responsive with optimistic updates
      await characterService.editCharacter(characterId, payload);
      console.log("✅ Character saved successfully");
    } catch (saveError: any) {
      console.error("❌ Save error:", saveError);
      console.error("📋 Error details:", saveError?.message);
      setSaveError(saveError?.message || "Failed to save character changes");
      if (previousContent) {
        setSectionContent((prev) =>
          new Map(prev).set(activeSection, previousContent),
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (characterId && loading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading character...
      </div>
    );
  }

  if (!characterId) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-neutral-text flex items-center justify-center">
        <div className="max-w-xl w-full border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-widest">
            CHARACTER VIEW NEEDS AN ID
          </h1>
          <p className="text-sm text-gray-light">
            Open a character from the character list to use this layout.
          </p>
          <button
            type="button"
            onClick={() => navigate("/characters")}
            className="self-start border border-gold-neutral bg-dark px-4 py-2 text-sm uppercase tracking-widest hover:bg-light"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  if (characterId && loadError) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-neutral-text flex items-center justify-center">
        <div className="max-w-xl w-full border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-widest">
            CHARACTER NOT AVAILABLE
          </h1>
          <p className="text-sm text-gray-light">{loadError}</p>
          <button
            type="button"
            onClick={() => navigate("/characters")}
            className="self-start border border-gold-neutral bg-dark px-4 py-2 text-sm uppercase tracking-widest hover:bg-light"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    const baseProps = {
      expandedItems,
      toggleItem,
      isEditMode: editingSection === activeSection,
      onEditModeChange: handleEditModeChange,
      onContentChange: handleContentChange,
    };

    switch (activeSection) {
      case "general":
        return (
          <GeneralSection
            {...baseProps}
            content={currentContent as StatDetail[]}
          />
        );
      case "personal":
        return (
          <PersonalSection
            {...baseProps}
            content={currentContent as PersonalSectionContent}
          />
        );
      case "stats":
        return (
          <StatsSection
            {...baseProps}
            content={currentContent as StatSectionContent}
          />
        );
      case "features":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
            sectionType="features"
          />
        );
      case "spells":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
            sectionType="spells"
          />
        );
      case "inventory":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
            sectionType="equipment"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-widest">
          {characterData?.name ?? "CHARACTER SHEET"}
        </h1>
        {characterData && (
          <p className="text-sm text-gold-light uppercase tracking-widest">
            Level {characterData.level}
            {characterData.characterClass
              ? ` · ${characterData.characterClass}`
              : ""}
            {characterData.characterRace
              ? ` · ${characterData.characterRace}`
              : ""}
          </p>
        )}
        <p className="text-sm text-gray-light max-w-2xl">
          {currentSection?.intro ?? "Core information and vital statistics."}
        </p>
        {saveError && (
          <div className="border border-error bg-red-950/40 px-4 py-3 text-sm text-error">
            {saveError}
          </div>
        )}
        {isSaving && (
          <p className="text-xs uppercase tracking-widest text-gold-light">
            Saving character changes...
          </p>
        )}
      </div>

      {/* Content Area */}
      <main className="flex flex-col gap-4">{renderSection()}</main>
    </div>
  );
}

export default CharacterPreview;
