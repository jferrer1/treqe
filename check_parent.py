import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Check toolbar parent
        info = await page.evaluate("""() => {
            const tb = document.querySelector('.toolbar');
            const parent = tb?.parentElement;
            return {
                parentTag: parent?.tagName,
                parentDisplay: parent ? window.getComputedStyle(parent).display : 'none',
                parentFlexWrap: parent ? window.getComputedStyle(parent).flexWrap : 'none',
            };
        }""")
        for k,v in info.items():
            print(f"  {k}: {v}")
        await b.close()

asyncio.run(check())
