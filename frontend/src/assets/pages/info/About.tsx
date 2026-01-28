import { useNavigate } from "react-router-dom";
import D20 from "../../components/ui/D20";

function About() {
  const navigate = useNavigate();

  return (
    <div className="flex items-center justify-center py-16 px-4">
      <div className="w-full max-w-4xl">
        {/* Back Button */}
        <button
          onClick={() => navigate(-1)}
          className="text-yellow-300 hover:text-yellow-200 underline mb-6 text-sm"
        >
          ← Back
        </button>

        {/* Header Card */}
        <div className="bg-orange-950/80 border-2 rounded-xl py-10 px-10 border-orange-900 shadow-lg mb-8">
          <div className="flex items-center gap-6 mb-6">
            <D20 className="w-12 h-12 text-yellow-300" />
            <div>
              <h1 className="text-3xl font-bold text-white">About Fabularium</h1>
              <p className="text-sm text-gray-300 mt-2">Your gateway to epic adventures and legendary tales</p>
            </div>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-6 mb-8">
          {/* Who We Are */}
          <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">Who We Are</h2>
            <p className="text-gray-200 mb-3 text-sm">
              Fabularium is a community-driven platform dedicated to bringing D&D campaigns to life.
              We believe every campaign deserves a sophisticated management system that respects the
              complexity and creativity of tabletop gaming.
            </p>
            <p className="text-gray-300 text-sm">
              Built by passionate gamers and developers, Fabularium streamlines campaign creation,
              character management, and world building so you can focus on telling amazing stories.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-bold text-yellow-300 mb-4">Our Mission</h2>
            <p className="text-gray-200 mb-4 text-sm">
              We're on a mission to empower Dungeon Masters and players with tools that enhance
              collaboration, organization, and creativity in tabletop gaming.
            </p>
            <ul className="space-y-2 text-gray-300 text-sm">
              <li>✓ Simplify campaign management</li>
              <li>✓ Foster collaborative storytelling</li>
              <li>✓ Provide intuitive tools for world-building</li>
              <li>✓ Support every type of gaming group</li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-6 shadow-md mb-8">
          <h2 className="text-xl font-bold text-yellow-300 mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-4">
            <div className="bg-orange-900/40 rounded p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Campaign Management</h3>
              <p className="text-gray-300 text-sm">
                Create and manage multiple campaigns with ease. Track all your adventures in one centralized location.
              </p>
            </div>
            <div className="bg-orange-900/40 rounded p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">Character Database</h3>
              <p className="text-gray-300 text-sm">
                Build comprehensive character profiles with stats, backgrounds, and progression tracking.
              </p>
            </div>
            <div className="bg-orange-900/40 rounded p-4">
              <h3 className="text-lg font-semibold text-yellow-300 mb-2">World Building</h3>
              <p className="text-gray-300 text-sm">
                Design immersive worlds with NPCs, locations, maps, quests, and interconnected lore.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-orange-950/60 border border-orange-900 rounded-lg p-6 shadow-md">
          <h2 className="text-xl font-bold text-yellow-300 mb-4">Our Team</h2>
          <p className="text-gray-200 mb-3 text-sm">
            Fabularium was developed by a group of university students as part of a collaborative project.
            We combine our passion for tabletop gaming with modern software development practices.
          </p>
          <p className="text-gray-300 text-xs italic">
            Built with love for the TTRPG community • Developed with TypeScript & React • Powered by Node.js
          </p>
        </div>
      </div>
    </div>
  );
}

export default About;
