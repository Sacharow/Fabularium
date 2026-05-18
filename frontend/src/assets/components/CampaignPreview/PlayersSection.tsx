import { useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import { Copy, RefreshCw } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import type { PlayersContent } from "./types";

interface Props {
  content?: PlayersContent;
  campaignKey?: string;
  onGenerateJoinCode?: () => void;
  campaignOwnerId?: string;
}

export function PlayersSection({
  content,
  campaignKey,
  onGenerateJoinCode,
  campaignOwnerId,
}: Props) {
  const data = content ?? { dm: null, players: [] };
  const [copied, setCopied] = useState(false);
  const { user } = useAuth();
  const isOwner = user?.id && campaignOwnerId && user.id === campaignOwnerId;

  const handleCopyCampaignKey = () => {
    const key = campaignKey || "";
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">Players</h2>{" "}
      </div>

      <div className="flex flex-col gap-3">
        <div className="border-2 border-gold-neutral bg-neutral p-4 flex items-center justify-between">
          <span className="text-xs uppercase tracking-widest text-gold-light">
            {data.players.length + (data.dm ? 1 : 0)} Members
          </span>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-4 flex items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-gray-light">
              Campaign Key
            </p>
            <p className="text-sm text-neutral-text">{campaignKey || "—"}</p>
          </div>
          <div className="flex items-center gap-2">
            <PreviewActionButton
              onClick={handleCopyCampaignKey}
              variant="ghost"
              className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
              icon={<Copy className="h-4 w-4" />}
              title={copied ? "Copied!" : "Copy campaign key"}
              disabled={!campaignKey}
            >
              {copied ? "Copied" : "Copy"}
            </PreviewActionButton>
            {isOwner && (
              <PreviewActionButton
                onClick={() => onGenerateJoinCode?.()}
                variant="ghost"
                className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
                icon={<RefreshCw className="h-4 w-4" />}
                title="Generate new campaign key"
                disabled={!onGenerateJoinCode}
              >
                Generate
              </PreviewActionButton>
            )}
          </div>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-gray-light">
            Dungeon Master
          </p>

          {data.dm ? (
            <div className="border border-gold-dark bg-dark px-4 py-3">
              <p className="text-lg font-semibold text-neutral-text">
                {data.dm.name}
              </p>
            </div>
          ) : (
            <div className="border border-gold-dark bg-dark px-4 py-3">
              <p className="text-sm text-gray-neutral">Unassigned</p>
            </div>
          )}
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-4 flex flex-col gap-3">
          <p className="text-xs uppercase tracking-widest text-gray-light">
            Party
          </p>

          {data.players.length > 0 ? (
            <div className="grid gap-2 sm:grid-cols-2">
              {data.players.map((p, i) => (
                <div
                  key={`${p.name}-${i}`}
                  className="border border-gold-dark bg-dark px-4 py-3"
                >
                  <p className="font-semibold text-neutral-text">{p.name}</p>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gold-dark bg-dark px-4 py-3">
              <p className="text-sm text-gray-neutral">No players</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default PlayersSection;
