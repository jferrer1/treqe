"""Seed 32 productos demo para Treqe."""
import asyncio, json, sys, os
sys.path.insert(0, os.path.dirname(__file__))
from src.database import engine, async_session, Base
from src.models.user import User
from src.models.product import Product
from src.services.auth import hash_password
from sqlalchemy import select, func

DEMO_USER_EMAIL = "demo@treqe.es"

PRODUCTS = [
    ("iPhone 13 128GB", "Como nuevo, siempre con funda. 89% batería.", 380, "Móviles", "like_new"),
    ("Samsung Galaxy S23", "Solo 3 meses de uso. Garantía hasta diciembre.", 420, "Móviles", "like_new"),
    ("MacBook Air M1 2020", "8GB RAM, 256GB SSD. Perfecto estado.", 550, "Informática", "good"),
    ("Sony PlayStation 5 Digital", "Con 2 mandos. 6 meses de uso.", 320, "Consolas", "good"),
    ("Nintendo Switch OLED", "Con Zelda y Mario Kart. Caja original.", 240, "Consolas", "like_new"),
    ("iPad Pro 11 2022", "128GB WiFi. Incluye Apple Pencil 2.", 600, "Informática", "good"),
    ("Bicicleta Montaña BTwin", "Rockrider 540. Talla L. Frenos hidráulicos.", 280, "Bicicletas", "good"),
    ("Cámara Canon EOS 2000D", "Con objetivo 18-55mm. Principiantes.", 200, "Cámaras", "good"),
    ("Guitarra Española Admira", "Alba. Cuerdas nuevas. Con funda.", 85, "Instrumentos", "good"),
    ("Silla Gaming Secretlab", "Titan Evo 2022. Negra. Impecable.", 250, "Hogar", "like_new"),
    ("Monitor LG 27 4K", "27UL500-W. Ideal diseño/edición.", 180, "Informática", "good"),
    ("AirPods Pro 2", "Con estuche carga. Cancelación ruido.", 140, "Electrónica", "like_new"),
    ("Zapatillas Nike Air Max 90", "Talla 43. Solo 2 puestas.", 60, "Moda", "like_new"),
    ("Colección Harry Potter", "7 libros tapa dura. Perfecto estado.", 65, "Libros", "good"),
    ("Taladro percutor Bosch", "GSB 18V-21. Con 2 baterías. Maletín.", 95, "Herramientas", "good"),
    ("Patinete eléctrico Xiaomi", "Pro 2. Autonomía 45km. 800km uso.", 190, "Deporte", "good"),
    ("Mesa comedor extensible", "Roble macizo. 160-220cm. 6 sillas.", 350, "Decoración", "good"),
    ("Cafetera DeLonghi Magnifica", "Automática. Perfecto estado.", 170, "Hogar", "good"),
    ("Auriculares Sony WH-1000XM4", "Cancelación ruido top. 1 año uso.", 130, "Electrónica", "good"),
    ("Bicicleta Carretera Orbea", "Avant H50. Talla 55. 105 Shimano.", 420, "Bicicletas", "good"),
    ("Sofá Chaise Longue 3 plazas", "Gris antracita. 1 año. Se recoge.", 380, "Decoración", "good"),
    ("Apple Watch Series 8", "45mm. GPS+Cellular. Caja original.", 230, "Electrónica", "like_new"),
    ("Teclado MIDI Arturia", "KeyLab Essential 49. Con software.", 110, "Música", "like_new"),
    ("Barbacoa Weber Master-Touch", "57cm. Con accesorios. Poco uso.", 140, "Jardín", "good"),
    ("Maleta Rimowa Cabin S", "Aluminio plata. Original. Sin golpes.", 250, "Moda", "like_new"),
    ("Robot Aspirador Roomba i7", "Con base autovaciado. 1 año.", 200, "Hogar", "good"),
    ("Televisor Samsung 55 QLED", "Q80B. 4K. 120Hz. Gaming.", 450, "Electrónica", "good"),
    ("Casco Moto Shoei NXR2", "Talla M. Negro mate. Homologado.", 220, "Motor", "like_new"),
    ("Saxofón Alto Yamaha", "YAS-280. Estuche. Ideal estudiante.", 350, "Instrumentos", "good"),
    ("Bicicleta Eléctrica Decathlon", "Riverside 500E. 60km autonomía.", 650, "Bicicletas", "good"),
    ("Impresora 3D Creality", "Ender 3 V2. Modificada. +3 rollos PLA.", 120, "Herramientas", "good"),
    ("Escritorio Elevable Eléctrico", "140x70cm. Blanco. Motor silencioso.", 200, "Hogar", "good"),
]


async def seed():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with async_session() as db:
        u = (await db.execute(select(User).where(User.email == DEMO_USER_EMAIL))).scalar_one_or_none()
        if not u:
            u = User(email=DEMO_USER_EMAIL, password_hash=hash_password("demo1234"), name="Usuario Demo")
            db.add(u)
            await db.flush()

        count = (await db.execute(select(func.count()).select_from(Product))).scalar() or 0  # noqa: F821
        if count > 0:
            print(f"Already {count} products, skipping seed.")
            return

        import random
        for title, desc, price, cat, cond in PRODUCTS:
            p = Product(
                user_id=u.id, title=title, description=desc, price=price,
                category=cat, subcategory=None, condition=cond, weight=round(random.uniform(0.2, 15), 2),
                photos="[]", videos="[]", status="active"
            )
            db.add(p)
        await db.commit()
        print(f"Seeded {len(PRODUCTS)} products (user: {DEMO_USER_EMAIL} / demo1234)")


if __name__ == "__main__":
    asyncio.run(seed())
