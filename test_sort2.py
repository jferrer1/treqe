import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Check initial state
        cards = await page.evaluate("() => document.querySelectorAll('.item-card').length")
        print(f"Initial cards: {cards}")
        
        # Sort by price asc
        await page.locator(".sort-wrapper .tool-btn").click()
        await page.wait_for_timeout(500)
        await page.locator("[data-sort='price-asc']").click()
        await page.wait_for_timeout(2000)
        
        cards2 = await page.evaluate("() => document.querySelectorAll('.item-card').length")
        print(f"After sort cards: {cards2}")
        
        # Check any errors
        errors = await page.evaluate("() => { const e = document.querySelector('.catalog'); return e ? e.innerHTML.substring(0, 200) : 'NO CATALOG'; }")
        print(f"Catalog content: {errors}")
        
        await b.close()

asyncio.run(test())
