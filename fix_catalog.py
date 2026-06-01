f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Add 'import { rewriteMibLinks }' back — it was in the original but got lost in restore
if 'rewriteMibLinks' not in c:
    c = c.replace('import { api } from "@/lib/api";',
                  'import { api } from "@/lib/api";\nimport { rewriteMibLinks } from "@/lib/mibLinks";')

# Wire sort
c = c.replace(
    'sortOption.classList.add("active");\r\n        document.getElementById("sortDropdown")!.style.display = "none";\r\n        return;\r\n      }',
    'sortOption.classList.add("active");\r\n        const sb = (sortOption as HTMLElement).dataset.sort;\r\n        if (sb) doSort(sb);\r\n        document.getElementById("sortDropdown")!.style.display = "none";\r\n        return;\r\n      }'
)

# Wire filter Apply button
c = c.replace(
    'if (!target.closest(".sort-wrapper")) {\r\n        const dd = document.getElementById("sortDropdown");\r\n        if (dd) dd.style.display = "none";\r\n      }',
    'if (text2.includes("plicar") || text2.includes("Aplicar")) {\r\n        e.stopPropagation();\r\n        doFilter();\r\n        return;\r\n      }\r\n      if (!target.closest(".sort-wrapper")) {\r\n        const dd = document.getElementById("sortDropdown");\r\n        if (dd) dd.style.display = "none";\r\n      }'
)

# Add the handler for buttons above "if (!target.closest" — need to capture button text
c = c.replace(
    'const text2 = target.textContent || "";\r\n      if (text2.includes("plicar") || text2.includes("Aplicar")) {\r\n        e.stopPropagation();\r\n        doFilter();\r\n        return;\r\n      }',
    'const btn = target.closest("button");\r\n      if (btn) {\r\n        const text2 = (btn as HTMLElement).textContent || "";\r\n        if (text2.includes("plicar") || text2.includes("Aplicar")) {\r\n          e.stopPropagation();\r\n          doFilter();\r\n          return;\r\n        }\r\n      }'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Wire done")
