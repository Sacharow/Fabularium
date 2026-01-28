import { useEffect, useState } from "react";
import { useParams, NavLink } from "react-router-dom";

type MapItem = {
  id: string;
  name: string;
  file?: string;
  description?: string;
};

export default function Map() {
  const { campaignId, mapId } = useParams<{
    campaignId?: string;
    mapId?: string;
  }>();
  const [map, setMap] = useState<MapItem | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!campaignId || !mapId) return;
    setLoading(true);
    setError(null);
    fetch(`http://localhost:3000/api/campaigns/${campaignId}/maps/${mapId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(`Failed to fetch map: ${res.status} ${txt}`);
        }
        return res.json();
      })
      .then((found) => {
        if (!found) {
          setMap(null);
        } else {
          setMap({
            id: found.id,
            name: found.name,
            file: found.file,
            description: found.description,
          });
        }
      })
      .catch((err) => setError(String(err)))
      .finally(() => setLoading(false));
  }, [campaignId, mapId]);

  if (!campaignId) return <div className="p-6">Campaign id missing</div>;
  if (!mapId) return <div className="p-6">Map id missing</div>;
  if (loading) return <div className="p-6">Loading map...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!map) return <div className="p-6">Map not found</div>;

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
              to={`/InCampaign/${campaignId}/MapView`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              Maps
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{map.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto">
        {/* Main Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-3xl shadow-lg">
                🗺️
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-1">
                  {map.name}
                </h1>
                <p className="text-orange-200 text-sm">Campaign Map</p>
              </div>
            </div>
            <NavLink to={`/InCampaign/${campaignId}/Maps/${mapId}/Edit`}>
              <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer transition transform hover:scale-105 shadow-lg">
                ✏️ Edit
              </button>
            </NavLink>
          </div>
        </div>

        {/* Map Display */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-black rounded-xl overflow-hidden shadow-2xl border border-orange-600">
            {map.file ? (
              <img
                src={map.file}
                alt={map.name}
                className="w-full h-[600px] object-contain bg-black"
              />
            ) : (
              <div className="w-full h-[600px] flex items-center justify-center text-gray-400 text-lg">
                📂 No map image uploaded
              </div>
            )}
          </div>

          {/* Details Sidebar */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-6 border border-orange-600 shadow-xl h-fit">
            <h3 className="text-lg font-semibold text-orange-100 mb-4 flex items-center gap-2">
              <span className="text-xl">📋</span> Details
            </h3>
            <p className="text-orange-50 leading-relaxed text-sm">
              {map.description || "No description provided."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
