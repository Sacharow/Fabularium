import { useState } from "react";
import { ChevronDown, Check, X, Plus } from "lucide-react";
import { PreviewActionButton } from "./PreviewActionButton";
import type {
  CharacterSectionProps,
  PersonalSectionContent,
  PersonalDetail,
  PersonalNote,
} from "./types";

interface PersonalSectionProps extends CharacterSectionProps {
  content: PersonalSectionContent;
}

export function PersonalSection({
  content,
  expandedItems,
  toggleItem,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
  isOwner = false,
}: PersonalSectionProps) {
  const personalContent = content as PersonalSectionContent;
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedContent, setEditedContent] =
    useState<PersonalSectionContent>(personalContent);

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
    setEditedContent(personalContent);
    onEditModeChange?.(false);
  };

  const handleDetailChange = (label: string, newValue: string | number) => {
    setEditedContent((prev) => ({
      ...prev,
      details: prev.details.map((detail) =>
        detail.label === label ? { ...detail, value: newValue } : detail,
      ),
    }));
  };

  const handleBackstoryChange = (newValue: string) => {
    setEditedContent((prev) => ({
      ...prev,
      backstory: newValue,
    }));
  };

  const handleNoteChange = (
    index: number,
    field: "title" | "content",
    newValue: string,
  ) => {
    setEditedContent((prev) => ({
      ...prev,
      notes: prev.notes.map((note, i) =>
        i === index ? { ...note, [field]: newValue } : note,
      ),
    }));
  };

  const handleAddNote = () => {
    setEditedContent((prev) => ({
      ...prev,
      notes: [...prev.notes, { title: "New Note", content: "Note content" }],
    }));
  };

  const handleRemoveNote = (index: number) => {
    setEditedContent((prev) => ({
      ...prev,
      notes: prev.notes.filter((_, i) => i !== index),
    }));
  };

  const currentContent = isEditing ? editedContent : personalContent;

  return (
    <div className="flex flex-col gap-6">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">
          Personal Details
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

      <section className="grid gap-4 xl:grid-cols-5">
        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-6 xl:col-span-3">
          <div className="flex flex-col gap-2 pb-4">
            <p className="text-xs uppercase tracking-widest text-gold-light">
              Character Essence
            </p>
            <div className="flex flex-col gap-1">
              <h2 className="text-3xl font-bold text-neutral-text">
                Personality & Traits
              </h2>
              <p className="text-sm text-gray-light">
                Core characteristics and ideals
              </p>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Personality", key: "Personality" },
              { label: "Ideals", key: "Ideals" },
              { label: "Bonds", key: "Bonds" },
              { label: "Flaws", key: "Flaws" },
            ].map((item) => {
              const value =
                currentContent.details.find(
                  (d: PersonalDetail) => d.label === item.key,
                )?.value || "-";
              return (
                <div
                  key={item.label}
                  className="border border-gold-dark bg-dark p-4 flex flex-col gap-2"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    {item.label}
                  </p>
                  {isEditing ? (
                    <textarea
                      value={value}
                      placeholder={item.key}
                      onChange={(e) =>
                        handleDetailChange(item.key, e.target.value)
                      }
                      className="w-full min-w-0 text-sm text-neutral-text bg-neutral border border-gold-dark p-2 min-h-24"
                    />
                  ) : (
                    <p className="text-sm text-neutral-text leading-relaxed">
                      {value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4 xl:col-span-2">
          <div className="flex items-center justify-between gap-4 pb-4">
            <div>
              <p className="text-xs uppercase tracking-widest text-gold-light">
                Physical Appearance
              </p>
              <h3 className="text-lg font-semibold text-neutral-text">
                Visual Profile
              </h3>
            </div>
          </div>
          <hr className="border-gold-dark" />

          <div className="grid gap-3 sm:grid-cols-2">
            {[
              { label: "Height", key: "Height" },
              { label: "Weight", key: "Weight" },
              { label: "Eye Color", key: "Eye Color" },
              { label: "Hair Color", key: "Hair Color" },
              { label: "Skin Color", key: "Skin Color" },
              { label: "Age", key: "Age" },
            ].map((item) => {
              const value =
                currentContent.details.find(
                  (d: PersonalDetail) => d.label === item.key,
                )?.value || "-";
              return (
                <div
                  key={item.label}
                  className="border border-gold-dark bg-dark p-3 flex items-center justify-between gap-3"
                >
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    {item.label}
                  </p>
                  {isEditing ? (
                    <input
                      type="text"
                      value={value}
                      placeholder={item.key}
                      onChange={(e) =>
                        handleDetailChange(item.key, e.target.value)
                      }
                      className="w-full min-w-0 text-sm font-semibold text-neutral-text bg-neutral border border-gold-dark p-2"
                    />
                  ) : (
                    <p className="text-sm font-semibold text-neutral-text">
                      {value}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="grid gap-4 lg:grid-cols-2">
        <article className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 pb-3">
            <h3 className="text-lg font-semibold text-neutral-text">
              Alignment & Values
            </h3>
            <span className="text-xs uppercase tracking-widest text-gold-light">
              Profile
            </span>
          </div>
          <hr className="border-gold-dark" />

          <div className="flex flex-col gap-3">
            {currentContent.details.map((detail: PersonalDetail) => {
              if (["Alignment"].includes(detail.label)) {
                return (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4 border border-gold-dark bg-dark px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-widest text-gray-light">
                      {detail.label}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={detail.value}
                        placeholder={detail.label}
                        onChange={(e) =>
                          handleDetailChange(detail.label, e.target.value)
                        }
                        className="w-full min-w-0 text-base font-semibold text-neutral-text bg-neutral border border-gold-dark px-2 py-1 text-right"
                      />
                    ) : (
                      <p className="text-base font-semibold text-neutral-text text-right">
                        {detail.value}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>

        <article className="border-2 border-gold-neutral bg-neutral p-5 flex flex-col gap-4">
          <div className="flex items-center justify-between gap-4 pb-3">
            <h3 className="text-lg font-semibold text-neutral-text">
              Languages
            </h3>
            <span className="text-xs uppercase tracking-widest text-gold-light">
              Communication
            </span>
          </div>
          <hr className="border-gold-dark" />

          <div className="flex flex-col gap-3">
            {currentContent.details.map((detail: PersonalDetail) => {
              if (["Languages"].includes(detail.label)) {
                return (
                  <div
                    key={detail.label}
                    className="flex items-center justify-between gap-4 border border-gold-dark bg-dark px-4 py-3"
                  >
                    <p className="text-xs uppercase tracking-widest text-gray-light">
                      {detail.label}
                    </p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={detail.value}
                        placeholder={detail.label}
                        onChange={(e) =>
                          handleDetailChange(detail.label, e.target.value)
                        }
                        className="w-full min-w-0 text-base font-semibold text-neutral-text bg-neutral border border-gold-dark px-2 py-1 text-right"
                      />
                    ) : (
                      <p className="text-base font-semibold text-neutral-text text-right">
                        {detail.value}
                      </p>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        </article>
      </section>

      <section className="flex flex-col gap-4">
        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => toggleItem("personal-backstory")}
            className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral  ${
              expandedItems.has("personal-backstory")
                ? "bg-light hover:bg-gray-light"
                : "bg-neutral hover:bg-light"
            }`}
            aria-expanded={expandedItems.has("personal-backstory")}
            aria-controls="personal-backstory-panel"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-text">
                  Backstory
                </h3>
              </div>
              <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text flex-shrink-0">
                <ChevronDown
                  className={`h-4 w-4  ${
                    expandedItems.has("personal-backstory")
                      ? "rotate-180 text-gold-neutral"
                      : "text-neutral-text"
                  }`}
                />
                {expandedItems.has("personal-backstory") ? "Close" : "Open"}
              </span>
            </div>
          </button>

          {expandedItems.has("personal-backstory") && (
            <div
              id="personal-backstory-panel"
              className="bg-neutral p-4 border-2 border-t-0 border-gold-dark text-sm text-neutral-text leading-7"
            >
              {isEditing ? (
                <textarea
                  value={currentContent.backstory}
                  onChange={(e) => handleBackstoryChange(e.target.value)}
                  className="w-full text-sm text-neutral-text bg-dark border border-gold-dark p-3 min-h-32"
                />
              ) : (
                currentContent.backstory
              )}
            </div>
          )}
        </div>

        <div className="flex flex-col">
          <button
            type="button"
            onClick={() => toggleItem("personal-notes")}
            className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral  ${
              expandedItems.has("personal-notes")
                ? "bg-light hover:bg-gray-light"
                : "bg-neutral hover:bg-light"
            }`}
            aria-expanded={expandedItems.has("personal-notes")}
            aria-controls="personal-notes-panel"
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-neutral-text">
                  Notes
                </h3>
              </div>
              <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text flex-shrink-0">
                <ChevronDown
                  className={`h-4 w-4  ${
                    expandedItems.has("personal-notes")
                      ? "rotate-180 text-gold-neutral"
                      : "text-neutral-text"
                  }`}
                />
                {expandedItems.has("personal-notes") ? "Close" : "Open"}
              </span>
            </div>
          </button>

          {expandedItems.has("personal-notes") && (
            <div
              id="personal-notes-panel"
              className="bg-neutral border-2 border-t-0 border-gold-dark p-4 flex flex-col gap-3"
            >
              {currentContent.notes.map((note: PersonalNote, index: number) => {
                const noteId = `personal-note-${index}`;
                const isNoteOpen = expandedItems.has(noteId);

                return (
                  <div key={noteId} className="flex flex-col">
                    <button
                      type="button"
                      onClick={() => toggleItem(noteId)}
                      className={`w-full p-3 text-left cursor-pointer border border-gold-dark  ${
                        isNoteOpen
                          ? "bg-light hover:bg-gray-light"
                          : "bg-dark hover:bg-light"
                      }`}
                      aria-expanded={isNoteOpen}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          {isEditing ? (
                            <input
                              type="text"
                              value={note.title}
                              placeholder="Title"
                              onChange={(e) =>
                                handleNoteChange(index, "title", e.target.value)
                              }
                              className="font-medium text-neutral-text bg-dark border border-gold-dark px-2 py-1 w-full"
                            />
                          ) : (
                            <p className="font-medium text-neutral-text">
                              {note.title}
                            </p>
                          )}
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          {isEditing && (
                            <PreviewActionButton
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRemoveNote(index);
                              }}
                              variant="danger"
                              className="p-1"
                              title="Delete note"
                            >
                              <X className="h-3 w-3" />
                            </PreviewActionButton>
                          )}
                          <ChevronDown
                            className={`h-3 w-3  ${
                              isNoteOpen
                                ? "rotate-180 text-gold-neutral"
                                : "text-neutral-text"
                            }`}
                          />
                        </div>
                      </div>
                    </button>

                    {isNoteOpen && (
                      <div className="bg-dark p-3 border border-gold-dark text-sm text-neutral-text leading-7">
                        {isEditing ? (
                          <textarea
                            value={note.content}
                            placeholder="Content"
                            onChange={(e) =>
                              handleNoteChange(index, "content", e.target.value)
                            }
                            className="w-full text-sm text-neutral-text bg-dark border border-gold-dark p-2 min-h-20"
                          />
                        ) : (
                          note.content
                        )}
                      </div>
                    )}
                  </div>
                );
              })}

              {isEditing && (
                <PreviewActionButton
                  onClick={handleAddNote}
                  className="mt-2"
                  variant="primary"
                  icon={<Plus className="h-4 w-4" />}
                  title="Add new note"
                >
                  Add Note
                </PreviewActionButton>
              )}
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
