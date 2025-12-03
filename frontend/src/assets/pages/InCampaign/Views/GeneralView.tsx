import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink, useParams, useMatch } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GeneralView() {
    const params = useParams();
    const match = useMatch("/InCampaign/:campaignId/*");
    const campaignId = params.campaignId ?? match?.params.campaignId ?? null

    type Item = {
        id: number
        campaignId?: string | number
        name: string
        color: string
    }

    const STORAGE_KEY = "fabularium.campaigns.general_section"

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
        window.addEventListener('fabularium.generals.updated', handler)
        return () => window.removeEventListener('fabularium.generals.updated', handler)
    }, [])
    const visible = campaignId ? items.filter(c => String(c.campaignId) === String(campaignId)) : []

    const campaignData = {
        id: campaignId ? parseInt(campaignId) : 0,
        name: "Super Cool Campaign",
        dm: "DMUSSY"
    };

    const introData = {
        currentSection: "General Section",
        urlName: "GeneralView"
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
                                        <p>Edit</p>
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="pt-6 px-6">
                            <div className="max-w-[1200px] mx-auto">
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {visible.map((c) => (
                                        <div key={c.id}>
                                            {/* Basic Campaign Information */}
                                        </div>
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