import type {
  CampaignSectionKey,
  NoteItem,
  PlayersContent,
  TextCard,
} from "../../components/CampaignPreview/types";

export type CampaignRecord = {
  id: string;
  name: string;
  description: string;
  joinCode: string;
  currentSession?: number;
  photo?: string | null;
  owner?: { id: string; name: string } | null;
  contributors?: Array<{ id: string; name: string }>;
  characters?: Array<{
    id: string;
    name: string;
    level?: number;
    ownerId?: string | null;
    race?: string | null;
    class?: string | null;
    subclass?: string | null;
    campaignId?: string | null;
  }>;
  missions?: Array<{
    id: string;
    title: string;
    description: string;
    isPublic?: boolean;
    locationId?: string | null;
    location?: { id: string; name: string } | null;
    missionNpcs?: Array<{ npc?: { id: string; name: string } | null }>;
    missionLocations?: Array<{
      location?: { id: string; name: string } | null;
    }>;
  }>;
  notes?: Array<{
    id: string;
    name: string;
    description: string;
  }>;
  locations?: Array<{
    id: string;
    name: string;
    description: string;
    isPublic?: boolean;
    npcs?: Array<{ id: string; name: string }>;
    missionLocations?: Array<{
      mission?: { id: string; title: string } | null;
    }>;
  }>;
  npcs?: Array<{
    id: string;
    name: string;
    description: string;
    isPublic?: boolean;
    locations?: Array<{ id: string; name: string }>;
    missionNpcs?: Array<{ mission?: { id: string; title: string } | null }>;
  }>;
};

export type EditableCampaignItem = {
  id: string;
  title: string;
  content: string;
};

const toRelatedItems = (
  items: Array<{ id: string; name?: string; title?: string }> = [],
) =>
  items
    .filter((item) => Boolean(item.id))
    .map((item) => ({
      id: item.id,
      title: item.title ?? item.name ?? "Untitled",
    }));

export const buildSectionContent = (campaign: CampaignRecord) => {
  const locations: TextCard[] = (campaign.locations ?? []).map((location) => {
    const relatedMissions = (location.missionLocations ?? []).map((entry) => ({
      id: entry.mission?.id ?? "",
      title: entry.mission?.title ?? "Untitled",
    }));

    return {
      id: location.id,
      title: location.name,
      content: location.description,
      isPublic: location.isPublic ?? false,
      section1Title: "Related NPCs",
      section1Items: toRelatedItems(location.npcs ?? []),
      section2Title: "Related Quests",
      section2Items: toRelatedItems(relatedMissions),
      linkedNpcIds: (location.npcs ?? []).map((n) => n.id),
      linkedMissionIds: (location.missionLocations ?? [])
        .map((entry) => entry.mission?.id ?? "")
        .filter(Boolean),
      allNpcs: toRelatedItems(campaign.npcs ?? []),
      allMissions: toRelatedItems(campaign.missions ?? []),
    };
  });

  const npcs: TextCard[] = (campaign.npcs ?? []).map((npc) => ({
    id: npc.id,
    title: npc.name,
    content: npc.description,
    isPublic: npc.isPublic ?? false,
    section1Title: "Related Locations",
    section1Items: toRelatedItems(npc.locations ?? []),
    section2Title: "Related Quests",
    section2Items: toRelatedItems(
      (npc.missionNpcs ?? []).map((entry) => ({
        id: entry.mission?.id ?? "",
        title: entry.mission?.title ?? "Untitled",
      })),
    ),
    linkedLocationIds: (npc.locations ?? []).map((l) => l.id),
    linkedMissionIds: (npc.missionNpcs ?? [])
      .map((entry) => entry.mission?.id ?? "")
      .filter(Boolean),
    allLocations: toRelatedItems(campaign.locations ?? []),
    allMissions: toRelatedItems(campaign.missions ?? []),
  }));

  const quests: TextCard[] = (campaign.missions ?? []).map((mission) => ({
    id: mission.id,
    title: mission.title,
    content: mission.description,
    isPublic: mission.isPublic ?? false,
    section1Title: "Related NPCs",
    section1Items: toRelatedItems(
      (mission.missionNpcs ?? []).map((entry) => ({
        id: entry.npc?.id ?? "",
        title: entry.npc?.name ?? "Untitled",
      })),
    ),
    section2Title: "Related Locations",
    section2Items: toRelatedItems(
      (mission.missionLocations ?? []).map((entry) => ({
        id: entry.location?.id ?? "",
        title: entry.location?.name ?? "Untitled",
      })),
    ),
    linkedNpcIds: (mission.missionNpcs ?? [])
      .map((m) => m.npc?.id ?? "")
      .filter(Boolean),
    linkedLocationIds: (mission.missionLocations ?? [])
      .map((m) => m.location?.id ?? "")
      .filter(Boolean),
    allLocations: toRelatedItems(campaign.locations ?? []),
    allNpcs: toRelatedItems(campaign.npcs ?? []),
  }));

  const notes: NoteItem[] = (campaign.notes ?? []).map((note) => ({
    id: note.id,
    title: note.name,
    content: note.description,
  }));

  const players: PlayersContent = {
    dm: campaign.owner ? { name: campaign.owner.name } : null,
    players: (campaign.contributors ?? []).map((contributor) => ({
      name: contributor.name,
      role: "Contributor",
    })),
  };

  return new Map<string, unknown>([
    [
      "general",
      {
        title: campaign.name,
        description: campaign.description,
        managedByAuthor: campaign.owner?.name ?? "Unknown",
        players: (campaign.contributors?.length ?? 0) + 1,
        currentSession:
          (campaign as any).currentSession ?? campaign.missions?.length ?? 0,
        notesCount: campaign.notes?.length ?? 0,
        image: campaign.photo || undefined,
        campaignKey: campaign.joinCode,
      },
    ],
    ["characters", campaign.characters ?? []],
    ["locations", locations],
    ["npcs", npcs],
    ["quests", quests],
    ["notes", notes],
    ["players", players],
  ]);
};

