import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function QuestEdit() {
  // Navigation
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string; questId?: string }>();
  const { campaignId } = params;

  // Basic info
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [status, setStatus] = useState<"pending" | "in_progress" | "completed">(
    "pending",
  );
  const [locationId, setLocationId] = useState<string>("");
  const [location, setLocation] = useState<{ id: string; name: string } | null>(
    null,
  );
  const [npcs, setNpcs] = useState<Array<{ id: string; name: string }>>([]);
  const [availableLocations, setAvailableLocations] = useState<
    { id: string; name: string }[]
  >([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load quest data
  useEffect(() => {
    const campaignId = params.campaignId;
    const questId = params.questId;

    if (!campaignId || !questId) {
      alert("Missing campaign or quest id");
      navigate(-1);
      return;
    }

    // Load quest data
    fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((campaign) => {
        // Find quest in missions
        const quest = Array.isArray(campaign.missions)
          ? campaign.missions.find((m: any) => m.id === questId)
          : null;

        if (!quest) throw new Error("Quest not found");

        setTitle(quest.title ?? "");
        setDescription(quest.description ?? "");
        setStatus(quest.status ?? "pending");
        setLocationId(quest.locationId ?? "");
        setNpcs(quest.npcs ?? []);

        // Load locations
        const locs = Array.isArray(campaign.locations)
          ? campaign.locations.map((l: { id: string; name: string }) => ({
              id: l.id,
              name: l.name ?? String(l.id),
            }))
          : [];
        setAvailableLocations(locs);

        // Set current location if it exists
        if (quest.locationId) {
          const loc = locs.find(
            (l: { id: string; name: string }) => l.id === quest.locationId,
          );
          if (loc) setLocation(loc);
        }
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load quest", e);
        alert("Failed to load quest");
        navigate(-1);
      });
  }, [params.campaignId, params.questId, navigate]);

  const saveQuest = () => {
    if (title.trim() === "") {
      alert("Quest title cannot be empty.");
      return;
    }

    const campaignId = params.campaignId;
    const questId = params.questId;

    if (!campaignId || !questId) {
      alert("Missing campaign or quest id");
      return;
    }

    fetch(
      `http://localhost:3000/api/campaigns/${campaignId}/missions/${questId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, description, status, locationId }),
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update quest");
        }
        return res.json();
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/Quests/${questId}`);
      })
      .catch((e) => {
        console.error("Failed to update quest", e);
        alert("Failed to update quest");
      });
  };

  const deleteQuest = () => {
    if (!window.confirm("Are you sure you want to delete this quest?")) return;

    const campaignId = params.campaignId;
    const questId = params.questId;

    if (!campaignId || !questId) {
      alert("Missing campaign or quest id");
      return;
    }

    fetch(
      `http://localhost:3000/api/campaigns/${campaignId}/missions/${questId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to delete quest");
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/QuestView`);
      })
      .catch((e) => {
        console.error("Failed to delete quest", e);
        alert("Failed to delete quest");
      });
  };

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  const inputGameplayInformation = `bg-orange-900/80 w-full rounded-md border border-orange-700 text-orange-50 px-3 py-2`;
  const subTitleGameplayInformation = `text-orange-200 py-2 font-semibold`;

  const introData = {
    currentSection: "Quest Section",
    urlName: "QuestView",
  };

  return (
    <div className="pt-6">
      <div className="w-full">
        <div className="grid grid-cols-8">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className="pb-4">
              <p className="text-orange-200 text-sm ">
                <NavLink
                  to="/campaigns"
                  className="cursor-pointer hover:text-orange-400"
                >
                  Campaigns
                </NavLink>
                <span> / </span>
                <NavLink
                  to={`/InCampaign/${campaignId}/${introData.urlName}`}
                  className="cursor-pointer hover:text-orange-400"
                >
                  {introData.urlName}
                </NavLink>
                <span> / </span>
                <NavLink
                  to="#"
                  className="cursor-pointer hover:text-orange-400"
                >
                  {" "}
                  Edit
                </NavLink>
              </p>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold mb-6 text-white">Edit Quest</h1>
              <div className="flex gap-2">
                <button
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={deleteQuest}
                >
                  Delete
                </button>
                <button
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={saveQuest}
                >
                  Save Quest
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className={subTitleGameplayInformation}>Title</div>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className={inputGameplayInformation}
              placeholder="Quest title"
            />
            <div className={subTitleGameplayInformation}>Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputGameplayInformation} h-64`}
              placeholder="Quest description"
            />
            <div className={subTitleGameplayInformation}>Status</div>
            <select
              value={status}
              onChange={(e) =>
                setStatus(
                  e.target.value as "pending" | "in_progress" | "completed",
                )
              }
              className={inputGameplayInformation}
            >
              <option value="pending">Pending</option>
              <option value="in_progress">In Progress</option>
              <option value="completed">Completed</option>
            </select>
            <div className={subTitleGameplayInformation}>Location</div>
            <select
              value={locationId}
              onChange={(e) => setLocationId(e.target.value)}
              className={inputGameplayInformation}
            >
              <option value="">Select a location...</option>
              {availableLocations.map((loc) => (
                <option key={loc.id} value={loc.id}>
                  {loc.name}
                </option>
              ))}
            </select>

            {/* Location Section */}
            {location && (
              <div className="mt-8">
                <h2 className="text-2xl font-bold text-white mb-4">Location</h2>
                <NavLink
                  to={`/InCampaign/${campaignId}/Locations/${location.id}`}
                  className="block bg-orange-800/50 p-3 rounded hover:bg-orange-700/50 transition text-orange-100 hover:text-white"
                >
                  {location.name}
                </NavLink>
              </div>
            )}

            {/* NPCs Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">NPCs</h2>
                <NavLink
                  to={`/InCampaign/${campaignId}/NpcNew`}
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                >
                  Add NPC
                </NavLink>
              </div>
              {npcs.length === 0 ? (
                <p className="text-orange-300">No NPCs in this quest.</p>
              ) : (
                <div className="space-y-2">
                  {npcs.map((npc) => (
                    <NavLink
                      key={npc.id}
                      to={`/InCampaign/${campaignId}/Npcs/${npc.id}`}
                      className="block bg-orange-800/50 p-3 rounded hover:bg-orange-700/50 transition text-orange-100 hover:text-white"
                    >
                      {npc.name}
                    </NavLink>
                  ))}
                </div>
              )}
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
