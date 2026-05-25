import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/pages/landing/LandingPage";
import { CatalogPage } from "@/pages/catalog/CatalogPage";
import { ProductDetailPage } from "@/pages/product/ProductDetailPage";
import { RegisterPage } from "@/pages/register/RegisterPage";

// Páginas placeholder (se reemplazan en cada fase)
const Placeholder = ({ title }: { title: string }) => (
  <div style={{ padding: "2rem", textAlign: "center" }}>
    <h1>{title}</h1>
    <p>🚧 En construcción — Treqe v0.0.1</p>
  </div>
);

export const router = createBrowserRouter([
  // === PÚBLICAS (SEO) ===
  { path: "/", element: <LandingPage /> },
  { path: "/catalogo", element: <CatalogPage /> },
  { path: "/articulo/:id", element: <ProductDetailPage /> },
  { path: "/blog", element: <Placeholder title="Blog" /> },
  { path: "/blog/:slug", element: <Placeholder title="Blog Post" /> },

  // === PÚBLICAS (NOINDEX) ===
  { path: "/registro", element: <RegisterPage /> },
  { path: "/legal/aviso", element: <Placeholder title="Aviso Legal" /> },
  { path: "/legal/privacidad", element: <Placeholder title="Privacidad" /> },
  { path: "/legal/terminos", element: <Placeholder title="Términos" /> },
  { path: "/legal/cookies", element: <Placeholder title="Cookies" /> },
  { path: "/legal/pagos", element: <Placeholder title="Pagos & Escrow" /> },
  { path: "/legal/envios", element: <Placeholder title="Envíos & Costes" /> },

  // === PROTEGIDAS (placeholder, auth en Fase 1) ===
  { path: "/splash", element: <Placeholder title="Splash" /> },
  { path: "/onboarding", element: <Placeholder title="Onboarding" /> },
  { path: "/subir", element: <Placeholder title="Subir Artículo" /> },
  { path: "/perfil", element: <Placeholder title="Perfil" /> },
  { path: "/perfil/editar", element: <Placeholder title="Editar Perfil" /> },
  { path: "/perfil/verificar", element: <Placeholder title="Verificar Identidad" /> },
  { path: "/favoritos", element: <Placeholder title="Favoritos" /> },
  { path: "/mis-solicitudes", element: <Placeholder title="Mis Solicitudes" /> },
  { path: "/avisos", element: <Placeholder title="Avisos" /> },
  { path: "/treqes", element: <Placeholder title="Mis Treqes" /> },
  { path: "/match/:id", element: <Placeholder title="Match" /> },
  { path: "/seguimiento/:id", element: <Placeholder title="Seguimiento" /> },
  { path: "/ajustes", element: <Placeholder title="Ajustes" /> },
  { path: "/pago/:referenceType/:id", element: <Placeholder title="Pago" /> },
  { path: "/disputa/:referenceType/:id", element: <Placeholder title="Disputa" /> },
]);
