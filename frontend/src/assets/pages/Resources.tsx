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

function Section({ title, items, showLimit = 50 }: { title: string; items: any[] | undefined; showLimit?: number }) {
  const count = Array.isArray(items) ? items.length : 0;
  const shown = Array.isArray(items) ? items.slice(0, showLimit) : [];

  return (
    <section className="mb-6">
      <h2 className="text-2xl font-semibold mb-2">{title} ({count})</h2>
      {count === 0 ? (
        <div className="text-sm text-gray-400">No items.</div>
      ) : (
        <ul className="space-y-2">
          {shown.map((it: any, i: number) => (
            <li key={i} className="p-2 border rounded-md">
              <div className="font-medium">{getItemLabel(it)}</div>
              <div className="text-xs text-gray-500">{getItemMeta(it)}</div>
            </li>
          ))}
        </ul>
      )}
      {count > showLimit && <div className="text-sm text-gray-500 mt-2">Showing first {showLimit} of {count} items.</div>}
    </section>
  );
}

function Resources() {
  const assets = data as any[];
  const phb = assets.find((a) => a?.name === "Player's Handbook");

  if (!phb) {
    return (
      <div className="flex flex-col items-center justify-center h-screen">
        <div className="text-center">
          <h1 className="text-4xl font-bold mb-2">Resources</h1>
          <p className="text-gray-500">Player's Handbook not found in assets.json</p>
        </div>
      </div>
    );
  }

  const sections = ["Backgrounds", "Classes", "Feats", "Races", "Spells"];
  const [activeSection, setActiveSection] = useState<string>(sections[0]);

  function renderSection(name: string) {
    switch (name) {
      case "Backgrounds":
        return <Section title="Backgrounds" items={phb.backgrounds} showLimit={30} />;
      case "Classes":
        return <Section title="Classes" items={phb.classes} showLimit={30} />;
      case "Feats":
        return <Section title="Feats" items={phb.feats} showLimit={30} />;
      case "Races":
        return <Section title="Races" items={phb.races} showLimit={30} />;
      case "Spells":
        return <Section title="Spells" items={phb.spells} showLimit={30} />;
      default:
        return null;
    }
  }

  return (
    <div className="pt-6">
      <div className="w-full">
        <div className="grid grid-cols-8 gap-6">
          <div className="relative col-span-2">
            <div className="fixed top-0 left-0 h-screen w-1/5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
              <h1 className="font-bold text-2xl">Resources</h1>
              <h2 className="text-gray-500 text-sm">{phb.name}</h2>
              <div className="flex flex-col pt-6 gap-y-2">
                <ResourcesSidebar active={activeSection} onChange={setActiveSection} />
              </div>
            </div>
          </div>

          <div className="col-span-4">
            <div className="pb-4">
              <p className="text-gray-500 text-sm ">
                <span>Book: </span>
                <span className="font-medium">{phb.name}</span>
                {phb.acronym && <span className="text-gray-400 ml-2">({phb.acronym})</span>}
              </p>
            </div>

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
