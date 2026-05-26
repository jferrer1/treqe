import asyncio
from playwright.async_api import async_playwright

ALL = [
    ("v16-portada", "/"),
    ("v1-catalogo", "/catalogo"),
    ("v2-detalle", "/articulo/demo"),
    ("v3-subir", "/subir"),
    ("v4-perfil", "/perfil"),
    ("v5-onboarding", "/onboarding"),
    ("v6-match-notification", "/match/demo"),
    ("v7-seguimiento", "/seguimiento/demo"),
    ("v8-ajustes", "/ajustes"),
    ("v9-splash", "/splash"),
    ("v10-registro", "/registro"),
    ("v11-notificaciones", "/avisos"),
    ("v12-mis-matches", "/treqes"),
    ("v13-blog", "/blog"),
    ("v13-favoritos", "/favoritos"),
    ("v14-editar-perfil", "/perfil/editar"),
    ("v15-verificar-identidad", "/perfil/verificar"),
    ("v17-aviso-legal", "/legal/aviso"),
    ("v17-mis-solicitudes", "/mis-solicitudes"),
    ("v18-privacidad", "/legal/privacidad"),
    ("v19-terminos", "/legal/terminos"),
    ("v20-cookies", "/legal/cookies"),
    ("v21-pagos-escrow", "/legal/pagos"),
    ("v22-envios-costes", "/legal/envios"),
    ("v23-pago", "/pago/demo/demo"),
    ("v24-disputa", "/disputa/demo/demo"),
    ("v25-direccion-envio", "/perfil/direccion"),
    ("v26-metodos-pago", "/perfil/pagos"),
    ("v27-faq", "/faq"),
    ("v28-contactar", "/contactar"),
    ("v29-eliminar-cuenta", "/perfil/eliminar"),
    ("v30-sobre-treqe", "/sobre"),
    ("v0-hub", "/hub"),
]

BASE = "C:/Users/Shadow/.openclaw/workspace/projects/active/treqe/src/screenshots"

async def main():
    async with async_playwright() as p:
        browser = await p.chromium.launch()
        for name, route in ALL:
            page = await browser.new_page(viewport={"width": 390, "height": 844})
            try:
                await page.goto(f"http://localhost:5173{route}", wait_until="networkidle", timeout=15000)
                await page.wait_for_timeout(2500)
                await page.screenshot(path=f"{BASE}/{name}.png", full_page=True)
                print(f"OK: {name}")
            except Exception as e:
                print(f"FAIL: {name}: {e}")
            await page.close()
        await browser.close()
        print("ALL DONE")

asyncio.run(main())
