import EntryRenderer from "./EntryRenderer";

export default function ClassRenderer({ item }: { item: any }) {
  if (!item) return null;

  return (
    <div className="space-y-10 text-gray-200 leading-relaxed">

      {/* BASIC INFORMATION */}
      <section>
        <h2 className="text-3xl font-bold mb-2">{item.name}</h2>
        {item.short && <p className="italic text-gray-400 mb-4">{item.short}</p>}

        <div className="space-y-1 text-sm">
          <p><span className="font-semibold text-orange-200">Source:</span> <span className="text-gray-200">{item.source}</span></p>
          <p><span className="font-semibold text-orange-200">Hit Die:</span> <span className="text-gray-200">{item.hd}</span></p>
          <p><span className="font-semibold text-orange-200">Primary Ability:</span> <span className="text-gray-200">{item.primary}</span></p>

          {item.proficiency && (
            <p>
              <span className="font-semibold text-orange-200">Saving Throws:</span>{" "}
              <span className="text-gray-200">
                {Object.keys(item.proficiency)
                  .filter((key) => item.proficiency[key])
                  .map((key) => key.toUpperCase())
                  .join(", ")}
              </span>
            </p>
          )}
        </div>
      </section>

      {/* CLASS TABLE */}
      {Array.isArray(item.classTableGroups) && item.classTableGroups.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Class Table</h3>

          {item.classTableGroups.map((group: any, gi: number) => (
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

      {/* PROFICIENCIES */}
      <section>
        <h3 className="text-2xl font-bold mb-2">Proficiencies</h3>

        <p><span className="font-semibold text-orange-200">Armor:</span> <span className="text-gray-200">{Array.isArray(item.armor) ? item.armor.join(", ") : "—"}</span></p>
        <p><span className="font-semibold text-orange-200">Weapons:</span> <span className="text-gray-200">{Array.isArray(item.weapons) ? item.weapons.join(", ") : "—"}</span></p>

        {item.skills && (
          <p>
            <span className="font-semibold text-orange-200">Skills:</span>{" "}
            <span className="text-gray-200">Choose {item.skills.choose} from {Array.isArray(item.skills.from) ? item.skills.from.join(", ") : String(item.skills.from)}</span>
          </p>
        )}
      </section>

      {/* STARTING EQUIPMENT */}
      {item.startingEquipment && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Starting Equipment</h3>

          <ul className="list-disc ml-6 space-y-1 text-sm">
            {Array.isArray(item.startingEquipment.default) ? item.startingEquipment.default.map((eq: any, i: number) => (
              <li key={i} className="text-gray-200">
                {typeof eq === "string" ? (
                  eq
                ) : (
                  <>Choose {eq.choose}: {Array.isArray(eq.items) ? eq.items.join(" / ") : String(eq.items)}</>
                )}
              </li>
            )) : <li className="text-gray-400">—</li>}
          </ul>

          {item.startingEquipment.goldAlternative && (
            <p className="mt-2 text-gray-400">Gold alternative: {item.startingEquipment.goldAlternative} gp</p>
          )}
        </section>
      )}

      {/* CLASS FEATURES */}
      {Array.isArray(item.classFeatures) && (
        <section>
          <h3 className="text-2xl font-bold mb-4">Class Features</h3>

          {item.classFeatures.map((featuresAtLevel: any[] = [], lvl: number) => (
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
      {Array.isArray(item.subclasses) && item.subclasses.length > 0 && (
        <section>
          <h3 className="text-2xl font-bold mb-4">{item.subclassTitle}</h3>

          {item.subclasses.map((sub: any, si: number) => (
            <div key={si} className="mb-10">
              <h4 className="text-xl font-semibold text-orange-200">{sub.name}</h4>
              {sub.source && <p className="text-gray-400 mb-2">{sub.source}</p>}
              {sub.desc && <p className="mb-4 text-gray-200">{sub.desc}</p>}

              {Array.isArray(sub.subclassFeatures) && sub.subclassFeatures.map((sf: any, sfi: number) => (
                <div key={sfi} className="mb-4">
                  <p className="font-semibold text-orange-200">
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
          ))}
        </section>
      )}

      {/* MULTICLASSING */}
      {item.multiclass && (
        <section>
          <h3 className="text-2xl font-bold mb-2">Multiclassing</h3>

          <p className="font-semibold">Requirements:</p>
          <ul className="list-disc ml-6 mb-2 text-gray-200">
            {item.multiclass.require && typeof item.multiclass.require === 'object' ?
              Object.entries(item.multiclass.require)
                .filter(([k]) => k !== "type")
                .map(([k, v]: any) => (
                  <li key={k}>{k.toUpperCase()} {String(v)}</li>
                ))
              : <li className="text-gray-400">—</li>
            }
          </ul>

          {item.multiclass.proficiencies && (
            <>
              <p className="font-semibold text-orange-200">Proficiencies gained:</p>
              <p className="text-gray-200">Armor: {Array.isArray(item.multiclass.proficiencies.armor) ? item.multiclass.proficiencies.armor.join(", ") : "—"}</p>
              <p className="text-gray-200">Weapons: {Array.isArray(item.multiclass.proficiencies.weapons) ? item.multiclass.proficiencies.weapons.join(", ") : "—"}</p>
            </>
          )}
        </section>
      )}
    </div>
  );
}
