import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";
import { Trash } from "lucide-react";

type Stat = {
  name: string;
  skills?: Record<string, number>;
};

type CharacterSection = {
  id: number;
  campaignId?: string | number;
  name: string;
  image?: string;
  icon?: string;
  level?: number;
  profBonus?: number;
  characterClass?: string;
  characterRace?: string;
  characterSubrace?: string;
  characterSubclass?: string;
  abilityScores?: Record<string, number>;
  abilityProf?: string[];
  stats?: Stat[];
  skillProf?: string[];
  skillExpertise?: string[];
  equipment?: string[];
  money?: Record<string, number>;
  background?: string;
  personalityTraits?: string;
  ideals?: string;
  bonds?: string;
  flaws?: string;
  initiativeBonus?: number;
  speed?: number;
  hitDice?: number;
  hitPointsMax?: number;
  hitPointsCurrent?: number;
  armorClass?: number;
  passivePerception?: number;
};

const MOCK_CHARACTER: CharacterSection = {
  id: 1,
  campaignId: 1,
  name: "Aragorn Stormborne",
  image: "/temp/rgb (1).png",
  icon: "⚔️",
  level: 5,
  profBonus: 3,
  characterClass: "Fighter",
  characterRace: "Human",
  characterSubrace: "Standard Human",
  characterSubclass: "Champion",
  abilityScores: {
    STRENGTH: 18,
    DEXTERITY: 14,
    CONSTITUTION: 16,
    INTELLIGENCE: 10,
    WISDOM: 13,
    CHARISMA: 12,
  },
  abilityProf: ["STRENGTH", "CONSTITUTION"],
  stats: [
    { name: "STRENGTH", skills: { Athletics: 6 } },
    {
      name: "DEXTERITY",
      skills: { Acrobatics: 4, "Sleight of Hand": 0, Stealth: 0 },
    },
    { name: "CONSTITUTION", skills: {} },
    {
      name: "INTELLIGENCE",
      skills: {
        Arcana: 0,
        History: 0,
        Investigation: 0,
        Nature: 0,
        Religion: 0,
      },
    },
    {
      name: "WISDOM",
      skills: {
        "Animal Handling": 0,
        Insight: 0,
        Medicine: 0,
        Perception: 2,
        Survival: 0,
      },
    },
    {
      name: "CHARISMA",
      skills: { Deception: 0, Intimidation: 0, Performance: 0, Persuasion: 0 },
    },
  ],
  skillProf: ["Athletics", "Perception", "Survival", "Intimidation"],
  skillExpertise: ["Athletics"],
  equipment: [
    "Longsword +1",
    "Plate Armor",
    "Shield",
    "Backpack",
    "Bedroll",
    "Rope (50ft)",
    "Waterskin",
  ],
  money: {
    Gold: 250,
    Silver: 45,
    Copper: 12,
  },
  background:
    "Once a humble farm hand, Aragorn discovered his destiny when ancient powers awakened within him.",
  personalityTraits:
    "Honor and courage are my greatest virtues. I speak truthfully and act with integrity in all matters.",
  ideals: "Help those in need and protect the innocent from evil.",
  bonds:
    "I owe my life to the mentor who trained me. I seek to prove myself worthy of their faith.",
  flaws:
    "I can be overly confident in my abilities and sometimes rush into danger without thinking.",
  initiativeBonus: 2,
  speed: 30,
  hitDice: 10,
  hitPointsMax: 52,
  hitPointsCurrent: 48,
  armorClass: 18,
  passivePerception: 12,
};

const CHARACTER_ICONS = [
  "⚔️",
  "🗡️",
  "🛡️",
  "🏹",
  "🧙",
  "👑",
  "🐉",
  "⚡",
  "❄️",
  "🔥",
  "🌙",
  "☀️",
  "💀",
  "👹",
  "🧛",
  "🎲",
  "🦁",
  "🐺",
  "🦅",
  "🦈",
];

// D&D 5e Skills organized by ability
const D_AND_D_SKILLS = {
  STRENGTH: ["Athletics"],
  DEXTERITY: ["Acrobatics", "Sleight of Hand", "Stealth"],
  INTELLIGENCE: ["Arcana", "History", "Investigation", "Nature", "Religion"],
  WISDOM: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  CHARISMA: ["Deception", "Intimidation", "Performance", "Persuasion"],
};