export const getEditableItemsForSection = (
  campaign: CampaignRecord,
  section: CampaignSectionKey,
) => {
  switch (section) {
    case "locations":
      return (campaign.locations ?? []).map((location) => ({
        id: location.id,
        title: location.name,
        content: location.description,
        isPublic: location.isPublic ?? false,
        linkedNpcIds: (location.npcs ?? []).map((n) => n.id),
        linkedMissionIds: (location.missionLocations ?? [])
          .map((entry) => entry.mission?.id ?? "")
          .filter(Boolean),
        allNpcs: toRelatedItems(campaign.npcs ?? []),
        allMissions: toRelatedItems(campaign.missions ?? []),
      }));
    case "npcs":
      return (campaign.npcs ?? []).map((npc) => ({
        id: npc.id,
        title: npc.name,
        content: npc.description,
        isPublic: npc.isPublic ?? false,
        linkedLocationIds: (npc.locations ?? []).map((l) => l.id),
        linkedMissionIds: (npc.missionNpcs ?? [])
          .map((entry) => entry.mission?.id ?? "")
          .filter(Boolean),
        allLocations: toRelatedItems(campaign.locations ?? []),
        allMissions: toRelatedItems(campaign.missions ?? []),
      }));
    case "quests":
      return (campaign.missions ?? []).map((mission) => ({
        id: mission.id,
        title: mission.title,
        content: mission.description,
        isPublic: mission.isPublic ?? false,
        linkedNpcIds: (mission.missionNpcs ?? [])
          .map((m) => m.npc?.id ?? "")
          .filter(Boolean),
        linkedLocationIds: (mission.missionLocations ?? [])
          .map((m) => m.location?.id ?? "")
          .filter(Boolean),
        allLocations: toRelatedItems(campaign.locations ?? []),
        allNpcs: toRelatedItems(campaign.npcs ?? []),
      }));
    case "notes":
      return (campaign.notes ?? []).map((note) => ({
        id: note.id,
        title: note.name,
        content: note.description,
      }));
    default:
      return [];
  }
};
