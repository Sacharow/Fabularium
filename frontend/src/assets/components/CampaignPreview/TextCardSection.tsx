import { useEffect, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { ChevronDown, Check, X, Plus } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import type { TextCard } from "./types";

interface Props {
  title?: string;
  items?: TextCard[];
  isEditMode?: boolean;
  onEditModeChange?: (isEditing: boolean) => void;
  onContentChange?: (newItems: TextCard[]) => void;
  onToggleVisibility?: (itemId: string, isPublic: boolean) => Promise<void>;
}

export function TextCardSection({
  title,
  items = [],
  isEditMode = false,
  onEditModeChange,
  onContentChange,
  onToggleVisibility,
  campaignOwnerId,
}: Props & { campaignOwnerId?: string }) {
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedItems, setEditedItems] = useState<TextCard[]>(items);
  const [togglingItemId, setTogglingItemId] = useState<string | null>(null);
  const { user } = useAuth();
  const isOwner = user?.id && campaignOwnerId && user.id === campaignOwnerId;

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
  const handleLinkedItemsChange = (
    index: number,
    itemType: "locations" | "npcs" | "missions",
    itemId: string,
    checked: boolean,
  ) => {
    setEditedItems((prev) =>
      prev.map((item, i) => {
        if (i !== index) return item;
        const fieldName =
          itemType === "locations"
            ? "linkedLocationIds"
            : itemType === "missions"
              ? "linkedMissionIds"
              : "linkedNpcIds";
        const current = item[fieldName] ?? [];
        return {
          ...item,
          [fieldName]: checked
            ? [...current, itemId]
            : current.filter((id) => id !== itemId),
        };
      }),
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

  const handleToggleVisibility = async (item: TextCard) => {
    if (!onToggleVisibility) {
      return;
    }

    setTogglingItemId(item.id);
    try {
      await onToggleVisibility(item.id, !(item.isPublic ?? true));
    } finally {
      setTogglingItemId(null);
    }
  };

  const currentItems = isEditing ? editedItems : items;

  const renderLinkCheckbox = (
    checked: boolean,
    onChange: (checked: boolean) => void,
    label: string,
    key: string,
  ) => (
    <label
      key={key}
      className="group flex items-center gap-2 cursor-pointer text-sm text-neutral-text"
    >
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="peer sr-only"
      />
      <span className="h-4 w-4 border-2 border-gold-dark bg-dark inline-flex items-center justify-center transition-colors peer-checked:bg-gold-neutral peer-checked:border-gold-neutral peer-focus-visible:outline-2 peer-focus-visible:outline-gold-light group-hover:border-gold-neutral">
        <Check className="h-3 w-3 text-dark opacity-0 transition-opacity peer-checked:opacity-100" />
      </span>
      <span>{label}</span>
    </label>
  );

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
          ) : isOwner ? (
            <PreviewActionButton
              onClick={handleEdit}
              variant="ghost"
              title="Edit this section"
            >
              Edit
            </PreviewActionButton>
          ) : null}
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
                className={`w-full p-3 text-left cursor-pointer border-2 border-gold-neutral  ${
                  isOpen
                    ? "bg-light hover:bg-gray-light"
                    : "bg-neutral hover:bg-light"
                }`}
                aria-expanded={isOpen}
                aria-controls={`${itemId}-panel`}
              >
                <div className="flex items-center justify-between gap-3">
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
                        className="font-medium text-neutral-text bg-dark border border-gold-dark px-2 py-1"
                      />
                    ) : (
                      <div className="flex items-center justify-between gap-3">
                        <h3 className="text-lg font-semibold text-neutral-text">
                          {it.title}
                        </h3>
                        {isOwner && (
                          <div
                            className="!bg-dark border-2 border-gold-neutral text-neutral-text w-24 px-2 py-1 text-xs font-semibold uppercase tracking-widest flex items-center justify-center"
                            aria-label={
                              (it.isPublic ?? true)
                                ? "Public visibility"
                                : "Private visibility"
                            }
                            title={
                              (it.isPublic ?? true)
                                ? "Public visibility"
                                : "Private visibility"
                            }
                          >
                            <span className="w-full text-center">
                              {(it.isPublic ?? true) ? "PUBLIC" : "PRIVATE"}
                            </span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {isEditing && isOwner && onToggleVisibility && (
                      <PreviewActionButton
                        onClick={async (e) => {
                          e.stopPropagation();
                          await handleToggleVisibility(it);
                        }}
                        variant="ghost"
                        className="relative z-10 !bg-dark hover:!bg-gold-neutral w-24 justify-center px-2 py-1 text-xs"
                        title="Toggle PUBLIC visibility"
                        disabled={togglingItemId === it.id}
                      >
                        <span className="w-full text-center text-xs">
                          {(it.isPublic ?? true) ? "PUBLIC" : "PRIVATE"}
                        </span>
                      </PreviewActionButton>
                    )}
                    {isEditing && (
                      <PreviewActionButton
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveItem(index);
                        }}
                        variant="danger"
                        className="relative z-10 !bg-dark hover:!bg-error p-1 flex items-center justify-center self-stretch"
                        title="Delete item"
                      >
                        <X className="h-3 w-3" />
                      </PreviewActionButton>
                    )}
                    <ChevronDown
                      className={`h-4 w-4 flex-shrink-0 ${
                        isOpen ? "rotate-180 text-gold-neutral" : ""
                      }`}
                    />
                  </div>
                </div>
              </div>

              {isOpen && (
                <div
                  id={`${itemId}-panel`}
                  className="bg-neutral border-2 border-t-0 border-gold-dark p-3 flex flex-col gap-3"
                >
                  {isEditing ? (
                    <>
                      <textarea
                        value={it.content}
                        placeholder="Item description"
                        onChange={(e) =>
                          handleItemChange(index, "content", e.target.value)
                        }
                        className="w-full text-sm text-neutral-text bg-dark border border-gold-dark p-2 min-h-16"
                      />

                      {/* Linked Locations (edit mode) */}
                      {it.allLocations && it.allLocations.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs uppercase tracking-widest text-gray-light">
                            Link Locations
                          </p>
                          <div className="flex flex-col gap-1 bg-dark p-2 border border-gold-dark rounded">
                            {it.allLocations.map((location) =>
                              renderLinkCheckbox(
                                (it.linkedLocationIds ?? []).includes(
                                  location.id,
                                ),
                                (isChecked) =>
                                  handleLinkedItemsChange(
                                    index,
                                    "locations",
                                    location.id,
                                    isChecked,
                                  ),
                                location.title,
                                location.id,
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Linked NPCs (edit mode) */}
                      {it.allNpcs && it.allNpcs.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs uppercase tracking-widest text-gray-light">
                            Link NPCs
                          </p>
                          <div className="flex flex-col gap-1 bg-dark p-2 border border-gold-dark rounded">
                            {it.allNpcs.map((npc) =>
                              renderLinkCheckbox(
                                (it.linkedNpcIds ?? []).includes(npc.id),
                                (isChecked) =>
                                  handleLinkedItemsChange(
                                    index,
                                    "npcs",
                                    npc.id,
                                    isChecked,
                                  ),
                                npc.title,
                                npc.id,
                              ),
                            )}
                          </div>
                        </div>
                      )}

                      {/* Linked Quests (edit mode) */}
                      {it.allMissions && it.allMissions.length > 0 && (
                        <div className="flex flex-col gap-2">
                          <p className="text-xs uppercase tracking-widest text-gray-light">
                            Link Quests
                          </p>
                          <div className="flex flex-col gap-1 bg-dark p-2 border border-gold-dark rounded">
                            {it.allMissions.map((mission) =>
                              renderLinkCheckbox(
                                (it.linkedMissionIds ?? []).includes(
                                  mission.id,
                                ),
                                (isChecked) =>
                                  handleLinkedItemsChange(
                                    index,
                                    "missions",
                                    mission.id,
                                    isChecked,
                                  ),
                                mission.title,
                                mission.id,
                              ),
                            )}
                          </div>
                        </div>
                      )}
                    </>
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
        {isEditing && isOwner && (
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
