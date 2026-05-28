import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        
        # No session - should show CTA
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v4-perfil-noauth.png", full_page=True)
        print("Screenshot 1: no-auth")
        
        # Login
        await page.goto("http://localhost:5173/login", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(1000)
        el = page.locator("input").first
        await page.locator('input[type="email"]').fill("demo@treqe.es")
        await page.locator('input[type="password"]').fill("demo1234")
        await page.locator('button[type="submit"]').click()
        await page.wait_for_timeout(3000)
        print("Login done")
        
        # Profile with session
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path="screenshots/v4-perfil-auth.png", full_page=True)
        print("Screenshot 2: auth")
        
        await browser.close()

asyncio.run(shot())
