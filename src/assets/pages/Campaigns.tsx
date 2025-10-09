import { useEffect, useState } from "react"
import CampaignCard from "../components/CampaignCard"
import AddCampaignTile from "../components/AddCampaignTile"

type Campaign = {
  id: number
  name: string
  color: string
}

const STORAGE_KEY = "fabularium.campaigns"

function rand<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateName() {
  const adjectives = [
    "Shadows",
    "Echoes",
    "Thorn",
    "Winds",
    "Crown",
    "Nightfall",
    "Ember",
    "Iron",
    "Wild",
    "Hollow",
  ]
  const places = [
    "Emberfall",
    "Iron Sea",
    "Wildmarch",
    "Hollowspire",
    "the Forgotten",
    "Greymoor",
    "Duskwood",
    "Ravenhold",
    "Erebor",
  ]
  return `${rand(adjectives)} of ${rand(places)}`
}

function generateColor() {
  const colors = [
    "bg-red-400",
    "bg-blue-400",
    "bg-emerald-400",
    "bg-violet-400",
    "bg-yellow-400",
    "bg-slate-400",
    "bg-pink-400",
    "bg-amber-400",
    "bg-cyan-400",
    "bg-lime-400"
  ]
  return rand(colors)
}

function loadFromSession(): Campaign[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
  } catch (e) {
    return []
  }
}

function saveToSession(list: Campaign[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    // ignore
  }
}

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>(() => loadFromSession())

  useEffect(() => {
    saveToSession(campaigns)
  }, [campaigns])

  function handleAdd() {
    setCampaigns((prev) => {
      const next: Campaign = {
        id: Date.now(),
        name: generateName(),
        color: generateColor(),
      }
      const updated = [...prev, next]
      return updated
    })
  }

  return (
    <div className="pt-24 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Campaigns</h1>

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {campaigns.map((c) => (
            <CampaignCard key={c.id} name={c.name} color={c.color} />
          ))}

          {/* 'Add' tile is always last */}
          <AddCampaignTile onClick={handleAdd} />
        </div>
      </div>
    </div>
  )
}

export default Campaigns
