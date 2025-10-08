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

function CampaignCard({ name, color }: { name: string; color: string }) {
  return (
    <div className="w-full">
      <div className="aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.01] transition-transform">
        <div className="h-full grid grid-rows-[80%_20%]">
          {/* top 80% - graphic */}
          <div className={`${color} flex items-center justify-center`}></div>

          {/* bottom 20% - name */}
          <div className="bg-gray-800 flex items-center justify-center px-2">
            <span className="text-sm font-medium text-gray-100 text-center">{name}</span>
          </div>
        </div>
      </div>
    </div>
  )
}

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
