import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink } from "react-router-dom";
import { useCampaign } from "../../../../context/CampaignContext";

export default function CharacterView() {
  const { campaign, loading, error } = useCampaign();
  const items: {
    id: string;
    name: string;
    color: string;
    characterClass?: string;
    characterRace?: string;
    class?: { name: string };
    race?: { name: string };
  }[] = Array.isArray(campaign?.characters) ? campaign.characters : [];

  const introData = {
    currentSection: "Character Section",
    urlName: "CharacterView",
  };

  if (loading)
    return <div className="pt-6 text-center">Loading campaign...</div>;
  if (error)
    return <div className="pt-6 text-center text-red-600">{error}</div>;

  return (
    <div className="pt-6">
      <ViewIntroduction
        campaignData={{
          id: campaign?.id || "",
          name: campaign?.name || "Campaign",
          dm: campaign?.owner?.name || "DM",
        }}
        introData={introData}
      />
      <div className="w-full">
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className="pb-4">
              <div className="flex justify-between items-center">
                <h1 className="text-3xl font-bold">
                  {introData.currentSection}
                </h1>
                <NavLink
                  to={
                    campaign?.id
                      ? `/InCampaign/${campaign.id}/${introData.urlName}/New`
                      : "#"
                  }
                >
                  <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                    <p>Create New</p>
                  </button>
                </NavLink>
              </div>
            </div>
            <div className="pt-6 px-6">
              <div className="max-w-[1200px] mx-auto">
                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                  {items.map((i) => (
                    <NavLink
                      key={i.id}
                      to={`/InCampaign/${campaign?.id}/Characters/${i.id}`}
                    >
                      <div className="bg-orange-900/40 border border-orange-700 rounded-lg p-4 hover:bg-orange-900/60 transition-all duration-200 group hover:scale-105 hover:ring-2 hover:ring-orange-400/60 cursor-pointer h-full flex flex-col justify-center items-center">
                        {/* Character Color Box */}
                        <div
                          className={`${i.color} w-20 h-20 rounded-full bg-orange-600 mb-4 shadow-md flex items-center justify-center group-hover:shadow-lg transition-shadow`}
                        >
                          <span className="text-3xl">🎲</span>
                        </div>

                        {/* Character Name */}
                        <h3 className="font-bold text-lg mb-2 text-orange-100 truncate text-center">
                          {i.name}
                        </h3>

                        {/* Spacer */}
                        <div className="flex-grow"></div>
                      </div>
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
