f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8').read()
# Go back to simple after() with no br, but add clear:both + display:block to container
c = c.replace(
    "const br = document.createElement(\"br\"); sectionTitle.after(br); br.after(container);",
    "sectionTitle.after(container);"
)
# Remove the second br replacement too
c = c.replace(
    "const br2 = document.createElement(\"br\"); tb.after(br2); br2.after(container);",
    "tb.after(container);"
)
# Fix container style to be block
c = c.replace(
    'container.style.cssText = "display:block;padding:8px 0 4px',
    'container.style.cssText = "display:block;width:100%25;padding:8px 0 4px'
)
open(f, 'w', encoding='utf-8').write(c)
print("Block container")
