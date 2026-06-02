import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        inline = await page.evaluate("() => document.getElementById('searchExpand')?.style.cssText")
        print(f"Inline style: {inline}")
        
        # Force inline style
        await page.evaluate("""() => {
            const el = document.getElementById('searchExpand');
            if (el) el.style.cssText = 'position:fixed;top:24px;right:16px;height:38px;background:red;z-index:9999';
        }""")
        
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        
        cs = await page.evaluate("() => {const s=getComputedStyle(document.getElementById('searchExpand'));return {top:s.top,pos:s.position,bg:s.backgroundColor}}")
        print(f"After force: {cs}")
        
        await b.close()

asyncio.run(test())
