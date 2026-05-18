import { useState } from "react";
import { Check, X } from "lucide-react";
import { PreviewActionButton } from "./PreviewActionButton";
import type {
  CharacterSectionProps,
  AbilityStat,
  SkillDetail,
  StatSectionContent,
} from "./types";
import { Circle, CircleDot } from "lucide-react";

// Validation removed - all fields accepted as-is

interface StatsSectionProps extends CharacterSectionProps {
  content: StatSectionContent;
}

export function StatsSection({
  content,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
  isOwner, // Added isOwner to the function signature
}: StatsSectionProps) {
  const statsContent = content as StatSectionContent;
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedContent, setEditedContent] =
    useState<StatSectionContent>(statsContent);

  // Modifier is now entered manually per-ability and per-skill.

  const handleEdit = () => {
    setIsEditing(true);
    onEditModeChange?.(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEditModeChange?.(false);
    onContentChange?.(editedContent);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(statsContent);
    onEditModeChange?.(false);
  };

  const handleAbilityScoreChange = (ability: string, newScore: string) => {
    setEditedContent((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a) =>
        a.ability === ability ? { ...a, score: newScore } : a,
      ),
    }));
  };

  const handleSavingThrowChange = (ability: string, newValue: string) => {
    setEditedContent((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a) =>
        a.ability === ability ? { ...a, savingThrow: newValue } : a,
      ),
    }));
  };

  const handleSavingThrowDistinctionToggle = (ability: string) => {
    setEditedContent((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a) =>
        a.ability === ability
          ? {
              ...a,
              savingThrowDistinction:
                a.savingThrowDistinction === "Proficiency"
                  ? "Nothing"
                  : "Proficiency",
            }
          : a,
      ),
    }));
  };

  const handleSkillDistinctionToggle = (ability: string, skillName: string) => {
    setEditedContent((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a) =>
        a.ability === ability
          ? {
              ...a,
              skills: a.skills.map((skill) => {
                if (skill.name !== skillName) {
                  return skill;
                }

                const nextDistinction =
                  skill.distinction === "Nothing"
                    ? "Proficiency"
                    : skill.distinction === "Proficiency"
                      ? "Expertise"
                      : "Nothing";

                return {
                  ...skill,
                  distinction: nextDistinction,
                };
              }),
            }
          : a,
      ),
    }));
  };

  const handleAbilityModifierChange = (ability: string, newValue: string) => {
    setEditedContent((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a) =>
        a.ability === ability ? { ...a, modifier: newValue } : a,
      ),
    }));
  };

  const handleSkillModifierChange = (
    ability: string,
    skillName: string,
    newValue: string,
  ) => {
    setEditedContent((prev) => ({
      ...prev,
      abilities: prev.abilities.map((a) =>
        a.ability === ability
          ? {
              ...a,
              skills: a.skills.map((skill) =>
                skill.name === skillName
                  ? { ...skill, modifier: newValue }
                  : skill,
              ),
            }
          : a,
      ),
    }));
  };

  const handleProficiencyBonusChange = (newValue: string) => {
    setEditedContent((prev) => ({
      ...prev,
      proficiencyBonus: newValue,
    }));
  };

  const currentContent = isEditing ? editedContent : statsContent;

  return (
    <div className="flex flex-col gap-4">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">
          Stats & Abilities
        </h2>
        <div className="flex items-center gap-2">
          {isOwner ? (
            isEditing ? (
              <>
                <PreviewActionButton
                  onClick={handleSave}
                  variant="primary"
                  icon={<Check className="h-4 w-4" />}
                  title="Save changes"
                >
                  Save
                </PreviewActionButton>
                <PreviewActionButton
                  onClick={handleCancel}
                  variant="secondary"
                  icon={<X className="h-4 w-4" />}
                  title="Cancel editing"
                >
                  Cancel
                </PreviewActionButton>
              </>
            ) : (
              <PreviewActionButton
                onClick={handleEdit}
                variant="ghost"
                title="Edit this section"
              >
                Edit
              </PreviewActionButton>
            )
          ) : null}
        </div>
      </div>

      <div className="flex justify-start">
        <div className="w-full max-w-xs border-2 border-gold-neutral bg-neutral p-4 flex flex-col gap-2 min-w-0">
          <div className="flex items-center justify-between gap-4">
            <p className="text-xs uppercase tracking-widest text-gray-light">
              Proficiency Bonus
            </p>
            {isEditing ? (
              <input
                type="text"
                value={currentContent.proficiencyBonus}
                placeholder="+5"
                onChange={(e) => handleProficiencyBonusChange(e.target.value)}
                className="text-3xl font-bold text-gold-neutral bg-dark border border-gold-dark px-2 py-1 w-20 text-right"
              />
            ) : (
              <p className="text-3xl font-bold text-gold-neutral">
                {currentContent.proficiencyBonus}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {currentContent.abilities.map((ability: AbilityStat) => (
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
                {isEditing ? (
                  <input
                    type="text"
                    value={ability.modifier ?? ""}
                    placeholder="+2"
                    onChange={(e) =>
                      handleAbilityModifierChange(
                        ability.ability,
                        e.target.value,
                      )
                    }
                    className="text-2xl font-bold text-gold-neutral bg-dark border border-gold-dark px-2 py-1 w-20 text-right"
                  />
                ) : (
                  <p className="text-2xl font-bold text-gold-neutral">
                    {ability.modifier ?? ""}
                  </p>
                )}
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div className="border border-gold-dark bg-dark p-3 min-w-0">
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  Score
                </p>
                {isEditing ? (
                  <>
                    <input
                      type="text"
                      value={ability.score}
                      placeholder="10"
                      onChange={(e) =>
                        handleAbilityScoreChange(
                          ability.ability,
                          e.target.value,
                        )
                      }
                      className="w-full min-w-0 text-lg font-semibold text-neutral-text bg-neutral border border-gold-dark p-2"
                    />
                  </>
                ) : (
                  <p className="text-lg font-semibold text-neutral-text">
                    {ability.score}
                  </p>
                )}
              </div>
              <div className="border border-gold-dark bg-dark p-3 flex items-center justify-between gap-3 min-w-0">
                <div className="flex min-w-0 flex-col gap-1 flex-1">
                  <div className="flex items-center gap-2">
                    <p className="text-xs uppercase tracking-widest text-gray-light">
                      Saving Throw
                    </p>
                    <button
                      type="button"
                      onClick={() =>
                        isEditing &&
                        handleSavingThrowDistinctionToggle(ability.ability)
                      }
                      disabled={!isEditing}
                      className={`flex items-center gap-1 ${
                        isEditing
                          ? "cursor-pointer text-gray-light hover:text-gold-neutral"
                          : "cursor-default"
                      }`}
                      aria-label={`${ability.savingThrowDistinction} saving throw proficiency`}
                      title={
                        isEditing
                          ? ability.savingThrowDistinction === "Proficiency"
                            ? "Remove proficiency"
                            : "Add proficiency"
                          : ability.savingThrowDistinction
                      }
                    >
                      {ability.savingThrowDistinction === "Nothing" && (
                        <Circle className="h-4 w-4" />
                      )}
                      {ability.savingThrowDistinction === "Proficiency" && (
                        <CircleDot className="h-4 w-4 text-gold-neutral" />
                      )}
                    </button>
                  </div>
                  {isEditing ? (
                    <>
                      <input
                        type="text"
                        value={ability.savingThrow}
                        placeholder="+5"
                        onChange={(e) =>
                          handleSavingThrowChange(
                            ability.ability,
                            e.target.value,
                          )
                        }
                        className="w-full min-w-0 text-lg font-semibold text-neutral-text bg-neutral border border-gold-dark px-2 py-1"
                      />
                    </>
                  ) : (
                    <p className="text-lg font-semibold text-neutral-text">
                      {ability.savingThrow}
                    </p>
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
                    <div key={skill.name} className="flex flex-col gap-1">
                      <div className="flex items-center justify-between gap-3 border border-gold-dark bg-neutral px-3 py-2">
                        <p className="text-sm text-neutral-text">
                          {skill.name}
                        </p>
                        <div className="flex items-center gap-2">
                          {isEditing ? (
                            <input
                              type="text"
                              value={skill.modifier}
                              placeholder="+2"
                              onChange={(e) =>
                                handleSkillModifierChange(
                                  ability.ability,
                                  skill.name,
                                  e.target.value,
                                )
                              }
                              className="text-gold-neutral bg-dark border border-gold-dark px-2 py-1 w-16 text-right"
                            />
                          ) : (
                            <span className="text-gold-neutral">
                              {skill.modifier}
                            </span>
                          )}
                          <button
                            type="button"
                            onClick={() =>
                              isEditing &&
                              handleSkillDistinctionToggle(
                                ability.ability,
                                skill.name,
                              )
                            }
                            disabled={!isEditing}
                            className={`flex items-center gap-1 ${
                              isEditing
                                ? "cursor-pointer text-gray-light hover:text-gold-neutral"
                                : "cursor-default"
                            }`}
                            aria-label={`${skill.distinction} skill proficiency`}
                            title={
                              isEditing
                                ? skill.distinction === "Nothing"
                                  ? "Set proficiency"
                                  : skill.distinction === "Proficiency"
                                    ? "Set expertise"
                                    : "Remove distinction"
                                : skill.distinction
                            }
                          >
                            {skill.distinction === "Nothing" && (
                              <>
                                <Circle className="h-4 w-4" />
                                <Circle className="h-4 w-4" />
                              </>
                            )}
                            {skill.distinction === "Proficiency" && (
                              <>
                                <CircleDot className="h-4 w-4 text-gold-neutral" />
                                <Circle className="h-4 w-4" />
                              </>
                            )}
                            {skill.distinction === "Expertise" && (
                              <>
                                <CircleDot className="h-4 w-4 text-gold-neutral" />
                                <CircleDot className="h-4 w-4 text-gold-neutral" />
                              </>
                            )}
                          </button>
                        </div>
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
