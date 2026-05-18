import { useEffect, useMemo, useState } from "react";
import { CampaignModal } from "../ui/CampaignModal";
import { ArrowRight, Link2, Plus, RefreshCw, User } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../../context/AuthContext";
import { characterService } from "../../../services/characterService";
import { campaignService } from "../../../services/campaignService";
import { PreviewActionButton } from "../CharacterPreview/PreviewActionButton";

type CampaignCharacter = {
  id: string;
  name: string;
  level?: number;
  ownerId?: string | null;
  race?: string | null;
  class?: string | null;
  subclass?: string | null;
  campaignId?: string | null;
};

type OwnedCharacter = CampaignCharacter & {
  connectedCampaign?: string | null;
  combat?: {
    hp?: number | null;
    ac?: number | null;
    speed?: number | null;
  } | null;
};

interface Props {
  campaignId?: string;
  campaignOwnerId?: string;
  characters?: CampaignCharacter[];
  onRefreshCampaign?: () => void | Promise<void>;
}

export function CharacterSection({
  campaignId,
  campaignOwnerId,
  characters = [],
  onRefreshCampaign,
}: Props) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isConnectOpen, setIsConnectOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [isConnecting, setIsConnecting] = useState(false);
  const [disconnectingCharacterId, setDisconnectingCharacterId] = useState<
    string | null
  >(null);
  const [createName, setCreateName] = useState("New Character");
  const [createError, setCreateError] = useState<string | null>(null);
  const [connectError, setConnectError] = useState<string | null>(null);
  const [ownedCharacters, setOwnedCharacters] = useState<OwnedCharacter[]>([]);
  const [loadingOwnedCharacters, setLoadingOwnedCharacters] = useState(false);
  const [selectedCharacterId, setSelectedCharacterId] = useState<string>("");

  const availableOwnedCharacters = useMemo(
    () =>
      ownedCharacters.filter(
        (character) => character.campaignId !== campaignId,
      ),
    [campaignId, ownedCharacters],
  );

  const currentUserId = user?.id;

  const canDisconnectCharacter = (character: CampaignCharacter) =>
    Boolean(
      currentUserId &&
        (character.ownerId === currentUserId ||
          campaignOwnerId === currentUserId),
    );

  const handleDisconnectCharacter = async (character: CampaignCharacter) => {
    if (!campaignId || !currentUserId) {
      return;
    }

    setDisconnectingCharacterId(character.id);

    try {
      if (character.ownerId === currentUserId) {
        await characterService.editCharacter(character.id, {
          campaignId: null,
        });
      } else {
        await campaignService.disconnectCharacter(campaignId, character.id);
      }

      await onRefreshCampaign?.();
    } catch (err) {
      console.error("Failed to disconnect character", err);
    } finally {
      setDisconnectingCharacterId(null);
    }
  };

  useEffect(() => {
    if (isCreateOpen) {
      setCreateName("New Character");
      setCreateError(null);
    }
  }, [isCreateOpen]);

  useEffect(() => {
    if (!isConnectOpen) {
      return;
    }

    const loadCharacters = async () => {
      setLoadingOwnedCharacters(true);
      setConnectError(null);

      try {
        const data =
          (await characterService.getCharacters()) as OwnedCharacter[];
        setOwnedCharacters(data);

        const nextSelection = data.find(
          (character) => character.campaignId !== campaignId,
        );
        setSelectedCharacterId(nextSelection?.id ?? "");
      } catch (err) {
        setOwnedCharacters([]);
        setSelectedCharacterId("");
        setConnectError(
          err instanceof Error ? err.message : "Failed to load characters",
        );
      } finally {
        setLoadingOwnedCharacters(false);
      }
    };

    void loadCharacters();
  }, [campaignId, isConnectOpen]);

  const handleCreateCharacter = async () => {
    const safeName = createName.trim() || "New Character";
    if (!campaignId) {
      setCreateError("Open a campaign before creating a character.");
      return;
    }

    setIsCreating(true);
    setCreateError(null);

    try {
      await characterService.createCharacter({
        name: safeName,
        campaignId,
      });
      setIsCreateOpen(false);
      await onRefreshCampaign?.();
    } catch (err) {
      setCreateError(
        err instanceof Error ? err.message : "Failed to create character",
      );
    } finally {
      setIsCreating(false);
    }
  };

  const handleConnectCharacter = async () => {
    if (!campaignId) {
      setConnectError("Open a campaign before connecting a character.");
      return;
    }

    if (!selectedCharacterId) {
      setConnectError("Choose a character to connect.");
      return;
    }

    setIsConnecting(true);
    setConnectError(null);

    try {
      await characterService.editCharacter(selectedCharacterId, {
        campaignId,
      });
      setIsConnectOpen(false);
      await onRefreshCampaign?.();
    } catch (err) {
      setConnectError(
        err instanceof Error ? err.message : "Failed to connect character",
      );
    } finally {
      setIsConnecting(false);
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-center justify-between gap-4 px-2">
        <div className="flex flex-col gap-1">
          <h2 className="text-2xl font-bold text-neutral-text">Characters</h2>
          <p className="text-sm text-gray-light">
            {characters.length} connected character
            {characters.length === 1 ? "" : "s"}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <PreviewActionButton
            onClick={() => setIsCreateOpen(true)}
            variant="primary"
            icon={<Plus className="h-4 w-4" />}
            title="Create a new character and connect it to this campaign"
            disabled={!campaignId}
          >
            Add Character
          </PreviewActionButton>
          <PreviewActionButton
            onClick={() => setIsConnectOpen(true)}
            variant="ghost"
            className="!bg-neutral !text-neutral-text hover:!bg-gold-neutral"
            icon={<Link2 className="h-4 w-4" />}
            title="Connect an owned character to this campaign"
            disabled={!campaignId}
          >
            Connect Character
          </PreviewActionButton>
        </div>
      </div>

      <div className="flex flex-col gap-3">
        {characters.length > 0 ? (
          characters.map((character) => (
            <div
              key={character.id}
              className="border-2 border-gold-neutral bg-neutral p-4 flex flex-col gap-4 md:flex-row md:items-center md:justify-between"
            >
              <div className="flex items-center gap-3">
                <div className="border border-gold-dark bg-dark p-2 text-gold-neutral">
                  <User className="h-5 w-5" />
                </div>
                <div className="flex flex-col gap-1">
                  <p className="text-lg font-semibold text-neutral-text">
                    {character.name}
                  </p>
                  <p className="text-xs uppercase tracking-widest text-gray-light">
                    Lv {character.level ?? 1}
                    {character.race ? ` · ${character.race}` : ""}
                    {character.class ? ` · ${character.class}` : ""}
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {canDisconnectCharacter(character) && (
                  <PreviewActionButton
                    onClick={() => {
                      void handleDisconnectCharacter(character);
                    }}
                    variant="danger"
                    className="!bg-dark !text-neutral-text hover:!bg-error"
                    title="Disconnect this character from the campaign"
                    disabled={disconnectingCharacterId === character.id}
                  >
                    {disconnectingCharacterId === character.id
                      ? "Disconnecting..."
                      : "Disconnect"}
                  </PreviewActionButton>
                )}
                <PreviewActionButton
                  onClick={() => navigate(`/character/${character.id}`)}
                  variant="ghost"
                  className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
                  icon={<ArrowRight className="h-4 w-4" />}
                  title="Open character sheet"
                >
                  Open
                </PreviewActionButton>
              </div>
            </div>
          ))
        ) : (
          <div className="border-2 border-gold-neutral bg-neutral p-6 text-sm text-gray-light">
            No characters are connected to this campaign yet.
          </div>
        )}
      </div>

      {isCreateOpen && (
        <CampaignModal
          title="Add Character"
          description="Create a new empty character and attach it to this campaign."
          onClose={() => setIsCreateOpen(false)}
        >
          <div className="flex flex-col gap-4">
            <div className="flex flex-col gap-2">
              <label className="text-xs uppercase tracking-widest text-gray-light">
                Character Name
              </label>
              <input
                value={createName}
                onChange={(e) => setCreateName(e.target.value)}
                className="bg-dark border border-gold-dark p-3 text-neutral-text"
                placeholder="New Character"
              />
            </div>

            {createError && (
              <p className="text-sm text-red-400">{createError}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <PreviewActionButton
                onClick={() => setIsCreateOpen(false)}
                variant="secondary"
                className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
                title="Cancel character creation"
                disabled={isCreating}
              >
                Cancel
              </PreviewActionButton>
              <PreviewActionButton
                onClick={() => {
                  void handleCreateCharacter();
                }}
                variant="primary"
                className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
                icon={<Plus className="h-4 w-4" />}
                title="Create and connect character"
                disabled={isCreating}
              >
                {isCreating ? "Creating..." : "Create Character"}
              </PreviewActionButton>
            </div>
          </div>
        </CampaignModal>
      )}

      {isConnectOpen && (
        <CampaignModal
          title="Connect Character"
          description="Choose one of your owned characters to add to this campaign."
          onClose={() => setIsConnectOpen(false)}
        >
          <div className="flex flex-col gap-4">
            {loadingOwnedCharacters ? (
              <div className="flex items-center gap-2 text-sm text-gray-light">
                <RefreshCw className="h-4 w-4 animate-spin" />
                Loading your characters...
              </div>
            ) : availableOwnedCharacters.length > 0 ? (
              <div className="max-h-[50vh] overflow-y-auto grid gap-3">
                {availableOwnedCharacters.map((character) => {
                  const isSelected = selectedCharacterId === character.id;

                  return (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() => setSelectedCharacterId(character.id)}
                      className={`cursor-pointer w-full border-2 p-4 text-left transition-colors ${
                        isSelected
                          ? "border-gold-neutral bg-light"
                          : "border-gold-dark bg-dark hover:bg-light"
                      }`}
                    >
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex flex-col gap-1">
                          <p className="text-lg font-semibold text-neutral-text">
                            {character.name}
                          </p>
                          <p className="text-xs uppercase tracking-widest text-gray-light">
                            Lv {character.level ?? 1}
                            {character.race ? ` · ${character.race}` : ""}
                            {character.class ? ` · ${character.class}` : ""}
                          </p>
                        </div>
                        <div className="text-right text-xs uppercase tracking-widest text-gray-light">
                          {character.connectedCampaign
                            ? `Currently in ${character.connectedCampaign}`
                            : "Unassigned"}
                        </div>
                      </div>
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="border border-gold-dark bg-dark p-4 text-sm text-gray-light">
                You do not have any other characters available to connect.
              </div>
            )}

            {connectError && (
              <p className="text-sm text-red-400">{connectError}</p>
            )}

            <div className="flex items-center justify-end gap-3">
              <PreviewActionButton
                onClick={() => setIsConnectOpen(false)}
                variant="secondary"
                className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
                title="Cancel connect flow"
                disabled={isConnecting}
              >
                Cancel
              </PreviewActionButton>
              <PreviewActionButton
                onClick={() => {
                  void handleConnectCharacter();
                }}
                variant="primary"
                className="!bg-dark !text-neutral-text hover:!bg-gold-neutral"
                icon={<Link2 className="h-4 w-4" />}
                title="Connect selected character"
                disabled={
                  isConnecting || loadingOwnedCharacters || !selectedCharacterId
                }
              >
                {isConnecting ? "Connecting..." : "Connect Character"}
              </PreviewActionButton>
            </div>
          </div>
        </CampaignModal>
      )}
    </div>
  );
}

export default CharacterSection;
