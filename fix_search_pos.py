f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()
old = 'const style = document.createElement("style");'
new = 'if (!html) return;\n    const expand = document.getElementById("searchExpand");\n    if (expand) { expand.style.cssText = "position:fixed;top:24px;right:16px;height:38px;display:none;align-items:center;background:var(--bg);border:1px solid var(--border);z-index:9999;padding:0 8px"; }\n    let tries = 0;'
c = c.replace(old, new)
open(f, 'w', encoding='utf-8', newline='').write(c)
print("Inline style")
