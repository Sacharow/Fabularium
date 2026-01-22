const API_BASE = 'https://www.dnd5eapi.co/api/2014';

interface APIResponse<T> {
  count: number;
  results: T[];
}

export const resourceService = {
  async getClasses(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/classes`);
      if (!response.ok) throw new Error('Failed to fetch classes');
      const data: APIResponse<any> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching classes:', error);
      return [];
    }
  },

  async getClassDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/classes/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch class detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching class detail ${index}:`, error);
      return null;
    }
  },

  async getRaces(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/races`);
      if (!response.ok) throw new Error('Failed to fetch races');
      const data: APIResponse<any> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching races:', error);
      return [];
    }
  },

  async getRaceDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/races/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch race detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching race detail ${index}:`, error);
      return null;
    }
  },

  async getSpells(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/spells`);
      if (!response.ok) throw new Error('Failed to fetch spells');
      const data: APIResponse<any> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching spells:', error);
      return [];
    }
  },

  async getSpellDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/spells/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch spell detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching spell detail ${index}:`, error);
      return null;
    }
  },

  async getBackgrounds(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/backgrounds`);
      if (!response.ok) throw new Error('Failed to fetch backgrounds');
      const data: APIResponse<any> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching backgrounds:', error);
      return [];
    }
  },

  async getBackgroundDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/backgrounds/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch background detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching background detail ${index}:`, error);
      return null;
    }
  },

  async getFeats(): Promise<any[]> {
    try {
      const response = await fetch(`${API_BASE}/features`);
      if (!response.ok) throw new Error('Failed to fetch feats');
      const data: APIResponse<any> = await response.json();
      return data.results;
    } catch (error) {
      console.error('Error fetching feats:', error);
      return [];
    }
  },

  async getFeatDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/features/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch feat detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching feat detail ${index}:`, error);
      return null;
    }
  },

  // Helper method to fetch all resources for a section with details
  async getResourcesWithDetails(
    section: string,
    baseList: any[]
  ): Promise<any[]> {
    try {
      const detailedResources = await Promise.all(
        baseList.map(async (item) => {
          const detail = await this.getResourceDetail(section, item.index);
          return detail || item;
        })
      );
      return detailedResources;
    } catch (error) {
      console.error(`Error fetching resources with details for ${section}:`, error);
      return baseList;
    }
  },

  // Generic method to fetch resource details
  async getResourceDetail(section: string, index: string): Promise<any> {
    const sectionMap: Record<string, (index: string) => Promise<any>> = {
      classes: (idx) => this.getClassDetail(idx),
      races: (idx) => this.getRaceDetail(idx),
      spells: (idx) => this.getSpellDetail(idx),
      backgrounds: (idx) => this.getBackgroundDetail(idx),
      feats: (idx) => this.getFeatDetail(idx),
    };

    if (sectionMap[section]) {
      return sectionMap[section](index);
    }
    return null;
  },
};
