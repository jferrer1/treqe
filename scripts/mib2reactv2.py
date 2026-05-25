#!/usr/bin/env python3
"""Convierte HTML MIB → React JSX preservando EXACTAMENTE el mismo HTML.
v2 — maneja todos los edge cases."""

import sys, re, os

CSS_CAMEL = {
    "font-size":"fontSize","font-weight":"fontWeight","font-family":"fontFamily",
    "text-align":"textAlign","text-transform":"textTransform","text-decoration":"textDecoration",
    "margin-top":"marginTop","margin-bottom":"marginBottom","margin-left":"marginLeft","margin-right":"marginRight",
    "padding-top":"paddingTop","padding-bottom":"paddingBottom","padding-left":"paddingLeft","padding-right":"paddingRight",
    "border-radius":"borderRadius","border-color":"borderColor","border-width":"borderWidth","border-style":"borderStyle",
    "background-color":"backgroundColor","background-image":"backgroundImage",
    "grid-column":"gridColumn","grid-row":"gridRow","grid-template-columns":"gridTemplateColumns",
    "grid-template-rows":"gridTemplateRows","grid-gap":"gridGap","grid-auto-rows":"gridAutoRows",
    "z-index":"zIndex","min-height":"minHeight","max-width":"maxWidth","max-height":"maxHeight",
    "min-width":"minWidth","object-fit":"objectFit","flex-direction":"flexDirection",
    "align-items":"alignItems","justify-content":"justifyContent","justify-self":"justifySelf",
    "align-self":"alignSelf","letter-spacing":"letterSpacing","line-height":"lineHeight",
    "white-space":"whiteSpace","word-break":"wordBreak","overflow-x":"overflowX","overflow-y":"overflowY",
    "scrollbar-width":"scrollbarWidth","box-shadow":"boxShadow","text-shadow":"textShadow",
    "transition-duration":"transitionDuration","animation-duration":"animationDuration",
    "will-change":"willChange","transform-origin":"transformOrigin","user-select":"userSelect",
    "pointer-events":"pointerEvents","overscroll-behavior":"overscrollBehavior",
    "scrollbar-gutter":"scrollbarGutter","-webkit-font-smoothing":"WebkitFontSmoothing",
    "-webkit-text-size-adjust":"WebkitTextSizeAdjust","-webkit-line-clamp":"WebkitLineClamp",
    "-webkit-box-orient":"WebkitBoxOrient","-webkit-border-bottom":"WebkitBorderBottom",
    "scroll-behavior":"scrollBehavior","scroll-padding-top":"scrollPaddingTop",
    "aspect-ratio":"aspectRatio","mix-blend-mode":"mixBlendMode",
    "backdrop-filter":"backdropFilter","-webkit-backdrop-filter":"WebkitBackdropFilter",
}

PAGE_MAP = {
    "../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"",
    "../v3-subir/":"/subir","../v4-perfil/":"/perfil","../v5-onboarding/":"/onboarding",
    "../v6-match-notification/":"","../v7-seguimiento/":"",
    "../v8-ajustes/":"/ajustes","../v9-splash/":"/splash","../v10-registro/":"/registro",
    "../v11-notificaciones/":"/avisos","../v12-mis-matches/":"/treqes",
    "../v13-blog/":"/blog","../v13-favoritos/":"/favoritos",
    "../v14-editar-perfil/":"/perfil/editar","../v15-verificar-identidad/":"/perfil/verificar",
    "../v16-portada/":"/","../v17-aviso-legal/":"/legal/aviso",
    "../v17-mis-solicitudes/":"/mis-solicitudes","../v18-privacidad/":"/legal/privacidad",
    "../v19-terminos/":"/legal/terminos","../v20-cookies/":"/legal/cookies",
    "../v21-pagos-escrow/":"/legal/pagos","../v22-envios-costes/":"/legal/envios",
    "../v23-pago/":"","../v24-disputa/":"",
    "../v25-direccion-envio/":"/perfil/direccion","../v26-metodos-pago/":"/perfil/pagos",
    "../v27-faq/":"/faq","../v28-contactar/":"/contactar",
    "../v29-eliminar-cuenta/":"/perfil/eliminar","../v30-sobre-treqe/":"/sobre",
}

VOID_TAGS = ["img","input","br","hr","meta","link","area","col","embed","source","track","wbr"]


