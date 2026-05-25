"""Batch convert all MIB pages using mib2reactv2."""
import sys, os, subprocess

PAGES = {
    "v0-prototype": "HubPage",
    "v2-detalle": "ProductDetailPage", "v3-subir": "UploadPage",
    "v4-perfil": "ProfilePage", "v5-onboarding": "OnboardingPage",
    "v6-match-notification": "MatchPage", "v7-seguimiento": "TrackingPage",
    "v8-ajustes": "SettingsPage", "v9-splash": "SplashPage",
    "v10-registro": "RegisterPage", "v11-notificaciones": "NotificationsPage",
    "v12-mis-matches": "MatchesPage", "v13-blog": "BlogPage",
    "v13-favoritos": "FavoritesPage", "v14-editar-perfil": "EditProfilePage",
    "v15-verificar-identidad": "VerifyPage", "v16-portada": "LandingPage",
    "v17-aviso-legal": "LegalNoticePage", "v17-mis-solicitudes": "RequestsPage",
    "v18-privacidad": "PrivacyPage", "v19-terminos": "TermsPage",
    "v20-cookies": "CookiesPage", "v21-pagos-escrow": "PaymentsInfoPage",
    "v22-envios-costes": "ShippingInfoPage", "v23-pago": "PaymentPage",
    "v24-disputa": "DisputePage", "v25-direccion-envio": "AddressPage",
    "v26-metodos-pago": "PayMethodsPage", "v27-faq": "FaqPage",
    "v28-contactar": "ContactPage", "v29-eliminar-cuenta": "DeleteAccountPage",
    "v30-sobre-treqe": "AboutPage",
}

BASE = os.path.dirname(os.path.abspath(__file__))
SRC = os.path.join(BASE, "..", "mib-pages")
DST = os.path.join(BASE, "..", "apps", "web", "src", "pages")
CONV = os.path.join(BASE, "mib2reactv2.py")

ok = 0
for html_name, component in PAGES.items():
    html_path = os.path.join(SRC, f"{html_name}.html")
    if not os.path.exists(html_path):
        print(f"SKIP: {html_name}.html not found")
        continue
    out_dir = os.path.join(DST, component.lower().replace("page", ""))
    os.makedirs(out_dir, exist_ok=True)
    out_path = os.path.join(out_dir, f"{component}.tsx")
    r = subprocess.run(["python", CONV, html_path, component, out_path], capture_output=True, text=True)
    if r.returncode == 0:
        ok += 1
    else:
        print(f"FAIL: {html_name}: {r.stderr[:200]}")
print(f"\nOK: {ok}/{len(PAGES)}")
