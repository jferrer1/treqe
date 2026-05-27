import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function ProductDetailPage() {
  const { id: _id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("/mib/v2-detalle.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let style = sm ? `<style>${sm[1]}</style>` : "";
      let body = bm ? bm[1] : "";
      // Clean scripts and handlers
      body = body.replace(/<script[\s\S]*?<\/script>/g, "");
      body = body.replace(/\s+on\w+="[^"]*"/g, "");
      // Replace fake links with React navigation
      body = body.replace(/href="\.\.\/v16-portada\/"/g, 'href="/"');
      body = body.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      setHtml(style + body);
    });
  }, []);

  // Override click handlers for navigation
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      if (href.startsWith("/")) { e.preventDefault(); navigate(href); return; }
      if (href.includes("../v")) { e.preventDefault(); return; }
    };
    document.addEventListener("click", handler);
    return () => document.removeEventListener("click", handler);
  }, [navigate]);

  // Redirect unauthenticated users
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (user) return;
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const text = btn.textContent || "";
      if (text.includes("COMPRAR") || text.includes("INTERCAMBIO") || text.includes("Quiero")) {
        e.preventDefault();
        e.stopPropagation();
        navigate("/login");
      }
    };
    document.addEventListener("click", handler, true);
    return () => document.removeEventListener("click", handler, true);
  }, [user, navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
