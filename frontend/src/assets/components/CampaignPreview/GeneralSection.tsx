import { useState, useEffect } from "react";
import { z } from "zod";
import { Check, X, Copy, Trash, Upload, X as XIcon } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import type { CampaignSectionInteractiveProps } from "./types";

export function GeneralSection({
  content,
  isEditMode = false,
  onEditModeChange,
  onContentChange,
}: CampaignSectionInteractiveProps) {
  const info = content as {
    title?: string;
    description?: string;
    theme?: string;
    players?: number;
    sessions?: string;
    image?: string;
    campaignKey?: string;
  };
  const [isEditing, setIsEditing] = useState(isEditMode);
  const [editedInfo, setEditedInfo] = useState(info);
  const [errors, setErrors] = useState<{ title?: string }>({});
  const [copied, setCopied] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  const handleCopyCampaignKey = () => {
    const key = info.campaignKey || "CAMPAIGN-KEY-12345";
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
    onEditModeChange?.(true);
  };

  const handleSave = () => {
    const generalSchema = z.object({
      title: z.string().min(1, "Title is required"),
      description: z.string().optional(),
      theme: z.string().optional(),
      players: z.number().optional(),
      sessions: z.union([z.string(), z.number()]).optional(),
      image: z.string().optional(),
      campaignKey: z.string().optional(),
    });

    const result = generalSchema.safeParse(editedInfo);
    if (!result.success) {
      const flattened = result.error.flatten();
      const titleErr = flattened.fieldErrors.title?.[0] ?? "Title is required";
      setErrors({ title: titleErr });
      return;
    }

    setErrors({});
    setIsEditing(false);
    onEditModeChange?.(false);
    onContentChange?.(editedInfo);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(info);
    onEditModeChange?.(false);
  };

  // Keep local editedInfo in sync if parent content changes
  useEffect(() => {
    setEditedInfo(info);
  }, [info]);

  // Keep local edit mode in sync with parent
  useEffect(() => {
    setIsEditing(isEditMode);
  }, [isEditMode]);

  const handleFieldChange = (
    field: string,
    value: string | number | undefined,
  ) => {
    setEditedInfo((prev) => {
      const next = { ...prev, [field]: value };
      return next;
    });
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const result = event.target?.result as string;
        handleFieldChange("image", result);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleRemoveImage = () => {
    handleFieldChange("image", undefined);
  };

  const currentInfo = isEditing ? editedInfo : info;

  return (
    <div className="flex flex-col gap-6">
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
          <PreviewActionButton
            onClick={() => setShowDeleteModal(true)}
            variant="danger"
            icon={<Trash className="h-4 w-4" />}
            title="Delete campaign"
          >
            Delete
          </PreviewActionButton>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        <div className="border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          {isEditing ? (
            <>
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-gray-light">
                    Title
                  </label>
                  <input
                    type="text"
                    value={currentInfo.title || ""}
                    placeholder="Campaign title"
                    onChange={(e) => handleFieldChange("title", e.target.value)}
                    className="text-2xl font-bold text-neutral-text bg-dark border border-gold-dark p-2 "
                  />
                  {errors.title && (
                    <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-gray-light">
                    Description
                  </label>
                  <textarea
                    value={currentInfo.description || ""}
                    placeholder="Campaign description"
                    onChange={(e) =>
                      handleFieldChange("description", e.target.value)
                    }
                    className="text-sm text-neutral-text bg-dark border border-gold-dark p-2  min-h-20"
                  />
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-gray-light">
                    Theme
                  </label>
                  <input
                    type="text"
                    value={currentInfo.theme || ""}
                    placeholder="Campaign theme"
                    onChange={(e) => handleFieldChange("theme", e.target.value)}
                    className="text-lg font-semibold text-neutral-text bg-dark border border-gold-dark p-2 "
                  />
                </div>

                <div className="grid gap-3 sm:grid-cols-3">
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-light">
                      Players
                    </label>
                    <input
                      type="number"
                      value={currentInfo.players ?? ""}
                      placeholder="Number of players"
                      onChange={(e) => {
                        const raw = e.target.value;
                        const num = raw === "" ? undefined : parseInt(raw, 10);
                        handleFieldChange("players", num);
                      }}
                      className="text-lg font-semibold text-neutral-text bg-dark border border-gold-dark p-2 "
                    />
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="text-xs uppercase tracking-widest text-gray-light">
                      Session
                    </label>
                    <input
                      type="text"
                      value={currentInfo.sessions || ""}
                      placeholder="Current session"
                      onChange={(e) =>
                        handleFieldChange("sessions", e.target.value)
                      }
                      className="text-lg font-semibold text-neutral-text bg-dark border border-gold-dark p-2 "
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-2">
                  <label className="text-xs uppercase tracking-widest text-gray-light">
                    Campaign Image
                  </label>
                  <div className="flex items-center gap-2">
                    <label className="flex-1 flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-gold-dark bg-dark hover:bg-light cursor-pointer">
                      <Upload className="h-4 w-4 text-gray-light" />
                      <span className="text-sm text-gray-light">
                        {currentInfo.image ? "Change Image" : "Upload Image"}
                      </span>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleImageUpload}
                        className="hidden"
                      />
                    </label>
                    {currentInfo.image && (
                      <PreviewActionButton
                        onClick={handleRemoveImage}
                        variant="danger"
                        icon={<XIcon className="h-4 w-4" />}
                        title="Remove image"
                      />
                    )}
                  </div>
                  {currentInfo.image && (
                    <div className="w-full h-144 overflow-hidden border border-gold-dark">
                      <img
                        src={currentInfo.image}
                        alt="Campaign preview"
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </>
          ) : (
            <>
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-neutral-text">
                    {currentInfo.title}
                  </h2>
                  <p className="text-sm text-gray-light">
                    {currentInfo.description}
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Theme
                  </p>
                  <p className="text-lg font-semibold text-neutral-text">
                    {currentInfo.theme}
                  </p>
                </div>
              </div>

              <hr className="border-gold-dark my-4" />

              <div className="grid gap-3 sm:grid-cols-3">
                <div className="border border-gold-dark bg-dark p-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Players
                  </p>
                  <p className="text-lg font-semibold text-neutral-text">
                    {currentInfo.players}
                  </p>
                </div>
                <div className="border border-gold-dark bg-dark p-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Current Session
                  </p>
                  <p className="text-lg font-semibold text-neutral-text">
                    {currentInfo.sessions ?? "—"}
                  </p>
                </div>
                <div className="border border-gold-dark bg-dark p-3">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Notes
                  </p>
                  <p className="text-lg font-semibold text-neutral-text">—</p>
                </div>
              </div>

              <div className="border border-gold-dark bg-dark p-4 flex items-center justify-between">
                <div className="flex flex-col gap-1">
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Campaign Key
                  </p>
                  <p className="text-sm text-neutral-text">
                    {info.campaignKey || "CAMPAIGN-KEY-12345"}
                  </p>
                </div>
                <PreviewActionButton
                  onClick={handleCopyCampaignKey}
                  variant="ghost"
                  icon={<Copy className="h-4 w-4" />}
                  title={copied ? "Copied!" : "Copy campaign key"}
                >
                  {copied ? "Copied" : "Copy"}
                </PreviewActionButton>
              </div>

              {currentInfo.image && (
                <div className="w-full h-144 overflow-hidden border border-gold-dark">
                  <img
                    src={currentInfo.image}
                    alt={currentInfo.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
            </>
          )}
        </div>
      </div>
      {showDeleteModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
          <div className="absolute inset-0 bg-black opacity-50" />
          <div className="relative z-10 w-full max-w-md border-2 border-gold-dark bg-neutral p-6">
            <h3 className="text-lg font-bold text-neutral-text">
              Confirm Delete
            </h3>
            <p className="mt-3 text-sm text-gray-light">
              Are you sure you want to delete this campaign? This action cannot
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
                  console.log("Campaign delete confirmed (placeholder)");
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

export default GeneralSection;
