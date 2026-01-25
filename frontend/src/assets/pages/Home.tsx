import { useNavigate } from "react-router-dom";
import D20 from "../components/ui/D20"
import Footer from "../components/Footer";

function Home() {
  const navigate = useNavigate();

  return (
    <div className="flex flex-col">
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-4">
        <D20 className="w-24 h-24 mb-6" />
        <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
          Welcome to Fabularium
        </h1>
        <p className="text-xl md:text-2xl text-slate-300 mb-4 text-center max-w-2xl">
          Your gateway to epic adventures and legendary tales.
        </p>

        {/* Action Buttons */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 w-full md:w-auto justify-center mb-12">
          <button
            onClick={() => navigate("/login")}
            className="px-8 py-4 bg-blue-600 hover:bg-blue-700 text-white font-bold text-lg rounded-lg transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Login
          </button>
          <button
            onClick={() => navigate("/register")}
            className="px-8 py-4 bg-green-600 hover:bg-green-700 text-white font-bold text-lg rounded-lg transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Register
          </button>
          <button
            onClick={() => navigate("/resources")}
            className="mx-8 col-span-2 px-8 py-4 bg-orange-600 hover:bg-orange-700 text-white font-bold text-lg rounded-lg transition duration-300 transform hover:scale-105 shadow-lg cursor-pointer"
          >
            Resources
          </button>
        </div>
      </div>

      {/* Information Blocks Section */}
      <div className="px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid md:grid-cols-3 gap-8">
            {/* Block 1: Campaign Management */}
            <div className="bg-gradient-to-br from-orange-900 to-orange-400 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-4xl">📖</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Campaign Management
              </h3>
              <p className="text-slate-200 mb-4">
                Create and organize epic campaigns with ease. Manage multiple
                storylines, campaigns, and adventures in one intuitive
                interface.
              </p>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>✓ Create unlimited campaigns</li>
                <li>✓ Organize by themes</li>
                <li>✓ Collaborative storytelling</li>
              </ul>
            </div>

            {/* Block 2: Character Creation */}
            <div className="bg-gradient-to-br from-orange-900 to-orange-400 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-4xl">⚔️</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Character Creation
              </h3>
              <p className="text-slate-200 mb-4">
                Build detailed characters with customizable attributes,
                backgrounds, and abilities. Bring your heroes to life.
              </p>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>✓ Full character sheets</li>
                <li>✓ Custom attributes</li>
                <li>✓ Rich backstories</li>
              </ul>
            </div>

            {/* Block 3: World Building */}
            <div className="bg-gradient-to-br from-orange-900 to-orange-400 rounded-lg p-8 shadow-lg hover:shadow-xl transition duration-300">
              <div className="mb-4 text-4xl">🌍</div>
              <h3 className="text-2xl font-bold text-white mb-4">
                World Building
              </h3>
              <p className="text-slate-200 mb-4">
                Design immersive worlds with maps, NPCs, locations, and quests.
                Create the setting for unforgettable stories.
              </p>
              <ul className="text-slate-300 space-y-2 text-sm">
                <li>✓ Interactive maps</li>
                <li>✓ NPC management</li>
                <li>✓ Quest tracking</li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <Footer />
    </div>
  );
}

export default Home;
