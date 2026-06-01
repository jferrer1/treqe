import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";
import { rewriteMibLinks } from "@/lib/mibLinks";
import { api } from "@/lib/api";

export function UploadPage() {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const [html, setHtml] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/mib/v3-subir.html").then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = rewriteMibLinks(b);
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      // Back button
      b = b.replace('class="treqe-header__back" aria-label=', 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      b = rewriteMibLinks(b);
      // Hide preview initially
      b = b.replace(/class="([^"]*preview[^"]*)"/g, 'class="$1" style="display:none"');
      setHtml(s + b);
    });
  }, []);

  useEffect(() => {
    if (!html) return;
    const t = setTimeout(() => {
      // Intercept "Vista previa" button clicks
      document.addEventListener("click", (e) => {
        const btn = (e.target as HTMLElement).closest("button");
        if (!btn) return;
        const text = btn.textContent || "";

        // Redirect to register if not logged in
        if (!user && (text.includes("Vista") || text.includes("Publicar") || text.includes("vista") || text.includes("publicar"))) {
          e.preventDefault(); e.stopPropagation(); navigate("/login"); return;
        }

        // Publicar button
        if (text.includes("Publicar") || text.includes("publicar")) {
          e.preventDefault(); e.stopPropagation();
          handlePublish();
        }
      }, true);

      // Intercept form submit
      const forms = document.querySelectorAll("form");
      forms.forEach(form => {
        form.addEventListener("submit", async (e) => {
          e.preventDefault();
          if (!user) { navigate("/login"); return; }
          handlePublish();
        });
      });
    }, 300);
    return () => clearTimeout(t);
  }, [html, user, navigate]);

  const handlePublish = async () => {
    const title = (document.querySelector('input[placeholder*="tulo"], input[placeholder*="Título"], input[placeholder*="nombre"]') as HTMLInputElement)?.value;
    const desc = (document.querySelector('textarea') as HTMLTextAreaElement)?.value;
    const priceEl = document.querySelector('input[type="number"], input[placeholder*="recio"], input[placeholder*="Precio"]') as HTMLInputElement;
    const price = priceEl?.value;
    // Category from select or first visible
    const catSelect = document.querySelector('select');
    const category = (catSelect as HTMLSelectElement)?.value;
    // Condition from active pill
    const activePill = document.querySelector('[class*="active"], [class*="selected"]');
    const condition = activePill?.textContent?.toLowerCase().replace(/ /g, "_") || "good";

    if (!title || !price || !category) {
      setError("Título, precio y categoría son obligatorios");
      return;
    }

    try {
      await api.post(`/api/products/?title=${encodeURIComponent(title)}&description=${encodeURIComponent(desc||"")}&price=${price}&category=${encodeURIComponent(category)}&condition=${condition}`);
      navigate("/catalogo");
    } catch (e: any) {
      setError(e.message || "Error al publicar");
    }
  };

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return (
    <>
      {error && <div style={{position:"fixed",top:16,left:"50%",transform:"translateX(-50%)",background:"#E74C3C",color:"#FFF",padding:"8px 20px",fontFamily:"var(--font-mono)",fontSize:"0.65rem",zIndex:9999}}>{error}</div>}
      <div dangerouslySetInnerHTML={{__html: html}} />
    </>
  );
}
