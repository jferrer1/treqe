f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Fix 1: Add v16-portada to route map
c = c.replace(
    '"../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo",',
    '"../v16-portada/":"/","../v1-catalogo/":"/catalogo","../v2-detalle/":"/articulo/demo",'
)

# Fix 2: Fix search position — make expand inline with header instead of above
# Change search-expand CSS
c = c.replace(
    'b = b.replace(/href="[^"]*blog[^"]*"/g, \'href="/blog"\');',
    'b = b.replace(/href="[^"]*blog[^"]*"/g, \'href="/blog"\');\n      b = b.replace("</style>", ".search-expand{position:absolute;top:100%;right:0;width:200px}.search-expand.open{display:flex}</style>");'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Logo + search position fixed")
