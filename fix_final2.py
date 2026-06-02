f = r'C:\Users\Shadow\.openclaw\workspace\projects\active\treqe\src\apps\web\src\pages\catalog\CatalogPage.tsx'
c = open(f, 'r', encoding='utf-8', newline='').read()

# Add import for search
c = c.replace(
    'import { api } from "@/lib/api";',
    'import { api } from "@/lib/api";\nimport "@/lib/search";'
)

# Add search onclick and oninput AFTER the global strip, where filter onclick is added
c = c.replace(
    'b = b.replace(/class="tool-btn"/,',
    '// Add search handlers\n      b = b.replace(\'class="search-icon" id="searchIcon"\', \'class="search-icon" id="searchIcon" onclick="var e=document.getElementById(\\'searchExpand\\');e.classList.toggle(\\'open\\');if(e.classList.contains(\\'open\\')){document.getElementById(\\'searchInput\\').focus()};event.stopPropagation()"\');\n      b = b.replace(\'id="searchInput"\', \'id="searchInput" oninput="window.treqeSearch(this.value)"\');\n      b = b.replace(/class="tool-btn"/,'
)

open(f, 'w', encoding='utf-8', newline='').write(c)
print("Search via window.treqeSearch")
