import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"

const sectionData = {
    name: "Quest"
}

type ItemSection = {
  id: number
  campaignId?: string | number
  name: string
  description?: string
  locations: string[]
  locationId?: number[]
  npcs: string[]
  npcId?: number[]
  rewards: string[]
}

const STORAGE_KEY = "fabularium.campaigns.quest_section"

function loadFromSession(): ItemSection[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    // Normalize entries to ensure older/missing fields don't cause runtime errors
    return parsed.map((p: any) => {
      const name = p.name ?? p.title ?? String(p.id ?? '')
      const description = p.description ?? p.desc ?? ''
      const campaignId = p.campaignId ?? p.campaign ?? null

      // Normalize locations (accept different shapes)
      let locations: string[] = []
      if (Array.isArray(p.locations)) locations = p.locations
      else if (Array.isArray(p.location)) locations = p.location
      else if (typeof p.locations === 'string') locations = [p.locations]
      else if (typeof p.location === 'string') locations = [p.location]

      // Normalize npcs
      let npcs: string[] = []
      if (Array.isArray(p.npcs)) npcs = p.npcs
      else if (Array.isArray(p.npc)) npcs = p.npc
      else if (typeof p.npcs === 'string') npcs = [p.npcs]
      else if (typeof p.npc === 'string') npcs = [p.npc]

      // Normalize rewards
      let rewards: string[] = []
      if (Array.isArray(p.rewards)) rewards = p.rewards
      else if (Array.isArray(p.reward)) rewards = p.reward
      else if (typeof p.rewards === 'string') rewards = [p.rewards]
      else if (typeof p.reward === 'string') rewards = [p.reward]

      return {
        id: Number(p.id ?? Date.now()),
        campaignId,
        name,
        description,
        locations,
        locationId: Array.isArray(p.locationId) ? p.locationId : (p.locationId ? [p.locationId] : []),
        npcs,
        npcId: Array.isArray(p.npcId) ? p.npcId : (p.npcId ? [p.npcId] : []),
        rewards
      } as ItemSection
    })
  } catch {
    return []
  }
}


function saveToSession(items: ItemSection[]) {
  try {
    const str = JSON.stringify(items)
    sessionStorage.setItem(STORAGE_KEY, str)
  } catch {
    // ignore
  }
}

export default function QuestPage() {
  const { questId } = useParams<{ questId?: string; campaignId?: string }>()
  const navigate = useNavigate()
  const [quests] = useState<ItemSection[]>(() => loadFromSession())
  useEffect(() => {
    saveToSession(quests)
  }, [quests])

  const quest = quests.find((i) => i.id === Number(questId))

  if (!quest) {
    return (
      <div className="p-6">
        <p>{sectionData.name} not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go back</button>
      </div>
    )
  }

  const introData = {
    currentSection: "Quest Section",
    urlName: "QuestView"
  };


  return (
    <div className="p-6">
      <div className="pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm ">
            <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
            <span> / </span>
            <NavLink to={`/InCampaign/${quest?.campaignId}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.currentSection}</NavLink>
            <span> / </span>
            <NavLink to="#" className="cursor-pointer hover:text-gray-400"> {quest.name}</NavLink>
          </p>
        </div>
      </div>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-4">{quest.name}</h1>
            <p className="text-gray-300 whitespace-pre-wrap">{quest.description || "No description provided."}</p>
        </div>
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-2">Characters</h1>
            {quest.npcs.length === 0 ? (
                <p className="text-gray-400">No characters added yet.</p>
            ) : (
                <ul className="list-disc list-inside">  
                    {quest.npcs.map((npc, index) => (
                        <li key={index} className="text-gray-300">{npc}</li>
                    ))}
                </ul>
            )}
        </div>
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-2">Locations</h1>
            {quest.locations.length === 0 ? (
                <p className="text-gray-400">No locations added yet.</p>
            ) : (
                <ul className="list-disc list-inside">  
                    {quest.locations.map((location, index) => (
                        <li key={index} className="text-gray-300">{location}</li>
                    ))}
                </ul>
            )}
        </div>
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-2">Rewards</h1>
            {quest.rewards.length === 0 ? (
                <p className="text-gray-400">No rewards added yet.</p>
            ) : (
                <ul className="list-disc list-inside">  
                    {quest.rewards.map((reward, index) => (
                        <li key={index} className="text-gray-300">{reward}</li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  )
}