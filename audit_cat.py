import asyncio
from playwright.async_api import async_playwright

async def audit():
    async with async_playwright() as p:
        b = await p.chromium.launch()
        page = await b.new_page(viewport={"width": 390, "height": 844})
        await page.goto("http://localhost:5173/catalogo", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(4000)
        
        # Check blog link
        blog = await page.evaluate("""() => {
            const a = document.querySelector('a.blog-link, .blog-link');
            return a ? { href: a.getAttribute('href'), text: a.textContent?.trim() } : 'NOT FOUND';
        }""")
        print(f"Blog: {blog}")
        
        # Check logo
        logo = await page.evaluate("""() => {
            const el = document.querySelector('.treqe-header__logo, .logo-link');
            return el ? { onclick: el.getAttribute('onclick'), tag: el.tagName, text: el.textContent?.trim() } : 'NOT FOUND';
        }""")
        print(f"Logo: {logo}")
        
        # Check search
        search = await page.evaluate("""() => {
            const icon = document.getElementById('searchIcon');
            const expand = document.getElementById('searchExpand');
            return {
                icon_exists: !!icon,
                expand_exists: !!expand,
                expand_classes: expand?.classList?.toString(),
            };
        }""")
        print(f"Search: {search}")
        
        # Test search toggle
        await page.locator("#searchIcon").click()
        await page.wait_for_timeout(500)
        expand_open = await page.evaluate("() => document.getElementById('searchExpand')?.classList.contains('open')")
        print(f"Search open after click: {expand_open}")
        
        await b.close()

asyncio.run(audit())
