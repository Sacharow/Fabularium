import EntryRenderer from "./EntryRenderer";
import type { SpellType } from "../../../types/resources";

export default function SpellRenderer({ item }: { item: SpellType }) {
  // Map API fields to expected fields
  const level = item.level;
  const school = item.school?.name || item.school;
  const casting_time = item.casting_time?.[0]?.value || item.casting_time;
  const range = item.range?.value || item.range;
  const components = item.components || [];
  const ritual = item.ritual;

  return (
    <div className="text-sm text-gray-200">
      <div className="flex gap-3 flex-wrap text-xs text-orange-200 mb-2">
        {level !== undefined && <div>Level {level}</div>}
        {school && <div>{school}</div>}
        {casting_time && <div>{casting_time}</div>}
        {range && <div>{range}</div>}
        {components && components.length > 0 && <div>{components.join(", ")}</div>}
        {ritual && <div>Ritual</div>}
      </div>
      {item.entries?.map((e, i) => <EntryRenderer key={i} node={e} />)}
      {item.desc?.map((d, i) => <p key={i} className="mb-2">{d}</p>)}
    </div>
  );
}
