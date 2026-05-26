import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

import "./styles/treqe-mib.css";

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
