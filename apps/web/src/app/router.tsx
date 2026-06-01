import { createBrowserRouter } from "react-router-dom";
import { Link } from "react-router-dom";
import { CatalogPage } from "@/pages/catalog/CatalogPage";
import { ProductDetailPage } from "@/pages/product/ProductDetailPage";
import { RegisterPage, LoginPage } from "@/pages/register/RegisterPage";
import { UploadPage } from "@/pages/upload/UploadPage";
import { MatchesPage } from "@/pages/matches/MatchesPage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
import { NotificationsPage } from "@/pages/notifications/NotificationsPage";
import { ProfilePage } from "@/pages/profile/ProfilePage";
import { MibPage } from "@/components/layout/MibPage";

function HubPage() {
  const completed = new Set(["v1","v2","v3","v4","v10r","v10l","v11","v12","v13f"]);
  const notes: Record<string,string> = {
    "v1": "Pendiente: ordenar (bug stale closure), filtrar (necesita backend + chips MIB), link blog",
    "v2": "Pendiente: modal trueque (seleccionar producto), wish/trade persistir a API, miniaturas responsive",
    "v3": "Pendiente: subida de imágenes real (ahora placeholder), validación de categorías",
    "v4": "Pendiente: datos reales cuando API conectada, editar perfil funcional",
    "v11": "Pendiente: notificaciones reales WebSocket",
    "v12": "Pendiente: matches reales (API ofertas→matches), timers, chat entre usuarios",
    
  };
  const pages = [
    { cat:"Core",items:[{v:"v16",n:"Portada",p:"/"},{v:"v1",n:"Catálogo",p:"/catalogo"},{v:"v2",n:"Detalle",p:"/articulo/347edc40-6372-443f-a2dd-ba22fc7f85b4"},{v:"v13",n:"Blog",p:"/blog"}]},
    { cat:"Usuario",items:[{v:"v9",n:"Splash",p:"/splash"},{v:"v5",n:"Onboarding",p:"/onboarding"},{v:"v10r",n:"Registro",p:"/registro"},{v:"v10l",n:"Login",p:"/login"},{v:"v4",n:"Perfil",p:"/perfil"},{v:"v14",n:"Editar",p:"/perfil/editar"},{v:"v15",n:"Verificar",p:"/perfil/verificar"},{v:"v8",n:"Ajustes",p:"/ajustes"}]},
    { cat:"Transacciones",items:[{v:"v3",n:"Subir",p:"/subir"},{v:"v12",n:"Treqes",p:"/treqes"},{v:"v23",n:"Pago",p:"/pago/demo/demo"},{v:"v7",n:"Seguimiento",p:"/seguimiento/demo"},{v:"v24",n:"Disputa",p:"/disputa/demo/demo"}]},
    { cat:"Social",items:[{v:"v11",n:"Avisos",p:"/avisos"},{v:"v13f",n:"Favoritos",p:"/favoritos"},{v:"v17m",n:"Solicitudes",p:"/mis-solicitudes"}]},
    { cat:"Legales",items:[{v:"v17",n:"Aviso",p:"/legal/aviso"},{v:"v18",n:"Privacidad",p:"/legal/privacidad"},{v:"v19",n:"Términos",p:"/legal/terminos"},{v:"v20",n:"Cookies",p:"/legal/cookies"},{v:"v21",n:"Pagos",p:"/legal/pagos"},{v:"v22",n:"Envíos",p:"/legal/envios"}]},
    { cat:"Ajustes",items:[{v:"v25",n:"Dirección",p:"/perfil/direccion"},{v:"v26",n:"Pago",p:"/perfil/pagos"},{v:"v27",n:"FAQ",p:"/faq"},{v:"v28",n:"Contactar",p:"/contactar"},{v:"v29",n:"Eliminar",p:"/perfil/eliminar"},{v:"v30",n:"Sobre",p:"/sobre"}]},
  ];
  return (
    <div style={{fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh",padding:20}}>
      <h1 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"1.2rem",fontWeight:600}}>Treqe — Índice</h1>
      <p style={{color:"#8A8580",fontSize:"0.85rem",marginBottom:32}}>{pages.reduce((s,c)=>s+c.items.length,0)} páginas</p>
      {pages.map(s=><div key={s.cat} style={{marginBottom:28}}><h2 style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.65rem",fontWeight:600,textTransform:"uppercase",letterSpacing:1,color:"#8A8580",marginBottom:10}}>{s.cat}</h2><div style={{display:"flex",flexDirection:"column",gap:2}}>{s.items.map(p=><Link key={p.v} to={p.p} style={{display:"flex",alignItems:"center",gap:12,padding:"8px 12px",background:"#FFF",border:"1px solid #E5E0D8",textDecoration:"none",color:"#1C1915",fontSize:"0.85rem"}}><span style={{fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.6rem",color:"#8A8580",minWidth:28}}>{p.v}{completed.has(p.v) ? " ✅" : ""}</span><span>{p.n}</span>{notes[p.v] ? <span style={{fontSize:"0.6rem",color:"#A09A94",marginLeft:8}}>{notes[p.v]}</span> : null}</Link>)}</div></div>)}
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <MibPage page="v16-portada" /> },
  { path: "/hub", element: <HubPage /> },
  { path: "/catalogo", element: <CatalogPage /> },
  { path: "/articulo/:id", element: <ProductDetailPage /> },
  { path: "/registro", element: <RegisterPage /> },
  { path: "/login", element: <LoginPage /> },
  { path: "/subir", element: <UploadPage /> },
  { path: "/perfil", element: <ProfilePage /> },
  { path: "/onboarding", element: <MibPage page="v5-onboarding" /> },
  { path: "/seguimiento/:id", element: <MibPage page="v7-seguimiento" /> },
  { path: "/ajustes", element: <MibPage page="v8-ajustes" /> },
  { path: "/splash", element: <MibPage page="v9-splash" /> },
  { path: "/avisos", element: <NotificationsPage /> },
  { path: "/treqes", element: <MatchesPage /> },
  { path: "/blog", element: <MibPage page="v13-blog" /> },
  { path: "/blog/:slug", element: <MibPage page="v13-blog" /> },
  { path: "/favoritos", element: <FavoritesPage /> },
  { path: "/perfil/editar", element: <MibPage page="v14-editar-perfil" noBottomNav /> },
  { path: "/perfil/verificar", element: <MibPage page="v15-verificar-identidad" noBottomNav /> },
  { path: "/legal/aviso", element: <MibPage page="v17-aviso-legal" /> },
  { path: "/mis-solicitudes", element: <MibPage page="v17-mis-solicitudes" /> },
  { path: "/legal/privacidad", element: <MibPage page="v18-privacidad" /> },
  { path: "/legal/terminos", element: <MibPage page="v19-terminos" /> },
  { path: "/legal/cookies", element: <MibPage page="v20-cookies" /> },
  { path: "/legal/pagos", element: <MibPage page="v21-pagos-escrow" /> },
  { path: "/legal/envios", element: <MibPage page="v22-envios-costes" /> },
  { path: "/pago/:refType/:id", element: <MibPage page="v23-pago" /> },
  { path: "/disputa/:refType/:id", element: <MibPage page="v24-disputa" /> },
  { path: "/perfil/direccion", element: <MibPage page="v25-direccion-envio" /> },
  { path: "/perfil/pagos", element: <MibPage page="v26-metodos-pago" /> },
  { path: "/faq", element: <MibPage page="v27-faq" /> },
  { path: "/contactar", element: <MibPage page="v28-contactar" /> },
  { path: "/perfil/eliminar", element: <MibPage page="v29-eliminar-cuenta" /> },
  { path: "/sobre", element: <MibPage page="v30-sobre-treqe" /> },
]);
