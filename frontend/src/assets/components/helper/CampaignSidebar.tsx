import { useState } from "react";
import { Map, Users, Scroll, UsersRound, Mountain, Notebook } from "lucide-react";

type Props = {
    active?: string | null;
    onChange?: (name: string) => void;
};

export default function CampaignSidebar({ active: controlledActive = null, onChange }: Props) {
    const buttons =
        [
            { name: 'Maps', icon: Map },
            { name: 'Locations', icon: Mountain },
            { name: 'Characters', icon: Users },
            { name: 'NPCs', icon: UsersRound },
            { name: 'Quests', icon: Notebook },
            { name: 'Players', icon: UsersRound },
            { name: 'Notes', icon: Scroll },
        ]

    const [internalActive, setInternalActive] = useState<string | null>(buttons[0].name)

    // use controlled value when provided, otherwise internal state
    const active = controlledActive ?? internalActive

    const handleClick = (name: string) => {
        setInternalActive(name)
        onChange?.(name)
    }

    const buttonClass = (isActive: boolean) =>
        `w-full cursor-pointer hover:bg-orange-700 rounded p-2 pl-4 flex gap-2 ${isActive ? 'bg-orange-700' : ''}`

    const iconSizeClass = `w-6 h-6`

    return (
        <>
            {buttons.map((button) => {
                const Icon = button.icon
                const isActive = active === button.name
                return (
                    <button
                        key={button.name}
                        type="button"
                        className={buttonClass(isActive)}
                        onClick={() => handleClick(button.name)}
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