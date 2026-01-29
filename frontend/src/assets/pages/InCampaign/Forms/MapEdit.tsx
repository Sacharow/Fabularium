import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function MapEdit() {
  // Navigation
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string; mapId?: string }>();
  const { campaignId } = params;

  // Basic info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [fileData, setFileData] = useState<string | null>(null);
  const [fileName, setFileName] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files && e.target.files[0];
    if (!f) return;
    setFileName(f.name);
    const reader = new FileReader();
    reader.onload = () => {
      setFileData(String(reader.result));
    };
    reader.readAsDataURL(f);
  };

  // Load map data
  useEffect(() => {
    const campaignId = params.campaignId;
    const mapId = params.mapId;

    if (!campaignId || !mapId) {
      alert("Missing campaign or map id");
      navigate(-1);
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/maps/${mapId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch map");
        return res.json();
      })
      .then((data) => {
        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setFileData(data.file ?? null);
        setFileName(data.file ? "existing-map" : null);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load map", e);
        alert("Failed to load map");
        navigate(-1);
      });
  }, [params.campaignId, params.mapId, navigate]);

  const saveMap = () => {
    if (name.trim() === "") {
      alert("Map name cannot be empty.");
      return;
    }

    const campaignId = params.campaignId;
    const mapId = params.mapId;

    if (!campaignId || !mapId) {
      alert("Missing campaign or map id");
      return;
    }

    const payload = {
      name,
      description,
      file: fileData ?? "",
    };

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/maps/${mapId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update map");
        }
        return res.json();
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/Maps/${mapId}`);
      })
      .catch((e) => {
        console.error("Failed to update map", e);
        alert("Failed to update map");
      });
  };

  const deleteMap = () => {
    if (!window.confirm("Are you sure you want to delete this map?")) return;

    const campaignId = params.campaignId;
    const mapId = params.mapId;

    if (!campaignId || !mapId) {
      alert("Missing campaign or map id");
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/maps/${mapId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to delete map");
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/MapView`);
      })
      .catch((e) => {
        console.error("Failed to delete map", e);
        alert("Failed to delete map");
      });
  };

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  const inputGameplayInformation = `bg-orange-900/80 w-full rounded-md border border-orange-700 text-orange-50 px-3 py-2`;
  const subTitleGameplayInformation = `text-orange-200 py-2 font-semibold`;

  const introData = {
    currentSection: "Map Section",
    urlName: "MapView",
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
              <h1 className="text-4xl font-bold mb-6 text-white">Edit Map</h1>
              <div className="flex gap-2">
                <button
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={deleteMap}
                >
                  Delete
                </button>
                <button
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={saveMap}
                >
                  Save Map
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
              placeholder="Map name"
            />
            <div className={subTitleGameplayInformation}>Description</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputGameplayInformation} h-32`}
              placeholder="Map description"
            />
            <div className={subTitleGameplayInformation}>Map File</div>
            {fileName && (
              <div className="text-orange-200 text-sm mb-2">
                Current: {fileName}
              </div>
            )}
            <input
              type="file"
              onChange={handleFileChange}
              className={inputGameplayInformation}
              accept="image/*"
            />
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
