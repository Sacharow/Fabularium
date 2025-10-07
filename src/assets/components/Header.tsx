
import menuItems from "./constants/menu"

function Header() {

    const leftMenuItems = menuItems.slice(0, 1);
    const centerMenuItems = menuItems.slice(1, 5);
    const rightMenuItems = menuItems.slice(5);

    return (
        <div className='absolute w-full flex flex-row justify-between p-6 bg-orange-900 z-10'>
            <div className="flex justify-start gap-4 items-center">
                {leftMenuItems.map(item => (
                    <div key={item.name} className="flex flex-row gap-2 justify-center">
                        <item.icon className="w-8 h-8" />
                        <h1 className="text-2xl font-bold">{item.name}</h1>
                    </div>
                ))}
            </div>

            <div className="text-lg flex justify-center gap-8 items-center">
                {centerMenuItems.map(item => (
                    <div key={item.name} className="cursor-pointer hover:scale-105 flex flex-row gap-2 justify-center">
                        <item.icon className="w-8 h-8" />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
            <div className="text-lg flex justify-end gap-8 items-center">
                {rightMenuItems.map(item => (
                    <div key={item.name} className="cursor-pointer hover:scale-105 flex flex-row gap-2 justify-center">
                        <item.icon className="w-8 h-8" />
                        <p>{item.name}</p>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default Header
