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
        // Preserve full levels data for spellcasting table in ClassRenderer
        classData.levels = levelsData;
      }

      // Map proficiencies for ClassRenderer
      if (Array.isArray(classData.proficiencies)) {
        classData.armor = classData.proficiencies
          .filter((p: any) => p.index.includes('armor') || p.index.includes('shields'))
          .map((p: any) => p.name);
        classData.weapons = classData.proficiencies
          .filter((p: any) => p.index.includes('weapon') || p.index.includes('bows') || p.index.includes('axes') || p.index.includes('swords'))
          .map((p: any) => p.name);
      }

      // Map saving throws
      if (Array.isArray(classData.saving_throws)) {
        classData.proficiency = {};
        classData.saving_throws.forEach((st: any) => {
          classData.proficiency[st.index] = true;
        });
      }

      // Map skill choices
      if (Array.isArray(classData.proficiency_choices)) {
        const skillChoice = classData.proficiency_choices.find((c: any) => c.desc && c.desc.toLowerCase().includes('choose'));
        if (skillChoice) {
          classData.skills = {
            choose: skillChoice.choose,
            from: skillChoice.from.options.map((opt: any) => opt.item.name.replace('Skill: ', ''))
          };
        }
      }

      // Fetch subclass details
      if (Array.isArray(classData.subclasses)) {
        classData.subclasses = await Promise.all(
          classData.subclasses.map(async (scRef: any) => {
            try {
              const scRes = await fetch(`https://www.dnd5eapi.co${scRef.url}`);
              if (!scRes.ok) return scRef;
              const scData = await scRes.json();

              // Fetch subclass features
              const scFeaturesRes = await fetch(`https://www.dnd5eapi.co/api/2014/subclasses/${scData.index}/features`);
              if (scFeaturesRes.ok) {
                const scFeaturesList = await scFeaturesRes.json();
                const scFeaturesDetails = await Promise.all(
                  scFeaturesList.results.map(async (f: any) => {
                    try {
                      const fRes = await fetch(`https://www.dnd5eapi.co${f.url}`);
                      return fRes.ok ? fRes.json() : f;
                    } catch (e) {
                      return f;
                    }
                  })
                );
                scData.subclassFeatures = scFeaturesDetails.map(f => ({
                  ...f,
                  entries: f.desc || []
                }));
              }
              return scData;
            } catch (e) {
              return scRef;
            }
          })
        );
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
    // Basic columns: Prof Bonus
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
      const rowData: any[] = [];
      keys.forEach(k => {
        let val: any = "—";
        if (k === "prof_bonus") {
          val = `+${lvl[k]}`;
        } else if (lvl.class_specific && lvl.class_specific[k] !== undefined) {
          val = lvl.class_specific[k];
          // Format complex objects
          if (typeof val === 'object' && val !== null) {
            if (val.dice_count && val.dice_value) {
              val = `${val.dice_count}d${val.dice_value}`;
            } else {
              val = JSON.stringify(val);
            }
          }
        }
        rowData.push(val);
      });
      return rowData;
    });

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

      // Fetch subraces details
      if (Array.isArray(raceData.subraces) && raceData.subraces.length > 0) {
        raceData.subraces = await Promise.all(
          raceData.subraces.map(async (srRef: any) => {
            try {
              const srRes = await fetch(`https://www.dnd5eapi.co${srRef.url}`);
              if (!srRes.ok) return srRef;
              const srData = await srRes.json();

              // Fetch details for subrace racial traits
              if (Array.isArray(srData.racial_traits) && srData.racial_traits.length > 0) {
                const traitsDetails = await Promise.all(
                  srData.racial_traits.map(async (t: any) => {
                    try {
                      const res = await fetch(`https://www.dnd5eapi.co${t.url}`);
                      return res.ok ? res.json() : t;
                    } catch (e) {
                      return t;
                    }
                  })
                );
                
                srData.traits = traitsDetails;
              }
              return srData;
            } catch (e) {
              return srRef;
            }
          })
        );
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