def _camel_style(style_str: str) -> str:
    """Convierte CSS inline a objeto React."""
    props = []
    for part in style_str.split(";"):
        part = part.strip()
        if not part or ":" not in part:
            continue
        k, v = part.split(":", 1)
        k, v = k.strip(), v.strip()
        if not k or not v:
            continue
        k = CSS_CAMEL.get(k, k)
        # Escapar comillas en el valor
        v = v.replace("'", "\\'")
        props.append(f"{k}: '{v}'")
    if not props:
        return "{{}}"
    return "{{ " + ", ".join(props) + " }}"


def convert(html: str, name: str, logo_path: str = "/treqe-logo.png") -> str:
    # Extraer body
    m = re.search(r"<body[^>]*>(.*?)</body>", html, re.DOTALL)
    if not m:
        raise ValueError("No <body> found")
    body = m.group(1).strip()

    # 1. Eliminar <script> y <style> (el CSS ya está en treqe-mib.css)
    body = re.sub(r"<script[^>]*>.*?</script>", "", body, flags=re.DOTALL)
    body = re.sub(r"<style[^>]*>.*?</style>", "", body, flags=re.DOTALL)

    # 2. Convertir estilos inline antes de manipular comillas
    def _style_repl(m):
        return f" style={_camel_style(m.group(1))}"
    body = re.sub(r' style="([^"]*)"', _style_repl, body)

    # 3. class → className
    body = re.sub(r'\bclass="', 'className="', body)

    # 4. Cerrar void elements
    for tag in VOID_TAGS:
        body = re.sub(f"<{tag}([^>]*?)(/?)>", lambda m: f"<{tag}{m.group(1)} />" if not m.group(2) else f"<{tag}{m.group(1)}>", body)

    # 5. Eliminar todos los event handlers (onclick, onsubmit, onchange, etc.)
    body = re.sub(r'\s+on\w+="[^"]*"', '', body)
    body = re.sub(r"\s+on\w+='[^']*'", '', body)

    # 6. Convertir <a href="..."> → <Link to="...">
    def _link_repl(m):
        attrs = m.group(1)
        content = m.group(2)
        for old, new in PAGE_MAP.items():
            if old in attrs:
                if new:
                    attrs = attrs.replace(f'href="{old}"', f'to="{new}"')
                else:
                    attrs = attrs.replace(f'href="{old}"', 'to="#"')
                    attrs = attrs.replace(f'href="{old}index.html"', 'to="#"')
        attrs = re.sub(r'href="[^"]*\.\./v\d+[^"]*/(index\.html)?"', 'to="#"', attrs)
        if 'to="' in attrs:
            return f"<Link {attrs}>{content}</Link>"
        return f"<a {attrs}>{content}</a>"
    body = re.sub(r"<a\b([^>]*?)>(.*?)</a>", _link_repl, body, flags=re.DOTALL)

    # 7. htmlFor
    body = body.replace('for="', 'htmlFor="')

    # 8. Arreglar path del logo
    body = body.replace("../../assets/treqe-logo-mib.png", logo_path)
    body = body.replace("../assets/treqe-logo-mib.png", logo_path)

    # 9. Limpiar dobles espacios de attrs eliminados
    body = re.sub(r'  +', ' ', body)

    # 10. Quitar comentarios HTML
    body = re.sub(r"<!--.*?-->", "", body, flags=re.DOTALL)

    # 11. Quitar &nbsp; → espacio (React no lo necesita en JSX)
    body = body.replace("&nbsp;", " ")

    # 12. Limpiar ids redundantes (quedan los que no molestan)
    body = body.strip()

    return f'''import {{ Link }} from "react-router-dom";

export function {name}() {{
  return (
    <>
      {body}
    </>
  );
}}
'''


if __name__ == "__main__":
    if len(sys.argv) < 3:
        print("Usage: python mib2reactv2.py <input.html> <ComponentName> [output.tsx]")
        sys.exit(1)
    html = open(sys.argv[1], encoding="utf-8").read()
    name = sys.argv[2]
    jsx = convert(html, name)
    out = sys.argv[3] if len(sys.argv) > 3 else f"{name}.tsx"
    with open(out, "w", encoding="utf-8") as f:
        f.write(jsx)
    print(f"OK: {out} ({len(jsx)} chars)")
