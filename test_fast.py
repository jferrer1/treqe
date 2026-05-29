import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch(headless=True)
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=10000)
        await page.wait_for_timeout(3000)

        # Check filter button HTML
        btn = page.locator(".tool-btn").first
        outer = await btn.evaluate("el => el.outerHTML")
        print("Btn HTML:", outer[:150])

        # Find and click
        await btn.click()
        await page.wait_for_timeout(1500)
        visible = await page.locator("#filterModal").evaluate("el => el.classList.contains('visible')")
        print("Modal visible:", visible)

        await page.screenshot(path="screenshots/v1-catalogo-modal.png", full_page=True)
        await browser.close()
        print("Done")
asyncio.run(test())
