import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=10000)
        await page.wait_for_timeout(3000)

        # Click sort button
        sort = page.locator(".sort-wrapper .tool-btn")
        await sort.click()
        await page.wait_for_timeout(500)
        display = await page.locator("#sortDropdown").evaluate("el => el.style.display")
        print(f"Sort dropdown display: {display}")
        
        await page.screenshot(path="screenshots/v1-catalogo-sort.png", full_page=True)
        await browser.close()
        print("Done")
asyncio.run(test())
