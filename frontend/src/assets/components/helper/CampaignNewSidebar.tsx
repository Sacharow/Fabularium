import { Globe, Map, Users, Scroll, UsersRound, Mountain, Notebook } from "lucide-react";
import { useLocation, useNavigate } from "react-router-dom";

type Props = {
    campaignId?: string | number;
}

export default function CampaignNewSidebar({ campaignId }: Props) {
    const buttons =
        [
            { name: 'General', urlName: 'GeneralView', icon: Globe },
            { name: 'Maps', urlName: 'MapView', icon: Map },
            { name: 'Locations', urlName: 'LocationView', icon: Mountain },
            { name: 'Characters', urlName: 'CharacterView', icon: Users },
            { name: 'NPCs', urlName: 'NPCView', icon: UsersRound },
            { name: 'Quests', urlName: 'QuestView', icon: Notebook },
            { name: 'Players', urlName: 'PlayerView', icon: UsersRound },
            { name: 'Notes', urlName: 'NoteView', icon: Scroll },
        ]

    const buttonClass = (isActive: boolean) =>
        `w-full cursor-pointer hover:bg-orange-700 rounded p-2 pl-4 flex gap-2 ${isActive ? 'bg-orange-700' : ''}`

    const iconSizeClass = `w-6 h-6`

    const location = useLocation();
    const navigate = useNavigate();

    const routeFor = (urlName: string) => {
        if (campaignId !== undefined && campaignId !== null) {
            return `/InCampaign/${campaignId}/${encodeURIComponent(urlName)}`;
        }

        const slug = urlName.toLowerCase().replace(/[^a-z0-9]/g, "");
        return `/${slug}`;
    }

    const handleClick = (urlName: string) => {
        navigate(routeFor(urlName));
    }

    return (
        <>
            {buttons.map((button) => {
                const Icon = button.icon
                const route = routeFor(button.urlName)
                const isActive = location.pathname.toLowerCase().includes(route.toLowerCase())

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
                )
            })}
        </>
    )
}