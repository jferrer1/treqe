import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        
        # RAW MIB file
        await page.goto("file:///C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/apps/web/public/mib/v1-catalogo.html", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(800)
        await page.screenshot(path="screenshots/v1-search-mib-original.png", full_page=False)
        
        pos = await page.evaluate("""() => {
            const e = document.getElementById('searchExpand');
            const i = document.getElementById('searchIcon');
            const b = document.querySelector('.blog-link');
            const eR = e.getBoundingClientRect();
            const iR = i.getBoundingClientRect();
            const bR = b.getBoundingClientRect();
            return {
                expand: {top: Math.round(eR.top), bottom: Math.round(eR.bottom), height: Math.round(eR.height)},
                icon: {top: Math.round(iR.top), bottom: Math.round(iR.bottom)},
                blog: {top: Math.round(bR.top), bottom: Math.round(bR.bottom)},
                covers: eR.top <= iR.top && eR.bottom >= iR.bottom
            };
        }""")
        for k, v in pos.items():
            print(f"  {k}: {v}")
        
        await b.close()

asyncio.run(test())
