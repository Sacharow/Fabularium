import { useNavigate, NavLink } from "react-router-dom";
import { useState } from "react";

export default function CreateCampaign() {
    const navigate = useNavigate();

    // Basic info
    const [name, setName] = useState<string>("");
    const [description, setDescription] = useState<string>("");

    // Sidebar tab selection
    const [selectedView, setSelectedView] = useState<string>('all');

    const saveCampaign = async () => {
        if (name.trim() === "") {
            alert("Campaign name cannot be empty.");
            return;
        }

        try {
            const response = await fetch("http://localhost:3000/api/campaigns", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify({ name, description })
            });
            if (!response.ok) throw new Error("Failed to create campaign");
            navigate('/campaigns');
        } catch (e) {
            console.error('Failed to save campaign', e);
        }
    };

    const inputClass = `bg-black/80 w-full rounded-md px-3 py-2 text-white border border-orange-700/50 focus:border-orange-500 focus:outline-none`;
    const labelClass = `text-gray-400 py-2 font-medium`;
    const sectionClass = `bg-orange-950/40 p-6 rounded-lg border border-orange-800/50`;

    return (
        <div className="pt-6">
            <div className="w-full">
                <div className="grid grid-cols-8">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <p className="text-gray-500 text-sm">
                                <NavLink to="/campaigns" className="cursor-pointer hover:text-gray-400">
                                    Campaigns
                                </NavLink>
                                <span> / </span>
                                <NavLink to="#" className="cursor-pointer hover:text-gray-400">
                                    New
                                </NavLink>
                            </p>
                        </div>
                        <div className="flex justify-between items-center">
                            <h1 className="text-4xl font-bold mb-6">Create New Campaign</h1>
                            <button
                                className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer transition-colors"
                                onClick={saveCampaign}
                            >
                                Save Campaign
                            </button>
                        </div>
                    </div>
                    <div className="col-span-2"></div>
                </div>

                <div className="grid grid-cols-8 gap-6">
                    {/* Sidebar Navigation */}
                    <div className="relative col-span-2">
                        <div className="sticky top-24 px-4">
                            <nav>
                                <ul className="space-y-2">
                                    <li>
                                        <button
                                            onClick={() => setSelectedView('all')}
                                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                                selectedView === 'all'
                                                    ? 'bg-orange-700 text-white'
                                                    : 'text-orange-300 hover:bg-orange-800'
                                            }`}
                                        >
                                            All
                                        </button>
                                    </li>
                                    <li>
                                        <button
                                            onClick={() => setSelectedView('basic')}
                                            className={`w-full text-left px-3 py-2 rounded transition-colors ${
                                                selectedView === 'basic'
                                                    ? 'bg-orange-700 text-white'
                                                    : 'text-orange-300 hover:bg-orange-800'
                                            }`}
                                        >
                                            Basic Info
                                        </button>
                                    </li>
                                </ul>
                            </nav>
                        </div>
                    </div>

                    {/* Main Content */}
                    <div className="col-span-4 space-y-6">
                        {/* Basic Info Section */}
                        {(selectedView === 'all' || selectedView === 'basic') && (
                            <div className={sectionClass}>
                                <h2 className="text-2xl font-bold mb-4 text-orange-300">Basic Information</h2>
                                <div className="space-y-4">
                                    <div>
                                        <label className={labelClass}>Campaign Name *</label>
                                        <input
                                            type="text"
                                            className={inputClass}
                                            value={name}
                                            onChange={(e) => setName(e.target.value)}
                                            placeholder="Enter campaign name..."
                                        />
                                    </div>
                                    <div>
                                        <label className={labelClass}>Description</label>
                                        <textarea
                                            className={`${inputClass} min-h-[120px] resize-y`}
                                            value={description}
                                            onChange={(e) => setDescription(e.target.value)}
                                            placeholder="Describe your campaign world, story, and themes..."
                                        />
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="col-span-2"></div>
                </div>
            </div>
        </div>
    );
}
