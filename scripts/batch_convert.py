"""Batch convert all MIB pages to React components."""
import sys, os, subprocess

PAGES = {
    "v0-prototype": ("HubPage", "hub"),
    "v2-detalle": ("ProductDetailPage", "product"),
    "v3-subir": ("UploadPage", "upload"),
    "v4-perfil": ("ProfilePage", "profile"),
    "v5-onboarding": ("OnboardingPage", "onboarding"),
    "v6-match-notification": ("MatchPage", "match"),
    "v7-seguimiento": ("TrackingPage", "tracking"),
    "v8-ajustes": ("SettingsPage", "settings"),
    "v9-splash": ("SplashPage", "splash"),
    "v10-registro": ("RegisterPage", "register"),
    "v11-notificaciones": ("NotificationsPage", "notifications"),
    "v12-mis-matches": ("MatchesPage", "matches"),
    "v13-blog": ("BlogPage", "blog"),
    "v13-favoritos": ("FavoritesPage", "favorites"),
    "v14-editar-perfil": ("EditProfilePage", "edit-profile"),
    "v15-verificar-identidad": ("VerifyPage", "verify"),
    "v17-aviso-legal": ("LegalNoticePage", "legal"),
    "v17-mis-solicitudes": ("RequestsPage", "requests"),
    "v18-privacidad": ("PrivacyPage", "privacy"),
    "v19-terminos": ("TermsPage", "terms"),
    "v20-cookies": ("CookiesPage", "cookies"),
    "v21-pagos-escrow": ("PaymentsInfoPage", "payments-info"),
    "v22-envios-costes": ("ShippingInfoPage", "shipping-info"),
    "v23-pago": ("PaymentPage", "payment"),
    "v24-disputa": ("DisputePage", "dispute"),
    "v25-direccion-envio": ("AddressPage", "address"),
    "v26-metodos-pago": ("PayMethodsPage", "paymethods"),
    "v27-faq": ("FaqPage", "faq"),
    "v28-contactar": ("ContactPage", "contact"),
    "v29-eliminar-cuenta": ("DeleteAccountPage", "delete-account"),
    "v30-sobre-treqe": ("AboutPage", "about"),
}

src_dir = os.path.join(os.path.dirname(__file__), "..", "mib-pages")
dest_dir = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "pages")
converter = os.path.join(os.path.dirname(__file__), "mib2react.py")

count = 0
for page, (name, folder) in PAGES.items():
    folder_path = os.path.join(dest_dir, folder)
    os.makedirs(folder_path, exist_ok=True)
    out_path = os.path.join(folder_path, f"{name}.tsx")
    html_path = os.path.join(src_dir, f"{page}.html")
    if not os.path.exists(html_path):
        print(f"SKIP: {page} (no HTML)")
        continue
    result = subprocess.run(["python", converter, html_path, name, out_path], capture_output=True, text=True)
    if result.returncode == 0:
        count += 1
        print(f"OK: {page} -> {name}")
    else:
        print(f"FAIL: {page}: {result.stderr[:100]}")

print(f"\nConverted: {count}/{len(PAGES)} pages")
