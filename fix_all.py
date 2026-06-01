f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\app\router.tsx'
c = open(f, 'r', encoding='utf-8').read()

# Add NotificationsPage import
c = c.replace(
    'import { MatchesPage } from "@/pages/matches/MatchesPage";',
    'import { MatchesPage } from "@/pages/matches/MatchesPage";\nimport { NotificationsPage } from "@/pages/notifications/NotificationsPage";'
)

# Update completed set + notes
c = c.replace(
    'const completed = new Set(["v1","v2","v3","v4","v10r","v10l","v12"]);',
    'const completed = new Set(["v1","v2","v3","v4","v10r","v10l","v11","v12"]);'
)
c = c.replace(
    'const notes: Record<string,string> = {\n    "v2": "Pendiente: modal trueque (seleccionar producto), wish/trade persistir a API, miniaturas responsive",\n    "v3": "Pendiente: subida de imágenes real (ahora placeholder), validación de categorías",\n    "v4": "Pendiente: datos reales cuando API conectada, editar perfil funcional",\n    "v12": "Pendiente: matches reales (API ofertas→matches), timers, chat entre usuarios",\n    "v11": "Pendiente: notificaciones reales WebSocket",\n    "v13f": "Pendiente: favoritos persistidos a API",\n  };',
    'const notes: Record<string,string> = {\n    "v2": "Pendiente: modal trueque (seleccionar producto), wish/trade persistir a API, miniaturas responsive",\n    "v3": "Pendiente: subida de imagenes real (ahora placeholder), validacion de categorias",\n    "v4": "Pendiente: datos reales cuando API conectada, editar perfil funcional",\n    "v11": "Pendiente: notificaciones reales WebSocket",\n    "v12": "Pendiente: matches reales (API ofertas->matches), timers, chat entre usuarios",\n    "v13f": "Pendiente: favoritos persistidos a API",\n  };'
)

# Change Detalle link to real product
c = c.replace(
    '{v:"v2",n:"Detalle",p:"/articulo/demo"}',
    '{v:"v2",n:"Detalle",p:"/articulo/347edc40-6372-443f-a2dd-ba22fc7f85b4"}'
)

# Add checkmark on completed
c = c.replace(
    '<span style={{fontFamily:"\'IBM Plex Mono\',monospace",fontSize:"0.6rem",color:"#8A8580",minWidth:28}}>{p.v}</span>',
    '<span style={{fontFamily:"\'IBM Plex Mono\',monospace",fontSize:"0.6rem",color:"#8A8580",minWidth:28}}>{p.v}{completed.has(p.v) ? " ✅" : ""}</span>'
)

# Add notes display
c = c.replace(
    '<span>{p.n}</span></Link>',
    '<span>{p.n}</span>{notes[p.v] ? <span style={{fontSize:"0.6rem",color:"#A09A94",marginLeft:8}}>{notes[p.v]}</span> : null}</Link>'
)

# Update route for avisos
c = c.replace(
    '{ path: "/avisos", element: <MibPage page="v11-notificaciones" /> },',
    '{ path: "/avisos", element: <NotificationsPage /> },'
)

open(f, 'w', encoding='utf-8').write(c)
print("All fixes applied")
