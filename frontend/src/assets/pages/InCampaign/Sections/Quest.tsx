import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"

const sectionData = {
    name: "Quest"
}

type ItemSection = {
  id: string
  campaignId?: string
  name: string
  description?: string
  locations: string[]
  locationId?: string[]
  npcs: string[]
  npcId?: string[]
  rewards: string[]
}

export default function QuestPage() {
  const { questId, campaignId } = useParams<{ questId?: string; campaignId?: string }>()
  const navigate = useNavigate()
  const [quests, setQuests] = useState<ItemSection[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const cid = campaignId
    if (!cid) {
      setLoading(false)
      return
    }
    setLoading(true)
    fetch(`http://localhost:3000/api/campaigns/${cid}`, { credentials: 'include' })
      .then(async (res) => {
        if (!res.ok) throw new Error('Failed to fetch campaign')
        return res.json()
      })
      .then((data) => {
        const ms = Array.isArray(data.missions) ? data.missions.map((m: any) => {
          // name/title
          const name = m.title ?? m.name ?? ''
          const description = m.description ?? ''

          // locations: try to resolve related location name(s)
          let locations: string[] = []
          if (m.location && typeof m.location === 'object') locations = [m.location.name ?? String(m.location.id ?? '')]
          else if (Array.isArray(m.locations)) locations = m.locations.map((l: any) => (typeof l === 'string' ? l : (l?.name ?? String(l?.id ?? ''))))

          // npcs: try to resolve names
          let npcs: string[] = []
          if (Array.isArray(m.npcs)) npcs = m.npcs.map((n: any) => (typeof n === 'string' ? n : (n?.name ?? String(n?.id ?? ''))))

          // rewards: accept array of strings
          const rewards: string[] = Array.isArray(m.rewards) ? m.rewards.map((r: any) => String(r)) : []

          return {
            id: String(m.id),
            campaignId: cid,
            name,
            description,
            locations,
            locationId: m.locationId ? [String(m.locationId)] : (Array.isArray(m.locationId) ? m.locationId.map(String) : []),
            npcs,
            npcId: Array.isArray(m.npcId) ? m.npcId.map(String) : (m.npcId ? [String(m.npcId)] : []),
            rewards
          } as ItemSection
        }) : []
        setQuests(ms)
      })
      .catch((e) => {
        console.error('Failed to load missions', e)
      })
      .finally(() => setLoading(false))
  }, [campaignId])

  if (loading) return <div className="p-6">Loading...</div>

  const quest = quests.find((i) => String(i.id) === String(questId))

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