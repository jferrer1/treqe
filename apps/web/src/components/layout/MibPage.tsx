import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthStore } from "@/stores/authStore";

interface Props { page: string; noBottomNav?: boolean; }

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

const BASE = import.meta.env.BASE_URL;

const CACHE: Record<string, string> = {};

export function MibPage({ page, noBottomNav }: Props) {
  const navigate = useNavigate();
  const user = useAuthStore((s) => s.user);
  const [html, setHtml] = useState(CACHE[page] || "");

  useEffect(() => {
    if (CACHE[page]) { setHtml(CACHE[page]); return; }
    fetch(`${BASE}mib/${page}.html`).then(r => r.text()).then(raw => {
      const sm = raw.match(/<style>([\s\S]*?)<\/style>/);
      const bm = raw.match(/<body>([\s\S]*?)<\/body>/);
      let s = sm ? `<style>${sm[1]}</style>` : "";
      let b = bm ? bm[1] : "";
      b = b.replace(/<script[\s\S]*?<\/script>/g, "");
      b = b.replace(/\s+on\w+="[^"]*"/g, "");
      // Re-add back button behavior — handles double spaces after onclick stripping
      b = b.replace(/class="treqe-header__back"\s+aria-label=/g, 'onclick="window.history.back()" class="treqe-header__back" aria-label=');
      b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, `src="${BASE}treqe-logo.png"`);
      b = b.replace(/src="\/treqe-logo\.png"/g, `src="${BASE}treqe-logo.png"`);
      if (noBottomNav) b = b.replace(/<nav class="bottom-nav"[\s\S]*?<\/nav>/g, '');
      CACHE[page] = s + b;
      setHtml(CACHE[page]);
    });
  }, [page]);

  // Intercept link clicks for React Router navigation + back buttons
  useEffect(() => {
    const h = (e: MouseEvent) => {
      const target = e.target as HTMLElement;
      // Handle back button clicks
      const backBtn = target.closest('.treqe-header__back');
      if (backBtn) { e.preventDefault(); navigate(-1); return; }
      // Handle link clicks
      const a = target.closest("a");
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

  // Replace profile icon with avatar when user is logged in
  useEffect(() => {
    if (!html || !user) return;
    const timer = setTimeout(() => {
      const bottomNav = document.querySelector('.bottom-nav');
      if (!bottomNav) return;
      const links = bottomNav.querySelectorAll('a.nav-item, .nav-item');
      links.forEach((link) => {
        const span = link.querySelector('span');
        if (span && span.textContent?.trim() === 'Perfil') {
          const icon = link.querySelector('i.far.fa-user, i.fas.fa-user');
          if (icon) {
            const initial = (user.name || user.email || '?').charAt(0).toUpperCase();
            icon.outerHTML = `<span style="width:28px;height:28px;border-radius:2px;background:#1C1915;color:#F9F7F2;display:inline-flex;align-items:center;justify-content:center;font-family:'IBM Plex Mono',monospace;font-size:.7rem;font-weight:600;text-transform:uppercase">${initial}</span>`;
          }
        }
      });
    }, 50);
    return () => clearTimeout(timer);
  }, [html, user]);

  return <div dangerouslySetInnerHTML={{__html: html}} />;
}
