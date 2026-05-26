import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function UploadPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [html, setHtml] = useState("");

  // Redirect if not logged in
  useEffect(() => {
    if (user === null) return; // Still loading auth
    if (!user) navigate("/registro", { replace: true });
  }, [user, navigate]);

  useEffect(() => {
    if (!user) return;
    fetch("/mib/v3-subir.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let style = sm ? `<style>${sm[1]}</style>` : "";
      let body = bm ? bm[1] : "";
      body = body.replace(/<script[\s\S]*?<\/script>/g, "");
      body = body.replace(/\s+on\w+="[^"]*"/g, "");
      body = body.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      body = body.replace(/href="\.\.\/v[^"]*\/index\.html"/g, 'href="#"');
      setHtml(style + body);
    });
  }, [user]);

  // Intercept clicks for React Router navigation
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const routeMap: Record<string,string> = {
        "../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v4-perfil/":"/perfil",
        "../v12-mis-matches/":"/treqes","../v11-notificaciones/":"/avisos",
        "../v3-subir/":"/subir",
      };
      for (const [old, path] of Object.entries(routeMap)) {
        if (href.startsWith(old)) { e.preventDefault(); navigate(path); return; }
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [navigate]);

  if (!user || !html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
