import { useState, useEffect } from "react";
import ResourcesSidebar from "../components/Resources/ResourcesSidebar";
import ResourceItem from "../components/Resources/ResourceItem";
import { resourceService } from "../../services/resourceService";

function Resources() {
  const sections = ["Backgrounds", "Classes", "Feats", "Races", "Spells"];
  const [activeSection, setActiveSection] = useState<string>(sections[0]);
  
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
        
        setResources({
          backgrounds: backgrounds || [],
          classes: classes || [],
          feats: feats || [],
          races: races || [],
          spells: spells || [],
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

  // accordion state: only one expanded item key at a time (format: "bookIdx-itemIdx")
  const [expandedKey, setExpandedKey] = useState<string | null>(null);
  const toggleExpanded = (key: string) => setExpandedKey((prev) => (prev === key ? null : key));

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
    const groups: { src: any; items: any[] }[] = [];

    sources.forEach((src: any, idx: number) => {
      if (!src) return;
      if (!selectedSources[idx]) return;
      const items = Array.isArray(src[key]) ? src[key] : [];
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
                {g.items.map((it: any, i: number) => (
                  <ResourceItem
                    key={i}
                    bookIdx={gi}
                    itemIdx={i}
                    item={it}
                    sectionKey={key}
                    expandedKey={expandedKey}
                    onToggle={toggleExpanded}
                    formatSkillProficiencies={formatSkillProficiencies}
                    formatLanguageProficiencies={formatLanguageProficiencies}
                  />
                ))}
              </ul>
            )}
          </section>
        ))}
      </div>
    );
  }

  return (
    <div className="pt-6">
      <div className="w-full">
        <div className="grid grid-cols-8 gap-6">
          <div className="relative col-span-2">
            <div className="fixed top-0 left-0 h-screen w-1/5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
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

          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
}

export default Resources;
