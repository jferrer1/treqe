import asyncio
from playwright.async_api import async_playwright

async def debug():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})

        # Catalog
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path="screenshots/v1-catalogo-debug.png", full_page=True)
        print("Catalog screenshot taken")

        # Profile without token
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        html = await page.content()
        has_cta = "Tu perfil te espera" in html
        has_mib = "scoring-card" in html
        print(f"Perfil (no token): CTA={has_cta}, MIB={has_mib}")
        await page.screenshot(path="screenshots/v4-perfil-debug-notoken.png", full_page=True)

        # Inject token and reload
        await page.evaluate("() => localStorage.setItem('treqe-token', 'fake-token')")
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        html2 = await page.content()
        has_cta2 = "Tu perfil te espera" in html2
        has_mib2 = "scoring-card" in html2
        has_bar = "Salir" in html2
        print(f"Perfil (with token): CTA={has_cta2}, MIB={has_mib2}, Salir={has_bar}")
        await page.screenshot(path="screenshots/v4-perfil-debug-withtoken.png", full_page=True)

        await browser.close()

asyncio.run(debug())
