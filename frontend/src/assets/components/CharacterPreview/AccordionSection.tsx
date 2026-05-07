import { useState } from "react";
import { ChevronDown, Check, X, Plus } from "lucide-react";
import { PreviewActionButton } from "./PreviewActionButton";
import type { CharacterSectionProps, AccordionItem, StatDetail } from "./types";

interface AccordionSectionProps extends CharacterSectionProps {
  content: AccordionItem[];
}

export function AccordionSection({
  content,
  expandedItems,
  toggleItem,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
}: AccordionSectionProps) {
  const items = content as AccordionItem[];
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedContent, setEditedContent] = useState<AccordionItem[]>(items);

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
    setEditedContent(items);
    onEditModeChange?.(false);
  };

  const handleSubitemChange = (
    itemIndex: number,
    subitemIndex: number,
    field: "title" | "content",
    newValue: string,
  ) => {
    setEditedContent((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex && item.subitems) {
          return {
            ...item,
            subitems: item.subitems.map((subitem, si) =>
              si === subitemIndex ? { ...subitem, [field]: newValue } : subitem,
            ),
          };
        }
        return item;
      }),
    );
  };

  const handleAddSubitem = (index: number) => {
    setEditedContent((prev) =>
      prev.map((item, i) => {
        if (i === index) {
          return {
            ...item,
            subitems: [
              ...(item.subitems || []),
              { title: "New Item", content: "Item description" },
            ],
          };
        }
        return item;
      }),
    );
  };

  const handleRemoveSubitem = (itemIndex: number, subitemIndex: number) => {
    setEditedContent((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex && item.subitems) {
          return {
            ...item,
            subitems: item.subitems.filter((_, si) => si !== subitemIndex),
          };
        }
        return item;
      }),
    );
  };

  const currentItems = isEditing ? editedContent : items;

  return (
    <div className="flex flex-col gap-3">
      {/* Header with Edit Button */}
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">
          Items & Content
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

      {currentItems.map((item, index) => {
        const itemId = `accordion-${index}`;
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
                  <h3 className="text-lg font-semibold text-neutral-text">
                    {item.title}
                  </h3>
                  {typeof item.content === "string" && (
                    <p className="text-xs uppercase tracking-widest text-gold-light mt-1">
                      {item.content}
                    </p>
                  )}
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text">
                    <ChevronDown
                      className={`h-4 w-4  ${
                        isOpen ? "rotate-180 text-gold-neutral" : ""
                      }`}
                    />
                    {isOpen ? "Close" : "Open"}
                  </span>
                </div>
              </div>
            </button>

            {isOpen && (
              <div
                id={`${itemId}-panel`}
                className="bg-neutral border-2 border-t-0 border-gold-dark p-4 flex flex-col gap-3"
              >
                {Array.isArray(item.content) && item.content.length > 0 ? (
                  <div className="flex flex-col gap-3">
                    {item.content.map(
                      (subItem: StatDetail, subIndex: number) => (
                        <div
                          key={subIndex}
                          className="flex items-center justify-between gap-4 border border-gold-dark bg-dark p-3"
                        >
                          <p className="text-sm text-neutral-text">
                            {typeof subItem === "object" && "name" in subItem
                              ? subItem.name
                              : subItem}
                          </p>
                          {typeof subItem === "object" &&
                            "value" in subItem && (
                              <p className="text-sm font-semibold text-gold-neutral">
                                {subItem.value}
                              </p>
                            )}
                        </div>
                      ),
                    )}
                  </div>
                ) : null}

                {item.subitems && item.subitems.length > 0 && (
                  <div className="flex flex-col gap-2">
                    {item.subitems.map((subitem, subIndex) => {
                      const subitemId = `${itemId}-subitem-${subIndex}`;
                      const isSubitemOpen = expandedItems.has(subitemId);
                      const subitemContent =
                        typeof subitem.content === "string"
                          ? subitem.content
                          : "";

                      return (
                        <div key={subitemId} className="flex flex-col">
                          <button
                            type="button"
                            onClick={() => toggleItem(subitemId)}
                            className={`w-full p-3 text-left cursor-pointer border border-gold-dark  ${
                              isSubitemOpen
                                ? "bg-light hover:bg-gray-light"
                                : "bg-dark hover:bg-light"
                            }`}
                            aria-expanded={isSubitemOpen}
                          >
                            <div className="flex items-start justify-between gap-4">
                              {isEditing ? (
                                <input
                                  type="text"
                                  value={subitem.title}
                                  placeholder="Item title"
                                  onChange={(e) =>
                                    handleSubitemChange(
                                      index,
                                      subIndex,
                                      "title",
                                      e.target.value,
                                    )
                                  }
                                  className="font-medium text-neutral-text bg-neutral border border-gold-dark px-2 py-1  flex-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <p className="font-medium text-neutral-text">
                                  {subitem.title}
                                </p>
                              )}
                              <div className="flex items-center gap-2 flex-shrink-0">
                                {isEditing && (
                                  <PreviewActionButton
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      handleRemoveSubitem(index, subIndex);
                                    }}
                                    variant="danger"
                                    className="p-1"
                                    title="Delete subitem"
                                  >
                                    <X className="h-3 w-3" />
                                  </PreviewActionButton>
                                )}
                                <ChevronDown
                                  className={`h-3 w-3  flex-shrink-0 ${
                                    isSubitemOpen
                                      ? "rotate-180 text-gold-neutral"
                                      : "text-neutral-text"
                                  }`}
                                />
                              </div>
                            </div>
                          </button>

                          {isSubitemOpen && (
                            <div className="bg-dark p-3 border border-t-0 border-gold-dark text-sm text-gold-light leading-7">
                              {isEditing ? (
                                <textarea
                                  value={subitemContent}
                                  placeholder="Item description"
                                  onChange={(e) =>
                                    handleSubitemChange(
                                      index,
                                      subIndex,
                                      "content",
                                      e.target.value,
                                    )
                                  }
                                  className="w-full text-sm text-neutral-text bg-neutral border border-gold-dark p-2  min-h-20"
                                />
                              ) : (
                                subitemContent
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isEditing && (
                  <PreviewActionButton
                    onClick={() => handleAddSubitem(index)}
                    className="mt-2"
                    variant="primary"
                    icon={<Plus className="h-4 w-4" />}
                    title="Add new subitem"
                  >
                    Add Item
                  </PreviewActionButton>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
