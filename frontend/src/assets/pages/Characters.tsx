import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { characterService } from "../../services/characterService";

interface Character {
  id: string;
  name: string;
  color?: string;
  class?: { name: string };
  race?: { name: string };
  characterClass?: string;
  characterRace?: string;
}

function Characters() {
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<Character[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setLoading(true);
    characterService
      .getCharacters()
      .then(setCharacters)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-4xl font-bold">Characters</h1>
        <button
          className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer"
          onClick={() => navigate("/characters/new")}
        >
          Create New
        </button>
      </div>
      {loading && <div>Loading...</div>}
      {error && <div className="text-red-600">{error}</div>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {characters.map((char) => (
          <div
            key={char.id}
            className="bg-orange-900 rounded-lg p-4 flex flex-col items-center justify-center shadow min-h-[220px] text-center hover:bg-orange-800 transition-all duration-200 group hover:scale-110 hover:ring-4 hover:ring-orange-400/60 cursor-pointer"
          >
            <div
              className={`w-20 h-20 rounded-full mb-2 flex items-center justify-center bg-orange-700`}
              title="Zobacz postać"
              onClick={() => navigate(`/characters/${char.id}`)}
            >
              <span className="text-3xl text-white group-hover:drop-shadow-lg">
                🎲
              </span>
            </div>
            <div className="font-bold text-lg mb-1">{char.name}</div>
            <div className="text-orange-300 text-sm mb-2">
              {char.class?.name || char.characterClass || "—"} •{" "}
              {char.race?.name || char.characterRace || "—"}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Characters;
