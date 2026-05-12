import { ArrowRight, Diamond } from "lucide-react";
import { NavLink, useNavigate } from "react-router-dom";

function CharacterCard({
  id,
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
  id?: string;
}) {
  const navigate = useNavigate();
  const characterPath = id ? `/character/${id}` : "/preview/character";
  const displayName = name?.replace(/-/g, " ").replace(/\s+/g, " ").trim();

  return (
    <div
      role="link"
      tabIndex={0}
      onClick={() => navigate(characterPath)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          navigate(characterPath);
        }
      }}
      className="bg-neutral w-full flex flex-col justify-between gap-8 text-neutral-text border-2 border-gold-neutral p-4 hover:scale-105 cursor-pointer"
    >
      {/* UPPER SECTION */}
      <div>
        <div className="flex flex-row justify-between items-center gap-2">
          <p className="text-lg tracking-widest uppercase">
            {displayName || name}
          </p>
          <p className="border border-gold-neutral bg-dark p-2 text-center">
            Lv: {level}
          </p>
        </div>
        <p className="px-4">{race}</p>
        <p className="px-4">{characterClass}</p>
      </div>
      {/* MIDDLE SECTION */}
      <div className="flex flex-col gap-4">
        <hr className="text-gold-dark" />
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
      <div
        className={`flex flex-row items-center justify-between p-2 ${
          connectedCampaign
            ? "hover:bg-light hover:border-l-8 hover:border-gold-neutral"
            : "opacity-50 cursor-not-allowed"
        }`}
        aria-disabled={!connectedCampaign}
      >
        <Diamond size={18} className="text-gold-neutral" />
        {connectedCampaign ? (
          <NavLink
            to="/preview/campaign"
            className="ml-2"
            onClick={(e) => e.stopPropagation()}
          >
            View {connectedCampaign}
            <ArrowRight size={18} className="inline ml-1 text-gold-neutral" />
          </NavLink>
        ) : (
          <div className="ml-2 text-gray-light">No campaign connected</div>
        )}
      </div>
    </div>
  );
}

export default CharacterCard;
