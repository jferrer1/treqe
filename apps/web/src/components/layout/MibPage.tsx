import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

interface Props { page: string; }

const ROUTE_MAP: Record<string, string> = {
  "../v16-portada/": "/",
  "../v1-catalogo/": "/catalogo", "../v2-detalle/": "/articulo/demo",
  "../v3-subir/": "/subir", "../v4-perfil/": "/perfil",
  "../v5-onboarding/": "/onboarding", "../v6-match-notification/": "/match/demo",
  "../v7-seguimiento/": "/seguimiento/demo", "../v8-ajustes/": "/ajustes",
  "../v9-splash/": "/splash", "../v10-registro/": "/registro",
  "../v11-notificaciones/": "/avisos", "../v12-mis-matches/": "/treqes",
  "../v13-blog/": "/blog", "../v13-favoritos/": "/favoritos",
  "../v14-editar-perfil/": "/perfil/editar", "../v15-verificar-identidad/": "/perfil/verificar",
  "../v17-aviso-legal/": "/legal/aviso", "../v17-mis-solicitudes/": "/mis-solicitudes",
  "../v18-privacidad/": "/legal/privacidad", "../v19-terminos/": "/legal/terminos",
  "../v20-cookies/": "/legal/cookies", "../v21-pagos-escrow/": "/legal/pagos",
  "../v22-envios-costes/": "/legal/envios", "../v23-pago/": "/pago/demo/demo",
  "../v24-disputa/": "/disputa/demo/demo", "../v25-direccion-envio/": "/perfil/direccion",
  "../v26-metodos-pago/": "/perfil/pagos", "../v27-faq/": "/faq",
  "../v28-contactar/": "/contactar", "../v29-eliminar-cuenta/": "/perfil/eliminar",
  "../v30-sobre-treqe/": "/sobre",
};

export function MibPage({ page }: Props) {
  const ref = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`/mib/${page}.html`)
      .then(r => r.text())
      .then(html => {
        if (!ref.current) return;
        const sm = html.match(/<style>([\s\S]*?)<\/style>/);
        const bm = html.match(/<body>([\s\S]*?)<\/body>/);
        if (sm) {
          // Inyectar en head para que html/body/:root funcionen
          const existing = document.getElementById("mib-page-style");
          if (existing) existing.remove();
          const s = document.createElement("style");
          s.id = "mib-page-style";
          s.textContent = sm[1];
          document.head.appendChild(s);
        }
        if (bm) {
          let b = bm[1];
          b = b.replace(/<script[\s\S]*?<\/script>/g, "");
          b = b.replace(/\s+on\w+="[^"]*"/g, "");
          b = b.replace(/src="\.\.\/\.\.\/assets\/treqe-logo-mib\.png"/g, 'src="/treqe-logo.png"');
          ref.current.innerHTML += b;
        }
        ref.current?.addEventListener("click", (e: Event) => {
          const a = (e.target as HTMLElement).closest("a");
          if (!a) return;
          const href = a.getAttribute("href") || "";
          for (const [old, path] of Object.entries(ROUTE_MAP)) {
            if (href.startsWith(old) || href === old + "index.html") { e.preventDefault(); navigate(path); return; }
          }
        });
      });
  }, [page, navigate]);
  return <div ref={ref} />;
}
