import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Open filter, select price and condition, click Apply
        await page.locator(".tool-btn").first.click()
        await page.wait_for_timeout(500)
        
        # Click "Hasta 50" price
        await page.locator(".filter-quick-btn").first.click()
        await page.wait_for_timeout(300)
        # Click "Nuevo" condition
        await page.locator("#filterModal .filter-chip", has_text="Nuevo").click()
        await page.wait_for_timeout(300)
        # Click Apply
        await page.locator("button", has_text="Aplicar").click()
        await page.wait_for_timeout(1500)
        
        vis = await page.evaluate("""() => {
            const cards = document.querySelectorAll('.item-card');
            let v = 0, h = 0;
            cards.forEach(c => { if (c.style.display !== 'none') v++; else h++; });
            return {visible: v, hidden: h};
        }""")
        print(f"After price+cond filter: {vis}")
        
        await b.close()

asyncio.run(test())
