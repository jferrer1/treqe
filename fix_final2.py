f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Remove the broken CSS injection for search-expand
c = c.replace(
    'b = b.replace("</style>", ".search-expand{position:absolute;top:100%;right:0;width:200px}.search-expand.open{display:flex}</style>");',
    ''
)

# Fix search: use MIB original styles, add input event
# Replace the search handler to use input event delegation
c = c.replace(
    'if (target.closest("#searchIcon") || target.closest("#searchIcon *")) { e.stopPropagation(); document.getElementById("searchExpand")?.classList.toggle("open"); return; }\n      // Search input\n      if (target.closest("#searchInput")) { const v = (document.getElementById("searchInput") as HTMLInputElement).value.toLowerCase().trim(); document.querySelectorAll(".item-card").forEach((c: any) => { const t = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase(); c.style.display = !v || t.includes(v) ? "" : "none"; }); return; }',
    'if (target.closest("#searchIcon") || target.closest("#searchIcon *")) { e.stopPropagation(); const exp = document.getElementById("searchExpand"); if (exp) { exp.classList.toggle("open"); if (exp.classList.contains("open")) { setTimeout(() => (document.getElementById("searchInput") as HTMLInputElement)?.focus(), 100); } } return; }'
)

# Add dedicated input listener
c = c.replace(
    'document.addEventListener("click", handler);\n    return () => document.removeEventListener("click", handler);',
    'document.addEventListener("click", handler);\n    // Search input filtering\n    const searchInput = document.getElementById("searchInput") as HTMLInputElement;\n    const onInput = () => {\n      const v = searchInput?.value?.toLowerCase()?.trim() || "";\n      document.querySelectorAll(".item-card").forEach((c: any) => {\n        const t = (c.querySelector(".item-card__title")?.textContent || "").toLowerCase();\n        c.style.display = !v || t.includes(v) ? "" : "none";\n      });\n    };\n    searchInput?.addEventListener("input", onInput);\n    return () => { document.removeEventListener("click", handler); searchInput?.removeEventListener("input", onInput); };'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Search fixed - MIB native styles + input event")
