import json, urllib.request, urllib.parse, os

API = "http://localhost:8000"
IMG_DIR = r"C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\public\images\products"
images = sorted(os.listdir(IMG_DIR))

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

print(f"Images available: {len(images)}")

# Get products
r = urllib.request.urlopen(f"{API}/api/products/?limit=10")
products = json.loads(r.read())['items']
print(f"Products: {len(products)}")

# Assign 3-5 images per product (round-robin)
img_idx = 0
for p in products[:5]:
    count = min(4, len(images) - img_idx)
    if count < 2: count = len(images)  # wrap around
    assigned = []
    for j in range(count):
        assigned.append(f"/images/products/{images[(img_idx + j) % len(images)]}")
    img_idx = (img_idx + count) % len(images)
    
    url = f"{API}/api/products/{p['id']}?photos={urllib.parse.quote(json.dumps(assigned))}"
    pur = urllib.request.Request(url, method='PUT')
    pur.add_header('Authorization', f'Bearer {token}')
    urllib.request.urlopen(pur)
    print(f"  {p['title'][:40]}: {len(assigned)} photos")

# Verify
r2 = urllib.request.urlopen(f"{API}/api/products/?limit=5")
items = json.loads(r2.read())['items']
for i in items:
    print(f"  {i['title'][:35]} | {len(i.get('photos',[]))} photos")
print("Done")
