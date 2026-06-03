import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { Copy, RefreshCw } from "lucide-react";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";
import { campaignService } from "../../../services/campaignService";
import type { PlayersContent } from "./types";
import ConfirmModal from "../ui/ConfirmModal";

interface Props {
  content?: PlayersContent;
  campaignKey?: string;
  campaignId?: string;
  onGenerateJoinCode?: () => void;
  campaignOwnerId?: string;
  onRefreshCampaign?: () => void | Promise<void>;
}

export function PlayersSection({
  content,
  campaignKey,
  campaignId,
  onGenerateJoinCode,
  campaignOwnerId,
}: Props) {
  const data = content ?? { dm: null, players: [] };
  const [copied, setCopied] = useState(false);
  const [isLeaving, setIsLeaving] = useState(false);
  const [leaveError, setLeaveError] = useState<string | null>(null);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [removeError, setRemoveError] = useState<string | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [showRemoveModal, setShowRemoveModal] = useState(false);
  const [pendingRemovePlayer, setPendingRemovePlayer] = useState<string | null>(
    null,
  );
  const { user } = useAuth();
  const navigate = useNavigate();
  const isOwner = user?.id && campaignOwnerId && user.id === campaignOwnerId;
  const canLeave = Boolean(
    user?.id &&
      !isOwner &&
      data.players.some((player) => player.id === user.id),
  );

  const handleCopyCampaignKey = () => {
    const key = campaignKey || "";
    if (!key) return;
    navigator.clipboard.writeText(key);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleLeaveCampaign = async () => {
    if (!campaignId || !user?.id) return;
    // open modal instead (handled by confirm handler)
    setShowLeaveModal(true);
  };

  const handleRemovePlayer = async (playerId?: string) => {
    if (!campaignId || !playerId) return;
    setPendingRemovePlayer(playerId);
    setShowRemoveModal(true);
  };

  const confirmLeave = async () => {
    if (!campaignId || !user?.id) return;
    setShowLeaveModal(false);
    setIsLeaving(true);
    setLeaveError(null);

    try {
      await campaignService.removeContributor(campaignId, user.id);
      navigate("/campaigns");
    } catch (err) {
      setLeaveError(
        err instanceof Error ? err.message : "Failed to leave campaign",
      );
    } finally {
      setIsLeaving(false);
    }
  };

  const confirmRemovePlayer = async () => {
    const playerId = pendingRemovePlayer;
    if (!campaignId || !playerId) return;
    setShowRemoveModal(false);
    setRemovingId(playerId);
    setRemoveError(null);

    try {
      await campaignService.removeContributor(campaignId, playerId);
      await onRefreshCampaign?.();
    } catch (err) {
      setRemoveError(
        err instanceof Error ? err.message : "Failed to remove player",
      );
    } finally {
      setRemovingId(null);
      setPendingRemovePlayer(null);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <h2 className="text-2xl font-bold text-neutral-text">Players</h2>{" "}
      </div>
      <ConfirmModal
        open={showLeaveModal}
        title="Leave Campaign"
        message="Leave this campaign? You will be removed from the player list."
        confirmLabel="Leave"
        cancelLabel="Cancel"
        onConfirm={confirmLeave}
        onCancel={() => setShowLeaveModal(false)}
      />

      <ConfirmModal
        open={showRemoveModal}
        title="Remove Player"
        message="Remove this player from the campaign? This will disconnect them from the campaign."
        confirmLabel="Remove"
        cancelLabel="Cancel"
        onConfirm={confirmRemovePlayer}
        onCancel={() => {
          setShowRemoveModal(false);
          setPendingRemovePlayer(null);
        }}
      />

      <div className="flex flex-col gap-3">
        <div className="border-2 border-gold-neutral bg-neutral p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
          <span className="text-xs uppercase tracking-widest text-gold-light">
            {data.players.length + (data.dm ? 1 : 0)} Members
          </span>
        </div>

        <div className="border-2 border-gold-neutral bg-neutral p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex flex-col gap-1">
            <p className="text-xs uppercase tracking-widest text-gray-light">
              Campaign Key
            </p>
            <p className="text-sm text-neutral-text">{campaignKey || "—"}</p>
          </div>
          <div className="flex items-center gap-2 mt-2 sm:mt-0">
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
            <div className="flex flex-col sm:flex-row sm:flex-wrap gap-2">
              {data.players.map((p, i) => (
                <div
                  key={p.id ?? `${p.name}-${i}`}
                  className="w-full flex flex-col sm:flex-row sm:items-center gap-3"
                >
                  <div className="w-full border border-gold-dark bg-dark px-4 py-3">
                    <p className="font-semibold text-neutral-text">{p.name}</p>
                  </div>
                  <div className="mt-2 sm:mt-0">
                    {p.id === user?.id ? (
                      canLeave ? (
                        <PreviewActionButton
                          onClick={handleLeaveCampaign}
                          variant="danger"
                          className="!border-error !bg-dark !text-error hover:!bg-error hover:!text-dark"
                          disabled={isLeaving || !campaignId}
                          title="Leave this campaign"
                        >
                          {isLeaving ? "Leaving..." : "Leave"}
                        </PreviewActionButton>
                      ) : null
                    ) : isOwner && p.id && p.id !== campaignOwnerId ? (
                      <PreviewActionButton
                        onClick={() => handleRemovePlayer(p.id)}
                        variant="danger"
                        className="!border-error !bg-dark !text-error hover:!bg-error hover:!text-dark"
                        disabled={removingId === p.id || !campaignId}
                        title="Remove player"
                      >
                        {removingId === p.id ? "Removing..." : "Remove"}
                      </PreviewActionButton>
                    ) : null}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="border border-gold-dark bg-dark px-4 py-3">
              <p className="text-sm text-gray-neutral">No players</p>
            </div>
          )}

          {leaveError ? (
            <div className="border border-error bg-dark px-4 py-3 text-sm text-error">
              {leaveError}
            </div>
          ) : null}

          {/* duplicate bottom leave button removed — leave action is available on the player's row */}
        </div>
      </div>
    </div>
  );
}

export default PlayersSection;
