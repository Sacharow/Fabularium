import type { ComponentType } from "react";

export type CharacterSectionKey =
  | "general"
  | "personal"
  | "stats"
  | "features"
  | "spells"
  | "inventory";

export interface StatDetail {
  name: string;
  value: string | number;
}

export interface SkillDetail {
  name: string;
  modifier: string;
  distinction: "Nothing" | "Proficiency" | "Expertise";
}

export interface AbilityStat {
  ability: string;
  score: string;
  modifier?: string;
  savingThrow: string;
  savingThrowDistinction: "Nothing" | "Proficiency";
  skills: SkillDetail[];
}

export interface AccordionItem {
  title: string;
  content: string | StatDetail[];
  subitems?: AccordionItem[];
  // Equipment-specific fields
  type?: string;
  weight?: number;
}

export interface PersonalDetail {
  label: string;
  value: string | number;
}

export interface PersonalNote {
  title: string;
  content: string;
}

export interface PersonalSectionContent {
  details: PersonalDetail[];
  backstory: string;
  notes: PersonalNote[];
}

export interface StatSectionContent {
  abilities: AbilityStat[];
  proficiencyBonus: string;
}

export type CharacterSection = {
  key: CharacterSectionKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
  intro: string;
  content:
    | AccordionItem[]
    | StatDetail[]
    | PersonalSectionContent
    | StatSectionContent;
};

export interface CharacterSectionProps {
  content: CharacterSection["content"];
  expandedItems: Set<string>;
  toggleItem: (itemId: string) => void;
  isEditMode?: boolean;
  onEditModeChange?: (isEditing: boolean) => void;
  onContentChange?: (newContent: CharacterSection["content"]) => void;
}
