import { useState, useEffect } from "react";
import { useNavigate, NavLink, useParams, useMatch } from "react-router-dom";
import CampaignSidebar from "../../components/helper/CampaignSidebar";

export default function InCampaign(props: { activeSectionProp?: string }) {
    const [activeSection, setActiveSection] = useState<string>(props.activeSectionProp || "Maps");
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>()
    const match = useMatch("/InCampaign/:campaignId/*")

    type CharacterItem = {
        id: number
        campaignId?: string | number
        name: string
        color: string
    }

    const STORAGE_KEY = "fabularium.campaigns.character_section"

    function loadFromSession(): CharacterItem[] {
        try {
            const raw = sessionStorage.getItem(STORAGE_KEY)
            if (!raw) return []
            const parsed = JSON.parse(raw)
            if (!Array.isArray(parsed)) return []
            return parsed
        } catch (e) {
            return []
        }
    }

    function saveToSession(list: CharacterItem[]) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        } catch (e) {
            // ignore
        }
    }

    const [characters, setCharacters] = useState<CharacterItem[]>(() => loadFromSession())

    useEffect(() => {
        saveToSession(characters)
    }, [characters])

    useEffect(() => {
        const handler = () => setCharacters(loadFromSession())
        window.addEventListener('fabularium.characters.updated', handler)
        return () => window.removeEventListener('fabularium.characters.updated', handler)
    }, [])

    const campaignId = params.campaignId ?? match?.params.campaignId ?? null
    const visible = campaignId ? characters.filter(c => String(c.campaignId) === String(campaignId)) : []

    return (
        // Use a relative container; sidebar is fixed to the left and content gets a left margin
        <div className="pt-6">
            <div className="w-full">
                <div className="grid grid-cols-8 gap-6">
                    <div className="relative col-span-2">
                        <div className="fixed top-0 left-0 h-screen w-1/5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
                            <h1 className="font-bold text-2xl">Super Cool Campaign</h1>
                            <h2 className="text-gray-500 text-sm">DM: DMUSSY</h2>
                            <div className="flex flex-col pt-6 gap-y-2">
                                <CampaignSidebar
                                    active={activeSection}
                                    onChange={setActiveSection}
                                />
                            </div>
                        </div>
                    </div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm ">
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-1)}>Campaigns</button>
                                <span> / </span>
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(0)}>Sections</button>
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-6">{activeSection}</h1>
                            <NavLink to={campaignId ? `/InCampaign/${campaignId}/${activeSection}/New` : '#'}>
                                <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                    <p>Create New</p>
                                </button>
                            </NavLink>
                        </div>
                        {activeSection === "Maps" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/Maps/${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Locations" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/Locations${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Characters" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/Characters/${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "NPCs" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/NPCs/${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Quests" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/Quests/${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Players" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/Players/${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                        {activeSection === "Notes" && (
                            <div className="pt-6 px-6">
                                <div className="max-w-[1200px] mx-auto">
                                    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                        {visible.map((c) => (
                                            <NavLink key={c.id} to={`/InCampaign/${campaignId}/Notes/${c.id}`}>
                                                <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                    <div className="h-full grid grid-rows-[80%_20%]">
                                                        {/* top 80% - graphic */}
                                                        <div className={`${c.color} flex items-center justify-center`}></div>
                                                        {/* bottom 20% - name */}
                                                        <div className="bg-gray-800 flex items-center justify-center px-2">
                                                            <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                                                        </div>
                                                    </div>
                                                </button>
                                            </NavLink>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                    <div className="col-span-2"></div>
                </div>
            </div>
        </div>
    );
}