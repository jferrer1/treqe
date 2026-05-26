import asyncio
from playwright.async_api import async_playwright

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        errors = []
        page.on("console", lambda msg: errors.append(msg.text) if msg.type == "error" else None)
        page.on("pageerror", lambda err: errors.append(str(err)))
        
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        count = await page.evaluate("document.querySelectorAll('.item-card').length")
        title = await page.evaluate("document.querySelector('.section-title span')?.textContent || ''")
        
        print(f"Product cards: {count}")
        print(f"Title text: {title}")
        print(f"Errors: {errors[:5]}")
        
        await page.screenshot(path="C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/react-catalogo.png", full_page=True)
        await browser.close()

asyncio.run(main())
