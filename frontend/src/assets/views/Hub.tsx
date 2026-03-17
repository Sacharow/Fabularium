import Footer from "../components/Footer";
import { NavLink } from "react-router-dom";
import D20 from "../components/ui/D20";

function Hub() {
  return (
    <div className="flex flex-col gap-16">
      {/* Hero Section */}
      <div
        className="h-96 bg-cover bg-center relative"
        style={{
          backgroundImage: `url('/heros/space.jpg')`,
        }}
      >
        {/* Optional overlay for text readability */}
        <div className="absolute inset-0 top-16 flex justify-center">
          <h1 className="text-8xl font-bold text-orange-500 text-shadow-lg text-shadow-orange-950">
            FABULARIUM
          </h1>
        </div>
        <div className="flex justify-center items-center bottom-40 left-200 absolute inset-0">
          <D20 className="w-24 h-24" />
        </div>
        <div className="flex justify-center items-center bottom-40 right-200 absolute inset-0">
          <D20 className="w-24 h-24" />
        </div>
        <div className="absolute inset-0 top-64 flex justify-center gap-16">
          <NavLink to="/sign-in" className={epicButtonStyle}>
            <p className="text-center">SIGN IN</p>
          </NavLink>
          <NavLink to="/sign-up" className={epicButtonStyle}>
            <p className="text-center">SIGN UP</p>
          </NavLink>
        </div>
        <hr className="text-orange-500 border-2 absolute inset-0 top-96" />
      </div>

      {/* Informational Section */}
      <div className="w-full flex justify-center">
        <div className="w-[75%]">
          {/* About Us */}
          <h2 className="text-4xl font-bold text-orange-500 mb-8">ABOUT US</h2>
          <div className="flex flex-col gap-y-16 mb-16">
            {/* About Us Section 1: What is Fabularium */}
            <div className={featureContainerStyle}>
              <div className={featureLeftBoxStyle}>
                <div className="text-6xl mb-4">✨</div>
                <h3 className="text-xl font-bold text-white text-center leading-tight">
                  What is Fabularium
                </h3>
              </div>
              <div className={featureLeftDescriptionStyle}>
                <p className="text-slate-200 leading-relaxed mb-4">
                  <strong>Fabularium</strong> is an application designed to help
                  tabletop RPG enthusiasts collect and organize campaign
                  information effortlessly. Whether you're a player or a game
                  master, our platform provides a centralized hub for managing
                  all your campaign data.
                </p>
              </div>
            </div>
            {/* About Us Section 2: How It Works */}
            <div className={featureContainerStyle}>
              <div className={featureRightDescriptionStyle}>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Register and track detailed information about your worlds,
                  players, their characters, and all other elements of your
                  campaigns. Manage complex campaign data with intuitive tools
                  designed specifically for TTRPG storytelling.
                </p>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>✓ Organize campaign data</li>
                  <li>✓ Track player information</li>
                  <li>✓ Manage characters & worlds</li>
                </ul>
              </div>
              <div className={featureRightBoxStyle}>
                <div className="text-6xl mb-4">🎲</div>
                <h3 className="text-xl font-bold text-white text-center leading-tight">
                  How It Works
                </h3>
              </div>
            </div>
            {/* About Us Section 3: Our Mission */}
            <div className={featureContainerStyle}>
              <div className={featureLeftBoxStyle}>
                <div className="text-6xl mb-4">🚀</div>
                <h3 className="text-xl font-bold text-white text-center leading-tight">
                  Our Mission
                </h3>
              </div>
              <div className={featureLeftDescriptionStyle}>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Enable better storytelling and more immersive gaming
                  experiences by making it easy to browse and update campaign
                  information, track session progress, and gain a complete
                  overview of all your TTRPG activities.
                </p>
              </div>
            </div>
          </div>
          <hr className="border-t border-orange-500 mb-16"></hr>
          {/* Features */}
          <h1 className="text-4xl font-bold text-orange-500 mb-8">FEATURES</h1>
          <div className="flex flex-col gap-y-16">
            {/* Section 1: Campaign Management */}
            <div className={featureContainerStyle}>
              <div className={featureLeftBoxStyle}>
                <div className="text-6xl mb-4">📖</div>
                <h3 className="text-xl font-bold text-white text-center leading-tight">
                  Campaign Management
                </h3>
              </div>
              <div className={featureLeftDescriptionStyle}>
                <p className="text-slate-200 leading-relaxed mb-4">
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
            </div>
            {/* Section 2: Character Creation */}
            <div className={featureContainerStyle}>
              <div className={featureRightDescriptionStyle}>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Build detailed characters with customizable attributes,
                  backgrounds, and abilities. Bring your heroes to life.
                </p>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>✓ Full character sheets</li>
                  <li>✓ Custom attributes</li>
                  <li>✓ Rich backstories</li>
                </ul>
              </div>
              <div className={featureRightBoxStyle}>
                <div className="text-6xl mb-4">⚔️</div>
                <h3 className="text-xl font-bold text-white text-center leading-tight">
                  Character Creation
                </h3>
              </div>
            </div>
            {/* Section 3: World Building */}
            <div className={featureContainerStyle}>
              <div className={featureLeftBoxStyle}>
                <div className="text-6xl mb-4">🌍</div>
                <h3 className="text-xl font-bold text-white text-center leading-tight">
                  World Building
                </h3>
              </div>
              <div className={featureLeftDescriptionStyle}>
                <p className="text-slate-200 leading-relaxed mb-4">
                  Create and organize epic worlds with ease. Design detailed
                  environments, locations, and settings for your campaigns.
                </p>
                <ul className="text-slate-300 space-y-2 text-sm">
                  <li>✓ Interactive maps</li>
                  <li>✓ NPC management</li>
                  <li>✓ Quest tracking</li>
                </ul>
              </div>
            </div>
            <hr className="border-t border-orange-500"></hr>
          </div>
        </div>
      </div>
      {/* Contributors Section */}
      <div className="w-full flex justify-center">
        <div className="w-[75%]">
          <h2 className="text-2xl font-bold text-orange-500 mb-8">Built by</h2>
          <div className="flex justify-center">
            <div className="grid grid-cols-3 gap-6 w-full max-w-2xl">
              {Object.values(authors).map(({ name: author, image, github }) => (
                <NavLink
                  key={author}
                  to={github}
                  className="flex flex-col items-center justify-center p-6 bg-gradient-to-r from-orange-900 to-orange-700 rounded-lg hover:shadow-yellow-300 hover:shadow-lg transition duration-300 cursor-pointer hover:scale-105"
                >
                  <img
                    src={image}
                    alt={author}
                    className="w-20 h-20 rounded-full object-cover mb-3 border-2 border-orange-400"
                  />
                  <p className="text-sm text-slate-200 text-center font-medium">
                    {author}
                  </p>
                </NavLink>
              ))}
            </div>
          </div>
          <p className="text-center text-sm text-orange-400 mt-8">
            <span className="font-bold">Repository:</span>{" "}
            <a
              href="https://github.com/Sacharow/Fabularium"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-orange-300 transition"
            >
              github.com/Sacharow/Fabularium
            </a>
          </p>
        </div>
      </div>
      {/* Footer */}
      <Footer />
    </div>
  );
}

