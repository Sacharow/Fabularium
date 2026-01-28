import { useEffect, useState } from "react";
import CampaignCard from "../components/helper/CampaignCard";
import AddCampaignTile from "../components/helper/AddCampaignTile";

type Campaign = {
  id: string | number;
  name: string;
  color: string;
  ownerId?: string | number;
  contributors?: Array<{ id: string | number }>;
};

type User = {
  id: string | number;
  name: string;
};

function Campaigns() {
  const [campaigns, setCampaigns] = useState<Campaign[]>([]);
  const [user, setUser] = useState<User | null>(null);
  const [joinCode, setJoinCode] = useState("");
  const [joinError, setJoinError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch current user
    fetch("http://localhost:3000/api/users/me", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => setUser(data))
      .catch(() => setUser(null));
  }, []);

  useEffect(() => {
    // Fetch campaigns from backend
    fetch("http://localhost:3000/api/campaigns", { credentials: "include" })
      .then((res) => res.json())
      .then((data) => {
        // Ustaw domyślny kolor jeśli nie ma
        const campaignsWithColor = data.map((c: Campaign) => ({
          ...c,
          color: c.color || "bg-orange-500",
        }));
        setCampaigns(campaignsWithColor);
      })
      .catch(() => setCampaigns([]));
  }, []);

  // Only show campaigns where user is owner or contributor
  const visibleCampaigns = campaigns.filter((c) => {
    if (!user) return false;
    if (c.ownerId && c.ownerId === user.id) return true;
    if (
      Array.isArray(c.contributors) &&
      c.contributors.some((con) => con.id === user.id)
    )
      return true;
    return false;
  });

  const handleJoin = async () => {
    setJoinError(null);
    if (!joinCode.trim()) {
      setJoinError("Podaj kod dołączenia.");
      return;
    }
    if (!user?.id) {
      setJoinError("Nie jesteś zalogowany.");
      return;
    }
    try {
      const res = await fetch("http://localhost:3000/api/campaigns/join", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ joinCode: joinCode.trim(), userId: user.id }),
      });
      if (!res.ok) {
        const err = await res.json();
        setJoinError(err.message || "Nie udało się dołączyć do kampanii.");
        return;
      }
      setJoinCode("");
      // Optionally, refresh campaigns
      fetch("http://localhost:3000/api/campaigns", { credentials: "include" })
        .then((res) => res.json())
        .then((data) => {
          const campaignsWithColor = data.map((c: Campaign) => ({
            ...c,
            color: c.color || "bg-orange-500",
          }));
          setCampaigns(campaignsWithColor);
        })
        .catch(() => setCampaigns([]));
    } catch (e) {
      setJoinError("Błąd połączenia z serwerem.");
    }
  };

  return (
    <div className="pt-6 px-6">
      <div className="max-w-[1200px] mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-6">Campaigns</h1>

        {/* Join by code */}
        <div className="mb-8 flex flex-col sm:flex-row items-center gap-4">
          <input
            type="text"
            className="border border-orange-400 rounded px-4 py-2 w-full sm:w-64"
            placeholder="Wpisz kod dołączenia..."
            value={joinCode}
            onChange={(e) => setJoinCode(e.target.value)}
          />
          <button
            className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
            onClick={handleJoin}
          >
            Join Campaign
          </button>
        </div>
        {joinError && <div className="text-red-600 mb-4">{joinError}</div>}

        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {visibleCampaigns.map((c) => (
            <CampaignCard
              key={String(c.id)}
              name={c.name}
              id={String(c.id)}
              color={String(c.color)}
            />
          ))}

          {/* 'Add' tile is always last */}
          <AddCampaignTile />
        </div>
      </div>
    </div>
  );
}

export default Campaigns;
