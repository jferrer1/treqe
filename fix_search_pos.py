f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
# Find and replace the entire style.textContent
c = c.replace(
    "style.textContent = `.search-expand{position:fixed!important;top:0!important;left:0!important;right:0!important;bottom:0!important;height:auto!important;display:none!important;align-items:center;background:var(--bg);border:1px solid var(--border);z-index:9999;padding:0 8px}.search-expand.open{display:flex!important}.search-expand input{border:none;font-family:inherit;font-size:.8rem;width:160px;background:transparent}`",
    "style.textContent = `.search-expand{position:fixed!important;top:5px!important;right:16px!important;height:44px!important;display:none!important;align-items:center;background:var(--bg);border:1px solid var(--border);z-index:9999;padding:0 8px}.search-expand.open{display:flex!important}.search-expand input{border:none;font-family:inherit;font-size:.8rem;width:160px;background:transparent}`"
)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("Fixed at 5px/44px")
