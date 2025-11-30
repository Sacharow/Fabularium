import { PrismaClient } from "../generated/prisma";
const prisma = new PrismaClient();

//
// Helpers
//
const ability = (str=0, dex=0, con=0, int=0, wis=0, cha=0) => ({
  strength: str, dexterity: dex, constitution: con,
  intelligence: int, wisdom: wis, charisma: cha
});

async function main() {

  //
  // RACES + SUBRACES
  //

  const races = [
    {
      name: "Dragonborn",
      description: "Draconic ancestry.",
      abilityBonuses: ability(2,0,0,0,0,1),
      subrace: { name: "Red Dragonborn", description: "Fire lineage.", abilityBonuses: ability() },
      features: ["Draconic Ancestry", "Breath Weapon", "Damage Resistance"]
    },
    {
      name: "Dwarf",
      description: "Stout, durable folk.",
      abilityBonuses: ability(0,0,2,0,0,0),
      subrace: { name: "Hill Dwarf", description: "Wise and sturdy.", abilityBonuses: ability(0,0,1,0,1,0) },
      features: ["Darkvision", "Resilience"]
    },
    {
      name: "Elf",
      description: "Graceful, perceptive.",
      abilityBonuses: ability(0,2,0,0,0,0),
      subrace: { name: "High Elf", description: "Magically inclined.", abilityBonuses: ability(0,0,0,1,0,0) },
      features: ["Darkvision", "Fey Ancestry"]
    },
    {
      name: "Gnome",
      description: "Inventive, curious.",
      abilityBonuses: ability(0,0,0,2,0,0),
      subrace: { name: "Forest Gnome", description: "Illusionist.", abilityBonuses: ability(0,1,0,0,0,0) },
      features: ["Darkvision", "Gnome Cunning"]
    },
    {
      name: "Half-Elf",
      description: "Versatile, charismatic.",
      abilityBonuses: ability(0,0,0,0,0,2),
      subrace: { name: "Standard Half-Elf", description: "Adaptable.", abilityBonuses: ability(1,1,0,0,0,0) },
      features: ["Fey Ancestry", "Skill Versatility"]
    },
    {
      name: "Half-Orc",
      description: "Strong, intimidating.",
      abilityBonuses: ability(2,0,1,0,0,0),
      subrace: { name: "Standard Half-Orc", description: "No variant.", abilityBonuses: ability() },
      features: ["Darkvision", "Relentless Endurance"]
    },
    {
      name: "Halfling",
      description: "Small and lucky.",
      abilityBonuses: ability(0,2,0,0,0,0),
      subrace: { name: "Lightfoot", description: "Sneaky and charismatic.", abilityBonuses: ability(0,0,0,0,0,1) },
      features: ["Lucky", "Brave"]
    },
    {
      name: "Human",
      description: "Versatile and ambitious.",
      abilityBonuses: ability(1,1,1,1,1,1),
      subrace: { name: "Variant Human", description: "Flexible.", abilityBonuses: ability() },
      features: ["Extra Skill"]
    },
    {
      name: "Tiefling",
      description: "Infernal heritage.",
      abilityBonuses: ability(0,0,0,1,0,2),
      subrace: { name: "Infernal Tiefling", description: "Asmodeus lineage.", abilityBonuses: ability() },
      features: ["Darkvision", "Hellish Resistance"]
    }
  ];

  for (const r of races) {
    const race = await prisma.race.create({
      data: {
        name: r.name,
        description: r.description,
        abilityBonuses: r.abilityBonuses,
        features: {
          create: r.features.map(f => ({
            name: f,
            description: f
          }))
        },
        subraces: {
          create: {
            name: r.subrace.name,
            description: r.subrace.description,
            abilityBonuses: r.subrace.abilityBonuses,
            features: {
              create: [{ name: "Subrace Feature", description: "Example subrace feature." }]
            }
          }
        }
      }
    });
  }


  //
  // CLASSES + SUBCLASSES
  //

  const classes = [
    { name: "Barbarian", hitDie: 12, sub: "Berserker", lvl1: ["Rage", "Unarmored Defense"] },
    { name: "Bard", hitDie: 8, sub: "College of Lore", lvl1: ["Spellcasting", "Bardic Inspiration"] },
    { name: "Cleric", hitDie: 8, sub: "Life Domain", lvl1: ["Spellcasting", "Divine Domain"] },
    { name: "Druid", hitDie: 8, sub: "Circle of the Land", lvl1: ["Druidic", "Spellcasting"] },
    { name: "Fighter", hitDie: 10, sub: "Champion", lvl1: ["Fighting Style", "Second Wind"] },
    { name: "Monk", hitDie: 8, sub: "Way of Shadow", lvl1: ["Martial Arts"] },
    { name: "Paladin", hitDie: 10, sub: "Oath of Devotion", lvl1: ["Divine Sense", "Lay on Hands"] },
    { name: "Ranger", hitDie: 10, sub: "Hunter", lvl1: ["Favored Enemy", "Natural Explorer"] },
    { name: "Rogue", hitDie: 8, sub: "Thief", lvl1: ["Expertise", "Sneak Attack"] },
    { name: "Sorcerer", hitDie: 6, sub: "Draconic Bloodline", lvl1: ["Spellcasting", "Sorcerous Origin"] },
    { name: "Warlock", hitDie: 8, sub: "Fiend Patron", lvl1: ["Otherworldly Patron", "Pact Magic"] },
    { name: "Wizard", hitDie: 6, sub: "Evocation School", lvl1: ["Spellcasting", "Arcane Recovery"] }
  ];

  for (const c of classes) {
    await prisma.class.create({
      data: {
        name: c.name,
        description: `${c.name} base class.`,
        hitDie: c.hitDie,
        features: {
          create: c.lvl1.map(f => ({
            level: 1,
            name: f,
            description: f
          }))
        },
        subclasses: {
          create: {
            name: c.sub,
            description: `${c.sub} subclass.`,
            features: {
              create: [
                { level: 3, name: "Subclass Feature", description: `First feature of ${c.sub}.` }
              ]
            }
          }
        }
      }
    });
  }

  console.log("Seeding complete!");
}

main()
  .catch(e => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => prisma.$disconnect());
