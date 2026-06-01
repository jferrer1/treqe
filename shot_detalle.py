import asyncio, json, urllib.request
from playwright.async_api import async_playwright

async def shot():
    # Get a real product ID
    r = urllib.request.urlopen('https://treqe-production-8518.up.railway.app/api/products/?limit=1')
    items = json.loads(r.read()).get('items', [])
    pid = items[0]['id'] if items else 'demo'
    print(f"Product: {pid}")

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": 390, "height": 844})
        await page.goto(f"http://localhost:5173/articulo/{pid}", wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path="screenshots/v2-detalle-real.png", full_page=True)
        print("Done")
        await browser.close()
asyncio.run(shot())
