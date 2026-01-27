import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';

export type Campaign = {
  id: string;
  name: string;
  description?: string;
  owner?: { id: string; name: string };
    joinCode?: string;
  createdAt?: string;
  updatedAt?: string;
  locations?: any[];
  characters?: any[];
  // add more fields as needed
};

interface CampaignContextType {
  campaign: Campaign | null;
  loading: boolean;
  error: string | null;
  refresh: () => void;
}

const CampaignContext = createContext<CampaignContextType | undefined>(undefined);

export const useCampaign = () => {
  const context = useContext(CampaignContext);
  if (!context) throw new Error('useCampaign must be used within a CampaignProvider');
  return context;
};

interface CampaignProviderProps {
  campaignId: string;
  children: ReactNode;
}

export const CampaignProvider: React.FC<CampaignProviderProps> = ({ campaignId, children }) => {
  const [campaign, setCampaign] = useState<Campaign | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCampaign = () => {
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
      .then((data) => setCampaign(data))
      .catch((err) => setError(err.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    fetchCampaign();
    // eslint-disable-next-line
  }, [campaignId]);

  return (
    <CampaignContext.Provider value={{ campaign, loading, error, refresh: fetchCampaign }}>
      {children}
    </CampaignContext.Provider>
  );
};
