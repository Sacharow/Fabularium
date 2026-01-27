import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink, useParams, useMatch } from "react-router-dom";
import { useEffect, useState } from "react";

export default function MapView() {
    const params = useParams();
    const match = useMatch("/InCampaign/:campaignId/*");
    const campaignId = params.campaignId ?? match?.params.campaignId ?? null

    type Campaign = {
        id: string;
        name: string;
        description?: string;
        owner?: { id: string; name: string };
        createdAt?: string;
        updatedAt?: string;
    };

    type Map = {
        id: string;
        name: string;
        color: string;
        file?: string;
    }
    
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [items, setItems] = useState<Map[]>([]);
    
        useEffect(() => {
            if (!campaignId) return;
            setLoading(true);
            setError(null);
            fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
                credentials: 'include',
            })
                .then(async (res) => {
                    if (!res.ok) throw new Error('Failed to fetch campaign');
                    return res.json();
                })
                .then((data) => {
                        setCampaign(data);
                        // map colors are not stored on backend; generate display colors
                        function rand(arr:any[]) { return arr[Math.floor(Math.random() * arr.length)]; }
                        function generateColor() {
                            const colors = [
                                "bg-red-400",
                                "bg-blue-400",
                                "bg-emerald-400",
                                "bg-violet-400",
                                "bg-yellow-400",
                                "bg-slate-400",
                                "bg-pink-400",
                                "bg-amber-400",
                                "bg-cyan-400",
                                "bg-lime-400"
                            ];
                            return rand(colors);
                        }
                        setItems(Array.isArray(data.maps) ? data.maps.map((m:any) => ({ id: m.id, name: m.name, color: generateColor(), file: m.file })) : []);
                })
                .catch((err) => setError(err.message))
                .finally(() => setLoading(false));
        }, [campaignId]);


    const introData = {
        currentSection: "Map Section",
        urlName: "MapView"
    };

    if (loading) return <div className="pt-6 text-center">Loading campaign...</div>;
    if (error) return <div className="pt-6 text-center text-red-600">{error}</div>;

    return (
        <div className="pt-6">
            <ViewIntroduction campaignData={{
                id: campaign?.id || campaignId || '',
                name: campaign?.name || 'Campaign',
                dm: campaign?.owner?.name || 'DM',
            }} introData={introData} />
            <div className="w-full">
                <div className="grid grid-cols-8 gap-6">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold">{introData.currentSection}</h1>
                                <NavLink to={campaignId ? `/InCampaign/${campaignId}/${introData.urlName}/New` : '#'}>
                                    <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                        <p>Create New</p>
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="pt-6 px-6">
                            <div className="max-w-[1200px] mx-auto">
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {items.map((i) => (
                                        <NavLink key={i.id} to={`/InCampaign/${campaignId}/Maps/${i.id}`}>
                                            <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                <div className="h-full grid grid-rows-[80%_20%]">
                                                    {i.file ? (
                                                        <div className="flex items-center justify-center bg-black">
                                                            <img src={i.file} alt={i.name} className="w-full h-full object-cover" />
                                                        </div>
                                                    ) : (
                                                        <div className={`${i.color} flex items-center justify-center`}></div>
                                                    )}
                                                    <div className="bg-orange-700 flex items-center justify-center px-2">
                                                        <span className="text-sm font-medium text-gray-100 text-center truncate">{i.name}</span>
                                                    </div>
                                                </div>
                                            </button>
                                        </NavLink>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}