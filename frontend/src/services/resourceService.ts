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
      const classData = await response.json();

      // Fetch features for this class
      const featuresResponse = await fetch(`${API_BASE}/classes/${index}/features`);
      if (featuresResponse.ok) {
        const featuresListData = await featuresResponse.json();
        // Fetch details for each feature to get descriptions
        const featuresDetails = await Promise.all(
          featuresListData.results.map(async (f: any) => {
            try {
              const res = await fetch(`https://www.dnd5eapi.co${f.url}`);
              return res.ok ? res.json() : f;
            } catch (e) {
              return f;
            }
          })
        );

        // Group features by level for ClassRenderer
        const classFeatures: any[][] = Array.from({ length: 20 }, () => []);
        featuresDetails.forEach(f => {
          const lvl = f.level - 1;
          if (lvl >= 0 && lvl < 20) {
            classFeatures[lvl].push({
              ...f,
              entries: f.desc || [] // ClassRenderer expects entries
            });
          }
        });
        classData.classFeatures = classFeatures;
      }

      // Also try to get class table data from /levels
      const levelsResponse = await fetch(`https://www.dnd5eapi.co/api/2014/classes/${index}/levels`);
      if (levelsResponse.ok) {
        const levelsData = await levelsResponse.json();
        classData.classTableGroups = this.formatClassTable(levelsData);
      }

      return classData;
    } catch (error) {
      console.error(`Error fetching class detail ${index}:`, error);
      return null;
    }
  },

  formatClassTable(levelsData: any[]): any[] {
    if (!levelsData || levelsData.length === 0) return [];
    
    // Determine column labels based on what's in class_specific or other fields
    // Basic columns: Level, Prof Bonus
    const colLabels = ["Proficiency Bonus"];
    const keys: string[] = ["prof_bonus"];
    
    // Find all unique keys in class_specific across all levels
    const specificKeys = new Set<string>();
    levelsData.forEach(lvl => {
      if (lvl.class_specific) {
        Object.keys(lvl.class_specific).forEach(k => specificKeys.add(k));
      }
    });
    
    specificKeys.forEach(k => {
      colLabels.push(k.replace(/_/g, " ").replace(/\b\w/g, l => l.toUpperCase()));
      keys.push(k);
    });

    const rows = levelsData.map(lvl => {
      const row = [lvl.level]; // First column is Level (though ClassRenderer might handle it separately)
      // Actually ClassRenderer handles Level column separately in some versions, 
      // let's check its code.
      
      const rowData = [lvl.level];
      keys.forEach(k => {
        if (k === "prof_bonus") {
          rowData.push(`+${lvl[k]}`);
        } else if (lvl.class_specific && lvl.class_specific[k] !== undefined) {
          rowData.push(lvl.class_specific[k]);
        } else {
          rowData.push("—");
        }
      });
      return rowData;
    });

    // ClassRenderer code shows it expects Level to be separate:
    // <th className="p-2 text-left text-xs text-orange-100 border-b border-orange-700">Level</th>
    // {group.colLabels.map((label: string, i: number) => ( ... ))}
    // So colLabels should NOT include Level.
    // And rows[i] should probably start with Level? Wait.
    // <td className="p-2 border-b border-orange-700/50">{row[0]}</td>
    // {row.slice(1).map((cell: any, ci: number) => ( ... ))}
    // Yes, row[0] is Level.

    return [{
      colLabels: colLabels,
      rows: rows
    }];
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
      const raceData = await response.json();

      // Fetch traits for this race
      const traitsResponse = await fetch(`${API_BASE}/races/${index}/traits`);
      if (traitsResponse.ok) {
        const traitsListData = await traitsResponse.json();
        const traitsDetails = await Promise.all(
          traitsListData.results.map(async (t: any) => {
            try {
              const res = await fetch(`https://www.dnd5eapi.co${t.url}`);
              return res.ok ? res.json() : t;
            } catch (e) {
              return t;
            }
          })
        );
        
        if (!raceData.entries) raceData.entries = [];
        
        traitsDetails.forEach(t => {
           // Avoid adding duplicate traits if they are already in entries
           if (!raceData.entries.some((e: any) => e.name === t.name)) {
             raceData.entries.push({
               type: 'entry',
               name: t.name,
               entry: t.desc || []
             });
           }
        });
      }

      return raceData;
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
      const response = await fetch(`${API_BASE}/feats`);
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
      const response = await fetch(`${API_BASE}/feats/${index}`);
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

  async getFeatureDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/features/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch feature detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching feature detail ${index}:`, error);
      return null;
    }
  },

  async getTraitDetail(index: string): Promise<any> {
    try {
      const response = await fetch(`${API_BASE}/traits/${index}`);
      if (!response.ok) throw new Error(`Failed to fetch trait detail: ${index}`);
      return response.json();
    } catch (error) {
      console.error(`Error fetching trait detail ${index}:`, error);
      return null;
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
      features: (idx) => this.getFeatureDetail(idx),
      traits: (idx) => this.getTraitDetail(idx),
    };

    if (sectionMap[section]) {
      return sectionMap[section](index);
    }
    return null;
  },
};
