import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

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
  features?: string[];
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

// D&D 5e Skills organized by ability
const D_AND_D_SKILLS = {
  STRENGTH: ["Athletics"],
  DEXTERITY: ["Acrobatics", "Sleight of Hand", "Stealth"],
  INTELLIGENCE: ["Arcana", "History", "Investigation", "Nature", "Religion"],
  WISDOM: ["Animal Handling", "Insight", "Medicine", "Perception", "Survival"],
  CHARISMA: ["Deception", "Intimidation", "Performance", "Persuasion"],
};

export default function CharacterPreviewNew() {
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
  const [equipmentSearch, setEquipmentSearch] = useState("");
  const [featuresSearch, setFeaturesSearch] = useState("");

  const toggleDropdown = (ability: string) => {
    setOpenDropdowns((prev) => ({
      ...prev,
      [ability]: !prev[ability],
    }));
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
    urlName: "character-view",
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
              to={`/in-campaign/${char.campaignId}/${introData.urlName}`}
              className="cursor-pointer hover:text-orange-400 transition"
            >
              {introData.currentSection}
            </NavLink>
            <span className="mx-2">→</span>
            <span className="text-orange-400 font-semibold">{char.name}</span>
          </p>
          <button className="bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-700 hover:to-orange-600 text-white text-sm py-2 px-4 rounded-lg cursor-pointer transition font-semibold">
            ✏️ Edit
          </button>
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
                </div>
              ) : (
                <div
                  className="w-full bg-gradient-to-br from-purple-600 to-purple-950 shadow-lg rounded-lg mb-4 flex items-center justify-center text-8xl"
                  style={{ aspectRatio: "1 / 1" }}
                >
                  {char.icon || "🎲"}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <div>
                <h2 className="text-xl font-bold text-white">{char.name}</h2>
              </div>
              <div className="grid grid-cols-2 gap-3 text-sm">
                <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                  <div className="text-xs text-orange-300 mb-1 font-semibold">
                    Class
                  </div>
                  <div className="text-orange-200">
                    {char.characterClass ?? "—"}
                  </div>
                </div>
                <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                  <div className="text-xs text-orange-300 mb-1 font-semibold">
                    Subclass
                  </div>
                  <div className="text-orange-200">
                    {char.characterSubclass ?? "—"}
                  </div>
                </div>
                <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                  <div className="text-xs text-orange-300 mb-1 font-semibold">
                    Race
                  </div>
                  <div className="text-orange-200">
                    {char.characterRace ?? "—"}
                  </div>
                </div>
                <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600">
                  <div className="text-xs text-orange-300 mb-1 font-semibold">
                    Subrace
                  </div>
                  <div className="text-orange-200">
                    {char.characterSubrace ?? "—"}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Core Stats Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-4 rounded-xl border border-yellow-700 shadow-xl">
            <div className="grid grid-cols-2 gap-2 text-sm">
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                <div className="text-xs text-orange-300 mb-1">Level</div>
                <div className="font-bold text-lg text-orange-200">
                  {char.level ?? "—"}
                </div>
              </div>
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                <div className="text-xs text-orange-300 mb-1">Prof. Bonus</div>
                <div className="font-bold text-lg text-orange-200">
                  {(char.profBonus ?? "-") === "-"
                    ? "-"
                    : char.profBonus! >= 0
                      ? `+${char.profBonus}`
                      : `${char.profBonus}`}
                </div>
              </div>
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                <div className="text-xs text-orange-300 mb-1">AC</div>
                <div className="font-bold text-lg text-orange-200">
                  {char.armorClass ?? "—"}
                </div>
              </div>
              <div className="bg-orange-800 p-3 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                <div className="text-xs text-orange-300 mb-1">Initiative</div>
                <div className="font-bold text-lg text-orange-200">
                  {(char.initiativeBonus ?? "-") === "-"
                    ? "-"
                    : char.initiativeBonus! >= 0
                      ? `+${char.initiativeBonus}`
                      : `${char.initiativeBonus}`}
                </div>
              </div>
            </div>
          </div>

          {/* HP & Movement Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-4 rounded-xl border border-yellow-700 shadow-xl text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-orange-300">❤️ HP</span>
              <span className="font-bold text-red-400">
                {char.hitPointsCurrent ?? "—"}
                {char.hitPointsMax ? ` / ${char.hitPointsMax}` : ""}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-orange-300">🚀 Speed</span>
              <span className="font-bold text-orange-200">
                {char.speed ?? "—"} ft
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-orange-300">👁️ Perception</span>
              <span className="font-bold text-orange-200">
                {char.passivePerception ?? "—"}
              </span>
            </div>
          </div>

          {/* Wealth Section */}
          {char.money && Object.keys(char.money).length > 0 && (
            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-4 rounded-xl border border-yellow-700 shadow-xl text-sm">
              <div className="text-sm text-orange-400 font-semibold mb-2">
                💰 Wealth
              </div>
              <div className="space-y-1">
                {Object.entries(char.money).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-orange-300 capitalize">{k}</span>
                    <span className="font-bold text-yellow-400">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </aside>

        {/* Main Content */}
        <main className="space-y-6">
          {/* Stats Section */}
          <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                <span className="text-xl">🎲</span> Ability Scores
              </h3>
            </div>

            {char.stats && char.stats.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {char.stats.map((s) => {
                  const abilityValue = char.abilityScores?.[s.name] ?? 10;
                  const modifier = Math.floor((abilityValue - 10) / 2);
                  const hasProf = char.abilityProf?.includes(s.name);
                  return (
                    <div
                      key={s.name}
                      className="bg-orange-800 p-4 rounded-lg border border-yellow-600 text-center hover:bg-orange-600 transition"
                    >
                      <div className="text-xs text-orange-300 mb-2 font-semibold">
                        {s.name}
                      </div>
                      <div className="text-2xl font-bold text-orange-300 mb-1">
                        {abilityValue}
                      </div>
                      <div className="text-sm text-orange-200 mb-2">
                        {modifier >= 0 ? `+${modifier}` : `${modifier}`}
                      </div>
                      {hasProf && (
                        <div className="text-xs text-yellow-200 font-semibold">
                          Proficiency
                        </div>
                      )}
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
                              className={`px-3 py-1 rounded border text-sm flex justify-between items-center ${
                                hasExpertise
                                  ? "bg-amber-700/60 border-amber-500 text-amber-200"
                                  : hasProf
                                    ? "bg-orange-700/40 border-yellow-500 text-orange-200"
                                    : "bg-orange-800 border-yellow-600 text-orange-300"
                              }`}
                            >
                              <span className="flex items-center gap-2">
                                {hasExpertise && (
                                  <span className="text-xs font-bold">◆◆</span>
                                )}
                                {hasProf && !hasExpertise && (
                                  <span className="text-xs font-bold">◆</span>
                                )}
                                {skill}
                              </span>
                              <span className="font-bold">{skillBonus}</span>
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            {/* Equipment with Scroll */}
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
              {char.equipment && char.equipment.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {char.equipment
                    .filter((it) =>
                      it.toLowerCase().includes(equipmentSearch.toLowerCase()),
                    )
                    .map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-orange-800 px-4 py-2 rounded-lg border border-yellow-600 text-orange-300 hover:bg-orange-600 transition"
                      >
                        • {it}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-sm text-orange-400">
                  No equipment listed.
                </div>
              )}
            </div>
          </div>

          {/* Features Section */}
          <div>
            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h4 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                  <span className="text-xl">🛠️</span> Features
                </h4>
                <input
                  type="text"
                  placeholder="Search features..."
                  value={featuresSearch}
                  onChange={(e) => setFeaturesSearch(e.target.value)}
                  className="bg-orange-800 border border-yellow-600 text-orange-200 px-3 py-1 rounded text-sm focus:outline-none focus:border-yellow-400 placeholder-orange-400 w-120"
                />
              </div>
              {char.features && char.features.length > 0 ? (
                <div className="max-h-64 overflow-y-auto space-y-2 pr-2">
                  {char.features
                    .filter((it) =>
                      it.toLowerCase().includes(featuresSearch.toLowerCase()),
                    )
                    .map((it, idx) => (
                      <div
                        key={idx}
                        className="bg-orange-800 px-4 py-2 rounded-lg border border-yellow-600 text-orange-300 hover:bg-orange-600 transition"
                      >
                        • {it}
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-sm text-orange-400">
                  No features listed.
                </div>
              )}
            </div>
          </div>

          {/* Background Section */}
          {(char.background ||
            char.personalityTraits ||
            char.ideals ||
            char.bonds ||
            char.flaws) && (
            <div className="bg-gradient-to-br from-orange-800 to-orange-700 p-6 rounded-xl border border-yellow-700 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> Background & Personality
              </h4>
              <div className="space-y-4">
                {char.background && (
                  <div className="bg-orange-800 p-4 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                    <div className="text-sm text-orange-300 font-semibold mb-1">
                      📚 Background
                    </div>
                    <p className="text-orange-200">{char.background}</p>
                  </div>
                )}
                {char.personalityTraits && (
                  <div className="bg-orange-800 p-4 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                    <div className="text-sm text-orange-300 font-semibold mb-1">
                      ✨ Traits
                    </div>
                    <p className="text-orange-200">{char.personalityTraits}</p>
                  </div>
                )}
                {char.ideals && (
                  <div className="bg-orange-800 p-4 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                    <div className="text-sm text-orange-300 font-semibold mb-1">
                      💡 Ideals
                    </div>
                    <p className="text-orange-200">{char.ideals}</p>
                  </div>
                )}
                {char.bonds && (
                  <div className="bg-orange-800 p-4 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                    <div className="text-sm text-orange-300 font-semibold mb-1">
                      🔗 Bonds
                    </div>
                    <p className="text-orange-200">{char.bonds}</p>
                  </div>
                )}
                {char.flaws && (
                  <div className="bg-orange-800 p-4 rounded-lg border border-yellow-600 hover:bg-orange-600 transition duration-200">
                    <div className="text-sm text-orange-300 font-semibold mb-1">
                      ⚠️ Flaws
                    </div>
                    <p className="text-orange-200">{char.flaws}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
