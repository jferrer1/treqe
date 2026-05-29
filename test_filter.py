import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        # Check filter button
        btn = page.locator(".tool-btn").first
        print(f"Filter btn html: {await btn.evaluate('el => el.outerHTML.substring(0,200)')}")
        
        # Click filter
        await btn.click()
        await page.wait_for_timeout(1000)
        
        # Check if modal is visible
        modal = page.locator("#filterModal")
        style = await modal.evaluate("el => window.getComputedStyle(el).display")
        print(f"Filter modal display: {style}")
        
        # Check close button
        close_btn = page.locator("#filterModal button")
        count = await close_btn.count()
        print(f"Close buttons in modal: {count}")
        if count > 0:
            html = await close_btn.first.evaluate("el => el.outerHTML")
            print(f"Close btn: {html}")
            await close_btn.first.click()
            await page.wait_for_timeout(500)
            style2 = await modal.evaluate("el => window.getComputedStyle(el).display")
            print(f"After close: {style2}")
        
        await page.screenshot(path="screenshots/v1-catalogo-filter.png", full_page=True)
        await browser.close()
asyncio.run(test())
