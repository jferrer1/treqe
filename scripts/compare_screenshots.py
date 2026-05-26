"""Take screenshots of MIB original vs our React version and compare them."""
import asyncio
from playwright.async_api import async_playwright

async def screenshot(url, path, width=390, height=844):
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        page = await browser.new_page(viewport={"width": width, "height": height})
        await page.goto(url, wait_until="networkidle", timeout=15000)
        await page.wait_for_timeout(2000)  # Let CSS settle
        await page.screenshot(path=path, full_page=True)
        await browser.close()
        print(f"Screenshot: {path}")

async def main():
    # MIB original (GitHub Pages)
    await screenshot(
        "https://jferrer1.github.io/treqe-dev-2026/mib-app/designs/v1-catalogo/",
        "C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/mib-catalogo.png"
    )
    # Our React version (localhost)
    await screenshot(
        "http://localhost:5173/catalogo",
        "C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/react-catalogo.png"
    )
    print("Done — now compare the screenshots")

asyncio.run(main())