const epicButtonStyle =
  "text-5xl h-16 font-bold text-orange-600 text-shadow-lg text-shadow-orange-950 flex items-center justify-center rounded-lg cursor-pointer transition-all duration-300 hover:text-white";
const featureContainerStyle =
  "grid grid-cols-4 hover:shadow-yellow-300 hover:shadow-xl transition duration-300 rounded-lg min-h-48";
const featureLeftBoxStyle =
  "col-span-1 flex flex-col justify-center items-center p-8 bg-gradient-to-r from-orange-900 to-orange-400 rounded-l-lg";
const featureLeftDescriptionStyle =
  "col-span-3 flex flex-col justify-center items-start p-8 bg-gradient-to-r from-orange-400 to-transparent rounded-r-lg";
const featureRightBoxStyle =
  "col-span-1 flex flex-col justify-center items-center p-8 bg-gradient-to-l from-orange-900 to-orange-400 rounded-r-lg";
const featureRightDescriptionStyle =
  "col-span-3 flex flex-col justify-center items-start p-8 bg-gradient-to-l from-orange-400 to-transparent rounded-l-lg";

const authors = {
  "1": {
    name: "Szymon Lato",
    image: "/authors/SLATO.jpg",
    github: "https://github.com/LatoSzymon",
  },
  "2": {
    name: "Szymon Ligenza",
    image: "/authors/SLIGA.jpg",
    github: "https://github.com/Logenz0202",
  },
  "3": {
    name: "Bartosz Stromski",
    image: "/authors/BSTRO.jpg",
    github: "https://github.com/Sacharow",
  },
};

export default Hub;
