import { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import { characterService } from "../../../services/characterService";
import {
  GeneralSection,
  PersonalSection,
  StatsSection,
  AccordionSection,
  type CharacterSectionKey,
  type PersonalSectionContent,
  type StatSectionContent,
  type AccordionItem,
  type CharacterSection,
} from "../../components/CharacterPreview";
import { buildCharacterSections } from "./characterPreviewContent";
import { buildCharacterUpdatePayload } from "./characterPreviewPayload";
import type { CharacterViewData } from "./characterPreviewTypes";

function CharacterPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const { id: characterId } = useParams();
  const [characterData, setCharacterData] = useState<CharacterViewData | null>(
    null,
  );
  const [loading, setLoading] = useState(Boolean(characterId));
  const [loadError, setLoadError] = useState<string | null>(null);
  const [saveError, setSaveError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [activeSection, setActiveSection] =
    useState<CharacterSectionKey>("general");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] =
    useState<CharacterSectionKey | null>(null);
  const sections = useMemo(
    () =>
      characterId && characterData ? buildCharacterSections(characterData) : [],
    [characterData, characterId],
  );
  const sectionKeys = useMemo(
    () => sections.map((section) => section.key),
    [sections],
  );
  const [sectionContent, setSectionContent] = useState(
    new Map(sections.map((section) => [section.key, section.content])),
  );

  const sectionFromHash = location.hash.replace("#", "") as
    | CharacterSectionKey
    | "";
  const routeBase = characterId
    ? `/character/${characterId}`
    : "/preview/character";

  useEffect(() => {
    if (!characterId) {
      setCharacterData(null);
      setLoading(false);
      setLoadError(null);
      setSaveError(null);
      return;
    }

    let isMounted = true;

    const loadCharacter = async () => {
      try {
        setLoading(true);
        const data = await characterService.getCharacterById(characterId);

        if (!isMounted) {
          return;
        }

        setCharacterData(data);
        setLoadError(null);
      } catch (fetchError: any) {
        if (!isMounted) {
          return;
        }

        setCharacterData(null);
        setLoadError(fetchError?.message || "Failed to load character");
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadCharacter();

    return () => {
      isMounted = false;
    };
  }, [characterId]);

  useEffect(() => {
    setSectionContent(
      new Map(sections.map((section) => [section.key, section.content])),
    );
    setExpandedItems(new Set());
    setEditingSection(null);
  }, [sections]);

  useEffect(() => {
    if (
      !sectionFromHash ||
      !sectionKeys.includes(sectionFromHash as CharacterSectionKey)
    ) {
      navigate(`${routeBase}#general`, { replace: true });
      return;
    }

    setActiveSection(sectionFromHash as CharacterSectionKey);
  }, [location.hash, navigate, routeBase, sectionFromHash, sectionKeys]);

  const currentSection =
    sections.find((section) => section.key === activeSection) ?? sections[0];

  const currentContent = currentSection
    ? (sectionContent.get(activeSection) ?? currentSection.content)
    : undefined;

  const toggleItem = (itemId: string) => {
    setExpandedItems((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(itemId)) {
        newSet.delete(itemId);
      } else {
        newSet.add(itemId);
      }
      return newSet;
    });
  };

  const handleEditModeChange = (isEditing: boolean) => {
    if (isEditing) {
      setEditingSection(activeSection);
    } else {
      setEditingSection(null);
    }
  };

  const handleContentChange = async (
    newContent: CharacterSection["content"],
  ) => {
    const previousContent = sectionContent.get(activeSection);
    setSectionContent((prev) => new Map(prev).set(activeSection, newContent));
    setSaveError(null);

    if (!characterId) {
      return;
    }

    const payload = buildCharacterUpdatePayload(activeSection, newContent);
    if (!payload) {
      console.log("⏭️  No payload to send for section:", activeSection);
      return;
    }

    console.log(
      "🔄 Sending character update payload for section:",
      activeSection,
    );
    console.log("📋 Payload details:", JSON.stringify(payload, null, 2));

    try {
      setIsSaving(true);
      await characterService.editCharacter(characterId, payload);
      console.log("✅ Character saved successfully");
    } catch (saveError: any) {
      console.error("❌ Save error:", saveError);
      console.error("📋 Error details:", saveError?.message);
      setSaveError(saveError?.message || "Failed to save character changes");
      if (previousContent) {
        setSectionContent((prev) =>
          new Map(prev).set(activeSection, previousContent),
        );
      }
    } finally {
      setIsSaving(false);
    }
  };

  if (characterId && loading) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-gray-light flex items-center justify-center">
        Loading character...
      </div>
    );
  }

  if (!characterId) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-neutral-text flex items-center justify-center">
        <div className="max-w-xl w-full border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-widest">
            CHARACTER VIEW NEEDS AN ID
          </h1>
          <p className="text-sm text-gray-light">
            Open a character from the character list to use this layout.
          </p>
          <button
            type="button"
            onClick={() => navigate("/characters")}
            className="self-start border border-gold-neutral bg-dark px-4 py-2 text-sm uppercase tracking-widest hover:bg-light"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  if (characterId && loadError) {
    return (
      <div className="min-h-screen ml-64 bg-dark px-6 py-10 text-neutral-text flex items-center justify-center">
        <div className="max-w-xl w-full border-2 border-gold-neutral bg-neutral p-6 flex flex-col gap-4">
          <h1 className="text-2xl font-bold tracking-widest">
            CHARACTER NOT AVAILABLE
          </h1>
          <p className="text-sm text-gray-light">{loadError}</p>
          <button
            type="button"
            onClick={() => navigate("/characters")}
            className="self-start border border-gold-neutral bg-dark px-4 py-2 text-sm uppercase tracking-widest hover:bg-light"
          >
            Back to Characters
          </button>
        </div>
      </div>
    );
  }

  const renderSection = () => {
    const baseProps = {
      expandedItems,
      toggleItem,
      isEditMode: editingSection === activeSection,
      onEditModeChange: handleEditModeChange,
      onContentChange: handleContentChange,
      isOwner: characterData?.isOwner === true,
    };

    switch (activeSection) {
      case "general":
        return (
          <GeneralSection
            {...baseProps}
            content={
              currentContent as { name: string; value: string | number }[]
            }
            onDelete={async () => {
              await characterService.deleteCharacter(characterId);
              navigate("/characters", { replace: true });
            }}
          />
        );
      case "personal":
        return (
          <PersonalSection
            {...baseProps}
            content={currentContent as PersonalSectionContent}
          />
        );
      case "stats":
        return (
          <StatsSection
            {...baseProps}
            content={currentContent as StatSectionContent}
          />
        );
      case "features":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
            sectionType="features"
          />
        );
      case "spells":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
            sectionType="spells"
          />
        );
      case "inventory":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
            sectionType="equipment"
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-widest">
          {characterData?.name ?? "CHARACTER SHEET"}
        </h1>
        {characterData && (
          <p className="text-sm text-gold-light uppercase tracking-widest">
            Level {characterData.level}
            {characterData.characterClass
              ? ` · ${characterData.characterClass}`
              : ""}
            {characterData.characterRace
              ? ` · ${characterData.characterRace}`
              : ""}
          </p>
        )}
        <p className="text-sm text-gray-light max-w-2xl">
          {currentSection?.intro ?? "Core information and vital statistics."}
        </p>
        {saveError && (
          <div className="border border-error bg-red-950/40 px-4 py-3 text-sm text-error">
            {saveError}
          </div>
        )}
        {isSaving && (
          <p className="text-xs uppercase tracking-widest text-gold-light">
            Saving character changes...
          </p>
        )}
      </div>

      <main className="flex flex-col gap-4">{renderSection()}</main>
    </div>
  );
}

export default CharacterPreview;
