"""Fix problematic pages by regenerating with updated converter."""
import subprocess, os, shutil

BASE = os.path.dirname(os.path.abspath(__file__))
CONV = os.path.join(BASE, "mib2reactv2.py")
SRC = os.path.join(BASE, "..", "mib-pages")
DST = os.path.join(BASE, "..", "apps", "web", "src", "pages")

FIXES = [
    ("14-editar-perfil", "editprofile", "EditProfilePage"),
    ("23-pago", "payment", "PaymentPage"),
    ("26-metodos-pago", "paymethods", "PayMethodsPage"),
    ("10-registro", "register", "RegisterPage"),
]

for html_name, folder, component in FIXES:
    html_path = os.path.join(SRC, f"v{html_name}.html")
    out_dir = os.path.join(DST, folder)
    out_path = os.path.join(out_dir, f"{component}.tsx")
    r = subprocess.run(["python", CONV, html_path, component, out_path], capture_output=True, text=True)
    if r.returncode == 0:
        print(f"OK: {folder}")
    else:
        print(f"FAIL: {folder}: {r.stderr[:100]}")
