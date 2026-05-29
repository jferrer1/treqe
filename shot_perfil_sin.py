import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 390, "height": 844})
        page = await ctx.new_page()
        # Clear any token
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.evaluate("() => localStorage.clear()")
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v4-perfil-sin-sesion.png", full_page=True)
        print("Done")
        await browser.close()
asyncio.run(shot())
