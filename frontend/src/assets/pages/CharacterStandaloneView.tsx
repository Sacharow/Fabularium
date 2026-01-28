import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { characterService } from "../../services/characterService";

export default function CharacterStandaloneView() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [classes, setClasses] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);

  useEffect(() => {
    characterService.getClasses().then(setClasses);
    characterService.getRaces().then(setRaces);
  }, []);

  useEffect(() => {
    if (!characterId) return;
    setLoading(true);
    characterService
      .getCharacterById(characterId)
      .then(setCharacter)
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!character) return <div className="p-6">Character not found.</div>;

  // Helper to get class/race name by id
  const getClassName = (id: string) => {
    const found = classes.find((c: any) => c.id === id);
    return found ? found.name : "—";
  };
  const getRaceName = (id: string) => {
    const found = races.find((r: any) => r.id === id);
    return found ? found.name : "—";
  };

  return (
    <div className="max-w-3xl mx-auto py-10">
      <div className="bg-orange-900 rounded-lg shadow-lg p-8">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-4xl font-bold text-orange-100 text-center flex-1">
            {character.name}
          </h1>
          <div className="flex gap-2 ml-4">
            <button
              className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-base transition cursor-pointer"
              onClick={() => navigate(`/characters/${characterId}/edit`)}
            >
              Edit
            </button>
            <button
              className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded text-base transition cursor-pointer"
              onClick={async () => {
                if (window.confirm("Na pewno usunąć postać?")) {
                  try {
                    await characterService.deleteCharacter(characterId!);
                    navigate("/characters");
                  } catch {
                    alert("Błąd przy usuwaniu postaci");
                  }
                }
              }}
            >
              Delete
            </button>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Level:</span>{" "}
              {character.level}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Class:</span>{" "}
              {character.class?.name ?? getClassName(character.classId)}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Race:</span>{" "}
              {character.race?.name ?? getRaceName(character.raceId)}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Subrace:</span>{" "}
              {character.subRace?.name ?? character.subraceId ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Subclass:</span>{" "}
              {character.subclass?.name ?? character.subclassId ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Size:</span>{" "}
              {character.size ?? character.race?.size ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Speed:</span>{" "}
              {character.race?.speed ?? "—"} ft.
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Languages:</span>{" "}
              {character.race?.languages ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Alignment:</span>{" "}
              {character.alignment ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Background:</span>{" "}
              {character.background ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">XP:</span>{" "}
              {character.xp ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">
                Inspiration:
              </span>{" "}
              {character.inspiration ? "Yes" : "No"}
            </div>
          </div>
          <div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">
                Personality Traits:
              </span>{" "}
              {character.personalityTraits ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Ideals:</span>{" "}
              {character.ideals ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Bonds:</span>{" "}
              {character.bonds ?? "—"}
            </div>
            <div className="mb-3 text-lg text-orange-200">
              <span className="font-semibold text-orange-300">Flaws:</span>{" "}
              {character.flaws ?? "—"}
            </div>
            {character.stats && (
              <div className="mt-6">
                <h2 className="font-semibold text-orange-200 mb-2 text-xl">
                  Stats
                </h2>
                <ul className="grid grid-cols-2 gap-2">
                  <li className="bg-orange-800/60 rounded p-2 text-orange-100">
                    STR: {character.stats.str}
                  </li>
                  <li className="bg-orange-800/60 rounded p-2 text-orange-100">
                    DEX: {character.stats.dex}
                  </li>
                  <li className="bg-orange-800/60 rounded p-2 text-orange-100">
                    CON: {character.stats.con}
                  </li>
                  <li className="bg-orange-800/60 rounded p-2 text-orange-100">
                    INT: {character.stats.int}
                  </li>
                  <li className="bg-orange-800/60 rounded p-2 text-orange-100">
                    WIS: {character.stats.wis}
                  </li>
                  <li className="bg-orange-800/60 rounded p-2 text-orange-100">
                    CHA: {character.stats.cha}
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
