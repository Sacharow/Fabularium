import {
  Menu,
  X,
  User,
  Anvil,
  Component,
  UserCircle,
  BookOpen,
  Shield,
  Star,
  Users as UsersIcon,
  Wand,
  Scroll,
  Dumbbell,
  Wand2,
  Backpack,
  Zap,
} from "lucide-react";
import { NavLink, Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useRef, useState } from "react";
import CreateEntityModal from "./CreateEntityModal";
import { useAuth } from "../../../context/AuthContext";
import { characterService } from "../../../services/characterService";
import { campaignService } from "../../../services/campaignService";

const buttonStyle =
  "w-full flex flex-row gap-2 items-center p-2 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";
const innerButtonStyle =
  "w-full flex items-center gap-2 text-left px-2 py-1 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";

const topNavClass = (isActive: boolean) =>
  `${buttonStyle} ${isActive ? "bg-light border-l-8 border-gold-neutral" : ""}`;

const innerButtonClass = (isActive: boolean) =>
  `${innerButtonStyle} ${isActive ? "bg-light border-l-8 border-gold-neutral" : ""}`;

function Sidebar() {
  const { user, isAuthenticated } = useAuth();
  const location = useLocation();
  const [mobileOpen, setMobileOpen] = useState(false);
  const mobileToggleRef = useRef<HTMLButtonElement | null>(null);
  const mobileSidebarRef = useRef<HTMLElement | null>(null);
  const isCharacterContext =
    location.pathname.startsWith("/characters") ||
    location.pathname.startsWith("/character/") ||
    location.pathname.startsWith("/preview/character");
  const isCampaignContext =
    location.pathname.startsWith("/campaigns") ||
    location.pathname.startsWith("/preview/campaign");
  const onResourcesPage = location.pathname === "/resources";
  const onCharacterPreviewPage =
    location.pathname === "/preview/character" ||
    location.pathname.startsWith("/character/");
  const onCampaignPreviewPage =
    location.pathname.startsWith("/preview/campaign");
  const canCreateNew = isCharacterContext || isCampaignContext;
  const activeResourceSection = location.hash.replace("#", "") || "backgrounds";
  const activeCharacterSection = location.hash.replace("#", "") || "general";
  const activeCampaignSection = location.hash.replace("#", "") || "general";
  const characterPreviewBase = location.pathname.startsWith("/character/")
    ? location.pathname
    : "/preview/character";

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname, location.hash]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";

    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (
      !mobileOpen &&
      mobileSidebarRef.current?.contains(document.activeElement)
    ) {
      mobileToggleRef.current?.focus();
    }
  }, [mobileOpen]);

  const closeMobileMenu = () => {
    setMobileOpen(false);
  };

  return (
    <>
      <aside className="hidden lg:flex w-64 h-screen bg-neutral text-neutral-text fixed left-0 top-0 z-[10000] flex-col justify-between gap-4 p-4 overflow-y-auto">
        <SidebarContent
          canCreateNew={canCreateNew}
          isAuthenticated={isAuthenticated}
          userName={user?.name}
          onNavigate={closeMobileMenu}
          onCreateRequest={closeMobileMenu}
          onCharacterPreviewPage={onCharacterPreviewPage}
          onCampaignPreviewPage={onCampaignPreviewPage}
          onResourcesPage={onResourcesPage}
          activeCharacterSection={activeCharacterSection}
          activeCampaignSection={activeCampaignSection}
          activeResourceSection={activeResourceSection}
          characterPreviewBase={characterPreviewBase}
          locationPathname={location.pathname}
        />
      </aside>

      <div className="lg:hidden">
        <button
          ref={mobileToggleRef}
          type="button"
          aria-label={mobileOpen ? "Close navigation" : "Open navigation"}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((current) => !current)}
          className="fixed left-4 top-4 z-[10001] inline-flex h-12 w-12 items-center justify-center border-2 border-gold-neutral bg-neutral text-neutral-text shadow-lg transition hover:bg-light"
        >
          {mobileOpen ? (
            <X className="h-6 w-6" />
          ) : (
            <Menu className="h-6 w-6" />
          )}
        </button>

        {mobileOpen ? (
          <div
            className="fixed inset-0 z-[9998] bg-black/70 backdrop-blur-[2px]"
            onClick={closeMobileMenu}
            aria-hidden="true"
          />
        ) : null}

        <aside
          ref={mobileSidebarRef}
          className={`fixed left-0 top-0 z-[9999] flex h-screen w-[min(20rem,85vw)] flex-col justify-between gap-4 overflow-y-auto bg-neutral p-4 text-neutral-text shadow-2xl transition-transform duration-300 ease-out ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}
          aria-hidden={!mobileOpen}
        >
          <SidebarContent
            canCreateNew={canCreateNew}
            isAuthenticated={isAuthenticated}
            userName={user?.name}
            onNavigate={closeMobileMenu}
            onCreateRequest={closeMobileMenu}
            onCharacterPreviewPage={onCharacterPreviewPage}
            onCampaignPreviewPage={onCampaignPreviewPage}
            onResourcesPage={onResourcesPage}
            activeCharacterSection={activeCharacterSection}
            activeCampaignSection={activeCampaignSection}
            activeResourceSection={activeResourceSection}
            characterPreviewBase={characterPreviewBase}
            locationPathname={location.pathname}
          />
        </aside>
      </div>
    </>
  );
}

function SidebarContent({
  canCreateNew,
  isAuthenticated,
  userName,
  onNavigate,
  onCreateRequest,
  onCharacterPreviewPage,
  onCampaignPreviewPage,
  onResourcesPage,
  activeCharacterSection,
  activeCampaignSection,
  activeResourceSection,
  characterPreviewBase,
  locationPathname,
}: {
  canCreateNew: boolean;
  isAuthenticated: boolean;
  userName?: string;
  onNavigate?: () => void;
  onCreateRequest?: () => void;
  onCharacterPreviewPage: boolean;
  onCampaignPreviewPage: boolean;
  onResourcesPage: boolean;
  activeCharacterSection: string;
  activeCampaignSection: string;
  activeResourceSection: string;
  characterPreviewBase: string;
  locationPathname: string;
}) {
  const campaignPreviewBase = locationPathname.startsWith("/preview/campaign")
    ? locationPathname
    : "/preview/campaign";

  return (
    <>
      <div className="flex flex-col gap-2">
        <div className="flex items-start justify-between gap-3">
          <NavLink
            to="/"
            onClick={onNavigate}
            className="text-2xl text-gold-neutral font-bold tracking-widest hover:text-gold-light"
          >
            <h1>FABULARIUM</h1>
          </NavLink>
        </div>
        <div className="flex justify-between items-center">
          <SidebarCreateButton
            canCreateNew={canCreateNew}
            onRequestClose={onCreateRequest}
          />
        </div>
        <hr className="text-neutral-text" />
        <div className="flex flex-col gap-2">
          <NavLink
            to="/characters"
            onClick={onNavigate}
            className={({ isActive }) => topNavClass(isActive)}
          >
            <User />
            <p>CHARACTERS</p>
          </NavLink>
          {onCharacterPreviewPage ? (
            <div className="flex flex-col gap-2 pl-6 border-l-2 border-neutral-text">
              <Link
                to={`${characterPreviewBase}#general`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCharacterSection === "general",
                )}
              >
                <Scroll className="w-4 h-4" />
                <span className="text-sm">GENERAL</span>
              </Link>
              <Link
                to={`${characterPreviewBase}#personal`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCharacterSection === "personal",
                )}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">PERSONAL</span>
              </Link>
              <Link
                to={`${characterPreviewBase}#stats`}
                onClick={onNavigate}
                className={innerButtonClass(activeCharacterSection === "stats")}
              >
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">STATS</span>
              </Link>
              <Link
                to={`${characterPreviewBase}#features`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCharacterSection === "features",
                )}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm">FEATURES</span>
              </Link>
              <Link
                to={`${characterPreviewBase}#spells`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCharacterSection === "spells",
                )}
              >
                <Wand2 className="w-4 h-4" />
                <span className="text-sm">SPELLS</span>
              </Link>
              <Link
                to={`${characterPreviewBase}#inventory`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCharacterSection === "inventory",
                )}
              >
                <Backpack className="w-4 h-4" />
                <span className="text-sm">INVENTORY</span>
              </Link>
            </div>
          ) : null}
          <NavLink
            to="/campaigns"
            onClick={onNavigate}
            className={({ isActive }) => topNavClass(isActive)}
          >
            <Anvil />
            <p>CAMPAIGNS</p>
          </NavLink>
          {onCampaignPreviewPage ? (
            <div className="flex flex-col gap-2 pl-6 border-l-2 border-neutral-text">
              <Link
                to={`${campaignPreviewBase}#general`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCampaignSection === "general",
                )}
              >
                <Scroll className="w-4 h-4" />
                <span className="text-sm">GENERAL</span>
              </Link>
              <Link
                to={`${campaignPreviewBase}#locations`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCampaignSection === "locations",
                )}
              >
                <Component className="w-4 h-4" />
                <span className="text-sm">LOCATIONS</span>
              </Link>
              <Link
                to={`${campaignPreviewBase}#npcs`}
                onClick={onNavigate}
                className={innerButtonClass(activeCampaignSection === "npcs")}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">NPCS</span>
              </Link>
              <Link
                to={`${campaignPreviewBase}#quests`}
                onClick={onNavigate}
                className={innerButtonClass(activeCampaignSection === "quests")}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm">QUESTS</span>
              </Link>
              <Link
                to={`${campaignPreviewBase}#characters`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCampaignSection === "characters",
                )}
              >
                <UsersIcon className="w-4 h-4" />
                <span className="text-sm">CHARACTERS</span>
              </Link>
              <Link
                to={`${campaignPreviewBase}#notes`}
                onClick={onNavigate}
                className={innerButtonClass(activeCampaignSection === "notes")}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">NOTES</span>
              </Link>
              <Link
                to={`${campaignPreviewBase}#players`}
                onClick={onNavigate}
                className={innerButtonClass(
                  activeCampaignSection === "players",
                )}
              >
                <UsersIcon className="w-4 h-4" />
                <span className="text-sm">PLAYERS</span>
              </Link>
            </div>
          ) : null}
          <NavLink
            to="/resources"
            onClick={onNavigate}
            className={({ isActive }) => topNavClass(isActive)}
          >
            <Component />
            <p>RESOURCES</p>
          </NavLink>
          {onResourcesPage ? (
            <div className="flex flex-col gap-2 pl-6 border-l-2 border-neutral-text">
              <Link
                to="/resources#backgrounds"
                onClick={onNavigate}
                className={innerButtonClass(
                  activeResourceSection === "backgrounds",
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">BACKGROUNDS</span>
              </Link>
              <Link
                to="/resources#classes"
                onClick={onNavigate}
                className={innerButtonClass(
                  activeResourceSection === "classes",
                )}
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">CLASSES</span>
              </Link>
              <Link
                to="/resources#feats"
                onClick={onNavigate}
                className={innerButtonClass(activeResourceSection === "feats")}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm">FEATS</span>
              </Link>
              <Link
                to="/resources#races"
                onClick={onNavigate}
                className={innerButtonClass(activeResourceSection === "races")}
              >
                <UsersIcon className="w-4 h-4" />
                <span className="text-sm">RACES</span>
              </Link>
              <Link
                to="/resources#spells"
                onClick={onNavigate}
                className={innerButtonClass(activeResourceSection === "spells")}
              >
                <Wand className="w-4 h-4" />
                <span className="text-sm">SPELLS</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>
      <div className="flex flex-col gap-2">
        <hr className="text-neutral-text" />
        <NavLink
          to={isAuthenticated ? "/profile" : "/sign-in"}
          onClick={onNavigate}
          className={buttonStyle}
          title={isAuthenticated ? userName : "Sign In"}
        >
          <UserCircle />
          <p className="min-w-0 flex-1 truncate">
            {isAuthenticated && userName ? userName : "SIGN IN"}
          </p>
        </NavLink>
      </div>
    </>
  );
}

function SidebarCreateButton({
  canCreateNew,
  onRequestClose,
}: {
  canCreateNew: boolean;
  onRequestClose?: () => void;
}) {
  const location = useLocation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);

  const isCharacterContext =
    location.pathname.startsWith("/characters") ||
    location.pathname.startsWith("/character/") ||
    location.pathname.startsWith("/preview/character");

  const kind: "character" | "campaign" = isCharacterContext
    ? "character"
    : "campaign";

  return (
    <>
      <button
        type="button"
        disabled={!canCreateNew || isCreating}
        aria-disabled={!canCreateNew || isCreating}
        onClick={() => {
          if (canCreateNew && !isCreating) {
            onRequestClose?.();
            setOpen(true);
          }
        }}
        className={`p-2 my-2 w-full border-2 ${
          canCreateNew && !isCreating
            ? "border-gold-neutral bg-dark hover:bg-gold-neutral cursor-pointer text-neutral-text"
            : "border-gray-neutral bg-dark text-gray-neutral opacity-60 cursor-not-allowed"
        }`}
      >
        <p>{isCreating ? "CREATING..." : "CREATE NEW"}</p>
      </button>

      <CreateEntityModal
        kind={kind}
        open={open}
        onClose={() => {
          if (!isCreating) {
            setOpen(false);
          }
        }}
        onCreate={async (title) => {
          const safeTitle =
            title.trim() ||
            (kind === "character" ? "New Character" : "New Campaign");

          setIsCreating(true);
          try {
            if (kind === "character") {
              const created = await characterService.createCharacter({
                name: safeTitle,
              });
              setOpen(false);
              navigate(`/character/${created.id}#general`);
              return;
            }

            const created = await campaignService.createCampaign({
              name: safeTitle,
              description: "No description yet",
            });
            setOpen(false);
            navigate(`/preview/campaign/${created.id}#general`);
          } catch (err) {
            const message =
              err instanceof Error ? err.message : `Failed to create ${kind}`;
            console.error(`Failed to create ${kind}:`, err);
            window.alert(message);
          } finally {
            setIsCreating(false);
          }
        }}
      />
    </>
  );
}

export default Sidebar;
