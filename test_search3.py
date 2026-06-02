import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        x_html = await page.evaluate("() => document.querySelector('.search-close')?.outerHTML || 'NOT FOUND'")
        print(f"X button: {x_html}")
        
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        
        # Check if X is clickable
        x_btn = page.locator(".search-close")
        if await x_btn.count() > 0:
            await x_btn.click()
            await page.wait_for_timeout(300)
            is_open = await page.evaluate("() => document.getElementById('searchExpand')?.classList.contains('open')")
            print(f"Open after X click: {is_open}")
        
        # Check position
        cs = await page.evaluate("""() => {
            const el = document.getElementById('searchExpand');
            if (!el) return {};
            const s = window.getComputedStyle(el);
            return {top: s.top, height: s.height, display: s.display};
        }""")
        print(f"Expand CSS: {cs}")
        
        await b.close()

asyncio.run(test())
