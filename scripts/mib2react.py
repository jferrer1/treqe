#!/usr/bin/env python3
"""Convierte HTML MIB → React JSX preservando EXACTAMENTE el mismo HTML."""

import sys, re, os

PAGE_MAP = {
    "../v16-portada/": "/",
    "../v1-catalogo/": "/catalogo",
    "../v2-detalle/": None,  # se pasa id manualmente
    "../v3-subir/": "/subir",
    "../v4-perfil/": "/perfil",
    "../v5-onboarding/": "/onboarding",
    "../v6-match-notification/": None,
    "../v7-seguimiento/": None,
    "../v8-ajustes/": "/ajustes",
    "../v9-splash/": "/splash",
    "../v10-registro/": "/registro",
    "../v11-notificaciones/": "/avisos",
    "../v12-mis-matches/": "/treqes",
    "../v13-blog/": "/blog",
    "../v13-favoritos/": "/favoritos",
    "../v14-editar-perfil/": "/perfil/editar",
    "../v15-verificar-identidad/": "/perfil/verificar",
    "../v16-portada/": "/",
    "../v17-aviso-legal/": "/legal/aviso",
    "../v17-mis-solicitudes/": "/mis-solicitudes",
    "../v18-privacidad/": "/legal/privacidad",
    "../v19-terminos/": "/legal/terminos",
    "../v20-cookies/": "/legal/cookies",
    "../v21-pagos-escrow/": "/legal/pagos",
    "../v22-envios-costes/": "/legal/envios",
    "../v23-pago/": None,
    "../v24-disputa/": None,
    "../v25-direccion-envio/": "/perfil/direccion",
    "../v26-metodos-pago/": "/perfil/pagos",
    "../v27-faq/": "/faq",
    "../v28-contactar/": "/contactar",
    "../v29-eliminar-cuenta/": "/perfil/eliminar",
    "../v30-sobre-treqe/": "/sobre",
    "index.html": None,
}


def convert_html_to_jsx(html_content: str, component_name: str, api_imports: str = "") -> str:
    """Convierte HTML a JSX preservando toda la estructura."""

    # Extraer body
    body_match = re.search(r"<body>(.*?)</body>", html_content, re.DOTALL)
    if not body_match:
        body_match = re.search(r"<body[^>]*>(.*?)</body>", html_content, re.DOTALL)
    if not body_match:
        raise ValueError("No <body> found")
    body = body_match.group(1).strip()

    # 0b. Eliminar bloques <script> (React maneja interactividad)
    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.DOTALL)
    for tag in ["img", "input", "br", "hr", "meta", "link"]:
        body = re.sub(f"<{tag}([^>]*?)>", f"<{tag}\\1 />", body, flags=re.DOTALL)
        body = re.sub(f"<{tag}([^>]*?)></{tag}>", f"<{tag}\\1 />", body, flags=re.DOTALL)
    body = re.sub(r'\bclass="', 'className="', body)
    body = re.sub(r"\bclass='", "className='", body)

    # 2. Eliminar atributos onclick, onsubmit, etc. (React no los usa)
    body = re.sub(r'\bon\w+="[^"]*"', "", body)
    body = re.sub(r"\bon\w+='[^']*'", "", body)

    # 3. Convertir <a href="..."> → <Link to="..."> para rutas internas
    def replace_link(match):
        attrs = match.group(1)
        content = match.group(2)
        # Reemplazar todos los href internos
        for old, new in PAGE_MAP.items():
            if new and old in attrs:
                attrs = attrs.replace(f'href="{old}"', f'to="{new}"')
                attrs = attrs.replace(f'href="{old}index.html"', f'to="{new}"')
            elif old in attrs:
                attrs = attrs.replace(f'href="{old}"', 'href="#"')
                attrs = attrs.replace(f'href="{old}index.html"', 'href="#"')
        # Reemplazar href relativos con index.html
        attrs = re.sub(r'href="\.\./v\d+[^"]*/(index\.html)?"', 'href="#"', attrs)
        # Quitar onclick si quedó
        attrs = re.sub(r'\bon\w+="[^"]*"', '', attrs)
        if 'to="' in attrs or 'to={' in attrs:
            return f"<Link {attrs}>{content}</Link>"
        return f"<a {attrs}>{content}</a>"

    body = re.sub(r"<a\b([^>]*?)>(.*?)</a>", replace_link, body, flags=re.DOTALL)

    # 4. for= → htmlFor=
    body = body.replace('for="', 'htmlFor="')

    # 5. style="..." → style={{...}} (opcional — dejar como string si no es dinámico)
    # Por ahora mantenemos style="..." como string

    # 6. Quitar comentarios HTML
    body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)

    # 7. Quitar ids que no necesitamos
    # (los mantenemos por ahora)

    # 8. Limpiar espacios
    body = body.strip()

    # Generar componente
    code = f'''import {{ Link }} from "react-router-dom";
{api_imports}

export function {component_name}() {{
  return (
    <>
      {body}
    </>
  );
}}
'''
    return code


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python mib2react.py <input.html> <ComponentName>")
        sys.exit(1)

    html = open(sys.argv[1], encoding="utf-8").read()
    name = sys.argv[2]
    jsx = convert_html_to_jsx(html, name)
    out = sys.argv[3] if len(sys.argv) > 3 else f"{name}.tsx"
    with open(out, "w", encoding="utf-8") as f:
        f.write(jsx)
    print(f"OK: {out} ({len(jsx)} chars)")
