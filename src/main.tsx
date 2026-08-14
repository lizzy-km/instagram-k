import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "@/lib/query/client";
import { useThemeStore, applyThemePreference } from "@/stores/useThemeStore";

applyThemePreference(useThemeStore.getState().preference);

const rootElement = document.getElementById("root");
if (!rootElement) {
  throw new Error("Root element #root not found");
}

ReactDOM.createRoot(rootElement).render(
  <React.StrictMode>
    <SpeedInsights />
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
);
