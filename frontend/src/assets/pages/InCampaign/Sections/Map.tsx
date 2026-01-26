import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

type MapItem = {
    id: string;
    name: string;
    file?: string;
    description?: string;
};

export default function Map() {
    const { campaignId, mapId } = useParams<{ campaignId?: string; mapId?: string }>();
    const [map, setMap] = useState<MapItem | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!campaignId || !mapId) return;
        setLoading(true);
        setError(null);
        fetch(`http://localhost:3000/api/campaigns/${campaignId}/maps/${mapId}`, { credentials: 'include' })
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
                    setMap({ id: found.id, name: found.name, file: found.file, description: found.description });
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
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-2xl font-bold">{map.name}</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="md:col-span-2 bg-black rounded overflow-hidden">
                    {map.file ? (
                        <img src={map.file} alt={map.name} className="w-full h-[500px] object-contain bg-black" />
                    ) : (
                        <div className="w-full h-[500px] flex items-center justify-center text-gray-400">No image</div>
                    )}
                </div>
                <div className="p-4 bg-orange-700/20 rounded">
                    <h3 className="text-lg font-semibold">Details</h3>
                    <p className="mt-2 text-sm text-gray-200">{map.description || 'No description provided.'}</p>
                </div>
            </div>
        </div>
    );
}