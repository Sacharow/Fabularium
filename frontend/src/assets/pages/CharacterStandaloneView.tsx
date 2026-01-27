import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { characterService } from "../../services/characterService";

export default function CharacterStandaloneView() {
  const { characterId } = useParams();
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
    characterService.getCharacterById(characterId)
      .then(setCharacter)
      .catch(e => setError(e.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;
  if (!character) return <div className="p-6">Character not found.</div>;

  // Helper to get class/race name by id
  const getClassName = (id: string) => {
    const found = classes.find((c: any) => c.id === id);
    return found ? found.name : '—';
  };
  const getRaceName = (id: string) => {
    const found = races.find((r: any) => r.id === id);
    return found ? found.name : '—';
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">{character.name}</h1>
      <div className="mb-2">Level: {character.level}</div>
        <div className="mb-2">XP: {character.xp ?? '—'}</div>
      <div className="mb-2">Class: {character.class?.name ?? getClassName(character.classId)}</div>
      <div className="mb-2">Race: {character.race?.name ?? getRaceName(character.raceId)}</div>
        <div className="mb-2">Subrace: {character.subRace?.name ?? character.subraceId ?? '—'}</div>
        <div className="mb-2">Subclass: {character.subclass?.name ?? character.subclassId ?? '—'}</div>
        <div className="mb-2">Size: {character.size ?? character.race?.size ?? '—'}</div>
        <div className="mb-2">Speed: {character.race?.speed ?? '—'} ft.</div>
        <div className="mb-2">Languages: {character.race?.languages ?? '—'}</div>
        <div className="mb-2">Inspiration: {character.inspiration ? 'Yes' : 'No'}</div>
      <div className="mb-2">Alignment: {character.alignment ?? '—'}</div>
      <div className="mb-2">Background: {character.background ?? '—'}</div>
        <div className="mb-2">Personality Traits: {character.personalityTraits ?? '—'}</div>
        <div className="mb-2">Ideals: {character.ideals ?? '—'}</div>
        <div className="mb-2">Bonds: {character.bonds ?? '—'}</div>
        <div className="mb-2">Flaws: {character.flaws ?? '—'}</div>
      {character.stats && (
        <div className="mt-4">
          <h2 className="font-semibold mb-2">Stats</h2>
          <ul className="grid grid-cols-2 gap-2">
            <li>STR: {character.stats.str}</li>
            <li>DEX: {character.stats.dex}</li>
            <li>CON: {character.stats.con}</li>
            <li>INT: {character.stats.int}</li>
            <li>WIS: {character.stats.wis}</li>
            <li>CHA: {character.stats.cha}</li>
          </ul>
        </div>
      )}
    </div>
  );
}