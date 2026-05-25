"""Clean + convert the 5 problematic MIB pages."""
import subprocess, os, sys

BASE = os.path.dirname(os.path.abspath(__file__))
CLEAN = os.path.join(BASE, "clean_html.py")
CONV = os.path.join(BASE, "mib2reactv2.py")
SRC = os.path.join(BASE, "..", "mib-pages")
DST = os.path.join(BASE, "..", "apps", "web", "src", "pages")

PAGES = [
    ("v4-perfil", "profile", "ProfilePage"),
    ("v11-notificaciones", "notifications", "NotificationsPage"),
    ("v12-mis-matches", "matches", "MatchesPage"),
    ("v13-blog", "blog", "BlogPage"),
    ("v22-envios-costes", "shippinginfo", "ShippingInfoPage"),
]

for html_name, folder, component in PAGES:
    html_path = os.path.join(SRC, f"{html_name}.html")
    clean_path = html_path + ".clean.html"
    
    # Clean
    r = subprocess.run(["python", CLEAN, html_path, clean_path], capture_output=True, text=True)
    if r.returncode != 0:
        print(f"FAIL clean: {html_name}")
        continue
    
    # Convert
    out_dir = os.path.join(DST, folder)
    out_path = os.path.join(out_dir, f"{component}.tsx")
    r2 = subprocess.run(["python", CONV, clean_path, component, out_path], capture_output=True, text=True)
    if r2.returncode == 0:
        print(f"OK: {html_name} -> {component} ({os.path.getsize(out_path)} bytes)")
    else:
        print(f"FAIL convert: {html_name}: {r2.stderr[:150]}")
    
    os.unlink(clean_path)

print("Done")
