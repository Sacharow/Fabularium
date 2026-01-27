import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { useCampaign } from "../../../../context/CampaignContext";
import { useAuth } from "../../../../context/AuthContext";

export default function PlayerView() {
  const { campaign, loading, error } = useCampaign();
  const { user } = useAuth();
  const items: { id: string; name: string; color: string }[] = Array.isArray(
    (campaign as any)?.contributors,
  )
    ? (campaign as any).contributors
    : [];
  const campaignId = campaign?.id;

  // Owner as a player object
  const owner = campaign?.owner
    ? {
        id: campaign.owner.id,
        name: campaign.owner.name,
        color: "bg-orange-900",
      }
    : null;

  const introData = {
    currentSection: "Player Section",
    urlName: "PlayerView",
  };

  if (loading)
    return <div className="pt-6 text-center">Loading campaign...</div>;
  if (error)
    return <div className="pt-6 text-center text-red-600">{error}</div>;

  return (
    <div className="pt-6">
      <ViewIntroduction
        campaignData={{
          id: campaign?.id || campaignId || "",
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
              </div>
            </div>
            {/* Campaign JoinCode */}
            <div className="pt-6 px-6">
              <div className="max-w-[1200px] mx-auto">
                {campaign?.joinCode && (
                  <div className="mb-6 p-4 bg-orange-900 border border-orange-400 rounded text-white flex items-center justify-between">
                    <span className="font-semibold">
                      Kod dołączenia do kampanii:
                    </span>
                    <span
                      className="ml-2 font-mono text-lg bg-orange-950 p-2 border border-orange-400 rounded cursor-pointer transition-colors hover:bg-yellow-700"
                      title="Kliknij, aby skopiować kod"
                      onClick={() => {
                        if (campaign.joinCode) {
                          navigator.clipboard.writeText(campaign.joinCode);
                        }
                      }}
                    >
                      {campaign.joinCode}
                    </span>
                  </div>
                )}
                <h2 className="text-xl font-semibold mb-2">
                  Gracze w kampanii
                </h2>
                <div className="flex flex-col gap-4 mb-8">
                  {owner && (
                    <div className="flex items-center w-full rounded-lg overflow-hidden shadow bg-orange-800">
                      <div className="w-16 h-16 bg-gradient-to-br from-yellow-400 to-orange-700 flex items-center justify-center text-white font-bold text-xl"></div>
                      <div className="flex-1 flex items-center justify-between px-4 py-2">
                        <div>
                          <span className="text-lg font-bold text-white">
                            {owner.name}
                          </span>
                          <span className="ml-2 text-xs font-normal text-orange-200">
                            (Właściciel)
                          </span>
                        </div>
                      </div>
                    </div>
                  )}
                  {items.map(
                    (i: { id: string; name: string; color: string }) => (
                      <div
                        key={i.id}
                        className="flex items-center w-full rounded-lg overflow-hidden shadow bg-orange-800"
                      >
                        <div className="w-16 h-16 bg-gradient-to-br from-orange-600 to-orange-700 flex items-center justify-center text-white font-bold text-xl"></div>
                        <div className="flex-1 flex items-center justify-between px-4 py-2">
                          <span className="text-lg font-medium text-white">
                            {i.name}
                          </span>
                          {user?.id === campaign?.owner?.id && (
                            <button
                              className="ml-4 bg-red-700 hover:bg-red-900 text-white rounded w-8 h-8 flex items-center justify-center font-bold text-lg"
                              style={{ borderRadius: 4 }}
                              title="Usuń gracza"
                              // onClick={() => handleRemove(i.id)}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
