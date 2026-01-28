import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

const sectionData = {
  name: "Location",
};

type ItemSection = {
  id: string;
  campaignId?: string | number;
  name: string;
  color: string;
  description?: string;
  npcs: string[];
  npcId?: number[];
  quests: string[];
  questId?: number[];
};

// Fetch locations from backend instead of sessionStorage
async function fetchLocations(
  campaignId: string | undefined,
): Promise<ItemSection[]> {
  if (!campaignId) return [];
  try {
    const res = await fetch(
      `http://localhost:3000/api/campaigns/${campaignId}/locations`,
      { credentials: "include" },
    );
    if (!res.ok) return [];
    const data = await res.json();
    if (!Array.isArray(data)) return [];
    return data.map((p: any) => ({
      id: String(p.id ?? Date.now()),
      campaignId: p.campaignId ?? campaignId,
      name: p.name ?? p.title ?? String(p.id ?? ""),
      color: p.color ?? "bg-slate-400",
      description: p.description ?? p.desc ?? "",
      // map missions returned from backend to quests list (use title)
      quests: Array.isArray(p.missions)
        ? p.missions.map((m: any) => m.title ?? m.name ?? String(m.id ?? ""))
        : Array.isArray(p.quests)
          ? p.quests
          : Array.isArray(p.quest)
            ? p.quest
            : [],
      questId: Array.isArray(p.missions)
        ? p.missions.map((m: any) => String(m.id))
        : Array.isArray(p.questId)
          ? p.questId.map(String)
          : p.questId
            ? [String(p.questId)]
            : [],
      // map NPC objects to names
      npcs: Array.isArray(p.npcs)
        ? p.npcs.map((n: any) =>
            typeof n === "string" ? n : (n?.name ?? String(n?.id ?? "")),
          )
        : Array.isArray(p.npc)
          ? p.npc
          : [],
      npcId: Array.isArray(p.npcId)
        ? p.npcId.map(String)
        : p.npcId
          ? [String(p.npcId)]
          : [],
    }));
  } catch (e) {
    return [];
  }
}

export default function LocationPage() {
  const { locationId } = useParams<{
    locationId?: string;
    campaignId?: string;
  }>();
  const navigate = useNavigate();
  const [locations, setLocations] = useState<ItemSection[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  useEffect(() => {
    const campaignId = window.location.pathname.split("/")[2] || null;
    if (!campaignId) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetchLocations(campaignId ?? undefined)
      .then(setLocations)
      .catch(() => setLocations([]))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  const loc = locations.find((i) => String(i.id) === String(locationId));

  if (!loc) {
    return (
      <div className="p-6">
        <p>{sectionData.name} not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">
          Go back
        </button>
      </div>
    );
  }

  const introData = {
    currentSection: "Location Section",
    urlName: "LocationView",
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
              to={`/InCampaign/${loc?.campaignId}/${introData.urlName}`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              {introData.currentSection}
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{loc.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-emerald-500 to-green-700 flex items-center justify-center text-3xl shadow-lg">
                🏰
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-1">
                  {loc.name}
                </h1>
                <p className="text-orange-200 text-sm">
                  Location • Campaign {loc.campaignId}
                </p>
              </div>
            </div>
            <NavLink
              to={`/InCampaign/${loc?.campaignId}/Locations/${loc.id}/Edit`}
            >
              <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer transition transform hover:scale-105 shadow-lg">
                ✏️ Edit
              </button>
            </NavLink>
          </div>
        </div>

        {/* Description Card */}
        <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 mb-8 border border-orange-600 shadow-xl">
          <h2 className="text-lg font-semibold text-orange-200 mb-3 flex items-center gap-2">
            <span className="text-xl">📖</span> Description
          </h2>
          <p className="text-orange-50 leading-relaxed whitespace-pre-wrap text-base">
            {loc.description || "No description provided."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* NPCs Card */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 border border-orange-600 shadow-xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> NPCs (
              {(loc.npcs ?? []).length})
            </h3>
            {(loc.npcs ?? []).length === 0 ? (
              <p className="text-orange-200 italic">
                No characters in this location
              </p>
            ) : (
              <ul className="space-y-2">
                {(loc.npcs ?? []).map((npc, index) => (
                  <NavLink
                    key={index}
                    to={`/InCampaign/${loc?.campaignId}/Npcs/${loc.npcId?.[index] ?? ""}`}
                  >
                    <li className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition cursor-pointer">
                      ⚔️ {npc}
                    </li>
                  </NavLink>
                ))}
              </ul>
            )}
          </div>

          {/* Quests Card */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 border border-orange-600 shadow-xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">⚡</span> Quests (
              {(loc.quests ?? []).length})
            </h3>
            {(loc.quests ?? []).length === 0 ? (
              <p className="text-orange-200 italic">
                No quests at this location
              </p>
            ) : (
              <ul className="space-y-2">
                {(loc.quests ?? []).map((quest, index) => (
                  <NavLink
                    key={index}
                    to={`/InCampaign/${loc?.campaignId}/Quests/${loc.questId?.[index] ?? ""}`}
                  >
                    <li className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition cursor-pointer">
                      📜 {quest}
                    </li>
                  </NavLink>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
