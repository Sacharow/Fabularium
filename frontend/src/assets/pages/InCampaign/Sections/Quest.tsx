import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

const sectionData = {
  name: "Quest",
};

type ItemSection = {
  id: string;
  campaignId?: string;
  name: string;
  description?: string;
  locations: string[];
  locationId?: string[];
  npcs: string[];
  npcId?: string[];
  rewards: string[];
};

export default function QuestPage() {
  const { questId, campaignId } = useParams<{
    questId?: string;
    campaignId?: string;
  }>();
  const navigate = useNavigate();
  const [quests, setQuests] = useState<ItemSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cid = campaignId;
    if (!cid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:3000/api/campaigns/${cid}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((data) => {
        const ms = Array.isArray(data.missions)
          ? data.missions.map((m: any) => {
              // name/title
              const name = m.title ?? m.name ?? "";
              const description = m.description ?? "";

              // locations: try to resolve related location name(s)
              let locations: string[] = [];
              if (m.location && typeof m.location === "object")
                locations = [m.location.name ?? String(m.location.id ?? "")];
              else if (Array.isArray(m.locations))
                locations = m.locations.map((l: any) =>
                  typeof l === "string" ? l : (l?.name ?? String(l?.id ?? "")),
                );

              // npcs: try to resolve names
              let npcs: string[] = [];
              if (Array.isArray(m.npcs))
                npcs = m.npcs.map((n: any) =>
                  typeof n === "string" ? n : (n?.name ?? String(n?.id ?? "")),
                );

              // rewards: accept array of strings
              const rewards: string[] = Array.isArray(m.rewards)
                ? m.rewards.map((r: any) => String(r))
                : [];

              return {
                id: String(m.id),
                campaignId: cid,
                name,
                description,
                locations,
                locationId: m.locationId
                  ? [String(m.locationId)]
                  : Array.isArray(m.locationId)
                    ? m.locationId.map(String)
                    : [],
                npcs,
                npcId: Array.isArray(m.npcId)
                  ? m.npcId.map(String)
                  : m.npcId
                    ? [String(m.npcId)]
                    : [],
                rewards,
              } as ItemSection;
            })
          : [];
        setQuests(ms);
      })
      .catch((e) => {
        console.error("Failed to load missions", e);
      })
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <div className="p-6">Loading...</div>;

  const quest = quests.find((i) => String(i.id) === String(questId));

  if (!quest) {
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
    currentSection: "Quest Section",
    urlName: "QuestView",
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
              to={`/InCampaign/${quest?.campaignId}/${introData.urlName}`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              {introData.currentSection}
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{quest.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-amber-500 to-orange-700 flex items-center justify-center text-3xl shadow-lg">
                ⚡
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-1">
                  {quest.name}
                </h1>
                <p className="text-orange-200 text-sm">
                  Quest • Campaign {quest.campaignId}
                </p>
              </div>
            </div>
            <NavLink
              to={`/InCampaign/${quest?.campaignId}/Quests/${quest.id}/Edit`}
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
            {quest.description || "No description provided."}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Characters Card */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 border border-orange-600 shadow-xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">👤</span> Characters (
              {quest.npcs.length})
            </h3>
            {quest.npcs.length === 0 ? (
              <p className="text-orange-200 italic">No characters involved</p>
            ) : (
              <ul className="space-y-2">
                {quest.npcs.map((npc, index) => (
                  <NavLink
                    key={index}
                    to={`/InCampaign/${quest?.campaignId}/Npcs/${quest.npcId?.[index] ?? ""}`}
                  >
                    <li className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition cursor-pointer">
                      ⚔️ {npc}
                    </li>
                  </NavLink>
                ))}
              </ul>
            )}
          </div>

          {/* Locations Card */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 border border-orange-600 shadow-xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">🗺️</span> Locations (
              {quest.locations.length})
            </h3>
            {quest.locations.length === 0 ? (
              <p className="text-orange-200 italic">No locations specified</p>
            ) : (
              <ul className="space-y-2">
                {quest.locations.map((location, index) => (
                  <NavLink
                    key={index}
                    to={`/InCampaign/${quest?.campaignId}/Locations/${quest.locationId?.[index] ?? ""}`}
                  >
                    <li className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition cursor-pointer">
                      🏰 {location}
                    </li>
                  </NavLink>
                ))}
              </ul>
            )}
          </div>

          {/* Rewards Card */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 border border-orange-600 shadow-xl hover:shadow-2xl transition">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-2xl">💎</span> Rewards (
              {quest.rewards.length})
            </h3>
            {quest.rewards.length === 0 ? (
              <p className="text-orange-200 italic">No rewards specified</p>
            ) : (
              <ul className="space-y-2">
                {quest.rewards.map((reward, index) => (
                  <li
                    key={index}
                    className="bg-orange-700/50 px-4 py-2 rounded-lg text-orange-50 border border-orange-500 hover:bg-orange-700 transition"
                  >
                    ⭐ {reward}
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
