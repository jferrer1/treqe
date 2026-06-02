import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        
        logs = []
        page.on("console", lambda m: logs.append(m.text))
        
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Check if input exists and test typing
        inp = await page.evaluate("""() => {
            const el = document.getElementById('searchInput');
            if (!el) return 'NOT FOUND';
            // Manually trigger input
            el.value = 'test';
            el.dispatchEvent(new Event('input', {bubbles: true}));
            return 'dispatched';
        }""")
        print(f"Input: {inp}")
        await page.wait_for_timeout(500)
        
        vis = await page.evaluate("""() => {
            let v = 0, h = 0;
            document.querySelectorAll('.item-card').forEach(c => {
                if (c.style.display !== 'none') v++; else h++;
            });
            return {visible: v, hidden: h};
        }""")
        print(f"After dispatch: {vis}")
        
        for l in logs[-10:]:
            print(f"LOG: {l}")
        
        await b.close()

asyncio.run(test())
