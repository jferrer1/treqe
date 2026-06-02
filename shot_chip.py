import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Apply filter to test chip
        await page.locator(".tool-btn").first.click()
        await page.wait_for_timeout(500)
        await page.locator("#categorySelect").select_option("electronica")
        await page.wait_for_timeout(300)
        await page.locator("button", has_text="Aplicar").click()
        await page.wait_for_timeout(1000)
        
        # Check alignment
        info = await page.evaluate("""() => {
            const chips = document.getElementById('active-filters');
            const toolbar = document.querySelector('.toolbar');
            if (!chips) return {error: 'NO CHIPS'};
            const chipRect = chips.getBoundingClientRect();
            const toolbarRect = toolbar.getBoundingClientRect();
            return {
                chipLeft: chipRect.left,
                toolbarLeft: toolbarRect.left,
                chipBelow: chipRect.top > toolbarRect.bottom,
                diff: chipRect.left - toolbarRect.left,
            };
        }""")
        for k,v in info.items():
            print(f"  {k}: {v}")
        
        await page.screenshot(path="screenshots/v1-catalog-chip.png", full_page=True)
        await b.close()

asyncio.run(shot())
