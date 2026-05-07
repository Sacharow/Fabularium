import { useEffect, useState } from "react";
import { ChevronDown, Check, X, Plus, Trash2 } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import type { TextCard } from "./types";

interface Props {
  title?: string;
  items?: TextCard[];
  isEditMode?: boolean;
  onEditModeChange?: (isEditing: boolean) => void;
  onContentChange?: (newItems: TextCard[]) => void;
}

export function TextCardSection({
  title,
  items = [],
  isEditMode = false,
  onEditModeChange,
  onContentChange,
}: Props) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedItems, setEditedItems] = useState<TextCard[]>(items);

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
    onEditModeChange?.(true);
  };

  const handleSave = () => {
    setIsEditing(false);
    onEditModeChange?.(false);
    onContentChange?.(editedItems);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedItems(items);
    onEditModeChange?.(false);
  };

  useEffect(() => {
    setEditedItems(items);
  }, [items]);

  useEffect(() => {
    setIsEditing(isEditMode);
  }, [isEditMode]);

  const handleItemChange = (
    index: number,
    field: "title" | "content",
    value: string,
  ) => {
    setEditedItems((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item)),
    );
  };

  const handleAddItem = () => {
    setEditedItems((prev) => [
      ...prev,
      {
        id: `new-${Date.now()}`,
        title: "New Item",
        content: "Description",
      },
    ]);
  };

  const handleRemoveItem = (index: number) => {
    setEditedItems((prev) => prev.filter((_, i) => i !== index));
  };

  const currentItems = isEditing ? editedItems : items;

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">{title}</h2>
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

      <div className="flex flex-col gap-3">
        {currentItems.map((it, index) => {
          const itemId = `textcard-${index}`;
          const isOpen = expandedItems.has(itemId);

          return (
            <div key={itemId} className="flex flex-col">
              <div
                role="button"
                tabIndex={0}
                onClick={() => toggleItem(itemId)}
                onKeyDown={(e) => {
                  if (e.key === "Enter" || e.key === " ") {
                    e.preventDefault();
                    toggleItem(itemId);
                  }
                }}
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
                        placeholder="Item title"
                        onChange={(e) =>
                          handleItemChange(index, "title", e.target.value)
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
                          handleRemoveItem(index);
                        }}
                        variant="danger"
                        className="p-1"
                        title="Delete item"
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
              </div>

              {isOpen && (
                <div
                  id={`${itemId}-panel`}
                  className="bg-neutral border-2 border-t-0 border-gold-dark p-4 flex flex-col gap-4"
                >
                  {isEditing ? (
                    <textarea
                      value={it.content}
                      placeholder="Item description"
                      onChange={(e) =>
                        handleItemChange(index, "content", e.target.value)
                      }
                      className="w-full text-sm text-neutral-text bg-dark border border-gold-dark p-2  min-h-20"
                    />
                  ) : (
                    <p className="text-sm text-gold-light">{it.content}</p>
                  )}

                  {/* Section 1 */}
                  {it.section1Title && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-widest text-gray-light">
                        {it.section1Title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {it.section1Items && it.section1Items.length > 0 ? (
                          it.section1Items.map((relItem) => (
                            <button
                              key={relItem.id}
                              className="border-2 border-gold-neutral bg-dark px-3 py-2 text-xs uppercase tracking-widest text-neutral-text font-semibold cursor-pointer hover:bg-light"
                            >
                              {relItem.title}
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-gray-neutral">None</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Section 2 */}
                  {it.section2Title && (
                    <div className="flex flex-col gap-2">
                      <p className="text-xs uppercase tracking-widest text-gray-light">
                        {it.section2Title}
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {it.section2Items && it.section2Items.length > 0 ? (
                          it.section2Items.map((relItem) => (
                            <button
                              key={relItem.id}
                              className="border-2 border-gold-neutral bg-dark px-3 py-2 text-xs uppercase tracking-widest text-neutral-text font-semibold cursor-pointer hover:bg-light"
                            >
                              {relItem.title}
                            </button>
                          ))
                        ) : (
                          <p className="text-xs text-gray-neutral">None</p>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          );
        })}
        {currentItems.length === 0 && (
          <p className="text-sm text-gray-neutral">None</p>
        )}
        {isEditing && (
          <PreviewActionButton
            onClick={handleAddItem}
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            className="mt-2"
            title="Add new item"
          >
            Add Item
          </PreviewActionButton>
        )}
      </div>
    </div>
  );
}

export default TextCardSection;
