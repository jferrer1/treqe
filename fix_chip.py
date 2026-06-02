f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8').read()
c = c.replace('padding:0 24px 8px', 'padding:8px 0 4px')
c = c.replace('sectionTitle.after(container)', 'sectionTitle.appendChild(container)')
open(f, 'w', encoding='utf-8').write(c)
print("Chips now inside toolbar")
