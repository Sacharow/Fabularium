import CampaignCard from "../components/CampaignCard"

type Campaign = {
  id: number
  name: string
  color: string
}

const CAMPAIGNS: Campaign[] = [
  { id: 1, name: "Shadows over Emberfall", color: "bg-red-400" },
  { id: 2, name: "Echoes of the Iron Sea", color: "bg-blue-400" },
  { id: 3, name: "Thorn of the Wildmarch", color: "bg-emerald-400" },
  { id: 4, name: "Winds of Hollowspire", color: "bg-violet-400" },
  { id: 5, name: "Crown of the Forgotten", color: "bg-yellow-400" },
  { id: 6, name: "Nightfall over Greymoor", color: "bg-slate-400" },
]

function Campaigns() {
  return (
    <div className="pt-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Campaigns</h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {CAMPAIGNS.map((c) => (
            <CampaignCard key={c.id} name={c.name} color={c.color} />
          ))}
        </div>
      </div>
    </div>
  )
}

export default Campaigns
