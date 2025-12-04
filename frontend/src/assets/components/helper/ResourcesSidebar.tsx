import { useState } from "react";

type Props = {
  active?: string | null;
  onChange?: (name: string) => void;
  sources?: any[];
  selectedSources?: Record<number, boolean>;
  onToggleSource?: (index: number) => void;
  onSelectAll?: () => void;
  onClearAll?: () => void;
};

function IconBackgrounds() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.666 3.888A2.25 2.25 0 0 0 13.5 2.25h-3c-1.03 0-1.9.693-2.166 1.638m7.332 0c.055.194.084.4.084.612v0a.75.75 0 0 1-.75.75H9a.75.75 0 0 1-.75-.75v0c0-.212.03-.418.084-.612m7.332 0c.646.049 1.288.11 1.927.184 1.1.128 1.907 1.077 1.907 2.185V19.5a2.25 2.25 0 0 1-2.25 2.25H6.75A2.25 2.25 0 0 1 4.5 19.5V6.257c0-1.108.806-2.057 1.907-2.185a48.208 48.208 0 0 1 1.927-.184" />
    </svg>
  );
}

function IconClasses() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M15.362 5.214A8.252 8.252 0 0 1 12 21 8.25 8.25 0 0 1 6.038 7.047 8.287 8.287 0 0 0 9 9.601a8.983 8.983 0 0 1 3.361-6.867 8.21 8.21 0 0 0 3 2.48Z" />
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 18a3.75 3.75 0 0 0 .495-7.468 5.99 5.99 0 0 0-1.925 3.547 5.975 5.975 0 0 1-2.133-1.001A3.75 3.75 0 0 0 12 18Z" />
    </svg>
  );
}

function IconFeats() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="m3.75 13.5 10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75Z" />
    </svg>
  );
}

function IconRaces() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
    </svg>
  );
}

function IconSpells() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="w-6 h-6">
      <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
    </svg>
  );
}

export default function ResourcesSidebar({ active: controlledActive = null, onChange, sources = [], selectedSources = {}, onToggleSource, onSelectAll, onClearAll }: Props) {
  const buttons = [
    { name: 'Backgrounds', icon: IconBackgrounds },
    { name: 'Classes', icon: IconClasses },
    { name: 'Feats', icon: IconFeats },
    { name: 'Races', icon: IconRaces },
    { name: 'Spells', icon: IconSpells },
  ];

  const [internalActive, setInternalActive] = useState<string | null>(buttons[0].name);
  const active = controlledActive ?? internalActive;

  const handleClick = (name: string) => {
    setInternalActive(name);
    onChange?.(name);
  };

  const buttonClass = (isActive: boolean) => `w-full cursor-pointer hover:bg-orange-700 rounded p-2 pl-4 flex gap-2 ${isActive ? 'bg-orange-700 text-white font-semibold' : ''}`;

  return (
    <>
      {buttons.map((button) => {
        const Icon = button.icon;
        const isActive = active === button.name;
        return (
          <button key={button.name} type="button" className={buttonClass(isActive)} onClick={() => handleClick(button.name)} aria-pressed={isActive}>
            <Icon />
            <p>{button.name}</p>
          </button>
        );
      })}
      {sources && sources.length > 0 && (
        <div className="mt-6 border-t border-orange-700 pt-4">
          <div className="text-sm text-gray-300 font-medium mb-2">Sources</div>
          <div className="flex gap-2 mb-3">
            <button type="button" onClick={() => onSelectAll?.()} className="text-xs px-2 py-1 rounded bg-orange-700/80">All</button>
            <button type="button" onClick={() => onClearAll?.()} className="text-xs px-2 py-1 rounded bg-gray-700/50">Clear</button>
          </div>

          <div className="flex flex-wrap gap-2">
            {sources.map((s: any, i: number) => {
              const acronym = s?.acronym ?? s?.name ?? `#${i}`;
              const isActive = !!selectedSources?.[i];
              const tileClass = `cursor-pointer px-2 py-1 rounded-md border flex items-center justify-center text-xs ${isActive ? 'bg-orange-700 text-white font-semibold' : 'bg-transparent text-orange-100 border-orange-700/30 hover:bg-orange-600/10'}`;
              return (
                <button
                  key={i}
                  type="button"
                  aria-pressed={isActive}
                  title={s?.name}
                  className={tileClass}
                  onClick={() => onToggleSource?.(i)}
                >
                  {acronym}
                </button>
              );
            })}
          </div>
        </div>
      )}
    </>
  );
}
