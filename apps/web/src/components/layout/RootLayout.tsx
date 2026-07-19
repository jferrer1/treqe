import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

/**
 * Global layout that intercepts clicks on raw <a href="/path"> links
 * inside dangerouslySetInnerHTML content and routes them through
 * React Router's hash navigation instead of triggering a full page
 * navigation (which would 404 on GitHub Pages).
 *
 * Also watches for bottom-nav elements and replaces the Perfil icon
 * with the user's initial avatar when logged in.
 */
export function RootLayout() {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);

  // Global avatar updater for ALL bottom-nav instances
  useEffect(() => {
    const update = () => {
      document.querySelectorAll('.bottom-nav').forEach(nav => {
        const links = nav.querySelectorAll('a.nav-item, a[href*="perfil"]');
        const currentUser = useAuthStore.getState().user;
        links.forEach((link) => {
          const span = link.querySelector('span');
          if (!span) return;
          if (span.textContent?.trim() !== 'Perfil') return;
          const icon = link.querySelector('i.fa-user, i.far, i.fas');
          if (currentUser) {
            const initial = ((currentUser.name || currentUser.email || '?').charAt(0)).toUpperCase();
            const html = `<span style="width:28px;height:28px;border-radius:2px;background:#1C1915;color:#F9F7F2;display:inline-flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:.7rem;font-weight:600;text-transform:uppercase">${initial}</span>`;
            if (icon && !link.querySelector('[style*="border-radius:2px"]')) {
              icon.outerHTML = html;
            }
          }
        });
      });
    };
    // Initial update after DOM is ready
    const t1 = setTimeout(update, 200);
    const t2 = setTimeout(update, 1000);
    // Watch for DOM changes that add new bottom-nav elements
    const obs = new MutationObserver(() => { setTimeout(update, 50); });
    obs.observe(document.body, { childList: true, subtree: true });
    return () => { clearTimeout(t1); clearTimeout(t2); obs.disconnect(); };
  }, []);

  // Re-run when user changes
  useEffect(() => {
    if (!user) return;
    const t = setTimeout(() => {
      document.querySelectorAll('.bottom-nav').forEach(nav => {
        const links = nav.querySelectorAll('a.nav-item, a[href*="perfil"]');
        links.forEach((link) => {
          const span = link.querySelector('span');
          if (!span || span.textContent?.trim() !== 'Perfil') return;
          const icon = link.querySelector('i.fa-user, i.far, i.fas');
          if (icon && !link.querySelector('[style*="border-radius:2px"]')) {
            const initial = ((user.name || user.email || '?').charAt(0)).toUpperCase();
            icon.outerHTML = `<span style="width:28px;height:28px;border-radius:2px;background:#1C1915;color:#F9F7F2;display:inline-flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:.7rem;font-weight:600;text-transform:uppercase">${initial}</span>`;
          }
        });
      });
    }, 300);
    return () => clearTimeout(t);
  }, [user]);

  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const anchor = (e.target as HTMLElement).closest("a");
      if (!anchor) return;
      const href = anchor.getAttribute("href") || "";

      // Skip: empty, external, mailto, tel, anchors, already-hash links
      if (
        !href ||
        href.startsWith("http") ||
        href.startsWith("mailto:") ||
        href.startsWith("tel:") ||
        href.startsWith("#")
      ) return;

      // Internal path starting with "/" → intercept for SPA navigation
      if (href.startsWith("/")) {
        e.preventDefault();
        navigate(href);
      }
    };

    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [navigate]);

  return <Outlet />;
}
