import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        # Check for multiple searchInputs
        count = await page.evaluate("() => document.querySelectorAll('#searchInput').length")
        print(f"#searchInput count: {count}")
        
        # Check if treqeSearch exists
        exists = await page.evaluate("() => typeof window.treqeSearch === 'function'")
        print(f"treqeSearch exists: {exists}")
        
        # Open search and check
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        
        # Type and check
        await page.locator("#searchInput").fill("iphone")
        await page.wait_for_timeout(500)
        
        # Check display on some cards
        displays = await page.evaluate("""() => {
            const cards = document.querySelectorAll('.item-card');
            let styles = [];
            for (let i = 0; i < 5; i++) {
                styles.push({i, display: cards[i].style.display, computed: window.getComputedStyle(cards[i]).display});
            }
            return styles;
        }""")
        for d in displays:
            print(f"  Card {d['i']}: style={d['display']}, computed={d['computed']}")
        
        await b.close()

asyncio.run(test())
