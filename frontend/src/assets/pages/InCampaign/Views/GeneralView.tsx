import ViewIntroduction from "../../../components/helper/ViewIntroduction";
import { NavLink, useParams, useMatch } from "react-router-dom";
import { useEffect, useState } from "react";

export default function GeneralView() {
    const params = useParams();
    const match = useMatch("/InCampaign/:campaignId/*");
    const campaignId = params.campaignId ?? match?.params.campaignId ?? null

    type Campaign = {
        id: string;
        name: string;
        description?: string;
        owner?: { id: string; name: string };
        createdAt?: string;
        updatedAt?: string;
    };

    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        if (!campaignId) return;
        setLoading(true);
        setError(null);
        fetch(`http://localhost:3000/api/campaigns/${campaignId}`, {
            credentials: 'include',
        })
            .then(async (res) => {
                if (!res.ok) throw new Error('Failed to fetch campaign');
                return res.json();
            })
            .then((data) => {
                setCampaign(data);
            })
            .catch((err) => setError(err.message))
            .finally(() => setLoading(false));
    }, [campaignId]);


    const introData = {
        currentSection: "General Section",
        urlName: "GeneralView"
    };

    if (loading) return <div className="pt-6 text-center">Loading campaign...</div>;
    if (error) return <div className="pt-6 text-center text-red-600">{error}</div>;

    return (
        <div className="pt-6">
            <ViewIntroduction campaignData={{
                id: campaign?.id || campaignId || '',
                name: campaign?.name || 'Campaign',
                dm: campaign?.owner?.name || 'DM',
            }} introData={introData} />
            <div className="w-full">
                <div className="grid grid-cols-8 gap-6">
                    <div className="col-span-2"></div>
                    <div className="col-span-4">
                        <div className="pb-4">
                            <div className="flex justify-between items-center">
                                <h1 className="text-3xl font-bold">{introData.currentSection}</h1>
                                <NavLink to={campaignId ? `/InCampaign/${campaignId}/${introData.urlName}/New` : '#'}>
                                    <button className="bg-orange-900 hover:bg-orange-700 text-white font-bold py-2 px-4 rounded cursor-pointer">
                                        <p>Edit</p>
                                    </button>
                                </NavLink>
                            </div>
                        </div>
                        <div className="pt-6 px-6">
                            <div className="max-w-[1200px] mx-auto">
                                <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
                                    <div>
                                        {campaign && (
                                            <>
                                                <div className="mb-2"><span className="font-bold">Name:</span> {campaign.name}</div>
                                                <div className="mb-2"><span className="font-bold">Description:</span> {campaign.description}</div>
                                                <div className="mb-2"><span className="font-bold">Dungeon Master:</span> {campaign.owner?.name}</div>
                                                <div className="mb-2"><span className="font-bold">Created:</span> {campaign.createdAt ? new Date(campaign.createdAt).toLocaleString() : ''}</div>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}