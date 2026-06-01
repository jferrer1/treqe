import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Open filter, select category
        await page.locator(".tool-btn").first.click()  # Filtrar
        await page.wait_for_timeout(500)
        await page.locator("#categorySelect").select_option("electronica")
        await page.wait_for_timeout(500)
        await page.locator("button", has_text="Aplicar").click()
        await page.wait_for_timeout(1000)
        
        vis = await page.evaluate("""() => {
            const cards = document.querySelectorAll('.item-card');
            let v = 0, h = 0;
            cards.forEach(c => { if (c.style.display !== 'none') v++; else h++; });
            return {visible: v, hidden: h, chip: !!document.getElementById('filter-chip')};
        }""")
        print(f"Filter: {vis}")
        
        # Click X to remove
        chip_x = page.locator("#filter-chip span").first
        await chip_x.click()
        await page.wait_for_timeout(500)
        
        vis2 = await page.evaluate("""() => {
            const cards = document.querySelectorAll('.item-card');
            let v = 0, h = 0;
            cards.forEach(c => { if (c.style.display !== 'none') v++; else h++; });
            return {visible: v, hidden: h, chip: !!document.getElementById('filter-chip')};
        }""")
        print(f"After clear: {vis2}")
        
        await b.close()

asyncio.run(test())
