import CharacterCard from "../components/CharacterCard";

const numberOfCharacters = 7; // Placeholder for the number of characters to display
const character = {
  name: "Rundal Zed",
  level: 20,
  race: "Mega",
  class: "Wizard",
  hp: 100,
  speed: 30,
  armorClass: 18,
  connectedCampaign: "Brand New World",
};

function CharactersNew() {
  return (
    <div className="min-h-screen ml-64 bg-dark text-neutral-text p-12 flex flex-col gap-12">
      <h1 className="text-2xl font-bold tracking-widest">MY CHARACTERS</h1>
      <div className="grid grid-cols-4 gap-8">
        {Array.from({ length: numberOfCharacters }).map((_, index) => (
          <CharacterCard
            key={index}
            name={character.name}
            level={character.level}
            race={character.race}
            characterClass={character.class}
            hp={character.hp}
            speed={character.speed}
            armorClass={character.armorClass}
            connectedCampaign={character.connectedCampaign}
          />
        ))}
      </div>
    </div>
  );
}

export default CharactersNew;
