import { useEffect, useState } from "react"
import { NavLink, useParams, useMatch } from "react-router-dom"

type CharacterSection = {
  id: number
  campaignId?: string | number
  name: string
  color: string
}

const STORAGE_KEY = "fabularium.campaigns.character_section"

function rand<T>(arr: T[]) {
  return arr[Math.floor(Math.random() * arr.length)]
}

function generateName() {
  const adjectives = [
    "Stupid",
    "Tough",
    "Lust Hungry",
    "Fishy",
    "Salty",
    "Barbarous",
    "Petite",
    "Ambiguous",
    "Abusive",
    "Supercalifragilistic"
  ]
  const places = [
    "Xerxes",
    "Konrad",
    "Neal",
    "Nadia",
    "Marok",
    "Ziel"
  ]
  return `${rand(adjectives)} ${rand(places)}`
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

function loadFromSession(): CharacterSection[] {
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

function saveToSession(list: CharacterSection[]) {
  try {
    sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
  } catch (e) {
    // ignore
  }
}

function CharacterSection() {
  const params = useParams<{ campaignId?: string }>()
  const match = useMatch("/InCampaign/:campaignId/*")
  
  const campaignId = params.campaignId ?? match?.params.campaignId ?? null
  const [characters, setCharacters] = useState<CharacterSection[]>(() => loadFromSession())

  useEffect(() => {
    saveToSession(characters)
  }, [characters])

  function handleAdd() {
    if (!campaignId) return;
    setCharacters((prev) => {
      const next: CharacterSection = {
        id: Date.now(),
        campaignId: campaignId,
        name: generateName(), 
        color: generateColor(),
      }
      const updated = [...prev, next]
      return updated
    })
  }
  const visible = campaignId ? characters.filter(c => String(c.campaignId) === String(campaignId)) : []

  return (
    <div className="pt-6 px-6">
      <div className="max-w-[1200px] mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl md:text-4xl font-bold mb-6">Characters</h1>
          <NavLink to={campaignId ? `/InCampaign/${campaignId}/Character/New` : '#'}>
            <button className="bg-orange-900/80 px-4 py-2 rounded-md hover:bg-orange-700/80 cursor-pointer" onClick={handleAdd} disabled={!campaignId}>
             <p>Create New</p>
            </button>
          </NavLink>
        </div>
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visible.map((c) => (
            <NavLink 
              key={c.id} to={`/InCampaign/${campaignId}/Character/${c.id}`}>
              <button className="w-full aspect-square rounded-lg overflow-hidden shadow hover:scale-[1.03] transition-transform cursor-pointer">
                <div className="h-full grid grid-rows-[80%_20%]">
                  {/* top 80% - graphic */}
                    <div className={`${c.color} flex items-center justify-center`}></div>
                  {/* bottom 20% - name */}
                  <div className="bg-gray-800 flex items-center justify-center px-2">
                    <span className="text-sm font-medium text-gray-100 text-center">{c.name}</span>
                  </div>
                </div>
              </button>
            </NavLink>
          ))}
        </div>
      </div>
    </div>
  )
}

export default CharacterSection
