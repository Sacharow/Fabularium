import { useParams, Outlet } from "react-router-dom";
import { CampaignProvider } from "../../../context/CampaignContext";

export default function InCampaignLayout() {
  const params = useParams();
  const campaignId = params.campaignId ?? null;
  if (!campaignId) return <div>No campaign selected.</div>;
  return (
    <CampaignProvider campaignId={campaignId}>
      <Outlet />
    </CampaignProvider>
  );
}
