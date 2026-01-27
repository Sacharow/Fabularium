import { useEffect, useState } from "react"
import { useParams, useNavigate, NavLink } from "react-router-dom"

const sectionData = {
    name: "Note"
}

type ItemSection = {
  id: string
  campaignId?: string
  name: string
  description?: string
}

export default function NotePage() {
  const { noteId, campaignId } = useParams<{ noteId?: string; campaignId?: string }>()
  const navigate = useNavigate()
  const [notes, setNotes] = useState<ItemSection[]>([])
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
        const ns = Array.isArray(data.notes) ? data.notes.map((n: any) => ({ id: String(n.id), campaignId: cid, name: n.name ?? '', description: n.description ?? '' })) : []
        setNotes(ns)
      })
      .catch((e) => {
        console.error('Failed to load notes', e)
      })
      .finally(() => setLoading(false))
  }, [campaignId])

  if (loading) return <div className="p-6">Loading...</div>

  const note = notes.find((i) => String(i.id) === String(noteId))

  if (!note) {
    return (
      <div className="p-6">
        <p>{sectionData.name} not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">Go back</button>
      </div>
    )
  }

  const introData = {
    currentSection: "Note Section",
    urlName: "NoteView"
  };


  return (
    <div className="p-6">
      <div className="pb-4">
        <div className="max-w-6xl mx-auto">
          <p className="text-gray-500 text-sm ">
            <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
            <span> / </span>
            <NavLink to={`/InCampaign/${note?.campaignId}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.currentSection}</NavLink>
            <span> / </span>
            <NavLink to="#" className="cursor-pointer hover:text-gray-400"> {note.name}</NavLink>
          </p>
        </div>

      </div>
      <div className="max-w-6xl mx-auto grid gap-6 md:grid-cols-[320px_1fr]">
        <div className="bg-orange-700/30 rounded-md p-4">
            <h1 className="text-2xl font-bold mb-4">{note.name}</h1>
            <p className="text-gray-300 whitespace-pre-wrap">{note.description || "No description provided."}</p>
        </div>
      </div>
    </div>
  )
}