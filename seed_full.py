"""Register demo user + seed 32 products via API."""
import requests, random

API = "https://treqe-production-8518.up.railway.app"

# Register
print("Registering demo user...")
r = requests.post(f"{API}/api/auth/register", json={"email": "demo@treqe.es", "password": "demo1234", "name": "Usuario Demo"})
if r.status_code in (200, 201):
    TOKEN = r.json()["token"]
    print(f"  Registered OK. Token: {TOKEN[:20]}...")
elif "already" in r.text.lower() or "exists" in r.text.lower():
    print("  User exists, logging in...")
    r = requests.post(f"{API}/api/auth/login", json={"email": "demo@treqe.es", "password": "demo1234"})
    TOKEN = r.json()["token"]
    print(f"  Logged in. Token: {TOKEN[:20]}...")
else:
    print(f"  Register failed: {r.text}")
    exit(1)

# Seed products
PRODUCTS = [
    ("iPhone 13 128GB", "Como nuevo, siempre con funda. 89% bateria.", 380, "Moviles", "like_new"),
    ("Samsung Galaxy S23", "Solo 3 meses de uso. Garantia hasta diciembre.", 420, "Moviles", "like_new"),
    ("MacBook Air M1 2020", "8GB RAM, 256GB SSD. Perfecto estado.", 550, "Informatica", "good"),
    ("Sony PlayStation 5 Digital", "Con 2 mandos. 6 meses de uso.", 320, "Consolas", "good"),
    ("Nintendo Switch OLED", "Con Zelda y Mario Kart. Caja original.", 240, "Consolas", "like_new"),
    ("iPad Pro 11 2022", "128GB WiFi. Incluye Apple Pencil 2.", 600, "Informatica", "good"),
    ("Bicicleta Montana BTwin", "Rockrider 540. Talla L. Frenos hidraulicos.", 280, "Bicicletas", "good"),
    ("Camara Canon EOS 2000D", "Con objetivo 18-55mm. Principiantes.", 200, "Camaras", "good"),
    ("Guitarra Espanola Admira", "Alba. Cuerdas nuevas. Con funda.", 85, "Instrumentos", "good"),
    ("Silla Gaming Secretlab", "Titan Evo 2022. Negra. Impecable.", 250, "Hogar", "like_new"),
    ("Monitor LG 27 4K", "27UL500-W. Ideal diseno/edicion.", 180, "Informatica", "good"),
    ("AirPods Pro 2", "Con estuche carga. Cancelacion ruido.", 140, "Electronica", "like_new"),
    ("Zapatillas Nike Air Max 90", "Talla 43. Solo 2 puestas.", 60, "Moda", "like_new"),
    ("Coleccion Harry Potter", "7 libros tapa dura. Perfecto estado.", 65, "Libros", "good"),
    ("Taladro percutor Bosch", "GSB 18V-21. Con 2 baterias. Maletin.", 95, "Herramientas", "good"),
    ("Patinete electrico Xiaomi", "Pro 2. Autonomia 45km. 800km uso.", 190, "Deporte", "good"),
    ("Mesa comedor extensible", "Roble macizo. 160-220cm. 6 sillas.", 350, "Decoracion", "good"),
    ("Cafetera DeLonghi Magnifica", "Automatica. Perfecto estado.", 170, "Hogar", "good"),
    ("Auriculares Sony WH-1000XM4", "Cancelacion ruido top. 1 anio uso.", 130, "Electronica", "good"),
    ("Bicicleta Carretera Orbea", "Avant H50. Talla 55. 105 Shimano.", 420, "Bicicletas", "good"),
    ("Sofa Chaise Longue 3 plazas", "Gris antracita. 1 anio. Se recoge.", 380, "Decoracion", "good"),
    ("Apple Watch Series 8", "45mm. GPS+Cellular. Caja original.", 230, "Electronica", "like_new"),
    ("Teclado MIDI Arturia", "KeyLab Essential 49. Con software.", 110, "Musica", "like_new"),
    ("Barbacoa Weber Master-Touch", "57cm. Con accesorios. Poco uso.", 140, "Jardin", "good"),
    ("Maleta Rimowa Cabin S", "Aluminio plata. Original. Sin golpes.", 250, "Moda", "like_new"),
    ("Robot Aspirador Roomba i7", "Con base autovaciado. 1 anio.", 200, "Hogar", "good"),
    ("Televisor Samsung 55 QLED", "Q80B. 4K. 120Hz. Gaming.", 450, "Electronica", "good"),
    ("Casco Moto Shoei NXR2", "Talla M. Negro mate. Homologado.", 220, "Motor", "like_new"),
    ("Saxofon Alto Yamaha", "YAS-280. Estuche. Ideal estudiante.", 350, "Instrumentos", "good"),
    ("Bicicleta Electrica Decathlon", "Riverside 500E. 60km autonomia.", 650, "Bicicletas", "good"),
    ("Impresora 3D Creality", "Ender 3 V2. Modificada. +3 rollos PLA.", 120, "Herramientas", "good"),
    ("Escritorio Elevable Electrico", "140x70cm. Blanco. Motor silencioso.", 200, "Hogar", "good"),
]

ok = 0
headers = {"Authorization": f"Bearer {TOKEN}"}
for title, desc, price, cat, cond in PRODUCTS:
    params = {"title": title, "description": desc, "price": price, "category": cat, "condition": cond, "weight": round(random.uniform(0.5, 12), 1)}
    r = requests.post(f"{API}/api/products/", params=params, headers=headers)
    if r.status_code in (200, 201):
        ok += 1
    else:
        print(f"  FAIL: {title} -> {r.status_code}")

print(f"\nDone: {ok}/32 products seeded.")
print(f"Login: demo@treqe.es / demo1234")
