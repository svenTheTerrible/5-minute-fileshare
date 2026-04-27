import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { CssBaseline, GlobalStyles } from "@mui/material";
import { App } from "./App";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <CssBaseline />
    <GlobalStyles styles={{ body: { overflowX: "hidden" } }} />
    <App />
  </StrictMode>,
);
