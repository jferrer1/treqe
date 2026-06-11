import { useEffect } from "react";
import { Outlet, useNavigate } from "react-router-dom";

/**
 * Global layout that intercepts clicks on raw <a href="/path"> links
 * inside dangerouslySetInnerHTML content and routes them through
 * React Router's hash navigation instead of triggering a full page
 * navigation (which would 404 on GitHub Pages).
 */
export function RootLayout() {
  const navigate = useNavigate();

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
