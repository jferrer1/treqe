import asyncio
from playwright.async_api import async_playwright

async def shot():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 1200, "height": 900})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Check card styles
        info = await page.evaluate("""() => {
            const card = document.querySelector('.item-card');
            const info2 = document.querySelector('.item-card__info');
            if (!card || !info2) return {error: 'NOT FOUND'};
            const cs = window.getComputedStyle(card);
            const is2 = window.getComputedStyle(info2);
            return {
                cardDisplay: cs.display,
                cardFlexDirection: cs.flexDirection,
                infoFlex: is2.flex,
                 cardHeight: card.getBoundingClientRect().height,
                infoHeight: info2.getBoundingClientRect().height,
            };
        }""")
        for k,v in info.items():
            print(f"  {k}: {v}")
        
        # Check row height mismatch
        rows = await page.evaluate("""() => {
            const cards = document.querySelectorAll('.item-card');
            if (cards.length < 4) return [];
            const r1 = [cards[0].getBoundingClientRect().height, cards[1].getBoundingClientRect().height];
            const r2 = [cards[2].getBoundingClientRect().height, cards[3].getBoundingClientRect().height];
            return {row1: r1, row2: r2};
        }""")
        print(f"  Row heights: {rows}")
        
        await page.screenshot(path="screenshots/v1-catalog-wide.png", full_page=True)
        await b.close()

asyncio.run(shot())
