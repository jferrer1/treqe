f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Replace chip placement: use grid's left position
c = c.replace(
    'if (sectionTitle) { sectionTitle.after(container); container.style.paddingLeft = (sectionTitle as HTMLElement).offsetLeft + "px"; }',
    'if (sectionTitle) { sectionTitle.after(container); const grid = document.querySelector(".catalog"); if (grid) { const gridLeft = grid.getBoundingClientRect().left; container.style.paddingLeft = gridLeft + "px"; } }'
)
c = c.replace(
    'if (tb) { tb.after(container); container.style.paddingLeft = (tb as HTMLElement).offsetLeft + "px"; }',
    'if (tb) { tb.after(container); const grid2 = document.querySelector(".catalog"); if (grid2) { const gridLeft2 = grid2.getBoundingClientRect().left; container.style.paddingLeft = gridLeft2 + "px"; } }'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Chip aligns to grid")
