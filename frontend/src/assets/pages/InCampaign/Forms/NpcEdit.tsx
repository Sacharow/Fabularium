import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NpcEdit() {
  // Navigation
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string; npcId?: string }>();
  const { campaignId } = params;

  // Basic info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [locations, setLocations] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [quests, setQuests] = useState<Array<{ id: string; name: string }>>([]);
  const [availableLocations, setAvailableLocations] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [availableQuests, setAvailableQuests] = useState<
    Array<{ id: string; name: string }>
  >([]);
  const [selectedLocationId, setSelectedLocationId] = useState<string>("");
  const [selectedQuestId, setSelectedQuestId] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Load NPC data
  useEffect(() => {
    const campaignId = params.campaignId;
    const npcId = params.npcId;

    if (!campaignId || !npcId) {
      alert("Missing campaign or NPC id");
      navigate(-1);
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs/${npcId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch NPC");
        return res.json();
      })
      .then((data) => {
        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setLocations(data.locations ?? []);
        setQuests(data.quests ?? []);

        // Load campaign data to get available Locations and Quests
        return fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
          credentials: "include",
        });
      })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((campaign) => {
        const locList = Array.isArray(campaign.locations)
          ? campaign.locations.map((l: { id: string; name: string }) => ({
              id: l.id,
              name: l.name ?? String(l.id),
            }))
          : [];
        setAvailableLocations(locList);

        const questList = Array.isArray(campaign.missions)
          ? campaign.missions.map((q: { id: string; title: string }) => ({
              id: q.id,
              name: q.title ?? String(q.id),
            }))
          : [];
        setAvailableQuests(questList);

        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load NPC", e);
        alert("Failed to load NPC");
        navigate(-1);
      });
  }, [params.campaignId, params.npcId, navigate]);

  const saveNpc = () => {
    if (name.trim() === "") {
      alert("NPC name cannot be empty.");
      return;
    }

    const campaignId = params.campaignId;
    const npcId = params.npcId;

    if (!campaignId || !npcId) {
      alert("Missing campaign or NPC id");
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs/${npcId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update NPC");
        }
        return res.json();
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/Npcs/${npcId}`);
      })
      .catch((e) => {
        console.error("Failed to update NPC", e);
        alert("Failed to update NPC");
      });
  };

  const deleteNpc = () => {
    if (!window.confirm("Are you sure you want to delete this NPC?")) return;

    const campaignId = params.campaignId;
    const npcId = params.npcId;

    if (!campaignId || !npcId) {
      alert("Missing campaign or NPC id");
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs/${npcId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to delete NPC");
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/Npcs`);
      })
      .catch((e) => {
        console.error("Failed to delete NPC", e);
        alert("Failed to delete NPC");
      });
  };

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  const inputGameplayInformation = `bg-orange-900/80 w-full rounded-md border border-orange-700 text-orange-50 px-3 py-2`;
  const subTitleGameplayInformation = `text-orange-200 py-2 font-semibold`;

  const introData = {
    currentSection: "NPC Section",
    urlName: "NpcView",
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
                  to={`/InCampaign/${params.campaignId}/${introData.urlName}`}
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
              <h1 className="text-4xl font-bold mb-6 text-white">Edit NPC</h1>
              <div className="flex gap-2">
                <button
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={deleteNpc}
                >
                  Delete
                </button>
                <button
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={saveNpc}
                >
                  Save NPC
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className={subTitleGameplayInformation}>Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputGameplayInformation}
              placeholder="NPC name"
            />
            <div className={subTitleGameplayInformation}>Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputGameplayInformation} h-64`}
              placeholder="NPC description"
            />

            {/* Locations Section */}
            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-4">
                  Locations
                </h2>
                <select
                  value={selectedLocationId}
                  onChange={(e) => {
                    const locationId = e.target.value;
                    if (locationId) {
                      const locToAdd = availableLocations.find(
                        (l) => l.id === locationId,
                      );
                      if (
                        locToAdd &&
                        !locations.some((l) => l.id === locToAdd.id)
                      ) {
                        setLocations([...locations, locToAdd]);
                        setSelectedLocationId("");
                      }
                    }
                  }}
                  className={inputGameplayInformation}
                >
                  <option value="">Select Location to add...</option>
                  {availableLocations
                    .filter(
                      (location) =>
                        !locations.some((l) => l.id === location.id),
                    )
                    .map((location) => (
                      <option key={location.id} value={location.id}>
                        {location.name}
                      </option>
                    ))}
                </select>
              </div>
              {locations.length === 0 ? (
                <p className="text-orange-300">No locations for this NPC.</p>
              ) : (
                <div className="space-y-2">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="flex justify-between items-center bg-orange-800/50 p-3 rounded"
                    >
                      <NavLink
                        to={`/InCampaign/${campaignId}/Locations/${location.id}`}
                        className="text-orange-100 hover:text-white flex-1"
                      >
                        {location.name}
                      </NavLink>
                      <button
                        onClick={() =>
                          setLocations(
                            locations.filter((l) => l.id !== location.id),
                          )
                        }
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quests/Missions Section */}
            <div className="mt-8">
              <div className="mb-4">
                <h2 className="text-2xl font-bold text-white mb-4">Quests</h2>
                <select
                  value={selectedQuestId}
                  onChange={(e) => {
                    const questId = e.target.value;
                    if (questId) {
                      const questToAdd = availableQuests.find(
                        (q) => q.id === questId,
                      );
                      if (
                        questToAdd &&
                        !quests.some((q) => q.id === questToAdd.id)
                      ) {
                        setQuests([...quests, questToAdd]);
                        setSelectedQuestId("");
                      }
                    }
                  }}
                  className={inputGameplayInformation}
                >
                  <option value="">Select Quest to add...</option>
                  {availableQuests
                    .filter((quest) => !quests.some((q) => q.id === quest.id))
                    .map((quest) => (
                      <option key={quest.id} value={quest.id}>
                        {quest.name}
                      </option>
                    ))}
                </select>
              </div>
              {quests.length === 0 ? (
                <p className="text-orange-300">No quests for this NPC.</p>
              ) : (
                <div className="space-y-2">
                  {quests.map((quest) => (
                    <div
                      key={quest.id}
                      className="flex justify-between items-center bg-orange-800/50 p-3 rounded"
                    >
                      <NavLink
                        to={`/InCampaign/${campaignId}/Quests/${quest.id}`}
                        className="text-orange-100 hover:text-white flex-1"
                      >
                        {quest.name}
                      </NavLink>
                      <button
                        onClick={() =>
                          setQuests(quests.filter((q) => q.id !== quest.id))
                        }
                        className="text-red-400 hover:text-red-300 ml-2"
                      >
                        Remove
                      </button>
                    </div>
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
