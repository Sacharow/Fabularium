import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

const sectionData = {
  name: "Note",
};

type ItemSection = {
  id: string;
  campaignId?: string;
  name: string;
  description?: string;
};

export default function NotePage() {
  const { noteId, campaignId } = useParams<{
    noteId?: string;
    campaignId?: string;
  }>();
  const navigate = useNavigate();
  const [notes, setNotes] = useState<ItemSection[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const cid = campaignId;
    if (!cid) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`http://localhost:3000/api/campaigns/${cid}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((data) => {
        const ns = Array.isArray(data.notes)
          ? data.notes.map((n: any) => ({
              id: String(n.id),
              campaignId: cid,
              name: n.name ?? "",
              description: n.description ?? "",
            }))
          : [];
        setNotes(ns);
      })
      .catch((e) => {
        console.error("Failed to load notes", e);
      })
      .finally(() => setLoading(false));
  }, [campaignId]);

  if (loading) return <div className="p-6">Loading...</div>;

  const note = notes.find((i) => String(i.id) === String(noteId));

  if (!note) {
    return (
      <div className="p-6">
        <p>{sectionData.name} not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">
          Go back
        </button>
      </div>
    );
  }

  const introData = {
    currentSection: "Note Section",
    urlName: "NoteView",
  };

  return (
    <div className="p-6">
      <div className="pb-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-orange-200 text-sm font-medium">
            <NavLink
              to="/campaigns"
              className="cursor-pointer hover:text-orange-400 transition"
            >
              Campaigns
            </NavLink>
            <span className="mx-2">→</span>
            <NavLink
              to={`/InCampaign/${note?.campaignId}/${introData.urlName}`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              {introData.currentSection}
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{note.name}</span>
          </p>
        </div>
      </div>

      <div className="max-w-3xl mx-auto">
        {/* Main Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-lg bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center text-3xl shadow-lg">
                📝
              </div>
              <div>
                <h1 className="text-5xl font-bold text-white mb-1">
                  {note.name}
                </h1>
                <p className="text-orange-200 text-sm">Personal Note</p>
              </div>
            </div>
            <NavLink
              to={`/InCampaign/${note?.campaignId}/Notes/${note.id}/Edit`}
            >
              <button className="bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-500 hover:to-orange-600 text-white font-semibold py-2 px-6 rounded-lg cursor-pointer transition transform hover:scale-105 shadow-lg">
                ✏️ Edit
              </button>
            </NavLink>
          </div>
        </div>

        {/* Content Card */}
        <div className="bg-gradient-to-br from-orange-800 to-orange-700 rounded-xl p-8 border border-orange-600 shadow-xl">
          <p className="text-orange-50 leading-relaxed whitespace-pre-wrap text-base">
            {note.description || "No content provided."}
          </p>
        </div>
      </div>
    </div>
  );
}