export default function CharacterEditForm() {
  const { characterId, campaignId } = useParams<{
    characterId?: string;
    campaignId?: string;
  }>();
  const navigate = useNavigate();
  const [char, setChar] = useState<CharacterSection | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [openDropdowns, setOpenDropdowns] = useState<Record<string, boolean>>({
    STRENGTH: false,
    DEXTERITY: false,
    INTELLIGENCE: false,
    WISDOM: false,
    CHARISMA: false,
  });
  const [showIconPicker, setShowIconPicker] = useState(false);
  const [equipmentSearch, setEquipmentSearch] = useState("");

  const toggleDropdown = (ability: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [ability]: !prev[ability],
    }));
  };

  const handleInputChange = (field: keyof CharacterSection, value: any) => {
    if (char) {
      setChar({ ...char, [field]: value });
    }
  };

  const handleNestedChange = (
    section: keyof CharacterSection,
    key: string,
    value: any,
  ) => {
    if (char && typeof char[section] === "object" && char[section] !== null) {
      setChar({
        ...char,
        [section]: { ...(char[section] as any), [key]: value },
      });
    }
  };

  const handleArrayChange = (
    section: keyof CharacterSection,
    index: number,
    value: string,
  ) => {
    if (char && Array.isArray(char[section])) {
      const newArray = [...(char[section] as any[])];
      newArray[index] = value;
      setChar({ ...char, [section]: newArray });
    }
  };

  const addArrayItem = (
    section: keyof CharacterSection,
    defaultValue: string = "",
  ) => {
    if (char && Array.isArray(char[section])) {
      const newArray = [...(char[section] as any[]), defaultValue];
      setChar({ ...char, [section]: newArray });
    }
  };

  const removeArrayItem = (section: keyof CharacterSection, index: number) => {
    if (char && Array.isArray(char[section])) {
      const newArray = (char[section] as any[]).filter((_, i) => i !== index);
      setChar({ ...char, [section]: newArray });
    }
  };

  const handleSave = async () => {
    if (!char) return;
    try {
      const response = await fetch(
        `http://localhost:3000/api/characters/${char.id}`,
        {
          method: "PUT",
          credentials: "include",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(char),
        },
      );
      if (response.ok) {
        alert("Character saved successfully!");
      }
    } catch (error) {
      console.error("Failed to save character", error);
      alert("Failed to save character");
    }
  };

  const handleReset = () => {
    if (characterId) {
      fetch(`http://localhost:3000/api/characters/${characterId}`, {
        credentials: "include",
      })
        .then((res) => res.json())
        .then((data) => {
          setChar(data);
        });
    }
  };

  useEffect(() => {
    if (!characterId) {
      setChar(MOCK_CHARACTER);
      setLoading(false);
      return;
    }

    fetch(`http://localhost:3000/api/characters/${characterId}`, {
      credentials: "include",
    })
      .then(async (res) => {
        if (!res.ok) throw new Error("Failed to fetch character");
        return res.json();
      })
      .then((data) => {
        setChar(data);
        setLoading(false);
      })
      .catch((e) => {
        console.error("Failed to load character", e);
        setChar(MOCK_CHARACTER);
        setLoading(false);
      });
  }, [campaignId, characterId, navigate]);

  if (loading) return <div className="pt-6 text-center">Loading...</div>;

  if (!char) {
    return (
      <div className="p-6">
        <p>Character not found.</p>
        <button onClick={() => navigate(-1)} className="mt-4 underline">
          Go back
        </button>
      </div>
    );
  }

  const introData = {
    currentSection: "Character Section",
    urlName: "CharacterView",
  };

  return (
    <div className="p-6">
      <div className="pb-6">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <p className="text-orange-200 text-sm font-medium">
            <NavLink
              to="/campaigns"
              className="cursor-pointer hover:text-orange-400 transition"
            >
              Campaigns
            </NavLink>
            <span className="mx-2">→</span>
            <NavLink
              to={`/InCampaign/${char.campaignId}/${introData.urlName}`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              {introData.currentSection}
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{char.name}</span>
          </p>
          <div className="flex gap-2">
            <button
              onClick={handleSave}
              className="bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-600 text-white text-sm py-2 px-4 rounded-lg cursor-pointer transition font-semibold active:scale-90"
            >
              💾 Save
            </button>
            <button
              onClick={handleReset}
              className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-600 text-white text-sm py-2 px-4 rounded-lg cursor-pointer transition font-semibold active:scale-90"
            >
              ↺ Reset
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="space-y-4">
          {/* Character Intro Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
            <div className="relative">
              {char.image ? (
                <div
                  className="w-full rounded-lg mb-4 relative overflow-hidden bg-gray-900 flex items-center justify-center"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  <img
                    src={char.image}
                    alt={char.name}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleInputChange("image", undefined)}
                    className="absolute top-2 right-2 z-50 p-2 border border-yellow-500 bg-orange-900 rounded hover:bg-orange-700 transition duration-200 cursor-pointer active:scale-90"
                  >
                    <Trash className="w-5 h-5" />
                  </button>
                </div>
              ) : (
                <>
                  <button
                    onClick={() => setShowIconPicker(!showIconPicker)}
                    className="w-full bg-gradient-to-br from-purple-600 to-purple-950 shadow-lg rounded-lg mb-4 flex items-center justify-center text-8xl hover:from-purple-500 hover:to-purple-900 transition cursor-pointer"
                    style={{ aspectRatio: "1 / 1" }}
                  >
                    {char.icon || "📋"}
                  </button>
                  {showIconPicker && (
                    <div className="absolute top-0 left-0 right-0 bg-orange-900 border border-yellow-600 rounded-lg p-3 z-10 max-h-64 overflow-y-auto">
                      <div className="grid grid-cols-4 gap-2">
                        {CHARACTER_ICONS.map((iconOption) => (
                          <button
                            key={iconOption}
                            onClick={() => {
                              handleInputChange("icon", iconOption);
                              setShowIconPicker(false);
                            }}
                            className={`text-xl p-1 rounded transition cursor-pointer ${
                              char.icon === iconOption
                                ? "bg-orange-600 ring-2 ring-yellow-400"
                                : "bg-orange-800 hover:bg-orange-700"
                            }`}
                          >
                            {iconOption}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </>
              )}
            </div>

            <div className="w-full flex justify-center items-center mb-4">
              <label className="text-sm text-orange-200 hover:text-white transition cursor-pointer">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      const reader = new FileReader();
                      reader.onload = () => {
                        handleInputChange("image", reader.result as string);
                      };
                      reader.readAsDataURL(file);
                    }
                  }}
                  className="hidden"
                />
                {char.image ? "📤 Change Image" : "📤 Upload Image"}
              </label>
            </div>

            <div className="space-y-3">
              <div>
                <label className="text-xs text-orange-400 font-semibold">
                  Character Name
                </label>
                <input
                  type="text"
                  value={char.name}
                  onChange={(e) => handleInputChange("name", e.target.value)}
                  className="w-full bg-orange-800 border border-yellow-600 px-3 py-2 rounded-lg font-bold text-lg text-orange-100 focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs text-orange-400 font-semibold">
                  Class
                </label>
                <input
                  type="text"
                  value={char.characterClass ?? ""}
                  onChange={(e) =>
                    handleInputChange("characterClass", e.target.value)
                  }
                  className="w-full bg-orange-800 border border-yellow-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs text-orange-400 font-semibold">
                  Race
                </label>
                <input
                  type="text"
                  value={char.characterRace ?? ""}
                  onChange={(e) =>
                    handleInputChange("characterRace", e.target.value)
                  }
                  className="w-full bg-orange-800 border border-yellow-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs text-orange-400 font-semibold">
                  Subrace
                </label>
                <input
                  type="text"
                  value={char.characterSubrace ?? ""}
                  onChange={(e) =>
                    handleInputChange("characterSubrace", e.target.value)
                  }
                  className="w-full bg-orange-800 border border-yellow-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                />
              </div>
              <div>
                <label className="text-xs text-orange-400 font-semibold">
                  Subclass
                </label>
                <input
                  type="text"
                  value={char.characterSubclass ?? ""}
                  onChange={(e) =>
                    handleInputChange("characterSubclass", e.target.value)
                  }
                  className="w-full bg-orange-800 border border-yellow-600 text-white px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>

          {/* Core Stats Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-4 rounded-xl border border-yellow-700 shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                <label className="text-xs text-orange-300 mb-1 block">
                  Level
                </label>
                <input
                  type="number"
                  value={char.level ?? 1}
                  onChange={(e) =>
                    handleInputChange("level", parseInt(e.target.value))
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 text-center font-bold"
                />
              </div>
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                <label className="text-xs text-orange-300 mb-1 block">
                  Prof. Bonus
                </label>
                <input
                  type="number"
                  value={char.profBonus ?? 0}
                  onChange={(e) =>
                    handleInputChange("profBonus", parseInt(e.target.value))
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 text-center font-bold"
                />
              </div>
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                <label className="text-xs text-orange-300 mb-1 block">AC</label>
                <input
                  type="number"
                  value={char.armorClass ?? 10}
                  onChange={(e) =>
                    handleInputChange("armorClass", parseInt(e.target.value))
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 text-center font-bold"
                />
              </div>
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                <label className="text-xs text-orange-300 mb-1 block">
                  Initiative
                </label>
                <input
                  type="number"
                  value={char.initiativeBonus ?? 0}
                  onChange={(e) =>
                    handleInputChange(
                      "initiativeBonus",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 text-center font-bold"
                />
              </div>
            </div>
          </div>

          {/* HP & Movement Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-4 rounded-xl border border-yellow-700 shadow-xl text-sm">
            <div className="space-y-3">
              <div>
                <label className="text-orange-300 text-xs font-semibold block mb-1">
                  ❤️ Current HP
                </label>
                <input
                  type="number"
                  value={char.hitPointsCurrent ?? 0}
                  onChange={(e) =>
                    handleInputChange(
                      "hitPointsCurrent",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 font-bold"
                />
              </div>
              <div>
                <label className="text-orange-300 text-xs font-semibold block mb-1">
                  ❤️ Max HP
                </label>
                <input
                  type="number"
                  value={char.hitPointsMax ?? 0}
                  onChange={(e) =>
                    handleInputChange("hitPointsMax", parseInt(e.target.value))
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 font-bold"
                />
              </div>
              <div>
                <label className="text-orange-300 text-xs font-semibold block mb-1">
                  🚀 Speed (ft)
                </label>
                <input
                  type="number"
                  value={char.speed ?? 30}
                  onChange={(e) =>
                    handleInputChange("speed", parseInt(e.target.value))
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 font-bold"
                />
              </div>
              <div>
                <label className="text-orange-300 text-xs font-semibold block mb-1">
                  👁️ Perception
                </label>
                <input
                  type="number"
                  value={char.passivePerception ?? 10}
                  onChange={(e) =>
                    handleInputChange(
                      "passivePerception",
                      parseInt(e.target.value),
                    )
                  }
                  className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 font-bold"
                />
              </div>
            </div>
          </div>

          {/* Wealth Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-4 rounded-xl border border-yellow-700 shadow-xl text-sm">
            <div className="text-sm text-orange-400 font-semibold mb-3">
              💰 Wealth
            </div>
            <div className="space-y-2">
              {char.money &&
                Object.entries(char.money).map(([k, v]) => (
                  <div key={k}>
                    <label className="text-orange-300 text-xs font-semibold block mb-1">
                      {k}
                    </label>
                    <input
                      type="number"
                      value={v}
                      onChange={(e) =>
                        handleNestedChange("money", k, parseInt(e.target.value))
                      }
                      className="w-full bg-orange-700 border border-yellow-500 text-yellow-300 px-2 py-1 rounded focus:outline-none focus:border-yellow-300 font-bold"
                    />
                  </div>
                ))}
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Ability Scores Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
            <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2 mb-4">
              <span className="text-xl">🎲</span> Ability Scores
            </h3>

            {char.stats && char.stats.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {char.stats.map((s) => {
                  const abilityValue = char.abilityScores?.[s.name] ?? 10;
                  const modifier = Math.floor((abilityValue - 10) / 2);
                  const hasProf = char.abilityProf?.includes(s.name);
                  return (
                    <div
                      key={s.name}
                      className="bg-orange-800 p-4 rounded-lg border border-yellow-600"
                    >
                      <div className="text-xs text-orange-300 mb-2 font-semibold">
                        {s.name}
                      </div>
                      <input
                        type="number"
                        value={abilityValue}
                        onChange={(e) =>
                          handleNestedChange(
                            "abilityScores",
                            s.name,
                            parseInt(e.target.value),
                          )
                        }
                        className="w-full bg-orange-700 border border-yellow-500 text-orange-100 px-2 py-1 rounded text-center font-bold text-lg mb-1 focus:outline-none focus:border-yellow-300"
                      />
                      <div className="text-sm text-orange-200 mb-2">
                        {modifier >= 0 ? `+${modifier}` : `${modifier}`}
                      </div>
                      <button
                        onClick={() => {
                          if (hasProf) {
                            setChar({
                              ...char,
                              abilityProf:
                                char.abilityProf?.filter((p) => p !== s.name) ||
                                [],
                            });
                          } else {
                            setChar({
                              ...char,
                              abilityProf: [
                                ...(char.abilityProf || []),
                                s.name,
                              ],
                            });
                          }
                        }}
                        className={`w-full px-2 py-1 rounded text-xs font-bold transition cursor-pointer active:scale-90 ${
                          hasProf
                            ? "bg-yellow-600 text-white border border-yellow-500 hover:bg-orange-700"
                            : "bg-orange-800 text-yellow-300 border border-yellow-500 hover:bg-orange-700"
                        }`}
                      >
                        {hasProf ? "Prof" : "Prof"}
                      </button>
                    </div>
                  );
                })}
              </div>
            ) : (
              <div className="text-sm text-orange-200">No stats available.</div>
            )}
          </div>

          {/* Skills & Equipment Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            {/* Skills with Dropdowns */}
            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> Skills
              </h4>
              <div className="space-y-2">
                {(
                  Object.keys(D_AND_D_SKILLS) as Array<
                    keyof typeof D_AND_D_SKILLS
                  >
                ).map((ability) => (
                  <div key={ability}>
                    <button
                      onClick={() => toggleDropdown(ability)}
                      className="w-full bg-orange-800 px-4 py-2 rounded-lg border border-yellow-600 flex justify-between items-center hover:bg-orange-600 transition text-orange-200 font-semibold cursor-pointer"
                    >
                      <span>{ability}</span>
                      <span className="text-sm">
                        {openDropdowns[ability] ? "▼" : "▶"}
                      </span>
                    </button>
                    {openDropdowns[ability] && (
                      <div className="mt-1 space-y-1 pl-2 border-l-2 border-yellow-600">
                        {D_AND_D_SKILLS[ability].map((skill) => {
                          const hasProf = char.skillProf?.includes(skill);
                          const hasExpertise =
                            char.skillExpertise?.includes(skill);
                          const skillBonus =
                            char.stats?.find((s) => s.name === ability)
                              ?.skills?.[skill] ?? 0;
                          return (
                            <div
                              key={skill}
                              className={`px-3 py-2 rounded border text-sm flex justify-between items-center gap-2 ${
                                hasExpertise
                                  ? "bg-amber-700/60 border-amber-500"
                                  : hasProf
                                    ? "bg-orange-700/40 border-yellow-500"
                                    : "bg-orange-800 border-yellow-600"
                              }`}
                            >
                              <div className="flex items-center gap-2">
                                <button
                                  onClick={() => {
                                    let newSkillProf = char.skillProf || [];
                                    let newExpertise =
                                      char.skillExpertise || [];

                                    if (hasProf) {
                                      // Removing proficiency - also remove expertise
                                      newSkillProf = newSkillProf.filter(
                                        (p) => p !== skill,
                                      );
                                      newExpertise = newExpertise.filter(
                                        (p) => p !== skill,
                                      );
                                    } else {
                                      // Adding proficiency
                                      newSkillProf = [...newSkillProf, skill];
                                    }

                                    setChar({
                                      ...char,
                                      skillProf: newSkillProf,
                                      skillExpertise: newExpertise,
                                    });
                                  }}
                                  className={`px-2 py-1 rounded text-xs font-bold active:scale-90 border border-yellow-500 ${
                                    hasProf
                                      ? "bg-orange-600 text-white"
                                      : "bg-orange-800 text-orange-500"
                                  } hover:bg-orange-700 transition duration-200 cursor-pointer`}
                                >
                                  {hasProf ? "◆" : "○"}
                                </button>
                                <button
                                  onClick={() => {
                                    let newExpertise =
                                      char.skillExpertise || [];
                                    let newSkillProf = char.skillProf || [];

                                    if (hasExpertise) {
                                      // Removing expertise
                                      newExpertise = newExpertise.filter(
                                        (p) => p !== skill,
                                      );
                                    } else {
                                      // Adding expertise - also add proficiency if not already there
                                      newExpertise = [...newExpertise, skill];
                                      if (!hasProf) {
                                        newSkillProf = [...newSkillProf, skill];
                                      }
                                    }

                                    setChar({
                                      ...char,
                                      skillExpertise: newExpertise,
                                      skillProf: newSkillProf,
                                    });
                                  }}
                                  className={`px-2 py-1 rounded text-xs font-bold active:scale-90 border border-yellow-500 ${
                                    hasExpertise
                                      ? "bg-orange-600 text-white"
                                      : "bg-orange-800 text-orange-500"
                                  } hover:bg-orange-700 transition duration-200 cursor-pointer`}
                                >
                                  {hasExpertise ? "◆◆" : "○"}
                                </button>
                                <span>{skill}</span>
                              </div>
                              <input
                                type="number"
                                value={skillBonus}
                                onChange={() => {
                                  // This would require a more complex state update
                                  // For now, display only
                                }}
                                className="w-12 bg-orange-700 border border-yellow-500 text-orange-100 px-1 py-0 rounded text-center font-bold text-sm focus:outline-none focus:border-yellow-300"
                              />
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment */}
            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                  <span className="text-xl">⚔️</span> Equipment
                </h4>
                <input
                  type="text"
                  placeholder="Search items..."
                  value={equipmentSearch}
                  onChange={(e) => setEquipmentSearch(e.target.value)}
                  className="bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-1 rounded text-sm focus:outline-none focus:border-yellow-400 placeholder-orange-400 w-40"
                />
              </div>
              <div className="space-y-2">
                {char.equipment &&
                  char.equipment
                    .map((item, idx) => ({ item, originalIdx: idx }))
                    .filter(({ item }) =>
                      item
                        .toLowerCase()
                        .includes(equipmentSearch.toLowerCase()),
                    )
                    .map(({ item, originalIdx }) => (
                      <div key={originalIdx} className="flex gap-2">
                        <input
                          type="text"
                          value={item}
                          onChange={(e) =>
                            handleArrayChange(
                              "equipment",
                              originalIdx,
                              e.target.value,
                            )
                          }
                          className="flex-1 bg-orange-800 border border-yellow-600 text-orange-300 px-3 py-2 rounded-lg hover:bg-orange-700 focus:outline-none focus:border-yellow-400"
                        />
                        <button
                          onClick={() =>
                            removeArrayItem("equipment", originalIdx)
                          }
                          className="p-2 border border-yellow-500 bg-orange-900 rounded hover:bg-orange-700 transition duration-200 cursor-pointer active:scale-90"
                        >
                          <Trash className="w-5 h-5" />
                        </button>
                      </div>
                    ))}
                <button
                  onClick={() => addArrayItem("equipment", "New Item")}
                  className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-600 text-white py-2 rounded-lg cursor-pointer transition font-semibold active:scale-90"
                >
                  + Add Equipment
                </button>
              </div>
            </div>
          </div>

          {/* Background Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
            <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
              <span className="text-xl">📖</span> Background & Personality
            </h4>
            <div className="space-y-4">
              {true && (
                <div>
                  <label className="text-sm text-orange-400 font-semibold block mb-2">
                    📚 Background
                  </label>
                  <textarea
                    value={char.background || ""}
                    onChange={(e) =>
                      handleInputChange("background", e.target.value)
                    }
                    className="w-full bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 resize-none h-24"
                  />
                </div>
              )}
              {true && (
                <div>
                  <label className="text-sm text-orange-400 font-semibold block mb-2">
                    ✨ Traits
                  </label>
                  <textarea
                    value={char.personalityTraits || ""}
                    onChange={(e) =>
                      handleInputChange("personalityTraits", e.target.value)
                    }
                    className="w-full bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 resize-none h-20"
                  />
                </div>
              )}
              {true && (
                <div>
                  <label className="text-sm text-orange-400 font-semibold block mb-2">
                    💡 Ideals
                  </label>
                  <textarea
                    value={char.ideals || ""}
                    onChange={(e) =>
                      handleInputChange("ideals", e.target.value)
                    }
                    className="w-full bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 resize-none h-20"
                  />
                </div>
              )}
              {true && (
                <div>
                  <label className="text-sm text-orange-400 font-semibold block mb-2">
                    🔗 Bonds
                  </label>
                  <textarea
                    value={char.bonds || ""}
                    onChange={(e) => handleInputChange("bonds", e.target.value)}
                    className="w-full bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 resize-none h-20"
                  />
                </div>
              )}
              {true && (
                <div>
                  <label className="text-sm text-orange-400 font-semibold block mb-2">
                    ⚠️ Flaws
                  </label>
                  <textarea
                    value={char.flaws || ""}
                    onChange={(e) => handleInputChange("flaws", e.target.value)}
                    className="w-full bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-2 rounded-lg focus:outline-none focus:border-yellow-400 resize-none h-20"
                  />
                </div>
              )}
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}
