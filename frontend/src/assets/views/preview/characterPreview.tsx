import { useState, useEffect } from "react";
import { Scroll, User, Dumbbell, Wand2, Backpack, Zap } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";
import {
  GeneralSection,
  PersonalSection,
  StatsSection,
  AccordionSection,
  type CharacterSectionKey,
  type StatDetail,
  type PersonalSectionContent,
  type PersonalDetail,
  type PersonalNote,
  type StatSectionContent,
  type AccordionItem,
  type CharacterSection,
} from "../../components/CharacterPreview";

// Mock character data
const mockCharacter = {
  general: [
    { name: "Name", value: "Aragorn" },
    { name: "Last Name", value: "Strider" },
    { name: "Nickname", value: "The Ranger" },
    { name: "Level", value: 12 },
    { name: "Experience", value: "45,000 XP" },
    { name: "Class", value: "Fighter" },
    { name: "Subclass", value: "Champion" },
    { name: "Race", value: "Human" },
    { name: "Subrace", value: "Standard" },
    { name: "Hit Points", value: 98 },
    { name: "Armor Class", value: 16 },
    { name: "Speed", value: "30 ft." },
    { name: "Inspiration", value: 1 },
    { name: "Proficiency Bonus", value: "+3" },
  ] as StatDetail[],
  personal: {
    details: [
      {
        label: "Personality",
        value: "Stoic and determined with a dry sense of humor.",
      },
      { label: "Ideals", value: "Freedom and protection of the innocent." },
      {
        label: "Bonds",
        value: "Sworn to protect those who cannot protect themselves.",
      },
      { label: "Flaws", value: "Pushes himself beyond reasonable limits." },
      { label: "Alignment", value: "Lawful Good" },
      { label: "Languages", value: "Common, Elvish, Draconic" },
      { label: "Height", value: "6'4\"" },
      { label: "Weight", value: "215 lbs" },
      { label: "Eye Color", value: "Gray" },
      { label: "Hair Color", value: "Dark Brown" },
      { label: "Skin Color", value: "Fair" },
      { label: "Age", value: 35 },
    ] as PersonalDetail[],
    backstory:
      "Once a ranger of the wild lands, raised among the rangers and trained in the old ways. Now seeks redemption for past failures.",
    notes: [
      {
        title: "Family Heirloom Sword",
        content:
          "Carries a family heirloom sword passed down through generations.",
      },
      {
        title: "Fire Fear",
        content:
          "Becomes visibly tense around open flame and burning buildings.",
      },
    ] as PersonalNote[],
  },
  stats: {
    abilities: [
      {
        ability: "Strength",
        score: "16",
        modifier: "+3",
        savingThrow: "+6",
        savingThrowDistinction: "Proficiency",
        skills: [
          {
            name: "Athletics",
            modifier: "+9",
            distinction: "Expertise",
          },
        ],
      },
      {
        ability: "Dexterity",
        score: "14",
        modifier: "+2",
        savingThrow: "+2",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Acrobatics", modifier: "+2", distinction: "Nothing" },
          { name: "Sleight of Hand", modifier: "+2", distinction: "Nothing" },
          { name: "Stealth", modifier: "+2", distinction: "Nothing" },
        ],
      },
      {
        ability: "Constitution",
        score: "15",
        modifier: "+2",
        savingThrow: "+5",
        savingThrowDistinction: "Proficiency",
        skills: [],
      },
      {
        ability: "Intelligence",
        score: "13",
        modifier: "+1",
        savingThrow: "+1",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Arcana", modifier: "+4", distinction: "Proficiency" },
          { name: "History", modifier: "+4", distinction: "Proficiency" },
          { name: "Investigation", modifier: "+1", distinction: "Nothing" },
          { name: "Nature", modifier: "+1", distinction: "Nothing" },
          { name: "Religion", modifier: "+1", distinction: "Nothing" },
        ],
      },
      {
        ability: "Wisdom",
        score: "14",
        modifier: "+2",
        savingThrow: "+2",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Animal Handling", modifier: "+2", distinction: "Nothing" },
          { name: "Insight", modifier: "+2", distinction: "Nothing" },
          { name: "Medicine", modifier: "+2", distinction: "Nothing" },
          { name: "Perception", modifier: "+5", distinction: "Proficiency" },
          { name: "Survival", modifier: "+5", distinction: "Proficiency" },
        ],
      },
      {
        ability: "Charisma",
        score: "12",
        modifier: "+1",
        savingThrow: "+1",
        savingThrowDistinction: "Nothing",
        skills: [
          { name: "Deception", modifier: "+1", distinction: "Nothing" },
          { name: "Intimidation", modifier: "+4", distinction: "Proficiency" },
          { name: "Performance", modifier: "+1", distinction: "Nothing" },
          { name: "Persuasion", modifier: "+1", distinction: "Nothing" },
        ],
      },
    ],
    proficiencyBonus: "+3",
  } satisfies StatSectionContent,
  features: [
    {
      title: "Class Features",
      content: "Fighter abilities and class-specific features",
      subitems: [
        { title: "Fighting Style", content: "Great Weapon Fighting" },
        { title: "Second Wind", content: "1d10 + 12 HP" },
        { title: "Action Surge", content: "Recharge on short rest" },
        { title: "Champion Archetype", content: "Improved Critical" },
      ],
    },
    {
      title: "Race Features",
      content: "Human racial abilities",
      subitems: [
        { title: "Ability Score Increase", content: "+1 to all attributes" },
        { title: "Extra Feat", content: "Great Weapon Master" },
      ],
    },
    {
      title: "Feats",
      content: "Character feats and special abilities",
      subitems: [
        { title: "Great Weapon Master", content: "-5 to hit, +10 damage" },
        { title: "Resilient", content: "Constitution saving throws +1" },
      ],
    },
    {
      title: "Other",
      content: "Additional features and abilities",
      subitems: [{ title: "Expertise", content: "Athletics, Intimidation" }],
    },
  ] as AccordionItem[],
  spells: [
    {
      title: "Cantrips (At Will)",
      content: "2 spells, at will",
      subitems: [
        { title: "Spell 1", content: "Description" },
        { title: "Spell 2", content: "Description" },
      ],
    },
    {
      title: "1st Level Spells",
      content: "2 spells, 4 total slots",
      subitems: [
        { title: "Spell Name 1", content: "Description" },
        { title: "Spell Name 2", content: "Description" },
      ],
    },
    {
      title: "2nd Level Spells",
      content: "1 spell, 3 total slots",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "3rd Level Spells",
      content: "1 spell, 3 total slots",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "4th Level Spells",
      content: "1 spell, 2 total slots",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "5th Level Spells",
      content: "1 spell, 1 total slot",
      subitems: [{ title: "Spell Name", content: "Description" }],
    },
    {
      title: "6th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
    {
      title: "7th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
    {
      title: "8th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
    {
      title: "9th Level Spells",
      content: "0 spells, 0 total slots",
      subitems: [],
    },
  ] as AccordionItem[],
  inventory: [
    {
      title: "Weapons",
      content: "Combat equipment",
      subitems: [
        { title: "Greatsword +1", content: "2d6 + 3, family heirloom" },
        { title: "Dagger", content: "1d4 + 3" },
      ],
    },
    {
      title: "Armor & Shields",
      content: "Protective equipment",
      subitems: [
        { title: "Plate Armor", content: "AC 18" },
        { title: "Shield", content: "+2 AC" },
      ],
    },
    {
      title: "Equipment",
      content: "Adventuring gear",
      subitems: [
        { title: "Backpack", content: "Standard adventurer's pack" },
        { title: "Rope (50ft)", content: "x2" },
        { title: "Torches", content: "x10" },
      ],
    },
    {
      title: "Magical Items",
      content: "Enchanted items and artifacts",
      subitems: [
        { title: "Ring of Protection", content: "+1 AC and saves" },
        { title: "Potion of Healing", content: "x3" },
      ],
    },
  ] as AccordionItem[],
};

const sections: CharacterSection[] = [
  {
    key: "general",
    label: "General",
    icon: Scroll,
    intro: "Core information and vital statistics.",
    content: mockCharacter.general,
  },
  {
    key: "personal",
    label: "Personal",
    icon: User,
    intro: "Personality, background, and distinguishing features.",
    content: mockCharacter.personal,
  },
  {
    key: "stats",
    label: "Stats",
    icon: Dumbbell,
    intro: "Ability scores, skills, and saving throws.",
    content: mockCharacter.stats,
  },
  {
    key: "features",
    label: "Features",
    icon: Zap,
    intro: "Class features, racial abilities, feats, and special traits.",
    content: mockCharacter.features,
  },
  {
    key: "spells",
    label: "Spells",
    icon: Wand2,
    intro: "Prepared spells and spell slots.",
    content: mockCharacter.spells,
  },
  {
    key: "inventory",
    label: "Inventory",
    icon: Backpack,
    intro: "Equipment, items, and magical treasures.",
    content: mockCharacter.inventory,
  },
];

const sectionKeys = sections.map((section) => section.key);

function CharacterPreview() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] =
    useState<CharacterSectionKey>("general");
  const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set());
  const [editingSection, setEditingSection] =
    useState<CharacterSectionKey | null>(null);
  const [sectionContent, setSectionContent] = useState(
    new Map(sections.map((s) => [s.key, s.content])),
  );

  const sectionFromHash = location.hash.replace("#", "") as CharacterSectionKey;

  useEffect(() => {
    if (!sectionKeys.includes(sectionFromHash)) {
      if (location.pathname === "/preview/character") {
        navigate("/preview/character#general", { replace: true });
      }
      return;
    }

    setActiveSection(sectionFromHash);
  }, [location.pathname, location.hash, navigate, sectionFromHash]);

  const currentSection =
    sections.find((section) => section.key === activeSection) ?? sections[0];

  const currentContent =
    sectionContent.get(activeSection) ?? currentSection.content;

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

  const handleContentChange = (newContent: CharacterSection["content"]) => {
    setSectionContent((prev) => new Map(prev).set(activeSection, newContent));
  };

  const renderSection = () => {
    const baseProps = {
      expandedItems,
      toggleItem,
      isEditMode: editingSection === activeSection,
      onEditModeChange: handleEditModeChange,
      onContentChange: handleContentChange,
    };

    switch (activeSection) {
      case "general":
        return (
          <GeneralSection
            {...baseProps}
            content={currentContent as StatDetail[]}
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
      case "spells":
      case "inventory":
        return (
          <AccordionSection
            {...baseProps}
            content={currentContent as AccordionItem[]}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      {/* Header */}
      <div className="flex flex-col gap-2">
        <h1 className="text-3xl font-bold tracking-widest">CHARACTER SHEET</h1>
        <p className="text-sm text-gray-light max-w-2xl">
          {currentSection.intro}
        </p>
      </div>

      {/* Content Area */}
      <main className="flex flex-col gap-4">{renderSection()}</main>
    </div>
  );
}

export default CharacterPreview;
