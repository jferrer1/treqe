import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

export function UploadPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [html, setHtml] = useState("");

  useEffect(() => {
    fetch("/mib/v3-subir.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      // Hide preview overlay initially (MIB shows it via JS)
      b = b.replace(/class="([^"]*preview[^"]*)"/g, 'class="$1" style="display:none"');
      setHtml(s + b);
    });
  }, []);

  // Show preview when "Vista previa" clicked, submit redirects to register if not logged in
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const btn = (e.target as HTMLElement).closest("button");
      if (!btn) return;
      const t = btn.textContent || "";
      if ((t.includes("Vista") || t.includes("vista")) && !user) {
        e.preventDefault(); e.stopPropagation(); navigate("/registro"); return;
      }
      if ((t.includes("Publicar") || t.includes("publicar")) && !user) {
        e.preventDefault(); e.stopPropagation(); navigate("/registro"); return;
      }
    };
    document.addEventListener("click", h, true);
    return () => document.removeEventListener("click", h, true);
  }, [user, navigate]);

  // Navigation clicks
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      const map: Record<string,string> = {
        "../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v4-perfil/":"/perfil",
        "../v12-mis-matches/":"/treqes","../v11-notificaciones/":"/avisos","../v3-subir/":"/subir",
      };
      for (const [old,path] of Object.entries(map)) {
        if (href.startsWith(old)) { e.preventDefault(); navigate(path); return; }
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
