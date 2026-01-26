import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"

type Stat = {
  name: string
  value: number
  modifier: number
  skills?: Record<string, number>
}

type NpcSection = {
  id: number
  campaignId?: string | number
  name: string
  color: string
  description?: string
  npcRace?: string
  alignment?: string
  age?: number | string
  height?: number | string
  weight?: number | string
  crRating?: number
  profBonus?: number
  characterClass?: string
  characterSubclass?: string
  stats?: Stat[]
  skillProf?: Record<string, number>
  equipment?: string[]
  initiativeBonus?: number
  hitDice?: number
  hitPointsMax?: number
  armorClass?: number
  passivePerception?: number
}

export default function NpcPage() {
  const { npcId, campaignId } = useParams<{ npcId?: string, campaignId?: string }>()
  const navigate = useNavigate();
  const [npc, setNpc] = useState<NpcSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId || !npcId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs/${npcId}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch NPC');
        // Spróbuj sparsować JSON, jeśli nie wyjdzie, zgłoś czytelny błąd
        try {
          return await res.json();
        } catch (err) {
          const text = await res.text();
          throw new Error('Invalid JSON from backend: ' + text);
        }
      })
      .then((data) => setNpc(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [campaignId, npcId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !npc) {
    return (
      <div className="p-6">
        <p>{error || 'NPC not found.'}</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go back</button>
      </div>
    );
  }

  const introData = {
    currentSection: "NPC Section",
    urlName: "NpcView"
  };

  return (
    <div className="p-6">
      <div className="pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm ">
            <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
            <span> / </span>
            <NavLink to={`/InCampaign/${npc.campaignId}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.currentSection}</NavLink>
            <span> / </span>
            <NavLink to="#" className="cursor-pointer hover:text-gray-400"> {npc.name}</NavLink>
          </p>
        </div>
      </div>
      
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[320px_1fr]">
        <aside className="bg-orange-900 p-4 rounded-lg">
          <div className="flex items-center space-x-4">
            <div className={`w-20 h-20 rounded-md ${npc.color}`} />
            <div>
              <h2 className="text-xl font-bold">{npc.name}</h2>
              <p className="text-sm text-orange-400">ID: {npc.id}</p>
              <p className="text-sm text-orange-400 mt-1">{npc.characterClass ?? '—'} • {npc.npcRace ?? '—'}</p>
            </div>
          </div>

          {npc.description && (
            <p className="mt-3 text-sm text-orange-300">{npc.description}</p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">CR Rating</div>
              <div className="font-medium">{npc.crRating ?? '—'}</div>
            </div>
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">Prof. Bonus</div>
              <div className="font-medium">{(npc.profBonus ?? '-') === '-' ? '-' : (npc.profBonus! >= 0 ? `+${npc.profBonus}` : `${npc.profBonus}`)}</div>
            </div>
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">AC</div>
              <div className="font-medium">{npc.armorClass ?? '—'}</div>
            </div>
            <div className="bg-orange-800 p-2 rounded">
              <div className="text-xs text-orange-400">Initiative</div>
              <div className="font-medium">{(npc.initiativeBonus ?? '-') === '-' ? '-' : (npc.initiativeBonus! >= 0 ? `+${npc.initiativeBonus}` : `${npc.initiativeBonus}`)}</div>
            </div>
          </div>

          <div className="mt-4 text-sm">
            <div className="flex justify-between"><span className="text-orange-400">HP</span><span className="font-medium">{npc.hitPointsMax ?? '—'}</span></div>
            <div className="flex justify-between mt-1"><span className="text-orange-400">Hit Dice</span><span className="font-medium">{npc.hitDice ? `D${npc.hitDice}` : '—'}</span></div>
            <div className="flex justify-between mt-1"><span className="text-orange-400">Passive Perception</span><span className="font-medium">{npc.passivePerception ?? '—'}</span></div>
          </div>

          {(npc.age || npc.height || npc.weight || npc.alignment) && (
            <div className="mt-4 text-sm">
              <div className="text-xs text-orange-400 mb-2">Physical & Personality</div>
              {npc.age && <div className="flex justify-between"><span className="text-orange-400">Age</span><span className="font-medium">{npc.age}</span></div>}
              {npc.height && <div className="flex justify-between mt-1"><span className="text-orange-400">Height</span><span className="font-medium">{npc.height} cm</span></div>}
              {npc.weight && <div className="flex justify-between mt-1"><span className="text-orange-400">Weight</span><span className="font-medium">{npc.weight} kg</span></div>}
              {npc.alignment && <div className="flex justify-between mt-1"><span className="text-orange-400">Alignment</span><span className="font-medium">{npc.alignment}</span></div>}
            </div>
          )}
        </aside>

        <main>
          <div className="bg-orange-900 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold">Stats</h3>
              <div className="text-sm text-orange-400">{npc.characterSubclass ?? ''}</div>
            </div>

            {npc.stats && npc.stats.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3 mt-4">
                {npc.stats.map((s) => (
                  <div key={s.name} className="p-3 bg-orange-800 rounded text-center">
                    <div className="text-xs text-orange-400">{s.name}</div>
                    <div className="text-2xl font-bold">{s.value}</div>
                    <div className="text-sm text-orange-300">
                      {s.modifier >= 0 ? `+${s.modifier}` : s.modifier}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="mt-4 text-sm text-orange-400">No stats available.</div>
            )}
          </div>

          <div className="mt-4 grid gap-4 md:grid-cols-2">
            <div className="bg-orange-900 p-4 rounded-lg">
              <h4 className="font-semibold">Skills</h4>
              {npc.stats && npc.stats.length > 0 ? (
                <div className="mt-2 text-sm space-y-3">
                  {npc.stats.map((s) => (
                    s.skills && Object.keys(s.skills).length > 0 && (
                      <div key={s.name}>
                        <div className="text-xs text-orange-400 mb-1">{s.name}</div>
                        <div className="grid grid-cols-1 gap-1">
                          {Object.entries(s.skills).map(([skillName, skillValue]) => (
                            <div key={skillName} className="flex justify-between bg-orange-800/50 px-2 py-1 rounded">
                              <span>{skillName}</span>
                              <span className="font-medium">{skillValue >= 0 ? `+${skillValue}` : skillValue}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )
                  ))}
                </div>
              ) : (
                <div className="mt-2 text-sm text-orange-400">No skills available.</div>
              )}
            </div>

            <div className="bg-orange-900 p-4 rounded-lg">
              <h4 className="font-semibold">Equipment</h4>
              {npc.equipment && npc.equipment.length > 0 ? (
                <ul className="list-disc list-inside mt-2 text-sm">
                  {npc.equipment.map((it, idx) => (
                    <li key={idx}>{it}</li>
                  ))}
                </ul>
              ) : (
                <div className="mt-2 text-sm text-orange-400">No equipment listed.</div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  )
}