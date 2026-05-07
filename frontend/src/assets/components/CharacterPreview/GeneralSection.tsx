import { useState } from "react";
import { Check, X } from "lucide-react";
import { PreviewActionButton } from "./PreviewActionButton";
import type { CharacterSectionProps, StatDetail } from "./types";

interface GeneralSectionProps extends CharacterSectionProps {
  content: StatDetail[];
}

export function GeneralSection({
  content,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
}: GeneralSectionProps) {
  const generalStats = content as StatDetail[];
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedContent, setEditedContent] =
    useState<StatDetail[]>(generalStats);

  const getGeneralStat = (name: string) =>
    (isEditing
      ? editedContent.find((stat) => stat.name === name)?.value
      : generalStats.find((stat) => stat.name === name)?.value) ?? "-";

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
    setEditedContent(generalStats);
    onEditModeChange?.(false);
  };

  const handleValueChange = (name: string, newValue: string | number) => {
    setEditedContent((prev) =>
      prev.map((stat) =>
        stat.name === name ? { ...stat, value: newValue } : stat,
      ),
    );
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">
          General Information
        </h2>
        <div className="flex items-center gap-2">
          {isEditing ? (
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
          )}
        </div>
      </div>

      <section className="grid gap-4 xl:grid-cols-5">
        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-6 xl:col-span-3">
          <div className="flex flex-col gap-2 pb-4">
            <p className="text-xs uppercase tracking-widest text-gold-light">
              Main Stats
            </p>
            <div className="flex flex-col gap-1">
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={getGeneralStat("Name")}
                    placeholder="Name"
                    onChange={(e) => handleValueChange("Name", e.target.value)}
                    className="text-4xl font-bold text-neutral-text bg-dark border border-gold-dark p-2 "
                  />
                  <input
                    type="text"
                    value={getGeneralStat("Last Name")}
                    placeholder="Last Name"
                    onChange={(e) =>
                      handleValueChange("Last Name", e.target.value)
                    }
                    className="text-2xl font-bold text-neutral-text bg-dark border border-gold-dark p-2 "
                  />
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-neutral-text">
                    {getGeneralStat("Name")} {getGeneralStat("Last Name")}
                  </h2>
                </>
              )}
              {isEditing ? (
                <input
                  type="text"
                  value={getGeneralStat("Nickname")}
                  placeholder="Nickname"
                  onChange={(e) =>
                    handleValueChange("Nickname", e.target.value)
                  }
                  className="text-sm text-neutral-text bg-dark border border-gold-dark p-2 "
                />
              ) : (
                <p className="text-sm text-gray-light">
                  {getGeneralStat("Nickname")}
                </p>
              )}
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-3">
            {[
              { label: "Hit Points", value: getGeneralStat("Hit Points") },
              { label: "Armor Class", value: getGeneralStat("Armor Class") },
              { label: "Speed", value: getGeneralStat("Speed") },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-gold-dark bg-dark p-4 flex flex-col gap-2"
              >
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  {item.label}
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.value}
                    placeholder={item.label}
                    onChange={(e) =>
                      handleValueChange(item.label, e.target.value)
                    }
                    className="text-2xl font-bold text-neutral-text bg-neutral border border-gold-dark p-2 "
                  />
                ) : (
                  <p className="text-2xl font-bold text-neutral-text">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Character Build
              </p>
              <h3 className="text-lg font-semibold text-neutral-text">
                Class, Subclass, and Heritage
              </h3>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Class", value: getGeneralStat("Class") },
              { label: "Subclass", value: getGeneralStat("Subclass") },
              { label: "Race", value: getGeneralStat("Race") },
              { label: "Subrace", value: getGeneralStat("Subrace") },
            ].map((item) => (
              <div
                key={item.label}
                className="border border-gold-dark bg-dark p-4 flex flex-col gap-2"
              >
                <p className="text-xs uppercase tracking-widest text-gray-light">
                  {item.label}
                </p>
                {isEditing ? (
                  <input
                    type="text"
                    value={item.value}
                    placeholder={item.label}
                    onChange={(e) =>
                      handleValueChange(item.label, e.target.value)
                    }
                    className="text-lg font-semibold text-neutral-text bg-neutral border border-gold-dark p-2 "
                  />
                ) : (
                  <p className="text-lg font-semibold text-neutral-text">
                    {item.value}
                  </p>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-3">
        {[
          {
            title: "Progress",
            items: [
              { label: "Level", value: getGeneralStat("Level") },
              { label: "Experience", value: getGeneralStat("Experience") },
              {
                label: "Proficiency Bonus",
                value: getGeneralStat("Proficiency Bonus"),
              },
            ],
          },
          {
            title: "Identity Notes",
            items: [
              { label: "Name", value: getGeneralStat("Name") },
              {
                label: "Last Name",
                value: getGeneralStat("Last Name"),
              },
              { label: "Nickname", value: getGeneralStat("Nickname") },
            ],
          },
          {
            title: "Other",
            items: [
              { label: "Inspiration", value: getGeneralStat("Inspiration") },
            ],
          },
        ].map((group) => (
          <article
            key={group.title}
            className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4"
          >
            <div className="flex items-center justify-between gap-4 pb-3">
              <h3 className="text-lg font-semibold text-neutral-text">
                {group.title}
              </h3>
              <span className="text-xs uppercase tracking-widest text-gold-light">
                Overview
              </span>
            </div>
            <hr className="border-gold-dark" />

            <div className="flex flex-col gap-3">
              {group.items.map((item) => (
                <div
                  key={item.label}
                  className="flex items-center justify-between gap-4 border border-gold-dark bg-dark px-4 py-3"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    {item.label}
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={item.value}
                      placeholder={item.label}
                      onChange={(e) =>
                        handleValueChange(item.label, e.target.value)
                      }
                      className="text-base font-semibold text-neutral-text bg-neutral border border-gold-dark px-2 py-1  text-right"
                    />
                  ) : (
                    <p className="text-base font-semibold text-neutral-text text-right">
                      {item.value}
                    </p>
                  )}
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
