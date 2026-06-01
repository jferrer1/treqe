import json, urllib.request, urllib.parse, os, random

API = "http://localhost:8000"
CATEGORIES = ["electronica","moda","deporte","musica","hogar","libros","motor","bicicletas","electrodomesticos","bebes","coleccionismo"]

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

# Update existing products with random categories
r = urllib.request.urlopen(f"{API}/api/products/?limit=70")
products = json.loads(r.read())['items']
print(f"Updating {len(products)} products with diverse categories...")

for p in products:
    cat = random.choice(CATEGORIES)
    url = f"{API}/api/products/{p['id']}?category={cat}"
    pur = urllib.request.Request(url, method='PUT')
    pur.add_header('Authorization', f'Bearer {token}')
    try:
        urllib.request.urlopen(pur)
    except: pass

# Verify
r2 = urllib.request.urlopen(f"{API}/api/products/?limit=5")
items = json.loads(r2.read())['items']
cats = set()
for i in items:
    cats.add((i.get('category','?')))
print(f"Categories now: {cats}")
print("Done!")
