f2 = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c2 = open(f2, 'r', encoding='utf-8', newline='').read()

# Add search handler at the start of the event handler  
c2 = c2.replace(
    'const target = e.target as HTMLElement;\n      // Sort dropdown toggle',
    'const target = e.target as HTMLElement;\n      if (target.closest("#searchIcon")) { e.stopPropagation(); document.getElementById("searchExpand")?.classList.toggle("open"); return; }\n      if ((target as HTMLElement).id === "searchInput") { const v = (target as HTMLInputElement).value.toLowerCase().trim(); document.querySelectorAll(".item-card").forEach((c: any) => { c.style.display = !v || (c.querySelector(".item-card__title")?.textContent||"").toLowerCase().includes(v) ? "" : "none"; }); return; }\n      // Sort dropdown toggle'
)

# Fix logo 
c2 = c2.replace(
    '<span class="treqe-header__logo">',
    '<a href="/" style="text-decoration:none;color:inherit"><span class="treqe-header__logo">'
)
c2 = c2.replace(
    '</span> ... this is wrong',
    '</span></a>'
)
# The above is wrong. Let me use a different approach:
# Restore and use a single replace
c2 = open(f2, 'r', encoding='utf-8', newline='').read()
c2 = c2.replace(
    '<span class="treqe-header__logo">treqe</span>',
    '<a href="/" style="text-decoration:none;color:inherit"><span class="treqe-header__logo">treqe</span></a>'
)

open(f2, 'w', encoding='utf-8', newline='').write(c2)
print("Search + logo added")
