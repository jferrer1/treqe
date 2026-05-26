import { useNavigate } from "react-router-dom";

interface Props { page: string; }

const ROUTE_MAP: Record<string, string> = {
  "../v16-portada/": "/", "../v1-catalogo/": "/catalogo", "../v2-detalle/": "/articulo/demo",
  "../v3-subir/": "/subir", "../v4-perfil/": "/perfil", "../v5-onboarding/": "/onboarding",
  "../v6-match-notification/": "/match/demo", "../v7-seguimiento/": "/seguimiento/demo",
  "../v8-ajustes/": "/ajustes", "../v9-splash/": "/splash", "../v10-registro/": "/registro",
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

/** Renderiza la página MIB en un iframe — 100% aislado, CSS sin conflictos */
export function MibPage({ page }: Props) {
  const navigate = useNavigate();

  return (
    <iframe
      src={`/mib/${page}.html`}
      style={{
        position: "fixed", top: 0, left: 0, width: "100%", height: "100%",
        border: "none", background: "#F9F7F2",
      }}
      title={page}
      onLoad={(e) => {
        // Interceptar clicks dentro del iframe para usar React Router
        try {
          const doc = (e.target as HTMLIFrameElement).contentDocument;
          if (!doc) return;
          // Eliminar scripts (demo alerts, etc.)
          doc.querySelectorAll("script").forEach(s => s.remove());
          // Eliminar onclicks
          doc.querySelectorAll("*").forEach(el => {
            [...el.attributes].filter(a => a.name.startsWith("on")).forEach(a => el.removeAttribute(a.name));
          });
          // Interceptar navegación
          doc.addEventListener("click", (ev) => {
            const a = (ev.target as HTMLElement).closest("a");
            if (!a) return;
            const href = a.getAttribute("href") || "";
            for (const [old, path] of Object.entries(ROUTE_MAP)) {
              if (href.startsWith(old) || href === old + "index.html") {
                ev.preventDefault();
                navigate(path);
                return;
              }
            }
          });
        } catch (_) { /* cross-origin, ignore */ }
      }}
    />
  );
}
