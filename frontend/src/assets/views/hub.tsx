import Footer from "../components/Footer";

function Hub() {
    return (
        <div className="flex flex-col gap-16">
            {/* Hero Section */}
            <div 
                className="h-192 bg-cover bg-center relative"
                style={{
                    backgroundImage: `url('/space.jpg')`
                }}
            >
                {/* Optional overlay for text readability */}
                <div className="absolute inset-0 top-32 flex justify-center">
                    <h1 className="text-8xl font-bold text-orange-500 text-shadow-lg text-shadow-orange-950">FABULARIUM</h1>
                </div>
                <div className="absolute inset-0 top-80 flex justify-center gap-32">
                    <button className="epic-button">
                        <p className="text-center">SIGN IN</p>
                    </button>
                    <button className="epic-button">
                        <p className="text-center">SIGN UP</p>
                    </button>
                </div>
            </div>

            {/* Informational Section */}
            <div className="w-full flex justify-center">
                <div className="w-[75%] grid grid-cols-4 gap-y-8">
                    {/* Section 1: Campaign Management */}
                    <div className="col-span-1 flex justify-center items-center p-32 bg-gradient-to-br from-orange-900 to-orange-400 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                        <div className="text-4xl text-center">📖</div>
                        <h3 className="text-2xl font-bold text-white text-center">
                            Campaign Management
                        </h3>
                    </div>
                    <div className="col-span-3 flex flex-col justify-center items-center p-8">
                        <p className="text-slate-200">
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
                    {/* Section 2: Character Creation */}
                    <div className="col-span-3 flex flex-col justify-center items-center p-8">
                        <p className="text-slate-200">
                            Build detailed characters with customizable attributes,
                            backgrounds, and abilities. Bring your heroes to life.
                        </p>
                        <ul className="text-slate-300 space-y-2 text-sm">
                            <li>✓ Full character sheets</li>
                            <li>✓ Custom attributes</li>
                            <li>✓ Rich backstories</li>
                        </ul>
                    </div>
                    <div className="col-span-1 flex justify-center items-center p-8 bg-gradient-to-br from-orange-900 to-orange-400 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                        <div className="text-4xl text-center">⚔️</div>
                        <h3 className="text-2xl font-bold text-white text-center">
                            Character Creation
                        </h3>
                    </div>

                    {/* Section 3: World Building */}
                    <div className="col-span-1 flex justify-center items-center p-8 bg-gradient-to-br from-orange-900 to-orange-400 rounded-lg shadow-lg hover:shadow-xl transition duration-300">
                        <div className="text-4xl text-center">🌍</div>
                        <h3 className="text-2xl font-bold text-white text-center">
                            World Building
                        </h3>
                    </div>
                    <div className="col-span-3 flex flex-col justify-center items-center p-8    ">
                        <p className="text-slate-200">
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
            </div>
            {/* Footer */}
            <Footer />
        </div>
    )
}

export default Hub;