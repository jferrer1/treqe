import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        transition = await page.evaluate("""() => {
            const e = document.getElementById('searchExpand');
            if (!e) return 'NOT FOUND';
            return window.getComputedStyle(e).transition;
        }""")
        print(f"Transition: {transition}")
        
        await b.close()

asyncio.run(test())
