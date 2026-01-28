import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink } from "react-router-dom";
import { useCampaign } from "../../../../context/CampaignContext";

export default function QuestView() {
    const { campaign, loading, error } = useCampaign();
    const items: { id: string; name: string; description: string }[] = Array.isArray((campaign as any)?.missions) ? (campaign as any).missions.map((m: any) => ({ id: String(m.id), name: m.title ?? m.name ?? '', description: m.description ?? '' })) : [];
    const campaignId = campaign?.id;


    const introData = {
        currentSection: "Quest Section",
        urlName: "QuestView"
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
                                <div>
                                    {items.map((i: { id: string; name: string; description: string }) => (
                                        <NavLink key={i.id} to={`/InCampaign/${campaignId}/Quests/${i.id}`}>
                                            <button className="w-full rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer mb-4">
                                                <div className="h-full grid grid-cols-10">
                                                    <div className= "bg-orange-700 flex items-center justify-center px-2 col-span-3">
                                                        <span className="text-sm font-medium text-gray-100 p-2 truncate">{i.name}</span>
                                                    </div>
                                                    <div className= "bg-orange-900 flex items-center justify-center px-2 col-span-7">
                                                        <span className="text-sm font-medium text-gray-300 p-2 truncate">{i.description}</span>
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