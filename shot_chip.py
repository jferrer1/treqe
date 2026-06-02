import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        # Test at mobile width
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Apply filter
        await page.locator(".tool-btn").first.click()
        await page.wait_for_timeout(500)
        await page.locator("#categorySelect").select_option("electronica")
        await page.wait_for_timeout(300)
        await page.locator("button", has_text="Aplicar").click()
        await page.wait_for_timeout(1000)
        
        # Check alignment (mobile)
        info = await page.evaluate("""() => {
            const chips = document.getElementById('active-filters');
            const grid = document.querySelector('.catalog');
            if (!chips || !grid) return {error: 'MISSING'};
            const chipRect = chips.querySelector('div')?.getBoundingClientRect() || chips.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();
            return {
                chipLeft: chipRect.left,
                gridLeft: gridRect.left,
                diff: Math.round((chipRect.left - gridRect.left) * 100) / 100,
            };
        }""")
        for k,v in info.items():
            print(f"  MOBILE {k}: {v}")
        
        # Test at desktop width
        await page.set_viewport_size({"width": 1200, "height": 900})
        await page.wait_for_timeout(1000)
        info2 = await page.evaluate("""() => {
            const chips = document.getElementById('active-filters');
            const grid = document.querySelector('.catalog');
            if (!chips || !grid) return {error: 'MISSING'};
            const chipRect = chips.querySelector('div')?.getBoundingClientRect() || chips.getBoundingClientRect();
            const gridRect = grid.getBoundingClientRect();
            return {
                chipLeft: chipRect.left,
                gridLeft: gridRect.left,
                diff: Math.round((chipRect.left - gridRect.left) * 100) / 100,
            };
        }""")
        for k,v in info2.items():
            print(f"  DESKTOP {k}: {v}")
        
        await b.close()

asyncio.run(test())
