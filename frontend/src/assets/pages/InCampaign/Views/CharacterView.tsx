import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink } from "react-router-dom";
import { useCampaign } from "../../../../context/CampaignContext";

export default function CharacterView() {
    const { campaign, loading, error } = useCampaign();
    const items: { id: string; name: string; color: string }[] = Array.isArray(campaign?.characters) ? campaign.characters : [];
    
    
        const introData = {
            currentSection: "Character Section",
            urlName: "CharacterView"
        };
    
    if (loading) return <div className="pt-6 text-center">Loading campaign...</div>;
    if (error) return <div className="pt-6 text-center text-red-600">{error}</div>;
    
    return (
        <div className="pt-6">
            <ViewIntroduction campaignData={{
                id: campaign?.id || '',
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
                                <NavLink to={campaign?.id ? `/InCampaign/${campaign.id}/${introData.urlName}/New` : '#'}>
                                    <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                        <p>Create New</p>
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="pt-6 px-6">
                            <div className="max-w-[1200px] mx-auto">
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    {items.map((i: { id: string; name: string; color: string }) => (
                                        <NavLink key={i.id} to={`/InCampaign/${campaign?.id}/Characters/${i.id}`}>
                                            <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                                                <div className="h-full grid grid-rows-[80%_20%]">
                                                    {/* top 80% - graphic */}
                                                    <div className={`${i.color} flex items-center justify-center`}></div>
                                                    {/* bottom 20% - name */}
                                                    <div className="bg-orange-700 flex items-center justify-center px-2">
                                                        <span className="text-sm font-medium text-gray-100 text-center line-clamp-3">{i.name}</span>
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