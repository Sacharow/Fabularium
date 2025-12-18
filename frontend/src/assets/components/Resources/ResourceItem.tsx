import EntryRenderer from "./EntryRenderer";
import ClassRenderer from "./ClassRenderer";

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
          {/* common entries */}
          {Array.isArray(item.entries) && item.entries.map((en: any, idx: number) => <div key={idx}><EntryRenderer node={en} /></div>)}
          {Array.isArray(item.entry) && item.entry.map((en: any, idx: number) => <div key={idx}><EntryRenderer node={en} /></div>)}

          {/* per-category renderers */}
          {sectionKey === "classes" && <ClassRenderer item={item} />}

          {/* background-only fields */}
          {sectionKey === "backgrounds" && item.skillProficiencies && (
            <div className="text-sm text-gray-200 mb-1">Skill Proficiencies: {formatSkillProficiencies?.(item.skillProficiencies)}</div>
          )}
          {sectionKey === "backgrounds" && item.languageProficiencies && (
            <div className="text-sm text-gray-200 mb-1">Language Proficiencies: {formatLanguageProficiencies?.(item.languageProficiencies)}</div>
          )}
        </div>
      )}
    </li>
  );
}
