import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        pos = await page.evaluate("""() => {
            const icon = document.getElementById('searchIcon');
            const blog = document.querySelector('.blog-link');
            const el = document.getElementById('searchExpand');
            if (!icon || !blog) return {error: 'MISSING'};
            const iR = icon.getBoundingClientRect();
            const bR = blog.getBoundingClientRect();
            const eR = el?.getBoundingClientRect();
            return {
                icon: {top: Math.round(iR.top), left: Math.round(iR.left), bottom: Math.round(iR.bottom), height: Math.round(iR.height)},
                blog: {top: Math.round(bR.top), left: Math.round(bR.left), bottom: Math.round(bR.bottom), height: Math.round(bR.height)},
                expand: eR ? {top: Math.round(eR.top)} : null
            };
        }""")
        for k,v in pos.items():
            if v:
                print(f"  {k}: top={v['top']}px, bottom={v.get('bottom','?')}px, height={v.get('height','?')}px, left={v.get('left','?')}px")
        
        await b.close()

asyncio.run(test())
