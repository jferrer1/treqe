import asyncio
from playwright.async_api import async_playwright

async def audit():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)

        btns = await page.evaluate("""() => {
            const all = document.querySelectorAll('button, a');
            let r = [];
            all.forEach((el, i) => {
                const text = (el.textContent || '').trim().substring(0, 35);
                const onclick = el.getAttribute('onclick') || '';
                const href = el.getAttribute('href') || '';
                const visible = el.offsetWidth > 0;
                if (visible || text) {
                    r.push({i, tag: el.tagName, text, onclick: onclick.substring(0,50), href: href.substring(0,50), visible});
                }
            });
            return r;
        }""")
        
        print("CATALOG AUDIT")
        for b in btns:
            s = "VISIBLE" if b['visible'] else "HIDDEN"
            a = b['onclick'] or b['href'] or "NO ACTION"
            print(f"[{b['i']:2d}] {b['tag']:6s} {s:7s} | {b['text'][:30]:30s} | {a[:40]}")

        # Check links work
        links = await page.evaluate("""() => {
            return {
                blog_link: document.querySelector('.blog-link')?.getAttribute('href'),
                nav_links: Array.from(document.querySelectorAll('.bottom-nav a')).map(a => a.getAttribute('href')),
                item_links: document.querySelectorAll('.item-card[href]').length,
                bottom_nav: !!document.querySelector('.bottom-nav'),
                filter_btn: !!document.querySelector('.tool-btn'),
                product_count: document.querySelector('.section-title span')?.textContent,
                image_count: document.querySelectorAll('.item-card img').length,
            };
        }""")
        for k,v in links.items():
            print(f"  {k}: {v}")
        
        await browser.close()

asyncio.run(audit())
