f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Put chip after toolbar, aligned to grid's content edge
c = c.replace(
    'const grid = document.querySelector(".catalog"); if (grid) { container.style.gridColumn = "1 / -1"; container.style.width = "100%"; container.style.marginBottom = "8px"; grid.prepend(container); } else if (sectionTitle) { sectionTitle.after(container); }',
    'if (sectionTitle) { sectionTitle.after(container); const grid = document.querySelector(".catalog"); if (grid) { const gs = window.getComputedStyle(grid); container.style.paddingLeft = (grid.getBoundingClientRect().left + parseFloat(gs.paddingLeft || "0")) + "px"; } }'
)
c = c.replace(
    'const grid2 = document.querySelector(".catalog"); if (grid2) { container.style.gridColumn = "1 / -1"; container.style.width = "100%"; container.style.marginBottom = "8px"; grid2.prepend(container); } else if (tb) { tb.after(container); }',
    'if (tb) { tb.after(container); const grid2 = document.querySelector(".catalog"); if (grid2) { const gs2 = window.getComputedStyle(grid2); container.style.paddingLeft = (grid2.getBoundingClientRect().left + parseFloat(gs2.paddingLeft || "0")) + "px"; } }'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Chip between toolbar and section-title, aligned to grid")
