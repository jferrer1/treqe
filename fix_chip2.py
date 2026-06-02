f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Replace chip placement: put inside catalog grid
c = c.replace(
    'if (sectionTitle) { sectionTitle.after(container); const grid = document.querySelector(".catalog"); if (grid) { const gridStyle = window.getComputedStyle(grid); const gridLeft = grid.getBoundingClientRect().left + parseFloat(gridStyle.paddingLeft || "0"); container.style.paddingLeft = gridLeft + "px"; } }',
    'const grid = document.querySelector(".catalog"); if (grid) { container.style.gridColumn = "1 / -1"; container.style.width = "100%25"; container.style.marginBottom = "8px"; grid.prepend(container); } else if (sectionTitle) { sectionTitle.after(container); }'
)
c = c.replace(
    'if (tb) { tb.after(container); const grid2 = document.querySelector(".catalog"); if (grid2) { const gs2 = window.getComputedStyle(grid2); const gridLeft2 = grid2.getBoundingClientRect().left + parseFloat(gs2.paddingLeft || "0"); container.style.paddingLeft = gridLeft2 + "px"; } }',
    'const grid2 = document.querySelector(".catalog"); if (grid2) { container.style.gridColumn = "1 / -1"; container.style.width = "100%25"; container.style.marginBottom = "8px"; grid2.prepend(container); } else if (tb) { tb.after(container); }'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Chip inside grid")
