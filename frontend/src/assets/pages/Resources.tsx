import { useState } from "react";
import data from "../data/resources.json";
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

  // accordion state: only one expanded item key at a time (format: "bookIdx-itemIdx")
  const [expandedKey, setExpandedKey] = useState<string | null>(null);

  const toggleExpanded = (key: string) => {
    setExpandedKey((prev) => (prev === key ? null : key));
  };

  function formatSkillProficiencies(sp: any) {
    if (!sp) return null;
    // sp may be array of objects like [{ insight: true, religion: true }]
    const set = new Set<string>();
    if (Array.isArray(sp)) {
      sp.forEach((obj) => {
        if (obj && typeof obj === 'object') {
          Object.keys(obj).forEach((k) => {
            // ignore falsy
            if (obj[k]) set.add(k);
          });
        }
      });
    } else if (typeof sp === 'object') {
      Object.keys(sp).forEach((k) => { if (sp[k]) set.add(k); });
    }
    return Array.from(set).map(s => s.charAt(0).toUpperCase() + s.slice(1)).join(', ');
  }

  function formatLanguageProficiencies(lp: any) {
    if (!lp) return null;
    // lp might be array of objects like [{ any: 2 }]
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

  function renderEntryNode(node: any) {
    if (!node && node !== 0) return null;
    if (typeof node === "string") return <p className="mb-2 text-sm text-gray-200">{node}</p>;
    if (Array.isArray(node)) return <>{node.map((n, i) => <div key={i}>{renderEntryNode(n)}</div>)}</>;

    // object nodes
    if (node.type === "list" && Array.isArray(node.items)) {
      return (
        <ul className="list-disc ml-6 mb-2">
          {node.items.map((it: any, idx: number) => (
            <li key={idx} className="text-sm text-gray-200">{it.entry ?? it.name ?? getItemLabel(it)}</li>
          ))}
        </ul>
      );
    }

    if (node.type === "table" && Array.isArray(node.rows)) {
      const colLabels: string[] = Array.isArray(node.colLabels) ? node.colLabels : [];
      const colStyles: string[] = Array.isArray(node.colStyles) ? node.colStyles : [];
      return (
        <div className="overflow-auto mb-2">
          <table className="w-full text-sm border-collapse">
            {colLabels.length > 0 && (
              <thead>
                <tr className="bg-orange-800/20">
                  {colLabels.map((label: string, hidx: number) => (
                    <th key={hidx} className={`p-1 text-left text-xs text-orange-100 ${colStyles[hidx] ?? ''}`}>{label}</th>
                  ))}
                </tr>
              </thead>
            )}
            <tbody>
              {node.rows.map((r: any, ridx: number) => (
                <tr key={ridx} className={ridx % 2 === 0 ? "bg-orange-800/10" : "bg-transparent"}>
                  {r.map((cell: any, cidx: number) => (
                    <td key={cidx} className={`p-1 align-top text-sm ${colStyles[cidx] ?? ''}`}>{cell}</td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
    }

    if (node.type === "entry") {
      return (
        <div className="mb-2">
          {node.name && <div className="font-semibold text-sm text-orange-200">{node.name}</div>}
          {Array.isArray(node.entry) ? node.entry.map((e: any, i: number) => <div key={i}>{renderEntryNode(e)}</div>) : <div className="text-sm">{String(node.entry ?? "")}</div>}
        </div>
      );
    }

    // fallback: render JSON
    return <pre className="text-xs text-gray-300 whitespace-pre-wrap">{JSON.stringify(node, null, 2)}</pre>;
  }

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
                {g.items.map((it: any, i: number) => {
                  const key = `${gi}-${i}`;
                  const expanded = expandedKey === key;
                  return (
                    <li key={i} className="pl-1 pr-1">
                      <button
                        type="button"
                        onClick={() => toggleExpanded(key)}
                        className={`w-full text-left p-3 rounded-md border ${expanded ? 'bg-orange-800/40 border-orange-700' : 'bg-transparent border-orange-700/30 hover:bg-orange-600/10'}`}>
                        <div className="flex justify-between items-start">
                          <div>
                            <div className="font-medium text-sm text-gray-100">{getItemLabel(it)}</div>
                            <div className="text-xs text-gray-400">{getItemMeta(it)}</div>
                          </div>
                          <div className="text-xs text-gray-200 ml-4">{expanded ? '▾' : '▸'}</div>
                        </div>
                      </button>

                      {expanded && (
                        <div className="mt-2 pl-4 pr-2">
                          {/* show entries / entry / entries */}
                          {Array.isArray(it.entries) && it.entries.map((en: any, idx: number) => <div key={idx}>{renderEntryNode(en)}</div>)}
                          {Array.isArray(it.entry) && it.entry.map((en: any, idx: number) => <div key={idx}>{renderEntryNode(en)}</div>)}
                          {/* other fields */}
                          {it.skillProficiencies && (
                            <div className="text-sm text-gray-200 mb-1">Skill Proficiencies: {formatSkillProficiencies(it.skillProficiencies)}</div>
                          )}
                          {it.languageProficiencies && (
                            <div className="text-sm text-gray-200 mb-1">Language Proficiencies: {formatLanguageProficiencies(it.languageProficiencies)}</div>
                          )}
                        </div>
                      )}
                    </li>
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
