const API_URL = "http://localhost:3000";

export const characterService = {
  async getCharacters() {
    const res = await fetch(`${API_URL}/api/characters/mycharacters`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch characters");
    return res.json();
  },
  async createCharacter(data: any) {
    const res = await fetch(`${API_URL}/api/characters`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to create character");
    return res.json();
  },
  async getClasses() {
    const res = await fetch(`${API_URL}/api/classes`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch classes");
    return res.json();
  },
  async getRaces() {
    const res = await fetch(`${API_URL}/api/races`, { credentials: "include" });
    if (!res.ok) throw new Error("Failed to fetch races");
    return res.json();
  },

  async getCharacterById(id: string) {
    const res = await fetch(`${API_URL}/api/characters/${id}`, {
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to fetch character");
    return res.json();
  },
  async editCharacter(id: string, data: any) {
    const res = await fetch(`${API_URL}/api/characters/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to edit character");
    return res.json();
  },
  async deleteCharacter(id: string) {
    const res = await fetch(`${API_URL}/api/characters/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    if (!res.ok) throw new Error("Failed to delete character");
    // 204 No Content: don't call res.json()
    if (res.status === 204) return true;
    try {
      return await res.json();
    } catch {
      return true;
    }
  },
};
