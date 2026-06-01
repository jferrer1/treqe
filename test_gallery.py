import asyncio, json, urllib.request
from playwright.async_api import async_playwright

async def test():
    r = urllib.request.urlopen('http://localhost:8000/api/products/?limit=1')
    pid = json.loads(r.read())['items'][0]['id']
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        page.on('console', lambda m: print(f'LOG: {m.text}'))
        await page.goto(f'http://localhost:5173/articulo/{pid}', wait_until='networkidle', timeout=15000)
        await page.wait_for_timeout(3000)

        info = await page.evaluate("""() => {
            const btns = document.querySelectorAll('#gallery button');
            let ret = [];
            btns.forEach((b, i) => {
                const r = b.getBoundingClientRect();
                ret.push({i: i, w: r.width, h: r.height, x: r.x, y: r.y, vis: r.width > 0});
            });
            return ret;
        }""")
        for v in info:
            print(f"Arrow {v['i']}: {v['w']}x{v['h']} visible={v['vis']}")

        # Find the right arrow (the one with fa-chevron-right) and click it
        result = await page.evaluate("""() => {
            const allBtns = document.querySelectorAll('#gallery button');
            let arrowIdx = -1;
            for (let i = 0; i < allBtns.length; i++) {
                if (allBtns[i].innerHTML.indexOf('chevron-right') >= 0) {
                    arrowIdx = i;
                    break;
                }
            }
            if (arrowIdx >= 0) {
                allBtns[arrowIdx].click();
                return 'Clicked arrow ' + arrowIdx;
            }
            return 'Arrow not found among ' + allBtns.length + ' buttons';
        }""")
        print(result)
        await page.wait_for_timeout(500)
        active = await page.evaluate("""() => {
            const slides = document.querySelectorAll('.gallery-slide');
            for (let i = 0; i < slides.length; i++) {
                if (slides[i].classList.contains('active')) return i;
            }
            return -1;
        }""")
        print(f"Active slide: {active}")
        await browser.close()

asyncio.run(test())
