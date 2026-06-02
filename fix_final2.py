f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
# Remove !important from card CSS
c = c.replace(
    '.item-card{display:flex!important;flex-direction:column!important;height:100%!important}.item-card__info{flex:1!important;background:var(--bg)!important}',
    '.item-card{display:flex;flex-direction:column;height:100%}.item-card__info{flex:1;background:var(--bg)}'
)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("!important removed from card CSS")
