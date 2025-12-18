import EntryRenderer from "./EntryRenderer";
import type { SpellType } from "../../../types/resources";

export default function SpellRenderer({ item }: { item: SpellType }) {
  return (
    <div className="text-sm text-gray-200">
      <div className="flex gap-3 flex-wrap text-xs text-orange-200 mb-2">
        {item.level !== undefined && <div>Level {item.level}</div>}
        {item.school && <div>{item.school}</div>}
        {item.casting_time && <div>{item.casting_time}</div>}
        {item.range && <div>{item.range}</div>}
        {item.components && <div>{item.components.join(", ")}</div>}
        {item.ritual && <div>Ritual</div>}
      </div>
      {item.entries?.map((e,i)=><EntryRenderer key={i} node={e} />)}
    </div>
  );
}
