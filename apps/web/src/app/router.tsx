import { createHashRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { CatalogPage } from "@/pages/catalog/CatalogPage";
import { ProductDetailPage } from "@/pages/product/ProductDetailPage";
import { RegisterPage, LoginPage } from "@/pages/register/RegisterPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { UploadPage } from "@/pages/upload/UploadPage";
import { MatchesPage } from "@/pages/matches/MatchesPage";
import { NotificationsPage } from "@/pages/notifications/NotificationsPage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
import { MibPage } from "@/components/layout/MibPage";
import { RootLayout } from "@/components/layout/RootLayout";

function HubPage() {
  const pages = [
    { cat: "Core (Backend Real)", items: [
      { n: "Portada", p: "/", note: "MIB design" },
      { n: "Catalogo", p: "/catalogo", note: "32 productos reales" },
      { n: "Detalle producto", p: "/articulo/demo", note: "datos reales" },
      { n: "Blog", p: "/blog", note: "MIB design" },
    ]},
    { cat: "Auth (Backend Real)", items: [
      { n: "Registro", p: "/registro", note: "crea cuenta real" },
      { n: "Login", p: "/login", note: "demo@treqe.es / demo1234" },
    ]},
    { cat: "Usuario", items: [
      { n: "Perfil", p: "/perfil", note: "" },
      { n: "Editar perfil", p: "/perfil/editar", note: "" },
      { n: "Verificar identidad", p: "/perfil/verificar", note: "" },
      { n: "Ajustes", p: "/ajustes", note: "" },
      { n: "Splash", p: "/splash", note: "" },
      { n: "Onboarding", p: "/onboarding", note: "" },
    ]},
    { cat: "Transacciones", items: [
      { n: "Subir articulo", p: "/subir", note: "" },
      { n: "Mis Treqes", p: "/treqes", note: "" },
      { n: "Match notification", p: "/match/demo", note: "" },
      { n: "Seguimiento", p: "/seguimiento/demo", note: "" },
      { n: "Pago", p: "/pago/demo/demo", note: "" },
      { n: "Disputa", p: "/disputa/demo/demo", note: "" },
    ]},
    { cat: "Social", items: [
      { n: "Avisos", p: "/avisos", note: "" },
      { n: "Favoritos", p: "/favoritos", note: "" },
      { n: "Mis solicitudes", p: "/mis-solicitudes", note: "" },
    ]},
    { cat: "Legal & Info", items: [
      { n: "Aviso legal", p: "/legal/aviso", note: "" },
      { n: "Privacidad", p: "/legal/privacidad", note: "" },
      { n: "Terminos", p: "/legal/terminos", note: "" },
      { n: "Cookies", p: "/legal/cookies", note: "" },
      { n: "Pagos escrow", p: "/legal/pagos", note: "" },
      { n: "Envios", p: "/legal/envios", note: "" },
      { n: "FAQ", p: "/faq", note: "" },
      { n: "Contactar", p: "/contactar", note: "" },
      { n: "Sobre Treqe", p: "/sobre", note: "" },
      { n: "Eliminar cuenta", p: "/perfil/eliminar", note: "" },
      { n: "Direccion envio", p: "/perfil/direccion", note: "" },
      { n: "Metodos pago", p: "/perfil/pagos", note: "" },
    ]},
  ];
  const total = pages.reduce((s, c) => s + c.items.length, 0);
  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh",padding:"20px 16px",maxWidth:480,margin:"0 auto"}}>
      <h1 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"1.1rem",fontWeight:600,marginBottom:4}}>treqe</h1>
      <p style={{color:"#8A8580",fontSize:"0.8rem",marginBottom:24}}>{total} paginas &middot; Backend Railway &middot; PostgreSQL</p>
      {pages.map(s=><div key={s.cat} style={{marginBottom:24}}>
        <h2 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.6rem",fontWeight:600,textTransform:"uppercase",letterSpacing:1,color:"#8A8580",marginBottom:8,borderBottom:"1px solid #E5E0D8",paddingBottom:4}}>{s.cat}</h2>
        <div style={{display:"flex",flexDirection:"column",gap:1}}>
          {s.items.map((p,i)=><Link key={i} to={p.p} style={{display:"flex",alignItems:"center",justifyContent:"space-between",padding:"7px 10px",background:"#FFF",border:"1px solid #E5E0D8",borderRadius:3,textDecoration:"none",color:"#1C1915",fontSize:"0.8rem"}}>
            <span>{p.n}</span>
            {p.note && <span style={{fontSize:"0.6rem",color:"#22c55e",fontFamily:"'IBM Plex Mono',monospace"}}>{p.note}</span>}
          </Link>)}
        </div>
      </div>)}
      <p style={{color:"#A09A94",fontSize:"0.65rem",textAlign:"center",marginTop:32}}>demo@treqe.es / demo1234</p>
    </div>
  );
}

