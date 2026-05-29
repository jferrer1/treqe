import json, urllib.request, urllib.parse, os

API = "https://treqe-production-8518.up.railway.app"

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

# Get products
r = urllib.request.urlopen(f"{API}/api/products/?limit=10")
products = json.loads(r.read())['items']
print(f"Products: {len(products)}")

# Images
img_dir = r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\public\images\products"
images = sorted(os.listdir(img_dir))
print(f"Images: {len(images)}")

for i, p in enumerate(products[:5]):
    if i < len(images):
        url = f"{API}/api/products/{p['id']}?photos={urllib.parse.quote(json.dumps([f'/images/products/{images[i]}']))}"
        pur = urllib.request.Request(url, method='PUT')
        pur.add_header('Authorization', f'Bearer {token}')
        try:
            urllib.request.urlopen(pur)
            print(f"OK: {p['title'][:40]} -> {images[i][:40]}")
        except urllib.error.HTTPError as e:
            print(f"FAIL: {p['title'][:40]} | {e.code} {e.read()[:200].decode()}")

# Verify
r2 = urllib.request.urlopen(f"{API}/api/products/?limit=5")
items = json.loads(r2.read())['items']
for i in items:
    print(f"  {i['title'][:40]} | photos: {i.get('photos','none')}")
