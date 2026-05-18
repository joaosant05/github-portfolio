import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";
import "./i18n";
import { ThemeProvider } from "./contexts/ThemeContext";
import { preloadVisualAssets } from "./utils/assetPreloader";

preloadVisualAssets();

ReactDOM.createRoot(document.getElementById("root")).render(
  <ThemeProvider>
    <App />
  </ThemeProvider>
);
