import type { ComponentType } from "react";

export interface RelatedItem {
  id: string;
  title: string;
}

export interface TextCard {
  id: string;
  title: string;
  content: string;
  section1Title?: string;
  section1Items?: RelatedItem[];
  section2Title?: string;
  section2Items?: RelatedItem[];
}

export interface NoteItem {
  id: string;
  title: string;
  content: string;
}

export interface PlayersContent {
  dm: { name: string; note?: string } | null;
  players: { name: string; role?: string }[];
}

export type CampaignSectionKey =
  | "general"
  | "locations"
  | "npcs"
  | "quests"
  | "notes"
  | "players";

export type CampaignSection = {
  key: CampaignSectionKey;
  label: string;
  icon?: ComponentType<{ className?: string }>;
  intro?: string;
  content: any;
};

export interface CampaignSectionProps {
  content: CampaignSection["content"];
}

export interface CampaignSectionInteractiveProps extends CampaignSectionProps {
  isEditMode?: boolean;
  onEditModeChange?: (isEditing: boolean) => void;
  onContentChange?: (newContent: CampaignSection["content"]) => void;
  onDeleteCampaign?: () => void;
}
