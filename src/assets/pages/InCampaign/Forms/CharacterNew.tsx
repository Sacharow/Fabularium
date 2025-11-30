import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from "../../../components/constants/classes.json";
import races from "../../../components/constants/races.json";

type Stat = {
    name: string;
    value: number;
    skills?: Record<string, number>;
}

type ProfLevel = 0 | 1 | 2;

const INITIAL_STATS: Stat[] = [
    { name: "Strength", value: 8, skills: { "Athletics": -1 } },
    { name: "Dexterity", value: 8, skills: { "Acrobatics": -1, "Sleight of Hand": -1, "Stealth": -1 } },
    { name: "Constitution", value: 8 },
    { name: "Intelligence", value: 8, skills: { "Arcana": -1, "History": -1, "Investigation": -1, "Nature": -1, "Religion": -1 } },
    { name: "Wisdom", value: 8, skills: { "Animal Handling": -1, "Insight": -1, "Medicine": -1, "Perception": -1, "Survival": -1 } },
    { name: "Charisma", value: 8, skills: { "Deception": -1, "Intimidation": -1, "Performance": -1, "Persuasion": -1 } }
];

const INITIAL_SKILL_PROF: Record<string, ProfLevel> = {
    "Athletics": 0,
    "Acrobatics": 0,
    "Sleight of Hand": 0,
    "Stealth": 0,
    "Arcana": 0,
    "History": 0,
    "Investigation": 0,
    "Nature": 0,
    "Religion": 0,
    "Animal Handling": 0,
    "Insight": 0,
    "Medicine": 0,
    "Perception": 0,
    "Survival": 0,
    "Deception": 0,
    "Intimidation": 0,
    "Performance": 0,
    "Persuasion": 0,
};

const backgrounds = [
    "Acolyte",
    "Charlatan",
    "Criminal",
    "Entertainer",
    "Folk Hero",
    "Guild Artisan",
    "Hermit",
    "Noble",
    "Outlander",
    "Sage",
    "Sailor",
    "Soldier",
    "Urchin",

    "City Watch",
    "Clan Crafter",
    "Cloistered Scholar",
    "Courtier",
    "Faction Agent",
    "Far Traveler",
    "Inheritor",
    "Knight of the Order",
    "Mercenary Veteran",
    "Urban Bounty Hunter",
    "Uthgardt Tribe Member",
    "Waterdhavian Noble",

    "Astral Drifter",
    "Wildspacer",

    "Planar Philosopher",
    "Gate Warden",
    "Ruin Explorer",
    "Wagoner",

    "Investigator",

    "Faceless",
    "Giant Foundling",
    "Rune Carver",

    "Archaeologist",
    "Anthropologist",

    "Haunted One",

    "Celebrity Adventurer's Scion",
    "Famed Artisan",
    "Guild Merchant",
    "Knight of Solamnia",
    "Mage of High Sorcery",
    "Squire of Solamnia",

    "Courtier of the Feywild",
    "Witchlight Hand",

    "Dimir Operative",
    "Gruul Anarch",
    "Izzet Engineer",
    "Orzhov Representative",
    "Rakdos Cultist",
    "Selesnya Initiate",
    "Simic Scientist",
    "Azorius Functionary",
    "Boros Legionnaire",
    "Golgari Agent",

    "House Agent",

    "Prismari Student",
    "Lorehold Student",
    "Silverquill Student",
    "Witherbloom Student",
    "Quandrix Student",

    "Grinner",
    "Volstrucker Agent",
    "Revelry Pirate",
    "Fisher",
    "Clovis Concord Marine",
    "Haunted Veteran",

    "Smuggler"
];

