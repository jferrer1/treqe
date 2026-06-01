import asyncio, json, urllib.request
from playwright.async_api import async_playwright

async def audit():
    r = urllib.request.urlopen('http://localhost:8000/api/products/?limit=1')
    pid = json.loads(r.read()).get('items', [{}])[0].get('id', 'demo')
    print(f"Product: {pid}")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto(f"http://localhost:4173/articulo/{pid}", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)

        # Check gallery
        info = await page.evaluate("""() => {
            const slides = document.querySelectorAll('.gallery-slide');
            const thumbs = document.querySelectorAll('.gallery-thumb');
            const dots = document.querySelectorAll('.gallery-dot');
            let activeSlide = -1;
            slides.forEach((s, i) => { if (s.classList.contains('active')) activeSlide = i; });
            return {
                slide_count: slides.length,
                thumb_count: thumbs.length,
                dot_count: dots.length,
                active_slide: activeSlide,
                has_TreG: typeof window.TreG !== 'undefined',
            };
        }""")
        for k, v in info.items():
            print(f"  {k}: {v}")

        # Test arrow click
        await page.evaluate("""() => {
            const arrows = document.querySelectorAll('#gallery button');
            for (const a of arrows) {
                if (a.innerHTML.indexOf('chevron-right') >= 0) {
                    a.click();
                    return;
                }
            }
        }""")
        await page.wait_for_timeout(500)
        active = await page.evaluate("""() => {
            const slides = document.querySelectorAll('.gallery-slide');
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('active')) return i;
            }
            return -1;
        }""")
        print(f"  After right arrow: slide {active}")

        await page.screenshot(path="screenshots/v2-detalle-prod.png", full_page=True)
        print("Screenshot: v2-detalle-prod.png")
        await browser.close()

asyncio.run(audit())
