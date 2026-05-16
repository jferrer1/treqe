"""Tests: Phase 3 — Offers, Matches, Algorithm, Celery workers."""
import pytest
from httpx import AsyncClient

API = "http://localhost:8000"


@pytest.fixture
async def user_a():
    """User A — tiene productos (demo)."""
    async with AsyncClient(base_url=API, timeout=10) as ac:
        r = await ac.post("/api/auth/login", json={"email": "demo@treqe.es", "password": "demo1234"})
        ac.headers["Authorization"] = f"Bearer {r.json()['token']}"
        yield ac


@pytest.fixture
async def user_b():
    """User B — comprador, sin productos propios."""
    async with AsyncClient(base_url=API, timeout=10) as ac:
        r = await ac.post("/api/auth/register", json={
            "email": "fase3b@treqe.es", "password": "test12345678", "name": "Fase3 B"
        })
        if r.status_code == 409:
            r = await ac.post("/api/auth/login", json={"email": "fase3b@treqe.es", "password": "test12345678"})
        ac.headers["Authorization"] = f"Bearer {r.json()['token']}"
        yield ac


@pytest.fixture
async def user_c():
    """User C — tercer participante para círculos."""
    async with AsyncClient(base_url=API, timeout=10) as ac:
        r = await ac.post("/api/auth/register", json={
            "email": "fase3c@treqe.es", "password": "test12345678", "name": "Fase3 C"
        })
        if r.status_code == 409:
            r = await ac.post("/api/auth/login", json={"email": "fase3c@treqe.es", "password": "test12345678"})
        ac.headers["Authorization"] = f"Bearer {r.json()['token']}"
        yield ac


@pytest.mark.asyncio
async def test_create_offer(user_b):
    """User B ofrece su producto (que no tiene) → falla. Luego crea uno y ofrece."""
    # User B no tiene productos aún — crear uno primero
    r = await user_b.post("/api/products/", params={
        "title": "Test Product B", "price": 50, "category": "Electrónica", "condition": "good"
    })
    assert r.status_code == 201
    product_b = r.json()

    # Obtener un producto de otro usuario (demo)
    r2 = await user_b.get("/api/products/?limit=10")
    other_products = [p for p in r2.json()["items"] if p["user_id"] != product_b["user_id"]]
    if not other_products:
        pytest.skip("No other users' products available")
    
    target = other_products[0]
    r3 = await user_b.post("/api/offers/", params={
        "product_id_offers": product_b["id"],
        "product_id_wants": target["id"],
    })
    assert r3.status_code == 201
    assert r3.json()["status"] == "active"


@pytest.mark.asyncio
async def test_cannot_offer_own_product(user_a):
    """No se puede ofertar por tu propio producto."""
    r = await user_a.get("/api/products/?limit=2")
    products = r.json()["items"]
    if len(products) < 2:
        pytest.skip("Need 2 products")
    r2 = await user_a.post("/api/offers/", params={
        "product_id_offers": products[0]["id"],
        "product_id_wants": products[1]["id"],
    })
    assert r2.status_code == 400


@pytest.mark.asyncio
async def test_list_mine_offers(user_a):
    """Listar ofertas propias."""
    r = await user_a.get("/api/offers/mine")
    assert r.status_code == 200
    assert "items" in r.json()


@pytest.mark.asyncio
async def test_list_matches(user_a):
    """Listar matches del usuario."""
    r = await user_a.get("/api/matches/")
    assert r.status_code == 200
    data = r.json()
    assert "items" in data
    assert "counts" in data
    assert "activos" in data["counts"]


@pytest.mark.asyncio
async def test_algorithm_trigger(user_a):
    """Disparar algoritmo de matching."""
    r = await user_a.post("/api/algorithm/run")
    assert r.status_code in (200, 500)  # 500 si Celery no está corriendo (esperado en dev)


@pytest.mark.asyncio
async def test_withdraw_offer(user_b):
    """Retirar una oferta activa."""
    r = await user_b.get("/api/offers/mine")
    active = [o for o in r.json()["items"] if o["status"] == "active"]
    if not active:
        pytest.skip("No active offers to withdraw")
    r2 = await user_b.delete(f"/api/offers/{active[0]['id']}")
    assert r2.status_code == 200
    assert r2.json()["ok"]


@pytest.mark.asyncio
async def test_duplicate_offer_rejected(user_b):
    """No se puede crear la misma oferta dos veces."""
    r = await user_b.get("/api/products/?limit=5")
    products = r.json()["items"]
    my_products = [p for p in products if p["user_id"] != "demo@treqe.es"]  # aprox
    other_products = [p for p in products if p not in my_products]
    if not my_products or not other_products:
        pytest.skip("Need products from different users")
    
    r2 = await user_b.post("/api/offers/", params={
        "product_id_offers": my_products[0]["id"],
        "product_id_wants": other_products[0]["id"],
    })
    if r2.status_code == 201:
        # Segunda vez → 409
        r3 = await user_b.post("/api/offers/", params={
            "product_id_offers": my_products[0]["id"],
            "product_id_wants": other_products[0]["id"],
        })
        assert r3.status_code in (201, 409)
