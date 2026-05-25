import { Link } from "react-router-dom";

const PAGES = [
  { cat: "Core", items: [
    { v: "v16", name: "Portada", path: "/" },
    { v: "v1", name: "Catálogo", path: "/catalogo" },
    { v: "v2", name: "Detalle artículo", path: "/articulo/demo" },
    { v: "v13-blog", name: "Blog", path: "/blog" },
  ]},
  { cat: "Usuario", items: [
    { v: "v9", name: "Splash", path: "/splash" },
    { v: "v5", name: "Onboarding", path: "/onboarding" },
    { v: "v10", name: "Registro", path: "/registro" },
    { v: "v4", name: "Perfil", path: "/perfil" },
    { v: "v14", name: "Editar perfil", path: "/perfil/editar" },
    { v: "v15", name: "Verificar", path: "/perfil/verificar" },
    { v: "v8", name: "Ajustes", path: "/ajustes" },
  ]},
  { cat: "Transacciones", items: [
    { v: "v3", name: "Subir artículo", path: "/subir" },
    { v: "v12", name: "Mis Treqes", path: "/treqes" },
    { v: "v6", name: "Match", path: "/match/demo" },
    { v: "v23", name: "Pago", path: "/pago/demo/demo" },
    { v: "v7", name: "Seguimiento", path: "/seguimiento/demo" },
    { v: "v24", name: "Disputa", path: "/disputa/demo/demo" },
  ]},
  { cat: "Social", items: [
    { v: "v11", name: "Avisos", path: "/avisos" },
    { v: "v13f", name: "Favoritos", path: "/favoritos" },
    { v: "v17m", name: "Solicitudes", path: "/mis-solicitudes" },
  ]},
  { cat: "Legales", items: [
    { v: "v17", name: "Aviso legal", path: "/legal/aviso" },
    { v: "v18", name: "Privacidad", path: "/legal/privacidad" },
    { v: "v19", name: "Términos", path: "/legal/terminos" },
    { v: "v20", name: "Cookies", path: "/legal/cookies" },
    { v: "v21", name: "Pagos y escrow", path: "/legal/pagos" },
    { v: "v22", name: "Envíos", path: "/legal/envios" },
  ]},
  { cat: "Ajustes", items: [
    { v: "v25", name: "Dirección envío", path: "/perfil/direccion" },
    { v: "v26", name: "Métodos pago", path: "/perfil/pagos" },
    { v: "v27", name: "FAQ", path: "/faq" },
    { v: "v28", name: "Contactar", path: "/contactar" },
    { v: "v29", name: "Eliminar cuenta", path: "/perfil/eliminar" },
    { v: "v30", name: "Sobre Treqe", path: "/sobre" },
  ]},
];

export function HubPage() {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans', sans-serif", background: "#F9F7F2", minHeight: "100vh", padding: 20 }}>
      <h1 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "1.2rem", fontWeight: 600, marginBottom: 8 }}>
        Treqe — Índice de páginas
      </h1>
      <p style={{ color: "#8A8580", fontSize: "0.85rem", marginBottom: 32 }}>
        {PAGES.reduce((sum, c) => sum + c.items.length, 0)} páginas — diseño editorial MIB
      </p>
      {PAGES.map((section) => (
        <div key={section.cat} style={{ marginBottom: 28 }}>
          <h2 style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.65rem", fontWeight: 600, textTransform: "uppercase", letterSpacing: 1, color: "#8A8580", marginBottom: 10 }}>
            {section.cat}
          </h2>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {section.items.map((page) => (
              <Link
                key={page.v}
                to={page.path}
                style={{
                  display: "flex", alignItems: "center", gap: 12,
                  padding: "8px 12px", background: "#FFF", border: "1px solid #E5E0D8",
                  textDecoration: "none", color: "#1C1915", fontSize: "0.85rem",
                }}
              >
                <span style={{ fontFamily: "'IBM Plex Mono', monospace", fontSize: "0.6rem", color: "#8A8580", minWidth: 28 }}>
                  {page.v}
                </span>
                <span>{page.name}</span>
              </Link>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}
