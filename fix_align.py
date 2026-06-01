f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
# Place chips after section-title for alignment
c = c.replace('tb.after(container);', 'const sectionTitle = document.querySelector(".section-title");\n      if (sectionTitle) sectionTitle.after(container);\n      else tb.after(container);')
open(f, 'w', encoding='utf-8', newline='').write(c)
print("Aligned")
