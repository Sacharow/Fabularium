import { useEffect, useState } from "react";
import { useParams, useNavigate, NavLink } from "react-router-dom";

type Stat = {
  name: string;
  value: number;
  skills?: Record<string, number>;
};

type CharacterSection = {
  id: number;
  campaignId?: string | number;
  name: string;
  color: string;
  description?: string;
  level?: number;
  profBonus?: number;
  characterClass?: string;
  characterRace?: string;
  characterSubclass?: string;
  stats?: Stat[];
  skillProf?: Record<string, number>;
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

const STORAGE_KEY = "fabularium.campaigns.character_section";

function loadFromSession(): CharacterSection[] {
  try {
    const raw = sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed;
  } catch {
    return [];
  }
}

function saveToSession(characters: CharacterSection[]) {
  try {
    const str = JSON.stringify(characters);
    sessionStorage.setItem(STORAGE_KEY, str);
  } catch {
    // ignore
  }
}

function levelUpCharacter(
  characters: CharacterSection[],
  characterId: number,
): CharacterSection[] {
  return characters.map((char) => {
    if (char.id === characterId) {
      const hitDice = char.hitDice ?? 1;
      return {
        ...char,
        level: (char.level ?? 1) + 1,
        hitPointsMax: (char.hitPointsMax ?? 10) + Math.ceil((1 + hitDice) / 2),
        hitPointsCurrent:
          (char.hitPointsCurrent ?? 10) + Math.ceil((1 + hitDice) / 2),
        profBonus: Math.floor(((char.level ?? 1) + 1 + 3) / 4) + 1,
      };
    }
    return char;
  });
}

export default function CharacterPage() {
  const { characterId } = useParams<{ characterId?: string }>();
  const navigate = useNavigate();
  const [characters, setCharacters] = useState<CharacterSection[]>(() =>
    loadFromSession(),
  );
  useEffect(() => {
    saveToSession(characters);
  }, [characters]);

  const char = characters.find((c) => c.id === Number(characterId));

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
    <div className="min-h-screen bg-gradient-to-br from-slate-900 to-slate-800 p-6">
      <div className="pb-6">
        <div className="max-w-7xl mx-auto">
          <p className="text-slate-400 text-sm font-medium">
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
        </div>
      </div>

      <div className="max-w-7xl mx-auto grid gap-6 md:grid-cols-[300px_1fr]">
        {/* Sidebar */}
        <aside className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-700 shadow-xl h-fit">
          <div className="flex items-center space-x-4 mb-4">
            <div className={`w-16 h-16 rounded-lg ${char.color} shadow-lg`} />
            <div>
              <h2 className="text-xl font-bold text-white">{char.name}</h2>
              <p className="text-sm text-slate-400">Level {char.level ?? 1}</p>
              <p className="text-sm text-orange-400 font-medium">
                {char.characterClass ?? "—"}
              </p>
            </div>
          </div>

          {char.description && (
            <p className="text-sm text-slate-300 mb-4 leading-relaxed">
              {char.description}
            </p>
          )}

          <div className="mt-4">
            {(char.level ?? 1) < 20 && (
              <button
                type="button"
                aria-label="Level up (temporary)"
                onClick={() => {
                  if (!char) return;
                  const updated = levelUpCharacter(characters, char.id);
                  setCharacters(updated);
                }}
                className="w-full bg-gradient-to-r from-amber-600 to-orange-700 hover:from-amber-500 hover:to-orange-600 text-white text-sm py-2 rounded-lg cursor-pointer transition font-semibold"
              >
                📈 Level Up
              </button>
            )}
            {(char.level ?? 1) === 20 && (
              <div className="w-full bg-gradient-to-r from-green-600 to-emerald-700 text-white text-sm py-2 rounded-lg text-center font-semibold">
                ⭐ Max Level
              </div>
            )}
          </div>

          <div className="mt-4 grid grid-cols-2 gap-2 text-sm">
            <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
              <div className="text-xs text-slate-400 mb-1">Level</div>
              <div className="font-bold text-lg text-orange-400">
                {char.level ?? "—"}
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
              <div className="text-xs text-slate-400 mb-1">Prof. Bonus</div>
              <div className="font-bold text-lg text-orange-400">
                {(char.profBonus ?? "-") === "-"
                  ? "-"
                  : char.profBonus! >= 0
                    ? `+${char.profBonus}`
                    : `${char.profBonus}`}
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
              <div className="text-xs text-slate-400 mb-1">AC</div>
              <div className="font-bold text-lg text-orange-400">
                {char.armorClass ?? "—"}
              </div>
            </div>
            <div className="bg-slate-700/50 p-3 rounded-lg border border-slate-600">
              <div className="text-xs text-slate-400 mb-1">Initiative</div>
              <div className="font-bold text-lg text-orange-400">
                {(char.initiativeBonus ?? "-") === "-"
                  ? "-"
                  : char.initiativeBonus! >= 0
                    ? `+${char.initiativeBonus}`
                    : `${char.initiativeBonus}`}
              </div>
            </div>
          </div>

          <div className="mt-4 bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-sm">
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">❤️ HP</span>
              <span className="font-bold text-red-400">
                {char.hitPointsCurrent ?? "—"}
                {char.hitPointsMax ? ` / ${char.hitPointsMax}` : ""}
              </span>
            </div>
            <div className="flex justify-between mb-2">
              <span className="text-slate-400">🚀 Speed</span>
              <span className="font-bold text-slate-200">
                {char.speed ?? "—"}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">👁️ Perception</span>
              <span className="font-bold text-slate-200">
                {char.passivePerception ?? "—"}
              </span>
            </div>
          </div>

          {char.money && Object.keys(char.money).length > 0 && (
            <div className="mt-4 bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-sm">
              <div className="text-sm text-orange-400 font-semibold mb-2">
                💰 Wealth
              </div>
              <div className="space-y-1">
                {Object.entries(char.money).map(([k, v]) => (
                  <div key={k} className="flex justify-between">
                    <span className="text-slate-300 capitalize">{k}</span>
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
          <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-700 shadow-xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-orange-400 flex items-center gap-2">
                <span className="text-xl">🎲</span> Ability Scores
              </h3>
              <div className="text-sm text-slate-400">
                {char.characterRace ?? "Unknown Race"}
              </div>
            </div>

            {char.stats && char.stats.length > 0 ? (
              <div className="grid grid-cols-3 md:grid-cols-6 gap-3">
                {char.stats.map((s) => (
                  <div
                    key={s.name}
                    className="bg-slate-700/50 p-4 rounded-lg border border-slate-600 text-center hover:bg-slate-700 transition"
                  >
                    <div className="text-xs text-slate-400 mb-1 font-semibold">
                      {s.name}
                    </div>
                    <div className="text-3xl font-bold text-orange-400">
                      {s.value}
                    </div>
                    {s.skills && Object.keys(s.skills).length > 0 && (
                      <div className="mt-2 text-xs text-slate-300 space-y-1">
                        {Object.entries(s.skills)
                          .slice(0, 2)
                          .map(([k, v]) => (
                            <div key={k} className="flex justify-between">
                              <span>{k}</span>
                              <span className="font-bold">{v}</span>
                            </div>
                          ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-sm text-slate-400">No stats available.</div>
            )}
          </div>

          {/* Skills & Equipment Grid */}
          <div className="grid gap-6 md:grid-cols-2">
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-700 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <span className="text-xl">🎯</span> Skills
              </h4>
              {char.skillProf && Object.keys(char.skillProf).length > 0 ? (
                <div className="space-y-2">
                  {Object.entries(char.skillProf).map(([k, v]) => (
                    <div
                      key={k}
                      className="bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600 flex justify-between hover:bg-slate-700 transition"
                    >
                      <span className="text-slate-200">{k}</span>
                      <span className="font-bold text-orange-400">{v}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400">
                  No skill proficiencies.
                </div>
              )}
            </div>

            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-700 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <span className="text-xl">⚔️</span> Equipment
              </h4>
              {char.equipment && char.equipment.length > 0 ? (
                <div className="space-y-2">
                  {char.equipment.map((it, idx) => (
                    <div
                      key={idx}
                      className="bg-slate-700/50 px-4 py-2 rounded-lg border border-slate-600 text-slate-200 hover:bg-slate-700 transition"
                    >
                      • {it}
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-sm text-slate-400">
                  No equipment listed.
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
            <div className="bg-gradient-to-br from-slate-800 to-slate-700 p-6 rounded-xl border border-slate-700 shadow-xl">
              <h4 className="text-lg font-semibold text-orange-400 mb-4 flex items-center gap-2">
                <span className="text-xl">📖</span> Background & Personality
              </h4>
              <div className="space-y-4">
                {char.background && (
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400 font-semibold mb-1">
                      📚 Background
                    </div>
                    <p className="text-slate-200">{char.background}</p>
                  </div>
                )}
                {char.personalityTraits && (
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400 font-semibold mb-1">
                      ✨ Traits
                    </div>
                    <p className="text-slate-200">{char.personalityTraits}</p>
                  </div>
                )}
                {char.ideals && (
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400 font-semibold mb-1">
                      💡 Ideals
                    </div>
                    <p className="text-slate-200">{char.ideals}</p>
                  </div>
                )}
                {char.bonds && (
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400 font-semibold mb-1">
                      🔗 Bonds
                    </div>
                    <p className="text-slate-200">{char.bonds}</p>
                  </div>
                )}
                {char.flaws && (
                  <div className="bg-slate-700/50 p-4 rounded-lg border border-slate-600">
                    <div className="text-sm text-slate-400 font-semibold mb-1">
                      ⚠️ Flaws
                    </div>
                    <p className="text-slate-200">{char.flaws}</p>
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
