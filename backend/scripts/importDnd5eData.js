// Skrypt importujący dane z dnd5eapi do bazy przez Prisma
// Uruchamiaj po migracji bazy!

const axios = require('axios');
const { PrismaClient } = require('../generated/prisma/client');
const prisma = new PrismaClient();

async function importRaceAbilities() {
  const races = await prisma.race.findMany();
  for (const race of races) {
    try {
      const details = await axios.get(`https://www.dnd5eapi.co/api/races/${race.name.toLowerCase()}`);
      const r = details.data;
      if (r.traits && r.traits.length > 0) {
        for (const trait of r.traits) {
          let traitDesc = null;
          try {
            const traitDetails = await axios.get(`https://www.dnd5eapi.co${trait.url}`);
            traitDesc = traitDetails.data.desc ? traitDetails.data.desc.join('\n') : null;
          } catch (err) {
            console.error(`[RaceAbility] Error importing trait ${trait.name}:`, err.message);
          }
          try {
            await prisma.raceAbility.upsert({
              where: { name: trait.name },
              update: {},
              create: {
                name: trait.name,
                description: traitDesc,
                race: { connect: { name: race.name } },
              }
            });
          } catch (err) {
            console.error(`[RaceAbility] Prisma error for trait ${trait.name}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error(`[RaceAbility] Error importing for race ${race.name}:`, err.message);
    }
  }
}

async function importSubRaceAbilities() {
  const subraces = await prisma.subRace.findMany();
  for (const subrace of subraces) {
    try {
      const details = await axios.get(`https://www.dnd5eapi.co/api/subraces/${subrace.name.toLowerCase().replace(/ /g, '-')}`);
      const s = details.data;
      if (s.traits && s.traits.length > 0) {
        for (const trait of s.traits) {
          let traitDesc = null;
          try {
            const traitDetails = await axios.get(`https://www.dnd5eapi.co${trait.url}`);
            traitDesc = traitDetails.data.desc ? traitDetails.data.desc.join('\n') : null;
          } catch (err) {
            console.error(`[SubRaceAbility] Error importing trait ${trait.name}:`, err.message);
          }
          try {
            await prisma.subRaceAbility.upsert({
              where: { name: trait.name },
              update: {},
              create: {
                name: trait.name,
                description: traitDesc,
                subRace: { connect: { name: subrace.name } },
              }
            });
          } catch (err) {
            console.error(`[SubRaceAbility] Prisma error for trait ${trait.name}:`, err.message);
          }
        }
      }
    } catch (err) {
      console.error(`[SubRaceAbility] Error importing for subrace ${subrace.name}:`, err.message);
    }
  }
}

async function importFeats() {
  try {
    const list = await axios.get('https://www.dnd5eapi.co/api/feats');
    for (const feat of list.data.results) {
      try {
        const details = await axios.get(`https://www.dnd5eapi.co${feat.url}`);
        const f = details.data;
        await prisma.feat.upsert({
          where: { name: f.name },
          update: {},
          create: {
            name: f.name,
            description: f.desc ? f.desc.join('\n') : null,
          }
        });
        console.log(`Imported feat: ${f.name}`);
      } catch (err) {
        console.error(`[Feat] Error importing ${feat.name}:`, err.message);
      }
    }
  } catch (err) {
    console.error('[Feat] General error:', err.message);
  }
}

async function importMonsters() {
  const list = await axios.get('https://www.dnd5eapi.co/api/monsters');
  for (const monster of list.data.results) {
    const details = await axios.get(`https://www.dnd5eapi.co${monster.url}`);
    const m = details.data;
    // armor_class może być liczbą lub tablicą obiektów
    let armorClass = null;
    if (typeof m.armor_class === 'number') {
      armorClass = m.armor_class;
    } else if (Array.isArray(m.armor_class) && m.armor_class.length > 0) {
      armorClass = m.armor_class[0].value;
    }
    await prisma.monster.upsert({
      where: { apiId: m.index },
      update: {},
      create: {
        apiId: m.index,
        name: m.name,
        size: m.size,
        type: m.type,
        subtype: m.subtype || null,
        alignment: m.alignment || null,
        armorClass,
        hitPoints: m.hit_points || null,
        hitDice: m.hit_dice || null,
        speed: m.speed ? JSON.stringify(m.speed) : null,
        stats: JSON.stringify({ str: m.strength, dex: m.dexterity, con: m.constitution, int: m.intelligence, wis: m.wisdom, cha: m.charisma }),
        actions: m.actions ? JSON.stringify(m.actions) : null,
        legendaryActions: m.legendary_actions ? JSON.stringify(m.legendary_actions) : null,
        specialAbilities: m.special_abilities ? JSON.stringify(m.special_abilities) : null,
        languages: m.languages || null,
        challengeRating: m.challenge_rating || null,
        xp: m.xp || null,
        senses: m.senses ? JSON.stringify(m.senses) : null,
        damageImmunities: m.damage_immunities ? m.damage_immunities.join(', ') : null,
        conditionImmunities: m.condition_immunities ? m.condition_immunities.join(', ') : null,
        damageResistances: m.damage_resistances ? m.damage_resistances.join(', ') : null,
        damageVulnerabilities: m.damage_vulnerabilities ? m.damage_vulnerabilities.join(', ') : null,
        savingThrows: m.proficiencies ? JSON.stringify(m.proficiencies.filter(p => p.proficiency.index.includes('saving-throw'))) : null,
        skills: m.proficiencies ? JSON.stringify(m.proficiencies.filter(p => p.proficiency.index.includes('skill'))) : null,
        reactions: m.reactions ? JSON.stringify(m.reactions) : null,
        environment: m.environment || null,
        image: m.image || null,
      }
    });
    console.log(`Imported monster: ${m.name}`);
  }
}

async function importClasses() {
  const list = await axios.get('https://www.dnd5eapi.co/api/classes');
  for (const cls of list.data.results) {
    const details = await axios.get(`https://www.dnd5eapi.co${cls.url}`);
    const c = details.data;
    await prisma.class.upsert({
      where: { name: c.name },
      update: {},
      create: {
        name: c.name,
        hitDie: c.hit_die || null,
        spellcasting: !!c.spellcasting,
        description: c.desc ? c.desc.join('\n') : null,
      }
    });
    // Subclasses
    if (c.subclasses && c.subclasses.length > 0) {
      for (const sub of c.subclasses) {
        let subDesc = null;
        try {
          const subDetails = await axios.get(`https://www.dnd5eapi.co${sub.url}`);
          subDesc = subDetails.data.desc ? subDetails.data.desc.join('\n') : null;
        } catch {}
        await prisma.subclass.upsert({
          where: { name: sub.name },
          update: {},
          create: {
            name: sub.name,
            description: subDesc,
            class: { connect: { name: c.name } },
          }
        });
      }
    }
    console.log(`Imported class: ${c.name}`);
  }
}



async function importItems() {
  const list = await axios.get('https://www.dnd5eapi.co/api/equipment');
  for (const item of list.data.results) {
    const details = await axios.get(`https://www.dnd5eapi.co${item.url}`);
    const i = details.data;
    await prisma.item.upsert({
      where: { name: i.name },
      update: {},
      create: {
        name: i.name,
        type: i.equipment_category?.name || null,
        description: i.desc ? i.desc.join('\n') : null,
        weight: i.weight || null,
        value: i.cost?.quantity || null,
        properties: i.properties ? i.properties.map(p => p.name).join(', ') : null,
      }
    });
    console.log(`Imported item: ${i.name}`);
  }
}

async function importRaces() {
  const list = await axios.get('https://www.dnd5eapi.co/api/races');
  for (const race of list.data.results) {
    const details = await axios.get(`https://www.dnd5eapi.co${race.url}`);
    const r = details.data;
    // Race
    await prisma.race.upsert({
      where: { name: r.name },
      update: {},
      create: {
        name: r.name,
        description: r.desc ? r.desc.join('\n') : null,
        size: r.size || null,
        speed: r.speed || null,
        languages: r.languages ? r.languages.map(l => l.name).join(', ') : null,
      }
    });
    // Subraces
    if (r.subraces && r.subraces.length > 0) {
      for (const sub of r.subraces) {
        // dnd5eapi subrace only has name and url, so fetch details if available
        let subDesc = null;
        try {
          const subDetails = await axios.get(`https://www.dnd5eapi.co${sub.url}`);
          subDesc = subDetails.data.desc ? subDetails.data.desc.join('\n') : null;
        } catch {}
        await prisma.subRace.upsert({
          where: { name: sub.name },
          update: {},
          create: {
            name: sub.name,
            description: subDesc,
            parentRace: { connect: { name: r.name } },
          }
        });
      }
    }
    console.log(`Imported race: ${r.name}`);
  }
}

async function main() {
  await importRaceAbilities();
  await importSubRaceAbilities();
  await importFeats();

  await prisma.$disconnect();
}

main().catch(e => {
  console.error(e);
  prisma.$disconnect();
  process.exit(1);
});
