import { useEffect, useState } from "react";
import { useNavigate, useParams, NavLink } from "react-router-dom";
import classes from "../../../components/constants/classes.json";
import races from "../../../components/constants/races.json";

type Stat = {
    name: string;
    value: number;
    modifier: number;
    skills?: Record<string, number>;
}

type ProfLevel = 0 | 1 | 2;

const INITIAL_STATS: Stat[] = [
    { name: "Strength", value: 10, modifier: 0, skills: { "Athletics": 0 } },
    { name: "Dexterity", value: 10, modifier: 0, skills: { "Acrobatics": 0, "Sleight of Hand": 0, "Stealth": 0 } },
    { name: "Constitution", value: 10, modifier: 0 },
    { name: "Intelligence", value: 10, modifier: 0, skills: { "Arcana": 0, "History": 0, "Investigation": 0, "Nature": 0, "Religion": 0 } },
    { name: "Wisdom", value: 10, modifier: 0, skills: { "Animal Handling": 0, "Insight": 0, "Medicine": 0, "Perception": 0, "Survival": 0 } },
    { name: "Charisma", value: 10, modifier: 0, skills: { "Deception": 0, "Intimidation": 0, "Performance": 0, "Persuasion": 0 } }
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

const alignments = [
    "Lawful Good", "Neutral Good", "Chaotic Good",
    "Lawful Neutral", "True Neutral", "Chaotic Neutral",
    "Lawful Evil", "Neutral Evil", "Chaotic Evil"
];

export default function NpcNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>();

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Roleplay info
    const [npcRace, setNpcRace] = useState<string>(races[0]);
    const [alignment, setAlignment] = useState<string>("True Neutral");
    const [age, setAge] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");

    // Gameplay info
    const [crRating, setCrRating] = useState<number>(1);
    const [profBonus, setProfBonus] = useState<number>(2);
    const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);
    const [skillProf, setSkillProf] = useState<Record<string, ProfLevel>>(INITIAL_SKILL_PROF);
    const [initiativeBonus, setInitiativeBonus] = useState<number>(0);
    const [hitDice] = useState<number>(8);
    const [hitPointsMax, setHitPointsMax] = useState<number>(8);
    const [armorClass, setArmorClass] = useState<number>(10);
    const [passivePerception, setPassivePerception] = useState<number>(10);

    // Character choices
    const [characterClass, setCharacterClass] = useState<string>("Fighter");
    const [characterRace, setCharacterRace] = useState<string>("Human");
    const [characterSubclass, setCharacterSubclass] = useState<string>("");
    const [subclasses, setSubclasses] = useState<string[]>([]);

    // Equipment
    const [equipment, setEquipment] = useState<string[]>([]);

    // Sidebar tab selection
    const [selectedView, setSelectedView] = useState<string>('all');

    // Handlers
    const updateStatValue = (statName: string, newValue: number) => {
        setStats(prev => prev.map(s => {
            if (s.name !== statName) return s;
            const updated: Stat = { ...s, value: newValue };
            const base = Math.floor((newValue - 10) / 2);
            updated.modifier = base;
            if (s.skills) {
                const newSkills: Record<string, number> = {};
                Object.keys(s.skills).forEach(k => {
                    const profLevel = skillProf[k] ?? 0;
                    const modifier = base + profBonus * profLevel;
                    newSkills[k] = modifier;
                });
                updated.skills = newSkills;
            }
            return updated;
        }));
    }

    const saveNpc = () => {
        if (name.trim() === "") {
            alert("NPC name cannot be empty.");
            return;
        }

        const STORAGE_KEY = "fabularium.campaigns.npc_section";

        function rand<T>(arr: T[]) {
            return arr[Math.floor(Math.random() * arr.length)];
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
            ];
            return rand(colors);
        }

        const id = Date.now();
        const campaignId = params.campaignId ?? null;

        const npcData = {
            id,
            campaignId,
            name,
            color: generateColor(),
            description,
            npcRace,
            alignment,
            age,
            height,
            weight,
            crRating,
            profBonus,
            characterClass,
            characterSubclass,
            stats,
            skillProf,
            equipment,
            initiativeBonus,
            hitDice,
            hitPointsMax,
            armorClass,
            passivePerception
        };

        try {
            const raw = sessionStorage.getItem(STORAGE_KEY);
            const parsed = raw ? JSON.parse(raw) : [];
            const list = Array.isArray(parsed) ? parsed : [];
            list.push(npcData);
            sessionStorage.setItem(STORAGE_KEY, JSON.stringify(list));
            try { window.dispatchEvent(new Event('fabularium.npcs.updated')); } catch (e) { /* ignore */ }
            if (campaignId) navigate(`/InCampaign/${campaignId}/NpcView/${id}`);
            else navigate(-1);
        } catch (e) {
            console.error('Failed to save NPC to sessionStorage', e);
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
                if (current === 1) {
                    actualNewProf = 0;
                } else {
                    actualNewProf = 1;
                }
            } else {
                actualNewProf = current === 2 ? 0 : 2;
            }

            const next: Record<string, ProfLevel> = { ...prev, [skillName]: actualNewProf };
            setStats(stPrev => stPrev.map(s => {
                if (!s.skills) return s;
                if (!(skillName in s.skills)) return s;
                const statModifier = Math.floor((s.value - 10) / 2);
                const newSkills = { ...s.skills, [skillName]: statModifier + profBonus * next[skillName] };
                return { ...s, skills: newSkills };
            }));
            return next as Record<string, ProfLevel>;
        });
    }

    // Effects
    useEffect(() => {
        if (crRating < 0) setCrRating(0);
        if (crRating > 30) setCrRating(30);
    }, [crRating]);

    useEffect(() => {
        setStats(prev => prev.map(s => {
            const base = Math.floor((s.value - 10) / 2);
            const updatedModifier = base;
            let updatedSkills = s.skills;
            if (s.skills) {
                const newSkills: Record<string, number> = {};
                Object.keys(s.skills).forEach(k => {
                    const skProf = (skillProf[k] ?? 0) as number;
                    newSkills[k] = base + profBonus * skProf;
                });
                updatedSkills = newSkills;
            }
            return { ...s, modifier: updatedModifier, skills: updatedSkills };
        }));
    }, [profBonus, skillProf]);

    useEffect(() => {
        const found = classes.find(c => c.class === characterClass);
        const newSubclasses = found?.subclass || [];
        setSubclasses(newSubclasses);
        if (newSubclasses.length > 0) {
            setCharacterSubclass(newSubclasses[0]);
        }
    }, [characterClass]);

    useEffect(() => {
        const dexMod = stats.find(s => s.name === "Dexterity")?.modifier ?? 0;
        setInitiativeBonus(dexMod);
    }, [stats]);

    useEffect(() => {
        const conMod = stats.find((s) => s.name === "Constitution")?.modifier ?? 0;
        setHitPointsMax(hitDice + conMod);
    }, [stats, hitDice]);

    useEffect(() => {
        const dexMod = stats.find(s => s.name === "Dexterity")?.modifier ?? 0;
        setArmorClass(10 + dexMod);
    }, [stats]);

    useEffect(() => {
        const wisMod = stats.find(s => s.name === "Wisdom")?.modifier ?? 0;
        setPassivePerception(10 + skillProf["Perception"]! * profBonus + wisMod);
    }, [stats, skillProf, profBonus]);

    // UI helper classes
    const inputGameplayInformation = `bg-black/80 w-full rounded-md`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;
    const { campaignId } = useParams<{ campaignId?: string }>();

    const introData = {
        currentSection: "NPC Section",
        urlName: "NpcView"
    };

    return (
        <div className="pt-6">
            <div className="w-full">
                <div className="grid grid-cols-8">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm ">
                                <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">Campaigns</NavLink>
                                <span> / </span>
                                <NavLink to={`/InCampaign/${campaignId}/${introData.urlName}`} className="cursor-pointer hover:text-gray-400">{introData.urlName}</NavLink>
                                <span> / </span>
                                <NavLink to="#" className="cursor-pointer hover:text-gray-400"> New</NavLink>
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-6">Create New NPC</h1>
                            <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => saveNpc()}>
                                Save NPC
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2"></div>
                </div>
                <div className="grid grid-cols-8 gap-6">
                    <div className="relative col-span-2">
                        <div className="sticky top-24 px-4">
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <button onClick={() => setSelectedView('all')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'all' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            All
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('basic')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'basic' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Basic
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('roleplay')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'roleplay' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Roleplay
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('gameplay')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'gameplay' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Gameplay
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('stats')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'stats' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Stats & Skills
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('equipment')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'equipment' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Equipment
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>
                    <div className="col-span-4 w-full flex justify-center p-2">
                        <div className="flex flex-col gap-8 w-full">
                            {/* Basic Information Section */}
                            {(selectedView === 'all' || selectedView === 'basic') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Basic Information</h1>
                                    <p className={subTitleGameplayInformation}>NPC's Name</p>
                                    <div className={inputGameplayInformation}>
                                        <input
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                            placeholder="Name"
                                            minLength={1}
                                            maxLength={60}
                                            value={name}
                                            required
                                            onChange={(e) => setName(e.target.value)} />
                                    </div>
                                    <p className={subTitleGameplayInformation}>NPC's Description</p>
                                    <div className={inputGameplayInformation}>
                                        <textarea
                                            className="border-2 border-orange-700 rounded py-1 px-2 h-32 w-full align-top bg-black text-white"
                                            placeholder="Description"
                                            maxLength={200}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)} />
                                    </div>
                                </div>
                            )}

                            {/* Roleplay Information Section */}
                            {(selectedView === 'all' || selectedView === 'roleplay') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Roleplay Information</h1>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* Race */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Race</p>
                                            <div className={inputGameplayInformation}>
                                                <select
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={npcRace}
                                                    onChange={(e) => setNpcRace(e.target.value)}>
                                                    {races.map((r) => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* Alignment */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Alignment</p>
                                            <div className={inputGameplayInformation}>
                                                <select
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={alignment}
                                                    onChange={(e) => setAlignment(e.target.value)}>
                                                    {alignments.map((a) => (
                                                        <option key={a} value={a}>{a}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* Age */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Age</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="25"
                                                    value={age}
                                                    onChange={(e) => setAge(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        {/* Height */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Height (cm)</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="180"
                                                    value={height}
                                                    onChange={(e) => setHeight(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        {/* Weight */}
                                        <div className="col-span-2">
                                            <p className={subTitleGameplayInformation}>Weight (kg)</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="75"
                                                    value={weight}
                                                    onChange={(e) => setWeight(Number(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Gameplay Information Section */}
                            {(selectedView === 'all' || selectedView === 'gameplay') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Gameplay Information</h1>
                                    <div className="grid grid-cols-2 gap-4">
                                        {/* CR Rating */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>CR Rating</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="1"
                                                    min={0}
                                                    max={30}
                                                    value={crRating}
                                                    onChange={(e) => setCrRating(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        {/* Prof Bonus */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Proficiency Bonus</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="2"
                                                    value={profBonus}
                                                    onChange={(e) => setProfBonus(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        {/* Class */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Class</p>
                                            <div className={inputGameplayInformation}>
                                                <select
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={characterClass}
                                                    onChange={(e) => setCharacterClass(e.target.value)}>
                                                    {classes.map((c) => (
                                                        <option key={c.class} value={c.class}>{c.class}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* Race (duplicate for gameplay context) */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Race</p>
                                            <div className={inputGameplayInformation}>
                                                <select
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={characterRace}
                                                    onChange={(e) => setCharacterRace(e.target.value)}>
                                                    {races.map((r) => (
                                                        <option key={r} value={r}>{r}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                        {/* Subclass */}
                                        {subclasses.length > 0 && (
                                            <div className="col-span-2">
                                                <p className={subTitleGameplayInformation}>Subclass</p>
                                                <div className={inputGameplayInformation}>
                                                    <select
                                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                        value={characterSubclass}
                                                        onChange={(e) => setCharacterSubclass(e.target.value)}>
                                                        {subclasses.map((sc) => (
                                                            <option key={sc} value={sc}>{sc}</option>
                                                        ))}
                                                    </select>
                                                </div>
                                            </div>
                                        )}
                                        {/* Initiative Bonus */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Initiative Bonus</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={initiativeBonus}
                                                    disabled />
                                            </div>
                                        </div>
                                        {/* Hit Dice */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Hit Dice</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={hitDice}
                                                    disabled />
                                            </div>
                                        </div>
                                        {/* Hit Points Max */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Hit Points Max</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={hitPointsMax}
                                                    disabled />
                                            </div>
                                        </div>
                                        {/* Armor Class */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Armor Class</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={armorClass}
                                                    disabled />
                                            </div>
                                        </div>
                                        {/* Passive Perception */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>Passive Perception</p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={passivePerception}
                                                    disabled />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Stats & Skills Section */}
                            {(selectedView === 'all' || selectedView === 'stats') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Stats & Skills</h1>
                                    
                                    {/* Stats */}
                                    <h2 className="text-xl font-semibold pb-2">Ability Scores</h2>
                                    <div className="grid grid-cols-3 grid-rows-2 gap-4 mb-6">
                                        {stats.map((s) => (
                                            <div key={s.name} className="bg-orange-800/50 p-3 rounded">
                                                <p className="text-sm text-orange-300">{s.name}</p>
                                                <input
                                                    type="number"
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white mt-1"
                                                    value={s.value}
                                                    onChange={(e) => updateStatValue(s.name, Number(e.target.value))} />
                                                <p className="text-xs text-gray-400 mt-1">Modifier: {s.modifier >= 0 ? `+${s.modifier}` : s.modifier}</p>
                                            </div>
                                        ))}
                                    </div>

                                    {/* Skills */}
                                    <h2 className="text-xl font-semibold pb-2">Skill Proficiencies</h2>
                                    <div className="flex flex-col gap-2">
                                        {stats.map((s) => (
                                            <div key={s.name}>
                                                {s.skills && Object.keys(s.skills).length > 0 && (
                                                    <div className="space-y-1">
                                                        <h1 className="text-lg font-semibold">{s.name}</h1>
                                                        {Object.entries(s.skills).map(([skillName, skillValue]) => (
                                                            <div key={skillName} className="flex items-center justify-between bg-orange-800/30 p-2 rounded">
                                                                <span className="text-sm">{skillName}</span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="text-sm font-medium">{skillValue >= 0 ? `+${skillValue}` : skillValue}</span>
                                                                    <button
                                                                        onClick={() => updateSkillProf(skillName, 1)}
                                                                        className={`px-2 py-1 text-xs rounded cursor-pointer hover:bg-orange-600 ${skillProf[skillName] === 1 ? 'bg-orange-600' : 'bg-orange-800'}`}>
                                                                        Prof
                                                                    </button>
                                                                    <button
                                                                        onClick={() => updateSkillProf(skillName, 2)}
                                                                        className={`px-2 py-1 text-xs rounded cursor-pointer hover:bg-orange-600 ${skillProf[skillName] === 2 ? 'bg-orange-600' : 'bg-orange-800'}`}>
                                                                        Exp
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Equipment Section */}
                            {(selectedView === 'all' || selectedView === 'equipment') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Equipment</h1>
                                    <div className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white min-h-20 grid grid-cols-4">
                                        <div className="col-span-3">
                                            {equipment.length === 0 ? (
                                                <p className="text-gray-400 p-2">No equipment added yet</p>
                                            ) : (
                                                equipment.map((item, idx) => (
                                                    <div key={idx} className="flex justify-between items-center p-1 border-b border-orange-700/50">
                                                        <span>{item}</span>
                                                        <button
                                                            onClick={() => removeEquipment(idx)}
                                                            className="text-red-400 hover:text-red-300 text-sm">
                                                            Remove
                                                        </button>
                                                    </div>
                                                ))
                                            )}
                                        </div>
                                        <div className="col-span-1 flex items-center justify-center">
                                            <button
                                                onClick={createEquipment}
                                                className="bg-orange-700 hover:bg-orange-600 text-white px-4 py-2 rounded">
                                                Add Item
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                    <div className="col-span-2 w-full p-2">
                        <div className="bg-orange-700/30 rounded-md p-4 flex flex-col items-center">
                            <h1 className="text-2xl font-bold pb-6">NPC Avatar</h1>
                            <div className="border-2 border-orange-700 border-dashed w-3/5 h-48 flex flex-col justify-center hover:border-orange-500">
                                <p className="text-gray-400 text-center p-2">Click <span className="text-white font-bold hover:underline cursor-pointer">here</span> to upload image</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
