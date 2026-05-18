import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import "./index.css";

// General Pages
import Hub from "./assets/views/Hub";
import Characters from "./assets/views/Characters";
import Campaigns from "./assets/views/Campaigns";
import Resources from "./assets/views/Resources";
import Profile from "./assets/views/Profile";

// Info pages
import About from "./assets/views/info/About";
import Contact from "./assets/views/info/Contact";
import Policy from "./assets/views/info/Policy";
import Terms from "./assets/views/info/Terms";

// Auth Pages
import SignIn from "./assets/views/auth/SignIn";
import SignUp from "./assets/views/auth/SignUp";
import ResetPassword from "./assets/views/auth/ResetPassword";

// Preview Pages
import CharacterPreviewNew from "./assets/views/preview/characterPreview";
import CampaignPreviewNew from "./assets/views/preview/campaignPreview";

import Sidebar from "./assets/components/ui/Sidebar";

function AppRoutes() {
  return (
    <>
      <Sidebar />
      <Routes>
        <Route path="/characters" element={<Characters />} />
        <Route path="/campaigns" element={<Campaigns />} />
        <Route path="/resources" element={<Resources />} />
        <Route path="/profile" element={<Profile />} />

        <Route path="/sign-in" element={<SignIn />} />
        <Route path="/sign-up" element={<SignUp />} />
        <Route path="/reset-password" element={<ResetPassword />} />

        <Route path="/character/:id" element={<CharacterPreviewNew />} />
        <Route path="/preview/character" element={<CharacterPreviewNew />} />
        <Route path="/preview/campaign/:id" element={<CampaignPreviewNew />} />
        <Route path="/preview/campaign" element={<CampaignPreviewNew />} />

        <Route path="/" element={<Hub />} />
        {/* Info Pages */}
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/privacy" element={<Policy />} />
        <Route path="/terms" element={<Terms />} />
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
