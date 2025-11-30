import { useParams, useNavigate } from "react-router-dom"

type Stat = {
  name: string
  value: number
  skills?: Record<string, number>
}

type CharacterSection = {
  id: number
  campaignId?: string | number
  name: string
  color: string
  description?: string
  level?: number
  profBonus?: number
  characterClass?: string
  characterRace?: string
  characterSubclass?: string
  stats?: Stat[]
  skillProf?: Record<string, number>
  equipment?: string[]
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
  const { id, characterId } = useParams<{ id?: string; characterId?: string }>()
  const navigate = useNavigate()
  const characters = loadFromSession()
  const char = characters.find((c) => c.id === Number(characterId ?? id))

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

      {char.description && (
        <p className="mt-2 text-gray-300">{char.description}</p>
      )}

      <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
        <div>Level: <span className="font-medium">{char.level ?? '—'}</span></div>
        <div>Proficiency Bonus: <span className="font-medium">{char.profBonus ?? '—'}</span></div>
        <div>Class: <span className="font-medium">{char.characterClass ?? '—'}</span></div>
        <div>Race: <span className="font-medium">{char.characterRace ?? '—'}</span></div>
        {char.characterSubclass && (
          <div>Subclass: <span className="font-medium">{char.characterSubclass}</span></div>
        )}
      </div>

      {char.stats && char.stats.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Stats</h3>
          <div className="grid grid-cols-3 gap-3 mt-2">
            {char.stats.map((s) => (
              <div key={s.name} className="p-2 bg-gray-800 rounded">
                <div className="font-medium">{s.name}</div>
                <div className="text-sm">Value: {s.value}</div>
                {s.skills && Object.keys(s.skills).length > 0 && (
                  <div className="mt-2 text-xs">
                    {Object.entries(s.skills).map(([k, v]) => (
                      <div key={k} className="flex justify-between">
                        <span>{k}</span>
                        <span>{v}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {char.equipment && char.equipment.length > 0 && (
        <div className="mt-6">
          <h3 className="font-semibold">Equipment</h3>
          <ul className="list-disc list-inside mt-2">
            {char.equipment.map((it, idx) => (
              <li key={idx} className="text-sm">{it}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}