"""Tests: Phase 2 — Purchases, Payments, Shipments, Disputes."""
import pytest
from httpx import AsyncClient

API = "http://localhost:8000"


@pytest.fixture
async def buyer_client():
    """Cliente autenticado como comprador."""
    async with AsyncClient(base_url=API, timeout=10) as ac:
        r = await ac.post("/api/auth/register", json={
            "email": "fase2buyer@treqe.es", "password": "test1234", "name": "Fase2 Buyer"
        })
        # 409 si ya existe → login
        if r.status_code == 409:
            r = await ac.post("/api/auth/login", json={
                "email": "fase2buyer@treqe.es", "password": "test1234"
            })
        ac.headers["Authorization"] = f"Bearer {r.json()['token']}"
        yield ac


@pytest.fixture
async def seller_client():
    """Cliente autenticado como vendedor (es el demo user)."""
    async with AsyncClient(base_url=API, timeout=10) as ac:
        r = await ac.post("/api/auth/login", json={
            "email": "demo@treqe.es", "password": "demo1234"
        })
        ac.headers["Authorization"] = f"Bearer {r.json()['token']}"
        yield ac


@pytest.mark.asyncio
async def test_create_purchase(buyer_client):
    """Un comprador solicita comprar un producto del demo user."""
    r = await buyer_client.get("/api/products/?limit=1")
    product_id = r.json()["items"][0]["id"]
    r2 = await buyer_client.post("/api/purchases/", params={
        "product_id": product_id, "shipping": 5.99, "insurance": True
    })
    assert r2.status_code == 201
    data = r2.json()
    assert data["status"] == "requested"
    assert data["total"] > 0


@pytest.mark.asyncio
async def test_list_purchases(buyer_client):
    r = await buyer_client.get("/api/purchases/")
    assert r.status_code == 200
    assert r.json()["total"] >= 1


@pytest.mark.asyncio
async def test_accept_purchase(seller_client):
    """El vendedor acepta una compra."""
    r = await seller_client.get("/api/purchases/")
    purchases = [p for p in r.json()["items"] if p["status"] == "requested"]
    if not purchases:
        pytest.skip("No requested purchases to accept")
    purchase_id = purchases[0]["id"]
    r2 = await seller_client.put(f"/api/purchases/{purchase_id}/accept")
    assert r2.status_code == 200
    assert r2.json()["status"] == "accepted"


@pytest.mark.asyncio
async def test_cannot_buy_own_product(seller_client):
    """Un vendedor no puede comprar su propio producto."""
    r = await seller_client.get("/api/products/?limit=1")
    product_id = r.json()["items"][0]["id"]
    r2 = await seller_client.post("/api/purchases/", params={"product_id": product_id})
    assert r2.status_code == 400


@pytest.mark.asyncio
async def test_create_payment_intent(buyer_client):
    """Crear intent de pago (sin Stripe config, devuelve client_secret=None)."""
    r = await buyer_client.get("/api/purchases/")
    purchases = [p for p in r.json()["items"] if p["status"] in ("requested", "accepted")]
    if not purchases:
        pytest.skip("No purchases available for payment")
    ref_id = purchases[0]["id"]
    r2 = await buyer_client.post("/api/payments/intent", params={
        "reference_id": ref_id, "reference_type": "purchase"
    })
    assert r2.status_code == 200
    assert "payment_id" in r2.json()


@pytest.mark.asyncio
async def test_shipments_list(buyer_client):
    r = await buyer_client.get("/api/shipments/")
    assert r.status_code == 200


@pytest.mark.asyncio
async def test_disputes_list(buyer_client):
    r = await buyer_client.get("/api/disputes/")
    assert r.status_code == 200
