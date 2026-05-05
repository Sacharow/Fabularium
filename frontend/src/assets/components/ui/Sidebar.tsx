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
} from "lucide-react";
import { NavLink, Link, useLocation } from "react-router-dom";

function Sidebar() {
  const location = useLocation();
  const onResourcesPage = location.pathname === "/resources-new";
  const activeResourceSection = location.hash.replace("#", "") || "backgrounds";

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
          <button className="p-2 my-2 w-full border-2 border-gold-neutral bg-dark hover:bg-gold-neutral cursor-pointer">
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
          <NavLink
            to="/campaigns-new"
            className={({ isActive }) => topNavClass(isActive)}
          >
            <Anvil />
            <p>CAMPAIGNS</p>
          </NavLink>
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
        <div className={buttonStyle}>
          <UserCircle />
          <p>PROFILE</p>
        </div>
      </div>
    </div>
  );
}

const buttonStyle =
  "w-full flex flex-row gap-2 items-center p-2 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";
const innerButtonStyle =
  "w-full flex items-center gap-2 text-left px-2 py-1 hover:bg-light hover:border-l-8 hover:border-gold-neutral cursor-pointer";

export default Sidebar;
