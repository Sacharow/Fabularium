import {
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
import { NavLink, Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const onResourcesPage = location.pathname === "/resources-new";
  const onCharacterPreviewPage = location.pathname === "/preview/character";
  const onCampaignPreviewPage = location.pathname === "/preview/campaign";
  const canCreateNew =
    location.pathname.startsWith("/characters") ||
    location.pathname.startsWith("/campaigns");
  const activeResourceSection = location.hash.replace("#", "") || "backgrounds";
  const activeCharacterSection = location.hash.replace("#", "") || "general";
  const activeCampaignSection = location.hash.replace("#", "") || "general";

  const topNavClass = (isActive: boolean) =>
    `${buttonStyle} ${isActive ? "bg-light border-l-8 border-gold-neutral" : ""}`;

  const innerButtonClass = (isActive: boolean) =>
    `${innerButtonStyle} ${isActive ? "bg-light border-l-8 border-gold-neutral" : ""}`;

  return (
    <div className="w-64 h-screen bg-neutral text-neutral-text fixed left-0 top-0 z-10000 flex flex-col justify-between gap-4 p-4">
      {/* UPPER SECTION */}
      <div className="flex flex-col gap-2">
        <NavLink
          to="/hub"
          className="text-2xl text-gold-neutral font-bold tracking-widest hover:text-gold-light"
        >
          <h1>FABULARIUM</h1>
        </NavLink>
        <div className="flex justify-between items-center">
          <button
            type="button"
            disabled={!canCreateNew}
            aria-disabled={!canCreateNew}
            className={`p-2 my-2 w-full border-2 ${
              canCreateNew
                ? "border-gold-neutral bg-dark hover:bg-gold-neutral cursor-pointer text-neutral-text"
                : "border-gray-neutral bg-dark text-gray-neutral opacity-60 cursor-not-allowed"
            }`}
          >
            <p>CREATE NEW</p>
          </button>
        </div>
        <hr className="text-neutral-text" />
        <div className="flex flex-col gap-2">
          <NavLink
            to="/characters-new"
            className={({ isActive }) => topNavClass(isActive)}
          >
            <User />
            <p>CHARACTERS</p>
          </NavLink>
          {onCharacterPreviewPage && (
            <div className="flex flex-col gap-2 pl-6 border-l-2 border-neutral-text">
              <Link
                to="/preview/character#general"
                className={innerButtonClass(
                  activeCharacterSection === "general",
                )}
              >
                <Scroll className="w-4 h-4" />
                <span className="text-sm">GENERAL</span>
              </Link>
              <Link
                to="/preview/character#personal"
                className={innerButtonClass(
                  activeCharacterSection === "personal",
                )}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">PERSONAL</span>
              </Link>
              <Link
                to="/preview/character#stats"
                className={innerButtonClass(activeCharacterSection === "stats")}
              >
                <Dumbbell className="w-4 h-4" />
                <span className="text-sm">STATS</span>
              </Link>
              <Link
                to="/preview/character#features"
                className={innerButtonClass(
                  activeCharacterSection === "features",
                )}
              >
                <Zap className="w-4 h-4" />
                <span className="text-sm">FEATURES</span>
              </Link>
              <Link
                to="/preview/character#spells"
                className={innerButtonClass(
                  activeCharacterSection === "spells",
                )}
              >
                <Wand2 className="w-4 h-4" />
                <span className="text-sm">SPELLS</span>
              </Link>
              <Link
                to="/preview/character#inventory"
                className={innerButtonClass(
                  activeCharacterSection === "inventory",
                )}
              >
                <Backpack className="w-4 h-4" />
                <span className="text-sm">INVENTORY</span>
              </Link>
            </div>
          )}
          <NavLink
            to="/campaigns-new"
            className={({ isActive }) => topNavClass(isActive)}
          >
            <Anvil />
            <p>CAMPAIGNS</p>
          </NavLink>
          {onCampaignPreviewPage && (
            <div className="flex flex-col gap-2 pl-6 border-l-2 border-neutral-text">
              <Link
                to="/preview/campaign#general"
                className={innerButtonClass(
                  activeCampaignSection === "general",
                )}
              >
                <Scroll className="w-4 h-4" />
                <span className="text-sm">GENERAL</span>
              </Link>
              <Link
                to="/preview/campaign#locations"
                className={innerButtonClass(
                  activeCampaignSection === "locations",
                )}
              >
                <Component className="w-4 h-4" />
                <span className="text-sm">LOCATIONS</span>
              </Link>
              <Link
                to="/preview/campaign#npcs"
                className={innerButtonClass(activeCampaignSection === "npcs")}
              >
                <User className="w-4 h-4" />
                <span className="text-sm">NPCS</span>
              </Link>
              <Link
                to="/preview/campaign#quests"
                className={innerButtonClass(activeCampaignSection === "quests")}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm">QUESTS</span>
              </Link>
              <Link
                to="/preview/campaign#notes"
                className={innerButtonClass(activeCampaignSection === "notes")}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">NOTES</span>
              </Link>
              <Link
                to="/preview/campaign#players"
                className={innerButtonClass(
                  activeCampaignSection === "players",
                )}
              >
                <UsersIcon className="w-4 h-4" />
                <span className="text-sm">PLAYERS</span>
              </Link>
            </div>
          )}
          <NavLink
            to="/resources-new"
            className={({ isActive }) => topNavClass(isActive)}
          >
            <Component />
            <p>RESOURCES</p>
          </NavLink>
          {onResourcesPage && (
            <div className="flex flex-col gap-2 pl-6 border-l-2 border-neutral-text">
              <Link
                to="/resources-new#backgrounds"
                className={innerButtonClass(
                  activeResourceSection === "backgrounds",
                )}
              >
                <BookOpen className="w-4 h-4" />
                <span className="text-sm">BACKGROUNDS</span>
              </Link>
              <Link
                to="/resources-new#classes"
                className={innerButtonClass(
                  activeResourceSection === "classes",
                )}
              >
                <Shield className="w-4 h-4" />
                <span className="text-sm">CLASSES</span>
              </Link>
              <Link
                to="/resources-new#feats"
                className={innerButtonClass(activeResourceSection === "feats")}
              >
                <Star className="w-4 h-4" />
                <span className="text-sm">FEATS</span>
              </Link>
              <Link
                to="/resources-new#races"
                className={innerButtonClass(activeResourceSection === "races")}
              >
                <UsersIcon className="w-4 h-4" />
                <span className="text-sm">RACES</span>
              </Link>
              <Link
                to="/resources-new#spells"
                className={innerButtonClass(activeResourceSection === "spells")}
              >
                <Wand className="w-4 h-4" />
                <span className="text-sm">SPELLS</span>
              </Link>
            </div>
          )}
        </div>
      </div>
      {/* DOWN SECTION */}
      <div className="flex flex-col gap-2">
        <hr className="text-neutral-text" />
        <NavLink to="/profile-new" className={buttonStyle}>
          <UserCircle />
          <p>PROFILE</p>
        </NavLink>
      </div>
    </div>
  );
}

const buttonStyle =
  "w-full flex flex-row gap-2 items-center p-2 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";
const innerButtonStyle =
  "w-full flex items-center gap-2 text-left px-2 py-1 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";

export default Sidebar;
