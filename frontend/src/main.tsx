import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./App";
import "./stories/pixel-ui.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
