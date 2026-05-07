import CampaignCard from "../components/CampaignCard";

const numberOfDmCampaigns: number = 2; // Placeholder for the number of campaigns where user is DM
const numberOfPlayerCampaigns: number = 3; // Placeholder for the number of campaigns where user is a player
const campaign = {
  title: "Brand New World",
  description:
    "An epic adventure in a mysterious realm filled with magic, danger, and untold treasures waiting to be discovered.",
  players: 5,
  currentSession: "Session 12",
};

function CampaignsNew() {
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

      {/* RUNNING AS DM SECTION */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="text-lg tracking-widest font-bold whitespace-nowrap">
            RUNNING AS A DM
          </p>
          <hr className="flex-grow border-gold-dark" />
          <p className="text-sm text-gray-light whitespace-nowrap">
            {numberOfDmCampaigns} Active Campaign
            {numberOfDmCampaigns !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: numberOfDmCampaigns }).map((_, index) => (
            <CampaignCard
              key={`dm-${index}`}
              id={`dm-campaign-${index}`}
              title={campaign.title}
              description={campaign.description}
              players={campaign.players}
              currentSession={campaign.currentSession}
            />
          ))}
        </div>
      </div>

      {/* PLAYING AS PLAYER SECTION */}
      <div className="flex flex-col gap-6">
        <div className="flex items-center gap-4">
          <p className="text-lg tracking-widest font-bold whitespace-nowrap">
            PLAYING AS A PLAYER
          </p>
          <hr className="flex-grow border-gold-dark" />
          <p className="text-sm text-gray-light whitespace-nowrap">
            {numberOfPlayerCampaigns} Active Game
            {numberOfPlayerCampaigns !== 1 ? "s" : ""}
          </p>
        </div>
        <div className="grid grid-cols-3 gap-8">
          {Array.from({ length: numberOfPlayerCampaigns }).map((_, index) => (
            <CampaignCard
              key={`player-${index}`}
              id={`player-campaign-${index}`}
              title={campaign.title}
              description={campaign.description}
              players={campaign.players}
              currentSession={campaign.currentSession}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

export default CampaignsNew;
