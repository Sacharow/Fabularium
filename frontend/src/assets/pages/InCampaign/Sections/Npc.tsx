import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

type Stat = {
  name: string;
  value: number;
  modifier: number;
  skills?: Record<string, number>;
};

type NpcSection = {
  id: number;
  campaignId?: string | number;
  name: string;
  color: string;
  description?: string;
  npcRace?: string;
  alignment?: string;
  age?: number | string;
  height?: number | string;
  weight?: number | string;
  crRating?: number;
  profBonus?: number;
  characterClass?: string;
  characterSubclass?: string;
  stats?: Stat[];
  skillProf?: Record<string, number>;
  equipment?: string[];
  initiativeBonus?: number;
  hitDice?: number;
  hitPointsMax?: number;
  armorClass?: number;
  passivePerception?: number;
  locations?: Array<{ id: string; name: string }>;
};

export default function NpcPage() {
  const { npcId, campaignId } = useParams<{
    npcId?: string;
    campaignId?: string;
  }>();
  const navigate = useNavigate();
  const [npc, setNpc] = useState<NpcSection | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [missions, setMissions] = useState<any[]>([]);

  useEffect(() => {
    if (!campaignId || !npcId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs/${npcId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch NPC");
        // Spróbuj sparsować JSON, jeśli nie wyjdzie, zgłoś czytelny błąd
        try {
          return await res.json();
        } catch (err) {
          const text = await res.text();
          throw new Error("Invalid JSON from backend: " + text);
        }
      })
      .then((data) => setNpc(data))
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [campaignId, npcId]);

  // fetch campaign missions so we can show quests linked to this NPC
  useEffect(() => {
    if (!campaignId) return;
    fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((data) => {
        setMissions(Array.isArray(data.missions) ? data.missions : []);
      })
      .catch(() => setMissions([]));
  }, [campaignId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error || !npc) {
    return (
      <div className="p-6">
        <p>{error || "NPC not found."}</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">
          Go back
        </button>
      </div>
    );
  }

  const introData = {
    currentSection: "NPC Section",
    urlName: "NpcView",
  };

  return (
    <div className="p-6">
      <div className="pb-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-200 text-sm font-medium">
            <NavLink
              to="/campaigns"
              className="cursor-pointer hover:text-orange-400 transition"
            >
              Campaigns
            </NavLink>
            <span className="mx-2">→</span>
            <NavLink
              to={`/InCampaign/${npc.campaignId}/${introData.urlName}`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              {introData.currentSection}
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{npc.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-orange-600 shadow-xl h-fit">
          <div className="flex items-center space-x-4 mb-4">
            <div
              className={`w-16 h-16 rounded-lg bg-gradient-to-br from-purple-600 to-purple-950 shadow-lg`}
            />
            <div>
              <h2 className="text-xl font-bold text-white">{npc.name}</h2>
              <p className="text-sm text-orange-200 font-semibold">
                CR {npc.crRating ?? "—"}
              </p>
              <p className="text-sm text-orange-100">
                {npc.characterClass ?? "Unknown"}
              </p>
            </div>
          </div>

          <NavLink
            to={`/InCampaign/${npc.campaignId}/Npcs/${npc.id}/Edit`}
            className="block mb-4"
          >
            <button className="w-full bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer transition transform hover:scale-105 shadow-lg">
              ✏️ Edit
            </button>
          </NavLink>

          {npc.description && (
            <p className="text-sm text-orange-100 mb-4 leading-relaxed">
              {npc.description}
            </p>
          )}

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-orange-700/50 p-3 rounded-lg border border-orange-500">
              <div className="text-xs text-orange-200 mb-1">CR Rating</div>
              <div className="font-bold text-lg text-orange-100">
                {npc.crRating ?? "—"}
              </div>
            </div>
            <div className="bg-orange-700/50 p-3 rounded-lg border border-orange-500">
              <div className="text-xs text-orange-200 mb-1">Prof. Bonus</div>
              <div className="font-bold text-lg text-orange-100">
                {(npc.profBonus ?? "-") === "-"
                  ? "-"
                  : npc.profBonus! >= 0
                    ? `+${npc.profBonus}`
                    : `${npc.profBonus}`}
              </div>
            </div>
            <div className="bg-orange-700/50 p-3 rounded-lg border border-orange-500">
              <div className="text-xs text-orange-200 mb-1">AC</div>
              <div className="font-bold text-lg text-orange-100">
                {npc.armorClass ?? "—"}
              </div>
            </div>
            <div className="bg-orange-700/50 p-3 rounded-lg border border-orange-500">
              <div className="text-xs text-orange-200 mb-1">Initiative</div>
              <div className="font-bold text-lg text-orange-100">
                {(npc.initiativeBonus ?? "-") === "-"
                  ? "-"
                  : npc.initiativeBonus! >= 0
                    ? `+${npc.initiativeBonus}`
                    : `${npc.initiativeBonus}`}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-orange-700/50 p-4 rounded-lg border border-orange-500 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-orange-200">❤️ HP</span>
              <span className="font-bold text-orange-100">
                {npc.hitPointsMax ?? "—"}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-orange-200">🎲 Hit Dice</span>
              <span className="font-bold text-orange-100">
                {npc.hitDice ? `D${npc.hitDice}` : "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-200">👁️ Perception</span>
              <span className="font-bold text-orange-100">
                {npc.passivePerception ?? "—"}
              </span>
            </div>
          </div>

          {(npc.age || npc.height || npc.weight || npc.alignment) && (
            <div className="mt-4 bg-orange-700/50 p-4 rounded-lg border border-orange-500 text-sm">
              <div className="text-sm text-orange-100 font-semibold mb-2">
                👤 Physical
              </div>
              <div className="space-y-1">
                {npc.age && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Age</span>
                    <span className="font-bold text-orange-100">{npc.age}</span>
                  </div>
                )}
                {npc.height && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Height</span>
                    <span className="font-bold text-orange-100">
                      {npc.height} cm
                    </span>
                  </div>
                )}
                {npc.weight && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Weight</span>
                    <span className="font-bold text-orange-100">
                      {npc.weight} kg
                    </span>
                  </div>
                )}
                {npc.alignment && (
                  <div className="flex justify-between">
                    <span className="text-orange-200">Alignment</span>
                    <span className="font-bold text-orange-100">
                      {npc.alignment}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Stats Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-orange-600 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-100 flex items-center gap-2">
                <span className="text-xl">🎲</span> Ability Scores
              </h3>
              <div className="text-sm text-orange-200">{"Unknown Race"}</div>
            </div>

            {npc.stats && npc.stats.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {npc.stats.map((s) => (
                  <div
                    key={s.name}
                    className="bg-orange-700/50 p-4 rounded-lg border border-orange-500 text-center hover:bg-orange-700 transition"
                  >
                    <div className="text-xs text-orange-200 mb-1 font-semibold">
                      {s.name}
                    </div>
                    <div className="text-3xl font-bold text-orange-100">
                      {s.value}
                    </div>
                    <div className="text-sm text-orange-200 mt-1">
                      {s.modifier >= 0 ? `+${s.modifier}` : s.modifier}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-orange-200">No stats available.</div>
            )}
          </div>

          {/* Skills & Equipment Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-orange-600 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> Skills
              </h4>
              {npc.stats && npc.stats.length > 0 ? (
                <div className="space-y-3">
                  {npc.stats.map(
                    (s) =>
                      s.skills &&
                      Object.keys(s.skills).length > 0 && (
                        <div key={s.name}>
                          <div className="text-xs text-orange-200 mb-1 font-semibold">
                            {s.name}
                          </div>
                          <div className="space-y-1">
                            {Object.entries(s.skills).map(
                              ([skillName, skillValue]) => (
                                <div
                                  key={skillName}
                                  className="bg-orange-700/50 px-3 py-1 rounded border border-orange-500 flex justify-between text-sm hover:bg-orange-700 transition"
                                >
                                  <span className="text-orange-50">
                                    {skillName}
                                  </span>
                                  <span className="font-bold text-orange-100">
                                    {skillValue >= 0
                                      ? `+${skillValue}`
                                      : skillValue}
                                  </span>
                                </div>
                              ),
                            )}
                          </div>
                        </div>
                      ),
                  )}
                </div>
              ) : (
                <div className="text-sm text-orange-200">
                  No skills available.
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-orange-600 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
                <span className="text-xl">⚔️</span> Equipment
              </h4>
              {npc.equipment && npc.equipment.length > 0 ? (
                <div className="space-y-2">
                  {npc.equipment.map((it, idx) => (
                    <div
                      key={idx}
                      className="bg-orange-700/50 px-4 py-2 rounded-lg border border-orange-500 text-orange-50 hover:bg-orange-700 transition"
                    >
                      • {it}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-orange-200">
                  No equipment listed.
                </div>
              )}
            </div>
          </div>
          {/* Linked Locations & Quests */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-orange-600 shadow-xl">
            <h4 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-xl">🔗</span> Linked Locations & Quests
            </h4>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <div className="text-sm text-orange-200 font-semibold mb-2">
                  Locations
                </div>
                {npc.locations && npc.locations.length > 0 ? (
                  <ul className="space-y-2">
                    {npc.locations.map((loc: any) => (
                      <NavLink
                        key={loc.id}
                        to={`/InCampaign/${npc?.campaignId}/Locations/${loc.id}`}
                      >
                        <li className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition cursor-pointer">
                          🏰 {loc.name}
                        </li>
                      </NavLink>
                    ))}
                  </ul>
                ) : (
                  <div className="text-sm text-orange-200 italic">
                    No linked locations
                  </div>
                )}
              </div>

              <div>
                <div className="text-sm text-orange-200 font-semibold mb-2">
                  Quests
                </div>
                {missions && missions.length > 0 ? (
                  (() => {
                    const npcLocIds = (npc.locations || []).map((l: any) =>
                      String(l.id),
                    );
                    const related = missions.filter((m: any) => {
                      // mission linked by location
                      if (
                        m.locationId &&
                        npcLocIds.includes(String(m.locationId))
                      )
                        return true;
                      // mission might contain npcId or npcId array
                      if (
                        m.npcId &&
                        (Array.isArray(m.npcId)
                          ? m.npcId.map(String).includes(String(npc.id))
                          : String(m.npcId) === String(npc.id))
                      )
                        return true;
                      // mission might contain nested npc objects
                      if (
                        Array.isArray(m.npcs) &&
                        m.npcs.some(
                          (n: any) => String(n.id || n) === String(npc.id),
                        )
                      )
                        return true;
                      return false;
                    });
                    if (related.length === 0)
                      return (
                        <div className="text-sm text-orange-200 italic">
                          No linked quests
                        </div>
                      );
                    return (
                      <ul className="space-y-2">
                        {related.map((q: any) => (
                          <NavLink
                            key={q.id}
                            to={`/InCampaign/${npc?.campaignId}/Quests/${q.id}`}
                          >
                            <li className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition cursor-pointer">
                              ⚡ {q.title ?? q.name}
                            </li>
                          </NavLink>
                        ))}
                      </ul>
                    );
                  })()
                ) : (
                  <div className="text-sm text-orange-200 italic">
                    No linked quests
                  </div>
                )}
              </div>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
