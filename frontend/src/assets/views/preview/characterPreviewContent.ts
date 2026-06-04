import { Backpack, Dumbbell, Scroll, Wand2, User, Zap } from "lucide-react";
import type {
  AccordionItem,
  CharacterSection,
  PersonalNote,
  PersonalSectionContent,
  SkillDetail,
  StatDetail,
  StatSectionContent,
} from "../../components/CharacterPreview";
import type {
  AbilityKey,
  CharacterViewData,
  SpellLevelEntry,
} from "./characterPreviewTypes";

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

const spellLevelLabels: string[] = [
  "0th Level Spells",
  "1st Level Spells",
  "2nd Level Spells",
  "3rd Level Spells",
  "4th Level Spells",
  "5th Level Spells",
  "6th Level Spells",
  "7th Level Spells",
  "8th Level Spells",
  "9th Level Spells",
];

export const formatModifier = (value: number) =>
  `${value >= 0 ? "+" : ""}${value}`;

export const formatHeight = (height: string | number | null | undefined) => {
  const parsed =
    typeof height === "number" ? height : Number(String(height ?? "").trim());
  const value = Number.isFinite(parsed) ? parsed : 0;
  return `${value}`;
};

export const splitCharacterName = (name: string) => {
  const parts = name.trim().split("-");

  return {
    firstName: parts[0] || "",
    lastName: parts[1] || "",
    nickname: parts[2] || "",
  };
};

