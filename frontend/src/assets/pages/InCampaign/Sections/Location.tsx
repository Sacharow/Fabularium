import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"

const sectionData = {
    name: "Location"
}

type ItemSection = {
  id: number
  campaignId?: string | number
  name: string
  color: string
  description?: string
}

const STORAGE_KEY = "fabularium.campaigns.location_section"

function loadFromSession(): ItemSection[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    if (!Array.isArray(parsed)) return []
    return parsed
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

export default function LocationPage() {
  const { locationId } = useParams<{ locationId?: string; campaignId?: string }>()
  const navigate = useNavigate()
  const [locations] = useState<ItemSection[]>(() => loadFromSession())
  useEffect(() => {
    saveToSession(locations)
  }, [locations])

  const loc = locations.find((i) => i.id === Number(locationId))

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
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-4">{loc.name}</h1>
            <p className="text-gray-300 whitespace-pre-wrap">{loc.description || "No description provided."}</p>
        </div>
      </div>
    </div>
  )
}