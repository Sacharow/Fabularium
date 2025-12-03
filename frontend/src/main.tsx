import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import Header from "./assets/components/Header";
import Home from "./assets/pages/Home";
import Login from "./assets/pages/Login";
import Campaigns from "./assets/pages/Campaigns";
import Characters from "./assets/pages/Characters";
import Resources from "./assets/pages/Resources";
import InCampaignCharacter from "./assets/pages/InCampaign/Sections/Character";

import MapNew from "./assets/pages/InCampaign/Forms/MapNew";
import LocationNew from "./assets/pages/InCampaign/Forms/LocationNew";
import CharacterNew from "./assets/pages/InCampaign/Forms/CharacterNew";
import NpcNew from "./assets/pages/InCampaign/Forms/NpcNew";
import NoteNew from "./assets/pages/InCampaign/Forms/NoteNew";
import QuestNew from "./assets/pages/InCampaign/Forms/QuestNew";

import CharacterView from "./assets/pages/InCampaign/Views/CharacterView";
import GeneralView from "./assets/pages/InCampaign/Views/GeneralView";
import LocationView from "./assets/pages/InCampaign/Views/LocationView";
import MapView from "./assets/pages/InCampaign/Views/MapView";
import NpcView from "./assets/pages/InCampaign/Views/NpcView";
import NoteView from "./assets/pages/InCampaign/Views/NoteView";
import PlayerView from "./assets/pages/InCampaign/Views/PlayerView";
import QuestView from "./assets/pages/InCampaign/Views/QuestView";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/InCampaign/:campaignId/Characters/:characterId" element={<InCampaignCharacter />} />

        <Route path="/InCampaign/:campaignId/MapView/New" element={<MapNew />} />
        <Route path="/InCampaign/:campaignId/LocationView/New" element={<LocationNew />} />
        <Route path="/InCampaign/:campaignId/CharacterView/New" element={<CharacterNew />} />
        <Route path="/InCampaign/:campaignId/NpcView/New" element={<NpcNew />} />
        <Route path="/InCampaign/:campaignId/NoteView/New" element={<NoteNew />} />
        <Route path="/InCampaign/:campaignId/QuestView/New" element={<QuestNew />} />

        <Route path="/InCampaign/:campaignId/CharacterView" element={<CharacterView />} />
        <Route path="/InCampaign/:campaignId/GeneralView" element={<GeneralView />} />
        <Route path="/InCampaign/:campaignId/LocationView" element={<LocationView />} />
        <Route path="/InCampaign/:campaignId/MapView" element={<MapView />} />
        <Route path="/InCampaign/:campaignId/NpcView" element={<NpcView />} />
        <Route path="/InCampaign/:campaignId/NoteView" element={<NoteView />} />
        <Route path="/InCampaign/:campaignId/PlayerView" element={<PlayerView />} />
        <Route path="/InCampaign/:campaignId/QuestView" element={<QuestView />} />
      </Routes>
    </BrowserRouter>
  </StrictMode>
);