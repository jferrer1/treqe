f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Add chip div inside toolbar HTML
c = c.replace(
    '<div class="toolbar">',
    '<div class="toolbar" style="flex-wrap:wrap"><div id="active-filters" style="display:none;flex-basis:100%;display:none;gap:6px;padding:4px 0"></div>'
)

# Update applyFilterDOM to use the pre-existing div
old_show = 'const container = document.createElement("div");'
new_show = 'let container = document.getElementById("active-filters");\n      if (!container) { container = document.createElement("div"); }\n      container.innerHTML = "";\n      container.style.display = activeFilters.length > 0 ? "flex" : "none";'

c = c.replace(old_show, new_show)

# Remove the old container creation line
c = c.replace('container.id = "active-filters";\n      ', '')

# Replace the container insertion logic  
c = c.replace(
    'if (sectionTitle) { sectionTitle.after(container); container.style.paddingLeft = (sectionTitle as HTMLElement).offsetLeft + "px"; }',
    '// container already in HTML'
)
c = c.replace(
    'if (tb) { tb.after(container); container.style.paddingLeft = (tb as HTMLElement).offsetLeft + "px"; }',
    '// container already in HTML'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Chip in toolbar HTML")
