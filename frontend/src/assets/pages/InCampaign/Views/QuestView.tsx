import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink, useParams, useMatch } from "react-router-dom";
import { useEffect, useState } from "react";

export default function QuestView() {
    const params = useParams();
    const match = useMatch("/InCampaign/:campaignId/*");
    const campaignId = params.campaignId ?? match?.params.campaignId ?? null

    type Item = {
        id: number
        campaignId?: string | number
        name: string
        description: string
    }

    const STORAGE_KEY = "fabularium.campaigns.quest_section"

    function loadFromSession(): Item[] {
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

    function saveToSession(list: Item[]) {
        try {
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
        } catch (e) {
            // ignore
        }
    }

    const [items, setItems] = useState<Item[]>(() => loadFromSession())

    useEffect(() => {
        saveToSession(items)
    }, [items])

    useEffect(() => {
        const handler = () => setItems(loadFromSession())
        window.addEventListener('fabularium.quests.updated', handler)
        return () => window.removeEventListener('fabularium.quests.updated', handler)
    }, [])
    const visible = campaignId ? items.filter(c => String(c.campaignId) === String(campaignId)) : []

    const campaignData = {
        id: campaignId ? parseInt(campaignId) : 0,
        name: "Super Cool Campaign",
        dm: "DMUSSY"
    };

    const introData = {
        currentSection: "Quest Section",
        urlName: "QuestView"
    }

    return (
        // Use a relative container; sidebar is fixed to the left and content gets a left margin
        <div className="pt-6">
            <ViewIntroduction campaignData={campaignData} introData={introData} />
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
                                <div>
                                    {visible.map((n) => (
                                        <NavLink key={n.id} to={`/InCampaign/${campaignId}/Quests/${n.id}`}>
                                            <button className="w-full rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer mb-4">
                                                <div className="h-full grid grid-cols-10">
                                                    <div className= "bg-orange-700 flex items-center justify-center px-2 col-span-3">
                                                        <span className="text-sm font-medium text-gray-100 p-2 truncate">{n.name}</span>
                                                    </div>
                                                    <div className= "bg-orange-900 flex items-center justify-center px-2 col-span-7">
                                                        <span className="text-sm font-medium text-gray-300 p-2 truncate">{n.description}</span>
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