export const buildFeatures = (features: string[] = []): AccordionItem[] => [
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

const normalizeSpellsByLevel = (
  spellsByLevel: CharacterViewData["spellsByLevel"],
): Record<string, SpellLevelEntry[]> => {
  const normalized = Object.fromEntries(
    Array.from({ length: 10 }, (_, level) => [
      `level${level}`,
      [] as SpellLevelEntry[],
    ]),
  ) as Record<string, SpellLevelEntry[]>;

  if (!spellsByLevel) {
    return normalized;
  }

  Object.entries(spellsByLevel).forEach(([key, value]) => {
    if (!(key in normalized)) {
      return;
    }

    const parsed = (Array.isArray(value) ? value : []).map((spell) => {
      if (typeof spell === "string") {
        const name = spell.trim();
        return name ? { name, description: "" } : null;
      }

      if (spell && typeof spell === "object") {
        const name = String(spell.name || "").trim();
        if (!name) {
          return null;
        }

        return {
          name,
          description:
            typeof spell.description === "string" ? spell.description : "",
        };
      }

      return null;
    });

    normalized[key] = parsed.filter(
      (spell): spell is SpellLevelEntry => spell !== null,
    );
  });

  return normalized;
};

export const buildSpells = (
  spellsByLevel: CharacterViewData["spellsByLevel"],
): AccordionItem[] => {
  const normalized = normalizeSpellsByLevel(spellsByLevel);

  return Array.from({ length: 10 }, (_, level) => {
    const levelKey = `level${level}`;
    const spells = normalized[levelKey] || [];

    return {
      title: spellLevelLabels[level],
      content:
        spells.length > 0
          ? `${spells.length} spell${spells.length === 1 ? "" : "s"}`
          : "No spells recorded",
      subitems: spells.map((spell) => ({
        title: spell.name,
        content: spell.description || "",
      })),
    };
  });
};

export const buildInventory = (
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

export const buildCharacterSections = (
  character: CharacterViewData,
): CharacterSection[] => {
  const displayProficiencyBonus =
    character.profBonus != null ? formatModifier(character.profBonus) : "";
  const splitName = splitCharacterName(character.name);

  const rawStats = character.stats as
    | Array<{ name: string; value: number }>
    | Record<string, unknown>
    | undefined;
  const statModifiers = character.statModifiers ?? {};
  const rawSaves = character as {
    saves?: Record<string, boolean>;
  };
  const rawSkills = character as {
    skills?: Array<{
      name?: string;
      proficient?: boolean;
      expertise?: boolean;
      bonus?: number | null;
    }>;
  };

  const getRawSkillNames = (flag: "proficient" | "expertise") =>
    rawSkills.skills
      ?.filter((skill) => skill?.[flag])
      .map((skill) => skill.name || "") ?? [];

  const getAbilityScore = (abilityKey: AbilityKey) => {
    const scoreFromObject = character.abilityScores?.[abilityKey];

    if (typeof scoreFromObject === "number") {
      return scoreFromObject;
    }

    if (Array.isArray(rawStats)) {
      const matchingStat = rawStats.find((stat) => stat.name === abilityKey);
      return matchingStat?.value ?? 10;
    }

    if (rawStats && typeof rawStats === "object") {
      const directValue = rawStats[abilityKey];

      if (typeof directValue === "number") {
        return directValue;
      }
    }

    return 10;
  };

  const abilityProf = character.abilityProf?.length
    ? character.abilityProf
    : (Object.entries(rawSaves.saves ?? {})
        .filter(([, proficient]) => proficient)
        .map(([key]) => {
          const mapping: Record<string, AbilityKey> = {
            strProficient: "str",
            dexProficient: "dex",
            conProficient: "con",
            intProficient: "int",
            wisProficient: "wis",
            chaProficient: "cha",
          };

          return mapping[key];
        })
        .filter(Boolean) as AbilityKey[]);

  const skillProf = character.skillProf?.length
    ? character.skillProf
    : getRawSkillNames("proficient");

  const skillExpertise = character.skillExpertise?.length
    ? character.skillExpertise
    : getRawSkillNames("expertise");

  const generalSection: StatDetail[] = [
    { name: "Name", value: splitName.firstName || "" },
    { name: "Last Name", value: splitName.lastName || "" },
    { name: "Nickname", value: splitName.nickname || "" },
    { name: "Level", value: character.level },
    { name: "Experience", value: character.xp ?? 0 },
    { name: "Class", value: character.characterClass || "" },
    { name: "Subclass", value: character.characterSubclass || "" },
    { name: "Race", value: character.characterRace || "" },
    { name: "Subrace", value: character.characterSubrace || "" },
    { name: "Hit Points", value: character.hitPointsCurrent ?? "" },
    { name: "Armor Class", value: character.armorClass ?? "" },
    {
      name: "Speed",
      value: character.speed != null ? `${character.speed} ft.` : "",
    },
    {
      name: "Inspiration",
      value: character.inspiration ? "Yes" : "No",
    },
    { name: "Proficiency Bonus", value: displayProficiencyBonus },
  ];

  const personalSection: PersonalSectionContent = {
    details: [
      { label: "Personality", value: character.personalityTraits || "" },
      { label: "Ideals", value: character.ideals || "" },
      { label: "Bonds", value: character.bonds || "" },
      { label: "Flaws", value: character.flaws || "" },
      { label: "Alignment", value: character.alignment || "" },
      { label: "Languages", value: character.languages || "" },
      { label: "Height", value: formatHeight(character.height) },
      {
        label: "Weight",
        value:
          typeof character.weight === "number"
            ? `${character.weight} lbs`
            : character.weight != null
              ? String(character.weight)
              : "",
      },
      { label: "Eye Color", value: character.eyeColor || "" },
      { label: "Hair Color", value: character.hairColor || "" },
      { label: "Skin Color", value: character.skinColor || "" },
      {
        label: "Age",
        value:
          typeof character.age === "number"
            ? `${character.age} yr${character.age === 1 ? "" : "s"}`
            : character.age != null
              ? String(character.age)
              : "",
      },
    ],
    backstory: character.background || "",
    notes: (character.notes ?? []).map(
      (note): PersonalNote => ({
        title: note.title ?? "",
        content: note.content ?? "",
      }),
    ),
  };

  const statsSection: StatSectionContent = {
    proficiencyBonus:
      character.profBonus != null ? formatModifier(character.profBonus) : "",
    abilities: abilityOrder.map((ability) => {
      const score = getAbilityScore(ability.key);
      const isSavingThrowProficient = abilityProf.includes(ability.key);
      const skillBonusByName = character.skillBonuses ?? {};
      const storedModifier = statModifiers[ability.key];

      const skills: SkillDetail[] = skillGroups[ability.key].map(
        (skillName): SkillDetail => {
          const distinction: SkillDetail["distinction"] =
            skillExpertise.includes(skillName)
              ? "Expertise"
              : skillProf.includes(skillName)
                ? "Proficiency"
                : "Nothing";

          const storedBonus = skillBonusByName[skillName];

          return {
            name: skillName,
            modifier:
              typeof storedBonus === "number"
                ? formatModifier(storedBonus)
                : "",
            distinction,
          };
        },
      );

      // compute base modifier from explicit modifier or ability score
      const baseModifier =
        typeof storedModifier === "number"
          ? storedModifier
          : Math.floor((Number(score) - 10) / 2);

      // apply proficiency bonus if character is proficient in saving throw
      const profBonus =
        typeof character.profBonus === "number" ? character.profBonus : 0;
      const savingThrowValue = isSavingThrowProficient
        ? baseModifier + profBonus
        : baseModifier;

      return {
        ability: ability.label,
        score: String(score),
        modifier:
          typeof storedModifier === "number"
            ? formatModifier(storedModifier)
            : "",
        savingThrow: formatModifier(savingThrowValue),
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
      intro: "Spellbook grouped by spell level (0th to 9th).",
      content: buildSpells(character.spellsByLevel),
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
