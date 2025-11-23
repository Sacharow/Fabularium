
import { Home, User, Anvil, Component, CircleUserRound, Bell } from "lucide-react"
import D20 from "../ui/D20"

const menuItems = [
    { name: 'Fabularium', href: '/', icon: D20 },
    { name: 'Home', href: '/', icon: Home },
    { name: 'Characters', href: '/characters', icon: User },
    { name: 'Campaigns', href: '/campaigns', icon: Anvil },
    { name: 'Resources', href: '/resources', icon: Component },
    { name: 'Notifications', href: '/notifications', icon: Bell },
    { name: 'Profile', href: '/login', icon: CircleUserRound },
]

export default menuItems
