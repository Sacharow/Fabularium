import { useState } from "react";
import { Check, X, Copy } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import type { CampaignSectionProps } from "./types";

export function GeneralSection({ content }: CampaignSectionProps) {
  const info = content as {
    title?: string;
    description?: string;
    theme?: string;
    players?: number;
    sessions?: string;
    image?: string;
    campaignKey?: string;
  };

  const [isEditing, setIsEditing] = useState(false);
  const [editedInfo, setEditedInfo] = useState(info);
  const [copied, setCopied] = useState(false);

  const handleCopyCampaignKey = () => {
    const key = info.campaignKey || "CAMPAIGN-KEY-12345";
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = () => {
    setIsEditing(false);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditedInfo(info);
  };

  const handleFieldChange = (field: string, value: string | number) => {
    setEditedInfo((prev) => ({ ...prev, [field]: value }));
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
                      value={currentInfo.players || 0}
                      placeholder="Number of players"
                      onChange={(e) =>
                        handleFieldChange("players", parseInt(e.target.value))
                      }
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
    </div>
  );
}

export default GeneralSection;
