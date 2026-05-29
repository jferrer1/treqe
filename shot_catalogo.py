import asyncio
from playwright.async_api import async_playwright

async def debug():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        
        # Listen for API calls
        api_responses = []
        page.on("response", lambda resp: 
            api_responses.append(f"{resp.status} {resp.url}") if "/api/" in resp.url else None)

        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(5000)

        for r in api_responses:
            print(f"API: {r}")

        # Check what's in the catalog grid
        items = await page.evaluate("""() => {
            const grid = document.querySelector('.catalog');
            if (!grid) return 'NO GRID';
            const cards = grid.querySelectorAll('.item-card');
            return cards.length + ' cards, HTML: ' + grid.innerHTML.substring(0, 300);
        }""")
        print(f"DOM: {items}")
        
        # Check counter
        counter = await page.evaluate("""() => {
            const c = document.querySelector('.section-title span');
            return c ? c.textContent : 'NO COUNTER';
        }""")
        print(f"Counter: {counter}")
        
        await page.screenshot(path="screenshots/v1-catalogo-now.png", full_page=True)
        await browser.close()

asyncio.run(debug())
