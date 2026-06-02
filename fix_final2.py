f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Fix 1: logo — wrap treqe span in link
c = c.replace(
    '<span class="treqe-header__logo">treqe</span>',
    '<a href="/" style="text-decoration:none;color:inherit"><span class="treqe-header__logo">treqe</span></a>'
)

# Fix 2: search — add toggle handler BEFORE the existing sort handler
c = c.replace(
    'const sortBtn = target.closest(".sort-wrapper .tool-btn");',
    '// Search toggle\n      if (target.closest("#searchIcon") || target.closest("#searchIcon *")) { e.stopPropagation(); document.getElementById("searchExpand")?.classList.toggle("open"); return; }\n      // Search input\n      if (target.closest("#searchInput")) { const v = (document.getElementById("searchInput") as HTMLInputElement).value.toLowerCase().trim(); document.querySelectorAll(".item-card").forEach((c: any) => { const t = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase(); c.style.display = !v || t.includes(v) ? "" : "none"; }); return; }\n      const sortBtn = target.closest(".sort-wrapper .tool-btn");'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Logo + search fixed")
