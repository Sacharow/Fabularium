import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { GeneralSection } from "../../components/CampaignPreview/GeneralSection";
import { TextCardSection } from "../../components/CampaignPreview/TextCardSection";
import { NotesSection } from "../../components/CampaignPreview/NotesSection";
import { PlayersSection } from "../../components/CampaignPreview/PlayersSection";

// Default content matching CampaignPreview defaults
const defaults = {
  general: {
    title: "The Lost Vault",
    description:
      "An underground vault filled with strange artifacts and lurking dangers.",
    theme: "Underground Mystery",
    players: 4,
    sessions: 1,
    image: "/heros/space.jpg",
  },
  locations: [
    {
      id: "loc-1",
      title: "Vault Entrance",
      content: "A moss-covered stairwell sealed by a cracked bronze door.",
      section1Title: "Related NPCs",
      section1Items: [{ id: "npc-1", title: "Mira the Guide" }],
      section2Title: "Related Quests",
      section2Items: [
        { id: "q-1", title: "Find the Key" },
        { id: "q-3", title: "Seal the Breach" },
      ],
    },
    {
      id: "loc-2",
      title: "Hall of Echoes",
      content: "A long corridor where every footstep returns twice.",
      section1Title: "Related NPCs",
      section1Items: [{ id: "npc-3", title: "The Lantern Boy" }],
      section2Title: "Related Quests",
      section2Items: [{ id: "q-2", title: "Map the Vault" }],
    },
    {
      id: "loc-3",
      title: "Sunken Archive",
      content: "Shelves of soaked records and half-buried stone tablets.",
      section1Title: "Related NPCs",
      section1Items: [{ id: "npc-2", title: "Archivist Sorn" }],
      section2Title: "Related Quests",
      section2Items: [{ id: "q-1", title: "Find the Key" }],
    },
  ],
  npcs: [
    {
      id: "npc-1",
      title: "Mira the Guide",
      content: "Knows secret paths and old warnings about the vault.",
      section1Title: "Related Quests",
      section1Items: [{ id: "q-1", title: "Find the Key" }],
      section2Title: "Related Locations",
      section2Items: [{ id: "loc-1", title: "Vault Entrance" }],
    },
    {
      id: "npc-2",
      title: "Archivist Sorn",
      content: "Keeps a quiet ledger of everything recovered from below.",
      section1Title: "Related Quests",
      section1Items: [
        { id: "q-1", title: "Find the Key" },
        { id: "q-2", title: "Map the Vault" },
      ],
      section2Title: "Related Locations",
      section2Items: [{ id: "loc-3", title: "Sunken Archive" }],
    },
    {
      id: "npc-3",
      title: "The Lantern Boy",
      content: "A nervous runner who appears only when the lights fade.",
      section1Title: "Related Quests",
      section1Items: [{ id: "q-3", title: "Seal the Breach" }],
      section2Title: "Related Locations",
      section2Items: [{ id: "loc-2", title: "Hall of Echoes" }],
    },
  ],
  quests: [
    {
      id: "q-1",
      title: "Find the Key",
      content: "Recover the bronze key hidden somewhere in the outer chambers.",
      section1Title: "Related NPCs",
      section1Items: [
        { id: "npc-1", title: "Mira the Guide" },
        { id: "npc-2", title: "Archivist Sorn" },
      ],
      section2Title: "Related Locations",
      section2Items: [
        { id: "loc-1", title: "Vault Entrance" },
        { id: "loc-3", title: "Sunken Archive" },
      ],
    },
    {
      id: "q-2",
      title: "Map the Vault",
      content: "Record the layout before the tunnels shift again.",
      section1Title: "Related NPCs",
      section1Items: [{ id: "npc-2", title: "Archivist Sorn" }],
      section2Title: "Related Locations",
      section2Items: [{ id: "loc-2", title: "Hall of Echoes" }],
    },
    {
      id: "q-3",
      title: "Seal the Breach",
      content: "Close the chamber where the old wards have begun to fail.",
      section1Title: "Related NPCs",
      section1Items: [{ id: "npc-3", title: "The Lantern Boy" }],
      section2Title: "Related Locations",
      section2Items: [{ id: "loc-1", title: "Vault Entrance" }],
    },
  ],
  notes: [
    {
      id: "n-1",
      title: "Session 1",
      content: "Party met in tavern and accepted the vault contract.",
    },
    {
      id: "n-2",
      title: "Session 2",
      content: "Echoes in the hall reacted to spoken names.",
    },
    {
      id: "n-3",
      title: "Vault Clue",
      content:
        "Bronze key seems tied to moonlight and water below the archive.",
    },
  ],
  players: {
    dm: {
      name: "Ariadne",
      note: "Tracking vault mysteries and faction pressure.",
    },
    players: [
      { name: "Galin", role: "Frontliner" },
      { name: "Rin", role: "Scout" },
      { name: "Mave", role: "Support" },
      { name: "Toren", role: "Controller" },
    ],
  },
};

function CampaignPreviewView() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState<string>(
    (location.hash.replace("#", "") || "general") as string,
  );

  useEffect(() => {
    const section = location.hash.replace("#", "") || "general";
    setActiveSection(section);

    // ensure hash exists on direct visit
    if (!location.hash && location.pathname === "/preview/campaign") {
      navigate("/preview/campaign#general", { replace: true });
    }
  }, [location.hash, location.pathname, navigate]);

  const renderSection = () => {
    switch (activeSection) {
      case "general":
        return <GeneralSection content={defaults.general} />;
      case "locations":
        return <TextCardSection title="Locations" items={defaults.locations} />;
      case "npcs":
        return <TextCardSection title="NPCs" items={defaults.npcs} />;
      case "quests":
        return <TextCardSection title="Quests" items={defaults.quests} />;
      case "notes":
        return <NotesSection items={defaults.notes} />;
      case "players":
        return <PlayersSection content={defaults.players} />;
      default:
        return <GeneralSection content={defaults.general} />;
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-widest">CAMPAIGN SHEET</h1>
        <p className="text-sm text-gray-light max-w-2xl">
          Preview specific campaign sections via the sidebar links.
        </p>
      </div>

      <main className="flex flex-col gap-4">{renderSection()}</main>
    </div>
  );
}

export default CampaignPreviewView;
