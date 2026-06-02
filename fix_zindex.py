f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
c = c.replace(
    'if (!html) return;\n    let tries = 0;',
    'if (!html) return;\n    var st=document.createElement("style");st.textContent=".search-expand.open{z-index:10;position:absolute;background:var(--bg)}";document.head.appendChild(st);\n    let tries = 0;'
)
open(f, 'w', encoding='utf-8', newline='').write(c)
print('OK')
