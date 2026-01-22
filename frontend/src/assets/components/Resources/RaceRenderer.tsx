import { useState } from "react";
import EntryRenderer from "./EntryRenderer";
import type { RaceType } from "../../../types/resources";

export default function RaceRenderer({ item }: { item: RaceType }) {
  const [openSubrace, setOpenSubrace] = useState<string | null>(null);
  const subraces = item.subraces ?? item.subrace ?? [];
  
  // Map API fields
  const size = item.size;
  const speed = item.speed;
  const entries = item.entries ?? item.desc ?? [];

  return (
    <div className="text-sm text-gray-200">
      {size && <div><strong>Size:</strong> {size}</div>}
      {speed && <div><strong>Speed:</strong> {typeof speed === 'object' ? JSON.stringify(speed) : speed}</div>}
      {Array.isArray(entries) ? entries.map((e, i) => <EntryRenderer key={i} node={e} />) : <EntryRenderer node={entries} />}

      {subraces && subraces.length > 0 && (
        <div className="mt-3">
          <div className="font-semibold text-orange-200 mb-2">Subraces</div>
          {subraces.map((sr, si) => {
            const key = `sr-${si}`;
            const open = openSubrace === key;
            const subraceEntries = sr.entries ?? sr.desc ?? [];
            return (
              <div key={si} className="border border-orange-700/20 rounded mb-2">
                <button className="w-full p-2 flex justify-between" onClick={() => setOpenSubrace(open ? null : key)}>
                  <div className="font-medium">{sr.name}</div>
                  <div className="text-xs">{open ? "▾" : "▸"}</div>
                </button>
                {open && (
                  <div className="p-2">
                    {Array.isArray(subraceEntries) ? subraceEntries.map((e, i) => <EntryRenderer key={i} node={e} />) : <EntryRenderer node={subraceEntries} />}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
