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
    summary: "Curated starting points for a character's story.",
    items: [
      {
        name: "Court Scribe",
        meta: "social / intrigue",
        body: "Raised in a civic archive and trained to remember everything that matters.",
        tags: ["History", "Insight", "Formal contacts"],
      },
      {
        name: "Ashen Survivor",
        meta: "hardy / adaptable",
        body: "A life rebuilt after loss, carrying practical skills and quiet endurance.",
        tags: ["Survival", "Endurance", "Travel gear"],
      },
      {
        name: "Temple Acolyte",
        meta: "faith / service",
        body: "A disciplined attendant with ritual knowledge and a small circle of trust.",
        tags: ["Religion", "Medicine", "Sanctuary"],
      },
    ],
  },
  {
    key: "classes",
    label: "Classes",
    icon: Shield,
    intro:
      "The combat role, magical style, or calling that shapes every choice.",
    summary: "Specializations that define how a character advances.",
    items: [
      {
        name: "Warden",
        meta: "defense / control",
        body: "A steadfast protector who anchors the front line and denies movement.",
        tags: ["Armor", "Guard", "Positioning"],
      },
      {
        name: "Arcanist",
        meta: "ritual / utility",
        body: "A prepared caster focused on flexible tools and structured spellcraft.",
        tags: ["Prepared spells", "Knowledge", "Focus"],
      },
      {
        name: "Skirmisher",
        meta: "mobility / precision",
        body: "A light-footed combatant that wins by timing, angles, and movement.",
        tags: ["Dash", "Flank", "Opportunities"],
      },
    ],
  },
  {
    key: "feats",
    label: "Feats",
    icon: Star,
    intro:
      "Small, distinct upgrades that sharpen a build without changing its identity.",
    summary: "Optional perks that add depth or specialized power.",
    items: [
      {
        name: "Measured Strike",
        meta: "martial",
        body: "Turns one precise attack into a reliable opening against a chosen target.",
        tags: ["Accuracy", "Tactical", "Single target"],
      },
      {
        name: "Quick Study",
        meta: "utility",
        body: "Speeds up learning and recalling rules, lore, and field observations.",
        tags: ["Recall", "Training", "Lore"],
      },
      {
        name: "Minor Ward",
        meta: "defense",
        body: "A compact defensive habit that converts attention into survivability.",
        tags: ["Reaction", "Barrier", "Protection"],
      },
    ],
  },
  {
    key: "races",
    label: "Races",
    icon: Users,
    intro:
      "Species, peoples, or ancestries that define physiology and culture.",
    summary: "Broad identity options with distinct strengths and tone.",
    items: [
      {
        name: "Highborne",
        meta: "refined / observant",
        body: "A lineage of courtly tradition, practiced etiquette, and calm discipline.",
        tags: ["Perception", "Grace", "Legacy"],
      },
      {
        name: "Stonekin",
        meta: "durable / grounded",
        body: "A resilient folk with a patient pace and a reputation for hard-earned trust.",
        tags: ["Endurance", "Stability", "Craft"],
      },
      {
        name: "Wildborn",
        meta: "nimble / instinctive",
        body: "A people raised close to the edges of maps, where instinct matters more than ceremony.",
        tags: ["Stealth", "Survival", "Adaptation"],
      },
    ],
  },
  {
    key: "spells",
    label: "Spells",
    icon: WandSparkles,
    intro: "Practical magical effects presented as fast, readable entries.",
    summary: "Prepared notes for magical effects, rituals, and powers.",
    items: [
      {
        name: "Lantern Thread",
        meta: "cantrip / utility",
        body: "A slim strand of light that marks paths, symbols, or hidden objects.",
        tags: ["Light", "Guidance", "Exploration"],
      },
      {
        name: "Iron Bloom",
        meta: "control / defense",
        body: "Hardens the air around a point, interrupting movement and forcing caution.",
        tags: ["Zone", "Control", "Restraint"],
      },
      {
        name: "Veil Step",
        meta: "mobility / misdirection",
        body: "A short repositioning burst that leaves a trace only if someone knows where to look.",
        tags: ["Teleport", "Escape", "Feint"],
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
          {currentSection.items.map((item) => {
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
                          className="border border-gold-neutral px-2 py-1 text-xs uppercase tracking-widest text-neutral-text"
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
