import asyncio
from playwright.async_api import async_playwright

PAGES = [
    ("v5-onboarding", "/onboarding"), ("v8-ajustes", "/ajustes"),
    ("v9-splash", "/splash"), ("v11-notificaciones", "/avisos"),
    ("v13-blog", "/blog"), ("v13-favoritos", "/favoritos"),
    ("v14-editar-perfil", "/perfil/editar"), ("v15-verificar-identidad", "/perfil/verificar"),
    ("v17-aviso-legal", "/legal/aviso"), ("v18-privacidad", "/legal/privacidad"),
    ("v19-terminos", "/legal/terminos"), ("v21-pagos-escrow", "/legal/pagos"),
    ("v23-pago", "/pago/demo/demo"), ("v24-disputa", "/disputa/demo/demo"),
    ("v27-faq", "/faq"), ("v30-sobre-treqe", "/sobre"),
]

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for name, route in PAGES:
            page = await browser.new_page(viewport={"width": 390, "height": 844})
            try:
                await page.goto(f"http://localhost:5173{route}", wait_until="networkidle", timeout=15000)
                await page.wait_for_timeout(2000)
                path = f"C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots/{name}.png"
                await page.screenshot(path=path, full_page=True)
                print(f"OK: {name}")
            except Exception as e:
                print(f"FAIL: {name}: {e}")
            await page.close()
        await browser.close()
        print("Done")

asyncio.run(main())
