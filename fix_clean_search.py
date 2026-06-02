f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Remove the JS CSS injection
c = c.replace(
    'var st=document.createElement("style");st.textContent=".search-expand.open{z-index:10;position:absolute;background:var(--bg)}";document.head.appendChild(st);\n    ',
    ''
)

# Remove any remaining search-expand CSS from s.replace
c = c.replace(
    's = s.replace("</style>", ".item-card{display:flex;flex-direction:column;height:100%}.item-card__info{flex:1;background:var(--bg)}.search-expand{top:0!important;right:0!important;bottom:0!important;left:auto!important}.header-right{position:relative}</style>");',
    's = s.replace("</style>", ".item-card{display:flex;flex-direction:column;height:100%}.item-card__info{flex:1;background:var(--bg)}</style>");'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("All custom search CSS removed")
