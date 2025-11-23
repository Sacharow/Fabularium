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
      </Routes>
    </BrowserRouter>
  </StrictMode>
);
