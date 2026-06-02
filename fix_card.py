f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
old = 'setHtml(s + b);'
new = 'b = b.replace("</style>", ".item-card{display:flex;flex-direction:column}.item-card__info{flex:1}</style>");\n      setHtml(s + b);'
c = c.replace(old, new)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("Card flex fix added")
