f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# 1. Remove white background from info
c = c.replace(
    'background:var(--surface)!important',
    'background:var(--bg)!important'
)

# 2. Make logo a link to "/"
c = c.replace(
    "class=\"treqe-header__logo\"",
    "class=\"treqe-header__logo\" onclick=\"window.location.href='/'\" style=\"cursor:pointer\""
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Fixed bg + logo link")
