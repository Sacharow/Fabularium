import { ArrowRight, Diamond } from "lucide-react";
import { NavLink } from "react-router-dom";

function CharacterCard({
  name,
  level,
  race,
  characterClass,
  hp,
  speed,
  armorClass,
  connectedCampaign,
}: {
  name?: string;
  level?: number;
  race?: string;
  characterClass?: string;
  hp?: number;
  speed?: number;
  armorClass?: number;
  connectedCampaign?: string;
}) {
  return (
    <div className="bg-neutral w-full flex flex-col gap-8 text-neutral-text border-2 border-gold-neutral p-4 hover:scale-105 cursor-pointer">
      {/* UPPER SECTION */}
      <div>
        <div className="flex flex-row justify-between items-center">
          <p className="text-lg tracking-widest uppercase">{name}</p>
          <p className="border border-gold-neutral bg-dark p-2">
            Level: {level}
          </p>
        </div>
        <p className="px-4">{race}</p>
        <p className="px-4">{characterClass}</p>
      </div>
      {/* MIDDLE SECTION */}
      <div className="flex flex-col gap-4">
        <hr />
        <p className="text-lg tracking-widest">STATS</p>
        <div className="grid grid-cols-3 gap-4">
          {[
            ["HP", hp],
            ["AC", armorClass],
            ["SPEED", speed],
          ].map(([label, value]) => (
            <div
              key={label}
              className="border border-gold-neutral bg-dark p-2 flex flex-col justify-center items-center"
            >
              <p>{label}</p>
              <p>{value}</p>
            </div>
          ))}
        </div>
      </div>
      {/* LOWER SECTION */}
      <div className="flex flex-row items-center justify-between hover:bg-light hover:border-l-8 hover:border-gold-neutral p-2">
        <Diamond size={18} className="text-gold-neutral" />
        <NavLink to="/CONNECTED-CAMPAIGN" className="ml-2">
          View {connectedCampaign}
          <ArrowRight size={18} className="inline ml-1 text-gold-neutral" />
        </NavLink>
      </div>
    </div>
  );
}

export default CharacterCard;
