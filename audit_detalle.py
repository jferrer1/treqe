import asyncio, json, urllib.request
from playwright.async_api import async_playwright

async def audit():
    # Get real product ID
    r = urllib.request.urlopen('http://localhost:8000/api/products/?limit=1')
    pid = json.loads(r.read()).get('items', [{}])[0].get('id', 'demo')
    print(f"Product: {pid}")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto(f"http://localhost:5173/articulo/{pid}", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)

        # 1. Check back button (detail page uses .back-btn not .treqe-header__back)
        back_btn = await page.evaluate("""() => {
            const btn = document.querySelector('.back-btn');
            if (!btn) return 'NOT FOUND';
            return { onclick: btn.getAttribute('onclick'), html: btn.outerHTML.substring(0, 150) };
        }""")
        print(f"Back btn: {back_btn}")

        # 2. Check gallery
        gallery_info = await page.evaluate("""() => {
            const g = document.getElementById('gallery');
            const slides = document.querySelectorAll('.gallery-slide');
            const dots = document.querySelectorAll('.gallery-dots span');
            const thumbs = document.querySelectorAll('.gallery-thumb');
            const arrows = document.querySelectorAll('#gallery > button');
            return {
                gallery_exists: !!g,
                slide_count: slides.length,
                dot_count: dots.length,
                thumb_count: thumbs.length,
                arrow_count: arrows.length,
                first_slide_html: slides[0]?.outerHTML?.substring(0, 200),
                first_arrow_onclick: arrows[0]?.getAttribute('onclick'),
            };
        }""")
        for k, v in gallery_info.items():
            print(f"  {k}: {v}")

        # 3. Try clicking right arrow
        result = await page.evaluate("""() => {
            const arrows = document.querySelectorAll('#gallery > button');
            for (const a of arrows) {
                if (a.innerHTML.indexOf('chevron-right') >= 0) {
                    a.click();
                    return 'clicked right';
                }
            }
            return 'no right arrow found';
        }""")
        print(f"Click result: {result}")
        await page.wait_for_timeout(500)

        # Check active slide after click
        active = await page.evaluate("""() => {
            const slides = document.querySelectorAll('.gallery-slide');
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('active')) return i;
            }
            return -1;
        }""")
        print(f"Active slide: {active}")

        # Screenshot  
        await page.screenshot(path="screenshots/v2-detalle-audit.png", full_page=True)
        print("Screenshot saved")
        await browser.close()

asyncio.run(audit())
