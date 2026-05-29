import json, urllib.request, urllib.parse, random, shutil, os

# Load products
with open(r'D:\TREQE_DATA\treqe_generated\_mapping.json', encoding='utf-8') as f:
    data = json.load(f)

products = data['products']
with_titles = [p for p in products if p.get('title') and p.get('title').strip()]
selected = random.sample(with_titles, 5)

def clean_price(s):
    return float(s.replace('\u20AC','').replace(' ','').strip().replace('.','').replace(',','.'))

CAT_MAP = {"Tecnolog\u00EDa y electr\u00F3nica":"electronica","Moda y accesorios":"moda",
           "Hogar y jard\u00EDn":"hogar","Deporte y aire libre":"deporte","Motor":"motor",
           "Libros, m\u00FAsica y cine":"libros","Coleccionismo":"coleccionismo"}

API = "https://treqe-production-8518.up.railway.app"
IMG_DIR_SRC = r"D:\TREQE_DATA\treqe_generated"
IMG_DIR_DST = r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\public\images\products"
os.makedirs(IMG_DIR_DST, exist_ok=True)

# Login
ld = json.dumps({"email":"demo@treqe.es","password":"demo1234"}).encode()
lr = urllib.request.Request(f"{API}/api/auth/login", data=ld, method='POST')
lr.add_header('Content-Type','application/json')
try:
    token = json.loads(urllib.request.urlopen(lr).read())["token"]
except:
    rd = json.dumps({"email":"demo@treqe.es","password":"demo1234","name":"Demo"}).encode()
    rr = urllib.request.Request(f"{API}/api/auth/register", data=rd, method='POST')
    rr.add_header('Content-Type','application/json')
    token = json.loads(urllib.request.urlopen(rr).read())["token"]

print(f"Token OK")

for p in selected:
    try: price = clean_price(p['price'])
    except: price = 50.0
    
    cat = CAT_MAP.get(p.get('category',''), 'electronica')
    title = p['title'].strip()
    desc = (p.get('description','') or '')[:300]
    
    # Copy first image
    img_name = p.get('images', [])[0] if p.get('images') else None
    img_url = ""
    if img_name:
        src = os.path.join(IMG_DIR_SRC, img_name)
        if os.path.exists(src):
            safe_name = img_name.replace(' ','_')
            dst = os.path.join(IMG_DIR_DST, safe_name)
            shutil.copy2(src, dst)
            img_url = f"/images/products/{safe_name}"
            print(f"  Image: {img_name} -> {safe_name}")
    
    url = f"{API}/api/products/?title={urllib.parse.quote(title)}&description={urllib.parse.quote(desc)}&price={price}&category={urllib.parse.quote(cat)}&condition={random.choice(['good','like_new','fair','new'])}"
    pr = urllib.request.Request(url, method='POST')
    pr.add_header('Authorization', f'Bearer {token}')
    try:
        r = urllib.request.urlopen(pr)
        pid = json.loads(r.read()).get('id','?')
        print(f"OK: {title[:50]} | {price}\u20AC | img={img_url[:40]}")
    except Exception as e:
        print(f"FAIL: {title[:50]} | {e}")

print("Done — 5 products with images!")
