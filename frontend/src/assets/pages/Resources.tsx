import { useState, useEffect, Fragment } from "react";
import ResourcesSidebar from "../components/Resources/ResourcesSidebar";
import ResourceItem from "../components/Resources/ResourceItem";
import ScrollToTopButton from "../components/ScrollToTopButton";
import { resourceService } from "../../services/resourceService";

function Resources() {
  const sections = ["Backgrounds", "Classes", "Feats", "Races", "Spells"];
  const [activeSection, setActiveSection] = useState<string>(sections[0]);

  // Spell-specific UI state
  const [spellSearch, setSpellSearch] = useState<string>("");
  const [spellSearchError, setSpellSearchError] = useState<string | null>(null);
  const [spellSort, setSpellSort] = useState<"alpha" | "school" | "level">("alpha");
  const [collapsedGroups, setCollapsedGroups] = useState<Set<string>>(new Set());
  
  const toggleGroupCollapse = (groupLabel: string) => {
    const newCollapsed = new Set(collapsedGroups);
    if (newCollapsed.has(groupLabel)) {
      newCollapsed.delete(groupLabel);
    } else {
      newCollapsed.add(groupLabel);
    }
    setCollapsedGroups(newCollapsed);
  };
  
  // API data state
  const [resources, setResources] = useState<Record<string, any[]>>({
    backgrounds: [],
    classes: [],
    feats: [],
    races: [],
    spells: [],
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch data from API on mount
  useEffect(() => {
    const fetchResources = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const [backgrounds, classes, feats, races, spells] = await Promise.all([
          resourceService.getBackgrounds(),
          resourceService.getClasses(),
          resourceService.getFeats(),
          resourceService.getRaces(),
          resourceService.getSpells(),
        ]);

        // Only pre-fetch spell details upfront for better performance on spells section
        const detailedSpells = await resourceService.getResourcesWithDetails("spells", spells || []);
        const normalizedSpells = (detailedSpells || []).map((s: any) => ({ ...s, _detailed: true }));
        
        setResources({
          backgrounds: backgrounds || [],
          classes: classes || [],
          feats: feats || [],
          races: races || [],
          spells: normalizedSpells,
        });
      } catch (err) {
        console.error('Error fetching resources:', err);
        setError('Failed to load resources');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResources();
  }, []);

  // For API data, we'll treat the entire collection as one "source"
  const sources = [{
    name: "D&D 5e SRD",
    acronym: "SRD",
    backgrounds: resources.backgrounds,
    classes: resources.classes,
    feats: resources.feats,
    races: resources.races,
    spells: resources.spells,
  }];

  // Selected sources state — default: all selected (only one source from API)
  const [selectedSources, setSelectedSources] = useState<Record<number, boolean>>({
    0: true, // Always show the single SRD source
  });

  const toggleSource = (index: number) => {
    setSelectedSources((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const selectAllSources = () => {
    setSelectedSources({ 0: true });
  };

  const clearAllSources = () => {
    setSelectedSources({ 0: false });
  };

  const handleSpellSearchChange = (value: string) => {
    setSpellSearch(value);
    if (!value) {
      setSpellSearchError(null);
      return;
    }
    try {
      // Validate regex up front so we can block invalid patterns gracefully
      new RegExp(value, "i");
      setSpellSearchError(null);
    } catch (err) {
      setSpellSearchError("Invalid regex pattern");
    }
  };

  // accordion state: only one expanded item key at a time (format: "bookIdx-itemIdx")
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const toggleExpanded = async (key: string) => {
    if (expandedKey === key) {
      setExpandedKey(null);
      return;
    }

    setExpandedKey(key);

    // Scroll the newly opened item into view after a short delay to allow rendering
    setTimeout(() => {
      const element = document.querySelector(`[data-accordion-key="${key}"]`);
      if (!element) return;

      const yOffset = -170; // negative value means scrolling further down)
      const y =
        element.getBoundingClientRect().top + window.pageYOffset + yOffset;

      window.scrollTo({
        top: y,
        behavior: "smooth"
      });
    }, 100);

    // Parse key to get item index (format: "gi-i")
    // Note: gi is currently always 0 because we only have one source "D&D 5e SRD"
    const [, i] = key.split("-").map(Number);
    const section = activeSection.toLowerCase();
    const item = resources[section][i];

    // Only fetch details if not already fetched
    if (item && !item._detailed && item.index) {
      try {
        const details = await resourceService.getResourceDetail(section, item.index);
        if (details) {
          setResources(prev => {
            const newSectionData = [...prev[section]];
            newSectionData[i] = { ...newSectionData[i], ...details, _detailed: true };
            return {
              ...prev,
              [section]: newSectionData
            };
          });
        }
      } catch (err) {
        console.error("Error fetching item details:", err);
      }
    }
  };

  type SpellRow = { item: any; originalIdx: number; groupLabel?: string };

  const normalizeSpellMeta = (spell: any) => {
    const level = typeof spell?.level === "number" ? spell.level : 99;
    const school = typeof spell?.school === "string" ? spell.school : spell?.school?.name || "Unknown";
    const name = spell?.name || "";
    return { level, school, name };
  };

  const applySpellTransforms = (items: { item: any; originalIdx: number }[]): SpellRow[] => {
    let filtered = items;

    if (spellSearch && !spellSearchError) {
      const regex = new RegExp(spellSearch, "i");
      filtered = filtered.filter(({ item }) => item?.name && regex.test(item.name));
    }

    const sorted = [...filtered].sort((a, b) => {
      const metaA = normalizeSpellMeta(a.item);
      const metaB = normalizeSpellMeta(b.item);

      if (spellSort === "level") {
        if (metaA.level !== metaB.level) return metaA.level - metaB.level;
        return metaA.name.localeCompare(metaB.name);
      }

      if (spellSort === "school") {
        if (metaA.school !== metaB.school) return metaA.school.localeCompare(metaB.school);
        if (metaA.level !== metaB.level) return metaA.level - metaB.level;
        return metaA.name.localeCompare(metaB.name);
      }

      // alphabetical default
      return metaA.name.localeCompare(metaB.name);
    });

    const withGroups = sorted.map((row) => {
      if (spellSort === "school") {
        const meta = normalizeSpellMeta(row.item);
        return { ...row, groupLabel: meta.school || "Unknown school" };
      }
      if (spellSort === "level") {
        const meta = normalizeSpellMeta(row.item);
        const levelLabel = meta.level === 0 ? "Level 0 (Cantrips)" : `Level ${meta.level}`;
        return { ...row, groupLabel: levelLabel };
      }
      return row;
    });

    return withGroups;
  };

  function formatSkillProficiencies(sp: any) {
    if (!sp) return null;
    const set = new Set<string>();
    if (Array.isArray(sp)) {
      sp.forEach((obj) => {
        if (obj && typeof obj === "object") {
          Object.keys(obj).forEach((k) => { if (obj[k]) set.add(k); });
        }
      });
    } else if (typeof sp === "object") {
      Object.keys(sp).forEach((k) => { if (sp[k]) set.add(k); });
    }
    return Array.from(set).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
  }

  function formatLanguageProficiencies(lp: any) {
    if (!lp) return null;
    const parts: string[] = [];
    if (Array.isArray(lp)) {
      lp.forEach((obj) => {
        if (obj && typeof obj === 'object') {
          Object.entries(obj).forEach(([k, v]) => {
            if (k === 'any') parts.push(`Any (${v})`);
            else parts.push(`${k.charAt(0).toUpperCase() + k.slice(1)}${typeof v === 'number' ? ` (${v})` : ''}`);
          });
        }
      });
    } else if (typeof lp === 'object') {
      Object.entries(lp).forEach(([k, v]) => {
        if (k === 'any') parts.push(`Any (${v})`);
        else parts.push(`${k.charAt(0).toUpperCase() + k.slice(1)}${typeof v === 'number' ? ` (${v})` : ''}`);
      });
    }
    return parts.join(', ');
  }

  function renderSection(name: string) {
    const key = name.toLowerCase();
    const groups: { src: any; items: { item: any; originalIdx: number; groupLabel?: string }[] }[] = [];

    sources.forEach((src: any, idx: number) => {
      if (!src) return;
      if (!selectedSources[idx]) return;
      const itemsWithIndex = Array.isArray(src[key]) ? src[key].map((item: any, originalIdx: number) => ({ item, originalIdx })) : [];
      const items = key === "spells" ? applySpellTransforms(itemsWithIndex) : itemsWithIndex;
      groups.push({ src, items });
    });

    if (loading) {
      return <div className="text-sm text-gray-400">Loading resources...</div>;
    }

    if (error) {
      return <div className="text-sm text-red-400">Error: {error}</div>;
    }

    if (groups.length === 0) {
      return <div className="text-sm text-gray-400">No sources selected.</div>;
    }

    return (
      <div className="space-y-6">
        {groups.map((g, gi) => (
          <section key={gi} className="mb-4">
            <div className="bg-orange-900 text-white px-3 py-2 rounded-md mb-2 border-2 border-orange-700">
              <h3 className="text-lg font-bold">{g.src.name} ({g.items.length})</h3>
              {g.src.acronym && <div className="text-xs text-orange-200">{g.src.acronym}</div>}
            </div>

            {g.items.length === 0 ? (
              <div className="text-sm text-gray-400">No items in this source.</div>
            ) : (
              <ul className="space-y-2">
                {g.items.map(({ item, originalIdx, groupLabel }, rowIdx) => {
                  const isNewGroup = groupLabel && (rowIdx === 0 || groupLabel !== g.items[rowIdx - 1].groupLabel);
                  const isCollapsed = groupLabel && collapsedGroups.has(groupLabel);
                  return (
                    <Fragment key={`row-${gi}-${originalIdx}-${item.index || item.name || "item"}`}>
                      {isNewGroup && (
                        <li
                          onClick={() => groupLabel && toggleGroupCollapse(groupLabel)}
                          className="px-2 py-1 text-xs font-semibold text-orange-200 border-l-2 border-orange-500 bg-orange-900/30 rounded cursor-pointer hover:bg-orange-900/50 flex items-center gap-1"
                        >
                          <span>{isCollapsed ? ">" : "v"}</span>
                          <span>{groupLabel}</span>
                        </li>
                      )}
                      {!isCollapsed && (
                        <ResourceItem
                          bookIdx={gi}
                          itemIdx={originalIdx}
                          item={item}
                          sectionKey={key}
                          expandedKey={expandedKey}
                          onToggle={toggleExpanded}
                          formatSkillProficiencies={formatSkillProficiencies}
                          formatLanguageProficiencies={formatLanguageProficiencies}
                        />
                      )}
                    </Fragment>
                  );
                })}
              </ul>
            )}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-6">
      <ScrollToTopButton />
      <div className="w-full">
        <div className="grid grid-cols-8 gap-6">
          <div className="relative col-span-2">
            <div className="fixed top-4 left-0 h-screen w-1/5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
              <h1 className="font-bold text-2xl">Category</h1>
              <div className="flex flex-col pt-6 gap-y-2">
                <ResourcesSidebar
                  active={activeSection}
                  onChange={setActiveSection}
                  sources={sources}
                  selectedSources={selectedSources}
                  onToggleSource={toggleSource}
                  onSelectAll={selectAllSources}
                  onClearAll={clearAllSources}
                />
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="pt-6 px-6">
              <div className="max-w-6xl mx-auto">
                <h1 className="text-3xl font-bold mb-4">{activeSection}</h1>
                {renderSection(activeSection)}
              </div>
            </div>
          </div>

          <div className="col-span-2">
            {activeSection.toLowerCase() === "spells" && (
              <div className="fixed right-6 top-24 w-64 px-4 py-6 space-y-4">
                <div className="flex flex-col">
                  <label className="text-xs text-gray-300 mb-1">Search</label>
                  <input
                    type="text"
                    value={spellSearch}
                    onChange={(e) => handleSpellSearchChange(e.target.value)}
                    placeholder="e.g. fireball"
                    className="bg-orange-900/30 border border-orange-700/70 rounded px-3 py-2 text-sm text-white placeholder:text-orange-200/60 focus:outline-none focus:border-orange-400"
                  />
                  {spellSearchError && <span className="text-xs text-red-300 mt-1">{spellSearchError}</span>}
                </div>
                <div className="flex flex-col">
                  <label className="text-xs text-gray-300 mb-2">Sort by</label>
                  <div className="space-y-1">
                    <button
                      onClick={() => setSpellSort("alpha")}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        spellSort === "alpha" ? "bg-orange-700/50 border border-orange-400" : "bg-orange-900/30 border border-orange-700/70 hover:bg-orange-600/10"
                      }`}
                    >
                      Alphabetical
                    </button>
                    <button
                      onClick={() => setSpellSort("school")}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        spellSort === "school" ? "bg-orange-700/50 border border-orange-400" : "bg-orange-900/30 border border-orange-700/70 hover:bg-orange-600/10"
                      }`}
                    >
                      School of Magic
                    </button>
                    <button
                      onClick={() => setSpellSort("level")}
                      className={`w-full text-left px-3 py-2 text-sm rounded transition-colors ${
                        spellSort === "level" ? "bg-orange-700/50 border border-orange-400" : "bg-orange-900/30 border border-orange-700/70 hover:bg-orange-600/10"
                      }`}
                    >
                      Spell Level
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
