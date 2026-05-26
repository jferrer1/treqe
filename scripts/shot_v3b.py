import asyncio, json, urllib.request
from playwright.async_api import async_playwright

async def main():
    # Login via API to get token
    data = json.dumps({"email": "demo@treqe.es", "password": "demo1234"}).encode()
    req = urllib.request.Request("http://localhost:8000/api/auth/login", data=data, headers={"Content-Type": "application/json"})
    resp = json.loads(urllib.request.urlopen(req).read())
    token = resp["token"]

    async with async_playwright() as p:
        browser = await p.chromium.launch()
        ctx = await browser.new_context(viewport={"width": 390, "height": 844})
        page = await ctx.new_page()
        
        # Set token in localStorage before loading page
        await page.goto("http://localhost:5173", wait_until="networkidle", timeout=10000)
        await page.evaluate(f"localStorage.setItem('treqe-token', '{token}')")
        
        # Now go to subir
        await page.goto("http://localhost:5173/subir", wait_until="networkidle", timeout=10000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path="C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/v3-subir.png", full_page=True)
        print("Done")
        await browser.close()

asyncio.run(main())
