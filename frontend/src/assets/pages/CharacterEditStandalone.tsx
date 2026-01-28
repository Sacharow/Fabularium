import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { characterService } from "../../services/characterService";

const INITIAL_STATS = [
  { name: "Strength", value: 10, modifier: 0, skills: { Athletics: 0 } },
  {
    name: "Dexterity",
    value: 10,
    modifier: 0,
    skills: { Acrobatics: 0, "Sleight of Hand": 0, Stealth: 0 },
  },
  { name: "Constitution", value: 10, modifier: 0 },
  {
    name: "Intelligence",
    value: 10,
    modifier: 0,
    skills: { Arcana: 0, History: 0, Investigation: 0, Nature: 0, Religion: 0 },
  },
  {
    name: "Wisdom",
    value: 10,
    modifier: 0,
    skills: {
      "Animal Handling": 0,
      Insight: 0,
      Medicine: 0,
      Perception: 0,
      Survival: 0,
    },
  },
  {
    name: "Charisma",
    value: 10,
    modifier: 0,
    skills: { Deception: 0, Intimidation: 0, Performance: 0, Persuasion: 0 },
  },
];

const INITIAL_SKILL_PROF: Record<string, number> = {
  Athletics: 0,
  Acrobatics: 0,
  "Sleight of Hand": 0,
  Stealth: 0,
  Arcana: 0,
  History: 0,
  Investigation: 0,
  Nature: 0,
  Religion: 0,
  "Animal Handling": 0,
  Insight: 0,
  Medicine: 0,
  Perception: 0,
  Survival: 0,
  Deception: 0,
  Intimidation: 0,
  Performance: 0,
  Persuasion: 0,
};

