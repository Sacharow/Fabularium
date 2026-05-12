import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { campaignService } from "../../services/campaignService";
import CampaignCard from "../components/CampaignCard";

interface Campaign {
  id: string;
  name: string;
  description?: string;
  contributors?: any[];
  ownerId?: string;
}

function Campaigns() {
  const { isAuthenticated, isLoading: authLoading, user } = useAuth();
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCampaigns = async () => {
      try {
        setLoading(true);
        const data = await campaignService.getCampaigns();
        setCampaigns(data);
        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load campaigns");
        setCampaigns([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) fetchCampaigns();
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) return <Navigate to="/sign-in" replace />;

  if (loading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading campaigns...
      </div>
    );
  }

  const dmCampaigns = campaigns.filter((c) => c.ownerId === user?.id);
  const playerCampaigns = campaigns.filter((c) => c.ownerId !== user?.id);

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <div className="flex justify-between">
        <h1 className="text-2xl font-bold tracking-widest">MY CAMPAIGNS</h1>
        <form className="flex items-stretch gap-2 w-full max-w-lg justify-end">
          <div className="flex-1 max-w-sm border-2 border-gold-neutral bg-neutral px-3 h-10 flex items-center">
            <input
              type="text"
              placeholder="ENTER JOIN KEY"
              className="w-full bg-transparent text-neutral-text placeholder:text-neutral-text/50 outline-none tracking-widest text-sm"
            />
          </div>
          <button
            type="button"
            className="border-2 border-gold-neutral bg-neutral px-4 h-10 text-sm tracking-widest font-bold hover:bg-gold-neutral cursor-pointer"
          >
            JOIN CAMPAIGN
          </button>
        </form>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="text-lg tracking-widest font-bold whitespace-nowrap">
            RUNNING AS A DM
          </p>
          <hr className="flex-grow border-gold-dark" />
          <p className="text-sm text-gray-light whitespace-nowrap">
            {dmCampaigns.length} Active Campaign
            {dmCampaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {dmCampaigns.length === 0 ? (
            <div className="text-gray-light">
              No campaigns found where you're the DM.
            </div>
          ) : (
            dmCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                id={c.id}
                title={c.name}
                description={c.description}
                players={(c.contributors?.length ?? 0) + 1}
                currentSession={"-"}
              />
            ))
          )}
        </div>
      </div>

      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="text-lg tracking-widest font-bold whitespace-nowrap">
            PLAYING AS A PLAYER
          </p>
          <hr className="flex-grow border-gold-dark" />
          <p className="text-sm text-gray-light whitespace-nowrap">
            {playerCampaigns.length} Active Game
            {playerCampaigns.length !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {playerCampaigns.length === 0 ? (
            <div className="text-gray-light">
              No campaigns found where you're a player.
            </div>
          ) : (
            playerCampaigns.map((c) => (
              <CampaignCard
                key={c.id}
                id={c.id}
                title={c.name}
                description={c.description}
                players={(c.contributors?.length ?? 0) + 1}
                currentSession={"-"}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export default Campaigns;
