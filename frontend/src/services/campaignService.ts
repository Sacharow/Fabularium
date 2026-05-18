const API_URL = "http://localhost:3000";

export type CampaignUpdatePayload = {
  name?: string;
  description?: string;
  photo?: string | null;
  currentSession?: number;
};

export type CampaignCreatePayload = {
  name: string;
  description: string;
  currentSession?: number;
};

export type CampaignSectionItemPayload = {
  title: string;
  content: string;
};

export type CampaignSectionItemWithLinks = CampaignSectionItemPayload & {
  linkedNpcIds?: string[];
  linkedLocationIds?: string[];
  linkedMissionIds?: string[];
};

export type CampaignNpcPayload = CampaignSectionItemPayload & {
  campaignId?: string;
};

export const campaignService = {
  async getCampaigns() {
    const res = await fetch(`${API_URL}/api/campaigns`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch campaigns");
    return res.json();
  },
  async getCampaignById(id: string) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch campaign");
    return res.json();
  },
  async createCampaign(data: CampaignCreatePayload) {
    const res = await fetch(`${API_URL}/api/campaigns`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create campaign");
    return res.json();
  },
  async updateCampaign(id: string, data: CampaignUpdatePayload) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update campaign");
    return res.json();
  },
  async createLocation(id: string, data: CampaignSectionItemWithLinks) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}/locations`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        name: data.title,
        description: data.content,
        linkedNpcIds: (data as any).linkedNpcIds,
        linkedMissionIds: (data as any).linkedMissionIds,
      }),
    });
    if (!res.ok) throw new Error("Failed to create location");
    return res.json();
  },
  async updateLocation(
    campaignId: string,
    locationId: string,
    data: CampaignSectionItemWithLinks,
  ) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/locations/${locationId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.title,
          description: data.content,
          linkedNpcIds: (data as any).linkedNpcIds,
          linkedMissionIds: (data as any).linkedMissionIds,
        }),
      },
    );
    if (!res.ok) throw new Error("Failed to update location");
    return res.json();
  },
  async deleteLocation(campaignId: string, locationId: string) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/locations/${locationId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!res.ok && res.status !== 204) {
      throw new Error("Failed to delete location");
    }
    return true;
  },
  async createNPC(
    id: string,
    data: CampaignNpcPayload & {
      linkedLocationIds?: string[];
      linkedMissionIds?: string[];
    },
  ) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}/npcs`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        campaignId: data.campaignId ?? id,
        name: data.title,
        description: data.content,
        linkedLocationIds: (data as any).linkedLocationIds,
        linkedMissionIds: (data as any).linkedMissionIds,
      }),
    });
    if (!res.ok) throw new Error("Failed to create NPC");
    return res.json();
  },
  async updateNPC(
    campaignId: string,
    npcId: string,
    data: CampaignSectionItemWithLinks,
  ) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/npcs/${npcId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          name: data.title,
          description: data.content,
          linkedLocationIds: (data as any).linkedLocationIds,
          linkedMissionIds: (data as any).linkedMissionIds,
        }),
      },
    );
    if (!res.ok) throw new Error("Failed to update NPC");
    return res.json();
  },
  async deleteNPC(campaignId: string, npcId: string) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/npcs/${npcId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!res.ok && res.status !== 204) {
      throw new Error("Failed to delete NPC");
    }
    return true;
  },
  async createMission(id: string, data: CampaignSectionItemWithLinks) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}/missions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        title: data.title,
        description: data.content,
        linkedNpcIds: (data as any).linkedNpcIds,
        linkedLocationIds: (data as any).linkedLocationIds,
      }),
    });
    if (!res.ok) throw new Error("Failed to create quest");
    return res.json();
  },
  async updateMission(
    campaignId: string,
    missionId: string,
    data: CampaignSectionItemWithLinks,
  ) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/missions/${missionId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          title: data.title,
          description: data.content,
          linkedNpcIds: (data as any).linkedNpcIds,
          linkedLocationIds: (data as any).linkedLocationIds,
        }),
      },
    );
    if (!res.ok) throw new Error("Failed to update quest");
    return res.json();
  },
  async deleteMission(campaignId: string, missionId: string) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/missions/${missionId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!res.ok && res.status !== 204) {
      throw new Error("Failed to delete quest");
    }
    return true;
  },
  async createNote(id: string, data: CampaignSectionItemPayload) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}/notes`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name: data.title, description: data.content }),
    });
    if (!res.ok) throw new Error("Failed to create note");
    return res.json();
  },
  async updateNote(
    campaignId: string,
    noteId: string,
    data: CampaignSectionItemPayload,
  ) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/notes/${noteId}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ name: data.title, description: data.content }),
      },
    );
    if (!res.ok) throw new Error("Failed to update note");
    return res.json();
  },
  async deleteNote(campaignId: string, noteId: string) {
    const res = await fetch(
      `${API_URL}/api/campaigns/${campaignId}/notes/${noteId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    );
    if (!res.ok && res.status !== 204) {
      throw new Error("Failed to delete note");
    }
    return true;
  },
  async deleteCampaign(id: string) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok && res.status !== 204) {
      throw new Error("Failed to delete campaign");
    }
    return true;
  },
  async generateJoinCode(id: string) {
    const res = await fetch(`${API_URL}/api/campaigns/${id}/join-code`, {
      method: "POST",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to generate join code");
    return res.json();
  },
};

export default campaignService;
