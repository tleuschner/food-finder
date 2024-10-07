import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import PrivacyPolicy from "./PrivacyPolicy";
import "./index.css";
import { Route, RouterProvider, Routes } from "react-router-dom";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider>
      <Routes>
        <Route path="/" element={<App />} />
        <Route path="/datenschutz" element={<PrivacyPolicy />} />
      </Routes>
    </RouterProvider>
  </StrictMode>
);
