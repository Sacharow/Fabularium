import { Search, Settings, Trash } from "lucide-react";
import { useState } from "react";
import { NavLink } from "react-router-dom";

const CharactersNew = () => {
  const [wantToDelete, setWantToDelete] = useState(false);

  // Mock character data
  const mockCharacters = [
    { id: 1, name: "Aragorn", class: "Ranger", race: "Human" },
    { id: 2, name: "Legolas", class: "Rogue", race: "Elf" },
    { id: 3, name: "Gimli", class: "Fighter", race: "Dwarf" },
    { id: 4, name: "Gandalf", class: "Wizard", race: "Human" },
    { id: 5, name: "Frodo", class: "Rogue", race: "Halfling" },
    { id: 6, name: "Boromir", class: "Fighter", race: "Human" },
    { id: 7, name: "Galadriel", class: "Wizard", race: "Elf" },
  ];

  return (
    <div className="flex flex-col gap-y-8 pt-8 px-48">
      {/* Upper Section */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold mb-4">CHARACTERS</h1>
        <div className="flex justify-center items-center">
          <div className="border border-orange-700 flex justify-center items-center p-2 rounded-lg bg-orange-900/50 hover:bg-orange-700/50 transition duration-200">
            <button className="active:scale-90 transition-transform duration-200 cursor-pointer">
              <Search className="w-8" />
            </button>
            <input
              type="text"
              placeholder="Search characters..."
              className="w-64 px-2"
            />
          </div>
          <button className="ml-2 px-4 py-2 bg-orange-900 hover:bg-orange-700 transition text-white rounded cursor-pointer active:scale-95 duration-200">
            FILTER
          </button>
          <NavLink
            to="/create-character"
            className="ml-2 px-4 py-2 bg-orange-900 hover:bg-orange-700 transition text-white rounded cursor-pointer active:scale-95 duration-200"
          >
            <p className="font-bold">CREATE NEW</p>
          </NavLink>
        </div>
      </div>
      {/* Lower Section */}
      <div className="grid grid-cols-5 gap-4">
        {mockCharacters.map((character) => (
          <div
            key={character.id}
            className="relative flex flex-col gap-y-4 h-80 p-4 border bg-orange-900/50 border-orange-700 rounded-lg shadow-lg hover:shadow-orange-500 transition duration-300 cursor-pointer"
          >
            <NavLink
              className="absolute top-2 right-2 z-50 p-2 border border-orange-500 bg-orange-900 rounded hover:bg-orange-700 transition duration-200 cursor-pointer active:scale-90"
              to="/edit-specific-character"
            >
              <Settings className="w-5 h-5" />
            </NavLink>
            <button
              className="absolute top-12 right-2 z-50 p-2 border border-orange-500 bg-orange-900 rounded hover:bg-orange-700 transition duration-200 cursor-pointer active:scale-90"
              onClick={() => setWantToDelete(true)}
            >
              <Trash className="w-5 h-5" />
            </button>
            <div className="bg-orange-700/50 h-40 rounded-lg flex items-center justify-center">
              <span className="text-6xl bg-orange-700 rounded-full p-4">
                🎲
              </span>
            </div>
            <div className="flex flex-col gap-1">
              <h3 className="text-xl font-bold mb-2">{character.name}</h3>
              <p className="text-gray-300">{character.class}</p>
              <p className="text-gray-300">{character.race}</p>
              <NavLink
                to="/connected-campaign"
                className="rounded bg-orange-900/50 p-1 text-orange-500 hover:text-white text-sm cursor-pointer hover:bg-orange-700/50 transition duration-300"
              >
                <p className="text-right px-2">To Campaign</p>
              </NavLink>
            </div>
          </div>
        ))}
      </div>
      <div>
        {wantToDelete && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center gap-y-4">
            <h2 className="text-2xl font-bold text-white">
              Are you sure you want to delete this character?
            </h2>
            <div className="flex gap-x-4">
              <button
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white rounded cursor-pointer active:scale-95 transition duration-200"
                onClick={() => {
                  // Handle deletion logic here
                  setWantToDelete(false);
                }}
              >
                Yes, Delete
              </button>
              <button
                className="px-4 py-2 bg-gray-600 hover:bg-gray-500 text-white rounded cursor-pointer active:scale-95 transition duration-200"
                onClick={() => setWantToDelete(false)}
              >
                No, Keep
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CharactersNew;
