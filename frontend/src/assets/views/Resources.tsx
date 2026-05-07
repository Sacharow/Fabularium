import { useEffect, useState, type ComponentType } from "react";
import {
  ChevronDown,
  ChevronUp,
  BookOpen,
  Shield,
  Star,
  Users,
  WandSparkles,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type ResourceSectionKey =
  | "backgrounds"
  | "classes"
  | "feats"
  | "races"
  | "spells";

type ResourceSection = {
  key: ResourceSectionKey;
  label: string;
  icon: ComponentType<{ className?: string }>;
  intro: string;
  summary: string;
  items: Array<{
    name: string;
    meta: string;
    school?: string;
    level?: string | number;
    body: string;
    tags: string[];
  }>;
};

const sections: ResourceSection[] = [
  {
    key: "backgrounds",
    label: "Backgrounds",
    icon: BookOpen,
    intro: "Identity, origin, and the first thing a character leaves behind.",
    summary: "Classic D&D backgrounds with roleplaying hooks and features.",
    items: [
      {
        name: "Acolyte",
        meta: "faith / service",
        body: "You have spent your life in the service of a temple to a specific god or pantheon, learning rites and finding a small community.",
        tags: ["Shelter of the Faithful", "Religion", "Insight"],
      },
      {
        name: "Criminal",
        meta: "underworld / stealth",
        body: "A background of illicit work, contacts in the streets, and a readiness for deception or breaking the law when needed.",
        tags: ["Stealth", "Deception", "Criminal Contact"],
      },
      {
        name: "Sage",
        meta: "learned / lore",
        body: "Years of scholarly study grant you knowledge of lore, libraries, and the patience to pursue arcane or obscure answers.",
        tags: ["Research", "History", "Arcana"],
      },
    ],
  },
  {
    key: "classes",
    label: "Classes",
    icon: Shield,
    intro:
      "The combat role, magical style, or calling that shapes every choice.",
    summary: "Core D&D classes showing archetypal roles and playstyles.",
    items: [
      {
        name: "Fighter",
        meta: "martial / versatile",
        body: "A master of weapons and battlefield tactics, able to take many forms from a heavily armored defender to a nimble duelist.",
        tags: ["Fighting Style", "Second Wind", "Action Surge"],
      },
      {
        name: "Wizard",
        meta: "arcane / learned",
        body: "A student of spellcraft who prepares spells from a spellbook, offering broad magical utility and powerful area effects.",
        tags: ["Spellbook", "Arcane Recovery", "Rituals"],
      },
      {
        name: "Rogue",
        meta: "stealth / precision",
        body: "A cunning opportunist specialized in sneaking, striking fragile targets, and skill expertise.",
        tags: ["Sneak Attack", "Expertise", "Thieves' Tools"],
      },
    ],
  },
  {
    key: "feats",
    label: "Feats",
    icon: Star,
    intro:
      "Small, distinct upgrades that sharpen a build without changing its identity.",
    summary: "Popular D&D feats that alter combat, skills, or survivability.",
    items: [
      {
        name: "Sharpshooter",
        meta: "ranged / damage",
        body: "Ignore cover penalties, take a -5 to hit for +10 damage at range, and increase effective range for ranged attacks.",
        tags: ["Ranged", "Damage", "Precision"],
      },
      {
        name: "Great Weapon Master",
        meta: "melee / damage",
        body: "Deal extra damage on a heavy weapon critical or when you reduce a creature to 0 HP; take -5 to hit for +10 damage option.",
        tags: ["Heavy", "Damage", "Critical"],
      },
      {
        name: "Alert",
        meta: "initiative / awareness",
        body: "You gain a +5 bonus to initiative and can't be surprised while conscious.",
        tags: ["Initiative", "Perception", "Surprise"],
      },
    ],
  },
  {
    key: "races",
    label: "Races",
    icon: Users,
    intro:
      "Species, peoples, or ancestries that define physiology and culture.",
    summary: "Standard D&D ancestries with defining traits and flavor.",
    items: [
      {
        name: "Human",
        meta: "versatile / adaptable",
        body: "Versatile and ambitious, humans appear in every walk of life and gain extra skill and proficiencies.",
        tags: ["Bonus Feat (variant)", "Extra Skill", "Flexible"],
      },
      {
        name: "Elf",
        meta: "dexterous / perceptive",
        body: "Graceful and long-lived, elves have keen senses, fey ancestry, and natural proficiency with perception.",
        tags: ["Darkvision", "Fey Ancestry", "Keen Senses"],
      },
      {
        name: "Dwarf",
        meta: "stout / resilient",
        body: "Hardy and tradition-minded, dwarves resist poison and excel at smithing and stonecraft.",
        tags: ["Dwarven Resilience", "Stonecunning", "Constitution"],
      },
    ],
  },
  {
    key: "spells",
    label: "Spells",
    icon: WandSparkles,
    intro: "Practical magical effects presented as fast, readable entries.",
    summary: "Classic D&D spells with level, school, and typical uses.",
    items: [
      {
        name: "Magic Missile",
        meta: "1st-level / evocation",
        school: "Evocation",
        level: "1",
        body: "Creates three glowing darts of magical force that automatically hit and deal force damage.",
        tags: ["Auto-hit", "Force", "Reliable damage"],
      },
      {
        name: "Fireball",
        meta: "3rd-level / evocation",
        school: "Evocation",
        level: "3",
        body: "A bright streak flashes to a point you choose then blossoms with a low roar into an explosion of flame.",
        tags: ["Area damage", "Save for half", "Burst"],
      },
      {
        name: "Cure Wounds",
        meta: "1st-level / evocation",
        school: "Evocation",
        level: "1",
        body: "A creature you touch regains a number of hit points equal to 1d8 + your spellcasting ability modifier.",
        tags: ["Healing", "Touch", "Short Rest synergy"],
      },
      {
        name: "Prestidigitation",
        meta: "cantrip / transmutation",
        school: "Transmutation",
        level: "Cantrip",
        body: "A minor magical trick that novice spellcasters use for flavor — cleaning, flavoring, or creating tiny sensory effects.",
        tags: ["Utility", "Cantrip", "Flavor"],
      },
      {
        name: "Shield",
        meta: "1st-level / abjuration",
        school: "Abjuration",
        level: "1",
        body: "An invisible barrier of magical force appears and grants +5 AC until the start of your next turn.",
        tags: ["Reaction", "Defense", "AC"],
      },
      {
        name: "Invisibility",
        meta: "2nd-level / illusion",
        school: "Illusion",
        level: "2",
        body: "A creature you touch becomes invisible until the spell ends or until they attack or cast a spell.",
        tags: ["Stealth", "Utility", "Tactical"],
      },
      {
        name: "Detect Magic",
        meta: "1st-level / divination (ritual)",
        school: "Divination",
        level: "1",
        body: "For the duration, you sense the presence of magic within 30 feet of you and can see its auras.",
        tags: ["Ritual", "Sensing", "Utility"],
      },
      {
        name: "Thunderwave",
        meta: "1st-level / evocation",
        school: "Evocation",
        level: "1",
        body: "A wave of thunderous force sweeps out from you, damaging and pushing creatures within range.",
        tags: ["Area", "Knockback", "Force"],
      },
    ],
  },
];

const sectionKeys = sections.map((section) => section.key);

function ResourcesNew() {
  const location = useLocation();
  const navigate = useNavigate();
  const [activeSection, setActiveSection] =
    useState<ResourceSectionKey>("backgrounds");
  const [activeItem, setActiveItem] = useState<string | null>(null);
  const [spellFilterMode, setSpellFilterMode] = useState<
    "Name" | "Level" | "School"
  >("Name");
  const [showTopButton, setShowTopButton] = useState(false);

  const sectionFromHash = location.hash.replace("#", "") as ResourceSectionKey;

  useEffect(() => {
    if (!sectionKeys.includes(sectionFromHash)) {
      if (location.pathname === "/resources") {
        navigate("/resources#backgrounds", { replace: true });
      }
      return;
    }

    setActiveSection(sectionFromHash);
  }, [location.pathname, navigate, sectionFromHash]);

  useEffect(() => {
    const onScroll = () => setShowTopButton(window.scrollY > 280);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const currentSection =
    sections.find((section) => section.key === activeSection) ?? sections[0];
  const CurrentIcon = currentSection.icon;

  // derive items when viewing spells — sort by the active mode (Name / Level / School)
  const itemsToRender =
    activeSection === "spells"
      ? [...currentSection.items].sort((a, b) => {
          if (spellFilterMode === "Name") return a.name.localeCompare(b.name);

          if (spellFilterMode === "School")
            return (a.school || "").localeCompare(b.school || "");

          // Level: treat 'Cantrip' as 0, otherwise parse numeric level
          const parseLevel = (lvl: string | number | undefined) => {
            if (lvl === undefined) return 999;
            const s = String(lvl).toLowerCase();
            if (s === "cantrip") return 0;
            const n = parseInt(s, 10);
            return Number.isNaN(n) ? 999 : n;
          };

          return parseLevel(a.level) - parseLevel(b.level);
        })
      : currentSection.items;

  const handleToggleItem = (itemName: string) => {
    setActiveItem((currentItem) =>
      currentItem === itemName ? null : itemName,
    );
  };

  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <main className="flex flex-col gap-12">
        <div className="flex flex-col gap-2">
          <h1 className="text-2xl font-bold tracking-widest">RESOURCES</h1>
          <div className="flex items-center gap-3 text-gold-neutral">
            <CurrentIcon className="h-4 w-4" />
            <p className="text-sm uppercase tracking-widest">
              {currentSection.label}
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-3">
          {activeSection === "spells" && (
            <div className="flex flex-wrap items-center gap-3 mb-2">
              <button
                type="button"
                onClick={() => {
                  // cycle: Name -> Level -> School -> Name
                  setSpellFilterMode((m) =>
                    m === "Name" ? "Level" : m === "Level" ? "School" : "Name",
                  );
                }}
                className="px-8 py-2 bg-neutral border-2 border-gold-neutral text-sm text-gold-neutral w-48 justify-between uppercase cursor-pointer inline-flex items-center gap-4 hover:bg-light"
                aria-label="Cycle spell filter mode"
              >
                <span className="font-semibold">FILTER:</span>
                <span className="tracking-widest">{spellFilterMode}</span>
              </button>
            </div>
          )}
          {itemsToRender.map((item) => {
            const isOpen = activeItem === item.name;
            const itemShellClass = isOpen
              ? "border-2 border-gold-neutral bg-light/50 hover:bg-light/50"
              : "border-2 border-gold-neutral bg-neutral hover:bg-light";

            return (
              <button
                key={item.name}
                type="button"
                onClick={() => handleToggleItem(item.name)}
                className={`w-full p-4 text-left ${itemShellClass} flex flex-col cursor-pointer`}
                aria-expanded={isOpen}
                aria-controls={`${item.name}-panel`}
              >
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <h3 className="text-lg font-semibold text-neutral-text">
                      {item.name}
                    </h3>
                    <p className="text-xs uppercase tracking-widest text-gold-light">
                      {item.meta}
                    </p>
                  </div>
                  <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text">
                    <ChevronDown
                      className={`h-4 w-4 ${isOpen ? "rotate-180 text-gold-neutral" : ""}`}
                    />
                    {isOpen ? "Close" : "Open"}
                  </span>
                </div>

                {isOpen && (
                  <div id={`${item.name}-panel`} className="pt-4">
                    <p className="text-sm leading-7 text-neutral-text">
                      {item.body}
                    </p>

                    <div className="mt-4 flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-gold-neutral bg-dark px-2 py-1 text-xs uppercase tracking-widest text-neutral-text"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </main>

      <button
        type="button"
        onClick={scrollToTop}
        className={`fixed bottom-6 right-6 z-50 inline-flex items-center gap-2 border border-gold-neutral bg-neutral px-4 py-3 text-xs uppercase tracking-widest text-gold-neutral shadow-lg hover:bg-light ${showTopButton ? "opacity-100 translate-y-0" : "pointer-events-none translate-y-4 opacity-0"}`}
        aria-label="Scroll to top"
      >
        <ChevronUp className="h-4 w-4" />
        Top
      </button>
    </div>
  );
}

export default ResourcesNew;
