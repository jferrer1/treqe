import { createBrowserRouter } from "react-router-dom";
import { LandingPage } from "@/pages/landing/LandingPage";
import { CatalogPage } from "@/pages/catalog/CatalogPage";
import { ProductDetailPage } from "@/pages/product/ProductDetailPage";
import { RegisterPage } from "@/pages/register/RegisterPage";
import { HubPage } from "@/pages/hub/HubPage";
import { OnboardingPage } from "@/pages/onboarding/OnboardingPage";
import { SplashPage } from "@/pages/splash/SplashPage";
import { UploadPage } from "@/pages/upload/UploadPage";
import { MatchPage } from "@/pages/match/MatchPage";
import { TrackingPage } from "@/pages/tracking/TrackingPage";
import { SettingsPage } from "@/pages/settings/SettingsPage";
import { FavoritesPage } from "@/pages/favorites/FavoritesPage";
import { EditProfilePage } from "@/pages/editprofile/EditProfilePage";
import { VerifyPage } from "@/pages/verify/VerifyPage";
import { LegalNoticePage } from "@/pages/legalnotice/LegalNoticePage";
import { RequestsPage } from "@/pages/requests/RequestsPage";
import { PrivacyPage } from "@/pages/privacy/PrivacyPage";
import { TermsPage } from "@/pages/terms/TermsPage";
import { CookiesPage } from "@/pages/cookies/CookiesPage";
import { PaymentsInfoPage } from "@/pages/paymentsinfo/PaymentsInfoPage";
import { PaymentPage } from "@/pages/payment/PaymentPage";
import { DisputePage } from "@/pages/dispute/DisputePage";
import { AddressPage } from "@/pages/address/AddressPage";
import { PayMethodsPage } from "@/pages/paymethods/PayMethodsPage";
import { FaqPage } from "@/pages/faq/FaqPage";
import { ContactPage } from "@/pages/contact/ContactPage";
import { DeleteAccountPage } from "@/pages/deleteaccount/DeleteAccountPage";
import { AboutPage } from "@/pages/about/AboutPage";

function Ph({ title, v }: { title: string; v?: string }) {
  return (
    <div style={{ fontFamily:"'IBM Plex Sans',sans-serif",background:"#F9F7F2",minHeight:"100vh",display:"flex",flexDirection:"column",alignItems:"center",justifyContent:"center",gap:12,padding:20,textAlign:"center" }}>
      <div style={{ fontSize:"2rem" }}>🚧</div>
      <h2 style={{ fontSize:"1rem",fontWeight:600,color:"#1C1915" }}>{title}</h2>
      {v && <span style={{ fontFamily:"'IBM Plex Mono',monospace",fontSize:"0.6rem",color:"#C5C0B8" }}>{v}</span>}
    </div>
  );
}

export const router = createBrowserRouter([
  { path: "/", element: <LandingPage /> },
  { path: "/catalogo", element: <CatalogPage /> },
  { path: "/articulo/:id", element: <ProductDetailPage /> },
  { path: "/registro", element: <RegisterPage /> },
  { path: "/hub", element: <HubPage /> },
  { path: "/subir", element: <UploadPage /> },
  { path: "/onboarding", element: <OnboardingPage /> },
  { path: "/splash", element: <SplashPage /> },
  { path: "/match/:id", element: <MatchPage /> },
  { path: "/seguimiento/:id", element: <TrackingPage /> },
  { path: "/ajustes", element: <SettingsPage /> },
  { path: "/favoritos", element: <FavoritesPage /> },
  { path: "/perfil/editar", element: <EditProfilePage /> },
  { path: "/perfil/verificar", element: <VerifyPage /> },
  { path: "/perfil/direccion", element: <AddressPage /> },
  { path: "/perfil/pagos", element: <PayMethodsPage /> },
  { path: "/perfil/eliminar", element: <DeleteAccountPage /> },
  { path: "/legal/aviso", element: <LegalNoticePage /> },
  { path: "/legal/privacidad", element: <PrivacyPage /> },
  { path: "/legal/terminos", element: <TermsPage /> },
  { path: "/legal/cookies", element: <CookiesPage /> },
  { path: "/legal/pagos", element: <PaymentsInfoPage /> },
  { path: "/pago/:refType/:id", element: <PaymentPage /> },
  { path: "/disputa/:refType/:id", element: <DisputePage /> },
  { path: "/mis-solicitudes", element: <RequestsPage /> },
  { path: "/faq", element: <FaqPage /> },
  { path: "/contactar", element: <ContactPage /> },
  { path: "/sobre", element: <AboutPage /> },

  // Placeholders (5 pages con JS complejo — pendientes)
  { path: "/perfil", element: <Ph title="Perfil" v="v4" /> },
  { path: "/avisos", element: <Ph title="Avisos" v="v11" /> },
  { path: "/treqes", element: <Ph title="Mis Treqes" v="v12" /> },
  { path: "/blog", element: <Ph title="Blog" v="v13" /> },
  { path: "/blog/:slug", element: <Ph title="Blog Post" v="v13" /> },
  { path: "/legal/envios", element: <Ph title="Envíos" v="v22" /> },
]);
