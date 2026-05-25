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
  { path: "/pago/:referenceType/:id", element: <PaymentPage /> },
  { path: "/disputa/:referenceType/:id", element: <DisputePage /> },
  { path: "/faq", element: <FaqPage /> },
  { path: "/contactar", element: <ContactPage /> },
  { path: "/sobre", element: <AboutPage /> },
  { path: "/mis-solicitudes", element: <RequestsPage /> },
]);
