import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        
        errors = []
        page.on("pageerror", lambda err: errors.append(str(err)))
        
        await page.goto("http://localhost:4173/articulo/347edc40-6372-443f-a2dd-ba22fc7f85b4", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        print(f"JS Errors: {errors}")
        
        # Check what's actually rendered
        html = await page.evaluate("() => document.getElementById('gallery')?.outerHTML?.substring(0, 500) || 'NO GALLERY'")
        print(f"Gallery HTML: {html}")
        
        # Check if TreG works
        treg = await page.evaluate("() => typeof window.TreG !== 'undefined' && typeof window.TreG.goTo === 'function'")
        print(f"TreG.goTo exists: {treg}")
        
        await browser.close()

asyncio.run(test())
