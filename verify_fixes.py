import asyncio
from playwright.async_api import async_playwright

async def verify():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})

        # Catalog
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path="screenshots/v1-catalogo-fixed.png", full_page=True)
        html = await page.content()
        has_style = "<style>" in html
        has_items = "item-card" in html
        print(f"Catalog: style={has_style}, items={has_items}")

        # Profile no token
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        h = await page.content()
        print(f"Profile no-token: CTA={'Tu perfil te espera' in h}, Salir={'Salir' in h}")
        await page.screenshot(path="screenshots/v4-perfil-fixed-notoken.png", full_page=True)

        # With token
        await page.evaluate("() => localStorage.setItem('treqe-token', 'test')")
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        h2 = await page.content()
        print(f"Profile with-token: CTA={'Tu perfil te espera' in h2}, Salir={'Salir' in h2}, Scoring={'scoring-card' in h2}")
        await page.screenshot(path="screenshots/v4-perfil-fixed-withtoken.png", full_page=True)

        await browser.close()

asyncio.run(verify())
