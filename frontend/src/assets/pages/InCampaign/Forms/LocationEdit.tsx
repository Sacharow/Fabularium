import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LocationEdit() {
  // Navigation
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string; locationId?: string }>();
  const { campaignId } = params;

  // Basic info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [npcs, setNpcs] = useState<Array<{ id: string; name: string }>>([]);
  const [quests, setQuests] = useState<Array<{ id: string; name: string }>>([]);
  const [loading, setLoading] = useState<boolean>(true);

  // Load location data
  useEffect(() => {
    const campaignId = params.campaignId;
    const locationId = params.locationId;

    if (!campaignId || !locationId) {
      alert("Missing campaign or location id");
      navigate(-1);
      return;
    }

    fetch(
      `http://localhost:3000/api/campaigns/${campaignId}/locations/${locationId}`,
      {
        credentials: "include",
      },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch location");
        return res.json();
      })
      .then((data) => {
        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setNpcs(data.npcs ?? []);
        setQuests(data.missions ?? []);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load location", e);
        alert("Failed to load location");
        navigate(-1);
      });
  }, [params.campaignId, params.locationId, navigate]);

  const saveLocation = () => {
    if (name.trim() === "") {
      alert("Location name cannot be empty.");
      return;
    }

    const campaignId = params.campaignId;
    const locationId = params.locationId;

    if (!campaignId || !locationId) {
      alert("Missing campaign or location id");
      return;
    }

    fetch(
      `http://localhost:3000/api/campaigns/${campaignId}/locations/${locationId}`,
      {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, description }),
      },
    )
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update location");
        }
        return res.json();
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/Locations/${locationId}`);
      })
      .catch((e) => {
        console.error("Failed to update location", e);
        alert("Failed to update location");
      });
  };

  const deleteLocation = () => {
    if (!window.confirm("Are you sure you want to delete this location?"))
      return;

    const campaignId = params.campaignId;
    const locationId = params.locationId;

    if (!campaignId || !locationId) {
      alert("Missing campaign or location id");
      return;
    }

    fetch(
      `http://localhost:3000/api/campaigns/${campaignId}/locations/${locationId}`,
      {
        method: "DELETE",
        credentials: "include",
      },
    )
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to delete location");
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/LocationView`);
      })
      .catch((e) => {
        console.error("Failed to delete location", e);
        alert("Failed to delete location");
      });
  };

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  const inputGameplayInformation = `bg-orange-900/80 w-full rounded-md border border-orange-700 text-orange-50 px-3 py-2`;
  const subTitleGameplayInformation = `text-orange-200 py-2 font-semibold`;

  const introData = {
    currentSection: "Location Section",
    urlName: "LocationView",
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
              <h1 className="text-4xl font-bold mb-6 text-white">
                Edit Location
              </h1>
              <div className="flex gap-2">
                <button
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={deleteLocation}
                >
                  Delete
                </button>
                <button
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={saveLocation}
                >
                  Save Location
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
              placeholder="Location name"
            />
            <div className={subTitleGameplayInformation}>Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputGameplayInformation} h-64`}
              placeholder="Location description"
            />

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
                <p className="text-orange-300">No NPCs in this location.</p>
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

            {/* Quests/Missions Section */}
            <div className="mt-8">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold text-white">Quests</h2>
                <NavLink
                  to={`/InCampaign/${campaignId}/QuestNew`}
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                >
                  Add Quest
                </NavLink>
              </div>
              {quests.length === 0 ? (
                <p className="text-orange-300">No quests in this location.</p>
              ) : (
                <div className="space-y-2">
                  {quests.map((quest) => (
                    <NavLink
                      key={quest.id}
                      to={`/InCampaign/${campaignId}/Quests/${quest.id}`}
                      className="block bg-orange-800/50 p-3 rounded hover:bg-orange-700/50 transition text-orange-100 hover:text-white"
                    >
                      {quest.name}
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
