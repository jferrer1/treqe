import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        p2 = await browser.new_page(viewport={"width": 390, "height": 844})

        # Test catalog with real API
        await p2.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await p2.wait_for_timeout(3000)
        h = await p2.content()
        # Check if real product titles appear (not just MIB demo)
        item_count = h.count("item-card__title")
        print(f"Catalog: {item_count} product cards in HTML")
        await p2.screenshot(path="screenshots/v1-catalogo-railway.png", full_page=True)

        # Test login
        await p2.goto("http://localhost:5173/login", wait_until="networkidle", timeout=15000)
        await p2.wait_for_timeout(1000)
        await p2.locator('input[type="email"]').fill("demo@treqe.es")
        await p2.locator('input[type="password"]').fill("demo1234")
        await p2.locator('button[type="submit"]').click()
        await p2.wait_for_timeout(3000)
        url = p2.url
        token = await p2.evaluate("() => localStorage.getItem('treqe-token')")
        print(f"Login: url={url}, token={'YES' if token else 'NO'}")

        if token:
            # Profile with real auth
            await p2.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
            await p2.wait_for_timeout(2000)
            h2 = await p2.content()
            print(f"Profile auth: Salir={'Salir' in h2}")
            await p2.screenshot(path="screenshots/v4-perfil-railway.png", full_page=True)

        await browser.close()

asyncio.run(test())
