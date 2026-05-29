import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})

        pages = [
            ("/perfil", "v4-perfil-noauth"),
            ("/login", "v10-login"),
            ("/registro", "v10-registro"),
            ("/catalogo", "v1-catalogo"),
            ("/subir", "v3-subir"),
            ("/hub", "v0-hub"),
        ]
        for path, name in pages:
            await page.goto(f"http://localhost:5173{path}", wait_until="networkidle", timeout=15000)
            await page.wait_for_timeout(1500)
            await page.screenshot(path=f"screenshots/{name}.png", full_page=True)
            print(f"OK: {name}")

        # Login to get auth view
        await page.goto("http://localhost:5173/login", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(1000)
        try:
            await page.locator('input[type="email"]').fill("demo@treqe.es")
            await page.locator('input[type="password"]').fill("demo1234")
            await page.locator('button[type="submit"]').click()
            await page.wait_for_timeout(3000)
            print("Login attempted")
        except:
            print("Login form not found (maybe already has token)")

        # Try profile with "auth" (may still show no-auth if API fails)
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v4-perfil-withtoken.png", full_page=True)
        print("OK: v4-perfil-withtoken")

        await browser.close()

asyncio.run(shot())
