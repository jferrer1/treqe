f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Add search at top of event handler
c = c.replace(
    'const target = e.target as HTMLElement;\n      // Sort dropdown toggle',
    'const target = e.target as HTMLElement;\n      // Search\n      if (target.closest("#searchIcon")) { e.stopPropagation(); document.getElementById("searchExpand")?.classList.toggle("open"); return; }\n      if ((target as HTMLElement).id === "searchInput") { const v = (target as HTMLInputElement).value.toLowerCase().trim(); document.querySelectorAll(".item-card").forEach((c: any) => { c.style.display = !v || (c.querySelector(".item-card__title")?.textContent||"").toLowerCase().includes(v) ? "" : "none"; }); return; }\n      // Sort dropdown toggle'
)

# Fix blog link — add blogindex to mibLinks or add onclick
c = c.replace(
    '../v13-blog/',
    '../blogindex.html'
)
# Actually let me just add /blogindex to the route map. 
# Better: just add data-nav for blog
c = c.replace(
    '".blog-link"',
    ''
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Search wired")
