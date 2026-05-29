import json, urllib.request, urllib.parse, random

# Load products
with open(r'D:\TREQE_DATA\treqe_generated\_mapping.json', encoding='utf-8') as f:
    data = json.load(f)

products = data['products']
with_titles = [p for p in products if p.get('title') and p.get('title').strip()]
selected = random.sample(with_titles, min(5, len(with_titles)))

def clean_price(price_str):
    return float(price_str.replace('\u20AC', '').replace(' ', '').strip().replace('.', '').replace(',', '.'))

CAT_MAP = {
    "Tecnolog\u00EDa y electr\u00F3nica": "electronica", "Moda y accesorios": "moda",
    "Hogar y jard\u00EDn": "hogar", "Deporte y aire libre": "deporte", "Motor": "motor",
    "Libros, m\u00FAsica y cine": "libros", "Coleccionismo": "coleccionismo",
}

EMOJIS = ["\U0001F4F1","\U0001F4BB","\U0001F3A7","\u231A","\U0001F3AE","\U0001F4F7","\U0001F3B8","\U0001F6B2","\U0001F4DA","\U0001F3AF","\U0001F5A5\uFE0F","\U0001F3B9"]
CONDITIONS = ["good", "like_new", "fair", "new"]

API = "https://treqe-production-8518.up.railway.app"

# Login
ld = json.dumps({"email": "demo@treqe.es", "password": "demo1234"}).encode()
lr = urllib.request.Request(f"{API}/api/auth/login", data=ld, method='POST')
lr.add_header('Content-Type', 'application/json')
try:
    token = json.loads(urllib.request.urlopen(lr).read())["token"]
    print(f"Logged in")
except:
    rd = json.dumps({"email": "demo@treqe.es", "password": "demo1234", "name": "Demo"}).encode()
    rr = urllib.request.Request(f"{API}/api/auth/register", data=rd, method='POST')
    rr.add_header('Content-Type', 'application/json')
    token = json.loads(urllib.request.urlopen(rr).read())["token"]
    print(f"Registered")

# Seed
for p in selected:
    try:
        price = clean_price(p['price'])
    except:
        price = 50.0
    cat = CAT_MAP.get(p.get('category', ''), 'electronica')
    title = p['title'].strip()
    desc = (p.get('description', '') or '')[:300]
    
    url = f"{API}/api/products/?title={urllib.parse.quote(title)}&description={urllib.parse.quote(desc)}&price={price}&category={urllib.parse.quote(cat)}&condition={random.choice(CONDITIONS)}"
    pr = urllib.request.Request(url, method='POST')
    pr.add_header('Content-Type', 'application/json')
    pr.add_header('Authorization', f'Bearer {token}')
    try:
        r = urllib.request.urlopen(pr)
        pid = json.loads(r.read()).get('id', '?')
        print(f"OK: {title} | {price}\u20AC | ID: {pid}")
    except urllib.error.HTTPError as e:
        print(f"FAIL: {title} | {e.code}: {e.read()[:200].decode()}")

print("Done!")
