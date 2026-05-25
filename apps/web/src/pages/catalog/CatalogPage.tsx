import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

/**
 * Renderiza una página MIB EXACTA usando su HTML original.
 * El CSS se inyecta como <style> scoped.
 * Los links internos se interceptan para usar React Router.
 */
export function CatalogPage() {
  const containerRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Cargar el HTML del MIB como string
    fetch("/mib/v1-catalogo.html")
      .then((r) => r.text())
      .then((html) => {
        if (!containerRef.current) return;

        // Extraer style y body
        const styleMatch = html.match(/<style>([\s\S]*?)<\/style>/);
        const bodyMatch = html.match(/<body>([\s\S]*?)<\/body>/);

        if (styleMatch) {
          const styleEl = document.createElement("style");
          styleEl.textContent = styleMatch[1];
          containerRef.current.appendChild(styleEl);
        }

        if (bodyMatch) {
          let bodyHTML = bodyMatch[1];
          // Limpiar scripts
          bodyHTML = bodyHTML.replace(/<script[\s\S]*?<\/script>/g, "");
          // Limpiar onclicks
          bodyHTML = bodyHTML.replace(/\s+on\w+="[^"]*"/g, "");
          containerRef.current.innerHTML += bodyHTML;
        }

        // Interceptar clicks en links internos para usar React Router
        containerRef.current?.addEventListener("click", (e) => {
          const target = e.target as HTMLElement;
          const link = target.closest("a");
          if (!link) return;
          const href = link.getAttribute("href");
          if (!href) return;
          // Solo interceptar links internos MIB
          if (href.includes("../v") || href.includes("index.html")) {
            e.preventDefault();
            // Mapear a rutas React
            const routeMap: Record<string, string> = {
              "../v16-portada/": "/",
              "../v1-catalogo/": "/catalogo",
              "../v2-detalle/": "/articulo/demo",
              "../v3-subir/": "/subir",
              "../v4-perfil/": "/perfil",
              "../v10-registro/": "/registro",
              "../v13-blog/": "/blog",
              "../v11-notificaciones/": "/avisos",
              "../v12-mis-matches/": "/treqes",
            };
            for (const [old, newPath] of Object.entries(routeMap)) {
              if (href.startsWith(old) || href === old + "index.html") {
                navigate(newPath);
                return;
              }
            }
          }
        });
      });
  }, [navigate]);

  return <div ref={containerRef} />;
}
