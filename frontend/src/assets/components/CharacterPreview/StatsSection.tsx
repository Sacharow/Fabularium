import type {
  CharacterSectionProps,
  AbilityStat,
  SkillDetail,
  StatSectionContent,
} from "./types";
import { Circle, CircleDot } from "lucide-react";

interface StatsSectionProps extends CharacterSectionProps {
  content: StatSectionContent;
}

export function StatsSection({ content }: StatsSectionProps) {
  const statsContent = content as StatSectionContent;

  const getModifier = (score: number) => {
    const modifier = Math.floor((score - 10) / 2);
    return modifier >= 0 ? `+${modifier}` : `${modifier}`;
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-start">
        <div className="w-full max-w-xs border-2 border-gold-neutral bg-neutral p-4 flex items-center justify-between gap-4">
          <p className="text-xs uppercase tracking-widest text-gray-light">
            Proficiency Bonus
          </p>
          <p className="text-3xl font-bold text-gold-neutral">
            {statsContent.proficiencyBonus}
          </p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {statsContent.abilities.map((ability: AbilityStat) => (
          <article
            key={ability.ability}
            className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4"
          >
            <div className="flex items-start justify-between gap-4">
              <div>
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  Ability
                </p>
                <h3 className="text-xl font-semibold text-neutral-text">
                  {ability.ability}
                </h3>
              </div>
              <div className="text-right">
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  Modifier
                </p>
                <p className="text-2xl font-bold text-gold-neutral">
                  {getModifier(ability.score)}
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gold-dark bg-dark p-3">
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  Score
                </p>
                <p className="text-lg font-semibold text-neutral-text">
                  {ability.score}
                </p>
              </div>
              <div className="border border-gold-dark bg-dark p-3 flex items-center justify-between gap-3">
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Saving Throw
                  </p>
                  <p className="text-lg font-semibold text-neutral-text">
                    {ability.savingThrow}
                  </p>
                </div>
                <div
                  className="flex items-center gap-1"
                  aria-label={ability.savingThrowDistinction}
                  title={ability.savingThrowDistinction}
                >
                  {ability.savingThrowDistinction === "Nothing" && (
                    <Circle className="h-4 w-4 text-gray-light" />
                  )}
                  {ability.savingThrowDistinction === "Proficiency" && (
                    <CircleDot className="h-4 w-4 text-gold-neutral" />
                  )}
                </div>
              </div>
            </div>

            <div className="border border-gold-dark bg-dark p-3 flex flex-col gap-2">
              <p className="text-xs uppercase tracking-widest text-gray-light">
                Related Skills
              </p>
              {ability.skills.length > 0 ? (
                <div className="flex flex-col gap-2">
                  {ability.skills.map((skill: SkillDetail) => (
                    <div
                      key={skill.name}
                      className="flex items-center justify-between gap-3 border border-gold-dark bg-neutral px-3 py-2"
                    >
                      <p className="text-sm text-neutral-text">{skill.name}</p>
                      <div
                        className="flex items-center gap-1"
                        aria-label={skill.distinction}
                        title={skill.distinction}
                      >
                        {skill.distinction === "Nothing" && (
                          <>
                            <Circle className="h-4 w-4 text-gray-light" />
                            <Circle className="h-4 w-4 text-gray-light" />
                          </>
                        )}
                        {skill.distinction === "Proficiency" && (
                          <>
                            <Circle className="h-4 w-4 text-gray-light" />
                            <CircleDot className="h-4 w-4 text-gold-neutral" />
                          </>
                        )}
                        {skill.distinction === "Expertise" && (
                          <>
                            <CircleDot className="h-4 w-4 text-gold-neutral" />
                            <CircleDot className="h-4 w-4 text-gold-neutral" />
                          </>
                        )}
                        <span className="text-gold-neutral">
                          {skill.modifier}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-sm text-gray-neutral">None</p>
              )}
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
