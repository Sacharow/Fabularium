import { useParams, useNavigate } from "react-router-dom"

type Stat = {
  name: string
  value: number
  skills?: Record<string, number>
}

type CharacterSection = {
  id: number
  campaignId?: string | number
  name: string
  color: string
  description?: string
  level?: number
  profBonus?: number
  characterClass?: string
  characterRace?: string
  characterSubclass?: string
  stats?: Stat[]
  skillProf?: Record<string, number>
  equipment?: string[]
  money?: Record<string, number>
  background?: string
  personalityTraits?: string
  ideals?: string
  bonds?: string
  flaws?: string
  initiativeBonus?: number
  speed?: number
  hitDice?: number
  hitPointsMax?: number
  hitPointsCurrent?: number
  armorClass?: number
  passivePerception?: number
}

const STORAGE_KEY = "fabularium.campaigns.character_section"

function loadFromSession(): CharacterSection[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch {
    return []
  }
}

export default function CharacterPage() {
  const { characterId } = useParams<{ characterId?: string }>()
  const navigate = useNavigate()
  const characters = loadFromSession()
  const char = characters.find((c) => c.id === Number(characterId))

  if (!char) {
    return (
      <div className="p-6">
        <p>Character not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go back</button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[320px_1fr]">
        <aside className="bg-orange-900 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-md ${char.color}`} />
            <div>
              <h2 className="text-xl font-bold">{char.name}</h2>
              <p className="text-sm text-orange-400">ID: {char.id}</p>
              <p className="text-sm text-orange-400 mt-1">{char.characterClass ?? '—'} • {char.characterRace ?? '—'}</p>
            </div>
          </div>

          {char.description && (
            <p className="mt-3 text-sm text-orange-300">{char.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">Level</div>
              <div className="font-medium">{char.level ?? '—'}</div>
            </div>
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">Prof. Bonus</div>
              <div className="font-medium">{char.profBonus ?? '—'}</div>
            </div>
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">AC</div>
              <div className="font-medium">{char.armorClass ?? '—'}</div>
            </div>
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">Initiative</div>
              <div className="font-medium">{char.initiativeBonus ?? '—'}</div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="flex justify-between"><span className="text-orange-400">HP</span><span className="font-medium">{char.hitPointsCurrent ?? '—'}{char.hitPointsMax ? ` / ${char.hitPointsMax}` : ''}</span></div>
            <div className="flex justify-between mt-1"><span className="text-orange-400">Speed</span><span className="font-medium">{char.speed ?? '—'}</span></div>
            <div className="flex justify-between mt-1"><span className="text-orange-400">Passive Perception</span><span className="font-medium">{char.passivePerception ?? '—'}</span></div>
          </div>

          {(char.money && Object.keys(char.money).length > 0) && (
            <div className="mt-4 text-sm">
              <div className="text-xs text-orange-400">Wealth</div>
              <div className="mt-1 grid grid-cols-2 gap-1">
                {Object.entries(char.money).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="capitalize">{k}</span>
                    <span className="font-medium">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        <main>
          <div className="bg-orange-900 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Stats</h3>
              <div className="text-sm text-orange-400">{char.characterSubclass ?? ''}</div>
            </div>

            {char.stats && char.stats.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                {char.stats.map((s) => (
                  <div key={s.name} className="p-3 bg-orange-800 rounded text-center">
                    <div className="text-xs text-orange-400">{s.name}</div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    {s.skills && Object.keys(s.skills).length > 0 && (
                      <div className="mt-2 text-xs text-orange-300">
                        {Object.entries(s.skills).map(([k, v]) => (
                          <div key={k} className="flex justify-between">
                            <span>{k}</span>
                            <span>{v}</span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-sm text-orange-400">No stats available.</div>
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="bg-orange-900 p-4 rounded-lg">
              <h4 className="font-semibold">Skill Proficiencies</h4>
              {(char.skillProf && Object.keys(char.skillProf).length > 0) ? (
                <div className="mt-2 text-sm grid grid-cols-2 gap-2">
                  {Object.entries(char.skillProf).map(([k, v]) => (
                    <div key={k} className="flex justify-between">
                      <span>{k}</span>
                      <span className="font-medium">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-orange-400">No skill proficiencies.</div>
              )}
            </div>

            <div className="bg-orange-900 p-4 rounded-lg">
              <h4 className="font-semibold">Equipment</h4>
              {char.equipment && char.equipment.length > 0 ? (
                <ul className="list-disc list-inside mt-2 text-sm">
                  {char.equipment.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-orange-400">No equipment listed.</div>
              )}
            </div>
          </div>

          {(char.background || char.personalityTraits || char.ideals || char.bonds || char.flaws) && (
            <div className="mt-4 bg-orange-900 p-4 rounded-lg">
              <h4 className="font-semibold">Background & Personality</h4>
              <div className="mt-2 text-sm space-y-2">
                {char.background && <div><strong>Background:</strong> <span className="font-medium">{char.background}</span></div>}
                {char.personalityTraits && <div><strong>Traits:</strong> <span className="font-medium">{char.personalityTraits}</span></div>}
                {char.ideals && <div><strong>Ideals:</strong> <span className="font-medium">{char.ideals}</span></div>}
                {char.bonds && <div><strong>Bonds:</strong> <span className="font-medium">{char.bonds}</span></div>}
                {char.flaws && <div><strong>Flaws:</strong> <span className="font-medium">{char.flaws}</span></div>}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  )
}