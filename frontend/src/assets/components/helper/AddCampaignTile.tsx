import { useNavigate } from "react-router-dom";

function AddCampaignTile() {
  const navigate = useNavigate();

  return (
    <div className="w-full">
      <button
        onClick={() => navigate("/campaigns/new")}
        className="aspect-square w-full rounded-lg border-2 border-dashed border-gray-500/60 flex flex-col items-center justify-center gap-2 hover:border-gray-400/80 transition-colors"
        aria-label="Add new campaign"
      >
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-gray-300">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
        </svg>
        <span className="text-sm font-medium text-gray-300">add new campaign</span>
      </button>
    </div>
  )
}

export default AddCampaignTile
