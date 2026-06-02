f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
c = c.replace(
    's += ".item-card{display:flex!important;flex-direction:column!important;height:100%!important}.item-card__info{flex:1!important;background:var(--surface)!important}";',
    's = s.replace("</style>", ".item-card{display:flex!important;flex-direction:column!important;height:100%!important}.item-card__info{flex:1!important;background:var(--surface)!important}</style>");'
)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("CSS inside style tag")
