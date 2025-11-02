import { NavLink } from "react-router-dom"
import menuItems from "./constants/menu"
import { useState, useEffect } from "react";
import { Menu, X } from "lucide-react"; // for icons (optional, from lucide-react)

function Header() {
    const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
    const [menuOpen, setMenuOpen] = useState(false);

    // Update when window resizes
    useEffect(() => {
        const handleResize = () => setIsMobile(window.innerWidth < 768);
        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    const leftMenuItems = menuItems.slice(0, 1);
    const centerMenuItems = menuItems.slice(1, 5);
    const rightMenuItems = menuItems.slice(5);

    const leftClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-row gap-2 justify-center items-center ${isActive ? 'opacity-100' : ''}`

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `cursor-pointer hover:scale-105 flex flex-row gap-2 justify-center items-center ${isActive ? 'bg-white/10 rounded' : ''}`

    const navItemClassMobile = ({ isActive }: { isActive: boolean }) =>
        `cursor-pointer flex flex-row gap-2 justify-center items-center ${isActive ? 'bg-white/10 rounded' : ''}`

    return (
        <div className='absolute w-full flex flex-row justify-between p-3 bg-orange-900 z-10'>
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
                <button
                    onClick={() => setMenuOpen(!menuOpen)}
                    className="p-4 rounded-md hover:bg-orange-800"
                >
                    {menuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
                </button>
            )}
            {isMobile && menuOpen && (
                <div className="absolute top-3 right-20 bg-orange-800 rounded-lg shadow-lg flex flex-col w-45">
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
