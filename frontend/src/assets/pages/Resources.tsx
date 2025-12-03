import { useState } from "react";
import data from "../data/assets.json";
import ResourcesSidebar from "../components/helper/ResourcesSidebar";

function getItemLabel(item: any) {
  if (!item) return "(empty)";
  if (typeof item === "string") return item;
  return item.name || item.title || item.ability || item.URL || item.Source || item.source || JSON.stringify(item).slice(0, 80) + "...";
}

function getItemMeta(item: any) {
  const parts: string[] = [];
  if (!item || typeof item !== "object") return "";
  if (item.page) parts.push(`page ${item.page}`);
  if (item.source) parts.push(String(item.source));
  if (item.acronym) parts.push(String(item.acronym));
  if (item.ability) parts.push(String(item.ability));
  if (item.URL) parts.push(item.URL);
  return parts.join(" • ");
}

// Render items grouped by book (book name + items)

function Resources() {
  const assets = data as any[];
  const sections = ["Backgrounds", "Classes", "Feats", "Races", "Spells"];
  const [activeSection, setActiveSection] = useState<string>(sections[0]);

  // Build sources list from the JSON (top-to-bottom)
  const sources = Array.isArray(assets) ? assets : [];
  // Selected sources state — default: all selected
  const [selectedSources, setSelectedSources] = useState<Record<number, boolean>>(() => {
    const map: Record<number, boolean> = {};
    sources.forEach((_s, i) => (map[i] = true));
    return map;
  });

  const toggleSource = (index: number) => {
    setSelectedSources((prev) => ({ ...prev, [index]: !prev[index] }));
  };

  const selectAllSources = () => {
    const map: Record<number, boolean> = {};
    sources.forEach((_s, i) => (map[i] = true));
    setSelectedSources(map);
  };

  const clearAllSources = () => {
    const map: Record<number, boolean> = {};
    sources.forEach((_s, i) => (map[i] = false));
    setSelectedSources(map);
  };

  function renderSection(name: string) {
    // map section display name to object key
    // backgrounds, classes, feats, races, spells
    const key = name.toLowerCase();

    // Build groups per selected source in file order
    const groups: { src: any; items: any[] }[] = [];
    sources.forEach((src: any, idx: number) => {
      if (!src) return;
      if (!selectedSources[idx]) return;
      const items = Array.isArray(src[key]) ? src[key] : [];
      groups.push({ src, items });
    });

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
                  <li key={i} className="p-2 border rounded-md">
                    <div className="font-medium">{getItemLabel(it)}</div>
                    <div className="text-xs text-gray-500">{getItemMeta(it)}</div>
                  </li>
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
                <ResourcesSidebar active={activeSection} onChange={setActiveSection} />
                  <div className="mt-6 border-t border-orange-700 pt-4">
                    <div className="text-sm text-gray-300 font-medium mb-2">Sources</div>
                    <div className="flex gap-2 mb-3">
                      <button type="button" onClick={selectAllSources} className="text-xs px-2 py-1 rounded bg-orange-700/80">All</button>
                      <button type="button" onClick={clearAllSources} className="text-xs px-2 py-1 rounded bg-gray-700/50">Clear</button>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {sources.map((s: any, i: number) => {
                          const acronym = s?.acronym ?? s?.name ?? `#${i}`;
                          const isActive = !!selectedSources[i];
                          const tileClass = `cursor-pointer px-2 py-1 rounded-md border flex items-center justify-center text-xs ${isActive ? 'bg-orange-700 text-white font-semibold' : 'bg-transparent text-orange-100 border-orange-700/30 hover:bg-orange-600/10'}`;
                          return (
                            <button
                              key={i}
                              type="button"
                              aria-pressed={isActive}
                              title={s?.name}
                              className={tileClass}
                              onClick={() => toggleSource(i)}
                            >
                              {acronym}
                            </button>
                          );
                      })}
                    </div>
                  </div>
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
