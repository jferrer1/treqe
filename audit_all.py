import asyncio, json, urllib.request
from playwright.async_api import async_playwright

async def audit():
    r = urllib.request.urlopen('http://localhost:8000/api/products/?limit=1')
    pid = json.loads(r.read()).get('items', [{}])[0].get('id', 'demo')

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 900})
        await page.goto(f"http://localhost:5173/articulo/{pid}", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)

        buttons = await page.evaluate("""() => {
            const all = document.querySelectorAll('button, a.btn, [role="button"]');
            let results = [];
            all.forEach((el, i) => {
                const tag = el.tagName;
                const text = (el.textContent || '').trim().substring(0, 40);
                const cls = el.className?.substring?.(0, 50) || '';
                const onclick = el.getAttribute('onclick') || '';
                const href = el.getAttribute('href') || '';
                const visible = el.offsetWidth > 0 && el.offsetHeight > 0;
                results.push({i, tag, text, cls, onclick: onclick.substring(0, 60), href, visible});
            });
            return results;
        }""")

        print(f"\n{'='*60}")
        print(f"AUDITORÍA — Product Detail Page (id: {pid})")
        print(f"{'='*60}\n")
        for b in buttons:
            status = "VISIBLE" if b['visible'] else "HIDDEN"
            action = b['onclick'] or b['href'] or 'SIN ACCIÓN'
            print(f"[{b['i']:2d}] {b['tag']:6s} {status} | {b['text'][:35]:35s} | {action[:50]}")
        
        print(f"\n{'='*60}")
        print("RESUMEN DE FUNCIONALIDAD")
        print(f"{'='*60}")
        checks = await page.evaluate("""() => {
            return {
                back_btn_exists: !!document.querySelector('.back-btn'),
                gallery_exists: !!document.getElementById('gallery'),
                slides: document.querySelectorAll('.gallery-slide').length,
                thumbs: document.querySelectorAll('.gallery-thumb').length,
                dots: document.querySelectorAll('.gallery-dot').length,
                wish_btn_exists: !!document.querySelector('.gallery-wish'),
                trade_btn_exists: !!document.querySelector('.gallery-trade'),
                buy_btn_exists: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('COMPRAR')),
                trade_req_btn_exists: !!Array.from(document.querySelectorAll('button')).find(b => b.textContent.includes('TRUEQUE') || b.textContent.includes('Intercambio')),
                bottom_nav_exists: !!document.querySelector('.bottom-nav'),
                item_info_exists: !!document.querySelector('.item-info'),
            };
        }""")
        for k, v in checks.items():
            print(f"  {k}: {'OK' if v else 'MISSING'} {v}")

        await browser.close()

asyncio.run(audit())
