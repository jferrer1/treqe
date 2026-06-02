f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
# Fix: add grid's padding-left to the left position
c = c.replace(
    'if (grid) { const gridLeft = grid.getBoundingClientRect().left; container.style.paddingLeft = gridLeft + "px"; }',
    'if (grid) { const gridStyle = window.getComputedStyle(grid); const gridLeft = grid.getBoundingClientRect().left + parseFloat(gridStyle.paddingLeft || "0"); container.style.paddingLeft = gridLeft + "px"; }'
)
c = c.replace(
    'if (grid2) { const gridLeft2 = grid2.getBoundingClientRect().left; container.style.paddingLeft = gridLeft2 + "px"; }',
    'if (grid2) { const gs2 = window.getComputedStyle(grid2); const gridLeft2 = grid2.getBoundingClientRect().left + parseFloat(gs2.paddingLeft || "0"); container.style.paddingLeft = gridLeft2 + "px"; }'
)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("Added padding-left")
