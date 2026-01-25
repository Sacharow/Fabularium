import { NavLink } from "react-router-dom";
import menuItems from "./constants/menu";
import { useState, useEffect } from "react";
import { Menu, X, Bell, BellDot } from "lucide-react";

function Header() {
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);

  // Update when window resizes
  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth < 768);
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const leftMenuItems = menuItems.slice(0, 1);
  const centerMenuItems = menuItems.slice(1, 5);
  const rightMenuItems = menuItems.slice(5);

  const [exampleNotifications, setExampleNotifications] = useState<string[]>([
    "Your scribe called you!",
    "Another dragon ravages the kingdom!",
    "Gather a Party! Its dangerous to go alone!",
    "Pull the chicken out of the freezer!",
    "Does your SWORD needs a good sharpening, my Lord~?",
    "Hot Maidens in your local area!",
    "Click here to claim your free MAGIC ORB!",
    "Your subscription for Spellslots Premium is expiring soon!",
  ]);

  const leftClass = ({ isActive }: { isActive: boolean }) =>
    `flex flex-row gap-2 justify-center items-center transition-all duration-200 hover:text-yellow-300 ${isActive ? "text-yellow-300" : "text-white"}`;

  const navItemClass = ({ isActive }: { isActive: boolean }) =>
    `cursor-pointer transition-all duration-200 flex flex-row gap-2 justify-center items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-300 ${isActive ? "bg-white/20 text-yellow-300" : "text-white"}`;

  const navItemClassMobile = ({ isActive }: { isActive: boolean }) =>
    `cursor-pointer transition-all duration-200 flex flex-row gap-2 justify-start items-center px-4 py-3 hover:bg-white/10 hover:text-yellow-300 ${isActive ? "bg-white/20 text-yellow-300" : "text-white"}`;

  return (
    <header className="sticky top-0 w-full z-50 bg-gradient-to-r from-orange-900 via-orange-800 to-orange-900 shadow-lg border-b border-orange-700/50">
      <div className="flex flex-row justify-between items-center px-4 py-3 max-w-7xl mx-auto">
        {/* Left Side - Logo/Brand */}
        <div className="flex justify-start gap-4 items-center">
          {leftMenuItems.map((item) => (
            <NavLink key={item.name} to={item.href} className={leftClass}>
              <item.icon className="w-7 h-7" />
              <h1 className="text-2xl font-bold tracking-wide">{item.name}</h1>
            </NavLink>
          ))}
        </div>

        {/* Center Menu Items - Desktop */}
        {!isMobile && (
          <nav className="text-base flex justify-center gap-2 items-center">
            {centerMenuItems.map((item) => (
              <NavLink key={item.name} to={item.href} className={navItemClass}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </nav>
        )}

        {/* Right Side - Desktop */}
        {!isMobile && (
          <div className="text-base flex justify-end gap-2 items-center">
            {/* Notification Dropdown */}
            <div className="relative">
              <button
                className={`cursor-pointer transition-all duration-200 flex flex-row gap-2 justify-center items-center px-3 py-2 rounded-lg hover:bg-white/10 hover:text-yellow-300 ${isNotificationOpen ? "bg-white/20 text-yellow-300" : "text-white"}`}
                onClick={() => setNotificationOpen(!isNotificationOpen)}
              >
                {exampleNotifications.length > 0 ? (
                  <BellDot className="w-5 h-5" />
                ) : (
                  <Bell className="w-5 h-5" />
                )}
                <span className="font-medium">Notifications</span>
                {exampleNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {exampleNotifications.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div
                  className="absolute top-14 right-0 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-80 max-h-96 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-white font-bold">Notifications</h3>
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
                    <div className="px-4 py-8 text-center text-slate-400">
                      No new notifications
                    </div>
                  ) : (
                    exampleNotifications.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 px-4 py-3 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0 transition-colors group"
                      >
                        <button className="flex-1 text-left text-sm text-slate-200 hover:text-white">
                          {note}
                        </button>
                        <button
                          className="text-slate-400 hover:text-red-400 transition-colors opacity-0 group-hover:opacity-100"
                          onClick={() => {
                            setExampleNotifications((prev) =>
                              prev.filter((_, i) => i !== index),
                            );
                          }}
                          title="Dismiss"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ))
                  )}
                </div>
              )}
            </div>

            {rightMenuItems.map((item) => (
              <NavLink key={item.name} to={item.href} className={navItemClass}>
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        )}

        {/* Mobile Menu Controls */}
        {isMobile && (
          <div className="flex flex-row gap-3 items-center">
            {/* Mobile Notifications */}
            <div className="relative">
              <button
                className={`p-2 rounded-lg transition-all duration-200 ${isNotificationOpen ? "bg-white/20 text-yellow-300" : "text-white hover:bg-white/10"}`}
                onClick={() => setNotificationOpen(!isNotificationOpen)}
              >
                {exampleNotifications.length > 0 ? (
                  <BellDot className="w-6 h-6" />
                ) : (
                  <Bell className="w-6 h-6" />
                )}
                {exampleNotifications.length > 0 && (
                  <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center font-bold">
                    {exampleNotifications.length}
                  </span>
                )}
              </button>

              {isNotificationOpen && (
                <div
                  className="absolute top-14 right-0 bg-slate-800 rounded-lg shadow-2xl border border-slate-700 w-80 max-h-80 overflow-y-auto"
                  onClick={(e) => e.stopPropagation()}
                >
                  <div className="px-4 py-3 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="text-white font-bold text-sm">
                      Notifications
                    </h3>
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
                    <div className="px-4 py-6 text-center text-slate-400 text-sm">
                      No new notifications
                    </div>
                  ) : (
                    exampleNotifications.map((note, index) => (
                      <div
                        key={index}
                        className="flex items-start gap-2 px-3 py-2 hover:bg-slate-700/50 border-b border-slate-700/50 last:border-b-0 transition-colors"
                      >
                        <button className="flex-1 text-left text-sm text-slate-200">
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

            {/* Hamburger Menu */}
            <button
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-2 rounded-lg hover:bg-white/10 transition-all duration-200 text-white"
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
            {centerMenuItems.concat(rightMenuItems).map((item) => (
              <NavLink
                key={item.name}
                to={item.href}
                className={navItemClassMobile}
                onClick={() => setMenuOpen(false)}
              >
                <item.icon className="w-5 h-5" />
                <span className="font-medium">{item.name}</span>
              </NavLink>
            ))}
          </div>
        </nav>
      )}
    </header>
  );
}

export default Header;
