"""Tests contra API en ejecución. Requiere: uvicorn src.main:app --port 8000"""
import pytest
from httpx import AsyncClient

API = "http://localhost:8000"


@pytest.fixture
async def client():
    async with AsyncClient(base_url=API, timeout=10) as ac:
        yield ac


@pytest.mark.asyncio
async def test_health(client):
    r = await client.get("/api/health")
    assert r.status_code == 200
    assert r.json()["status"] == "ok"


@pytest.mark.asyncio
async def test_register(client):
    r = await client.post("/api/auth/register", json={
        "email": "test@treqe.es", "password": "test1234", "name": "Test User"
    })
    assert r.status_code in (200, 409)


@pytest.mark.asyncio
async def test_login(client):
    r = await client.post("/api/auth/login", json={
        "email": "demo@treqe.es", "password": "demo1234"
    })
    assert r.status_code == 200
    data = r.json()
    assert "token" in data
    assert data["user"]["name"] == "Usuario Demo"


@pytest.mark.asyncio
async def test_products_list(client):
    r = await client.get("/api/products/?limit=5")
    assert r.status_code == 200
    data = r.json()
    assert data["total"] >= 32
    assert len(data["items"]) == 5


@pytest.mark.asyncio
async def test_products_search(client):
    r = await client.get("/api/products/?search=iPhone")
    assert r.status_code == 200
    assert r.json()["total"] >= 1


@pytest.mark.asyncio
async def test_products_filter(client):
    r = await client.get("/api/products/?category=Bicicletas")
    assert r.status_code == 200
    assert r.json()["total"] >= 2


@pytest.mark.asyncio
async def test_categories(client):
    r = await client.get("/api/products/categories")
    assert r.status_code == 200
    assert len(r.json()["categories"]) == 20


@pytest.mark.asyncio
async def test_product_detail(client):
    r = await client.get("/api/products/?limit=1")
    assert r.status_code == 200
    product_id = r.json()["items"][0]["id"]
    r2 = await client.get(f"/api/products/{product_id}")
    assert r2.status_code == 200
    assert r2.json()["title"]


@pytest.mark.asyncio
async def test_unauthorized_access(client):
    r = await client.get("/api/favorites")
    assert r.status_code == 403


@pytest.mark.asyncio
async def test_auth_me(client):
    login = await client.post("/api/auth/login", json={
        "email": "demo@treqe.es", "password": "demo1234"
    })
    token = login.json()["token"]
    r = await client.get("/api/auth/me", headers={"Authorization": f"Bearer {token}"})
    assert r.status_code == 200
    assert r.json()["email"] == "demo@treqe.es"


@pytest.mark.asyncio
async def test_rate_limit(client):
    """10 peticiones rápidas (límite es 200/min)."""
    for _ in range(10):
        r = await client.get("/api/health")
        assert r.status_code == 200


@pytest.mark.asyncio
async def test_subcategories(client):
    """Verificar que los productos tienen subcategorías."""
    r = await client.get("/api/products/?limit=10")
    items = r.json()["items"]
    with_sub = [i for i in items if i.get("subcategory")]
    assert len(with_sub) >= 5, f"Expected ≥5 products with subcategories, got {len(with_sub)}"
