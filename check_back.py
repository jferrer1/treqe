import asyncio
from playwright.async_api import async_playwright

async def t():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:4173/articulo/347edc40-6372-443f-a2dd-ba22fc7f85b4", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        r = await page.evaluate("""() => {
            const btn = document.querySelector('.back-btn');
            if (!btn) return 'NOT FOUND';
            return { onclick: btn.getAttribute('onclick'), visible: btn.offsetWidth > 0, cls: btn.className };
        }""")
        print(r)
        await b.close()
asyncio.run(t())
