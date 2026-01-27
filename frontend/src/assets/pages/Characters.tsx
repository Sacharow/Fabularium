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

  const handleEdit = (id: string) => {
    navigate(`/characters/${id}/edit`);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm("Na pewno usunąć postać?")) return;
    try {
      await characterService.deleteCharacter(id);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    } catch {
      alert("Błąd przy usuwaniu postaci");
      console.log(error);
      setCharacters((prev) => prev.filter((c) => c.id !== id));
    }
  };

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
            className="bg-orange-900 rounded-lg p-4 flex flex-col items-center justify-center shadow min-h-[220px] text-center"
          >
            <div
              className={`w-16 h-16 rounded-full mb-2 flex items-center justify-center ${char.color}`}
            />
            <div className="font-bold text-lg mb-1">{char.name}</div>
            <div className="text-orange-300 text-sm mb-2">
              {char.class?.name || char.characterClass || "—"} •{" "}
              {char.race?.name || char.characterRace || "—"}
            </div>
            <div className="flex gap-2 mt-2 justify-center">
              <button
                className="bg-orange-700 hover:bg-orange-600 text-white text-xs py-1 px-3 rounded cursor-pointer"
                onClick={() => navigate(`/characters/${char.id}`)}
              >
                View
              </button>
              <button
                className="bg-orange-600 hover:bg-orange-800 text-white text-xs py-1 px-3 rounded cursor-pointer"
                onClick={() => handleEdit(char.id)}
              >
                Edit
              </button>
              <button
                className="bg-red-700 hover:bg-red-900 text-white text-xs py-1 px-3 rounded cursor-pointer"
                onClick={() => handleDelete(char.id)}
                title="Usuń postać"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default Characters;
