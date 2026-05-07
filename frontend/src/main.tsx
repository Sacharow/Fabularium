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
import CharacterEditStandalone from "./assets/pages/CharacterEditStandalone";

// Info pages
import About from "./assets/views/info/About";
import Contact from "./assets/views/info/Contact";
import Policy from "./assets/views/info/Policy";
import Terms from "./assets/views/info/Terms";

import InCampaignCharacter from "./assets/pages/InCampaign/Sections/Character";
import InCampaignLocation from "./assets/pages/InCampaign/Sections/Location";
import InCampaignMap from "./assets/pages/InCampaign/Sections/Map";
import InCampaignNpc from "./assets/pages/InCampaign/Sections/Npc";
import InCampaignNote from "./assets/pages/InCampaign/Sections/Note";
import InCampaignQuest from "./assets/pages/InCampaign/Sections/Quest";

import MapNew from "./assets/pages/InCampaign/Forms/MapNew";
import MapEdit from "./assets/pages/InCampaign/Forms/MapEdit";
import LocationNew from "./assets/pages/InCampaign/Forms/LocationNew";
import LocationEdit from "./assets/pages/InCampaign/Forms/LocationEdit";
import CharacterNew from "./assets/pages/InCampaign/Forms/CharacterNew";
import NpcNew from "./assets/pages/InCampaign/Forms/NpcNew";
import NpcEdit from "./assets/pages/InCampaign/Forms/NpcEdit";
import NoteNew from "./assets/pages/InCampaign/Forms/NoteNew";
import NoteEdit from "./assets/pages/InCampaign/Forms/NoteEdit";
import QuestNew from "./assets/pages/InCampaign/Forms/QuestNew";
import QuestEdit from "./assets/pages/InCampaign/Forms/QuestEdit";
import GeneralEdit from "./assets/pages/InCampaign/Forms/GeneralEdit";

import CharacterView from "./assets/pages/InCampaign/Views/CharacterView";
import GeneralView from "./assets/pages/InCampaign/Views/GeneralView";
import LocationView from "./assets/pages/InCampaign/Views/LocationView";
import MapView from "./assets/pages/InCampaign/Views/MapView";
import NpcView from "./assets/pages/InCampaign/Views/NpcView";
import NoteView from "./assets/pages/InCampaign/Views/NoteView";
import PlayerView from "./assets/pages/InCampaign/Views/PlayerView";
import QuestView from "./assets/pages/InCampaign/Views/QuestView";
import InCampaignLayout from "./assets/pages/InCampaign/InCampaignLayout";

// General Pages
import Hub from "./assets/views/Hub";
import CharactersNew from "./assets/views/Characters";
import CampaignsNew from "./assets/views/Campaigns";
import ResourcesNew from "./assets/views/Resources";
import ProfileNew from "./assets/views/Profile";

// Auth Pages
import SignIn from "./assets/views/auth/SignIn";
import SignUp from "./assets/views/auth/SignUp";
import ResetPassword from "./assets/views/auth/ResetPassword";

// Preview Pages
import CharacterPreviewNew from "./assets/views/preview/characterPreview";
import CampaignPreviewNew from "./assets/views/preview/campaignPreview";

// Edit Pages
import CharacterEdit from "./assets/views/forms/edit/characterEdit";

// Add Pages
import CharacterAdd from "./assets/views/forms/add/characterAdd";

import Sidebar from "./assets/components/ui/Sidebar";

function AppRoutes() {
  const location = useLocation();
  const hideHeader = location.pathname === "/";

  return (
    <>
      {/*!hideHeader && <Header />} */}
      <Sidebar />
      <Routes>
        <Route path="/hub" element={<Hub />} />
        <Route path="/characters-new" element={<CharactersNew />} />
        <Route path="/campaigns-new" element={<CampaignsNew />} />
        <Route path="/resources-new" element={<ResourcesNew />} />
        <Route path="/profile-new" element={<ProfileNew />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/preview/character" element={<CharacterPreviewNew />} />
        <Route path="/preview/campaign" element={<CampaignPreviewNew />} />

        <Route path="/edit/character" element={<CharacterEdit />} />

        <Route path="/add/character" element={<CharacterAdd />} />

        <Route path="/" element={<Home />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/campaigns/new" element={<CreateCampaign />} />
        <Route path="/characters" element={<Characters />} />
        <Route path="/characters/new" element={<CharacterNewStandalone />} />
        <Route
          path="/characters/:characterId"
          element={<CharacterStandaloneView />}
        />
        <Route
          path="/characters/:characterId/edit"
          element={<CharacterEditStandalone />}
        />
        <Route path="/resources" element={<Resources />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />

        {/* Info Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />

        <Route
          path="/in-campaign/:campaignId/characters/:characterId"
          element={<InCampaignCharacter />}
        />
        <Route
          path="/in-campaign/:campaignId/locations/:locationId"
          element={<InCampaignLocation />}
        />
        <Route
          path="/in-campaign/:campaignId/maps/:mapId"
          element={<InCampaignMap />}
        />
        <Route
          path="/in-campaign/:campaignId/npcs/:npcId"
          element={<InCampaignNpc />}
        />
        <Route
          path="/in-campaign/:campaignId/notes/:noteId"
          element={<InCampaignNote />}
        />
        <Route
          path="/in-campaign/:campaignId/quests/:questId"
          element={<InCampaignQuest />}
        />

        <Route
          path="/in-campaign/:campaignId/map-view/new"
          element={<MapNew />}
        />
        <Route
          path="/in-campaign/:campaignId/maps/:mapId/edit"
          element={<MapEdit />}
        />
        <Route
          path="/in-campaign/:campaignId/location-view/new"
          element={<LocationNew />}
        />
        <Route
          path="/in-campaign/:campaignId/locations/:locationId/edit"
          element={<LocationEdit />}
        />
        <Route
          path="/in-campaign/:campaignId/character-view/new"
          element={<CharacterNew />}
        />
        <Route
          path="/in-campaign/:campaignId/npc-view/new"
          element={<NpcNew />}
        />
        <Route
          path="/in-campaign/:campaignId/npcs/:npcId/edit"
          element={<NpcEdit />}
        />
        <Route
          path="/in-campaign/:campaignId/note-view/new"
          element={<NoteNew />}
        />
        <Route
          path="/in-campaign/:campaignId/notes/:noteId/edit"
          element={<NoteEdit />}
        />
        <Route
          path="/in-campaign/:campaignId/quest-view/new"
          element={<QuestNew />}
        />
        <Route
          path="/in-campaign/:campaignId/quests/:questId/edit"
          element={<QuestEdit />}
        />
        <Route
          path="/in-campaign/:campaignId/general/edit"
          element={<GeneralEdit />}
        />

        <Route path="/in-campaign/:campaignId" element={<InCampaignLayout />}>
          <Route path="character-view" element={<CharacterView />} />
          <Route path="general-view" element={<GeneralView />} />
          <Route path="location-view" element={<LocationView />} />
          <Route path="map-view" element={<MapView />} />
          <Route path="npc-view" element={<NpcView />} />
          <Route path="note-view" element={<NoteView />} />
          <Route path="player-view" element={<PlayerView />} />
          <Route path="quest-view" element={<QuestView />} />
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