export const router = createHashRouter([
  { element: <RootLayout />, children: [
  // === PORTADA ===
  { path: "/", element: <MibPage page="v16-portada" /> },
  { path: "/hub", element: <HubPage /> },

  // === BACKEND REAL (publico, sin auth) ===
  { path: "/catalogo", element: <CatalogPage /> },
  { path: "/articulo/:id", element: <ProductDetailPage /> },
  { path: "/registro", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },

  // === BACKEND REAL (requieren auth) ===
  { path: "/perfil", element: <ProfilePage /> },
  { path: "/subir", element: <UploadPage /> },
  { path: "/treqes", element: <MatchesPage /> },
  { path: "/avisos", element: <NotificationsPage /> },
  { path: "/favoritos", element: <FavoritesPage /> },
  { path: "/onboarding", element: <MibPage page="v5-onboarding" /> },
  { path: "/match/:id", element: <MibPage page="v6-match-notification" /> },
  { path: "/seguimiento/:id", element: <MibPage page="v7-seguimiento" /> },
  { path: "/ajustes", element: <MibPage page="v8-ajustes" /> },
  { path: "/splash", element: <MibPage page="v9-splash" /> },
  { path: "/mis-solicitudes", element: <MibPage page="v17-mis-solicitudes" /> },
  { path: "/perfil/editar", element: <MibPage page="v14-editar-perfil" noBottomNav /> },
  { path: "/perfil/verificar", element: <MibPage page="v15-verificar-identidad" noBottomNav /> },
  { path: "/pago/:refType/:id", element: <MibPage page="v23-pago" /> },
  { path: "/disputa/:refType/:id", element: <MibPage page="v24-disputa" /> },
  { path: "/perfil/direccion", element: <MibPage page="v25-direccion-envio" /> },
  { path: "/perfil/pagos", element: <MibPage page="v26-metodos-pago" /> },
  { path: "/perfil/eliminar", element: <MibPage page="v29-eliminar-cuenta" /> },
  // Blog
  { path: "/blog", element: <MibPage page="v13-blog" /> },
  { path: "/blog/:slug", element: <MibPage page="v13-blog" /> },
  // Legal
  { path: "/legal/aviso", element: <MibPage page="v17-aviso-legal" /> },
  { path: "/legal/privacidad", element: <MibPage page="v18-privacidad" /> },
  { path: "/legal/terminos", element: <MibPage page="v19-terminos" /> },
  { path: "/legal/cookies", element: <MibPage page="v20-cookies" /> },
  { path: "/legal/pagos", element: <MibPage page="v21-pagos-escrow" /> },
  { path: "/legal/envios", element: <MibPage page="v22-envios-costes" /> },
  // Info
  { path: "/faq", element: <MibPage page="v27-faq" /> },
  { path: "/contactar", element: <MibPage page="v28-contactar" /> },
  { path: "/sobre", element: <MibPage page="v30-sobre-treqe" /> },
  ]},
]);
