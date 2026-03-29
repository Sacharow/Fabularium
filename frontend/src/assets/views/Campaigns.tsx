import { Search, Settings, Trash } from "lucide-react";
import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

const CampaignsNew = () => {
  const navigate = useNavigate();
  const [wantToDelete, setWantToDelete] = useState(false);
  const [filterPanelOpen, setFilterPanelOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("dateCreated");
  const [searchQuery, setSearchQuery] = useState("");

  // Mock campaign data
  const mockCampaigns = [
    {
      id: 1,
      title: "Lost Mines of Phandalin",
      author: "Dungeon Master Smith",
      dateCreated: "2024-01-15",
      description: "A classic adventure in the world of Dungeons & Dragons.",
      color: "bg-blue-600",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
    },
    {
      id: 2,
      title: "Dragon's Hoard",
      author: "Wizard Johnson",
      dateCreated: "2024-02-10",
      description:
        "An epic journey through mountains and valleys to find a dragon's treasure.",
      color: "bg-red-600",
      image: "",
    },
    {
      id: 3,
      title: "Curse of Strahd",
      author: "Shadow DM",
      dateCreated: "2024-01-20",
      description:
        "Dark and gothic tale of a vampire lord's domain and the heroes who challenge him.",
      color: "bg-purple-600",
      image:
        "https://images.unsplash.com/photo-1559827260-dc66d52bef19?w=500&h=300&fit=crop",
    },
    {
      id: 4,
      title: "Waterdeep Intrigue",
      author: "City Master",
      dateCreated: "2023-12-05",
      description:
        "Political intrigue and mystery in the greatest city of the Sword Coast.",
      color: "bg-cyan-600",
      image: "",
    },
    {
      id: 5,
      title: "Tomb of Horrors",
      author: "Trap Master",
      dateCreated: "2024-03-01",
      description:
        "A deadly dungeon filled with traps and treasures beyond imagination.",
      color: "bg-yellow-600",
      image:
        "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500&h=300&fit=crop",
    },
    {
      id: 6,
      title: "Hoard of the Dragon Queen",
      author: "Epic DM",
      dateCreated: "2024-02-20",
      description:
        "Follow a dragon cult's plans to summon a dragon and save the realm.",
      color: "bg-orange-600",
      image: "",
    },
    {
      id: 7,
      title: "Princes of the Apocalypse",
      author: "Chaos Master",
      dateCreated: "2023-11-30",
      description:
        "Elemental princes threaten the world as ancient temples awaken.",
      color: "bg-green-600",
      image:
        "https://images.unsplash.com/photo-1614027164847-1b28cfe1df60?w=500&h=300&fit=crop",
    },
    {
      id: 8,
      title: "Out of the Abyss",
      author: "Demon Lord DM",
      dateCreated: "2024-01-25",
      description:
        "Escape from the Abyss and stop a demon lord's invasion of the material plane.",
      color: "bg-indigo-600",
      image: "",
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

  const filteredCampaigns = mockCampaigns
    .filter((campaign) => {
      const searchLower = searchQuery.toLowerCase();
      const campaignTitle = campaign.title.toLowerCase();
      return campaignTitle.includes(searchLower);
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
        <h1 className="text-3xl font-bold">CAMPAIGNS</h1>
        <div className="flex justify-center items-center">
          <div className="border border-yellow-700 flex justify-center items-center p-2 rounded-lg bg-orange-900/50 hover:bg-orange-700/50 transition duration-200">
            <Search className="w-8" />
            <input
              type="text"
              placeholder="Search campaigns..."
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
              <label className={getFilterLabelStyle("title")}>
                <input
                  type="radio"
                  name="filter"
                  value="title"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Title</span>
              </label>
              <label className={getFilterLabelStyle("author")}>
                <input
                  type="radio"
                  name="filter"
                  value="author"
                  className={customRadioStyle}
                  onChange={(e) => setSelectedFilter(e.target.value)}
                  onClick={() => setFilterPanelOpen(false)}
                />
                <span className="ml-3">Author</span>
              </label>
            </div>
          )}
          <NavLink
            to="/create-campaign"
            className="ml-2 px-4 py-2 bg-orange-900 hover:bg-orange-700 transition text-white rounded cursor-pointer active:scale-95 duration-200"
          >
            <p className="font-bold">CREATE NEW</p>
          </NavLink>
        </div>
      </div>
      <hr className="border-yellow-500" />

      {/* Lower Section */}
      <div className="grid grid-cols-4 gap-6">
        {filteredCampaigns.map((campaign) => (
          <div
            key={campaign.id}
            onClick={() => navigate("/preview/campaign")}
            className="group relative flex flex-col gap-y-3 h-96 p-4 border bg-gradient-to-br from-orange-900/60 to-orange-900/30 border-yellow-600 rounded-xl shadow-lg hover:shadow-2xl hover:shadow-orange-500/50 hover:border-yellow-500 transition duration-300 cursor-pointer transform hover:scale-105 hover:-translate-y-1 overflow-hidden"
          >
            {/* Action Buttons */}
            <div className="absolute top-3 right-3 z-50 flex gap-2 opacity-0 group-hover:opacity-100 transition duration-200">
              <NavLink
                className="p-2.5 border border-yellow-500 bg-orange-800 rounded-lg hover:bg-orange-700 transition duration-200 cursor-pointer active:scale-90 shadow-lg"
                to="/edit-specific-campaign"
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

            {/* Campaign Image/Placeholder */}
            <div className="relative h-64 rounded-lg overflow-hidden border border-yellow-700/50 group-hover:border-yellow-600 transition duration-300">
              {campaign.image ? (
                <>
                  <img
                    src={campaign.image}
                    alt={campaign.title}
                    className="h-full w-full object-cover group-hover:scale-110 transition duration-500"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                </>
              ) : (
                <div
                  className={`h-full rounded-lg flex items-center justify-center bg-gradient-to-br ${campaign.color} relative overflow-hidden`}
                >
                  <div className="absolute inset-0 opacity-10 group-hover:opacity-20 transition duration-300"></div>
                  <span className="text-5xl drop-shadow-lg group-hover:scale-110 transition duration-300">
                    📜
                  </span>
                </div>
              )}
            </div>

            {/* Campaign Content */}
            <div className="flex flex-col gap-3 flex-1">
              {/* Title */}
              <h3 className="text-lg font-bold text-white leading-tight line-clamp-2">
                {campaign.title}
              </h3>

              {/* Author */}
              <div className="flex items-center gap-2">
                <span className="text-gray-400 text-xs">Dungeon Master</span>
                <span className="text-gray-300 font-semibold text-sm truncate">
                  {campaign.author}
                </span>
              </div>

              {/* Description */}
              <p className="text-gray-300 text-sm line-clamp-3 flex-1">
                {campaign.description}
              </p>

              {/* Separator */}
              <hr className="border-yellow-600/30" />

              {/* Date Created */}
              <p className="text-gray-400 text-xs">
                Created: {new Date(campaign.dateCreated).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
      {filteredCampaigns.length === 0 && (
        <div className="text-center text-gray-400 text-lg py-8">
          No campaigns found for {selectedFilter}: "{searchQuery}"
        </div>
      )}
      <div>
        {wantToDelete && (
          <div className="fixed inset-0 bg-black/50 flex flex-col items-center justify-center gap-y-4 z-100">
            <h2 className="text-2xl font-bold text-white">
              Are you sure you want to delete this campaign?
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

export default CampaignsNew;
