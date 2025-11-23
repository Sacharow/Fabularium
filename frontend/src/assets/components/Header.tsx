import { NavLink } from "react-router-dom"
import menuItems from "./constants/menu"

function Header() {

    const leftMenuItems = menuItems.slice(0, 1);
    const centerMenuItems = menuItems.slice(1, 5);
    const rightMenuItems = menuItems.slice(5);

    const leftClass = ({ isActive }: { isActive: boolean }) =>
        `flex flex-row gap-2 justify-center items-center ${isActive ? 'opacity-100' : ''}`

    const navItemClass = ({ isActive }: { isActive: boolean }) =>
        `cursor-pointer hover:scale-105 flex flex-row gap-2 justify-center items-center ${isActive ? 'bg-white/10 rounded px-2 py-1' : ''}`

    return (
        <div className='absolute w-full flex flex-row justify-between p-6 bg-orange-900 z-10'>
            <div className="flex justify-start gap-4 items-center">
                {leftMenuItems.map(item => (
                    <NavLink key={item.name} to={item.href} className={leftClass}>
                        <item.icon className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">{item.name}</h1>
                    </NavLink>
                ))}
            </div>

            <div className="text-lg flex justify-center gap-8 items-center">
                {centerMenuItems.map(item => (
                    <NavLink key={item.name} to={item.href} className={navItemClass}>
                        <item.icon className="w-6 h-6" />
                        <p className="px-0">{item.name}</p>
                    </NavLink>
                ))}
            </div>
            <div className="text-lg flex justify-end gap-8 items-center">
                {rightMenuItems.map(item => (
                    <NavLink key={item.name} to={item.href} className={navItemClass}>
                        <item.icon className="w-6 h-6" />
                        <p className="px-0">{item.name}</p>
                    </NavLink>
                ))}
            </div>
        </div>
    )
}

export default Header
