import re, os, sys
sys.stdout.reconfigure(encoding='utf-8')
base = os.path.join(os.path.dirname(__file__), "..", "apps", "web", "src", "pages")
files = ["editprofile/EditProfilePage.tsx", "payment/PaymentPage.tsx", "register/RegisterPage.tsx"]
for f in files:
    p = os.path.join(base, f)
    if not os.path.exists(p): continue
    c = open(p, encoding='utf-8').read()
    c = re.sub(r'maxLength="(\d+)"', r'maxLength={\1}', c)
    c = re.sub(r'minLength="(\d+)"', r'minLength={\1}', c)
    open(p, 'w', encoding='utf-8').write(c)
    print(f"Fixed: {f}")
print("Done")
