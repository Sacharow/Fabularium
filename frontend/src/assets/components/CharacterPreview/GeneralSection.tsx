import { useState } from "react";
import { Check, X, Trash } from "lucide-react";
import { z } from "zod";
import { PreviewActionButton } from "./PreviewActionButton";
import type { CharacterSectionProps, StatDetail } from "./types";

const generalSectionSchema = z.object({
  Name: z.string().trim().min(1, "Name is required"),
  "Last Name": z.string().trim().min(1, "Last Name is required"),
  Nickname: z.string().trim().optional(),
  "Hit Points": z.union([z.string(), z.number()]).optional(),
  "Armor Class": z.union([z.string(), z.number()]).optional(),
  Speed: z.union([z.string(), z.number()]).optional(),
  Level: z.union([z.string(), z.number()]).optional(),
  Experience: z.union([z.string(), z.number()]).optional(),
  "Proficiency Bonus": z.union([z.string(), z.number()]).optional(),
  Class: z.string().trim().optional(),
  Subclass: z.string().trim().optional(),
  Race: z.string().trim().optional(),
  Subrace: z.string().trim().optional(),
  Inspiration: z.union([z.string(), z.number()]).optional(),
});

interface GeneralSectionProps extends CharacterSectionProps {
  content: StatDetail[];
}

export function GeneralSection({
  content,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
  isOwner = false,
}: GeneralSectionProps) {
  const generalStats = content as StatDetail[];
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedContent, setEditedContent] =
    useState<StatDetail[]>(generalStats);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const getGeneralStat = (name: string) =>
    (isEditing
      ? editedContent.find((stat) => stat.name === name)?.value
      : generalStats.find((stat) => stat.name === name)?.value) ?? "-";

  const handleEdit = () => {
    setIsEditing(true);
    onEditModeChange?.(true);
  };

  const handleSave = () => {
    // Convert edited content to validation object
    const validationObj: Record<string, any> = {};
    editedContent.forEach((stat) => {
      validationObj[stat.name] = stat.value;
    });

    const result = generalSectionSchema.safeParse(validationObj);

    if (!result.success) {
      const fieldErrors: Record<string, string> = {};
      result.error.flatten().fieldErrors;
      for (const [field, messages] of Object.entries(
        result.error.flatten().fieldErrors,
      )) {
        fieldErrors[field] = messages?.[0] || "Invalid value";
      }
      setErrors(fieldErrors);
      return;
    }

    setErrors({});
    setIsEditing(false);
    onEditModeChange?.(false);
    onContentChange?.(editedContent);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedContent(generalStats);
    setErrors({});
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

          {isOwner ? (
            <PreviewActionButton
              onClick={() => setShowDeleteModal(true)}
              variant="danger"
              icon={<Trash className="h-4 w-4" />}
              title="Delete character"
            >
              Delete
            </PreviewActionButton>
          ) : null}
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
                  {errors.Name && (
                    <p className="text-xs text-error mt-1">{errors.Name}</p>
                  )}
                  <input
                    type="text"
                    value={getGeneralStat("Last Name")}
                    placeholder="Last Name"
                    onChange={(e) =>
                      handleValueChange("Last Name", e.target.value)
                    }
                    className="text-2xl font-bold text-neutral-text bg-dark border border-gold-dark p-2 "
                  />
                  {errors["Last Name"] && (
                    <p className="text-xs text-error mt-1">
                      {errors["Last Name"]}
                    </p>
                  )}
                </>
              ) : (
                <>
                  <h2 className="text-4xl font-bold text-neutral-text">
                    {getGeneralStat("Name")} {getGeneralStat("Last Name")}
                  </h2>
                </>
              )}
              {isEditing ? (
                <>
                  <input
                    type="text"
                    value={getGeneralStat("Nickname")}
                    placeholder="Nickname"
                    onChange={(e) =>
                      handleValueChange("Nickname", e.target.value)
                    }
                    className="text-sm text-neutral-text bg-dark border border-gold-dark p-2 "
                  />
                  {errors.Nickname && (
                    <p className="text-xs text-error mt-1">{errors.Nickname}</p>
                  )}
                </>
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
                  <>
                    <input
                      type="text"
                      value={item.value}
                      placeholder={item.label}
                      onChange={(e) =>
                        handleValueChange(item.label, e.target.value)
                      }
                      className="text-2xl font-bold text-neutral-text bg-neutral border border-gold-dark p-2 "
                    />
                    {errors[item.label] && (
                      <p className="text-xs text-error">{errors[item.label]}</p>
                    )}
                  </>
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
                  <>
                    <input
                      type="text"
                      value={item.value}
                      placeholder={item.label}
                      onChange={(e) =>
                        handleValueChange(item.label, e.target.value)
                      }
                      className="text-lg font-semibold text-neutral-text bg-neutral border border-gold-dark p-2 "
                    />
                    {errors[item.label] && (
                      <p className="text-xs text-error">{errors[item.label]}</p>
                    )}
                  </>
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
                    <div className="flex flex-col items-end gap-1">
                      <input
                        type="text"
                        value={item.value}
                        placeholder={item.label}
                        onChange={(e) =>
                          handleValueChange(item.label, e.target.value)
                        }
                        className="text-base font-semibold text-neutral-text bg-neutral border border-gold-dark px-2 py-1  text-right"
                      />
                      {errors[item.label] && (
                        <p className="text-xs text-error">
                          {errors[item.label]}
                        </p>
                      )}
                    </div>
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
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative z-10 w-full max-w-md border-2 border-gold-dark bg-neutral p-6">
            <h3 className="text-lg font-bold text-neutral-text">
              Confirm Delete
            </h3>
            <p className="mt-3 text-sm text-gray-light">
              Are you sure you want to delete this character? This action cannot
              be undone.
            </p>
            <div className="mt-6 flex gap-3">
              <PreviewActionButton
                onClick={() => setShowDeleteModal(false)}
                variant="secondary"
              >
                Cancel
              </PreviewActionButton>
              <PreviewActionButton
                onClick={() => {
                  // Placeholder delete action
                  // Integrate with deletion logic where appropriate
                  console.log("Character delete confirmed (placeholder)");
                  setShowDeleteModal(false);
                }}
                variant="danger"
              >
                Delete
              </PreviewActionButton>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
