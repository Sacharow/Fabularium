import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { campaignService } from "../../../services/campaignService";
import { CharacterSection } from "../../components/CampaignPreview/CharacterSection";
import { GeneralSection } from "../../components/CampaignPreview/GeneralSection";
import { TextCardSection } from "../../components/CampaignPreview/TextCardSection";
import { NotesSection } from "../../components/CampaignPreview/NotesSection";
import { PlayersSection } from "../../components/CampaignPreview/PlayersSection";
import type {
  NoteItem,
  PlayersContent,
  TextCard,
  CampaignSectionKey,
} from "../../components/CampaignPreview/types";
import {
  buildSectionContent,
  type CampaignRecord,
  type EditableCampaignItem,
  getEditableItemsForSection,
} from "./campaignPreviewHelpers";

function CampaignPreviewView() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = useParams<{ id?: string }>();
  const campaignId = params.id;
  const [activeSection, setActiveSection] = useState<string>(
    (location.hash.replace("#", "") || "general") as string,
  );

  const [campaign, setCampaign] = useState<CampaignRecord | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [editingSection, setEditingSection] = useState<string | null>(null);
  const [sectionContent, setSectionContent] = useState(
    new Map<string, unknown>(),
  );

  const handleEditModeChange = (
    section: CampaignSectionKey,
    isEditing: boolean,
  ) => {
    setEditingSection(isEditing ? section : null);
  };

  const handleContentChange = (
    section: CampaignSectionKey,
    newContent: any,
  ) => {
    setSectionContent((prev) => new Map(prev).set(section, newContent));

    if (!campaignId) {
      return;
    }

    const persist = async () => {
      if (section === "general") {
        const nextContent = newContent as {
          title?: string;
          description?: string;
          image?: string;
          currentSession?: number;
        };

        const updated = (await campaignService.updateCampaign(campaignId, {
          name: nextContent.title?.trim() || undefined,
          description: nextContent.description?.trim() || undefined,
          photo: nextContent.image || undefined,
          currentSession: nextContent.currentSession,
        })) as CampaignRecord;

        const merged: CampaignRecord = {
          ...updated,
          missions: (campaign?.missions as any) ?? updated.missions ?? [],
          notes: (campaign?.notes as any) ?? updated.notes ?? [],
          npcs: (campaign?.npcs as any) ?? updated.npcs ?? [],
          locations: (campaign?.locations as any) ?? updated.locations ?? [],
          contributors:
            (campaign?.contributors as any) ?? updated.contributors ?? [],
          owner: campaign?.owner ?? updated.owner,
          currentSession:
            (updated as any).currentSession ??
            (campaign as any)?.currentSession ??
            campaign?.missions?.length ??
            0,
        };

        setCampaign(merged);
        setSectionContent(buildSectionContent(merged));
        return;
      }

      if (!campaign) {
        return;
      }

      const editedItems = Array.isArray(newContent)
        ? (newContent as EditableCampaignItem[])
        : [];
      const existingItems = getEditableItemsForSection(campaign, section);
      const existingById = new Map(
        existingItems.map((item) => [item.id, item]),
      );
      const incomingIds = new Set(editedItems.map((item) => item.id));

      const createOps: Promise<unknown>[] = [];
      const updateOps: Promise<unknown>[] = [];
      const deleteOps: Promise<unknown>[] = [];

      editedItems.forEach((item) => {
        const payload: any = {
          title: item.title,
          content: item.content,
        };

        if ((item as any).linkedNpcIds) {
          payload.linkedNpcIds = (item as any).linkedNpcIds;
        }
        if ((item as any).linkedLocationIds) {
          payload.linkedLocationIds = (item as any).linkedLocationIds;
        }
        if ((item as any).linkedMissionIds) {
          payload.linkedMissionIds = (item as any).linkedMissionIds;
        }

        if (item.id.startsWith("new-")) {
          switch (section) {
            case "locations":
              createOps.push(
                campaignService.createLocation(campaignId, payload),
              );
              break;
            case "npcs":
              createOps.push(
                campaignService.createNPC(campaignId, {
                  ...payload,
                  campaignId,
                }),
              );
              break;
            case "quests":
              createOps.push(
                campaignService.createMission(campaignId, payload),
              );
              break;
            case "notes":
              createOps.push(campaignService.createNote(campaignId, payload));
              break;
          }
          return;
        }

        if (!existingById.has(item.id)) {
          return;
        }

        switch (section) {
          case "locations":
            updateOps.push(
              campaignService.updateLocation(campaignId, item.id, payload),
            );
            break;
          case "npcs":
            updateOps.push(
              campaignService.updateNPC(campaignId, item.id, payload),
            );
            break;
          case "quests":
            updateOps.push(
              campaignService.updateMission(campaignId, item.id, payload),
            );
            break;
          case "notes":
            updateOps.push(
              campaignService.updateNote(campaignId, item.id, payload),
            );
            break;
        }
      });

      existingItems.forEach((item) => {
        if (incomingIds.has(item.id)) {
          return;
        }

        switch (section) {
          case "locations":
            deleteOps.push(campaignService.deleteLocation(campaignId, item.id));
            break;
          case "npcs":
            deleteOps.push(campaignService.deleteNPC(campaignId, item.id));
            break;
          case "quests":
            deleteOps.push(campaignService.deleteMission(campaignId, item.id));
            break;
          case "notes":
            deleteOps.push(campaignService.deleteNote(campaignId, item.id));
            break;
        }
      });

      const updateResults = await Promise.all(updateOps);
      const createResults = await Promise.all(createOps);
      await Promise.all(deleteOps);

      const deletedIds = (getEditableItemsForSection(campaign, section) ?? [])
        .filter((item) => !incomingIds.has(item.id))
        .map((i) => i.id);

      const nextCampaign = {
        ...(campaign as CampaignRecord),
      } as CampaignRecord;

      const applyUpdates = (arrKey: keyof CampaignRecord, idKey = "id") => {
        const list = (nextCampaign as any)[arrKey] ?? [];

        (updateResults || []).forEach((res: any) => {
          if (!res || !res[idKey]) return;
          const idx = list.findIndex((it: any) => it[idKey] === res[idKey]);
          if (idx >= 0) list[idx] = res;
        });

        (createResults || []).forEach((res: any) => {
          if (!res) return;
          list.push(res);
        });

        (deletedIds || []).forEach((delId) => {
          const idx = list.findIndex((it: any) => it[idKey] === delId);
          if (idx >= 0) list.splice(idx, 1);
        });

        (nextCampaign as any)[arrKey] = list;
      };

      switch (section) {
        case "locations":
          applyUpdates("locations");
          break;
        case "npcs":
          applyUpdates("npcs");
          break;
        case "quests":
          applyUpdates("missions", "id");
          break;
        case "notes":
          applyUpdates("notes");
          break;
        default:
          break;
      }

      setCampaign(nextCampaign);
      setSectionContent(buildSectionContent(nextCampaign));
    };

    void persist().catch((err: unknown) => {
      setError(
        err instanceof Error ? err.message : "Failed to save campaign section",
      );
    });
  };

  const refreshCampaign = async () => {
    if (!campaignId) {
      setCampaign(null);
      setSectionContent(new Map());
      setLoading(false);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const data = (await campaignService.getCampaignById(
        campaignId,
      )) as CampaignRecord;
      setCampaign(data);
      setSectionContent(buildSectionContent(data));
    } catch (err: any) {
      setError(err?.message || "Failed to load campaign");
      setCampaign(null);
      setSectionContent(new Map());
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const section = location.hash.replace("#", "") || "general";
    setActiveSection(section);

    if (!location.hash && location.pathname.startsWith("/preview/campaign")) {
      navigate(`${location.pathname}#general`, { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

  useEffect(() => {
    void refreshCampaign();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [campaignId]);

  const handleDeleteCampaign = async () => {
    if (!campaignId) {
      return;
    }

    await campaignService.deleteCampaign(campaignId);
    navigate("/campaigns", { replace: true });
  };

  const handleGenerateJoinCode = async () => {
    if (!campaignId) {
      return;
    }

    await campaignService.generateJoinCode(campaignId);
    await refreshCampaign();
  };

  const handleToggleSectionVisibility = async (
    section: "locations" | "npcs" | "quests",
    itemId: string,
    isPublic: boolean,
  ) => {
    if (!campaignId) {
      return;
    }

    if (section === "locations") {
      await campaignService.toggleLocationVisibility(
        campaignId,
        itemId,
        isPublic,
      );
    } else if (section === "npcs") {
      await campaignService.toggleNPCVisibility(campaignId, itemId, isPublic);
    } else {
      await campaignService.toggleMissionVisibility(
        campaignId,
        itemId,
        isPublic,
      );
    }

    if (!campaign) {
      return;
    }

    const nextCampaign: CampaignRecord = {
      ...campaign,
      locations: (campaign.locations ?? []).map((location) =>
        section === "locations" && location.id === itemId
          ? { ...location, isPublic }
          : location,
      ),
      npcs: (campaign.npcs ?? []).map((npc) =>
        section === "npcs" && npc.id === itemId ? { ...npc, isPublic } : npc,
      ),
      missions: (campaign.missions ?? []).map((mission) =>
        section === "quests" && mission.id === itemId
          ? { ...mission, isPublic }
          : mission,
      ),
    };

    setCampaign(nextCampaign);
    setSectionContent(buildSectionContent(nextCampaign));
  };

  if (loading) {
    return (
      <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex items-center justify-center">
        Loading campaign...
      </div>
    );
  }

  if (!campaignId) {
    return (
      <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-widest">CAMPAIGN SHEET</h1>
        <p className="text-sm text-gray-light max-w-2xl">
          Open a campaign from the campaigns list to load live backend data.
        </p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-4">
        <h1 className="text-3xl font-bold tracking-widest">CAMPAIGN SHEET</h1>
        <p className="text-sm text-red-400">{error}</p>
      </div>
    );
  }

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return (
          <GeneralSection
            content={sectionContent.get("general") ?? campaign ?? undefined}
            isEditMode={editingSection === "general"}
            onEditModeChange={(isEditing) =>
              handleEditModeChange("general", isEditing)
            }
            onContentChange={(newContent) =>
              handleContentChange("general", newContent)
            }
            onDeleteCampaign={handleDeleteCampaign}
            campaignOwnerId={campaign?.owner?.id}
          />
        );
      case "characters":
        return (
          <CharacterSection
            characters={
              (sectionContent.get(
                "characters",
              ) as CampaignRecord["characters"]) ?? []
            }
            campaignId={campaignId}
            campaignOwnerId={campaign?.owner?.id}
            onRefreshCampaign={refreshCampaign}
          />
        );
      case "locations":
        return (
          <TextCardSection
            title="Locations"
            items={(sectionContent.get("locations") as TextCard[]) ?? []}
            isEditMode={editingSection === "locations"}
            onEditModeChange={(isEditing) =>
              handleEditModeChange("locations", isEditing)
            }
            onContentChange={(newContent) =>
              handleContentChange("locations", newContent)
            }
            onToggleVisibility={(itemId, isPublic) =>
              handleToggleSectionVisibility("locations", itemId, isPublic)
            }
            campaignOwnerId={campaign?.owner?.id}
          />
        );
      case "npcs":
        return (
          <TextCardSection
            title="NPCs"
            items={(sectionContent.get("npcs") as TextCard[]) ?? []}
            isEditMode={editingSection === "npcs"}
            onEditModeChange={(isEditing) =>
              handleEditModeChange("npcs", isEditing)
            }
            onContentChange={(newContent) =>
              handleContentChange("npcs", newContent)
            }
            onToggleVisibility={(itemId, isPublic) =>
              handleToggleSectionVisibility("npcs", itemId, isPublic)
            }
            campaignOwnerId={campaign?.owner?.id}
          />
        );
      case "quests":
        return (
          <TextCardSection
            title="Quests"
            items={(sectionContent.get("quests") as TextCard[]) ?? []}
            isEditMode={editingSection === "quests"}
            onEditModeChange={(isEditing) =>
              handleEditModeChange("quests", isEditing)
            }
            onContentChange={(newContent) =>
              handleContentChange("quests", newContent)
            }
            onToggleVisibility={(itemId, isPublic) =>
              handleToggleSectionVisibility("quests", itemId, isPublic)
            }
            campaignOwnerId={campaign?.owner?.id}
          />
        );
      case "notes":
        return (
          <NotesSection
            items={(sectionContent.get("notes") as NoteItem[]) ?? []}
            isEditMode={editingSection === "notes"}
            onEditModeChange={(isEditing) =>
              handleEditModeChange("notes", isEditing)
            }
            onContentChange={(newContent) =>
              handleContentChange("notes", newContent)
            }
          />
        );
      case "players":
        return (
          <PlayersSection
            content={
              (sectionContent.get("players") as PlayersContent) ?? {
                dm: null,
                players: [],
              }
            }
            campaignKey={campaign?.joinCode}
            onGenerateJoinCode={() => {
              void handleGenerateJoinCode();
            }}
            campaignOwnerId={campaign?.owner?.id}
          />
        );
      default:
        return (
          <GeneralSection
            content={sectionContent.get("general") ?? campaign ?? undefined}
            isEditMode={editingSection === "general"}
            onEditModeChange={(isEditing) =>
              handleEditModeChange("general", isEditing)
            }
            onContentChange={(newContent) =>
              handleContentChange("general", newContent)
            }
            onDeleteCampaign={handleDeleteCampaign}
          />
        );
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-widest">CAMPAIGN SHEET</h1>
        <p className="text-sm text-gray-light max-w-2xl">
          Preview specific campaign sections via the sidebar links.
        </p>
      </div>

      <main className="flex flex-col gap-4">{renderSection()}</main>
    </div>
  );
}

export default CampaignPreviewView;
