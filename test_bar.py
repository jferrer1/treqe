import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5174/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v4-perfil-bar.png", full_page=True)
        print("Screenshot taken")
        await browser.close()
asyncio.run(test())
