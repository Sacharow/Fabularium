import { useNavigate, useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from "../../../components/constants/classes.json";
import races from "../../../components/constants/races.json";
import backgrounds from "../../../components/constants/backgrounds.json";
import alignments from "../../../components/constants/alignments.json";

type Stat = {
    name: string;
    value: number;
    modifier: number;
    skills?: Record<string, number>;
}

type ProfLevel = 0 | 1 | 2;

const INITIAL_STATS: Stat[] = [
    { name: "Strength", value: 8, modifier: -1, skills: { "Athletics": -1 } },
    { name: "Dexterity", value: 8, modifier: -1, skills: { "Acrobatics": -1, "Sleight of Hand": -1, "Stealth": -1 } },
    { name: "Constitution", value: 8, modifier: -1 },
    { name: "Intelligence", value: 8, modifier: -1, skills: { "Arcana": -1, "History": -1, "Investigation": -1, "Nature": -1, "Religion": -1 } },
    { name: "Wisdom", value: 8, modifier: -1, skills: { "Animal Handling": -1, "Insight": -1, "Medicine": -1, "Perception": -1, "Survival": -1 } },
    { name: "Charisma", value: 8, modifier: -1, skills: { "Deception": -1, "Intimidation": -1, "Performance": -1, "Persuasion": -1 } }
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

export default function CharacterNew() {
    // Navigation
    const navigate = useNavigate();
    const params = useParams<{ campaignId?: string }>()

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Roleplay info
    const [background, setBackground] = useState<string>(backgrounds[0]);
    const [alignment, setAlignment] = useState<string>("True Neutral");
    const [age, setAge] = useState<number | "">("");
    const [height, setHeight] = useState<number | "">("");
    const [weight, setWeight] = useState<number | "">("");
    const [personalityTraits, setPersonalityTraits] = useState<string>("");
    const [ideals, setIdeals] = useState<string>("");
    const [bonds, setBonds] = useState<string>("");
    const [flaws, setFlaws] = useState<string>("");

    // Gameplay info
    const [level, setLevel] = useState<number>(1);
    const [profBonus, setProfBonus] = useState<number>(0);
    const [stats, setStats] = useState<Stat[]>(INITIAL_STATS);
    const [skillProf, setSkillProf] = useState<Record<string, ProfLevel>>(INITIAL_SKILL_PROF);
    const [savingThrowProf, setSavingThrowProf] = useState<Record<string, ProfLevel>>({});
    const [initiativeBonus, setInitiativeBonus] = useState<number>(0);
    const [speed, setSpeed] = useState<number>(30);
    const [hitDice] = useState<number>(10);
    const [hitPointsMax, setHitPointsMax] = useState<number>(10);
    const [hitPointsCurrent, setHitPointsCurrent] = useState<number>(10);
    const [armorClass] = useState<number>(10);
    const [passivePerception, setPassivePerception] = useState<number>(10);

    // Character choices
    const [characterClass, setCharacterClass] = useState<string>("Fighter");
    const [characterRace, setCharacterRace] = useState<string>("Human");
    const [characterSubclass, setCharacterSubclass] = useState<string>("");
    const [subclasses, setSubclasses] = useState<string[]>([]);

    // Equipment
    const [equipment, setEquipment] = useState<string[]>([]);
    const [money, setMoney] = useState<Record<string, number>>({ platinum: 0, gold: 0, electrum: 0, silver: 0, copper: 0 });
    // Sidebar tab selection: 'all' shows all sections, otherwise only selected
    const [selectedView, setSelectedView] = useState<string>('all');

    // Handlers
    const updateStatValue = (statName: string, newValue: number) => {
        setStats(prev => prev.map(s => {
            if (s.name !== statName) return s;
            const updated: Stat = { ...s, value: newValue };
            updated.modifier = Math.floor((newValue - 10) / 2) + profBonus * (savingThrowProf[statName] ?? 0);
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

        if (name.trim() === "") {
            alert("Character name cannot be empty.");
            return;
        }
        else {
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
            const campaignId = params.campaignId ?? null

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
                equipment,
                money,
                background,
                alignment,
                age,
                height,
                weight,
                personalityTraits,
                ideals,
                bonds,
                flaws,
                initiativeBonus,
                speed,
                hitDice,
                hitPointsMax,
                hitPointsCurrent,
                armorClass,
                passivePerception
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
                if (campaignId) navigate(`/InCampaign/${campaignId}/Characters/${id}`)
                else navigate(-1)
            } catch (e) {
                console.error('Failed to save character to sessionStorage', e)
            }
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
                // Clicking Prof: toggle proficiency on/off. If currently expertise (2),
                // downgrade to proficiency (1) instead of turning off.
                if (current === 1) {
                    actualNewProf = 0; // turn off
                } else {
                    actualNewProf = 1; // set to proficiency (also handles current === 2 -> downgrade)
                }
            } else {
                // Clicking Exp: toggle expertise on/off
                actualNewProf = current === 2 ? 0 : 2;
            }

            const next: Record<string, ProfLevel> = { ...prev, [skillName]: actualNewProf };
            // Recalculate displayed skill modifiers for the affected skill
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

    const updateStatProf = (statName: string) => {
        setSavingThrowProf(prev => {
            const current = prev[statName] ?? 0;
            const next: Record<string, ProfLevel> = { ...prev, [statName]: current === 1 ? 0 : 1 };
            // Recalculate displayed modifier for the affected stat
            setStats(stPrev => stPrev.map(s => {
                if (s.name !== statName) return s;
                const updated: Stat = { ...s };
                updated.modifier = Math.floor((updated.value - 10) / 2) + profBonus * (next[statName] ?? 0);
                return updated;
            }));
            return next as Record<string, ProfLevel>;
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
        // Recalculate all derived stat values (saving throws and skills)
        // whenever proficiency bonus, skill proficiencies or saving throw
        // proficiencies change. This ensures UI values stay in sync.
        setStats(prev => prev.map(s => {
            const base = Math.floor((s.value - 10) / 2);
            const stProfLevel = (savingThrowProf[s.name] ?? 0) as number;
            const updatedModifier = base + profBonus * stProfLevel;
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
    }, [profBonus, skillProf, savingThrowProf]);

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
        setHitPointsCurrent(hitPointsMax);
    }, [hitPointsMax]);

    useEffect(() => {
        const conMod = stats.find((s) => s.name === "Constitution")?.modifier ?? 0;
        setHitPointsMax(hitDice + level * conMod + (level - 1) * Math.ceil((1 + hitDice) / 2));
    }, [stats, hitDice, level]);

    // UI helper classes
    const inputGameplayInformation = `bg-black/80 w-full rounded-md`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;

    return (
        <div className="pt-6">
            <div className="w-full">
                <div className="grid grid-cols-8">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm ">
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-2)}>Campaigns </button>
                                <span> / </span>
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-1)}>Sections</button>
                                <span> / </span>
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(0)}> New</button>
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-6">Create New Character</h1>
                            <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer" onClick={() => saveCharacter()}>
                                Save Character
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
                                        <button onClick={() => setSelectedView('lore')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'lore' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Lore
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('core')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'core' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Core
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('gameplay')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'gameplay' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Gameplay
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('skills')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'skills' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Skills
                                        </button>
                                    </li>
                                    <li>
                                        <button onClick={() => setSelectedView('money')} className={`w-full text-left px-3 py-2 rounded ${selectedView === 'money' ? 'bg-orange-700 text-white' : 'text-orange-300 hover:bg-orange-800'}`}>
                                            Money
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
                            {(selectedView === 'all' || selectedView === 'basic') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold">Basic Information</h1>
                                    <p className={subTitleGameplayInformation}>Character's Name</p>
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
                                    <p className={subTitleGameplayInformation}>Character's Description</p>
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

                            { /* Roleplay Information */}
                            {(selectedView === 'all' || selectedView === 'lore') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Roleplay Information</h1>
                                    <div className="grid grid-cols-2 gap-4">
                                        { /* Age */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Age
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="25"
                                                    value={age}
                                                    onChange={(e) => setAge(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        { /* Height */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Height
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="180"
                                                    value={height}
                                                    onChange={(e) => setHeight(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        { /* Weight */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Weight
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="75"
                                                    value={weight}
                                                    onChange={(e) => setWeight(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        { /* Personality Trait */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Personality Traits
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="Nothing can shake my optimistic attitude."
                                                    value={personalityTraits}
                                                    onChange={(e) => setPersonalityTraits(e.target.value)} />
                                            </div>
                                        </div>
                                        { /* Ideals */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Ideals
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="I'm determined to make something of myself."
                                                    value={ideals}
                                                    onChange={(e) => setIdeals(e.target.value)} />
                                            </div>
                                        </div>
                                        { /* Bonds */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Bonds
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="Everything I do is for the common people."
                                                    value={bonds}
                                                    onChange={(e) => setBonds(e.target.value)} />
                                            </div>
                                        </div>
                                        { /* Flaws */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Flaws
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="I am inflexible in my thinking."
                                                    value={flaws}
                                                    onChange={(e) => setFlaws(e.target.value)} />
                                            </div>
                                        </div>
                                        { /* Alignment */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Alignment
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <select
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    value={alignment}
                                                    onChange={(e) => setAlignment(e.target.value)}
                                                >
                                                    {alignments.map(c => (
                                                        <option key={c} value={c}>{c}</option>
                                                    ))}
                                                </select>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            { /* Core Gameplay Information */}
                            {(selectedView === 'all' || selectedView === 'core') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Core Statistics</h1>
                                    <div className="grid grid-cols-3 grid-rows-2">
                                        {stats.map((s) =>
                                            <div key={s.name} className="pb-4 pr-4">
                                                <p className={subTitleGameplayInformation}>{s.name}</p>
                                                <div className="grid grid-cols-8 gap-2">
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        max={30}
                                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white col-span-2"
                                                        value={s.value}
                                                        onChange={(e) => updateStatValue(s.name, Math.max(1, Math.min(30, Number(e.target.value) || 1)))} />
                                                    <input
                                                        type="number"
                                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white col-span-2 text-center"
                                                        value={s.modifier}
                                                        readOnly
                                                    />
                                                    {/* Stat proficiency (saving throw) control */}
                                                    <div className="col-span-4 flex items-center gap-2">
                                                        {(() => {
                                                            const stProf = savingThrowProf[s.name] ?? 0;
                                                            const stBtnClass = stProf > 0 ? 'px-3 py-1 rounded bg-orange-500 text-white cursor-pointer' : 'px-3 py-1 rounded bg-orange-800/50 text-white cursor-pointer';
                                                            return (
                                                                <>
                                                                    <button className={stBtnClass} onClick={() => updateStatProf(s.name)}>Proficiency</button>
                                                                </>
                                                            );
                                                        })()}
                                                    </div>
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            { /* Gameplay Information */}
                            {(selectedView === 'all' || selectedView === 'gameplay') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Gameplay Information</h1>
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
                                            <div className={inputGameplayInformation}   >
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="0"
                                                    value={profBonus}
                                                    readOnly />
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
                                        { /* Character HitDice */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                HitDice
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="D10"
                                                    value={hitDice}
                                                    readOnly />
                                            </div>
                                        </div>
                                        { /* Initiative Bonus */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Initiative Bonus
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="0"
                                                    value={initiativeBonus}
                                                    onChange={(e) => setInitiativeBonus(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        { /* Speed */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Speed
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="0"
                                                    value={speed}
                                                    onChange={(e) => setSpeed(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        { /* hitPointsMax */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Hit Points Max
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="0"
                                                    value={hitPointsMax}
                                                    onChange={(e) => setHitPointsMax(Number(e.target.value))} />
                                            </div>
                                        </div>
                                        { /* Passive Perception */}
                                        <div>
                                            <p className={subTitleGameplayInformation}>
                                                Passive Perception
                                            </p>
                                            <div className={inputGameplayInformation}>
                                                <input
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white"
                                                    placeholder="0"
                                                    value={passivePerception}
                                                    onChange={(e) => setPassivePerception(Number(e.target.value))} />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            { /* Skills */}
                            {(selectedView === 'all' || selectedView === 'skills') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Skills</h1>
                                    <div className="grid grid-cols-2">
                                        {stats.map((s) => (
                                            <div key={s.name} className="pb-4 pr-4">
                                                <div className="flex gap-4">
                                                    <p className={subTitleGameplayInformation}>{s.name}</p>
                                                    <p className={subTitleGameplayInformation}>{s.value}</p>
                                                    <p className={subTitleGameplayInformation}>{s.modifier}</p>
                                                </div>
                                                {s.skills && Object.keys(s.skills).length > 0 && (
                                                    Object.keys(s.skills).map((skillName) => {
                                                        const profLevel = skillProf[skillName] ?? 0;
                                                        const profBtnClass = profLevel > 0 ? 'px-3 py-1 rounded bg-orange-500 text-white cursor-pointer' : 'px-3 py-1 rounded bg-orange-800/50 text-white cursor-pointer';
                                                        const expBtnClass = profLevel === 2 ? 'px-3 py-1 rounded bg-orange-500 text-white cursor-pointer' : 'px-3 py-1 rounded bg-orange-800/50 text-white cursor-pointer';
                                                        return (
                                                            <div key={skillName} className="pb-2">
                                                                <p className="text-gray-400 text-sm">{skillName}</p>
                                                                <div className="grid grid-cols-8 gap-2 items-center">
                                                                    <input
                                                                        type="number"
                                                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white col-span-2"
                                                                        value={s.skills![skillName]}
                                                                        readOnly
                                                                    />
                                                                    <div className="col-span-3 flex items-center gap-2">
                                                                        <button className={profBtnClass} onClick={() => updateSkillProf(skillName, 1)}>Prof</button>
                                                                        <button className={expBtnClass} onClick={() => updateSkillProf(skillName, 2)}>Exp</button>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        );
                                                    })
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}

                            { /* Money */}
                            {(selectedView === 'all' || selectedView === 'money') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Money</h1>
                                    <div className="grid grid-cols-5">
                                        {Object.keys(money).map((s) =>
                                            <div key={s} className="pb-4 pr-4">
                                                <p className={subTitleGameplayInformation}>{s}</p>
                                                <div>
                                                    <input
                                                        type="number"
                                                        min={0}
                                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white col-span-3"
                                                        value={money[s]}
                                                        onChange={(e) => setMoney(prev => ({ ...prev, [s]: Math.max(0, Number(e.target.value) || 0) }))} />
                                                </div>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            { /* Equipment */}
                            {(selectedView === 'all' || selectedView === 'equipment') && (
                                <div className="bg-orange-700/30 p-4 rounded-md">
                                    <h1 className="text-2xl font-bold pb-4">Equipment</h1>
                                    <div className="border-2 border-orange-700 rounded py-1 px-2 w-full bg-black text-white min-h-20">
                                        <div className="relative">
                                            <button className="absolute top-1 right-1 bg-orange-600 hover:bg-orange-500 text-white font-bold py-2 px-4 rounded text-center cursor-pointer" onClick={() => createEquipment()}>Add Item</button>
                                        </div>
                                        {equipment.length === 0 && (
                                            <p className="text-gray-400">No equipment added yet.</p>
                                        )}
                                        {equipment.map((item, index) => (
                                            <div key={index} className="flex justify-between items-center border-b border-gray-700 py-1 w-3/4">
                                                <p>{item}</p>
                                                <button className="bg-red-600 hover:bg-red-500 text-white font-bold py-1 px-2 rounded cursor-pointer" onClick={() => removeEquipment(index)}>Remove</button>
                                            </div>
                                        ))}

                                    </div>

                                </div>
                            )}

                        </div>
                    </div>
                    <div className="col-span-2 w-full p-2">
                        <div className="bg-orange-700/30 rounded-md p-4 flex flex-col items-center">
                            <h1 className="text-2xl font-bold pb-6">Character Avatar</h1>
                            <div className="border-2 border-orange-700 border-dashed w-3/5 h-48 flex flex-col justify-center hover:border-orange-500">
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