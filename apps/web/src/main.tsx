import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { App } from "./app/App";

// Hide notification badge by default (shown only when unread)
const style = document.createElement("style");
style.textContent = ".nav-badge{display:none!important}";
document.head.appendChild(style);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>,
);
