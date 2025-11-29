import { useState } from "react";
import CampaignSidebar from "../components/CampaignSidebar";
//import CampaignContent from "../components/CampaignContent";
import CharacterSection from "../components/CampaignContent/Sections/CharacterSection";

export default function InCampaign(props: { activeSectionProp ?: string }) {
    const [activeSection, setActiveSection] = useState<string>(props.activeSectionProp || "Maps");

    return (
        // Use a relative container; sidebar is fixed to the left and content gets a left margin
        <div className="relative min-h-screen pt-6">
            {/* fixed left sidebar */}
            <div className="fixed top-0 left-0 h-screen w-61.5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
                <h1 className="font-bold text-2xl">Super Cool Campaign</h1>
                <h2 className="text-gray-500 text-sm">DM: DMUSSY</h2>
                <div className="flex flex-col pt-6 gap-y-2">
                    <CampaignSidebar
                        active={activeSection}
                        onChange={setActiveSection}
                    />
                </div>
            </div>

            <div className="ml-64">
                {activeSection === "Characters" && (
                    <CharacterSection />
                )}
            </div>
        </div>
    );
}