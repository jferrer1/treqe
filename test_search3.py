import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        
        cs = await page.evaluate("""() => {
            const el = document.getElementById('searchExpand');
            if (!el) return {};
            const s = window.getComputedStyle(el);
            return {top: s.top, right: s.right, bottom: s.bottom, height: s.height, display: s.display, position: s.position};
        }""")
        for k,v in cs.items():
            print(f"  {k}: {v}")
        
        # Check covers icon
        cov = await page.evaluate("""() => {
            const e = document.getElementById('searchExpand');
            const i = document.getElementById('searchIcon');
            if (!e || !i) return false;
            const eR = e.getBoundingClientRect();
            const iR = i.getBoundingClientRect();
            return eR.top <= iR.top && eR.bottom >= iR.bottom;
        }""")
        print(f"  coversIcon: {cov}")
        
        await b.close()

asyncio.run(test())
