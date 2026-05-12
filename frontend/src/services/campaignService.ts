const API_URL = "http://localhost:3000";

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
};

export default campaignService;
