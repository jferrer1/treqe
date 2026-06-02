import asyncio
from playwright.async_api import async_playwright

async def check():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        logo = await page.evaluate("""() => {
            const a = document.querySelector('.logo-link');
            return a ? { href: a.getAttribute('href'), tag: a.tagName } : 'NOT FOUND';
        }""")
        print(f"Logo: {logo}")
        
        await b.close()

asyncio.run(check())
