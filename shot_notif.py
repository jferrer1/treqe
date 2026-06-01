import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/avisos", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        badge_visible = await page.evaluate("""() => {
            const b = document.querySelector('.nav-badge');
            if (!b) return 'NOT FOUND';
            return window.getComputedStyle(b).display;
        }""")
        title = await page.evaluate("() => document.querySelector('.treqe-header__title')?.textContent")
        print(f"Badge display: {badge_visible}")
        print(f"Header title: {title}")
        await page.screenshot(path="screenshots/v11-notif.png", full_page=True)
        await browser.close()

asyncio.run(shot())
