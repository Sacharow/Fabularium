import { Home, User, Anvil, Component, CircleUserRound } from "lucide-react";
import D20 from "../ui/D20";

const menuItems = {
  left: [{ name: "Fabularium", href: "/hub", icon: D20 }],
  center: [
    { name: "Home", href: "/hub", icon: Home },
    { name: "Characters", href: "/characters-new", icon: User },
    { name: "Campaigns", href: "/campaigns-new", icon: Anvil },
    { name: "Resources", href: "/resources", icon: Component },
  ],
  right: [{ name: "Profile", href: "/login", icon: CircleUserRound }],
};

export default menuItems;