export default function CharacterEditStandalone() {
  const { characterId } = useParams();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [raceId, setRaceId] = useState("");
  const [subraceId, setSubraceId] = useState("");
  const [subclassId, setSubclassId] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);
  const [subraces, setSubraces] = useState<any[]>([]);
  const [level, setLevel] = useState(1);
  const [profBonus, setProfBonus] = useState(0);
  const [stats, setStats] = useState(INITIAL_STATS);
  const [skillProf, setSkillProf] =
    useState<Record<string, number>>(INITIAL_SKILL_PROF);
  const [alignment, setAlignment] = useState("");
  const [background, setBackground] = useState("");
  const [bonds, setBonds] = useState("");
  const [flaws, setFlaws] = useState("");
  const [ideals, setIdeals] = useState("");
  const [personalityTraits, setPersonalityTraits] = useState("");
  const [size, setSize] = useState("");
  const [speed, setSpeed] = useState("");
  const [raceDetails, setRaceDetails] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    characterService.getClasses().then(setClasses);
    characterService.getRaces().then(setRaces);
    fetch("/api/subraces", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setSubraces)
      .catch(() => setSubraces([]));
  }, []);

  useEffect(() => {
    if (!characterId) return;
    setLoading(true);
    characterService
      .getCharacterById(characterId)
      .then((data) => {
        setName(data.name || "");
        setDescription(data.description || "");
        setClassId(data.classId || "");
        setRaceId(data.raceId || "");
        setSubraceId(data.subraceId || "");
        setSubclassId(data.subclassId || "");
        setLevel(data.level || 1);
        setAlignment(data.alignment || "");
        setBackground(data.background || "");
        setBonds(data.bonds || "");
        setFlaws(data.flaws || "");
        setIdeals(data.ideals || "");
        setPersonalityTraits(data.personalityTraits || "");
        setSize(data.size || "");
        setSpeed(data.speed || "");
        setStats([
          {
            name: "Strength",
            value: data.stats?.str ?? 10,
            modifier: Math.floor(((data.stats?.str ?? 10) - 10) / 2),
            skills: { Athletics: 0 },
          },
          {
            name: "Dexterity",
            value: data.stats?.dex ?? 10,
            modifier: Math.floor(((data.stats?.dex ?? 10) - 10) / 2),
            skills: { Acrobatics: 0, "Sleight of Hand": 0, Stealth: 0 },
          },
          {
            name: "Constitution",
            value: data.stats?.con ?? 10,
            modifier: Math.floor(((data.stats?.con ?? 10) - 10) / 2),
          },
          {
            name: "Intelligence",
            value: data.stats?.int ?? 10,
            modifier: Math.floor(((data.stats?.int ?? 10) - 10) / 2),
            skills: {
              Arcana: 0,
              History: 0,
              Investigation: 0,
              Nature: 0,
              Religion: 0,
            },
          },
          {
            name: "Wisdom",
            value: data.stats?.wis ?? 10,
            modifier: Math.floor(((data.stats?.wis ?? 10) - 10) / 2),
            skills: {
              "Animal Handling": 0,
              Insight: 0,
              Medicine: 0,
              Perception: 0,
              Survival: 0,
            },
          },
          {
            name: "Charisma",
            value: data.stats?.cha ?? 10,
            modifier: Math.floor(((data.stats?.cha ?? 10) - 10) / 2),
            skills: {
              Deception: 0,
              Intimidation: 0,
              Performance: 0,
              Persuasion: 0,
            },
          },
        ]);
      })
      .catch((e) => setError(e.message))
      .finally(() => setLoading(false));
  }, [characterId]);

  useEffect(() => {
    setStats((prevStats) =>
      prevStats.map((stat) => {
        if (!stat.skills) return stat;
        const updatedSkills = Object.fromEntries(
          Object.entries(stat.skills).map(([skill, _]) => [
            skill,
            stat.modifier + (skillProf[skill] ? profBonus : 0),
          ]),
        );
        return { ...stat, skills: { ...stat.skills, ...updatedSkills } };
      }),
    );
  }, [skillProf, stats.map((s) => s.modifier).join(), profBonus]);

  useEffect(() => {
    if (!raceId) {
      setRaceDetails(null);
      setSize("");
      return;
    }
    const race = races.find((r: any) => r.id === raceId);
    setRaceDetails(race || null);
    setSize(race?.size ?? "");
    setSpeed(race?.speed ?? "");
  }, [raceId, races]);

  useEffect(() => {
    setProfBonus(Math.ceil(level / 4) + 1);
  }, [level]);

  const saveCharacter = async () => {
    if (!name.trim()) return alert("Name required");
    if (!classId) return alert("Class required");
    if (!raceId) return alert("Race required");
    const outOfRangeStat = stats.find((s) => s.value < 1 || s.value > 30);
    if (outOfRangeStat) {
      return alert("Statystyki muszą być w przedziale 1-30");
    }
    if (level < 1 || level > 20) {
      return alert("Level musi być w przedziale 1-20");
    }
    const statsObj = {
      str: stats.find((s) => s.name === "Strength")?.value ?? 10,
      dex: stats.find((s) => s.name === "Dexterity")?.value ?? 10,
      con: stats.find((s) => s.name === "Constitution")?.value ?? 10,
      int: stats.find((s) => s.name === "Intelligence")?.value ?? 10,
      wis: stats.find((s) => s.name === "Wisdom")?.value ?? 10,
      cha: stats.find((s) => s.name === "Charisma")?.value ?? 10,
    };
    const characterData = {
      name,
      description,
      classId,
      raceId,
      subraceId: subraceId || undefined,
      subclassId: subclassId || undefined,
      level,
      stats: statsObj,
      alignment: alignment || undefined,
      background: background || undefined,
      bonds: bonds || undefined,
      flaws: flaws || undefined,
      ideals: ideals || undefined,
      personalityTraits: personalityTraits || undefined,
      size: size || undefined,
      speed: speed || undefined,
    };
    try {
      await characterService.editCharacter(characterId!, characterData);
      navigate(`/characters/${characterId}`);
    } catch (e) {
      alert("Failed to save character");
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 text-red-600">{error}</div>;

  return (
    <div className="max-w-3xl mx-auto py-10">
      <h1 className="text-4xl font-bold mb-8 text-orange-900">
        Edit Character
      </h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Name
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Description
            </label>
            <textarea
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Level
            </label>
            <input
              type="number"
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={level}
              onChange={(e) => setLevel(Number(e.target.value))}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Class
            </label>
            <select
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={classId}
              onChange={(e) => setClassId(e.target.value)}
            >
              <option value="">Select class</option>
              {classes.map((c: any) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Race
            </label>
            <select
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white  cursor-pointer"
              value={raceId}
              onChange={(e) => setRaceId(e.target.value)}
            >
              <option value="">Select race</option>
              {races.map((r: any) => (
                <option key={r.id} value={r.id}>
                  {r.name}
                </option>
              ))}
            </select>
          </div>
          {raceDetails && (
            <div className="mb-4 p-3 bg-orange-900/10 rounded">
              <div className="mb-2">
                <span className="font-semibold text-orange-800">Speed:</span>{" "}
                {raceDetails.speed ?? "—"} ft.
              </div>
              <div className="mb-2">
                <span className="font-semibold text-orange-800">Size:</span>{" "}
                {raceDetails.size ?? "—"}
              </div>
              <div className="mb-2">
                <span className="font-semibold text-orange-800">
                  Languages:
                </span>{" "}
                {raceDetails.languages ?? "—"}
              </div>
            </div>
          )}
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Subrace
            </label>
            <select
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={subraceId}
              onChange={(e) => setSubraceId(e.target.value)}
            >
              <option value="">Select subrace</option>
              {subraces
                .filter((s: any) => !raceId || s.parentRaceId === raceId)
                .map((s: any) => (
                  <option key={s.id} value={s.id}>
                    {s.name}
                  </option>
                ))}
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Subclass
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white  "
              value={subclassId}
              onChange={(e) => setSubclassId(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Size
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={size}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Speed
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={speed}
              readOnly
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Alignment
            </label>
            <select
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={alignment}
              onChange={(e) => setAlignment(e.target.value)}
            >
              <option value="">Select alignment</option>
              <option value="lawful_good">Lawful Good</option>
              <option value="neutral_good">Neutral Good</option>
              <option value="chaotic_good">Chaotic Good</option>
              <option value="lawful_neutral">Lawful Neutral</option>
              <option value="neutral">True Neutral</option>
              <option value="chaotic_neutral">Chaotic Neutral</option>
              <option value="lawful_evil">Lawful Evil</option>
              <option value="neutral_evil">Neutral Evil</option>
              <option value="chaotic_evil">Chaotic Evil</option>
            </select>
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Background
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={background}
              onChange={(e) => setBackground(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Personality Traits
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={personalityTraits}
              onChange={(e) => setPersonalityTraits(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Ideals
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={ideals}
              onChange={(e) => setIdeals(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Bonds
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={bonds}
              onChange={(e) => setBonds(e.target.value)}
            />
          </div>
          <div className="mb-4">
            <label className="block mb-1 font-semibold text-orange-800">
              Flaws
            </label>
            <input
              className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
              value={flaws}
              onChange={(e) => setFlaws(e.target.value)}
            />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold mb-2 text-orange-900">
            Ability Scores
          </h2>
          <div className="grid grid-cols-2 gap-4 mb-6">
            {stats.map((s, idx) => (
              <div key={s.name} className="bg-orange-800/50 p-3 rounded">
                <label className="text-sm text-orange-300 font-semibold">
                  {s.name}
                </label>
                <input
                  type="number"
                  className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white mt-1"
                  value={s.value}
                  onChange={(e) => {
                    const newValue = Number(e.target.value);
                    setStats((prev) =>
                      prev.map((stat, i) =>
                        i === idx
                          ? {
                              ...stat,
                              value: newValue,
                              modifier: Math.floor((newValue - 10) / 2),
                            }
                          : stat,
                      ),
                    );
                  }}
                />
                <p className="text-xs text-gray-400 mt-1">
                  Modifier: {s.modifier >= 0 ? `+${s.modifier}` : s.modifier}
                </p>
                {s.skills && (
                  <div className="mt-2">
                    <h3 className="text-xs text-orange-400 font-semibold">
                      Skills
                    </h3>
                    {Object.entries(s.skills).map(([skill, value]) => (
                      <div
                        key={skill}
                        className="flex justify-between items-center text-xs mt-1"
                      >
                        <span>{skill}</span>
                        <span className="font-medium">
                          {value >= 0 ? `+${value}` : value}
                        </span>
                        <button
                          onClick={() =>
                            setSkillProf((prev) => ({
                              ...prev,
                              [skill]: prev[skill] === 1 ? 0 : 1,
                            }))
                          }
                          className={`px-2 py-1 text-xs rounded cursor-pointer hover:bg-orange-600 ${skillProf[skill] >= 1 ? "bg-orange-600" : "bg-orange-800"}`}
                        >
                          Prof
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
      <div className="mt-8 flex justify-end">
        <button
          className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-6 rounded text-lg cursor-pointer"
          onClick={saveCharacter}
        >
          Save Changes
        </button>
      </div>
    </div>
  );
}
