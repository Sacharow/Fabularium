import { useState } from "react";
import { ChevronDown, Check, X, Plus, Trash2 } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import type { NoteItem } from "./types";

interface Props {
  items?: NoteItem[];
}

export function NotesSection({ items = [] }: Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(false);
  const [editedItems, setEditedItems] = useState<NoteItem[]>(items);

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const updated = new Set(prev);
      if (updated.has(itemId)) {
        updated.delete(itemId);
      } else {
        updated.add(itemId);
      }
      return updated;
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItems(items);
  };

  const handleNoteChange = (
    index: number,
    field: "title" | "content",
    value: string,
  ) => {
    setEditedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleAddNote = () => {
    setEditedItems((prev) => [
      ...prev,
      { id: `new-${Date.now()}`, title: "New Note", content: "Note content" },
    ]);
  };

  const handleRemoveNote = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const currentItems = isEditing ? editedItems : items;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">Notes</h2>
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

      <section className="flex flex-col gap-3">
        {currentItems.map((it, index) => {
          const itemId = `note-${index}`;
          const isOpen = expandedItems.has(itemId);

          return (
            <div key={itemId} className="flex flex-col">
              <button
                type="button"
                onClick={() => toggleItem(itemId)}
                className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral  ${
                  isOpen
                    ? "bg-light hover:bg-gray-light"
                    : "bg-neutral hover:bg-light"
                }`}
                aria-expanded={isOpen}
                aria-controls={`${itemId}-panel`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    {isEditing ? (
                      <input
                        type="text"
                        value={it.title}
                        placeholder="Note title"
                        onChange={(e) =>
                          handleNoteChange(index, "title", e.target.value)
                        }
                        onClick={(e) => e.stopPropagation()}
                        className="text-lg font-semibold text-neutral-text bg-dark border border-gold-dark px-2 py-1  w-full"
                      />
                    ) : (
                      <h3 className="text-lg font-semibold text-neutral-text">
                        {it.title}
                      </h3>
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
                        <Trash2 className="h-3 w-3" />
                      </PreviewActionButton>
                    )}
                    <ChevronDown
                      className={`h-4 w-4  flex-shrink-0 ${
                        isOpen ? "rotate-180 text-gold-neutral" : ""
                      }`}
                    />
                  </div>
                </div>
              </button>

              {isOpen && (
                <div
                  id={`${itemId}-panel`}
                  className="bg-neutral border-2 border-t-0 border-gold-dark p-4"
                >
                  {isEditing ? (
                    <textarea
                      value={it.content}
                      placeholder="Note content"
                      onChange={(e) =>
                        handleNoteChange(index, "content", e.target.value)
                      }
                      className="w-full text-sm text-neutral-text bg-dark border border-gold-dark p-2  min-h-20"
                    />
                  ) : (
                    <p className="text-sm text-gray-light">{it.content}</p>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {currentItems.length === 0 && (
          <p className="text-sm text-gray-neutral">No notes</p>
        )}
        {isEditing && (
          <PreviewActionButton
            onClick={handleAddNote}
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            className="mt-2"
            title="Add new note"
          >
            Add Note
          </PreviewActionButton>
        )}
      </section>
    </div>
  );
}

export default NotesSection;
