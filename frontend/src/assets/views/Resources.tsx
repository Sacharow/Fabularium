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
import { resourceService } from "../../services/resourceService";
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
    items: [],
  },
  {
    key: "classes",
    label: "Classes",
    icon: Shield,
    intro:
      "The combat role, magical style, or calling that shapes every choice.",
    summary: "Core D&D classes showing archetypal roles and playstyles.",
    items: [],
  },
  {
    key: "feats",
    label: "Feats",
    icon: Star,
    intro:
      "Small, distinct upgrades that sharpen a build without changing its identity.",
    summary: "Popular D&D feats that alter combat, skills, or survivability.",
    items: [],
  },
  {
    key: "races",
    label: "Races",
    icon: Users,
    intro:
      "Species, peoples, or ancestries that define physiology and culture.",
    summary: "Standard D&D ancestries with defining traits and flavor.",
    items: [],
  },
  {
    key: "spells",
    label: "Spells",
    icon: WandSparkles,
    intro: "Practical magical effects presented as fast, readable entries.",
    summary: "Classic D&D spells with level, school, and typical uses.",
    items: [],
  },
];

const sectionKeys = sections.map((section) => section.key);

function Resources() {
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

  const [items, setItems] = useState<ResourceSection["items"]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [spellQuery, setSpellQuery] = useState("");

  const extractText = (val: any) => {
    if (!val) return "";
    if (Array.isArray(val))
      return val
        .map((v) =>
          typeof v === "string" ? v : v.desc || v.entry || v.name || "",
        )
        .filter(Boolean)
        .join("\n\n");
    if (typeof val === "string") return val;
    if (typeof val === "object")
      return val.desc || val.entry || val.name || JSON.stringify(val);
    return String(val);
  };

  const formatItem = (raw: any, sectionKey: ResourceSectionKey) => {
    const name = raw.name || raw.index || "";
    let meta = "";
    let school: string | undefined = undefined;
    let level: string | number | undefined = undefined;
    const body = extractText(
      raw.desc ||
        raw.entries ||
        raw.description ||
        raw.entry ||
        raw.entries?.map?.((e: any) => e.entry) ||
        raw,
    );

    const tags: string[] = [];

    if (sectionKey === "spells") {
      school = raw.school?.name || raw.school || undefined;
      level = raw.level;
      const levelLabel =
        level === 0 ? "Cantrip" : level ? `Level ${level}` : "";
      meta = `${levelLabel}${school ? ` • ${school}` : ""}`.trim();
      if (school) tags.push(school);
      if (level !== undefined)
        tags.push(level === 0 ? "Cantrip" : String(level));
    } else if (sectionKey === "classes") {
      meta = raw.hit_die
        ? `Hit Die d${raw.hit_die}`
        : raw.subclass
          ? raw.subclass
          : "";
      if (Array.isArray(raw.subclasses))
        tags.push(
          ...raw.subclasses.map((s: any) => s.name || s.index).slice(0, 3),
        );
    } else if (sectionKey === "races") {
      meta = raw.alignment || raw.size || "";
      if (Array.isArray(raw.traits))
        tags.push(...raw.traits.map((t: any) => t.name || t.index).slice(0, 3));
    } else if (sectionKey === "backgrounds") {
      if (Array.isArray(raw.starting_proficiencies))
        tags.push(
          ...raw.starting_proficiencies
            .map((p: any) => p.name || p.index)
            .slice(0, 3),
        );
      meta = raw.skill_proficiencies
        ? raw.skill_proficiencies.map((s: any) => s.name).join(", ")
        : "";
    } else if (sectionKey === "feats") {
      meta = raw.prerequisite ? extractText(raw.prerequisite) : "";
    }

    return {
      name,
      meta,
      school,
      level,
      body,
      tags,
    } as ResourceSection["items"][number];
  };

  useEffect(() => {
    let cancelled = false;

    const fetchSection = async () => {
      setLoading(true);
      setError(null);
      setItems([]);

      try {
        let base: any[] = [];
        switch (activeSection) {
          case "classes":
            base = await resourceService.getClasses();
            break;
          case "races":
            base = await resourceService.getRaces();
            break;
          case "spells":
            base = await resourceService.getSpells();
            break;
          case "backgrounds":
            base = await resourceService.getBackgrounds();
            break;
          case "feats":
            base = await resourceService.getFeats();
            break;
          default:
            base = [];
        }

        if (cancelled) return;

        const detailed = await resourceService.getResourcesWithDetails(
          activeSection,
          base,
        );
        if (cancelled) return;

        const formatted = detailed.map((d) => formatItem(d, activeSection));
        setItems(formatted);
      } catch (e: any) {
        console.error("Error loading resources:", e);
        if (!cancelled) setError("Failed to load resources");
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    fetchSection();

    return () => {
      cancelled = true;
    };
  }, [activeSection]);

  // derive items when viewing spells — sort by the active mode (Name / Level / School)
  const itemsToRender =
    activeSection === "spells"
      ? [...items]
          .sort((a, b) => {
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
          .filter((it) =>
            it.name.toLowerCase().includes(spellQuery.toLowerCase()),
          )
      : items;

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
                className="px-4 py-3 bg-neutral border-2 border-gold-neutral text-sm text-gold-neutral uppercase cursor-pointer inline-flex items-center gap-4 hover:bg-light"
                aria-label="Cycle spell filter mode"
              >
                <span className="font-semibold">FILTER:</span>
                <span className="tracking-widest">{spellFilterMode}</span>
              </button>

              <div className="ml-2">
                <input
                  type="search"
                  value={spellQuery}
                  onChange={(e) => setSpellQuery(e.target.value)}
                  placeholder="Search spells..."
                  className="px-3 py-3 bg-neutral border-2 border-gold-neutral text-sm text-neutral-text placeholder:text-gold-light focus:outline-none"
                  aria-label="Search spells"
                />
              </div>
            </div>
          )}
          {loading && <div className="p-4">Loading...</div>}
          {error && <div className="p-4 text-red-400">{error}</div>}
          {!loading && itemsToRender.length === 0 && (
            <div className="p-4 text-sm text-gold-light">No results</div>
          )}

          {itemsToRender.map((item) => {
            const isOpen = activeItem === item.name;

            return (
              <div key={item.name} className="flex flex-col">
                <button
                  type="button"
                  onClick={() => handleToggleItem(item.name)}
                  className={`w-full p-4 text-left cursor-pointer border-2 border-gold-neutral ${
                    isOpen
                      ? "bg-light hover:bg-gray-light"
                      : "bg-neutral hover:bg-light"
                  }`}
                  aria-expanded={isOpen}
                  aria-controls={`${item.name}-panel`}
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-neutral-text">
                        {item.name}
                      </h3>
                      <p className="mt-1 text-xs uppercase tracking-widest text-gold-light">
                        {item.meta}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <span className="flex items-center gap-1 text-xs uppercase tracking-widest text-neutral-text">
                        <ChevronDown
                          className={`h-4 w-4 ${
                            isOpen ? "rotate-180 text-gold-neutral" : ""
                          }`}
                        />
                        {isOpen ? "Close" : "Open"}
                      </span>
                    </div>
                  </div>
                </button>

                {isOpen && (
                  <div
                    id={`${item.name}-panel`}
                    className="bg-neutral border-2 border-t-0 border-gold-dark p-4 flex flex-col gap-3"
                  >
                    <p className="text-sm leading-7 text-neutral-text">
                      {item.body}
                    </p>

                    <div className="flex flex-wrap gap-2">
                      {item.tags.map((tag) => (
                        <span
                          key={tag}
                          className="border border-gold-dark bg-dark px-2 py-1 text-xs uppercase tracking-widest text-neutral-text"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
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

export default Resources;
