import { useState } from "react";
import EntryRenderer from "./EntryRenderer";

export default function ClassRenderer({ item }: { item: any }) {
  const [openSubclass, setOpenSubclass] = useState<string | null>(null);

  if (!item) return null;

  const hitDie = item.hit_die ?? item.hd ?? item.hitDie ?? item.hit;
  const primary = item.primary ?? item.primary_ability ?? item.primaryAbility ?? item.ability;
  const short = item.short ?? item.desc ?? item.description;

  // collect entries array (some files use `entries`, some `entry`)
  const entries: any[] = Array.isArray(item.entries) ? item.entries : Array.isArray(item.entry) ? item.entry : [];

  // helper: find table nodes from entries
  const tableNodes = entries.filter((n) => n && n.type === "table");

  // helper: find class-level features from known fields or by scanning entries for data.isFeature
  const explicitFeatures: any[] =
    Array.isArray(item.classFeatures)
      ? item.classFeatures
      : Array.isArray(item.class_features)
      ? item.class_features
      : Array.isArray(item.features)
      ? item.features
      : [];

  const scannedFeatures = entries.filter((n) => n && n.type === "entry" && n.data && n.data.isFeature);
  const classFeatures = explicitFeatures.length ? explicitFeatures : scannedFeatures;

  // proficiency formatting
  function formatProficiencies(p: any) {
    if (!p) return null;
    if (Array.isArray(p)) {
      return p
        .map((x) => (typeof x === "string" ? x : x.name ?? JSON.stringify(x)))
        .join(", ");
    }
    if (typeof p === "object") {
      if (p.from && Array.isArray(p.from.options)) {
        return p.from.options.map((o: any) => o.name ?? JSON.stringify(o)).join(", ");
      }
      return Object.entries(p)
        .map(([k, v]) => `${k}: ${typeof v === "string" ? v : JSON.stringify(v)}`)
        .join(", ");
    }
    return String(p);
  }

  // starting equipment formatting
  function renderStartingEquipment() {
    const se = item.starting_equipment ?? item.startingEquipment ?? item.starting_equipment_options;
    if (!se) return null;
    if (Array.isArray(se)) {
      return (
        <ul className="list-disc ml-6 mb-2 text-sm text-gray-200">
          {se.map((it: any, idx: number) => (
            <li key={idx}>{typeof it === "string" ? it : it.name ?? JSON.stringify(it)}</li>
          ))}
        </ul>
      );
    }
    if (typeof se === "object") {
      // try common shape: { equipment: [...], choose: ... }
      if (Array.isArray(se.equipment)) {
        return (
          <ul className="list-disc ml-6 mb-2 text-sm text-gray-200">
            {se.equipment.map((it: any, idx: number) => <li key={idx}>{it.name ?? JSON.stringify(it)}</li>)}
          </ul>
        );
      }
      return <div className="text-sm text-gray-200">{JSON.stringify(se)}</div>;
    }
    return <div className="text-sm text-gray-200">{String(se)}</div>;
  }

  // subclass feature extraction: try to find features and associate levels if available
  function getSubclassFeatures(sc: any) {
    if (!sc) return { byLevel: new Map<number, any[]>(), any: [] as any[] };

    // common explicit places
    const raw =
      sc.subclass_features ??
      sc.subclassFeatures ??
      sc.features ??
      sc.entries ??
      sc.entry ??
      sc.subclass_tables ??
      [];

    const candidates = Array.isArray(raw) ? raw : [];

    const byLevel = new Map<number, any[]>();
    const any: any[] = [];

    const pushFeature = (feat: any, level?: number | null) => {
      if (typeof level === "number" && !Number.isNaN(level)) {
        const arr = byLevel.get(level) ?? [];
        arr.push(feat);
        byLevel.set(level, arr);
      } else {
        any.push(feat);
      }
    };

    candidates.forEach((c: any) => {
      // if object with numeric level field
      if (c && typeof c === "object") {
        const level = c.level ?? c.data?.level ?? null;
        if (level !== null) {
          const lvl = typeof level === "string" ? parseInt(level, 10) : Number(level);
          if (!Number.isNaN(lvl)) {
            pushFeature(c, lvl);
            return;
          }
        }

        // try to parse level from name like "Level 3" or "3rd level"
        if (typeof c.name === "string") {
          const m = c.name.match(/level\s*(\d+)/i) || c.name.match(/(\d+)(st|nd|rd|th)\s*level/i);
          if (m && m[1]) {
            const lvl = parseInt(m[1], 10);
            if (!Number.isNaN(lvl)) {
              pushFeature(c, lvl);
              return;
            }
          }
        }

        // data.isFeature likely
        if (c.type === "entry" || c.data?.isFeature) {
          pushFeature(c, null);
          return;
        }
      }

      // fallback: treat as generic feature
      pushFeature(c, null);
    });

    return { byLevel, any };
  }

  const subclasses: any[] = Array.isArray(item.subclasses) ? item.subclasses : Array.isArray(item.subclass) ? item.subclass : [];

  return (
    <div className="mb-2 text-sm text-gray-200">
      {/* basics */}
      <div className="mb-3">
        {hitDie && <div className="text-sm"><strong>Hit die:</strong> {hitDie}</div>}
        {primary && <div className="text-sm"><strong>Primary:</strong> {primary}</div>}
        {short && <div className="mt-1 text-xs text-orange-200">{short}</div>}
      </div>

      {/* class tables */}
      {tableNodes.length > 0 && (
        <div className="mb-3">
          <div className="font-semibold text-orange-200 mb-2">Tables</div>
          {tableNodes.map((t, i) => <EntryRenderer key={i} node={t} />)}
        </div>
      )}

      {/* proficiencies: armor / weapons / skills */}
      <div className="mb-3">
        <div className="font-semibold text-orange-200 mb-1">Proficiencies</div>
        <div className="text-sm text-gray-200">
          {item.proficiencies ? <div><strong>Proficiencies:</strong> {formatProficiencies(item.proficiencies)}</div> : null}
          {item.proficiency_choices ? <div><strong>Choices:</strong> {formatProficiencies(item.proficiency_choices)}</div> : null}
          {item.saving_throws ? <div><strong>Saving Throws:</strong> {formatProficiencies(item.saving_throws)}</div> : null}
          {item.armor_proficiencies ? <div><strong>Armor:</strong> {formatProficiencies(item.armor_proficiencies)}</div> : null}
          {item.weapon_proficiencies ? <div><strong>Weapons:</strong> {formatProficiencies(item.weapon_proficiencies)}</div> : null}
          {/* fallback generic fields */}
          {!item.proficiencies && !item.proficiency_choices && !item.saving_throws && !item.armor_proficiencies && !item.weapon_proficiencies && <div className="text-sm text-gray-400">No explicit proficiency data.</div>}
        </div>
      </div>

      {/* starting equipment */}
      <div className="mb-3">
        <div className="font-semibold text-orange-200 mb-1">Starting Equipment</div>
        {renderStartingEquipment() ?? <div className="text-sm text-gray-400">No starting equipment listed.</div>}
      </div>

      {/* class features (top-level, excluding subclass features) */}
      <div className="mb-3">
        <div className="font-semibold text-orange-200 mb-2">Class Features</div>
        {classFeatures.length === 0 ? (
          <div className="text-sm text-gray-400">No top-level features found.</div>
        ) : (
          <div className="space-y-2">
            {classFeatures.map((f: any, idx: number) => (
              <div key={idx} className="p-2 rounded-md bg-orange-900/10 border border-orange-700/20">
                {typeof f === "string" ? <div className="text-sm">{f}</div> : Array.isArray(f.entry) || f.type ? <EntryRenderer node={f} /> : <div className="text-sm">{f.name ?? JSON.stringify(f)}</div>}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* subclasses accordion */}
      {subclasses.length > 0 && (
        <div className="mb-3">
          <div className="font-semibold text-orange-200 mb-2">Subclasses</div>
          <div className="space-y-2">
            {subclasses.map((sc: any, si: number) => {
              const key = `sub-${si}`;
              const open = openSubclass === key;
              const { byLevel, any } = getSubclassFeatures(sc);
              const levels = Array.from(byLevel.keys()).sort((a, b) => a - b);

              return (
                <div key={si} className="border border-orange-700/20 rounded-md">
                  <button
                    className="w-full p-2 flex justify-between items-center"
                    onClick={() => setOpenSubclass(open ? null : key)}
                  >
                    <div>
                      <div className="font-medium text-sm text-gray-100">{sc.name ?? sc.subclass_name ?? `Subclass ${si + 1}`}</div>
                      {sc.desc && <div className="text-xs text-orange-200">{Array.isArray(sc.desc) ? sc.desc[0] : sc.desc}</div>}
                    </div>
                    <div className="text-xs text-gray-200">{open ? "▾" : "▸"}</div>
                  </button>

                  {open && (
                    <div className="p-3 space-y-2">
                      {levels.length === 0 && any.length === 0 && <div className="text-sm text-gray-400">No subclass features found.</div>}

                      {levels.map((lvl) => (
                        <div key={lvl} className="mb-2">
                          <div className="text-sm font-semibold text-orange-200 mb-1">Level {lvl}</div>
                          {byLevel.get(lvl)?.map((feat: any, fi: number) => (
                            <div key={fi} className="mb-1 text-sm">
                              {Array.isArray(feat.entry) || feat.type ? <EntryRenderer node={feat} /> : <div>{feat.name ?? JSON.stringify(feat)}</div>}
                            </div>
                          ))}
                        </div>
                      ))}

                      {any.length > 0 && (
                        <div>
                          <div className="text-sm font-semibold text-orange-200 mb-1">Other</div>
                          {any.map((feat: any, fi: number) => <div key={fi} className="mb-1 text-sm"><EntryRenderer node={feat} /></div>)}
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
