import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 390, "height": 844})
        page = await ctx.new_page()

        # No auth
        await page.goto("http://localhost:5173/treqes", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v12-treqes-noauth.png", full_page=True)
        print("No-auth done")

        # With token
        await page.evaluate("() => localStorage.setItem('treqe-token', 'test')")
        await page.goto("http://localhost:5173/treqes", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)
        await page.screenshot(path="screenshots/v12-treqes-auth.png", full_page=True)
        print("Auth done")

        await browser.close()
asyncio.run(shot())
