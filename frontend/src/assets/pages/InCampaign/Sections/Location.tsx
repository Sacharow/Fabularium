import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"

const sectionData = {
    name: "Location"
}

type ItemSection = {
  id: string
  campaignId?: string | number
  name: string
  color: string
  description?: string
  npcs: string[]
  npcId?: number[]
  quests: string[]
  questId?: number[]
}

// Fetch locations from backend instead of sessionStorage
async function fetchLocations(campaignId: string | undefined): Promise<ItemSection[]> {
  if (!campaignId) return []
  try {
    const res = await fetch(`http://localhost:3000/api/campaigns/${campaignId}/locations`, { credentials: 'include' })
    if (!res.ok) return []
    const data = await res.json()
    if (!Array.isArray(data)) return []
    return data.map((p: any) => ({
      id: String(p.id ?? Date.now()),
      campaignId: p.campaignId ?? campaignId,
      name: p.name ?? p.title ?? String(p.id ?? ''),
      color: p.color ?? 'bg-slate-400',
      description: p.description ?? p.desc ?? '',
      // map missions returned from backend to quests list (use title)
      quests: Array.isArray(p.missions) ? p.missions.map((m: any) => m.title ?? m.name ?? String(m.id ?? '')) : (Array.isArray(p.quests) ? p.quests : (Array.isArray(p.quest) ? p.quest : [])),
      questId: Array.isArray(p.missions) ? p.missions.map((m: any) => String(m.id)) : (Array.isArray(p.questId) ? p.questId.map(String) : (p.questId ? [String(p.questId)] : [])),
      // map NPC objects to names
      npcs: Array.isArray(p.npcs) ? p.npcs.map((n: any) => (typeof n === 'string' ? n : (n?.name ?? String(n?.id ?? '')))) : (Array.isArray(p.npc) ? p.npc : []),
      npcId: Array.isArray(p.npcId) ? p.npcId.map(String) : (p.npcId ? [String(p.npcId)] : [])
    }))
  } catch (e) {
    return []
  }
}

export default function LocationPage() {
  const { locationId } = useParams<{ locationId?: string; campaignId?: string }>()
  const navigate = useNavigate()
  const [locations, setLocations] = useState<ItemSection[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  useEffect(() => {
    const campaignId = (window.location.pathname.split('/')[2]) || null
    if (!campaignId) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetchLocations(campaignId ?? undefined)
      .then(setLocations)
      .catch(() => setLocations([]))
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <div className="p-6">Loading...</div>

  const loc = locations.find((i) => String(i.id) === String(locationId))

  if (!loc) {
    return (
      <div className="p-6">
        <p>{sectionData.name} not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go back</button>
      </div>
    )
  }

  const introData = {
    currentSection: "Location Section",
    urlName: "LocationView"
  };


  return (
    <div className="p-6">
      <div className="pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm ">
            <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
            <span> / </span>
            <NavLink to={`/InCampaign/${loc?.campaignId}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.currentSection}</NavLink>
            <span> / </span>
            <NavLink to="#" className="cursor-pointer hover:text-gray-400"> {loc.name}</NavLink>
          </p>
        </div>

      </div>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-3">
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-4">{loc.name}</h1>
            <p className="text-gray-300 whitespace-pre-wrap">{loc.description || "No description provided."}</p>
        </div>
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-2">Characters</h1>
            {(loc.npcs ?? []).length === 0 ? (
                <p className="text-gray-400">No characters added yet.</p>
            ) : (
                <ul className="list-disc list-inside">
                    {(loc.npcs ?? []).map((npc, index) => (
                        <li key={index} className="text-gray-300">{npc}</li>
                    ))}
                </ul>
            )}
        </div>
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-2">Quests</h1>
            {(loc.quests ?? []).length === 0 ? (
                <p className="text-gray-400">No quests added yet.</p>
            ) : (
                <ul className="list-disc list-inside">
                    {(loc.quests ?? []).map((q, index) => (
                        <li key={index} className="text-gray-300">{q}</li>
                    ))}
                </ul>
            )}
        </div>
      </div>
    </div>
  )
}