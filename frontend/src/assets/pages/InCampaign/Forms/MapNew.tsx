import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState } from "react";

export default function MapNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>()

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    // Sidebar tab selection: 'all' shows all sections, otherwise only selected
    const [selectedView, setSelectedView] = useState<string>('all');

    const saveMap = () => {

        if (name.trim() === "") {
            alert("Map name cannot be empty.");
            return;
        }
        else {
            const STORAGE_KEY = "fabularium.campaigns.map_section"
            function rand<T>(arr: T[]) {
                return arr[Math.floor(Math.random() * arr.length)]
            }

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
                ]
                return rand(colors)
            }

            const id = Date.now()
            const campaignId = params.campaignId ?? null

            const mapData = {
                id,
                campaignId,
                name,
                color: generateColor(),
                description,
            };

            try {
                const raw = sessionStorage.getItem(STORAGE_KEY)
                const parsed = raw ? JSON.parse(raw) : []
                const list = Array.isArray(parsed) ? parsed : []
                list.push(mapData)
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
                // Notify other components in-window that maps changed
                try { window.dispatchEvent(new Event('fabularium.maps.updated')) } catch (e) { /* ignore */ }
                // navigate to the created map's page
                if (campaignId) navigate(`/InCampaign/${campaignId}/Maps/${id}`)
                else navigate(-1)
            } catch (e) {
                console.error('Failed to save location to sessionStorage', e)
            }
        }
    }
    
    // UI helper classes
    const inputGameplayInformation = `bg-black/80 w-full rounded-md`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;
    const { campaignId } = useParams<{ campaignId?: string }>();

    const introData = {
        currentSection: "Map Section",
        urlName: "MapView"
    };

    return (
        <div className="pt-6">
            <div className="w-full">
                <div className="grid grid-cols-8">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm ">
                                <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
                                <span> / </span>
                                <NavLink to={`/InCampaign/${campaignId}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.urlName}</NavLink>
                                <span> / </span>
                                <NavLink to="#" className="cursor-pointer hover:text-gray-400"> New</NavLink>
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-6">Create New Map</h1>
                            <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => saveMap()}>
                                Save Map
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2"></div>
                </div>
                <div className="grid grid-cols-8 gap-6">
                    <div className="relative col-span-2">
                        <div className="sticky top-24 px-4">
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <button onClick={() => setSelectedView('all')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'all' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            All
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('basic')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'basic' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Basic
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('map')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'map' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Map
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col-span-4 w-full flex justify-center p-2">
                        <div className="flex flex-col gap-8 w-full">
                            {(selectedView === 'all' || selectedView === 'basic') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Basic Information</h1>
                                    <p className={subTitleGameplayInformation}>Map's Name</p>
                                    <div className={inputGameplayInformation}>
                                        <input
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                            placeholder="Name"
                                            minLength={1}
                                            maxLength={60}
                                            value={name}
                                            required
                                            onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <p className={subTitleGameplayInformation}>Map's Description</p>
                                    <div className={inputGameplayInformation}>
                                        <textarea
                                            className="border-2 border-orange-700 rounded py-1 px-2 h-32 w-full align-top bg-black text-white"
                                            placeholder="Description"
                                            maxLength={200}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                </div>
                            )}
                            {(selectedView === 'all' || selectedView === 'map') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Image</h1>
                                    <p className={subTitleGameplayInformation}>Map's Image</p>
                                    <div className="bg-orange-700/30 rounded-md p-4 flex flex-col items-center">    
                                        <div className="border-2 border-orange-700 border-dashed w-3/5 h-48 flex flex-col justify-center hover:border-orange-500">
                                            <p className="text-gray-400 text-center p-2">Click <span className="text-white font-bold hover:underline cursor-pointer">here</span> to upload image</p>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 w-full p-2">
                    </div>
                </div>
            </div>
        </div >
    );
}