import { useState } from "react";
import EntryRenderer from "./EntryRenderer";
import type { RaceType } from "../../../types/resources";

export default function RaceRenderer({ item }: { item: RaceType }) {
  const [openSubrace, setOpenSubrace] = useState<string | null>(null);
  const subraces = item.subraces ?? [];
  return (
    <div className="text-sm text-gray-200">
      {item.size && <div><strong>Size:</strong> {item.size}</div>}
      {item.speed && <div><strong>Speed:</strong> {JSON.stringify(item.speed)}</div>}
      {item.entries?.map((e,i)=> <EntryRenderer key={i} node={e} />)}

      {subraces.length > 0 && (
        <div className="mt-3">
          <div className="font-semibold text-orange-200 mb-2">Subraces</div>
          {subraces.map((sr, si) => {
            const key = `sr-${si}`;
            const open = openSubrace === key;
            return (
              <div key={si} className="border border-orange-700/20 rounded mb-2">
                <button className="w-full p-2 flex justify-between" onClick={() => setOpenSubrace(open ? null : key)}>
                  <div className="font-medium">{sr.name}</div>
                  <div className="text-xs">{open ? "▾" : "▸"}</div>
                </button>
                {open && <div className="p-2"><EntryRenderer node={sr.entries ?? []} /></div>}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
