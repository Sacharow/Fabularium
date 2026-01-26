import CampaignNewSidebar from "./CampaignNewSidebar";
import { NavLink } from "react-router-dom";

type Props = {
    campaignData: { id: string; name: string; dm: string };
    introData: { currentSection: string; urlName: string };
}

export default function ViewIntroduction({ campaignData, introData }: Props) {
    return (
        // Use a relative container; sidebar is fixed to the left and content gets a left margin
        <div className="w-full">
            <div className="grid grid-cols-8 gap-6">
                <div className="relative col-span-2">
                    <div className="fixed top-6 left-0 h-screen w-1/5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
                        <h1 className="font-bold text-2xl">{campaignData.name}</h1>
                        <h2 className="text-gray-500 text-sm">DM: {campaignData.dm}</h2>
                        <div className="flex flex-col pt-6 gap-y-2">
                            <CampaignNewSidebar campaignId={campaignData.id} />
                        </div>
                    </div>
                </div>
                <div className="col-span-4">
                    <div className="pb-4">
                        <p className="text-gray-500 text-sm ">
                            <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
                            <span> / </span>
                            <NavLink to={`/InCampaign/${campaignData.id}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.currentSection}</NavLink>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}