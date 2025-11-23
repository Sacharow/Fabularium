import { NavLink } from "react-router-dom"

type CampaignCardProps = {
  name: string
  color: string
}

function CampaignCard({ name, color }: CampaignCardProps) {
  return (
      <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
        <NavLink to="/InCampaign">
          <div className="h-full grid grid-rows-[80%_20%]">
            {/* top 80% - graphic */}
            <div className={`${color} flex items-center justify-center`}></div>

            {/* bottom 20% - name */}
            <div className="bg-gray-800 flex items-center justify-center px-2">
              <span className="text-sm font-medium text-gray-100 text-center">{name}</span>
            </div>
          </div>
        </NavLink>
      </button>
  )
}

export default CampaignCard
