import { useState } from "react";
import { ChevronDown, Check, X, Plus } from "lucide-react";
import { PreviewActionButton } from "./PreviewActionButton";
import type { CharacterSectionProps, AccordionItem, StatDetail } from "./types";
import { useEffect } from "react";

interface AccordionSectionProps extends CharacterSectionProps {
  content: AccordionItem[];
  sectionType?: "equipment" | "features" | "spells";
}

export function AccordionSection({
  content,
  expandedItems,
  toggleItem,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
  sectionType,
}: AccordionSectionProps) {
  const items = content as AccordionItem[];
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedContent, setEditedContent] = useState<AccordionItem[]>(items);

  useEffect(() => {
    setIsEditing(isEditMode);
  }, [isEditMode]);

  useEffect(() => {
    setEditedContent(items);
  }, [items]);

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

  const currencyKeys = ["CP", "SP", "EP", "GP", "PP"];

  const isCurrencyItem = (item: AccordionItem) =>
    item.title.trim().toLowerCase() === "currency";

  const normalizeCurrencySubitems = (
    subitems: AccordionItem[] = [],
  ): AccordionItem[] => {
    const byKey = new Map(
      subitems.map((subitem) => [subitem.title.trim().toUpperCase(), subitem]),
    );

    return currencyKeys.map((key) => {
      const existing = byKey.get(key);
      return {
        title: key,
        content:
          typeof existing?.content === "string"
            ? existing.content
            : existing?.content?.[0] && "value" in existing.content[0]
              ? String(existing.content[0].value)
              : "0",
      };
    });
  };

  const handleCurrencyValueChange = (
    itemIndex: number,
    currencyKey: string,
    newValue: string,
  ) => {
    const sanitized = newValue.replace(/[^0-9]/g, "");

    setEditedContent((prev) =>
      prev.map((item, i) => {
        if (i !== itemIndex) {
          return item;
        }

        const normalized = normalizeCurrencySubitems(item.subitems);
        return {
          ...item,
          subitems: normalized.map((subitem) =>
            subitem.title === currencyKey
              ? {
                  ...subitem,
                  content: sanitized === "" ? "0" : sanitized,
                }
              : subitem,
          ),
        };
      }),
    );
  };

  const handleEquipmentTypeChange = (
    itemIndex: number,
    subitemIndex: number,
    newType: string,
  ) => {
    setEditedContent((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex && item.subitems) {
          return {
            ...item,
            subitems: item.subitems.map((subitem, si) =>
              si === subitemIndex ? { ...subitem, type: newType } : subitem,
            ),
          };
        }
        return item;
      }),
    );
  };

  const handleEquipmentWeightChange = (
    itemIndex: number,
    subitemIndex: number,
    newWeight: string,
  ) => {
    const sanitized = newWeight.replace(/[^0-9.]/g, "");
    const weight = sanitized === "" ? undefined : parseFloat(sanitized);

    setEditedContent((prev) =>
      prev.map((item, i) => {
        if (i === itemIndex && item.subitems) {
          return {
            ...item,
            subitems: item.subitems.map((subitem, si) =>
              si === subitemIndex ? { ...subitem, weight: weight } : subitem,
            ),
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
        const isCurrency = isCurrencyItem(item);

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
                    {(isCurrency && isEditing
                      ? normalizeCurrencySubitems(item.subitems)
                      : item.subitems
                    ).map((subitem, subIndex) => {
                      const subitemId = `${itemId}-subitem-${subIndex}`;
                      const isSubitemOpen = expandedItems.has(subitemId);
                      const subitemContent =
                        typeof subitem.content === "string"
                          ? subitem.content
                          : "";

                      if (isCurrency && isEditing) {
                        return (
                          <div
                            key={`${subitemId}-currency-input`}
                            className="border border-gold-dark bg-dark p-3"
                          >
                            <label className="flex items-center justify-between gap-3">
                              <span className="font-medium text-neutral-text">
                                {subitem.title}
                              </span>
                              <input
                                type="text"
                                inputMode="numeric"
                                value={subitemContent}
                                onChange={(e) =>
                                  handleCurrencyValueChange(
                                    index,
                                    subitem.title,
                                    e.target.value,
                                  )
                                }
                                className="w-28 text-right text-sm text-neutral-text bg-neutral border border-gold-dark px-2 py-1"
                                aria-label={`${subitem.title} currency value`}
                              />
                            </label>
                          </div>
                        );
                      }

                      return (
                        <div key={subitemId} className="flex flex-col">
                          <div
                            className={`flex items-stretch border border-gold-dark ${
                              isSubitemOpen
                                ? "bg-light hover:bg-gray-light"
                                : "bg-dark hover:bg-light"
                            }`}
                          >
                            <button
                              type="button"
                              onClick={() => toggleItem(subitemId)}
                              className="flex flex-1 items-center justify-between gap-4 p-3 text-left cursor-pointer"
                              aria-expanded={isSubitemOpen}
                            >
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
                                  className="font-medium text-neutral-text bg-neutral border border-gold-dark px-2 py-1"
                                  onClick={(e) => e.stopPropagation()}
                                />
                              ) : (
                                <p className="font-medium text-neutral-text">
                                  {subitem.title}
                                </p>
                              )}
                              <ChevronDown
                                className={`h-3 w-3 flex-shrink-0 ${
                                  isSubitemOpen
                                    ? "rotate-180 text-gold-neutral"
                                    : "text-neutral-text"
                                }`}
                              />
                            </button>

                            {isEditing && !isCurrency && (
                              <div className="flex items-center pr-2">
                                <PreviewActionButton
                                  onClick={() => {
                                    handleRemoveSubitem(index, subIndex);
                                  }}
                                  variant="danger"
                                  className="p-1"
                                  title="Delete subitem"
                                >
                                  <X className="h-3 w-3" />
                                </PreviewActionButton>
                              </div>
                            )}
                          </div>

                          {isSubitemOpen && (
                            <div className="bg-dark p-3 border border-t-0 border-gold-dark text-sm text-gold-light leading-7">
                              {isEditing ? (
                                <div className="flex flex-col gap-3">
                                  {!isCurrency &&
                                    sectionType === "equipment" && (
                                      <>
                                        <div className="flex gap-3">
                                          <div className="flex-1">
                                            <label className="block text-xs uppercase tracking-widest text-neutral-text font-medium mb-1">
                                              Type
                                            </label>
                                            <select
                                              value={
                                                subitem.type || "Equipment"
                                              }
                                              onChange={(e) =>
                                                handleEquipmentTypeChange(
                                                  index,
                                                  subIndex,
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full text-sm text-neutral-text bg-neutral border border-gold-dark px-2 py-1"
                                            >
                                              <option value="Equipment">
                                                Equipment
                                              </option>
                                              <option value="Tool">Tool</option>
                                              <option value="Weapon">
                                                Weapon
                                              </option>
                                              <option value="Adventuring Gear">
                                                Adventuring Gear
                                              </option>
                                              <option value="Armor">
                                                Armor
                                              </option>
                                            </select>
                                          </div>
                                          <div className="flex-1">
                                            <label className="block text-xs uppercase tracking-widest text-neutral-text font-medium mb-1">
                                              Weight (lbs)
                                            </label>
                                            <input
                                              type="text"
                                              inputMode="decimal"
                                              value={
                                                subitem.weight?.toString() || ""
                                              }
                                              placeholder="0.0"
                                              onChange={(e) =>
                                                handleEquipmentWeightChange(
                                                  index,
                                                  subIndex,
                                                  e.target.value,
                                                )
                                              }
                                              className="w-full text-sm text-neutral-text bg-neutral border border-gold-dark px-2 py-1"
                                            />
                                          </div>
                                        </div>
                                      </>
                                    )}
                                  <div>
                                    <label className="block text-xs uppercase tracking-widest text-neutral-text font-medium mb-1">
                                      Description
                                    </label>
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
                                      className="w-full text-sm text-neutral-text bg-neutral border border-gold-dark p-2 min-h-20"
                                    />
                                  </div>
                                </div>
                              ) : (
                                <div className="flex flex-col gap-2">
                                  {!isCurrency &&
                                    sectionType === "equipment" && (
                                      <>
                                        <p className="text-xs uppercase tracking-widest text-gold-light">
                                          Category:{" "}
                                          {subitem.type || "Equipment"}
                                        </p>
                                        {subitem.weight != null && (
                                          <p className="text-xs uppercase tracking-widest text-gold-light">
                                            Weight: {subitem.weight} lb
                                          </p>
                                        )}
                                      </>
                                    )}
                                  <p>{subitemContent}</p>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}

                {isEditing && (
                  <>
                    {!isCurrency && (
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
                  </>
                )}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
