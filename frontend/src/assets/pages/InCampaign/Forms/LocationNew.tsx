import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function LocationNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>()

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    // Relations
    const [selectedQuestIds, setSelectedQuestIds] = useState<string[]>([]);
    const [npcs, setNpcs] = useState<string[]>([]);
    const [npcsIds, setNpcsIds] = useState<string>("");
    const [availableQuests, setAvailableQuests] = useState<{ id: string; title: string }[]>([]);
    const [availableNpcs, setAvailableNpcs] = useState<string[]>([]);

    // Sidebar tab selection: 'all' shows all sections, otherwise only selected
    const [selectedView, setSelectedView] = useState<string>('all');

    const saveLocation = () => {

        if (name.trim() === "") {
            alert("Location name cannot be empty.");
            return;
        }
        else {
                    const campaignId = params.campaignId ?? null
                    if (!campaignId) {
                        alert('Campaign id missing');
                        return;
                    }
                    fetch(`http://localhost:3000/api/campaigns/${campaignId}/locations`, {
                        method: 'POST',
                        credentials: 'include',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({ name, description })
                    })
                        .then(async (res) => {
                            if (!res.ok) {
                                const txt = await res.text();
                                throw new Error(txt || 'Failed to create location');
                            }
                            return res.json();
                        })
                        .then(async (created) => {
                            // if quests were selected, update each mission to link to this location
                            try {
                                if (Array.isArray(selectedQuestIds) && selectedQuestIds.length > 0) {
                                    await Promise.all(selectedQuestIds.map((mid) => fetch(`http://localhost:3000/api/campaigns/${campaignId}/missions/${mid}`, {
                                        method: 'PUT',
                                        credentials: 'include',
                                        headers: { 'Content-Type': 'application/json' },
                                        body: JSON.stringify({ locationId: created.id })
                                    })))
                                }
                            } catch (e) {
                                console.error('Failed to link missions to location', e)
                            }

                            if (campaignId) navigate(`/InCampaign/${campaignId}/Locations/${created.id}`)
                            else navigate(-1)
                        })
                        .catch((e) => {
                            console.error('Failed to create location', e);
                            alert('Failed to create location');
                        });
        }
    }

    // Load available quests and npcs from backend
    useEffect(() => {
        const campaignId = params.campaignId ?? null;
        if (!campaignId) return;

        // fetch campaign missions
        fetch(`http://localhost:3000/api/campaigns/${campaignId}`, { credentials: 'include' })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch campaign');
                return res.json();
            })
            .then((data) => {
                const qList = Array.isArray(data.missions) ? data.missions.map((m: any) => ({ id: String(m.id), title: m.title ?? m.name ?? String(m.id) })) : [];
                setAvailableQuests(qList);
            })
            .catch((e) => console.error('Failed to load missions', e));

        // fetch npcs
        fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs`, { credentials: 'include' })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch npcs');
                return res.json();
            })
            .then((data) => {
                const npcNames = Array.isArray(data) ? data.map((n: any) => n.name ?? String(n.id)) : [];
                setAvailableNpcs(npcNames);
            })
            .catch((e) => console.error('Failed to load npcs', e));

    }, [params.campaignId]);

            const addQuest = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const val = e.target.value;
                if (!val) return;
                setSelectedQuestIds(prev => prev.includes(val) ? prev : [...prev, val]);
            }

            const removeQuest = (index: number) => {
                setSelectedQuestIds(prev => prev.filter((_, i) => i !== index));
            }

            const addNpc = (e: React.ChangeEvent<HTMLSelectElement>) => {
                const val = e.target.value;
                if (!val) return;
                setNpcs(prev => Array.isArray(prev) ? (prev.includes(val) ? prev : [...prev, val]) : [val]);
                setNpcsIds("");
            }

            const removeNpc = (index: number) => {
                setNpcs(prev => prev.filter((_, i) => i !== index));
                setNpcsIds("");
            }
    
    // UI helper classes
    const inputGameplayInformation = `bg-black/80 w-full rounded-md`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;
    const { campaignId } = useParams<{ campaignId?: string }>();

    const introData = {
        currentSection: "Location Section",
        urlName: "LocationView"
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
                            <h1 className="text-4xl font-bold mb-6">Create New Location</h1>
                            <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => saveLocation()}>
                                Save Location
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
                                        <button onClick={() => setSelectedView('quests')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'quests' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Quests
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('npcs')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'npcs' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Npcs
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
                                    <p className={subTitleGameplayInformation}>Location's Name</p>
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
                                    <p className={subTitleGameplayInformation}>Location's Description</p>
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
                            {(selectedView === 'all' || selectedView === 'quests') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Quest Information</h1>
                                    <p className={subTitleGameplayInformation}>Related Quests</p>
                                    <div className={inputGameplayInformation}>
                                        <select
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                            value={""}
                                            onChange={(e) => addQuest(e)}
                                        >
                                            <option value="">-- Select Quest --</option>
                                            {availableQuests.map(q => (
                                                <option key={q.id} value={q.id}>{q.title}</option>
                                            ))}
                                        </select>
                                        {selectedQuestIds.map((qid, index) => {
                                            const q = availableQuests.find(a => a.id === qid)
                                            return (
                                              <div key={index} className="flex justify-between items-center border-b-2 border-l-2 border-r-2 border-orange-700 p-1">
                                                <p>{q ? q.title : qid}</p>
                                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeQuest(index)}>X</button>
                                              </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            {(selectedView === 'all' || selectedView === 'npcs') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Npc Information</h1>
                                    <p className={subTitleGameplayInformation}>Related Npcs</p>
                                    <div className={inputGameplayInformation}>
                                        <select
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                            value={""}
                                            onChange={(e) => addNpc(e)}
                                        >
                                            <option value="">-- Select NPC --</option>
                                            {availableNpcs.map(n => (
                                                <option key={n} value={n}>{n}</option>
                                            ))}
                                        </select>
                                        {npcs.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center border-b-2 border-l-2 border-r-2 border-orange-700 p-1">
                                                <p>{item}</p>
                                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeNpc(index)}>X</button>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 w-full p-2">
                        <div className="bg-orange-700/30 rounded-md p-4 flex flex-col items-center">
                            <h1 className="text-2xl font-bold pb-6">Location Avatar</h1>
                            <div className="border-2 border-orange-700 border-dashed w-3/5 h-48 flex flex-col justify-center hover:border-orange-500">
                                <p className="text-gray-400 text-center p-2">Click <span className="text-white font-bold hover:underline cursor-pointer">here</span> to upload image</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}