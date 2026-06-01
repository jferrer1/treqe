f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\app\router.tsx'
c = open(f, 'r', encoding='utf-8').read()

# Add completed set
c = c.replace(
    'function HubPage() {\n  const pages = [',
    'function HubPage() {\n  const completed = new Set(["v1","v2","v3","v4","v10r","v10l","v12"]);\n  const pages = ['
)

# Checkmark on completed
c = c.replace(
    '<span style={{fontFamily:"\'IBM Plex Mono\',monospace",fontSize:"0.6rem",color:"#8A8580",minWidth:28}}>{p.v}</span>',
    '<span style={{fontFamily:"\'IBM Plex Mono\',monospace",fontSize:"0.6rem",color:"#8A8580",minWidth:28}}>{p.v}{completed.has(p.v) ? " ✅" : ""}</span>'
)

# Change Detalle route from /articulo/demo to real product  
c = c.replace(
    '{v:"v2",n:"Detalle",p:"/articulo/demo"}',
    '{v:"v2",n:"Detalle",p:"/articulo/347edc40-6372-443f-a2dd-ba22fc7f85b4"}'
)

open(f, 'w', encoding='utf-8').write(c)
print("Fixed")
