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
        
        # Check positions
        info = await page.evaluate("""() => {
            const expand = document.getElementById('searchExpand');
            const icon = document.getElementById('searchIcon');
            const blog = document.querySelector('.blog-link');
            if (!expand || !icon) return {error: 'NOT FOUND'};
            const eR = expand.getBoundingClientRect();
            const iR = icon.getBoundingClientRect();
            const bR = blog?.getBoundingClientRect();
            return {
                expandTop: eR.top,
                iconTop: iR.top,
                expandHeight: eR.height,
                iconHeight: iR.height,
                coversIcon: eR.top <= iR.top && eR.bottom >= iR.bottom,
                coversBlog: bR ? (eR.left <= bR.right) : false,
            };
        }""")
        for k,v in info.items():
            print(f"  {k}: {v}")
        
        await page.screenshot(path="screenshots/v1-catalog-search.png", full_page=False)
        await b.close()

asyncio.run(test())
