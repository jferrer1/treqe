import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v1-catalogo-now.png", full_page=True)
        print("Done")
        await browser.close()
asyncio.run(shot())
