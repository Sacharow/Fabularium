import { useNavigate } from "react-router-dom";
import D20 from "../components/ui/D20"
import Footer from "../components/Footer";
import Header from "../components/Header";
import { useAuth } from "../../context/AuthContext";

function Home() {
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      
      {/* Hero Section */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 pt-12">
        <D20 className="w-24 h-24 mb-6" />
        {isAuthenticated && user ? (
          <>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
              Welcome back, {user.name}!
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-12 text-center max-w-2xl">
              Ready to continue your epic adventures? Dive into your campaigns or explore new resources.
            </p>
          </>
        ) : (
          <>
            <h1 className="text-5xl md:text-6xl font-bold text-white mb-4 text-center">
              Welcome to Fabularium
            </h1>
            <p className="text-xl md:text-2xl text-slate-300 mb-6 text-center max-w-2xl">
              Your gateway to epic adventures and legendary tales.
            </p>
            <p className="text-lg text-slate-400 mb-12 text-center max-w-xl">
              <span 
                onClick={() => navigate("/register")}
                className="text-orange-400 hover:text-orange-300 cursor-pointer font-semibold transition-colors"
              >
                Register
              </span>
              {" or "}
              <span 
                onClick={() => navigate("/login")}
                className="text-orange-400 hover:text-orange-300 cursor-pointer font-semibold transition-colors"
              >
                log in
              </span>
              {" to start your journey."}
            </p>
          </>
        )}
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
