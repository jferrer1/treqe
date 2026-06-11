"""Seed products via Treqe API (Railway)."""
import requests, random

API = "https://treqe-production-8518.up.railway.app"
TOKEN = None

# Login to get token
def login():
    global TOKEN
    r = requests.post(f"{API}/api/auth/login", json={"email": "demo@treqe.es", "password": "demo1234"})
    if r.status_code == 200:
        TOKEN = r.json()["token"]
        print(f"Logged in. Token: {TOKEN[:20]}...")
    else:
        print(f"Login failed: {r.text}")
        exit(1)

def create_product(title, desc, price, cat, subcat, cond):
    headers = {"Authorization": f"Bearer {TOKEN}"}
    params = {
        "title": title,
        "description": desc,
        "price": price,
        "category": cat,
        "condition": cond,
        "weight": round(random.uniform(0.2, 15), 2),
    }
    r = requests.post(f"{API}/api/products/", params=params, headers=headers)
    if r.status_code in (200, 201):
        return True
    else:
        print(f"  FAIL ({r.status_code}): {r.text[:100]}")
        return False

PRODUCTS = [
    ("iPhone 13 128GB", "Como nuevo, siempre con funda. 89% bateria.", 380, "Moviles", "Smartphones", "like_new"),
    ("Samsung Galaxy S23", "Solo 3 meses de uso. Garantia hasta diciembre.", 420, "Moviles", "Smartphones", "like_new"),
    ("MacBook Air M1 2020", "8GB RAM, 256GB SSD. Perfecto estado.", 550, "Informatica", "Portatiles", "good"),
    ("Sony PlayStation 5 Digital", "Con 2 mandos. 6 meses de uso.", 320, "Consolas", "Consolas", "good"),
    ("Nintendo Switch OLED", "Con Zelda y Mario Kart. Caja original.", 240, "Consolas", "Consolas", "like_new"),
    ("iPad Pro 11 2022", "128GB WiFi. Incluye Apple Pencil 2.", 600, "Informatica", "Tablets", "good"),
    ("Bicicleta Montana BTwin", "Rockrider 540. Talla L. Frenos hidraulicos.", 280, "Bicicletas", "MTB", "good"),
    ("Camara Canon EOS 2000D", "Con objetivo 18-55mm. Principiantes.", 200, "Camaras", "Reflex", "good"),
    ("Guitarra Espanola Admira", "Alba. Cuerdas nuevas. Con funda.", 85, "Instrumentos", "Guitarras", "good"),
    ("Silla Gaming Secretlab", "Titan Evo 2022. Negra. Impecable.", 250, "Hogar", "Mobiliario", "like_new"),
    ("Monitor LG 27 4K", "27UL500-W. Ideal diseno/edicion.", 180, "Informatica", "Monitores", "good"),
    ("AirPods Pro 2", "Con estuche carga. Cancelacion ruido.", 140, "Electronica", "Audio", "like_new"),
    ("Zapatillas Nike Air Max 90", "Talla 43. Solo 2 puestas.", 60, "Moda", "Calzado", "like_new"),
    ("Coleccion Harry Potter", "7 libros tapa dura. Perfecto estado.", 65, "Libros", "Ficcion", "good"),
    ("Taladro percutor Bosch", "GSB 18V-21. Con 2 baterias. Maletin.", 95, "Herramientas", "Electricas", "good"),
    ("Patinete electrico Xiaomi", "Pro 2. Autonomia 45km. 800km uso.", 190, "Deporte", "Patinetes", "good"),
    ("Mesa comedor extensible", "Roble macizo. 160-220cm. 6 sillas.", 350, "Decoracion", "Muebles", "good"),
    ("Cafetera DeLonghi Magnifica", "Automatica. Perfecto estado.", 170, "Hogar", "Electrodomesticos", "good"),
    ("Auriculares Sony WH-1000XM4", "Cancelacion ruido top. 1 anio uso.", 130, "Electronica", "Audio", "good"),
    ("Bicicleta Carretera Orbea", "Avant H50. Talla 55. 105 Shimano.", 420, "Bicicletas", "Carretera", "good"),
    ("Sofa Chaise Longue 3 plazas", "Gris antracita. 1 anio. Se recoge.", 380, "Decoracion", "Muebles", "good"),
    ("Apple Watch Series 8", "45mm. GPS+Cellular. Caja original.", 230, "Electronica", "Wearables", "like_new"),
    ("Teclado MIDI Arturia", "KeyLab Essential 49. Con software.", 110, "Musica", "Instrumentos", "like_new"),
    ("Barbacoa Weber Master-Touch", "57cm. Con accesorios. Poco uso.", 140, "Jardin", "Barbacoas", "good"),
    ("Maleta Rimowa Cabin S", "Aluminio plata. Original. Sin golpes.", 250, "Moda", "Complementos", "like_new"),
    ("Robot Aspirador Roomba i7", "Con base autovaciado. 1 anio.", 200, "Hogar", "Electrodomesticos", "good"),
    ("Televisor Samsung 55 QLED", "Q80B. 4K. 120Hz. Gaming.", 450, "Electronica", "TV", "good"),
    ("Casco Moto Shoei NXR2", "Talla M. Negro mate. Homologado.", 220, "Motor", "Cascos", "like_new"),
    ("Saxofon Alto Yamaha", "YAS-280. Estuche. Ideal estudiante.", 350, "Instrumentos", "Viento", "good"),
    ("Bicicleta Electrica Decathlon", "Riverside 500E. 60km autonomia.", 650, "Bicicletas", "Electricas", "good"),
    ("Impresora 3D Creality", "Ender 3 V2. Modificada. +3 rollos PLA.", 120, "Herramientas", "Impresion 3D", "good"),
    ("Escritorio Elevable Electrico", "140x70cm. Blanco. Motor silencioso.", 200, "Hogar", "Mobiliario", "good"),
]

if __name__ == "__main__":
    login()
    ok = 0
    for i, (t, d, p, c, sc, co) in enumerate(PRODUCTS):
        if create_product(t, d, p, c, sc, co):
            ok += 1
            print(f"  [{ok}/{len(PRODUCTS)}] {t}")
        else:
            print(f"  [FAIL] {t}")
    print(f"\nDone: {ok}/{len(PRODUCTS)} products created.")
