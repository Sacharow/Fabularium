import { Search, Settings, Trash } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const CharactersNew = () => {
  const navigate = useNavigate();
  const [wantToDelete, setWantToDelete] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("dateCreated");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock character data
  const mockCharacters = [
    {
      id: 1,
      name: "Aragorn",
      class: "Ranger",
      race: "Human",
      level: 5,
      dateCreated: "2024-01-15",
    },
    {
      id: 2,
      name: "Legolas",
      class: "Rogue",
      race: "Elf",
      level: 5,
      dateCreated: "2024-02-10",
    },
    {
      id: 3,
      name: "Gimli",
      class: "Fighter",
      race: "Dwarf",
      level: 5,
      dateCreated: "2024-01-20",
    },
    {
      id: 4,
      name: "Gandalf",
      class: "Wizard",
      race: "Human",
      level: 10,
      dateCreated: "2023-12-05",
    },
    {
      id: 5,
      name: "Frodo",
      class: "Rogue",
      race: "Halfling",
      level: 3,
      dateCreated: "2024-03-01",
    },
    {
      id: 6,
      name: "Boromir",
      class: "Fighter",
      race: "Human",
      level: 5,
      dateCreated: "2024-02-20",
    },
    {
      id: 7,
      name: "Galadriel",
      class: "Wizard",
      race: "Elf",
      level: 10,
      dateCreated: "2023-11-30",
    },
    {
      id: 8,
      name: "Samwise",
      class: "Fighter",
      race: "Halfling",
      level: 4,
      dateCreated: "2024-01-25",
    },
    {
      id: 9,
      name: "Elrond",
      class: "Wizard",
      race: "Elf",
      level: 12,
      dateCreated: "2023-10-10",
    },
    {
      id: 10,
      name: "Dwalin",
      class: "Fighter",
      race: "Dwarf",
      level: 6,
      dateCreated: "2024-02-15",
    },
    {
      id: 11,
      name: "Tauriel",
      class: "Ranger",
      race: "Elf",
      level: 7,
      dateCreated: "2024-03-05",
    },
    {
      id: 12,
      name: "Bilbo",
      class: "Rogue",
      race: "Halfling",
      level: 4,
      dateCreated: "2024-01-10",
    },
  ];

  const getFilterLabelStyle = (filterValue: any) => {
    const baseStyle =
      "flex items-center cursor-pointer w-full rounded px-2 py-1 transition-colors duration-200";
    const selectedStyle =
      selectedFilter === filterValue
        ? "bg-orange-700"
        : "hover:bg-orange-700/50";
    return `${baseStyle} ${selectedStyle}`;
  };

  const customRadioStyle = "appearance-none";

  const filteredCharacters = mockCharacters
    .filter((character) => {
      const searchLower = searchQuery.toLowerCase();
      const characterName = character.name.toLowerCase();
      return characterName.includes(searchLower);
    })
    .sort((a, b) => {
      const fieldA = a[selectedFilter as keyof typeof a];
      const fieldB = b[selectedFilter as keyof typeof b];

      // Handle numeric and string comparisons
      let comparison = 0;
      if (typeof fieldA === "number" && typeof fieldB === "number") {
        comparison = fieldA - fieldB;
      } else {
        const strA = fieldA?.toString().toLowerCase() || "";
        const strB = fieldB?.toString().toLowerCase() || "";
        comparison = strA.localeCompare(strB);
      }
      return comparison;
    });

  return (
    <div className="flex flex-col gap-y-8 pt-8 px-48">
      {/* Upper Section */}
      <div className="flex justify-between">
        <h1 className="text-3xl font-bold">CHARACTERS</h1>
        <div className="flex justify-center items-center">
          <div className="border border-yellow-700 flex justify-center items-center p-2 rounded-lg bg-orange-900/50 hover:bg-orange-700/50 transition duration-200">
            <Search className="w-8" />
            <input
              type="text"
              placeholder="Search characters..."
              className="w-64 px-2 focus:outline-none bg-transparent text-yellow-300 placeholder-yellow-500"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
          <button
            className="ml-2 px-4 py-2 bg-orange-900 hover:bg-orange-700 transition text-white rounded cursor-pointer active:scale-95 duration-200"
            onClick={() => setFilterPanelOpen(!filterPanelOpen)}
          >
            FILTER
          </button>
          {filterPanelOpen && (
            <div className="absolute top-36 right-82 bg-orange-900 border border-yellow-700 rounded-lg p-2 shadow-lg z-150 w-96">
              <label className={getFilterLabelStyle("dateCreated")}>
                <input
                  type="radio"
                  name="filter"
                  value="dateCreated"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Date Created</span>
              </label>
              <label className={getFilterLabelStyle("name")}>
                <input
                  type="radio"
                  name="filter"
                  value="name"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Name</span>
              </label>
              <label className={getFilterLabelStyle("class")}>
                <input
                  type="radio"
                  name="filter"
                  value="class"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Class</span>
              </label>
              <label className={getFilterLabelStyle("race")}>
                <input
                  type="radio"
                  name="filter"
                  value="race"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Race</span>
              </label>
              <label className={getFilterLabelStyle("level")}>
                <input
                  type="radio"
                  name="filter"
                  value="level"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Level</span>
              </label>
            </div>
          )}
          <NavLink
            to="/create-character"
            className="ml-2 px-4 py-2 bg-orange-900 hover:bg-orange-700 transition text-white rounded cursor-pointer active:scale-95 duration-200"
          >
            <p className="font-bold">CREATE NEW</p>
          </NavLink>
        </div>
      </div>
      <hr className="border-yellow-500" />

      {/* Lower Section */}
      <div className="grid grid-cols-5 gap-6">
        {filteredCharacters.map((character) => (
          <div
            key={character.id}
            onClick={() => navigate("/preview/character")}
            className="group relative flex flex-col gap-y-3 h-96 p-4 border bg-gradient-to-br from-orange-900/60 to-orange-900/30 border-yellow-600 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:border-yellow-500 transition duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1"
          >
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
              <NavLink
                className="p-2.5 border border-yellow-500 bg-orange-800 rounded-lg hover:bg-orange-700 transition duration-200 cursor-pointer active:scale-90 shadow-lg"
                to="/edit-specific-character"
                onClick={(e) => {
                  e.stopPropagation();
                }}
              >
                <Settings className="w-5 h-5 text-yellow-400" />
              </NavLink>
              <button
                className="p-2.5 border border-yellow-500 bg-red-700 rounded-lg hover:bg-red-600 transition duration-200 cursor-pointer active:scale-90 shadow-lg"
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setWantToDelete(true);
                }}
              >
                <Trash className="w-5 h-5 text-red-200" />
              </button>
            </div>

            {/* Character Avatar */}
            <div className="bg-gradient-to-br from-orange-700/70 to-orange-900/50 h-40 rounded-lg flex items-center justify-center border border-yellow-700/50 group-hover:border-yellow-600 transition duration-300">
              <span className="text-7xl drop-shadow-lg group-hover:scale-110 transition duration-300">
                🎲
              </span>
            </div>

            {/* Character Info */}
            <div className="flex flex-col gap-2 flex-1">
              <div className="flex justify-between items-start gap-2">
                <h3 className="text-lg font-bold text-white leading-tight flex-1">
                  {character.name}
                </h3>
                <span className="bg-yellow-500/20 border border-yellow-500 text-yellow-300 text-xs font-bold px-2.5 py-1 rounded-full whitespace-nowrap">
                  Lv.{character.level}
                </span>
              </div>

              <div className="flex flex-col gap-1.5 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-400">Class</span>
                  <span className="text-gray-200 font-semibold">
                    {character.class}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Race</span>
                  <span className="text-gray-200 font-semibold">
                    {character.race}
                  </span>
                </div>
              </div>

              <p className="text-gray-400 text-xs mt-auto">
                {new Date(character.dateCreated).toLocaleDateString()}
              </p>
            </div>

            {/* Campaign Link Button */}
            <NavLink
              to="/connected-campaign"
              className="w-full rounded-lg bg-gradient-to-r from-orange-800 to-orange-700 hover:from-orange-700 hover:to-orange-600 border border-yellow-700 text-yellow-300 hover:text-yellow-200 text-sm font-semibold py-2.5 cursor-pointer transition duration-300 text-center"
              onClick={(e) => e.stopPropagation()}
            >
              View Campaign
            </NavLink>
          </div>
        ))}
      </div>
      {filteredCharacters.length === 0 && (
        <div className="text-center text-gray-400 text-lg py-8">
          No characters found for {selectedFilter}: "{searchQuery}"
        </div>
      )}
      <div>
        {wantToDelete && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center gap-y-4 z-100">
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
