import { useParams, useNavigate } from "react-router-dom"

type CharacterSection = {
  id: number
  name: string
  color: string
}

const STORAGE_KEY = "fabularium.campaigns.character_section"

function loadFromSession(): CharacterSection[] {
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

export default function CharacterPage() {
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const characters = loadFromSession()
  const char = characters.find((c) => c.id === Number(id))

  if (!char) {
    return (
      <div className="p-6">
        <p>Character not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go back</button>
      </div>
    )
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold">{char.name}</h2>
      <div className={`w-20 h-20 rounded-md mt-4 ${char.color}`} />
      <p className="mt-4">ID: {char.id}</p>
      {/* add more fields / edit UI here */}
    </div>
  )
}