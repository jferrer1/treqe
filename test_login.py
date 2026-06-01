import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        
        # Collect ALL console messages
        msgs = []
        page.on("console", lambda m: msgs.append(f"[{m.type}] {m.text}"))
        
        await page.goto("http://localhost:5173/login", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        for m in msgs:
            print(m)
        msgs.clear()
        
        print("\n--- Attempting login ---")
        await page.locator('input[type="email"]').fill("demo@treqe.es")
        await page.locator('input[type="password"]').fill("demo1234")
        await page.locator('button[type="submit"]').click()
        await page.wait_for_timeout(3000)
        
        for m in msgs:
            print(m)
        
        print(f"\nURL: {page.url}")
        print(f"Token: {await page.evaluate('() => !!localStorage.getItem(\"treqe-token\")')}")
        
        await browser.close()

asyncio.run(test())
