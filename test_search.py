import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        page.on("console", lambda m: print(f"LOG: {m.text}"))
        
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        # Check if handler fires
        await page.evaluate("""() => {
            document.addEventListener('click', function(e) { console.log('GLOBAL click on', e.target.tagName, e.target.id); }, true);
        }""")
        
        # Find search icon and click
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        
        result = await page.evaluate("() => document.getElementById('searchExpand')?.classList.contains('open')")
        print(f"Open after click: {result}")
        
        await b.close()

asyncio.run(test())
