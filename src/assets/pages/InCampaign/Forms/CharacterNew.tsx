import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import classes from "../../../components/constants/classes.json";
import races from "../../../components/constants/races.json";  

export default function CharacterNew() {
    type Stat = {
        name: string;
        value: number;
        skills?: Record<string, number>;
    }

    const [stats, setStats] = useState<Stat[]>([
        { name: "Strength", value: 0, skills: { "Athletics": 0 }},
        { name: "Dexterity", value: 0, skills: { "Acrobatics": 0, "Sleight of Hand": 0, "Stealth": 0 }},
        { name: "Constitution", value: 0 },
        { name: "Intelligence", value: 0, skills: { "Arcana": 0, "History": 0, "Investigation": 0, "Nature": 0, "Religion": 0 }},
        { name: "Wisdom", value: 0, skills: { "Animal Handling": 0, "Insight": 0, "Medicine": 0, "Perception": 0, "Survival": 0 }},
        { name: "Charisma", value: 0, skills: { "Deception": 0, "Intimidation": 0, "Performance": 0, "Persuasion": 0 }}
    ]);

    const updateStatValue = (statName: string, newValue: number) => {
        setStats(prev => prev.map(s => s.name === statName ? { ...s, value : newValue } : s));
    }

    const [ name, setName ] = useState<string>("");
    const [ description, setDescription ] = useState<string>("");
    const [ coreStats, setCoreStats ] = useState<number[]>([0, 0, 0, 0, 0, 0]);
    const [ level, setLevel ] = useState<number>(1);
    const [ profBonus, setProfBonus ] = useState<number>(0);
    const [ skillProf, setSkillProf ] = useState<number[]>([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);
    const [ skillBonus, setSkillBonus ] = useState<number[]>([0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0]);

    const [characterClass, setCharacterClass] = useState<string>("Fighter");
    const [characterRace, setCharacterRace] = useState<string>("Human");
    const [characterSubclass, setCharacterSubclass] = useState<string>("");
    const [subclasses, setSubclasses] = useState<string[]>([]);

    const profBtnClass = (idx: number, val: number) => {
        const base = "px-4 py-1 rounded-md";
        const inactive = `${base} bg-orange-500/30 hover:bg-orange-500/50 text-gray-300`;

        if (skillProf[idx] !== val) return inactive;

        // active styles per value
        if (val >= 0) return `${base} bg-orange-500 text-white`;
        return inactive;
    }

    const toggleSkillProf = (idx: number, val: number) => {
        setSkillProf(prev => {
            const copy = [...prev];
            copy[idx] = val;
            return copy;
        })
    }

    const navigate = useNavigate();

    useEffect(() => {
        if (level < 0 ) {
            setLevel(1)
        }
        if (level > 20 ) {
            setLevel(20)
        }
    }, [level])

    useEffect(() => {
        // calculate proficiency bonus based on level
        const bonus = Math.ceil(level / 4) + 1;
        setProfBonus(bonus);
    }, [level]);

    useEffect(() => {
        setSubclasses(classes.find(c => c.class === characterClass)?.subclass || []);
        if (subclasses.length > 0) {
            setCharacterSubclass(subclasses[0]);
        }
    }, [characterClass]);

    const core_stats = [
        "Strength",
        "Dexterity",
        "Constitution",
        "Intelligence",
        "Wisdom",
        "Charisma"
    ]

    const skills = [
        "Acrobatics",
        "Animal Handling",
        "Arcana",
        "Athletics",
        "Deception",
        "History",
        "Insight",
        "Intimidation",
        "Investigation",
        "Medicine",
        "Nature",
        "Perception",
        "Performance",
        "Persuasion",
        "Religion",
        "Sleight of Hand",
        "Stealth",
        "Survival"
    ]

    const inputGameplayInformation = `bg-black/80 w-full`;
    const subTitleGameplayInformation = `text-gray-400 py-2`;

    return (
        <div className="pt-6">
            <div className="max-w-7l w-full">
                <div className="grid grid-cols-8">
                    <div className="col-span-2"></div>
                    <div className="col-span-6">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm ">
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-2)}>Campaigns </button>
                                <span> / </span> 
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(-1)}>Character</button>
                                <span> / </span> 
                                <button className="cursor-pointer hover:text-gray-400" onClick={() => navigate(0)}> New</button>
                            </p>
                        </div>
                        <div>
                            <h1 className="text-4xl font-bold mb-6">Create New Character</h1>
                        </div>
                    </div>

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
                                        className="border-2 border-orange-700 rounded py-1 px-2 w-full" 
                                        placeholder="Name" 
                                        value={name}
                                        onChange={(e) => setName(e.target.value)} />
                                </div>
                                <p className="text-gray-400 py-2">Character's Description</p>
                                <div className="bg-black/80">
                                    <textarea
                                        className="border-2 border-orange-700 rounded py-1 px-2 h-32 w-full align-top"
                                        placeholder="Description" 
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)} />
                                </div>
                            </div>

                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold pb-4">Core Statistics</h1>
                                <div className="grid grid-cols-3 grid-rows-2">
                                    {core_stats.map((stat, index) => 
                                        <div key={stat} className="pb-4 pr-4">
                                            <p className="text-gray-400 py-2">{stat}</p>
                                            <div className="bg-black/80">
                                                <input 
                                                    className="border-2 border-orange-700 rounded py-1 px-2 w-full"
                                                    value={coreStats[index]}
                                                    onChange={(e) => {
                                                        const val = Number(e.target.value) || 0;
                                                        setCoreStats(prev => {
                                                            const copy = [...prev];
                                                            copy[index] = val;
                                                            return copy;
                                                        })
                                                    }}
                                                    />
                                                    
                                            </div>
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
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full"
                                            placeholder="0"
                                            value={level}
                                            onChange={(e) => setLevel(Number(e.target.value))} />
                                        </div>
                                    </div>
                                    { /* Proficiency Bonus */}
                                    <div>
                                        <p className={subTitleGameplayInformation}>
                                            Proficiency Bonus
                                        </p>
                                        <div className="bg-gray-900/70 w-full">
                                            <input 
                                            className="border-2 border-orange-700 rounded py-1 px-2 w-full"
                                            placeholder="0"
                                            value={profBonus} 
                                            disabled/>
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

                                </div>
                            </div>

                            <div className="bg-orange-700/30 p-4 rounded-md">
                                <h1 className="text-2xl font-bold pb-4">Skills</h1>
                                <div>
                                    {skills.map((skill) => 
                                        <div key={skill} className="pb-4 pr-4">
                                            <div className="flex gap-4 pb-2">
                                                <p className="text-gray-400 py-1">{skill}</p>
                                                <button className={profBtnClass(skills.indexOf(skill), 0)} onClick={() => toggleSkillProf(skills.indexOf(skill), 0)}>Lack</button>
                                                <button className={profBtnClass(skills.indexOf(skill), 1)} onClick={() => toggleSkillProf(skills.indexOf(skill), 1)}>Prof</button>
                                                <button className={profBtnClass(skills.indexOf(skill), 2)} onClick={() => toggleSkillProf(skills.indexOf(skill), 2)}>Exp</button>
                                            </div>
                                            <div className="bg-gray-900/70 w-full">
                                                <input 
                                                className="border-2 border-orange-700 rounded py-1 px-2 w-full"
                                                placeholder="0"
                                                value={skillBonus[skills.indexOf(skill)]}
                                                disabled/>
                                            </div>
                                        </div>
                                    )}    
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
        </div>
    );
}