import type {
  AccordionItem,
  CharacterSection,
  CharacterSectionKey,
  PersonalSectionContent,
  StatDetail,
  StatSectionContent,
} from "../../components/CharacterPreview";
import type {
  CharacterUpdatePayload,
  SpellLevelEntry,
} from "./characterPreviewTypes";

export const parseMaybeNumber = (value: string | number | undefined) => {
  if (typeof value === "number") {
    return Number.isFinite(value) ? value : undefined;
  }

  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "") {
    return undefined;
  }

  const parsedValue = Number(trimmedValue.replace(/[^0-9-]/g, ""));
  return Number.isFinite(parsedValue) ? parsedValue : undefined;
};

export const parseAbilityScore = (value: string | number | undefined) => {
  const parsedValue = parseMaybeNumber(value);

  if (typeof parsedValue !== "number") {
    return undefined;
  }

  return Math.min(30, Math.max(1, parsedValue));
};

export const parseMaybeText = (value: string | number | undefined) => {
  if (typeof value === "number") {
    return String(value);
  }

  const trimmedValue = value?.trim();
  if (!trimmedValue || trimmedValue === "") {
    return undefined;
  }

  return trimmedValue;
};

export const extractAccordionSubitemTitles = (items: AccordionItem[]) =>
  items.flatMap((item) =>
    (item.subitems ?? [])
      .map((subitem) => parseMaybeText(subitem.title))
      .filter((title): title is string => Boolean(title)),
  );

export const extractSpellLevelFromTitle = (title: string) => {
  const match = title.match(/(\d)/);
  if (!match) {
    return null;
  }

  const level = Number(match[1]);
  if (!Number.isInteger(level) || level < 0 || level > 9) {
    return null;
  }

  return level;
};

export const extractEquipmentItems = (items: AccordionItem[]) => {
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

export const getAccordionStringContent = (value: AccordionItem["content"]) =>
  typeof value === "string" ? value : "";

export const parseCurrencySubitems = (
  currencyItems: AccordionItem | undefined,
) => {
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

export const buildCharacterUpdatePayload = (
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

      if (characterClass && characterClass !== "") {
        payload.class = characterClass;
      }

      if (characterRace && characterRace !== "") {
        payload.race = characterRace;
      }

      if (subclass && subclass !== "") {
        payload.subclass = subclass;
      }

      if (subrace && subrace !== "") {
        payload.subrace = subrace;
      }

      const profBonus = parseMaybeNumber(
        getDetailValue(generalContent, "Proficiency Bonus"),
      );

      if (typeof profBonus === "number") {
        payload.profBonus = profBonus;
      }

      if (
        typeof hp === "number" ||
        typeof armorClass === "number" ||
        typeof speed === "number"
      ) {
        const combatData: NonNullable<CharacterUpdatePayload["combat"]> = {};
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
        height:
          parseMaybeText(getDetailValue(personalContent, "Height")) ?? null,
        weight:
          parseMaybeNumber(getDetailValue(personalContent, "Weight")) ?? null,
        eyeColor:
          parseMaybeText(getDetailValue(personalContent, "Eye Color")) ?? null,
        hairColor:
          parseMaybeText(getDetailValue(personalContent, "Hair Color")) ?? null,
        skinColor:
          parseMaybeText(getDetailValue(personalContent, "Skin Color")) ?? null,
        languages:
          parseMaybeText(getDetailValue(personalContent, "Languages")) ?? null,
        notes: (personalContent.notes ?? []).map((n) => ({
          title: parseMaybeText(n.title) ?? "",
          content: parseMaybeText(n.content) ?? "",
        })),
        age: parseMaybeNumber(getDetailValue(personalContent, "Age")) ?? null,
      };
    }
    case "stats": {
      const statsContent = content as StatSectionContent;
      const stats = { str: 10, dex: 10, con: 10, int: 10, wis: 10, cha: 10 };
      const statModifiers = {
        str: undefined as number | undefined,
        dex: undefined as number | undefined,
        con: undefined as number | undefined,
        int: undefined as number | undefined,
        wis: undefined as number | undefined,
        cha: undefined as number | undefined,
      };
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
        const score = parseAbilityScore(ability.score);
        const modifier = parseMaybeNumber(ability.modifier);

        if (typeof score === "number") {
          stats[abilityKey] = score;
        }

        if (typeof modifier === "number") {
          statModifiers[abilityKey] = modifier;
        }

        const saveKey = `${abilityKey}Proficient` as keyof typeof saves;
        saves[saveKey] = ability.savingThrowDistinction === "Proficiency";
      });

      const profBonus = parseMaybeNumber(statsContent.proficiencyBonus);

      const payload: CharacterUpdatePayload = {
        stats,
        statModifiers,
        saves,
        skills,
      };

      if (typeof profBonus === "number") {
        payload.profBonus = profBonus;
      }

      return payload;
    }
    case "features": {
      const featureItems = content as AccordionItem[];
      return {
        features: extractAccordionSubitemTitles(featureItems),
      };
    }
    case "spells": {
      const spellItems = content as AccordionItem[];
      const spellsByLevel = Array.from({ length: 10 }, (_, level) => ({
        key: `level${level}`,
        values: [] as SpellLevelEntry[],
      })).reduce(
        (acc, entry) => {
          acc[entry.key] = entry.values;
          return acc;
        },
        {} as Record<string, SpellLevelEntry[]>,
      );

      spellItems.forEach((item) => {
        const parsedLevel = extractSpellLevelFromTitle(item.title);
        if (parsedLevel == null) {
          return;
        }

        const key = `level${parsedLevel}`;
        const entries: SpellLevelEntry[] = (item.subitems ?? [])
          .map((subitem) => {
            const name = parseMaybeText(subitem.title);
            if (!name) {
              return null;
            }

            return {
              name,
              description:
                typeof subitem.content === "string" ? subitem.content : "",
            };
          })
          .filter((entry): entry is SpellLevelEntry => entry !== null);

        const deduped = entries.filter(
          (entry, index, arr) =>
            arr.findIndex((itemEntry) => itemEntry.name === entry.name) ===
            index,
        );
        spellsByLevel[key] = deduped;
      });

      return {
        spellsByLevel,
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
