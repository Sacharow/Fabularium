import { useNavigate, useParams, NavLink } from "react-router-dom";
import React, { useState, useEffect } from "react";
import { addQuestReferenceToLocation, addQuestReferenceToNpc } from '../../../helper/storageRelations';

export default function QuestNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>()

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");
    // selected values
    const [location, setLocation] = useState<string[]>([]);
    const [locationId, setLocationId] = useState<string>("");
    const [npc, setNpc] = useState<string[]>([]);
    const [npcId, setNpcId] = useState<string>("");
    // available choices loaded from storage
    const [availableLocations, setAvailableLocations] = useState<string[]>([]);
    const [availableNpcs, setAvailableNpcs] = useState<string[]>([]);
    const [rewards, setRewards] = useState<string[]>([]);

    // Sidebar tab selection: 'all' shows all sections, otherwise only selected
    const [selectedView, setSelectedView] = useState<string>('all');

    const saveQuest = () => {

        if (name.trim() === "") {
            alert("Quest title cannot be empty.");
            return;
        }
        else {
            const STORAGE_KEY = "fabularium.campaigns.quest_section"

            const id = Date.now()
            const campaignId = params.campaignId ?? null

            const QuestData = {
                id,
                campaignId,
                name,
                description,
                location,
                locationId,
                npc,
                npcId,
                rewards
            };

            try {
                const raw = sessionStorage.getItem(STORAGE_KEY)
                const parsed = raw ? JSON.parse(raw) : []
                const list = Array.isArray(parsed) ? parsed : []
                list.push(QuestData)
                sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
                // Notify other components in-window that quests changed
                try { window.dispatchEvent(new Event('fabularium.quests.updated')) } catch (e) { /* ignore */ }
                    // Update related locations and NPCs so references stay in sync
                    try {
                        if (Array.isArray(location) && location.length) {
                            location.forEach((locName) => addQuestReferenceToLocation(locName, QuestData.name))
                        }
                        if (Array.isArray(npc) && npc.length) {
                            npc.forEach((npcName) => addQuestReferenceToNpc(npcName, QuestData.name))
                        }
                    } catch (e) {
                        console.error('Failed to update location/npc references', e)
                    }
                // navigate to the created Quest's page
                if (campaignId) navigate(`/InCampaign/${campaignId}/Quests/${id}`)
                else navigate(-1)
            } catch (e) {
                console.error('Failed to save Quest to sessionStorage', e)
            }
        }
    }

    // Load NPCs and Locations from sessionStorage (or listen for updates)
    useEffect(() => {
        function loadLists() {
            try {
                const locRaw = sessionStorage.getItem("fabularium.campaigns.location_section");
                const locParsed = locRaw ? JSON.parse(locRaw) : [];
                const locNames = Array.isArray(locParsed) ? locParsed.map((l: any) => l.name ?? l.title ?? String(l.id ?? l)) : [];
                setAvailableLocations(locNames);

                const npcRaw = sessionStorage.getItem("fabularium.campaigns.npc_section");
                const npcParsed = npcRaw ? JSON.parse(npcRaw) : [];
                const npcNames = Array.isArray(npcParsed) ? npcParsed.map((n: any) => n.name ?? n.title ?? String(n.id ?? n)) : [];
                setAvailableNpcs(npcNames);
            } catch (e) {
                console.error('Failed to load NPCs/Locations from sessionStorage', e);
            }
        }

        loadLists();

        const onLocationsUpdated = () => loadLists();
        const onNpcsUpdated = () => loadLists();

        window.addEventListener('fabularium.locations.updated', onLocationsUpdated as EventListener);
        window.addEventListener('fabularium.npcs.updated', onNpcsUpdated as EventListener);

        return () => {
            window.removeEventListener('fabularium.locations.updated', onLocationsUpdated as EventListener);
            window.removeEventListener('fabularium.npcs.updated', onNpcsUpdated as EventListener);
        };
    }, []);

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
        setLocation(prev => Array.isArray(prev) ? (prev.includes(val) ? prev : [...prev, val]) : [val]);
        setLocationId("");
    }

    const removeLocation = (index: number) => {
        setLocation(prev => prev.filter((_, i) => i !== index));
        setLocationId("");
    }

    const addNpc = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const val = e.target.value;
        if (!val) return;
        setNpc(prev => Array.isArray(prev) ? (prev.includes(val) ? prev : [...prev, val]) : [val]);
        setNpcId("");
    }

    const removeNpc = (index: number) => {
        setNpc(prev => prev.filter((_, i) => i !== index));
        setNpcId("");
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
                                        <button onClick={() => setSelectedView('locations')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'location' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Location
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('npcs')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'npc' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
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
                                                <option key={l} value={l}>{l}</option>
                                            ))}
                                        </select>
                                        {location.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center border-b-2 border-l-2 border-r-2 border-orange-700 p-1">
                                                <p>{item}</p>
                                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeLocation(index)}>X</button>
                                            </div>
                                        ))}
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
                                        {npc.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center border-b-2 border-l-2 border-r-2 border-orange-700 p-1">
                                                <p>{item}</p>
                                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeNpc(index)}>X</button>
                                            </div>
                                        ))}
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