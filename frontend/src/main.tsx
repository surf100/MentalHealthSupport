import React from "react";
import ReactDOM from "react-dom/client";
import { RouterProvider } from "react-router";
import { router } from "./app/routes";
import { AuthProvider } from "./app/auth/auth-context";
import { initializeThemePreference } from "./app/lib/theme";
import "./styles/index.css";

initializeThemePreference();

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <AuthProvider>
      <RouterProvider router={router} />
    </AuthProvider>
  </React.StrictMode>
);
