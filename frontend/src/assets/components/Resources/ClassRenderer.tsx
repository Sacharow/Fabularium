import { useState } from "react";
import EntryRenderer from "./EntryRenderer";

export default function ClassRenderer({ item }: { item: any }) {
  const [openSubclass, setOpenSubclass] = useState<string | null>(null);
  if (!item) return null;

  const fullSlots = [
    [2,0,0,0,0,0,0,0,0],
    [3,0,0,0,0,0,0,0,0],
    [4,2,0,0,0,0,0,0,0],
    [4,3,0,0,0,0,0,0,0],
    [4,3,2,0,0,0,0,0,0],
    [4,3,3,0,0,0,0,0,0],
    [4,3,3,1,0,0,0,0,0],
    [4,3,3,2,0,0,0,0,0],
    [4,3,3,3,1,0,0,0,0],
    [4,3,3,3,2,0,0,0,0],
    [4,3,3,3,2,1,0,0,0],
    [4,3,3,3,2,1,0,0,0],
    [4,3,3,3,2,1,1,0,0],
    [4,3,3,3,2,1,1,0,0],
    [4,3,3,3,2,1,1,1,0],
    [4,3,3,3,2,1,1,1,0],
    [4,3,3,3,2,1,1,1,1],
    [4,3,3,3,3,1,1,1,1],
    [4,3,3,3,3,2,1,1,1],
    [4,3,3,3,3,2,2,1,1],
  ];

  const halfSlots = [
    [2,0,0,0,0],
    [3,0,0,0,0],
    [3,0,0,0,0],
    [4,2,0,0,0],
    [4,2,0,0,0],
    [4,3,0,0,0],
    [4,3,0,0,0],
    [4,3,2,0,0],
    [4,3,2,0,0],
    [4,3,2,0,0],
    [4,3,2,0,0],
    [4,3,2,1,0],
    [4,3,2,1,0],
    [4,3,2,1,0],
    [4,3,2,1,0],
    [4,3,2,1,1],
    [4,3,3,1,1],
    [4,3,3,2,1],
    [4,3,3,2,2],
    [4,3,3,2,2]
  ];

  // warlock
  const warlockSlots = [1,2,2,2,2,2,2,2,2,2,3,3,3,3,3,3,4,4,4,4];
  const warlockSlotLevel = [1,1,2,2,3,3,4,4,5,5,5,5,5,5,5,5,5,5,5,5];
  const warlockCantrips = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
  const warlockPrepared = [2,3,4,5,6,7,8,9,10,10,11,11,12,12,13,13,14,14,15,15];

  // full casters
  const bardCantrips = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
  const bardPrepared = [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
  const clericCantrips = [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5];
  const clericPrepared = [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
  const druidCantrips = [2,2,2,3,3,3,3,3,3,4,4,4,4,4,4,4,4,4,4,4];
  const druidPrepared = [4,5,6,7,9,10,11,12,14,15,16,16,17,17,18,18,19,20,21,22];
  const sorcCantrips = [4,4,4,5,5,5,5,5,5,6,6,6,6,6,6,6,6,6,6,6];
  const sorcPrepared = [2,4,6,7,9,10,12,12,14,15,16,16,17,17,18,18,19,20,21,22];
  const wizardCantrips = [3,3,3,4,4,4,4,4,4,5,5,5,5,5,5,5,5,5,5,5];
  const wizardPrepared = [4,5,6,7,9,10,11,12,14,15,16,16,17,18,19,21,22,23,24,25];

  // half casters
  const paladinPrepared = [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15];
  const rangerPrepared = [2,3,4,5,6,6,7,7,9,9,10,10,11,11,12,12,14,14,15,15];

  const cantripsFallback = (key: string, lvl: number) => {
    switch (key) {
      case "bard": return bardCantrips[lvl - 1] ?? "—";
      case "cleric": return clericCantrips[lvl - 1] ?? "—";
      case "druid": return druidCantrips[lvl - 1] ?? "—";
      case "sorcerer": return sorcCantrips[lvl - 1] ?? "—";
      case "wizard": return wizardCantrips[lvl - 1] ?? "—";
      case "warlock": return warlockCantrips[lvl - 1] ?? "—";
      default: return "—";
    }
  };

  const spellsKnownFallback = (key: string, lvl: number) => {
    switch (key) {
      case "bard": return bardPrepared[lvl - 1] ?? "—";
      case "sorcerer": return sorcPrepared[lvl - 1] ?? "—";
      case "warlock": return warlockPrepared[lvl - 1] ?? "—";
      case "cleric": return clericPrepared[lvl - 1] ?? "—";
      case "druid": return druidPrepared[lvl - 1] ?? "—";
      case "wizard": return wizardPrepared[lvl - 1] ?? "—";
      case "paladin": return paladinPrepared[lvl - 1] ?? "—";
      case "ranger": return rangerPrepared[lvl - 1] ?? "—";
      default: return null;
    }
  };

  const slotRow = (slotArr: number[]) => [...slotArr];

  const buildSlots = (key: string, lvl: number) => {
    const lower = key.toLowerCase();
    if (lower === "warlock") {
      return { pactSlots: warlockSlots[lvl - 1] ?? "—", pactLevel: warlockSlotLevel[lvl - 1] ?? "—", slots: [] };
    }

    // Full casters use level directly; half casters use their dedicated table rows
    if (["bard","cleric","druid","sorcerer","wizard"].includes(lower)) {
      const base = fullSlots[lvl - 1] || fullSlots[fullSlots.length - 1];
      return { pactSlots: "—", pactLevel: "—", slots: slotRow(base) };
    }

    if (["paladin","ranger"].includes(lower)) {
      const base = halfSlots[lvl - 1] || halfSlots[halfSlots.length - 1];
      return { pactSlots: "—", pactLevel: "—", slots: slotRow(base) };
    }

    return { pactSlots: "—", pactLevel: "—", slots: [] };
  };

  // Map API fields to expected fields (handle both old and new formats)
  const hit_die = item.hd || item.hit_die;
  const primary = item.primary;
  const proficiency = item.proficiency;
  const armor = item.armor || [];
  const weapons = item.weapons || [];
  const skills = item.skills;
  const startingEquipment = item.startingEquipment;
  const classTableGroups = item.classTableGroups;
  const classFeatures = item.classFeatures;
  const subclasses = item.subclasses || [];
  const subclassTitle = item.subclassTitle || "Subclasses";
  const multiclass = item.multiclass;

  return (
    <div className="space-y-10 text-gray-200 leading-relaxed">

      {/* BASIC INFORMATION */}
      <section>
        <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
        {item.short && <p className="italic text-gray-400 mb-4">{item.short}</p>}

        <div className="space-y-1 text-sm mb-4">
          {item.source && <p><span className="font-semibold text-orange-200">Source:</span> <span className="text-gray-200">{item.source}</span></p>}
          {hit_die && <p><span className="font-semibold text-orange-200">Hit Die:</span> <span className="text-gray-200">d{hit_die}</span></p>}
          {primary && <p><span className="font-semibold text-orange-200">Primary Ability:</span> <span className="text-gray-200">{primary}</span></p>}

          {proficiency && (
            <p>
              <span className="font-semibold text-orange-200">Saving Throws:</span>{" "}
              <span className="text-gray-200">
                {Object.keys(proficiency)
                  .filter((key) => proficiency[key])
                  .map((key) => key.toUpperCase())
                  .join(", ")}
              </span>
            </p>
          )}
        </div>

        {/* GENERIC ENTRIES/DESCRIPTION */}
        {Array.isArray(item.entries) && item.entries.map((en: any, idx: number) => <div key={idx}><EntryRenderer node={en} /></div>)}
        {Array.isArray(item.desc) && item.desc.map((d: any, idx: number) => (
          <p key={idx} className="text-sm text-gray-200 mb-2">{d}</p>
        ))}
      </section>

      {/* CLASS TABLE */}
      {Array.isArray(classTableGroups) && classTableGroups.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Class Table</h3>

          {classTableGroups.map((group: any, gi: number) => (
            <div key={gi} className="overflow-auto mb-3 border border-orange-700 rounded">
              <table className="w-full text-sm border-collapse">
                {Array.isArray(group.colLabels) && group.colLabels.length > 0 && (
                  <thead>
                    <tr className="bg-orange-800/20">
                      <th className="p-2 text-left text-xs text-orange-100 border-b border-orange-700">Level</th>
                      {group.colLabels.map((label: string, i: number) => (
                        <th key={i} className="p-2 text-left text-xs text-orange-100 border-b border-orange-700">{label}</th>
                      ))}
                    </tr>
                  </thead>
                )}

                <tbody>
                  {Array.isArray(group.rows) && group.rows.map((row: any, ri: number) => (
                    <tr key={ri} className={ri % 2 === 0 ? "bg-orange-800/10" : "bg-transparent"}>
                      <td className="p-2 align-top text-sm border-b border-orange-800 font-medium">{ri + 1}</td>

                      {Array.isArray(row) && row.map((col: any, ci: number) => (
                        <td key={ci} className="p-2 align-top text-sm border-b border-orange-800">
                          {typeof col === "string"
                            ? col
                            : col?.type === "bonus"
                            ? `+${col.value}`
                            : String(col)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ))}
        </section>
      )}

      {/* SPELLCASTING TABLE - focused view */}
      {item.spellcasting && Array.isArray(item.levels) && item.levels.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Spellcasting</h3>

          {/* Minimal progression table: cantrips, spells prepared/known, slots (using local rules tables) */}
          {(() => {
            const key = String(item.index || item.name || "").toLowerCase();
            const isWarlock = key === "warlock";
            const isHalfCaster = ["paladin", "ranger"].includes(key);
            const showCantrips = !isHalfCaster;

            const progression = Array.from({ length: 20 }, (_, i) => {
              const lvl = i + 1;
              const built = buildSlots(key, lvl);
              const cs = (item.levels?.[i]?.class_specific) || {};
              const cantrips = cs.cantrips_known ?? cantripsFallback(key, lvl);
              const prepared = cs.spells_prepared ?? cs.spells_known ?? spellsKnownFallback(key, lvl) ?? "—";
              return {
                level: lvl,
                cantrips,
                prepared,
                slots: built.slots,
                pactSlots: built.pactSlots,
                pactLevel: built.pactLevel,
                cs,
              };
            });

            const slotHeaderCount = isWarlock ? 0 : (isHalfCaster ? 5 : 9);

            return (
              <div className="overflow-auto border border-orange-700 rounded">
                <table className="w-full text-sm border-collapse">
                  <thead>
                    <tr className="bg-orange-800/20">
                      <th className="p-2 text-left text-xs text-orange-100 border-b border-orange-700">Level</th>
                      {showCantrips && (
                        <th className="p-2 text-center text-xs text-orange-100 border-b border-orange-700">Cantrips</th>
                      )}
                      <th className="p-2 text-center text-xs text-orange-100 border-b border-orange-700">Spells Prepared</th>
                      {isWarlock ? (
                        <>
                          <th className="p-2 text-center text-xs text-orange-100 border-b border-orange-700">Spell Slots</th>
                          <th className="p-2 text-center text-xs text-orange-100 border-b border-orange-700">Slot Level</th>
                        </>
                      ) : (
                        Array.from({ length: slotHeaderCount }, (_, i) => i + 1).map(level => (
                          <th key={`slot-${level}`} className="p-2 text-center text-xs text-orange-100 border-b border-orange-700">
                            {level}
                          </th>
                        ))
                      )}
                    </tr>
                  </thead>
                  <tbody>
                    {progression.map((row, idx) => (
                      <tr key={idx} className={idx % 2 === 0 ? "bg-orange-800/10" : "bg-transparent"}>
                        <td className="p-2 text-sm border-b border-orange-800 font-medium">{row.level}</td>
                        {showCantrips && (
                          <td className="p-2 text-center text-sm border-b border-orange-800">{row.cantrips}</td>
                        )}
                        <td className="p-2 text-center text-sm border-b border-orange-800">{row.prepared}</td>
                        {isWarlock ? (
                          <>
                            <td className="p-2 text-center text-sm border-b border-orange-800">{row.pactSlots}</td>
                            <td className="p-2 text-center text-sm border-b border-orange-800">{row.pactLevel}</td>
                          </>
                        ) : (
                          row.slots.slice(0, slotHeaderCount).map((val: any, iSlot: number) => (
                            <td key={iSlot} className="p-2 text-center text-sm border-b border-orange-800">{val || "—"}</td>
                          ))
                        )}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          })()}
        </section>
      )}

      {/* PROFICIENCIES */}
      <section>
        <h3 className="text-2xl font-bold mb-2">Proficiencies</h3>

        <p><span className="font-semibold text-orange-200">Armor:</span> <span className="text-gray-200">{Array.isArray(armor) && armor.length > 0 ? armor.join(", ") : "—"}</span></p>
        <p><span className="font-semibold text-orange-200">Weapons:</span> <span className="text-gray-200">{Array.isArray(weapons) && weapons.length > 0 ? weapons.join(", ") : "—"}</span></p>

        {skills && (
          <p>
            <span className="font-semibold text-orange-200">Skills:</span>{" "}
            <span className="text-gray-200">Choose {skills.choose} from {Array.isArray(skills.from) ? skills.from.join(", ") : String(skills.from)}</span>
          </p>
        )}
      </section>

      {/* STARTING EQUIPMENT */}
      {startingEquipment && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Starting Equipment</h3>

          <ul className="list-disc ml-6 space-y-1 text-sm">
            {Array.isArray(startingEquipment.default) ? startingEquipment.default.map((eq: any, i: number) => (
              <li key={i} className="text-gray-200">
                {typeof eq === "string" ? (
                  eq
                ) : (
                  <>Choose {eq.choose}: {Array.isArray(eq.items) ? eq.items.join(" / ") : String(eq.items)}</>
                )}
              </li>
            )) : <li className="text-gray-400">—</li>}
          </ul>

          {startingEquipment.goldAlternative && (
            <p className="mt-2 text-gray-400">Gold alternative: {startingEquipment.goldAlternative} gp</p>
          )}
        </section>
      )}

      {/* CLASS FEATURES */}
      {Array.isArray(classFeatures) && classFeatures.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-4">Class Features</h3>

          {classFeatures.map((featuresAtLevel: any[] = [], lvl: number) => (
            <div key={lvl} className="mb-6">
              <h4 className="text-xl font-semibold mb-1">Level {lvl + 1}</h4>

              {(!featuresAtLevel || featuresAtLevel.length === 0) && (
                <p className="text-gray-500 italic">—</p>
              )}

              {Array.isArray(featuresAtLevel) && featuresAtLevel.map((feat: any, fi: number) => (
                <div key={fi} className="mb-3">
                  <p className="font-semibold text-orange-200">{feat.name}</p>

                  {/* ENTRIES -> EntryRenderer */}
                  {Array.isArray(feat.entries) && feat.entries.map((entry: any, ei: number) => (
                    <div key={ei} className="ml-3">
                      <EntryRenderer node={entry} />
                    </div>
                  ))}

                  {feat.ability && (
                    <p className="ml-3 text-gray-300 text-sm">Ability bonus: {Object.entries(feat.ability).map(([k, v]: any) => `${k.toUpperCase()} ${v}`).join(", ")}</p>
                  )}

                  {feat.speed && (
                    <p className="ml-3 text-gray-300 text-sm">Speed bonus: {Object.entries(feat.speed).map(([k, v]: any) => `${k}: ${v}`).join(", ")}</p>
                  )}
                </div>
              ))}
            </div>
          ))}
        </section>
      )}

      {/* SUBCLASSES */}
      {Array.isArray(subclasses) && subclasses.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-4">{subclassTitle}</h3>

          {subclasses.map((sub: any, si: number) => {
            const key = `sc-${si}`;
            const open = openSubclass === key;

            return (
              <div key={si} className="border border-orange-700/20 rounded mb-4">
                <button 
                  className="w-full p-3 flex justify-between items-center hover:bg-orange-700/10 cursor-pointer text-left" 
                  onClick={() => setOpenSubclass(open ? null : key)}
                >
                  <div>
                    <div className="text-xl font-semibold text-orange-200">{sub.name}</div>
                    {sub.source && <div className="text-xs text-gray-400">{sub.source}</div>}
                  </div>
                  <div className="text-sm">{open ? "▾" : "▸"}</div>
                </button>
                
                {open && (
                  <div className="p-3 pt-0 border-t border-orange-700/10 mt-3">
                    {sub.desc && <p className="mb-4 text-gray-200 text-sm italic">{sub.desc}</p>}

                    {Array.isArray(sub.subclassFeatures) && sub.subclassFeatures.map((sf: any, sfi: number) => (
                      <div key={sfi} className="mb-4 last:mb-0">
                        <p className="font-semibold text-orange-200 text-sm">
                          {sf.level != null && (
                            <span className="text-yellow-300">Level {sf.level}: </span>
                          )}
                          {sf.name}
                        </p>

                        {/* ENTRIES -> EntryRenderer */}
                        {Array.isArray(sf.entries) && sf.entries.map((entry: any, ei: number) => (
                          <div key={ei} className="ml-3">
                            <EntryRenderer node={entry} />
                          </div>
                        ))}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            );
          })}
        </section>
      )}

      {/* MULTICLASSING */}
      {multiclass && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Multiclassing</h3>

          <p className="font-semibold">Requirements:</p>
          <ul className="list-disc ml-6 mb-2 text-gray-200">
            {multiclass.require && typeof multiclass.require === 'object' ?
              Object.entries(multiclass.require)
                .filter(([k]) => k !== "type")
                .map(([k, v]: any) => (
                  <li key={k}>{k.toUpperCase()} {String(v)}</li>
                ))
              : <li className="text-gray-400">—</li>
            }
          </ul>

          {multiclass.proficiencies && (
            <>
              <p className="font-semibold text-orange-200">Proficiencies gained:</p>
              <p className="text-gray-200">Armor: {Array.isArray(multiclass.proficiencies.armor) ? multiclass.proficiencies.armor.join(", ") : "—"}</p>
              <p className="text-gray-200">Weapons: {Array.isArray(multiclass.proficiencies.weapons) ? multiclass.proficiencies.weapons.join(", ") : "—"}</p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
