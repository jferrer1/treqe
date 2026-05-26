import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        
        # Login
        await page.goto("http://localhost:5173/registro", wait_until="networkidle", timeout=10000)
        await page.wait_for_timeout(1000)
        
        # Toggle to login mode
        toggle = page.locator("button", has_text="Inicia")
        if await toggle.count() > 0:
            await toggle.click()
            await page.wait_for_timeout(1000)
        
        await page.fill("input[type=email]", "demo@treqe.es")
        await page.fill("input[type=password]", "demo1234")
        await page.click("button[type=submit]")
        await page.wait_for_timeout(3000)
        
        # Go to subir
        await page.goto("http://localhost:5173/subir", wait_until="networkidle", timeout=10000)
        await page.wait_for_timeout(3000)
        
        await page.screenshot(path="C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/v3-subir.png", full_page=True)
        print("Done")
        await browser.close()

asyncio.run(main())
