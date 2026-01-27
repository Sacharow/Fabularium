import { useNavigate, useParams, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
// relations now stored in backend; no storageRelations usage here

export default function QuestNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>()

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    // selected values (ids)
    const [locationsIds, setLocationsIds] = useState<string[]>([]);
    const [npcsIds, setNpcsIds] = useState<string[]>([]);
    // available choices loaded from backend
    const [availableLocations, setAvailableLocations] = useState<{id:string;name:string}[]>([]);
    const [availableNpcs, setAvailableNpcs] = useState<{id:string;name:string}[]>([]);
    const [rewards, setRewards] = useState<string[]>([]);

    // Sidebar tab selection: 'all' shows all sections, otherwise only selected
    const [selectedView, setSelectedView] = useState<string>('all');

    const saveQuest = () => {
        if (name.trim() === "") {
            alert("Quest title cannot be empty.");
            return;
        }
        const campaignId = params.campaignId ?? null;
        if (!campaignId) {
            alert('Campaign id missing');
            return;
        }
        if (!locationsIds || locationsIds.length === 0) {
            alert('Select at least one location for the quest');
            return;
        }

        fetch(`http://localhost:3000/api/campaigns/${campaignId}/missions`, {
            method: 'POST',
            credentials: 'include',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title: name, description, locationId: locationsIds[0], status: 'pending' })
        })
            .then(async (res) => {
                if (!res.ok) {
                    const txt = await res.text();
                    throw new Error(txt || 'Failed to create quest');
                }
                return res.json();
            })
            .then((created) => {
                if (campaignId) navigate(`/InCampaign/${campaignId}/Quests/${created.id}`)
                else navigate(-1)
            })
            .catch((e) => {
                console.error('Failed to create quest', e);
                alert('Failed to create quest');
            });
    }

    // Load NPCs and Locations from backend
    useEffect(() => {
        const campaignId = params.campaignId ?? null;
        if (!campaignId) return;

        fetch(`http://localhost:3000/api/campaigns/${campaignId}/locations`, { credentials: 'include' })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch locations');
                return res.json();
            })
            .then((data) => {
                const locs = Array.isArray(data) ? data.map((l: any) => ({ id: l.id, name: l.name ?? String(l.id) })) : [];
                setAvailableLocations(locs);
            })
            .catch((e) => console.error('Failed to load locations', e));

        fetch(`http://localhost:3000/api/campaigns/${campaignId}/npcs`, { credentials: 'include' })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch npcs');
                return res.json();
            })
            .then((data) => {
                const npcs = Array.isArray(data) ? data.map((n: any) => ({ id: n.id, name: n.name ?? String(n.id) })) : [];
                setAvailableNpcs(npcs);
            })
            .catch((e) => console.error('Failed to load npcs', e));
    }, [params.campaignId]);

    const createReward = () => {
        const itemName = prompt("Enter reward item name:");
        if (itemName && itemName.trim() !== "") {
            setRewards(prev => [...prev, itemName.trim()]);
        }
    }

    const removeReward = (index: number) => {
        setRewards(prev => prev.filter((_, i) => i !== index));
    }

    const addLocation = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) return;
        setLocationsIds(prev => Array.isArray(prev) ? (prev.includes(val) ? prev : [...prev, val]) : [val]);
    }

    const removeLocation = (index: number) => {
        setLocationsIds(prev => prev.filter((_, i) => i !== index));
    }

    const addNpc = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) return;
        setNpcsIds(prev => Array.isArray(prev) ? (prev.includes(val) ? prev : [...prev, val]) : [val]);
    }

    const removeNpc = (index: number) => {
        setNpcsIds(prev => prev.filter((_, i) => i !== index));
    }

    // UI helper classes
    const inputGameplayInformation = `bg-black/80 w-full rounded-md`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;
    const { campaignId } = useParams<{ campaignId?: string }>();

    const introData = {
        currentSection: "Quest Section",
        urlName: "QuestView"
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
                            <h1 className="text-4xl font-bold mb-6">Create New Quest</h1>
                            <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => saveQuest()}>
                                Save Quest
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
                                        <button onClick={() => setSelectedView('locations')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'locations' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Location
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('npcs')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'npcs' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Npc
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('rewards')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'rewards' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Rewards
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
                                    <p className={subTitleGameplayInformation}>Quest's Title</p>
                                    <div className={inputGameplayInformation}>
                                        <input
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                            placeholder="Title"
                                            minLength={1}
                                            maxLength={60}
                                            value={name}
                                            required
                                            onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <p className={subTitleGameplayInformation}>Quest's Content</p>
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
                            {(selectedView === 'all' || selectedView === 'locations') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Location Information</h1>
                                    <p className={subTitleGameplayInformation}>Related Locations</p>
                                    <div className={inputGameplayInformation}>
                                        <select
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                            value={""}
                                            onChange={(e) => addLocation(e)}
                                        >
                                            <option value="">-- Select Location --</option>
                                            {availableLocations.map(l => (
                                                <option key={l.id} value={l.id}>{l.name}</option>
                                            ))}
                                        </select>
                                        {locationsIds.map((locId, index) => {
                                            const loc = availableLocations.find(l => l.id === locId);
                                            const name = loc ? loc.name : locId;
                                            return (
                                                <div key={index} className="flex justify-between items-center border-b-2 border-l-2 border-r-2 border-orange-700 p-1">
                                                    <p>{name}</p>
                                                    <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeLocation(index)}>X</button>
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
                                                <option key={n.id} value={n.id}>{n.name}</option>
                                            ))}
                                        </select>
                                        {npcsIds.map((npcId, index) => {
                                            const npc = availableNpcs.find(n => n.id === npcId);
                                            const name = npc ? npc.name : npcId;
                                            return (
                                                <div key={index} className="flex justify-between items-center border-b-2 border-l-2 border-r-2 border-orange-700 p-1">
                                                    <p>{name}</p>
                                                    <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeNpc(index)}>X</button>
                                                </div>
                                            )
                                        })}
                                    </div>
                                </div>
                            )}
                            {(selectedView === 'all' || selectedView === 'rewards') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Rewards</h1>
                                    <div className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white min-h-20 grid grid-cols-4">
                                        <div className="col-span-3">
                                        {rewards.length === 0 && (
                                            <p className="text-gray-400">No rewards added yet.</p>
                                        )}
                                        {rewards.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center border-b border-orange-700 py-1 w-9/10">
                                                <p className="truncate">{item}</p>
                                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeReward(index)}>X</button>
                                            </div>
                                        ))}
                                        </div>
                                        <div className="col-span-1">
                                            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-center cursor-pointer" onClick={() => createReward()}>Add Rewards</button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 w-full p-2">
                        <div className="bg-orange-700/30 rounded-md p-4 flex flex-col items-center">
                            <h1 className="text-2xl font-bold pb-6">Quest Attachment</h1>
                            <div className="border-2 border-orange-700 border-dashed w-3/5 h-48 flex flex-col justify-center hover:border-orange-500">
                                <p className="text-gray-400 text-center p-2">Click <span className="text-white font-bold hover:underline cursor-pointer">here</span> to upload file</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}