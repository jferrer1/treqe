import { createRoot } from "react-dom/client";
import { App } from "./app/App";
import "./styles/treqe-mib.css";

// Hide notification badge by default, then poll to show unread count
const badgeStyle = document.createElement("style");
badgeStyle.textContent = ".nav-badge{display:none}";
document.head.appendChild(badgeStyle);

// Global notification badge poller (red dot only, MIB-style)
const pollBadge = () => {
  const token = localStorage.getItem("treqe-token");
  if (!token) return;
  fetch("/api/notifications/", { headers: { Authorization: `Bearer ${token}` } })
    .then(r => r.json())
    .then(data => {
      const items = data.items || data || [];
      const unread = items.filter((n: any) => !n.read).length;
      document.querySelectorAll(".nav-badge").forEach((badge: any) => {
        if (unread > 0) {
          badge.style.setProperty("display","block","important");
          badge.textContent = ""; // Just the dot, no number
        } else {
          badge.style.setProperty("display","none","important");
          badge.textContent = "";
        }
      });
    }).catch(() => {});
};
setInterval(pollBadge, 15000);
setTimeout(pollBadge, 2000); // initial check after login

createRoot(document.getElementById("root")!).render(<App />);
