import { useState } from "react";
import CampaignSidebar from "../components/CampaignSidebar";
import CampaignContent from "../components/CampaignContent";

export default function InCampaign() {
    const [activeSection, setActiveSection] = useState<string | "Maps">("Maps");

    return (
        // Use a relative container; sidebar is fixed to the left and content gets a left margin
        <div className="relative min-h-screen pt-6">
            {/* fixed left sidebar */}
            <div className="fixed top-0 left-0 h-screen w-64 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
                <h1 className="font-bold text-2xl">Super Cool Campaign</h1>
                <h2 className="text-gray-500 text-sm">DM: DMUSSY</h2>
                <div className="flex flex-col pt-6 gap-y-2">
                    <CampaignSidebar
                        active={activeSection}
                        onChange={setActiveSection}
                    />
                </div>
            </div>

            {/* main content area (pushed right by sidebar width) */}
            <div className="ml-64">
                <CampaignContent activeSection={activeSection} />
            </div>
        </div>
    );
}