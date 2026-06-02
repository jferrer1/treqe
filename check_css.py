import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        css = await page.evaluate("""() => {
            const s = document.querySelector('style');
            if (!s) return 'NO STYLE';
            return s.textContent.includes('display:flex') ? 'FLEX FOUND' : s.textContent.substring(s.textContent.length - 200);
        }""")
        print(f"Style end: {css}")
        
        await b.close()

asyncio.run(check())
