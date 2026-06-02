f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
# Add proper search-expand CSS inside the style tag
c = c.replace(
    's = s.replace("</style>"',
    's = s.replace("</style>", ".search-expand{top:0!important;bottom:0!important}</style>"'
)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("Search CSS injected")
