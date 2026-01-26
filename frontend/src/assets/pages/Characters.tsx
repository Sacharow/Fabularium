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
    characterService.getCharacters()
      .then(setCharacters)
      .catch(e => setError(e.message))
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
          <div key={char.id} className="bg-orange-900 rounded-lg p-4 flex flex-col items-center shadow">
            <div className={`w-16 h-16 rounded-full mb-2 ${char.color}`} />
            <div className="font-bold text-lg mb-1">{char.name}</div>
            <div className="text-orange-300 text-sm mb-2">
              {(char.class?.name || char.characterClass || '—')} • {(char.race?.name || char.characterRace || '—')}
            </div>
            <button
              className="bg-orange-700 hover:bg-orange-600 text-white text-xs py-1 px-3 rounded"
              onClick={() => navigate(`/characters/${char.id}`)}
            >
              View
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Characters;
