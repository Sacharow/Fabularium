import { useNavigate } from "react-router-dom";
import D20 from "../../components/ui/D20";

function About() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen flex flex-col bg-gray-900 text-gray-100">
      {/* Back Button */}
      <div className="pt-6 px-6 max-w-6xl mx-auto w-full">
        <button
          onClick={() => navigate(-1)}
          className="text-orange-600 hover:text-orange-500 underline mb-6"
        >
          ← Back
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 max-w-6xl mx-auto w-full px-6 py-8">
        {/* Header */}
        <div className="flex items-center gap-6 mb-12">
          <D20 className="w-16 h-16 text-orange-600" />
          <div>
            <h1 className="text-4xl font-bold text-white mb-2">About Fabularium</h1>
            <p className="text-xl text-gray-300">Your gateway to epic adventures and legendary tales</p>
          </div>
        </div>

        {/* Content Sections */}
        <div className="grid md:grid-cols-2 gap-8 mb-12">
          {/* Who We Are */}
          <div className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Who We Are</h2>
            <p className="text-gray-300 mb-4">
              Fabularium is a community-driven platform dedicated to bringing D&D campaigns to life.
              We believe every campaign deserves a sophisticated management system that respects the
              complexity and creativity of tabletop gaming.
            </p>
            <p className="text-gray-300">
              Built by passionate gamers and developers, Fabularium streamlines campaign creation,
              character management, and world building so you can focus on telling amazing stories.
            </p>
          </div>

          {/* Our Mission */}
          <div className="bg-gray-800 rounded-lg p-6 border border-orange-700/30">
            <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Mission</h2>
            <p className="text-gray-300 mb-4">
              We're on a mission to empower Dungeon Masters and players with tools that enhance
              collaboration, organization, and creativity in tabletop gaming.
            </p>
            <ul className="space-y-2 text-gray-300">
              <li>✓ Simplify campaign management</li>
              <li>✓ Foster collaborative storytelling</li>
              <li>✓ Provide intuitive tools for world-building</li>
              <li>✓ Support every type of gaming group</li>
            </ul>
          </div>
        </div>

        {/* Features Section */}
        <div className="bg-gray-800 rounded-lg p-6 border border-orange-700/30 mb-12">
          <h2 className="text-2xl font-bold text-orange-600 mb-6">What We Offer</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Campaign Management</h3>
              <p className="text-gray-300 text-sm">
                Create and manage multiple campaigns with ease. Track all your adventures in one centralized location.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">Character Database</h3>
              <p className="text-gray-300 text-sm">
                Build comprehensive character profiles with stats, backgrounds, and progression tracking.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white mb-3">World Building</h3>
              <p className="text-gray-300 text-sm">
                Design immersive worlds with NPCs, locations, maps, quests, and interconnected lore.
              </p>
            </div>
          </div>
        </div>

        {/* Team Section */}
        <div className="bg-orange-900/20 rounded-lg p-6 border border-orange-700/30">
          <h2 className="text-2xl font-bold text-orange-600 mb-4">Our Team</h2>
          <p className="text-gray-300 mb-4">
            Fabularium was developed by a group of university students as part of a collaborative project.
            We combine our passion for tabletop gaming with modern software development practices.
          </p>
          <p className="text-gray-300 text-sm italic">
            Built with love for the TTRPG community • Developed with TypeScript & React • Powered by Node.js
          </p>
        </div>
      </div>

      {/* Footer Spacing */}
      <div className="py-8"></div>
    </div>
  );
}

export default About;
