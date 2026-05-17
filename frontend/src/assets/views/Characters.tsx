import { useEffect, useState } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { characterService } from "../../services/characterService";
import CharacterCard from "../components/CharacterCard";

interface Character {
  id: string;
  name: string;
  level: number;
  race: string;
  class: string;
  hp: number;
  speed: number;
  armorClass: number;
  connectedCampaign: string;
  campaignId?: string;
}

function Characters() {
  const { isAuthenticated, isLoading: authLoading } = useAuth();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCharacters = async () => {
      try {
        setLoading(true);
        const data = await characterService.getCharacters();
        setCharacters(data);
        console.log(data);

        setError(null);
      } catch (err: any) {
        setError(err.message || "Failed to load characters");
        setCharacters([]);
      } finally {
        setLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchCharacters();
    }
  }, [isAuthenticated]);

  if (authLoading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/sign-in" replace />;
  }

  if (loading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading characters...
      </div>
    );
  }

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <h1 className="text-2xl font-bold tracking-widest">MY CHARACTERS</h1>
      {error && (
        <div className="bg-red-900 border border-error p-4 rounded text-error">
          {error}
        </div>
      )}
      {characters.length === 0 ? (
        <div className="text-gray-light">
          No characters yet. Create your first character to get started!
        </div>
      ) : (
        <div className="grid grid-cols-4 gap-8">
          {characters.map((character) => (
            <CharacterCard
              key={character.id}
              id={character.id}
              name={character.name}
              level={character.level}
              race={character.race}
              characterClass={character.class}
              hp={character.hp}
              speed={character.speed}
              armorClass={character.armorClass}
              connectedCampaign={character.connectedCampaign}
              campaignId={character.campaignId}
            />
          ))}
        </div>
      )}
    </div>
  );
}

export default Characters;