export default function CharacterNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ id?: string }>()

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Background
    const [background, setBackground] = useState<string>(backgrounds[0]);

    // Level / proficiency
    const [level, setLevel] = useState<number>(1);
    const [profBonus, setProfBonus] = useState<number>(0);

    // Character choices
    const [characterClass, setCharacterClass] = useState<string>("Fighter");
    const [characterRace, setCharacterRace] = useState<string>("Human");
    const [characterSubclass, setCharacterSubclass] = useState<string>("");
    const [subclasses, setSubclasses] = useState<string[]>([]);

    // Stats and skills
    const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);
    const [skillProf, setSkillProf] = useState<Record<string, ProfLevel>>(INITIAL_SKILL_PROF);

    // Equipment
    const [equipment, setEquipment] = useState<string[]>([]);

    // Handlers
    const updateStatValue = (statName: string, newValue: number) => {
        setStats(prev => prev.map(s => {
            if (s.name !== statName) return s;
            const updated: Stat = { ...s, value: newValue };
            if (s.skills) {
                const newSkills: Record<string, number> = {};
                Object.keys(s.skills).forEach(k => {
                    const profLevel = skillProf[k] ?? 0;
                    const modifier = Math.floor((newValue - 10) / 2) + profBonus * profLevel;
                    newSkills[k] = modifier;
                });
                updated.skills = newSkills;
            }
            return updated;
        }));
    }

    const saveCharacter = () => {
        const STORAGE_KEY = "fabularium.campaigns.character_section"

        function rand<T>(arr: T[]) {
            return arr[Math.floor(Math.random() * arr.length)]
        }

        function generateColor() {
            const colors = [
                "bg-red-400",
                "bg-blue-400",
                "bg-emerald-400",
                "bg-violet-400",
                "bg-yellow-400",
                "bg-slate-400",
                "bg-pink-400",
                "bg-amber-400",
                "bg-cyan-400",
                "bg-lime-400"
            ]
            return rand(colors)
        }

        const id = Date.now()
        const campaignId = params.id ?? null

        const characterData = {
            id,
            campaignId,
            name,
            color: generateColor(),
            description,
            level,
            profBonus,
            characterClass,
            characterRace,
            characterSubclass,
            stats,
            skillProf,
            equipment
        };

        try {
            const raw = sessionStorage.getItem(STORAGE_KEY)
            const parsed = raw ? JSON.parse(raw) : []
            const list = Array.isArray(parsed) ? parsed : []
            list.push(characterData)
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list))
            // Notify other components in-window that characters changed
            try { window.dispatchEvent(new Event('fabularium.characters.updated')) } catch (e) { /* ignore */ }
            // navigate to the created character's page
            if (campaignId) navigate(`/InCampaign/${campaignId}/Character/${id}`)
            else navigate(-1)
        } catch (e) {
            console.error('Failed to save character to sessionStorage', e)
        }
    }

    const createEquipment = () => {
        const itemName = prompt("Enter equipment item name:");
        if (itemName && itemName.trim() !== "") {
            setEquipment(prev => [...prev, itemName.trim()]);
        }
    }

    const removeEquipment = (index: number) => {
        setEquipment(prev => prev.filter((_, i) => i !== index));
    }

    const updateSkillProf = (skillName: string, newProf: ProfLevel) => {
        setSkillProf(prev => {
            const current = prev[skillName] ?? 0;
            let actualNewProf: ProfLevel;
            if (newProf === 1) {
                // Clicking Prof: if already Prof (1) or Expert (2) -> turn off; otherwise set to 1
                actualNewProf = current === 1 || current === 2 ? 0 : 1;
            } else {
                // Clicking Exp: toggle expertise on/off
                actualNewProf = current === 2 ? 0 : 2;
            }

            const next = { ...prev, [skillName]: actualNewProf };
            // Recalculate displayed skill modifiers for the affected skill
            setStats(stPrev => stPrev.map(s => {
                if (!s.skills) return s;
                if (!(skillName in s.skills)) return s;
                const statModifier = Math.floor((s.value - 10) / 2);
                const newSkills = { ...s.skills, [skillName]: statModifier + profBonus * next[skillName] };
                return { ...s, skills: newSkills };
            }));
            return next;
        });
    }

    // Effects
    useEffect(() => {
        if (level < 0) setLevel(1);
        if (level > 20) setLevel(20);
    }, [level]);

    useEffect(() => {
        // calculate proficiency bonus based on level
        const bonus = Math.ceil(level / 4) + 1;
        setProfBonus(bonus);
    }, [level]);

    useEffect(() => {
        const found = classes.find(c => c.class === characterClass);
        const newSubclasses = found?.subclass || [];
        setSubclasses(newSubclasses);
        if (newSubclasses.length > 0) {
            setCharacterSubclass(newSubclasses[0]);
        }
    }, [characterClass]);

    // UI helper classes
    const inputGameplayInformation = `bg-black/80 w-full`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;

    return (
        <div className="pt-6">
            <div className="max-w-7l w-full">
                <div className="grid grid-cols-8">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm ">
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-2)}>Campaigns </button>
                                <span> / </span>
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-1)}>Character</button>
                                <span> / </span>
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(0)}> New</button>
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-6">Create New Character</h1>
                            <button className="bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded" onClick={() => saveCharacter()}>
                                Save Character
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2"></div>
                </div>
                <div className="grid grid-cols-8 gap-6">
                    <div className="relative col-span-2">
                        <div className="fixed top-0 left-0 h-screen w-1/5 px-4 pt-16 border-r border-orange-700 bg-orange-500/10">
                            Sidebar
                        </div>
                    </div>
                    <div className="col-span-4 w-full flex justify-center p-2">
                        <div className="flex flex-col gap-8 w-full">
                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold">Basic Informations</h1>
                                <p className="text-gray-400 py-2">Character's Name</p>
                                <div className="bg-black/80">
                                    <input
                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                        placeholder="Name"
                                        minLength={1}
                                        maxLength={60}
                                        value={name}
                                        required
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <p className="text-gray-400 py-2">Character's Description</p>
                                <div className="bg-black/80">
                                    <textarea
                                        className="border-2 border-orange-700 rounded py-1 px-2 h-32 w-full align-top bg-black text-white"
                                        placeholder="Description"
                                        maxLength={200}
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>

                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold pb-4">Core Statistics</h1>
                                <div className="grid grid-cols-3 grid-rows-2">
                                    {stats.map((s) =>
                                        <div key={s.name} className="pb-4 pr-4">
                                            <p className="text-gray-400 py-2">{s.name}</p>
                                            <input
                                                type="number"
                                                min={0}
                                                max={30}
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                value={s.value}
                                                onChange={(e) => updateStatValue(s.name, Math.max(1, Math.min(30, Number(e.target.value) || 1)))} />
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold pb-4">Gameplay Informations</h1>
                                <div className="grid grid-cols-2 gap-4">
                                    { /* Character Class */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Level
                                        </p>
                                        <div className={inputGameplayInformation}>
                                            <input
                                                type="number"
                                                min={1}
                                                max={20}
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                value={level}
                                                onChange={(e) => setLevel(Math.max(1, Math.min(20, Number(e.target.value) || 1)))} />
                                        </div>
                                    </div>
                                    { /* Proficiency Bonus */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Proficiency Bonus
                                        </p>
                                        <div className="bg-gray-900/70 w-full">
                                            <input
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                placeholder="0"
                                                value={profBonus} />
                                        </div>
                                    </div>
                                    { /* Character Class */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Class
                                        </p>
                                        <div className={inputGameplayInformation}>
                                            <select
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                value={characterClass}
                                                onChange={(e) => setCharacterClass(e.target.value)}
                                            >
                                                {classes.map(c => (
                                                    <option key={c.class} value={c.class}>{c.class}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    { /* Character Race */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Race
                                        </p>
                                        <div className={inputGameplayInformation}>
                                            <select
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                value={characterRace}
                                                onChange={(e) => setCharacterRace(e.target.value)}
                                            >
                                                {races.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    { /* Character Subclass */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Subclass
                                        </p>
                                        <div className={inputGameplayInformation}>
                                            <select
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                value={characterSubclass}
                                                onChange={(e) => setCharacterSubclass(e.target.value)}
                                            >
                                                {subclasses.map(c => (
                                                    <option key={c} value={c}>{c}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    { /* Character Background */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Background
                                        </p>
                                        <div className={inputGameplayInformation}>
                                            <select
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                value={background}
                                                onChange={(e) => setBackground(e.target.value)}
                                            >
                                                {backgrounds.map(b => (
                                                    <option key={b} value={b}>{b}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold pb-4">Skills</h1>
                                <div className="grid grid-cols-3">
                                    {stats.map((s) => (
                                        <div key={s.name}>
                                            <h2 className="text-lg font-semibold text-white pb-2">{s.name}</h2>
                                            {s.skills && Object.keys(s.skills).length > 0 && (
                                                Object.keys(s.skills).map((skillName) => {
                                                    const profLevel = skillProf[skillName] ?? 0;
                                                    // If expertise (2) is set, show proficiency button as active as well
                                                    const profBtnClass = profLevel > 0 ? 'px-3 py-1 rounded bg-orange-500 text-white cursor-pointer' : 'px-3 py-1 rounded bg-orange-800/50 text-white cursor-pointer';
                                                    const expBtnClass = profLevel === 2 ? 'px-3 py-1 rounded bg-orange-500 text-white cursor-pointer' : 'px-3 py-1 rounded bg-orange-800/50 text-white cursor-pointer';
                                                    return (
                                                        <div key={skillName} className="pb-1 flex items-center gap-2">
                                                            <button className="px-3 py-1 rounded bg-orange-800/50 text-white">{skillName}</button>
                                                            <p className="px-3 py-1 rounded bg-orange-800/50 text-white">{s.skills![skillName]}</p>
                                                            <button className={profBtnClass} onClick={() => updateSkillProf(skillName, 1)}>Prof</button>
                                                            <button className={expBtnClass} onClick={() => updateSkillProf(skillName, 2)}>Exp</button>
                                                        </div>
                                                    );
                                                })
                                            )}
                                        </div>
                                    ))}
                                </div>
                            </div>

                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold pb-4">Equipment</h1>
                                <div className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white min-h-20">
                                    <div className="relative">
                                        <button className="absolute top-1 right-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-center" onClick={() => createEquipment()}>Add Item</button>
                                    </div>
                                    {equipment.length === 0 && (
                                        <p className="text-gray-400">No equipment added yet.</p>
                                    )}
                                    {equipment.map((item, index) => (
                                        <div key={index} className="flex justify-between items-center border-b border-gray-700 py-1 w-3/4">
                                            <p>{item}</p>
                                            <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded" onClick={() => removeEquipment(index)}>Remove</button>
                                        </div>
                                    ))}

                                </div>

                            </div>

                        </div>
                    </div>
                    <div className="col-span-2 w-full p-2">
                        <div className="bg-orange-700/30 rounded-md p-4 flex flex-col items-center">
                            <h1 className="text-2xl font-bold pb-6">Character Avatar</h1>
                            <div className="border-2 border-orange-700 border-dashed w-3/5 h-48 flex flex-col  qjustify-center hover:border-orange-500">
                                <p className="text-gray-400 uppercase text-center">SQUARE</p>
                                <p className="text-gray-400 text-center">Click <span className="text-white font-bold">here</span> to upload image</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div >
    );
}