import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Check initial prices
        p1 = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('.item-card .price-tag')).slice(0,5).map(e => e.textContent);
        }""")
        print(f"Before: {p1}")
        
        # Sort price-asc
        await page.locator(".sort-wrapper .tool-btn").click()
        await page.wait_for_timeout(500)
        await page.locator("[data-sort='price-asc']").click()
        await page.wait_for_timeout(1000)
        
        p2 = await page.evaluate("""() => {
            return Array.from(document.querySelectorAll('.item-card .price-tag')).slice(0,5).map(e => e.textContent);
        }""")
        print(f"After: {p2}")
        
        await b.close()

asyncio.run(test())
