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
    <div className="text-sm text-gray-200 space-y-4">
      <section className="space-y-1">
        <div className="flex gap-4 flex-wrap text-xs text-orange-200 mb-2">
          {size && <div><span className="font-bold">Size:</span> <span className="text-gray-200">{size}</span></div>}
          {speed && (
            <div>
              <span className="font-bold">Speed:</span>{" "}
              <span className="text-gray-200">
                {typeof speed === 'object' 
                  ? Object.entries(speed).map(([k, v]) => `${k} ${v}ft.`).join(', ') 
                  : `${speed} ft.`}
              </span>
            </div>
          )}
        </div>

        {item.ability_bonuses && item.ability_bonuses.length > 0 && (
          <div className="mb-2">
            <span className="font-semibold text-orange-200">Ability Bonuses:</span>{" "}
            <span className="text-gray-200">
              {item.ability_bonuses.map((ab: any) => `${ab.ability_score.name} +${ab.bonus}`).join(', ')}
            </span>
          </div>
        )}

        {item.age && <div className="text-gray-200"><span className="font-semibold text-orange-200">Age:</span> {item.age}</div>}
        {item.alignment && <div className="text-gray-200"><span className="font-semibold text-orange-200">Alignment:</span> {item.alignment}</div>}
        {item.size_description && <div className="text-gray-300 italic text-xs">{item.size_description}</div>}
        
        {item.starting_proficiencies && item.starting_proficiencies.length > 0 && (
          <div className="text-gray-200">
            <span className="font-semibold text-orange-200">Proficiencies:</span>{" "}
            {item.starting_proficiencies.map((p: any) => p.name).join(', ')}
          </div>
        )}

        {item.language_desc && <div className="text-gray-200"><span className="font-semibold text-orange-200">Languages:</span> {item.language_desc}</div>}
      </section>

      <section>
        {Array.isArray(entries) ? entries.map((e, i) => <EntryRenderer key={i} node={e} />) : <EntryRenderer node={entries} />}
      </section>

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
