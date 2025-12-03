import data from "../data/assets.json";

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

  return (
    <div className="pt-6 px-6">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold mb-4">{phb.name}</h1>
        {phb.acronym && <p className="text-sm text-gray-400 mb-4">Acronym: {phb.acronym}</p>}

        <Section title="Backgrounds" items={phb.backgrounds} showLimit={30} />
        <Section title="Classes" items={phb.classes} showLimit={30} />
        <Section title="Feats" items={phb.feats} showLimit={30} />
        <Section title="Races" items={phb.races} showLimit={30} />
        <Section title="Spells" items={phb.spells} showLimit={30} />
      </div>
    </div>
  );
}

export default Resources;
