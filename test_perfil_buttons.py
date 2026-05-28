import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 390, "height": 844})
        page = await ctx.new_page()

        # Log in
        await page.goto("http://localhost:5173/login", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(1500)
        await page.locator('input[type="email"]').fill("demo@treqe.es")
        await page.locator('input[type="password"]').fill("demo1234")
        await page.locator('button[type="submit"]').click()
        await page.wait_for_timeout(3000)
        print(f"After login URL: {page.url}")
        token = await page.evaluate("() => localStorage.getItem('treqe-token')")
        print(f"Token in localStorage: {token and 'YES' or 'NO'}")

        # Go to profile
        await page.goto("http://localhost:5173/perfil", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(5000)
        token2 = await page.evaluate("() => localStorage.getItem('treqe-token')")
        print(f"Token in localStorage at /perfil: {token2 and 'YES' or 'NO'}")

        # Check user in Zustand store
        user_data = await page.evaluate("() => { const s = window.__ZUSTAND_STORE__; return s ? s.user : 'NO_STORE'; }")
        print(f"User data: {user_data}")

        # Try clicking button
        btn = page.locator("[data-nav]").first
        nav_val = await btn.get_attribute("data-nav")
        print(f"data-nav: {nav_val}")
        await btn.click(timeout=5000)
        await page.wait_for_timeout(3000)
        print(f"After click URL: {page.url}")

        await browser.close()

asyncio.run(test())
