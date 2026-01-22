import EntryRenderer from "./EntryRenderer";
import ClassRenderer from "./ClassRenderer";
import RaceRenderer from "./RaceRenderer";
import SpellRenderer from "./SpellRenderer";

type Props = {
  bookIdx: number;
  itemIdx: number;
  item: any;
  sectionKey: string;
  expandedKey: string | null;
  onToggle: (key: string) => void;
  formatSkillProficiencies?: (sp: any) => string | null;
  formatLanguageProficiencies?: (lp: any) => string | null;
};

function getItemLabel(item: any) {
  if (!item) return "(empty)";
  if (typeof item === "string") return item;
  return item.name || item.title || item.ability || item.index || item.url || item.URL || item.Source || item.source || JSON.stringify(item).slice(0, 80) + "...";
}

function getItemMeta(item: any) {
  const parts: string[] = [];
  if (!item || typeof item !== "object") return "";
  if (item.page) parts.push(`page ${item.page}`);
  if (item.source) parts.push(String(item.source));
  if (item.acronym) parts.push(String(item.acronym));
  if (item.ability) parts.push(String(item.ability));
  if (item.index) parts.push(`#${item.index}`);
  if (item.url) parts.push(item.url);
  if (item.URL) parts.push(item.URL);
  return parts.join(" • ");
}

export default function ResourceItem({ bookIdx, itemIdx, item, sectionKey, expandedKey, onToggle, formatSkillProficiencies, formatLanguageProficiencies }: Props) {
  const key = `${bookIdx}-${itemIdx}`;
  const expanded = expandedKey === key;

  return (
    <li className="pl-1 pr-1">
      <button
        type="button"
        onClick={() => onToggle(key)}
        className={`w-full text-left p-3 rounded-md border ${expanded ? "bg-orange-800/40 border-orange-700" : "bg-transparent border-orange-700/30 hover:bg-orange-600/10"}`}
      >
        <div className="flex justify-between items-start">
          <div>
            <div className="font-medium text-sm text-gray-100">{getItemLabel(item)}</div>
            <div className="text-xs text-gray-400">{getItemMeta(item)}</div>
          </div>
          <div className="text-xs text-gray-200 ml-4">{expanded ? "▾" : "▸"}</div>
        </div>
      </button>

      {expanded && (
        <div className="mt-2 pl-4 pr-2">
          {!item._detailed && item.index ? (
            <div className="text-xs text-gray-500 animate-pulse">Loading details...</div>
          ) : (
            <>
              {/* common entries - only for generic sections without specialized renderers */}
              {sectionKey !== "classes" && sectionKey !== "races" && sectionKey !== "spells" && (
                <>
                  {Array.isArray(item.entries) && item.entries.map((en: any, idx: number) => <div key={idx}><EntryRenderer node={en} /></div>)}
                  {Array.isArray(item.entry) && item.entry.map((en: any, idx: number) => <div key={idx}><EntryRenderer node={en} /></div>)}
                  {Array.isArray(item.desc) && item.desc.map((d: any, idx: number) => (
                    <p key={idx} className="text-sm text-gray-200 mb-2">{d}</p>
                  ))}
                </>
              )}

              {/* per-category renderers */}
              {sectionKey === "classes" && <ClassRenderer item={item} />}
              {sectionKey === "races" && <RaceRenderer item={item} />}
              {sectionKey === "spells" && <SpellRenderer item={item} />}

              {/* background-only fields */}
              {sectionKey === "backgrounds" && (item.skillProficiencies || item.starting_proficiencies) && (
                <div className="text-sm text-gray-200 mb-1">
                  <strong>Skill Proficiencies:</strong> {item.skillProficiencies ? formatSkillProficiencies?.(item.skillProficiencies) : 
                    item.starting_proficiencies?.filter((p: any) => p.index.startsWith('skill-')).map((p: any) => p.name.replace('Skill: ', '')).join(', ')}
                </div>
              )}
              {sectionKey === "backgrounds" && (item.languageProficiencies || item.language_options) && (
                <div className="text-sm text-gray-200 mb-1">
                  <strong>Language Proficiencies:</strong> {item.languageProficiencies ? formatLanguageProficiencies?.(item.languageProficiencies) : 
                    (item.language_options ? `Choose ${item.language_options.choose}` : '—')}
                </div>
              )}
              {sectionKey === "backgrounds" && item.feature && (
                <div className="mt-2">
                  <div className="font-semibold text-orange-200 text-sm">{item.feature.name}</div>
                  {Array.isArray(item.feature.desc) ? item.feature.desc.map((d: any, idx: number) => (
                    <p key={idx} className="text-sm text-gray-200 mb-1">{d}</p>
                  )) : <p className="text-sm text-gray-200 mb-1">{String(item.feature.desc)}</p>}
                </div>
              )}
              {sectionKey === "backgrounds" && item.starting_equipment && (
                <div className="mt-2">
                  <div className="font-semibold text-orange-200 text-sm">Starting Equipment</div>
                  <ul className="list-disc ml-5 text-sm text-gray-200">
                    {item.starting_equipment.map((eq: any, idx: number) => (
                      <li key={idx}>{eq.quantity}x {eq.equipment.name}</li>
                    ))}
                    {item.starting_equipment_options?.map((opt: any, idx: number) => (
                      <li key={`opt-${idx}`} className="italic text-gray-400">Choose {opt.choose} from {opt.from.equipment_category?.name || 'options'}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
        </div>
      )}
    </li>
  );
}
