import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { characterService } from "../../services/characterService";

interface Character {
  id: string;
  name: string;
  level?: number;
  class?: { name: string };
  race?: { name: string };
  characterClass?: string;
  characterRace?: string;
  campaignId?: string | null;
}

function Characters() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCharacters = () => {
    setLoading(true);
    setError(null);
    characterService
      .getCharacters()
      .then(setCharacters)
      .catch((e) => {
        console.error("Failed to load characters:", e);
        setError(e.message || "Failed to load characters");
      })
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    loadCharacters();

    // Listen for character updates from other components
    const handleCharactersUpdated = () => {
      loadCharacters();
    };

    window.addEventListener(
      "fabularium.characters.updated",
      handleCharactersUpdated,
    );
    return () => {
      window.removeEventListener(
        "fabularium.characters.updated",
        handleCharactersUpdated,
      );
    };
  }, []);

  return (
    <div className="max-w-6xl mx-auto py-10 px-4">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold text-white">My Characters</h1>
        <button
          className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
          onClick={() => navigate("/characters/new")}
        >
          Create New
        </button>
      </div>

      {loading && (
        <div className="text-center py-12">
          <p className="text-orange-200">Loading characters...</p>
        </div>
      )}

      {error && (
        <div className="bg-red-900/30 border border-red-700 text-red-300 p-4 rounded mb-4">
          {error}
        </div>
      )}

      {!loading && characters.length === 0 && !error && (
        <div className="text-center py-12">
          <p className="text-orange-200 mb-4">No characters yet</p>
          <button
            className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
            onClick={() => navigate("/characters/new")}
          >
            Create Your First Character
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className="bg-orange-900/40 border border-orange-700 rounded-lg p-4 hover:bg-orange-900/60 transition-all duration-200 group hover:scale-105 hover:ring-2 hover:ring-orange-400/60 cursor-pointer"
            onClick={() => navigate(`/characters/${char.id}`)}
          >
            <div className="flex items-center justify-between mb-3">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-orange-500 to-orange-700 flex items-center justify-center flex-shrink-0">
                <span className="text-xl group-hover:scale-125 transition-transform">
                  🎲
                </span>
              </div>
              {char.level && (
                <span className="text-xs bg-orange-700/50 px-2 py-1 rounded">
                  Lvl {char.level}
                </span>
              )}
            </div>

            <h2 className="font-bold text-lg mb-2 text-orange-100 truncate">
              {char.name}
            </h2>

            <div className="text-sm text-orange-200 mb-3">
              <p className="truncate">
                {char.class?.name || char.characterClass || "—"}
              </p>
              <p className="truncate">
                {char.race?.name || char.characterRace || "—"}
              </p>
            </div>

            {char.campaignId && (
              <div className="text-xs text-orange-400 bg-orange-900/50 px-2 py-1 rounded">
                In Campaign
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}

export default Characters;
