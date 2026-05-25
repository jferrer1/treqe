import { createBrowserRouter, Link } from "react-router-dom";
import { LandingPage } from "@/pages/landing/LandingPage";
import { CatalogPage } from "@/pages/catalog/CatalogPage";
import { ProductDetailPage } from "@/pages/product/ProductDetailPage";
import { RegisterPage } from "@/pages/register/RegisterPage";

function Placeholder({ title, v }: { title: string; v?: string }) {
  return (
    <div style={{ fontFamily: "'IBM Plex Sans',sans-serif", background: "#F9F7F2", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", gap: 16, padding: 20, textAlign: "center" }}>
      <div style={{ width: 60, height: 60, border: "1px solid #E5E0D8", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "1.5rem", color: "#8A8580" }}>🚧</div>
      <h2 style={{ fontFamily: "'IBM Plex Sans',sans-serif", fontSize: "1rem", fontWeight: 600, color: "#1C1915" }}>{title}</h2>
      <p style={{ color: "#8A8580", fontSize: "0.85rem" }}>Página en construcción — diseño MIB pendiente</p>
      {v && <span style={{ fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.6rem", color: "#C5C0B8" }}>{v}</span>}
      <Link to="/hub" style={{ marginTop: 12, fontFamily: "'IBM Plex Mono',monospace", fontSize: "0.6rem", textTransform: "uppercase", letterSpacing: 1, color: "#1C1915", border: "1px solid #E5E0D8", padding: "8px 16px", textDecoration: "none" }}>
        Ver todas las páginas →
      </Link>
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/catalogo", element: <CatalogPage /> },
  { path: "/articulo/:id", element: <ProductDetailPage /> },
  { path: "/blog", element: <Placeholder title="Blog" v="v13" /> },
  { path: "/blog/:slug", element: <Placeholder title="Blog Post" v="v13" /> },
  { path: "/registro", element: <RegisterPage /> },
  { path: "/subir", element: <Placeholder title="Subir Artículo" v="v3" /> },
  { path: "/perfil", element: <Placeholder title="Perfil" v="v4" /> },
  { path: "/perfil/editar", element: <Placeholder title="Editar Perfil" v="v14" /> },
  { path: "/perfil/verificar", element: <Placeholder title="Verificar Identidad" v="v15" /> },
  { path: "/perfil/direccion", element: <Placeholder title="Dirección de Envío" v="v25" /> },
  { path: "/perfil/pagos", element: <Placeholder title="Métodos de Pago" v="v26" /> },
  { path: "/perfil/eliminar", element: <Placeholder title="Eliminar Cuenta" v="v29" /> },
  { path: "/onboarding", element: <Placeholder title="Onboarding" v="v5" /> },
  { path: "/match/:id", element: <Placeholder title="Match" v="v6" /> },
  { path: "/seguimiento/:id", element: <Placeholder title="Seguimiento" v="v7" /> },
  { path: "/ajustes", element: <Placeholder title="Ajustes" v="v8" /> },
  { path: "/splash", element: <Placeholder title="Splash" v="v9" /> },
  { path: "/avisos", element: <Placeholder title="Avisos" v="v11" /> },
  { path: "/treqes", element: <Placeholder title="Mis Treqes" v="v12" /> },
  { path: "/favoritos", element: <Placeholder title="Favoritos" v="v13f" /> },
  { path: "/mis-solicitudes", element: <Placeholder title="Mis Solicitudes" v="v17m" /> },
  { path: "/legal/aviso", element: <Placeholder title="Aviso Legal" v="v17" /> },
  { path: "/legal/privacidad", element: <Placeholder title="Privacidad" v="v18" /> },
  { path: "/legal/terminos", element: <Placeholder title="Términos" v="v19" /> },
  { path: "/legal/cookies", element: <Placeholder title="Cookies" v="v20" /> },
  { path: "/legal/pagos", element: <Placeholder title="Pagos y Escrow" v="v21" /> },
  { path: "/legal/envios", element: <Placeholder title="Envíos y Costes" v="v22" /> },
  { path: "/pago/:referenceType/:id", element: <Placeholder title="Pago" v="v23" /> },
  { path: "/disputa/:referenceType/:id", element: <Placeholder title="Disputa" v="v24" /> },
  { path: "/faq", element: <Placeholder title="FAQ" v="v27" /> },
  { path: "/contactar", element: <Placeholder title="Contactar" v="v28" /> },
  { path: "/sobre", element: <Placeholder title="Sobre Treqe" v="v30" /> },
  { path: "/hub", element: <Placeholder title="Hub" v="v0" /> },
]);
