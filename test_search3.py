import asyncio
from playwright.async_api import async_playwright

async def test():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        
        rules = await page.evaluate("""() => {
            const sheets = document.styleSheets;
            let matches = [];
            for (const sheet of sheets) {
                try {
                    for (const rule of sheet.cssRules) {
                        if (rule.selectorText && rule.selectorText.includes('search-expand')) {
                            matches.push({sel: rule.selectorText, css: rule.style.cssText.substring(0, 150)});
                        }
                    }
                } catch(e) {}
            }
            return matches;
        }""")
        for r in rules:
            print(f"  {r['sel']}: {r['css']}")
        
        await b.close()

asyncio.run(test())
