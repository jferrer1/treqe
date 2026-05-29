import json, urllib.request, urllib.parse, os

API = "https://treqe-production-8518.up.railway.app"

# Login
ld = json.dumps({"email":"demo@treqe.es","password":"demo1234"}).encode()
lr = urllib.request.Request(f"{API}/api/auth/login", data=ld, method='POST')
lr.add_header('Content-Type','application/json')
token = json.loads(urllib.request.urlopen(lr).read())["token"]

# Get current products
r = urllib.request.urlopen(f"{API}/api/products/?limit=10")
products = json.loads(r.read())['items']
print(f"Current products: {len(products)}")

# Image files we copied
img_dir = r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\public\images\products"
images = sorted(os.listdir(img_dir))
print(f"Available images: {len(images)}")

# Map: assign one image to each product
for i, p in enumerate(products[:5]):
    if i < len(images):
        img_url = f"/images/products/{images[i]}"
        # Update product with photo
        pd = json.dumps({"photos": [img_url]}).encode()
        pur = urllib.request.Request(f"{API}/api/products/{p['id']}", data=pd, method='PUT')
        pur.add_header('Content-Type', 'application/json')
        pur.add_header('Authorization', f'Bearer {token}')
        try:
            urllib.request.urlopen(pur)
            print(f"Updated: {p['title'][:40]} -> {img_url[:50]}")
        except Exception as e:
            print(f"FAIL: {p['title'][:40]} -> {e}")

# Verify
r2 = urllib.request.urlopen(f"{API}/api/products/?limit=5")
items = json.loads(r2.read())['items']
for i in items:
    print(f"  {i['title'][:40]} | photos: {i.get('photos', 'none')}")
