import { useNavigate, useParams, NavLink } from "react-router-dom";
import { useState, useEffect } from "react";
import { characterService } from "../../../../services/characterService";

type ProfLevel = 0 | 1 | 2;

interface Stat {
  name: string;
  value: number;
  modifier: number;
  skills?: Record<string, number | undefined>;
}

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

export default function CharacterNew() {
  const navigate = useNavigate();
  const params = useParams<{ campaignId?: string }>();
  const { campaignId } = params;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [classId, setClassId] = useState("");
  const [raceId, setRaceId] = useState("");
  const [subraceId, setSubraceId] = useState("");
  const [classes, setClasses] = useState<any[]>([]);
  const [races, setRaces] = useState<any[]>([]);
  const [subraces, setSubraces] = useState<any[]>([]);
  const [level, setLevel] = useState(1);
  const [profBonus, setProfBonus] = useState(0);
  const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);
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

  // Recalculate skill values when stats or skillProf or profBonus change
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
    characterService.getClasses().then(setClasses);
    characterService.getRaces().then(setRaces);
    fetch("/api/subraces", { credentials: "include" })
      .then((res) => (res.ok ? res.json() : []))
      .then(setSubraces)
      .catch(() => setSubraces([]));
  }, []);

  useEffect(() => {
    if (!raceId) {
      setSize("");
      return;
    }
    const race = races.find((r: any) => r.id === raceId);
    setSize(race?.size ?? "");
    setSpeed(race?.speed ?? "");
  }, [raceId, races]);

  useEffect(() => {
    setProfBonus(Math.ceil(level / 4) + 1);
  }, [level]);

  const updateStatValue = (statName: string, newValue: number) => {
    setStats((prev) =>
      prev.map((s) => {
        if (s.name !== statName) return s;
        const base = Math.floor((newValue - 10) / 2);
        let updatedSkills = s.skills;
        if (s.skills) {
          const newSkills: Record<string, number> = {};
          Object.keys(s.skills).forEach((k) => {
            const profLevel = (skillProf[k] ?? 0) as number;
            newSkills[k] = base + profBonus * profLevel;
          });
          updatedSkills = newSkills as any;
        }
        return { ...s, value: newValue, modifier: base, skills: updatedSkills };
      }),
    );
  };

  const updateSkillProf = (skillName: string, newProf: ProfLevel) => {
    setSkillProf((prev) => {
      const current = (prev[skillName] ?? 0) as number;
      let actualNewProf: ProfLevel;

      if (newProf === 1) {
        actualNewProf = current === 1 ? 0 : 1;
      } else {
        actualNewProf = current === 2 ? 1 : 2;
      }

      return {
        ...prev,
        [skillName]: actualNewProf,
      } as Record<string, ProfLevel>;
    });
  };

  const saveCharacter = async () => {
    if (!name.trim()) return alert("Name required");
    if (!classId) return alert("Class required");
    if (!raceId) return alert("Race required");
    const outOfRangeStat = stats.find((s) => s.value < 1 || s.value > 30);
    if (outOfRangeStat) {
      return alert("Stats must be in range 1-30");
    }
    if (level < 1 || level > 20) {
      return alert("Level must be in range 1-20");
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
      campaignId: campaignId || undefined,
    };
    try {
      const saved = await characterService.createCharacter(characterData);
      if (campaignId) {
        navigate(`/InCampaign/${campaignId}/Characters/${saved.id}`);
      } else {
        navigate("/characters");
      }
    } catch (e) {
      alert("Failed to save character");
    }
  };

  return (
    <div className="pt-6">
      <div className="w-full">
        <div className="grid grid-cols-8">
          <div className="col-span-2"></div>
          <div className="col-span-4">
            <div className="pb-4">
              <p className="text-orange-200 text-sm">
                <NavLink
                  to="/campaigns"
                  className="cursor-pointer hover:text-orange-400"
                >
                  Campaigns
                </NavLink>
                <span> / </span>
                <NavLink
                  to={`/InCampaign/${campaignId}/CharacterView`}
                  className="cursor-pointer hover:text-orange-400"
                >
                  Characters
                </NavLink>
                <span> / </span>
                <NavLink
                  to="#"
                  className="cursor-pointer hover:text-orange-400"
                >
                  New
                </NavLink>
              </p>
            </div>
            <div className="flex justify-between items-center mb-6">
              <h1 className="text-4xl font-bold text-white">
                Create New Character
              </h1>
              <button
                onClick={saveCharacter}
                className="bg-orange-700 hover:bg-orange-600 text-white font-bold py-2 px-4 rounded cursor-pointer transition"
              >
                Save Character
              </button>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>

        <div className="grid grid-cols-8 gap-6">
          <div className="col-span-2"></div>
          <div className="col-span-4 space-y-6">
            {/* Basic Info */}
            <div className="bg-orange-700/30 p-4 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Basic Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Name
                  </label>
                  <input
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Character name"
                  />
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Description
                  </label>
                  <textarea
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white h-24"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Character description"
                  />
                </div>
              </div>
            </div>

            {/* Class & Race */}
            <div className="bg-orange-700/30 p-4 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Character Details
              </h2>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Class
                  </label>
                  <select
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={classId}
                    onChange={(e) => setClassId(e.target.value)}
                  >
                    <option value="">Select a class...</option>
                    {classes.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Race
                  </label>
                  <select
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={raceId}
                    onChange={(e) => setRaceId(e.target.value)}
                  >
                    <option value="">Select a race...</option>
                    {races.map((r) => (
                      <option key={r.id} value={r.id}>
                        {r.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Subrace
                  </label>
                  <select
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={subraceId}
                    onChange={(e) => setSubraceId(e.target.value)}
                  >
                    <option value="">Select subrace (optional)...</option>
                    {subraces.map((sr) => (
                      <option key={sr.id} value={sr.id}>
                        {sr.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Level
                  </label>
                  <input
                    type="number"
                    min={1}
                    max={20}
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={level}
                    onChange={(e) =>
                      setLevel(
                        Math.max(1, Math.min(20, Number(e.target.value) || 1)),
                      )
                    }
                  />
                </div>
              </div>
            </div>

            {/* Ability Scores */}
            <div className="bg-orange-700/30 p-4 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Ability Scores
              </h2>
              <div className="grid grid-cols-3 gap-4">
                {stats.map((s) => (
                  <div key={s.name} className="bg-orange-800/50 p-3 rounded">
                    <label className="block text-orange-200 font-semibold text-sm mb-2">
                      {s.name}
                    </label>
                    <input
                      type="number"
                      min={1}
                      max={30}
                      className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                      value={s.value}
                      onChange={(e) =>
                        updateStatValue(s.name, Number(e.target.value))
                      }
                    />
                    <p className="text-xs text-gray-400 mt-1 text-center">
                      Mod: {s.modifier >= 0 ? `+${s.modifier}` : s.modifier}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Roleplay Info */}
            <div className="bg-orange-700/30 p-4 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Roleplay Information
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Alignment
                  </label>
                  <select
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={alignment}
                    onChange={(e) => setAlignment(e.target.value)}
                  >
                    <option value="">Select an alignment...</option>
                    <option value="Lawful Good">Lawful Good</option>
                    <option value="Neutral Good">Neutral Good</option>
                    <option value="Chaotic Good">Chaotic Good</option>
                    <option value="Lawful Neutral">Lawful Neutral</option>
                    <option value="True Neutral">True Neutral</option>
                    <option value="Chaotic Neutral">Chaotic Neutral</option>
                    <option value="Lawful Evil">Lawful Evil</option>
                    <option value="Neutral Evil">Neutral Evil</option>
                    <option value="Chaotic Evil">Chaotic Evil</option>
                  </select>
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Background
                  </label>
                  <input
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={background}
                    onChange={(e) => setBackground(e.target.value)}
                    placeholder="Character background"
                  />
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Personality Traits
                  </label>
                  <input
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={personalityTraits}
                    onChange={(e) => setPersonalityTraits(e.target.value)}
                    placeholder="Personality traits"
                  />
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Ideals
                  </label>
                  <input
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={ideals}
                    onChange={(e) => setIdeals(e.target.value)}
                    placeholder="Character ideals"
                  />
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Bonds
                  </label>
                  <input
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={bonds}
                    onChange={(e) => setBonds(e.target.value)}
                    placeholder="Character bonds"
                  />
                </div>
                <div>
                  <label className="block text-orange-200 font-semibold mb-1">
                    Flaws
                  </label>
                  <input
                    className="w-full border-2 border-orange-700 rounded p-2 bg-black text-white"
                    value={flaws}
                    onChange={(e) => setFlaws(e.target.value)}
                    placeholder="Character flaws"
                  />
                </div>
              </div>
            </div>

            {/* Skills */}
            <div className="bg-orange-700/30 p-4 rounded-md">
              <h2 className="text-2xl font-bold mb-4 text-white">
                Skill Proficiencies
              </h2>
              <div className="space-y-4">
                {stats.map((s) => (
                  <div key={s.name}>
                    {s.skills && Object.keys(s.skills).length > 0 && (
                      <div>
                        <h3 className="text-lg font-semibold text-orange-300 mb-2">
                          {s.name}
                        </h3>
                        <div className="space-y-1">
                          {Object.entries(s.skills).map(
                            ([skillName, skillValue]) => (
                              <div
                                key={skillName}
                                className="flex items-center justify-between bg-orange-800/30 p-2 rounded"
                              >
                                <span className="text-sm">{skillName}</span>
                                <div className="flex items-center gap-2">
                                  <span className="text-sm font-medium">
                                    {skillValue !== undefined
                                      ? skillValue >= 0
                                        ? `+${skillValue}`
                                        : skillValue
                                      : "+0"}
                                  </span>
                                  <button
                                    onClick={() =>
                                      updateSkillProf(skillName, 1)
                                    }
                                    className={`px-2 py-1 text-xs rounded cursor-pointer hover:bg-orange-600 ${
                                      (skillProf[skillName] ?? 0) >= 1
                                        ? "bg-orange-600"
                                        : "bg-orange-800"
                                    }`}
                                  >
                                    Prof
                                  </button>
                                  <button
                                    onClick={() =>
                                      updateSkillProf(skillName, 2)
                                    }
                                    className={`px-2 py-1 text-xs rounded cursor-pointer hover:bg-orange-600 ${
                                      (skillProf[skillName] ?? 0) === 2
                                        ? "bg-orange-600"
                                        : "bg-orange-800"
                                    }`}
                                  >
                                    Exp
                                  </button>
                                </div>
                              </div>
                            ),
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
          <div className="col-span-2"></div>
        </div>
      </div>
    </div>
  );
}
