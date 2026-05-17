import { Users, BookOpen } from "lucide-react";
import { NavLink } from "react-router-dom";

function CampaignCard({
  title,
  description,
  players,
  currentSession,
  id,
  image,
}: {
  title?: string;
  description?: string;
  players?: number;
  currentSession?: number | string;
  id?: string;
  image?: string;
}) {
  return (
    <NavLink
      to={id ? `/preview/campaign/${id}` : "/preview/campaign"}
      className="bg-neutral w-full min-h-96 flex flex-col overflow-hidden text-neutral-text border-2 border-gold-neutral hover:scale-105 cursor-pointer"
    >
      <div className="relative h-52 w-full shrink-0 bg-dark">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: `url('${image ?? "/heros/forge.jpg"}')` }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-dark/25 to-neutral" />
        <div className="absolute inset-0 flex items-end p-6">
          <p className="text-xl tracking-widest uppercase font-bold drop-shadow">
            {title}
          </p>
        </div>
      </div>

      <div className="flex flex-1 flex-col gap-6 p-6">
        <div className="min-h-16">
          <p className="text-sm leading-relaxed text-neutral-text">
            {description}
          </p>
        </div>

        <div className="flex flex-col gap-4 mt-auto">
          <hr className="border-gold-dark" />
          <div className="grid grid-cols-2 gap-4">
            {[
              {
                label: "PLAYERS",
                value: players,
                icon: <Users size={16} className="text-gold-neutral" />,
              },
              {
                label: "SESSION",
                value: currentSession,
                icon: <BookOpen size={16} className="text-gold-neutral" />,
              },
            ].map(({ label, value, icon }) => (
              <div
                key={label}
                className="border border-gold-neutral bg-dark p-3 flex flex-col gap-2"
              >
                <div className="flex items-center gap-2">
                  {icon}
                  <p className="text-xs tracking-widest">{label}</p>
                </div>
                <p className="font-semibold">{value}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </NavLink>
  );
}

export default CampaignCard;
