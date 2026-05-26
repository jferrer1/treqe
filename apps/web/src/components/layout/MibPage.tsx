import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface Props { page: string; requireAuth?: boolean; }

const ROUTE_MAP: Record<string, string> = {
  "../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo",
  "../v3-subir/":"/subir","../v4-perfil/":"/perfil","../v5-onboarding/":"/onboarding",
  "../v6-match-notification/":"/match/demo","../v7-seguimiento/":"/seguimiento/demo",
  "../v8-ajustes/":"/ajustes","../v9-splash/":"/splash","../v10-registro/":"/registro",
  "../v11-notificaciones/":"/avisos","../v12-mis-matches/":"/treqes","../v13-blog/":"/blog",
  "../v13-favoritos/":"/favoritos","../v14-editar-perfil/":"/perfil/editar",
  "../v15-verificar-identidad/":"/perfil/verificar","../v17-aviso-legal/":"/legal/aviso",
  "../v17-mis-solicitudes/":"/mis-solicitudes","../v18-privacidad/":"/legal/privacidad",
  "../v19-terminos/":"/legal/terminos","../v20-cookies/":"/legal/cookies",
  "../v21-pagos-escrow/":"/legal/pagos","../v22-envios-costes/":"/legal/envios",
  "../v23-pago/":"/pago/demo/demo","../v24-disputa/":"/disputa/demo/demo",
  "../v25-direccion-envio/":"/perfil/direccion","../v26-metodos-pago/":"/perfil/pagos",
  "../v27-faq/":"/faq","../v28-contactar/":"/contactar",
  "../v29-eliminar-cuenta/":"/perfil/eliminar","../v30-sobre-treqe/":"/sobre",
};

const CACHE: Record<string, string> = {};

export function MibPage({ page, requireAuth }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore(s => s.user);
  const authLoading = useAuthStore(s => s.loading);
  const [html, setHtml] = useState(CACHE[page] || "");

  useEffect(() => {
    if (CACHE[page]) { setHtml(CACHE[page]); return; }
    fetch(`/mib/${page}.html`).then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
      CACHE[page] = s + b;
      setHtml(CACHE[page]);
    });
  }, [page]);

  // Redirect to register if not logged in on auth-required pages
  useEffect(() => {
    if (!requireAuth || authLoading) return;
    if (!user) navigate("/registro", { replace: true });
  }, [requireAuth, user, authLoading, navigate]);

  // Intercept link clicks for React Router navigation
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a");
      if (!a) return;
      const href = a.getAttribute("href") || "";
      for (const [old, path] of Object.entries(ROUTE_MAP)) {
        if (href.startsWith(old) || href === old + "index.html") {
          e.preventDefault(); navigate(path); return;
        }
      }
    };
    document.addEventListener("click", h);
    return () => document.removeEventListener("click", h);
  }, [navigate]);

  if (!html) return <div style={{padding:60,textAlign:"center",fontFamily:"var(--font-sans)"}}>Cargando...</div>;
  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
