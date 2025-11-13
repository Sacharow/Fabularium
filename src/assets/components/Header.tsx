import { NavLink } from "react-router-dom"
import menuItems from "./constants/menu"
import { useState, useEffect } from "react";
import { Menu, X, Bell } from "lucide-react"; // for icons (optional, from lucide-react)

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
    ])

    const leftClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-row gap-2 justify-center items-center ${isActive ? 'opacity-100' : ''}`

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `cursor-pointer hover:scale-105 flex flex-row gap-2 justify-center items-center ${isActive ? 'bg-white/10 rounded' : ''}`

    const navItemClassMobile = ({ isActive }: { isActive: boolean }) =>
        `cursor-pointer flex flex-row gap-2 justify-center items-center ${isActive ? 'bg-white/10 rounded' : ''}`

    return (
        <div className='sticky top-0 w-full flex flex-row justify-between p-3 bg-orange-900 z-10'>
            { /* Left Side */}
            <div className="flex justify-start gap-4 items-center">
                {leftMenuItems.map(item => (
                    <NavLink key={item.name} to={item.href} className={leftClass}>
                        <item.icon className="w-6 h-6" />
                        <h1 className="text-xl font-bold">{item.name}</h1>
                    </NavLink>
                ))}
            </div>

            { /* Center Menu Items */}
            {!isMobile && (
            <div className="text-lg flex justify-center gap-8 items-center">
                {centerMenuItems.map(item => (
                    <NavLink key={item.name} to={item.href} className={navItemClass}>
                        <div className="flex justify-center gap-2 items-center px-2">
                            <item.icon className="w-4 h-4" />
                            <p className="px-0">{item.name}</p>
                        </div>
                    </NavLink>
                ))}
            </div>
            )}

            { /* Right Side */}
            {!isMobile && (
            <div className="text-lg flex justify-end gap-8 items-center">
                <div className={navItemClassMobile({ isActive: isNotificationOpen })} onClick={() => setNotificationOpen(!isNotificationOpen)}>
                    <div className="flex justify-center gap-2 items-center px-2 hover:scale-105 ">
                        <Bell className="w-4 h-4" />
                        <p className="px-0">Notification</p>
                    </div>
                    {isNotificationOpen && (
                        <div
                            className="absolute top-16 right-32 bg-orange-800 rounded-lg shadow-lg flex flex-col w-90 cursor-default"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {exampleNotifications.map((note, index) => (
                                <div key={index} className="px-4 py-2 border-orange-700 grid grid-cols-6">
                                    <button className="hover:bg-orange-700 rounded col-span-5 cursor-pointer text-left">
                                        {note}
                                    </button>
                                    <button
                                            className="hover:bg-orange-700 rounded text-center cursor-pointer"
                                            onClick={(e) => {
                                                e.stopPropagation() // prevent accidental parent clicks
                                                setExampleNotifications(prev => prev.filter((_, i) => i !== index))
                                            }}
                                        >
                                            X
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
                {rightMenuItems.map(item => (
                    <NavLink key={item.name} to={item.href} className={navItemClass}>
                        <div className="flex justify-center gap-2 items-center px-2">
                            <item.icon className="w-4 h-4" />
                            <p className="px-0">{item.name}</p>
                        </div>
                    </NavLink>
                ))}
            </div>
            )}
            
            {isMobile && (
                <div className="flex flex-row gap-2">
                    <div className={navItemClassMobile({ isActive: isNotificationOpen })} onClick={() => setNotificationOpen(!isNotificationOpen)}>
                        <div className="flex justify-center gap-2 items-center px-2 hover:scale-105 ">
                            <Bell className="w-4 h-4" />
                            <p className="px-0">Notification</p>
                        </div>
                        {isNotificationOpen && (
                            <div
                                className="absolute top-12 right-3 bg-orange-800 rounded-lg shadow-lg flex flex-col w-90 cursor-default"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {exampleNotifications.map((note, index) => (
                                    <div key={index} className="px-2 py-1 border-orange-700 grid grid-cols-6">
                                        <button className="hover:bg-orange-700 rounded col-span-5 text-sm cursor-pointer">
                                            {note}
                                        </button>
                                        <button
                                                className="hover:bg-orange-700 rounded text-center text-sm cursor-pointer"
                                                onClick={(e) => {
                                                    e.stopPropagation() // prevent accidental parent clicks
                                                    setExampleNotifications(prev => prev.filter((_, i) => i !== index))
                                                }}
                                            >
                                                X
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                    <button
                        onClick={() => setMenuOpen(!menuOpen)}
                        className="rounded-md hover:bg-white/10"
                    >
                        {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                    </button>
                </div>
            )}
            {isMobile && menuOpen && (
                <div className="absolute top-12 right-3 bg-orange-800 rounded-lg shadow-lg flex flex-col w-45">
                    {centerMenuItems.concat(rightMenuItems).map(item => (
                        <NavLink
                            key={item.name}
                            to={item.href}
                            className={navItemClassMobile}
                        >
                            <div className="flex justify-center gap-2 items-center px-2">
                                <item.icon className="w-4 h-4" />
                                <p className="px-0">{item.name}</p>
                            </div>
                        </NavLink>
                    ))}
                </div>
            )}
        </div>
    )
}

export default Header
