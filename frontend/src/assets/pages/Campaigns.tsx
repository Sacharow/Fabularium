import { useEffect, useState } from "react"
import CampaignCard from "../components/helper/CampaignCard"
import AddCampaignTile from "../components/helper/AddCampaignTile"

type Campaign = {
  id: number
  user_ids: number[]
  name: string
  color: string
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([])

  useEffect(() => {
    // Fetch campaigns from backend
    fetch("http://localhost:3000/api/campaigns", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // Ustaw domyślny kolor jeśli nie ma
        const campaignsWithColor = data.map((c: Campaign) => ({
          ...c,
          color: c.color || "bg-orange-500",
        }))
        setCampaigns(campaignsWithColor)
      })
      .catch(() => setCampaigns([]))
  }, [])

  return (
    <div className="pt-6 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Campaigns</h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} name={c.name} id={c.id} color={c.color} />
          ))}

          {/* 'Add' tile is always last */}
          <AddCampaignTile />
        </div>
      </div>
    </div>
  )
}

export default Campaigns
