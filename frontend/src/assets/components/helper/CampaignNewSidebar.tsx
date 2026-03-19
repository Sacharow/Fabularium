import {
  Globe,
  Map,
  Users,
  Scroll,
  UsersRound,
  Mountain,
  Notebook,
} from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
  campaignId?: string;
};

export default function CampaignNewSidebar({ campaignId }: Props) {
  const buttons = [
    { name: "General", urlName: "general-view", icon: Globe },
    { name: "Maps", urlName: "map-view", icon: Map },
    { name: "Locations", urlName: "location-view", icon: Mountain },
    { name: "Characters", urlName: "character-view", icon: Users },
    { name: "NPCs", urlName: "npc-view", icon: UsersRound },
    { name: "Quests", urlName: "quest-view", icon: Notebook },
    { name: "Players", urlName: "player-view", icon: UsersRound },
    { name: "Notes", urlName: "note-view", icon: Scroll },
  ];

  const buttonClass = (isActive: boolean) =>
    `w-full cursor-pointer hover:bg-orange-700 rounded p-2 pl-4 flex gap-2 ${isActive ? "bg-orange-700" : ""}`;

  const iconSizeClass = `w-6 h-6`;

  const location = useLocation();
  const navigate = useNavigate();

  const routeFor = (urlName: string) => {
    if (campaignId !== undefined && campaignId !== null) {
      return `/in-campaign/${campaignId}/${encodeURIComponent(urlName)}`;
    }

    const slug = urlName.toLowerCase().replace(/[^a-z0-9]/g, "");
    return `/${slug}`;
  };

  const handleClick = (urlName: string) => {
    navigate(routeFor(urlName));
  };

  return (
    <>
      {buttons.map((button) => {
        const Icon = button.icon;
        const route = routeFor(button.urlName);
        const isActive = location.pathname
          .toLowerCase()
          .includes(route.toLowerCase());

        return (
          <button
            key={button.name}
            type="button"
            className={buttonClass(isActive)}
            onClick={() => handleClick(button.urlName)}
            aria-pressed={isActive}
          >
            <Icon className={iconSizeClass} />
            <p>{button.name}</p>
          </button>
        );
      })}
    </>
  );
}
