import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

import Header from "./assets/components/Header";
import Home from "./assets/pages/Home";
import Login from "./assets/pages/Login";
import Register from "./assets/pages/Register";
import Campaigns from "./assets/pages/Campaigns";
import CreateCampaign from "./assets/pages/CreateCampaign";
import Characters from "./assets/pages/Characters";
import CharacterNewStandalone from "./assets/pages/CharacterNewStandalone";
import CharacterStandaloneView from "./assets/pages/CharacterStandaloneView";
import Resources from "./assets/pages/Resources";
import Profile from "./assets/pages/Profile";

import InCampaignCharacter from "./assets/pages/InCampaign/Sections/Character";
import InCampaignLocation from "./assets/pages/InCampaign/Sections/Location";
import InCampaignMap from "./assets/pages/InCampaign/Sections/Map";
import InCampaignNpc from "./assets/pages/InCampaign/Sections/Npc";
import InCampaignNote from "./assets/pages/InCampaign/Sections/Note";
import InCampaignQuest from "./assets/pages/InCampaign/Sections/Quest";

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
import InCampaignLayout from "./assets/pages/InCampaign/InCampaignLayout";

function AppRoutes() {
  const location = useLocation();
  const hideHeader = location.pathname === "/";

  return (
    <>
      {!hideHeader && <Header />}
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/new" element={<CreateCampaign />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/new" element={<CharacterNewStandalone />} />
        <Route path="/characters/:characterId" element={<CharacterStandaloneView />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        <Route
          path="/InCampaign/:campaignId/Characters/:characterId"
          element={<InCampaignCharacter />}
        />
        <Route
          path="/InCampaign/:campaignId/Locations/:locationId"
          element={<InCampaignLocation />}
        />
        <Route
          path="/InCampaign/:campaignId/Maps/:mapId"
          element={<InCampaignMap />}
        />
        <Route
          path="/InCampaign/:campaignId/Npcs/:npcId"
          element={<InCampaignNpc />}
        />
        <Route
          path="/InCampaign/:campaignId/Notes/:noteId"
          element={<InCampaignNote />}
        />
        <Route
          path="/InCampaign/:campaignId/Quests/:questId"
          element={<InCampaignQuest />}
        />

        <Route
          path="/InCampaign/:campaignId/MapView/New"
          element={<MapNew />}
        />
        <Route
          path="/InCampaign/:campaignId/LocationView/New"
          element={<LocationNew />}
        />
        <Route
          path="/InCampaign/:campaignId/CharacterView/New"
          element={<CharacterNew />}
        />
        <Route
          path="/InCampaign/:campaignId/NpcView/New"
          element={<NpcNew />}
        />
        <Route
          path="/InCampaign/:campaignId/NoteView/New"
          element={<NoteNew />}
        />
        <Route
          path="/InCampaign/:campaignId/QuestView/New"
          element={<QuestNew />}
        />

        <Route path="/InCampaign/:campaignId" element={<InCampaignLayout />}>
          <Route path="CharacterView" element={<CharacterView />} />
          <Route path="GeneralView" element={<GeneralView />} />
          <Route path="LocationView" element={<LocationView />} />
          <Route path="MapView" element={<MapView />} />
          <Route path="NpcView" element={<NpcView />} />
          <Route path="NoteView" element={<NoteView />} />
          <Route path="PlayerView" element={<PlayerView />} />
          <Route path="QuestView" element={<QuestView />} />
        </Route>
      </Routes>
    </>
  );
}

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <AppRoutes />
      </BrowserRouter>
    </AuthProvider>
  </StrictMode>,
);
