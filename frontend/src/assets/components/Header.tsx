import { NavLink, useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { Menu, X, Bell, BellDot } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { useResolvedMenuItems } from "../../Hooks/useResolvedMenuItems";

// Style constants
const STYLES = {
  logo: "flex flex-row gap-2 justify-center items-center transition-all duration-200 hover:text-yellow-300 active:scale-90 text-white",
  navItem: (isActive: boolean) =>
    `cursor-pointer transition-all duration-200 flex flex-row gap-2 justify-center items-center px-3 py-2 rounded-lg hover:bg-gradient-to-t from-orange-700 to-orange-500 hover:text-yellow-300 active:scale-90 ${
      isActive
        ? "bg-gradient-to-t from-orange-700 to-orange-500 text-yellow-300"
        : "text-white"
    }`,
  navItemMobile: (isActive: boolean) =>
    `cursor-pointer transition-all duration-200 flex flex-row gap-2 justify-start items-center px-4 py-3 hover:bg-gradient-to-t from-orange-700 to-orange-500 hover:text-yellow-300 active:scale-90 ${
      isActive
        ? "bg-gradient-to-t from-orange-700 to-orange-500 text-yellow-300"
        : "text-white"
    }`,
  dropdown:
    "absolute top-14 right-0 bg-slate-800 rounded-lg shadow-2xl border border-slate-700",
  dropdownHeader:
    "px-4 py-3 border-b border-slate-700 flex justify-between items-center",
  dropdownItem:
    "block px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors",
};

function Header() {
  const { user, isAuthenticated, logout } = useAuth();
  const location = useLocation();
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<
    "notifications" | "profile" | null
  >(null);
  const [exampleNotifications, setExampleNotifications] = useState<string[]>(
    [],
  );
  const navigate = useNavigate();

  // Update when window resizes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const {
    left: leftMenuItems,
    center: centerMenuItems,
    right: rightMenuItems,
  } = useResolvedMenuItems();

  const handleLogout = async () => {
    await logout();
    navigate("/sign-in");
  };

  // Notification Dropdown Component
  const NotificationDropdown = ({
    isMobileView,
  }: {
    isMobileView: boolean;
  }) => (
    <div className="relative">
      <button
        className={`${
          isMobileView
            ? `p-2 rounded-lg transition-all duration-200 active:scale-90 ${
                activeDropdown === "notifications"
                  ? "bg-white/20 text-yellow-300"
                  : "text-white hover:bg-white/10"
              }`
            : `cursor-pointer transition-all duration-200 flex flex-row gap-2 justify-center items-center px-3 py-2 rounded-lg hover:bg-gradient-to-t hover:from-orange-700 hover:to-orange-500 hover:text-yellow-300 active:scale-90 ${
                activeDropdown === "notifications"
                  ? "bg-gradient-to-t from-orange-700 to-orange-500 text-yellow-300"
                  : "text-white"
              }`
        }`}
        onClick={() =>
          setActiveDropdown(
            activeDropdown === "notifications" ? null : "notifications",
          )
        }
      >
        {exampleNotifications.length > 0 ? (
          <BellDot className={isMobileView ? "w-6 h-6" : "w-5 h-5"} />
        ) : (
          <Bell className={isMobileView ? "w-6 h-6" : "w-5 h-5"} />
        )}
        {!isMobileView && <span className="font-medium">Notifications</span>}
        {exampleNotifications.length > 0 && (
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
            {exampleNotifications.length}
          </span>
        )}
      </button>

      {activeDropdown === "notifications" && (
        <div
          className={`${STYLES.dropdown} ${
            isMobileView ? "w-80 max-h-80" : "w-80 max-h-96"
          } overflow-y-auto`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className={STYLES.dropdownHeader}>
            <h3 className="text-white font-bold text-sm">Notifications</h3>
            {exampleNotifications.length > 0 && (
              <button
                className="text-xs text-orange-400 hover:text-orange-300"
                onClick={() => setExampleNotifications([])}
              >
                Clear all
              </button>
            )}
          </div>
          {exampleNotifications.length === 0 ? (
            <div
              className={`text-center text-slate-400 ${isMobileView ? "px-4 py-6 text-sm" : "px-4 py-8"}`}
            >
              No new notifications
            </div>
          ) : (
            exampleNotifications.map((note, index) => (
              <div
                key={index}
                className="flex items-start gap-2 px-3 py-2 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0 transition-colors"
              >
                <button className="flex-1 text-left text-sm text-slate-200 hover:text-white">
                  {note}
                </button>
                <button
                  className="text-slate-400 hover:text-red-400 transition-colors"
                  onClick={() => {
                    setExampleNotifications((prev) =>
                      prev.filter((_, i) => i !== index),
                    );
                  }}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ))
          )}
        </div>
      )}
    </div>
  );

  // Profile Menu Component
  const ProfileMenuButton = () => {
    const profileItem = rightMenuItems.find((item) => item.name === "Profile");
    if (!profileItem) return null;

    if (!isAuthenticated) {
      return (
        <button
          className={STYLES.navItem(false)}
          onClick={() => navigate("/sign-in")}
        >
          <profileItem.icon className="w-5 h-5" />
          <span className="font-medium">Sign In</span>
        </button>
      );
    }

    return (
      <div className="relative">
        <button
          className={STYLES.navItem(
            activeDropdown === "profile" || location.pathname === "/profile",
          )}
          onClick={() =>
            setActiveDropdown(activeDropdown === "profile" ? null : "profile")
          }
        >
          <profileItem.icon className="w-5 h-5" />
          <span className="font-medium">{user?.name || profileItem.name}</span>
        </button>
        {activeDropdown === "profile" && (
          <div className={`${STYLES.dropdown} w-48 py-2 z-50`}>
            <NavLink
              to={profileItem.href}
              className={STYLES.dropdownItem}
              onClick={() => setActiveDropdown(null)}
            >
              Details
            </NavLink>
            <NavLink
              to={profileItem.href}
              className={STYLES.dropdownItem}
              onClick={() => setActiveDropdown(null)}
            >
              Calendar
            </NavLink>
            <button
              className="w-full text-left px-4 py-2 text-sm text-slate-200 hover:bg-slate-700/50 transition-colors cursor-pointer"
              onClick={() => {
                setActiveDropdown(null);
                handleLogout();
              }}
            >
              Logout
            </button>
          </div>
        )}
      </div>
    );
  };

  return (
    <header className="sticky top-0 w-full z-1000 bg-gradient-to-b from-orange-900 to-orange-600 shadow-lg border-b border-orange-500">
      <div className="flex flex-row justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Left Side - Logo/Brand */}
        <div className="flex justify-start gap-4 items-center">
          {leftMenuItems.map((item) => (
            <NavLink key={item.name} to={item.href} className={STYLES.logo}>
              <item.icon className="w-7 h-7" />
              <h1 className="text-2xl font-bold tracking-wide">{item.name}</h1>
            </NavLink>
          ))}
        </div>

        {/* Center Menu Items - Desktop */}
        {!isMobile && (
          <nav className="text-base flex justify-center gap-2 items-center">
            {centerMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => STYLES.navItem(isActive)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right Side - Desktop */}
        {!isMobile && (
          <div className="text-base flex justify-end gap-2 items-center">
            <NotificationDropdown isMobileView={false} />
            <ProfileMenuButton />
          </div>
        )}

        {/* Mobile Menu Controls */}
        {isMobile && (
          <div className="flex flex-row gap-3 items-center">
            <NotificationDropdown isMobileView={true} />
            {/* Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white active:scale-90"
            >
              {menuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        )}
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobile && menuOpen && (
        <nav className="bg-orange-800/95 backdrop-blur-sm border-t border-orange-700/50 shadow-lg">
          <div className="py-2">
            {centerMenuItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={({ isActive }) => STYLES.navItemMobile(isActive)}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
            {rightMenuItems.map((item) =>
              item.name === "Profile" && !isAuthenticated ? (
                <button
                  key={item.name}
                  className={STYLES.navItemMobile(false)}
                  onClick={() => {
                    navigate("/sign-in");
                    setMenuOpen(false);
                  }}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">Sign In</span>
                </button>
              ) : (
                <NavLink
                  key={item.name}
                  to={item.href}
                  className={({ isActive }) => STYLES.navItemMobile(isActive)}
                  onClick={() => setMenuOpen(false)}
                >
                  <item.icon className="w-5 h-5" />
                  <span className="font-medium">{item.name}</span>
                </NavLink>
              ),
            )}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
