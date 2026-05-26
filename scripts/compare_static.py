"""Compare MIB original (GitHub Pages) vs our static MIB (localhost direct)."""
import asyncio
from playwright.async_api import async_playwright

async def screenshot(url, path, width=390, height=844):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": width, "height": height})
        await page.goto(url, wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(3000)
        await page.screenshot(path=path, full_page=True)
        await browser.close()

async def main():
    await screenshot(
        "https://jferrer1.github.io/treqe-dev-2026/mib-app/designs/v1-catalogo/",
        "C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/mib-catalogo.png"
    )
    # Our static MIB file served directly (no React, no iframe)
    await screenshot(
        "http://localhost:5173/mib/v1-catalogo.html",
        "C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/local-catalogo.png"
    )
    print("Done")

asyncio.run(main())
