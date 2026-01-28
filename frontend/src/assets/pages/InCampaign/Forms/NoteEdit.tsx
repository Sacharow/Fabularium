import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";

export default function NoteEdit() {
  // Navigation
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string; noteId?: string }>();

  // Basic info
  const [name, setName] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(true);

  // Load note data
  useEffect(() => {
    const campaignId = params.campaignId;
    const noteId = params.noteId;

    if (!campaignId || !noteId) {
      alert("Missing campaign or note id");
      navigate(-1);
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch campaign");
        return res.json();
      })
      .then((campaign) => {
        // Find note in notes
        const note = Array.isArray(campaign.notes)
          ? campaign.notes.find((n: any) => n.id === noteId)
          : null;

        if (!note) throw new Error("Note not found");

        setName(note.name ?? "");
        setDescription(note.description ?? "");
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load note", e);
        alert("Failed to load note");
        navigate(-1);
      });
  }, [params.campaignId, params.noteId, navigate]);

  const saveNote = () => {
    if (name.trim() === "") {
      alert("Note title cannot be empty.");
      return;
    }

    const campaignId = params.campaignId;
    const noteId = params.noteId;

    if (!campaignId || !noteId) {
      alert("Missing campaign or note id");
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/notes/${noteId}`, {
      method: "PUT",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, description }),
    })
      .then(async (res) => {
        if (!res.ok) {
          const txt = await res.text();
          throw new Error(txt || "Failed to update note");
        }
        return res.json();
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/Notes/${noteId}`);
      })
      .catch((e) => {
        console.error("Failed to update note", e);
        alert("Failed to update note");
      });
  };

  const deleteNote = () => {
    if (!window.confirm("Are you sure you want to delete this note?")) return;

    const campaignId = params.campaignId;
    const noteId = params.noteId;

    if (!campaignId || !noteId) {
      alert("Missing campaign or note id");
      return;
    }

    fetch(`http://localhost:3000/api/campaigns/${campaignId}/notes/${noteId}`, {
      method: "DELETE",
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to delete note");
      })
      .then(() => {
        navigate(`/InCampaign/${campaignId}/NoteView`);
      })
      .catch((e) => {
        console.error("Failed to delete note", e);
        alert("Failed to delete note");
      });
  };

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  const inputGameplayInformation = `bg-orange-900/80 w-full rounded-md border border-orange-700 text-orange-50 px-3 py-2`;
  const subTitleGameplayInformation = `text-orange-200 py-2 font-semibold`;
  const { campaignId } = useParams<{ campaignId?: string }>();

  const introData = {
    currentSection: "Note Section",
    urlName: "NoteView",
  };

  return (
    <div className="pt-6">
      <div className="w-full">
        <div className="grid grid-cols-8">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className="pb-4">
              <p className="text-orange-200 text-sm ">
                <NavLink
                  to="/campaigns"
                  className="cursor-pointer hover:text-orange-400"
                >
                  Campaigns
                </NavLink>
                <span> / </span>
                <NavLink
                  to={`/InCampaign/${campaignId}/${introData.urlName}`}
                  className="cursor-pointer hover:text-orange-400"
                >
                  {introData.urlName}
                </NavLink>
                <span> / </span>
                <NavLink
                  to="#"
                  className="cursor-pointer hover:text-orange-400"
                >
                  {" "}
                  Edit
                </NavLink>
              </p>
            </div>
            <div className="flex justify-between items-center">
              <h1 className="text-4xl font-bold mb-6 text-white">Edit Note</h1>
              <div className="flex gap-2">
                <button
                  className="bg-red-700 hover:bg-red-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={deleteNote}
                >
                  Delete
                </button>
                <button
                  className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
                  onClick={saveNote}
                >
                  Save Note
                </button>
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className={subTitleGameplayInformation}>Title</div>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputGameplayInformation}
              placeholder="Note title"
            />
            <div className={subTitleGameplayInformation}>Content</div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className={`${inputGameplayInformation} h-64`}
              placeholder="Note content"
            />
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
