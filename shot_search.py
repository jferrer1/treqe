import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        await page.screenshot(path="screenshots/v1-search-open.png", full_page=False)
        await b.close()
asyncio.run(shot())
