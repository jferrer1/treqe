import urllib.request, json

# Direct
r = urllib.request.urlopen('https://treqe-production-8518.up.railway.app/api/products/?limit=5')
d = json.loads(r.read())
items = d.get('items', d) if isinstance(d, dict) else d
items = items if isinstance(items, list) else []
print(f"Railway direct: {len(items)} products")
for i in items[:3]:
    print(f"  {i.get('title','?')} | {i.get('price','?')}EUR")

# Via proxy
try:
    r2 = urllib.request.urlopen('http://localhost:5173/api/products/?limit=5')
    d2 = json.loads(r2.read())
    items2 = d2.get('items', d2) if isinstance(d2, dict) else d2
    items2 = items2 if isinstance(items2, list) else []
    print(f"Vite proxy: {len(items2)} products")
    for i in items2[:3]:
        print(f"  {i.get('title','?')} | {i.get('price','?')}EUR")
except Exception as e:
    print(f"Vite proxy FAIL: {e}")
