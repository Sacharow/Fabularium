import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function GeneralEdit() {
  // Navigation
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string }>();

  // Basic info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Load campaign data
  useEffect(() => {
    const campaignId = params.campaignId;

    if (!campaignId) {
      alert("Missing campaign id");
      navigate(-1);
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((data) => {
        setName(data.name ?? "");
        setDescription(data.description ?? "");
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load campaign", e);
        alert("Failed to load campaign");
        navigate(-1);
      });
  }, [params.campaignId, navigate]);

  const saveCampaign = () => {
    if (name.trim() === "") {
      alert("Campaign name cannot be empty.");
      return;
    }

    const campaignId = params.campaignId;

    if (!campaignId) {
      alert("Missing campaign id");
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update campaign");
        }
        return res.json();
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}`);
      })
      .catch((e) => {
        console.error("Failed to update campaign", e);
        alert("Failed to update campaign");
      });
  };

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  const inputGameplayInformation = `bg-orange-900/80 w-full rounded-md border border-orange-700 text-orange-50 px-3 py-2`;
  const subTitleGameplayInformation = `text-orange-200 py-2 font-semibold`;

  const introData = {
    currentSection: "Campaign Overview",
    urlName: "GeneralView",
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
              <h1 className="text-4xl font-bold mb-6 text-white">
                Edit Campaign
              </h1>
              <button
                className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                onClick={saveCampaign}
              >
                Save Campaign
              </button>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className={subTitleGameplayInformation}>Campaign Name</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputGameplayInformation}
              placeholder="Campaign name"
            />
            <div className={subTitleGameplayInformation}>
              Campaign Description
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputGameplayInformation} h-64`}
              placeholder="Campaign description"
            />
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
